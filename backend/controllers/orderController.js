import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification, notifyAdmins } from '../utils/notifications.js';
import Stripe from 'stripe';

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
  }

  const settings = await getSettings();
  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const taxPrice = (itemsPrice * settings.taxRate) / 100;
  let couponDiscount = 0;
  let couponCode = '';

  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon && coupon.expiresAt > new Date()) {
      couponDiscount = coupon.discountType === 'percentage'
        ? (itemsPrice * coupon.discountValue) / 100
        : coupon.discountValue;
      if (coupon.maxDiscount > 0) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      couponCode = coupon.code;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0] || '',
    price: item.price,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    couponDiscount,
    couponCode,
    totalPrice: itemsPrice + shippingPrice + taxPrice - couponDiscount,
    isPaid: req.body.paymentMethod === 'cod' ? false : req.body.isPaid || false,
    paidAt: req.body.isPaid ? Date.now() : null,
    notes: req.body.notes || '',
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, salesCount: item.quantity },
    });
  }

  cart.items = [];
  cart.couponCode = '';
  await cart.save();

  await createNotification({
    userId: req.user._id,
    type: 'order',
    title: 'Order Placed',
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    link: `/dashboard/orders/${order._id}`,
  });

  await notifyAdmins(User, {
    type: 'order',
    title: 'New Order',
    message: `New order ${order.orderNumber} received.`,
    link: `/admin/orders/${order._id}`,
  });

  res.status(201).json({ success: true, order, message: 'Order placed successfully' });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json({ success: true, order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.keyword) {
    filter.$or = [
      { orderNumber: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ success: true, orders, page, pages: Math.ceil(total / limit), total });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', '_id');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.body.status) order.status = req.body.status;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.trackingStatus) order.trackingStatus = req.body.trackingStatus;

  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  if (req.body.status === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, salesCount: -item.quantity },
      });
    }
  }

  await order.save();

  await createNotification({
    userId: order.user._id,
    type: 'order',
    title: 'Order Updated',
    message: `Your order ${order.orderNumber} status is now ${order.status}.`,
    link: `/dashboard/orders/${order._id}`,
  });

  res.json({ success: true, order, message: 'Order updated' });
});

export const createStripeIntent = asyncHandler(async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(400);
    throw new Error('Stripe is not configured');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  const settings = await getSettings();

  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const taxPrice = (itemsPrice * settings.taxRate) / 100;
  const total = Math.round((itemsPrice + shippingPrice + taxPrice) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
    metadata: { userId: req.user._id.toString() },
  });

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

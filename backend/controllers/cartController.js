import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Settings from '../models/Settings.js';
import asyncHandler from '../utils/asyncHandler.js';

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

const calculateShipping = (subtotal, settings) =>
  subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;

const calculateTax = (subtotal, settings) => (subtotal * settings.taxRate) / 100;

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const settings = await getSettings();
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, settings);
  const tax = calculateTax(subtotal, settings);
  let discount = 0;

  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon && coupon.expiresAt > new Date() && subtotal >= coupon.minOrderAmount) {
      discount = coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  res.json({
    success: true,
    cart,
    summary: {
      subtotal,
      shipping,
      tax,
      discount,
      total: subtotal + shipping + tax - discount,
    },
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((item) => item.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
    if (existing.quantity > product.stock) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, cart, message: 'Added to cart' });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const product = await Product.findById(item.product);
  if (req.body.quantity > product.stock) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  item.quantity = req.body.quantity;
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, cart: populated });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items.pull(req.params.itemId);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, cart: populated, message: 'Item removed' });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.couponCode = '';
    await cart.save();
  }
  res.json({ success: true, message: 'Cart cleared' });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }
  if (coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Coupon has expired');
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (subtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is $${coupon.minOrderAmount}`);
  }

  cart.couponCode = coupon.code;
  await cart.save();
  res.json({ success: true, cart, coupon, message: 'Coupon applied' });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.couponCode = '';
    await cart.save();
  }
  res.json({ success: true, message: 'Coupon removed' });
});

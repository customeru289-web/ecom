import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalCustomers, totalProducts, revenueData, recentOrders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalSales: totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    },
    monthlyRevenue,
    ordersByStatus,
    recentOrders,
  });
});

export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({ isActive: true })
    .sort({ salesCount: -1 })
    .limit(10)
    .select('name salesCount price images');

  const categorySales = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $lookup: {
        from: 'categories',
        localField: 'product.category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category.name',
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        sold: { $sum: '$orderItems.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  res.json({ success: true, topProducts, categorySales });
});

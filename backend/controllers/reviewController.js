import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const numReviews = reviews.length;
  const rating = numReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(rating * 10) / 10,
    numReviews,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    status: { $in: ['delivered', 'shipped'] },
  });

  if (!hasPurchased) {
    res.status(400);
    throw new Error('You can only review products you have purchased');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    name: req.user.name,
    rating,
    comment,
    isApproved: false,
  });

  res.status(201).json({ success: true, review, message: 'Review submitted for approval' });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status === 'pending') filter.isApproved = false;
  if (req.query.status === 'approved') filter.isApproved = true;

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ success: true, reviews, page, pages: Math.ceil(total / limit), total });
});

export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.isApproved = true;
  await review.save();
  await updateProductRatings(review.product);

  res.json({ success: true, review, message: 'Review approved' });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRatings(productId);

  res.json({ success: true, message: 'Review deleted' });
});

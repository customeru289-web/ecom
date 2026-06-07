import Coupon from '../models/Coupon.js';
import asyncHandler from '../utils/asyncHandler.js';

export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon');
  }
  if (coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Coupon expired');
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon limit reached');
  }

  res.json({ success: true, coupon });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon, message: 'Coupon created' });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json({ success: true, coupon, message: 'Coupon updated' });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
});

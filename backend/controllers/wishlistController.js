import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' },
  });
  res.json({ success: true, wishlist: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (user.wishlist.includes(productId)) {
    res.status(400);
    throw new Error('Product already in wishlist');
  }

  user.wishlist.push(productId);
  await user.save();
  await user.populate({ path: 'wishlist', populate: { path: 'category', select: 'name slug' } });

  res.json({ success: true, wishlist: user.wishlist, message: 'Added to wishlist' });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist.pull(req.params.productId);
  await user.save();
  await user.populate({ path: 'wishlist', populate: { path: 'category', select: 'name slug' } });

  res.json({ success: true, wishlist: user.wishlist, message: 'Removed from wishlist' });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ success: true, inWishlist: index === -1, message: index > -1 ? 'Removed' : 'Added' });
});

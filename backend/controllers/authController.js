import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { generateResetToken, sendResetPasswordEmail } from '../utils/sendEmail.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res, 'Registration successful');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account has been deactivated');
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.avatar) user.avatar = req.body.avatar;

  const updated = await user.save();
  res.json({ success: true, user: updated, message: 'Profile updated' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }

  const { resetToken, resetPasswordToken, resetPasswordExpire } = generateResetToken();
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save({ validateBeforeSave: false });

  await sendResetPasswordEmail(user, resetToken);

  res.json({ success: true, message: 'Password reset email sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false; });
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  Object.assign(address, req.body);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false; });
    address.isDefault = true;
  }
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.keyword) {
    filter.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { email: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    success: true,
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.isActive = req.body.isActive ?? user.isActive;
  user.role = req.body.role || user.role;
  await user.save();
  res.json({ success: true, user, message: 'User updated' });
});

import Settings from '../models/Settings.js';
import Banner from '../models/Banner.js';
import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});

  Object.assign(settings, req.body);
  if (req.file) settings.logo = `/uploads/${req.file.filename}`;

  await settings.save();
  res.json({ success: true, settings, message: 'Settings updated' });
});

export const getBanners = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isActive: true };
  const banners = await Banner.find(filter).sort({ order: 1 });
  res.json({ success: true, banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const banner = await Banner.create(data);
  res.status(201).json({ success: true, banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  res.json({ success: true, banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted' });
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isActive: true };
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = `/uploads/${req.file.filename}`;
  const testimonial = await Testimonial.create(data);
  res.status(201).json({ success: true, testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.avatar = `/uploads/${req.file.filename}`;
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  res.json({ success: true, testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  await testimonial.deleteOne();
  res.json({ success: true, message: 'Testimonial deleted' });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Successfully subscribed to newsletter' });
});

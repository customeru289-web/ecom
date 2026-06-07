import express from 'express';
import {
  getSettings, updateSettings, getBanners, createBanner, updateBanner, deleteBanner,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  subscribeNewsletter,
} from '../controllers/contentController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/settings', getSettings);
router.put('/settings', protect, admin, uploadSingle, updateSettings);

router.get('/banners', optionalAuth, getBanners);
router.post('/banners', protect, admin, uploadSingle, createBanner);
router.put('/banners/:id', protect, admin, uploadSingle, updateBanner);
router.delete('/banners/:id', protect, admin, deleteBanner);

router.get('/testimonials', optionalAuth, getTestimonials);
router.post('/testimonials', protect, admin, uploadSingle, createTestimonial);
router.put('/testimonials/:id', protect, admin, uploadSingle, updateTestimonial);
router.delete('/testimonials/:id', protect, admin, deleteTestimonial);

router.post('/newsletter', subscribeNewsletter);

export default router;

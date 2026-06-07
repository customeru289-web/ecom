import express from 'express';
import {
  createReview, getProductReviews, getAllReviews, approveReview, deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.get('/admin/all', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, approveReview);
router.delete('/:id', protect, admin, deleteReview);

export default router;

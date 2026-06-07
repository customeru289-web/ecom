import express from 'express';
import {
  createOrder, getMyOrders, getOrderById, getAllOrders,
  updateOrderStatus, createStripeIntent, getUserOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/stripe/intent', protect, createStripeIntent);
router.get('/my', protect, getMyOrders);
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/user/:userId', protect, admin, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, admin, updateOrderStatus);

export default router;

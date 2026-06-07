import express from 'express';
import {
  getCart, addToCart, updateCartItem, removeCartItem,
  clearCart, applyCoupon, removeCoupon,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);

export default router;

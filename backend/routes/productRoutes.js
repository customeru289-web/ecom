import express from 'express';
import {
  getProducts, getProductById, getFeaturedProducts, getNewArrivals,
  getBestSellers, getRelatedProducts, createProduct, updateProduct,
  deleteProduct, getAdminProducts, getStockAlerts, removeProductImage,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/admin/all', protect, admin, getAdminProducts);
router.get('/admin/stock-alerts', protect, admin, getStockAlerts);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);

router.post('/', protect, admin, uploadMultiple, createProduct);
router.put('/:id', protect, admin, uploadMultiple, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.delete('/:id/image', protect, admin, removeProductImage);

export default router;

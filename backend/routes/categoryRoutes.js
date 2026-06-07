import express from 'express';
import {
  getCategories, getAllCategories, getCategoryById,
  createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/admin/all', protect, admin, getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, admin, uploadSingle, createCategory);
router.put('/:id', protect, admin, uploadSingle, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;

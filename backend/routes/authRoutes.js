import express from 'express';
import { body } from 'express-validator';
import {
  register, login, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword, addAddress, updateAddress, deleteAddress,
  getAllUsers, getUserById, updateUserStatus,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
], forgotPassword);

router.put('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
], resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUserStatus);

export default router;

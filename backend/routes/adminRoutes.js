import express from 'express';
import { getDashboardStats, getSalesAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getSalesAnalytics);

export default router;

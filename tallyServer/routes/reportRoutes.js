import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getSalesChartData,
  getProfitAndLoss, // --- IMPORT NEW FUNCTION ---
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route: /api/reports

// Sabhi routes protected hain
router.route('/dashboard').get(protect, getDashboardStats);
router.route('/sales-chart').get(protect, getSalesChartData);
router.route('/profit-loss').get(protect, getProfitAndLoss); // --- ADD NEW ROUTE ---

export default router;
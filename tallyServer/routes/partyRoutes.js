import express from 'express';
const router = express.Router();
import {
  getParties,
  createParty,
  updateParty,
} from '../controllers/partyController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route: /api/parties
router.route('/').get(protect, getParties).post(protect, createParty);
router.route('/:id').put(protect, updateParty);

export default router;
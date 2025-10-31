import express from 'express';
const router = express.Router();
import {
  getItems,
  createItem,
  updateItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js'; // Hamara "Guard"

// Route: /api/items

// /api/items par GET request 'getItems' ko call karegi
// /api/items par POST request 'createItem' ko call karegi
// Dono routes 'protect' middleware se guarded hain
router.route('/').get(protect, getItems).post(protect, createItem);

// /api/items/:id par PUT request 'updateItem' ko call karegi
router.route('/:id').put(protect, updateItem);

export default router;
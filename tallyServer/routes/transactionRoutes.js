import express from 'express';
const router = express.Router();
import {
  createTransaction,
  getTransactions,
  getTransactionById,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route: /api/transactions

// Sabhi routes protected hain
router.route('/')
  .post(protect, createTransaction) // Naya transaction banane ke liye
  .get(protect, getTransactions);  // Saare transactions fetch karne ke liye (Day Book)

router.route('/:id')
  .get(protect, getTransactionById); // Ek transaction ki details ke liye (Invoice)

export default router;
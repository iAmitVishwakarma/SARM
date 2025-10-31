import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile, // --- IMPORT ---
} from '../controllers/userController.js';

// Route: /api/auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- UPDATED ROUTE ---
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // --- ADDED PUT METHOD ---

export default router;
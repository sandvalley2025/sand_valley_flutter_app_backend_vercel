import express from 'express';
import { forgotPassword, loginUser, registerUser, resetPassword, updateUser, verifyEmail, verifyOTP, verifyUser } from '../controllers/AuthControlles.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginUser);
// POST /api/auth/register (master account creates users; the app already sends its token)
router.post('/register', protect, requireAdmin, registerUser);
// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);
// PUT /api/auth/update-user (own account, or any account for the master)
router.put('/update-user', protect, updateUser);

router.get('/verify-email/:token', verifyEmail);

router.get('/verify-user/:id', protect, requireAdmin, verifyUser);

export default router;

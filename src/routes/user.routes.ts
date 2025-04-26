import express from 'express';
import { register, login, getProfile } from '../controllers/user.controller';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Register a new user
router.post('/register', registerValidation, register);

// Login user
router.post('/login', loginValidation, login);

// Get user profile (protected route)
router.get('/profile', authenticate, getProfile);

export default router;

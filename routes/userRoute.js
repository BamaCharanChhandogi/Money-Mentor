import express from 'express';
import { login, register, verifyOTP } from '../controllers/authController.js';
const router=express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);

export default router;
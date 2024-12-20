import express from 'express';
import { deleteUser, getUser, login, logout, register, updateUser, verifyOTP } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';
const router=express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/logout', auth, logout);
router.get('/get-user', auth, getUser);
router.patch('/update-user', auth, updateUser);
router.delete('/delete-user', auth, deleteUser);

export default router;
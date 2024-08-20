import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import budgetRoutes from './budgetRoutes.js';
const router = express.Router();

router.use("/api/auth",authRoutes);
router.use('/api/expenses', expenseRoutes);
router.use('/api/budgets', budgetRoutes);

export default router;

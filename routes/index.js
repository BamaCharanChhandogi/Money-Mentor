import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import bankAccountRoutes from './bankAccountRoutes.js';
import transactionRoutes from './transactionRoutes.js';

const router = express.Router();

router.use("/api/auth",authRoutes);
router.use('/api/expenses', expenseRoutes);
router.use('/api/budgets', budgetRoutes);
router.use('/api/bank-accounts', bankAccountRoutes);
router.use('/api/transactions', transactionRoutes);

export default router;

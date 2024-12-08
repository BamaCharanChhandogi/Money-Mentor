import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import bankAccountRoutes from './bankAccountRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import investments from './investmentsRoutes.js';
import financialAdvice from './financialAdviceRoutes.js';
import insurancePolicy from './insurancePolicyRoutes.js';
import  financialChatbot  from './financialChatbotRoutes.js';
import plaidRoutes  from './plaidRoutes.js';
import transactionCategorization from '../routes/TransactionCategorization.js';

const router = express.Router();

router.use("/api/auth",authRoutes);
router.use('/api/expenses', expenseRoutes);
router.use('/api/budgets', budgetRoutes);
router.use('/api/bank-accounts', bankAccountRoutes);
router.use('/api/transactions', transactionRoutes);
router.use('/api/investments', investments);
router.use('/api/financial-advice', financialAdvice);
router.use('/api/insurance-policies', insurancePolicy);
router.use('/api/financial-chatbot',financialChatbot );
router.use('/api/plaid',plaidRoutes );
router.use('/api',transactionCategorization );

export default router;

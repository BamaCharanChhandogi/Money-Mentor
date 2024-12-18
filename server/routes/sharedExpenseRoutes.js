import auth from '../middleware/authMiddleware.js';
import {createSharedExpense, getSharedExpenses, updateSharedExpenseSplit } from '../controllers/familyExpenseController.js';
import express from 'express';

const router = express.Router();
router.post('/', auth, createSharedExpense);
router.get('/:familyGroupId', auth, getSharedExpenses);
router.patch('/:expenseId/split', auth, updateSharedExpenseSplit);

export default router;
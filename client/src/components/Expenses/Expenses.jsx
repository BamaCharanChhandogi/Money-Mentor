/* eslint-disable no-unused-vars */
// src/components/ExpenseDashboard.js
import  { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Alert from '../ui/Alert';
import { AlertCircle, AlertTitle, AlertDescription } from '../ui/Alert';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please try again later.');
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      fetchExpenses();
      setCurrentExpense(null);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      const response = await fetch(`/api/expenses/${currentExpense._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error('Failed to update expense');
      fetchExpenses();
      setCurrentExpense(null);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
    }
  };

  const handleEditClick = (expense) => {
    setCurrentExpense(expense);
  };

  const handleCancelEdit = () => {
    setCurrentExpense(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ExpenseForm
        expense={currentExpense}
        onSubmit={currentExpense ? handleEditExpense : handleAddExpense}
        onCancel={handleCancelEdit}
      />

      <ExpenseList
        expenses={expenses}
        onEdit={handleEditClick}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default ExpenseDashboard;

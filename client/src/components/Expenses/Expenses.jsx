import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Wallet, Calendar, Edit, Trash2 } from 'lucide-react';
import { BASE_URL } from '../../api';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: new Date().toLocaleDateString('en-CA'),
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${BASE_URL}/expenses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch expenses');
        }

        const data = await response.json();
        // Ensure data is an array and convert amount to number
        const processedExpenses = data.map(expense => ({
          ...expense,
          amount: Number(expense.amount)
        }));

        // Sort expenses by date for the chart
        const sortedExpenses = processedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        setExpenses(sortedExpenses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setFetchError(error.message);
        setIsLoading(false);
      }
    };
  
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
  
    if (!newExpense.category || !newExpense.amount) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExpense,
          amount: Number(newExpense.amount)
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
  
      const addedExpense = await response.json();
      const updatedExpenses = [...expenses, { ...addedExpense, amount: Number(addedExpense.amount) }]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setExpenses(updatedExpenses);
      setIsModalOpen(false);
      setNewExpense({ category: '', amount: '', date: new Date().toLocaleDateString('en-CA') });
      setError('');
    } catch (error) {
      setError('Error adding expense');
      console.error(error);
    }
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
  
    if (!editingExpense.category || !editingExpense.amount) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses/${editingExpense._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: editingExpense.category,
          amount: Number(editingExpense.amount),
          date: editingExpense.date
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
  
      const updatedExpense = await response.json();
      const updatedExpenses = expenses.map(expense => 
        expense._id === updatedExpense._id 
          ? { ...updatedExpense, amount: Number(updatedExpense.amount) }
          : expense
      ).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setExpenses(updatedExpenses);
      setIsModalOpen(false);
      setEditingExpense(null);
      setError('');
    } catch (error) {
      setError('Error updating expense');
      console.error(error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
  
      setExpenses(expenses.filter((expense) => expense._id !== id));

    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  // Safe total expenses calculation
  const totalExpenses = Array.isArray(expenses) 
    ? expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading expenses...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {fetchError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Expense Tracker</h1>
              <p className="text-green-100 mt-2">Monitor your spending patterns</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-xl">
                <Wallet className="mr-2 text-white" />
                <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setNewExpense({ category: '', amount: '', date: new Date().toLocaleDateString('en-CA') });
                  setIsModalOpen(true);
                }}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
              >
                <Plus className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <TrendingUp className="mr-2 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Expense Trends</h2>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="mr-2" />
              <span>Monthly View</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex justify-between items-center border-b py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">{expense.category}</span>
                <span className="text-gray-500 text-sm">
                  ${expense.amount.toFixed(2)} on {expense.date}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => openEditModal(expense)}
                  className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Expense Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={editingExpense ? handleEditExpense : handleAddExpense} className="space-y-4">
                <input
                  type="text"
                  placeholder="Expense Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={editingExpense ? editingExpense.category : newExpense.category}
                  onChange={(e) => 
                    editingExpense 
                      ? setEditingExpense({ ...editingExpense, category: e.target.value }) 
                      : setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Expense Amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={editingExpense ? editingExpense.amount : newExpense.amount}
                  onChange={(e) => 
                    editingExpense 
                      ? setEditingExpense({ ...editingExpense, amount: e.target.value }) 
                      : setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={editingExpense ? editingExpense.date : newExpense.date}
                  onChange={(e) => 
                    editingExpense 
                      ? setEditingExpense({ ...editingExpense, date: e.target.value }) 
                      : setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  required
                />
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingExpense(null);
                      setError('');
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition"
                  >
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDashboard;
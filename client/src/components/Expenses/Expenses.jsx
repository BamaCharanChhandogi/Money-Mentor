import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Wallet, Calendar, Edit, Trash2 } from 'lucide-react';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: new Date().toLocaleDateString('en-CA'), // Ensures consistent date format (YYYY-MM-DD)
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulated initial data - replace with actual API call
    const initialExpenses = [
      { id: 1, category: 'Groceries', amount: 250, date: '2024-02-15' },
      { id: 2, category: 'Dining Out', amount: 120, date: '2024-02-18' },
      { id: 3, category: 'Transportation', amount: 75, date: '2024-02-20' },
    ];
    setExpenses(initialExpenses);
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newExpense.category || !newExpense.amount) {
      setError('Please fill in all fields');
      return;
    }

    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: '', amount: '', date: new Date().toLocaleDateString('en-CA') });
    setIsModalOpen(false);
    setError('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
                onClick={() => setIsModalOpen(true)}
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
              key={expense.id}
              className="flex justify-between items-center border-b py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">{expense.category}</span>
                <span className="text-gray-500 text-sm">
                  ${expense.amount.toFixed(2)} on {expense.date}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Expense Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Add New Expense</h2>
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                  type="text"
                  placeholder="Expense Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Expense Amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition"
                  >
                    Add Expense
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

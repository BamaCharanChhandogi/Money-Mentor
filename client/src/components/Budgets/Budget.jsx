import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, PieChart, Wallet, Calendar, Edit, Trash2 } from 'lucide-react';

const BudgetDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulated initial data - replace with actual API call
    const initialBudgets = [
      { id: 1, category: 'Housing', amount: 1500, period: 'monthly' },
      { id: 2, category: 'Groceries', amount: 500, period: 'monthly' },
      { id: 3, category: 'Transportation', amount: 300, period: 'monthly' },
    ];
    setBudgets(initialBudgets);
  }, []);

  const handleAddBudget = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newBudget.category || !newBudget.amount) {
      setError('Please fill in all fields');
      return;
    }

    const budget = {
      id: budgets.length + 1,
      ...newBudget,
      amount: parseFloat(newBudget.amount)
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', amount: '', period: 'monthly' });
    setIsModalOpen(false);
    setError('');
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Budget Dashboard</h1>
              <p className="text-blue-100 mt-2">Manage your financial goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-xl">
                <Wallet className="mr-2 text-white" />
                <span className="font-semibold">${totalBudget.toFixed(2)}</span>
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

        {/* Budget Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <PieChart className="mr-2 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Budget Allocation</h2>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="mr-2" />
              <span>Monthly View</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Budget Categories</h2>
          {budgets.map((budget) => (
            <div 
              key={budget.id} 
              className="flex justify-between items-center border-b py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">{budget.category}</span>
                <span className="text-gray-500 text-sm">
                  ${budget.amount.toFixed(2)} / {budget.period}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Budget Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Add New Budget</h2>
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddBudget} className="space-y-4">
                <input
                  type="text"
                  placeholder="Budget Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Budget Amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  required
                />
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
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
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition"
                  >
                    Add Budget
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

export default BudgetDashboard;
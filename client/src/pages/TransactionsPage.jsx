import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  BarChart, 
  PieChart, 
  Download, 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  Tag 
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../api';
import TransactionsList from './TransactionsList';
import CategoryInsights from './CategoryInsights';

const StatCard = ({ icon: Icon, title, value, subtext }) => (
  <div className="bg-white rounded-2xl shadow-md p-5 space-y-3 hover:shadow-lg transition">
    <div className="flex justify-between items-center">
      <Icon className="text-blue-600" size={32} />
      <span className="text-sm text-gray-500">{title}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{subtext}</div>
  </div>
);

const TransactionsPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    startDate: '',
    endDate: '',
    format: 'csv'
  });
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    amount: '',
    name: '',
    category: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/transactions/export`, {
        params: exportOptions,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/transactions`, newTransaction, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsAddTransactionModalOpen(false);
      // Optionally, refresh transactions or show a success message
    } catch (error) {
      console.error('Add transaction error:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 space-y-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
            <p className="text-gray-500 mt-2">Manage and analyze your financial transactions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Download className="mr-2" /> Export Transactions
            </button>
            <button 
              onClick={() => setIsAddTransactionModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <Plus className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Export Modal */}
        {isExportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Export Transactions</h2>
                <button onClick={() => setIsExportModalOpen(false)}>
                  <X className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 flex items-center">
                    <Calendar className="mr-2 text-blue-500" /> Start Date
                  </label>
                  <input 
                    type="date" 
                    value={exportOptions.startDate}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev, 
                      startDate: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 flex items-center">
                    <Calendar className="mr-2 text-blue-500" /> End Date
                  </label>
                  <input 
                    type="date" 
                    value={exportOptions.endDate}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev, 
                      endDate: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2">Export Format</label>
                  <select 
                    value={exportOptions.format}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev, 
                      format: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <button 
                  onClick={handleExport}
                  className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {isAddTransactionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Transaction</h2>
                <button onClick={() => setIsAddTransactionModalOpen(false)}>
                  <X className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 flex items-center">
                    <Calendar className="mr-2 text-blue-500" /> Date
                  </label>
                  <input 
                    type="date" 
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev, 
                      date: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 flex items-center">
                    <DollarSign className="mr-2 text-green-500" /> Amount
                  </label>
                  <input 
                    type="number" 
                    placeholder="Enter amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev, 
                      amount: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2 flex items-center">
                    <Tag className="mr-2 text-purple-500" /> Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Transaction name"
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev, 
                      name: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-2">Category</label>
                  <select 
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev, 
                      category: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddTransaction}
                  className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the component remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Wallet}
            title="Total Spending"
            value="$4,523.67"
            subtext="This month"
          />
          <StatCard 
            icon={TrendingUp}
            title="Income"
            value="$6,234.22"
            subtext="30% increase"
          />
          <StatCard 
            icon={BarChart}
            title="Expenses"
            value="$3,245.45"
            subtext="22% from last month"
          />
          <StatCard 
            icon={PieChart}
            title="Budget"
            value="85%"
            subtext="of monthly budget used"
          />
        </div>

        <div className="space-y-6">
          <CategoryInsights />
          <TransactionsList />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
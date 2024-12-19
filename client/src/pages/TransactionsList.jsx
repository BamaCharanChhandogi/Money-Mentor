import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChevronDown, 
  Filter, 
  List, 
  Grid, 
  MoreHorizontal, 
  ArrowUpDown 
} from 'lucide-react';
import { BASE_URL } from '../api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortConfig, setSortConfig] = useState({ 
    key: 'date', 
    direction: 'desc' 
  });

  // Fetch transactions (same as before)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/transactions`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data);
        
        const uniqueCategories = ['All', ...new Set(
          response.data
            .map(t => t.category?.[0] || 'Uncategorized')
            .filter(Boolean)
        )];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  // Sorting and Filtering Logic
  useEffect(() => {
    let result = [...transactions];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(t => 
        (t.category?.[0] || 'Uncategorized') === selectedCategory
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [selectedCategory, transactions, sortConfig]);

  // Sorting Handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  // Categorize transactions
  const handleCategorize = async () => {
    try {
      await axios.post(`${BASE_URL}/categorize`,{
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh transactions after categorization
      const response = await axios.get(`${BASE_URL}/transactions`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error categorizing transactions:', error);
    }
  };

  // View transaction details
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-48 p-3 pl-4 pr-8 bg-gray-100 text-gray-800 rounded-lg border-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" 
              size={20} 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          Total Transactions: {filteredTransactions.length}
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100">
                {['Date', 'Name', 'Merchant', 'Amount', 'Category'].map((header) => (
                  <th 
                    key={header} 
                    className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    <div className="flex items-center">
                      {header}
                      <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                    </div>
                  </th>
                ))}
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction._id} className="hover:bg-gray-50 transition border-b last:border-b-0">
              <td className="p-2 border">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="p-2 border">{transaction.name}</td>
              <td className="p-2 border">{transaction.merchantName || 'N/A'}</td>
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded ${transaction.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td className="p-2 border">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {transaction.category?.[0] || 'Uncategorized'}
                </span>
              </td>
              <td className="p-2 border">
                <button 
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  onClick={() => openTransactionDetails(transaction)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )}
     {/* Grid View */}
     {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTransactions.map(transaction => (
            <div 
              key={transaction._id} 
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <button className="text-gray-500 hover:text-blue-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="text-lg font-semibold">{transaction.name}</div>
              <div className="text-sm text-gray-600">{transaction.merchantName || 'N/A'}</div>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {transaction.category?.[0] || 'Uncategorized'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedTransaction.name}
              </div>
              <div>
                <strong>Merchant:</strong> {selectedTransaction.merchantName || 'N/A'}
              </div>
              <div>
                <strong>Amount:</strong> ${Math.abs(selectedTransaction.amount).toFixed(2)}
              </div>
              <div>
                <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Category:</strong> 
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  {selectedTransaction.category?.[0] || 'Uncategorized'}
                </span>
              </div>
              {selectedTransaction.location && (
                <div>
                  <strong>Location:</strong> 
                  {selectedTransaction.location.address}, 
                  {selectedTransaction.location.city}, 
                  {selectedTransaction.location.region}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/transactions`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data);
        
        // Extract unique categories
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

  // Filter transactions
  useEffect(() => {
    const filtered = selectedCategory === 'All' 
      ? transactions 
      : transactions.filter(t => 
          (t.category?.[0] || 'Uncategorized') === selectedCategory
        );
    setFilteredTransactions(filtered);
  }, [selectedCategory, transactions]);

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
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-48 p-2 border rounded"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button 
            onClick={handleCategorize}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Auto Categorize
          </button>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded">
          Total Transactions: {filteredTransactions.length}
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">Date</th>
            <th className="p-2 border text-left">Name</th>
            <th className="p-2 border text-left">Merchant</th>
            <th className="p-2 border text-left">Amount</th>
            <th className="p-2 border text-left">Category</th>
            <th className="p-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction._id} className="hover:bg-gray-50">
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

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
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
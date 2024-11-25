import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const token = useSelector(state => state.auth.token);
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: ''
  });

  useEffect(() => {
    fetchInvestments();
    fetchPortfolioSummary();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInvestments(response.data);
    } catch (error) {
      console.error('Error fetching investments', error);
    }
  };

  const fetchPortfolioSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments/summary`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPortfolioSummary(response.data);
    } catch (error) {
      console.error('Error fetching portfolio summary', error);
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    console.log(newInvestment);
    
    try {
      await axios.post(`${BASE_URL}/investments`, newInvestment,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchInvestments();
      fetchPortfolioSummary();
      // Reset form
      setNewInvestment({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: ''
      });
    } catch (error) {
      console.error('Error adding investment', error);
    }
  };

  const handleUpdatePrices = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/investments/update-prices`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      await fetchInvestments();
      await fetchPortfolioSummary();
  
      // Show success message with update details
      const message = `Updated ${response.data.updatedCount} investments successfully`;
      alert(message);
  
    } catch (error) {
      console.error('Error updating prices:', error);
      alert(error.response?.data?.error || 'Failed to update investment prices');
    }
  };

  // Asset Allocation Pie Chart Data
  const assetAllocationData = portfolioSummary 
    ? Object.entries(portfolioSummary.assetAllocation).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Investment Portfolio</h1>

      {/* Portfolio Summary */}
      {portfolioSummary && (
        <div className="bg-white shadow-md rounded-lg mb-4 p-4">
          <h2 className="text-xl font-semibold mb-3">Portfolio Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Total Value: ${portfolioSummary.performanceSummary.totalValue.toFixed(2)}</p>
              <p>Total Cost: ${portfolioSummary.performanceSummary.totalCost.toFixed(2)}</p>
              <p>Overall Return: {portfolioSummary.performanceSummary.overallReturn?.toFixed(2)}%</p>
            </div>
            <div>
              <PieChart width={300} height={200}>
                <Pie
                  data={assetAllocationData}
                  cx={150}
                  cy={80}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      {/* Add Investment Form */}
      <div className="bg-white shadow-md rounded-lg mb-4 p-4">
        <h2 className="text-xl font-semibold mb-3">Add New Investment</h2>
        <form onSubmit={handleAddInvestment} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Symbol</label>
              <input
                type="text"
                value={newInvestment.symbol}
                onChange={(e) => setNewInvestment({...newInvestment, symbol: e.target.value})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Type</label>
              <select
                value={newInvestment.type}
                onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                className="w-full border p-2 rounded"
              >
                <option value="stock">Stock</option>
                <option value="bond">Bond</option>
                <option value="etf">ETF</option>
                <option value="mutual_fund">Mutual Fund</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <input
                type="number"
                value={newInvestment.quantity}
                onChange={(e) => setNewInvestment({...newInvestment, quantity: parseFloat(e.target.value)})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Purchase Price</label>
              <input
                type="number"
                value={newInvestment.purchasePrice}
                onChange={(e) => setNewInvestment({...newInvestment, purchasePrice: parseFloat(e.target.value)})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Purchase Date</label>
              <input
                type="date"
                value={newInvestment.purchaseDate}
                onChange={(e) => setNewInvestment({...newInvestment, purchaseDate: e.target.value})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Investment
          </button>
        </form>
      </div>

      {/* Investments Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Current Investments</h2>
          <button 
            onClick={handleUpdatePrices}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Update Prices
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Symbol</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Purchase Price</th>
                <th className="border p-2">Current Price</th>
                <th className="border p-2">Total Value</th>
                <th className="border p-2">Return</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment._id} className="hover:bg-gray-50">
                  <td className="border p-2">{investment.symbol}</td>
                  <td className="border p-2">{investment.name}</td>
                  <td className="border p-2">{investment.type}</td>
                  <td className="border p-2">{investment.quantity}</td>
                  <td className="border p-2">${investment.purchasePrice.toFixed(2)}</td>
                  <td className="border p-2">${investment.currentPrice.toFixed(2)}</td>
                  <td className="border p-2">${(investment.quantity * investment.currentPrice).toFixed(2)}</td>
                  <td 
                    className={`border p-2 ${
                      investment.quantity * investment.currentPrice > investment.quantity * investment.purchasePrice 
                      ? 'text-green-600' 
                      : 'text-red-600'
                    }`}
                  >
                    {(((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTracker;
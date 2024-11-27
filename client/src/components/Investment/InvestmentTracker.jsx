import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Cell, 
  ResponsiveContainer 
} from "recharts";
import { BASE_URL } from "../../api";
import { useSelector } from "react-redux";
import { 
  PlusCircle, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  DollarSign 
} from "lucide-react";

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [newInvestment, setNewInvestment] = useState({
    symbol: "",
    name: "",
    type: "stock",
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: "",
  });

  useEffect(() => {
    fetchInvestments();
    fetchPortfolioSummary();
  }, []);
console.log(portfolioSummary);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestments(response.data);
    } catch (error) {
      console.error("Error fetching investments", error);
    }
  };

  const fetchPortfolioSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolioSummary(response.data);
    } catch (error) {
      console.error("Error fetching portfolio summary", error);
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/investments`, newInvestment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInvestments();
      fetchPortfolioSummary();
      // Reset form
      setNewInvestment({
        symbol: "",
        name: "",
        type: "stock",
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: "",
      });
    } catch (error) {
      console.error("Error adding investment", error);
    }
  };

  const handleUpdatePrices = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/investments/update-prices`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchInvestments();
      await fetchPortfolioSummary();

      // Show success message with update details
      const message = `Updated ${response.data.updatedCount} investments successfully`;
      alert(message);
    } catch (error) {
      console.error("Error updating prices:", error);
      alert(
        error.response?.data?.error || "Failed to update investment prices"
      );
    }
  };

  // Asset Allocation Pie Chart Data
  const assetAllocationData = portfolioSummary
    ? Object.entries(portfolioSummary.assetAllocation).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" />
            Investment Portfolio
          </h1>
          <button 
            onClick={handleUpdatePrices}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Update Prices
          </button>
        </div>

        {/* Portfolio Overview */}
        {portfolioSummary && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Total Portfolio Value
              </h2>
              <p className="text-3xl font-bold text-gray-900">
                ${portfolioSummary.performanceSummary.totalValue?.toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Total Return
              </h2>
              <p className={`text-3xl font-bold ${portfolioSummary.performanceSummary.overallReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioSummary.performanceSummary.overallReturn?.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <PieChartIcon className="w-6 h-6 text-blue-500" />
                Asset Allocation
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
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
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Add Investment Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-blue-600" />
            Add New Investment
          </h2>
          <form onSubmit={handleAddInvestment} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Symbol</label>
                <select
                  value={newInvestment.symbol}
                  onChange={(e) =>
                    setNewInvestment({ ...newInvestment, symbol: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Symbol</option>
                  <optgroup label="Stocks">
                    <option value="AAPL">AAPL (Apple)</option>
                    <option value="MSFT">MSFT (Microsoft)</option>
                    <option value="GOOGL">GOOGL (Alphabet)</option>
                  </optgroup>
                  <optgroup label="Crypto">
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) =>
                    setNewInvestment({ ...newInvestment, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) =>
                    setNewInvestment({ ...newInvestment, type: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Quantity</label>
                <input
                  type="number"
                  value={newInvestment.quantity}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      quantity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Purchase Price</label>
                <input
                  type="number"
                  value={newInvestment.purchasePrice}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      purchasePrice: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">Purchase Date</label>
                <input
                  type="date"
                  value={newInvestment.purchaseDate}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      purchaseDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Add Investment
            </button>
          </form>
        </div>

        {/* Investments Table */}
        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Current Investments
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Purchase Price</th>
                <th className="p-3 text-left">Current Price</th>
                <th className="p-3 text-left">Total Value</th>
                <th className="p-3 text-left">Return</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{investment.symbol}</td>
                  <td className="p-3">{investment.name}</td>
                  <td className="p-3">{investment.type}</td>
                  <td className="p-3">{investment.quantity}</td>
                  <td className="p-3">${investment.purchasePrice.toFixed(2)}</td>
                  <td className="p-3">${investment.currentPrice.toFixed(2)}</td>
                  <td className="p-3">
                    ${(investment.quantity * investment.currentPrice).toFixed(2)}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      investment.quantity * investment.currentPrice >
                      investment.quantity * investment.purchasePrice
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(
                      ((investment.currentPrice - investment.purchasePrice) /
                        investment.purchasePrice) *
                      100
                    ).toFixed(2)}
                    %
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
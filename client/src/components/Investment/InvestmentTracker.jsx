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
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Info
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
  const [isUpdatePricesLoading, setIsUpdatePricesLoading] = useState(false);

  useEffect(() => {
    fetchInvestments();
    fetchPortfolioSummary();
  }, []);

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
    setIsUpdatePricesLoading(true);
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
    } finally {
      setIsUpdatePricesLoading(false);
    }
  };

  // Asset Allocation Pie Chart Data
  const assetAllocationData = portfolioSummary
    ? Object.entries(portfolioSummary.assetAllocation).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

    const COLORS = {
      primary: '#1E40AF',      // Deep Blue
      secondary: '#10B981',    // Emerald Green
      accent: '#6366F1',       // Indigo
      background: '#F9FAFB',   // Light Gray Background
      text: {
        dark: '#111827',       // Almost Black
        light: '#4B5563',      // Gray
        muted: '#6B7280'       // Lighter Gray
      },
      green: '#10B981',        // Success Green
      red: '#EF4444',          // Error Red
      yellow: '#F59E0B'        // Warning Yellow
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 shadow-xl p-8" style={{ background: `linear-gradient(135deg, ${COLORS.background.start} 0%, ${COLORS.background.end} 100%)`,backgroundAttachment: 'fixed' }}>
        <div className="container mx-auto max-w-7xl space-y-8">
          {/* Header */} 
          <div className="bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center border-l-6 border-[#1E40AF]"  style={{ 
            borderLeft: `6px solid ${COLORS.primary.dark}`,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full shadow-md" style={{ 
                backgroundColor: `${COLORS.primary.light}14`, 
                color: COLORS.primary.light 
              }}>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ color: COLORS.text.dark }}>
                  Investment Portfolio
                </h1>
                <p className="text-gray-500 text-sm" style={{ color: COLORS.text.muted }}>
                  Intelligent Investment Tracking
                </p>
              </div>
            </div>
            <button 
              onClick={handleUpdatePrices}
              disabled={isUpdatePricesLoading}
              className="bg-[#1E40AF] text-white px-6 py-3 rounded-lg hover:bg-[#2563EB] transition flex items-center space-x-2 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {isUpdatePricesLoading ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Update Prices</span>
                </>
              )}
            </button>
          </div>
  
          {/* Portfolio Overview */}
          {portfolioSummary && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white shadow-lg rounded-2xl p-6 transform transition hover:scale-[1.03] hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-600" style={{ color: COLORS.text.light }}>
                    Total Portfolio Value
                  </h2>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900" style={{ color: COLORS.text.dark }}>
                  ${portfolioSummary.performanceSummary.totalValue?.toFixed(2)}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+5.2% this month</span>
                </div>
              </div>
  
              <div className="bg-white shadow-lg rounded-2xl p-6 transform transition hover:scale-[1.03] hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-600" style={{ color: COLORS.text.light }}>
                    Total Return
                  </h2>
                  {portfolioSummary.performanceSummary.overallReturn > 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <p className={`text-4xl font-bold ${portfolioSummary.performanceSummary.overallReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioSummary.performanceSummary.overallReturn?.toFixed(2)}%
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-gray-500">Since portfolio inception</span>
                </div>
              </div>
  
              <div className="bg-white shadow-lg rounded-2xl p-6 transform transition hover:scale-[1.03] hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-600" style={{ color: COLORS.text.light }}>
                    Asset Allocation
                  </h2>
                  <PieChartIcon className="w-6 h-6 text-blue-500" />
                </div>
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
                        <Cell key={`cell-${index}`} fill={[
                          "#1E40AF", "#10B981", "#6366F1", "#EF4444", "#F59E0B"
                        ][index % 5]} />
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
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3" style={{ color: COLORS.text.dark }}>
              <PlusCircle className="w-6 h-6 text-blue-600" />
              Add New Investment
            </h2>
            <form onSubmit={handleAddInvestment} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-700 font-semibold" style={{ color: COLORS.text.light }}>Symbol</label>
                  <select
                    value={newInvestment.symbol}
                    onChange={(e) =>
                      setNewInvestment({ ...newInvestment, symbol: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
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
              className="w-full bg-[#1E40AF] text-white p-3 rounded-lg hover:bg-[#2563EB] transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Add Investment
            </button>
          </form>
        </div>

        {/* Investments Table */}
        <div className="bg-white shadow-lg rounded-2xl p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ color: COLORS.text.dark }}>
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
                <tr key={investment._id} className="hover:bg-gray-50 border-b transition duration-200">
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
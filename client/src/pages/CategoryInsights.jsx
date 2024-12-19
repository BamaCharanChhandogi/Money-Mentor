import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { BASE_URL } from '../api';
import { Layers, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CategoryInsights = () => {
  const [categoryInsights, setCategoryInsights] = useState([]);

  useEffect(() => {
    const fetchCategoryInsights = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/insights`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategoryInsights(response.data);
      } catch (error) {
        console.error('Error fetching category insights:', error);
      }
    };
    fetchCategoryInsights();
  }, []);

  // Format data for chart
  const chartData = categoryInsights.map(insight => ({
    name: insight._id || 'Uncategorized',
    totalSpend: insight.totalSpend,
    transactionCount: insight.transactionCount,
    averageAmount: insight.averageTransactionAmount
  })).sort((a, b) => b.totalSpend - a.totalSpend);

  const totalSpend = chartData.reduce((sum, item) => sum + item.totalSpend, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Layers className="mr-2" /> Spending Insights
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Detailed breakdown of your spending by category
            </p>
          </div>
          <div className="flex items-center">
            <TrendingUp className="mr-2" />
            <span className="text-lg font-semibold">
              ${totalSpend.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} label={{ value: 'Total Spend ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white rounded-lg shadow-lg p-4 border">
                        <p className="font-bold text-gray-800">{data.name}</p>
                        <p className="text-blue-600">Total Spend: ${data.totalSpend.toFixed(2)}</p>
                        <p className="text-gray-600">Transactions: {data.transactionCount}</p>
                        <p className="text-gray-600">Avg. Transaction: ${data.averageAmount.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="totalSpend" fill="#3B82F6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          {chartData.map((category, index) => {
            const percentage = (category.totalSpend / totalSpend) * 100;
            return (
              <div key={category.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ 
                        backgroundColor: `hsl(${index * 30}, 70%, 50%)` 
                      }} 
                    />
                    <span className="font-medium text-gray-800">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2 text-gray-600">
                      ${category.totalSpend.toFixed(2)}
                    </span>
                    {percentage > 50 ? (
                      <ArrowUpRight className="text-red-500" size={16} />
                    ) : (
                      <ArrowDownRight className="text-green-500" size={16} />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{percentage.toFixed(1)}%</span>
                  <span>{category.transactionCount} transactions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryInsights;
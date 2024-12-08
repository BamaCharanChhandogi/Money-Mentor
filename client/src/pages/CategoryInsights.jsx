import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BASE_URL } from '../api';

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
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Spending Insights by Category</h2>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Total Spend ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border rounded shadow">
                      <p><strong>{data.name}</strong></p>
                      <p>Total Spend: ${data.totalSpend.toFixed(2)}</p>
                      <p>Transactions: {data.transactionCount}</p>
                      <p>Avg Transaction: ${data.averageAmount.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="totalSpend" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map(category => (
          <div 
            key={category.name} 
            className="p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <div className="text-sm font-semibold text-gray-600">
              {category.name}
            </div>
            <div className="text-xl font-bold text-blue-600">
              ${category.totalSpend.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {category.transactionCount} transactions
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryInsights;
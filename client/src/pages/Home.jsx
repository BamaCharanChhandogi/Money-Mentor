import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHandHoldingUsd, FaChartPie, FaChartLine, FaCreditCard } from 'react-icons/fa';
import { BASE_URL } from '../api';

function Home() {
    const [financialData, setFinancialData] = useState({
        totalBalance: 0,
        monthlyExpenses: 0,
        investments: 0,
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                // Fetch multiple endpoints concurrently
                const [
                    balanceResponse, 
                    expensesResponse, 
                    investmentsResponse, 
                    transactionsResponse
                ] = await Promise.all([
                    axios.get(`${BASE_URL}/bank-accounts`, { 
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        } 
                    }),
                    axios.get(`${BASE_URL}/expenses`, { 
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        } 
                    }),
                    axios.get(`${BASE_URL}/investments`, { 
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        } 
                    }),
                    axios.get(`${BASE_URL}/transactions`, { 
                        headers: { 
                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                        } 
                    })
                ]);
                setFinancialData({
                    totalBalance: balanceResponse.data.totalBalance || 0,
                    monthlyExpenses:expensesResponse.data.map((expense) => expense.amount).reduce((a, b) => a + b, 0) || 0,
                    investments: investmentsResponse.data.map((investment) => investment.currentValue).reduce((a, b) => a + b, 0) || 0,
                    transactions: transactionsResponse.data.slice(0, 15)
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching financial data:', err);
                setError('Failed to load financial data');
                setLoading(false);
            }
        };

        fetchFinancialData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <section className="bg-green-100 p-8">
                <div className="container mx-auto text-center">
                    <p className="text-2xl text-green-900">Loading financial data...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-red-100 p-8">
                <div className="container mx-auto text-center">
                    <p className="text-2xl text-red-900">{error}</p>
                </div>
            </section>
        );
    }
    
    return (
        <section className="bg-green-100 p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-green-900">𝓓𝓪𝓼𝓱𝓫𝓸𝓪𝓻𝓭</h1>
                    <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition-all duration-300">
                        Add Funds $
                    </button>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Card 1: Total Balance */}
                    <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
                        <h2 className="text-white text-lg font-semibold flex items-center">
                            Total Balance
                            <FaHandHoldingUsd className="ml-2 text-yellow-400" />
                        </h2>
                        <p className="text-3xl font-bold text-white mt-4">
                            {formatCurrency(financialData.monthlyExpenses+financialData.investments)}
                        </p>
                        <p className="text-green-200 mt-2">+ $2,000 (4.6%)</p>
                    </div>
                    {/* Card 2: Monthly Expenses */}
                    <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
                        <h2 className="text-white text-lg font-semibold flex items-center">
                            Monthly Expenses
                            <FaChartPie className="ml-2 text-yellow-200" />
                        </h2>
                        <p className="text-3xl font-bold text-white mt-4">
                            {formatCurrency(financialData.monthlyExpenses)}
                        </p>
                        <p className="text-red-200 mt-2">- $200 (5.4%)</p>
                    </div>
                    {/* Card 3: Investments */}
                    <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
                        <h2 className="text-white text-lg font-semibold flex items-center">
                            Investments
                            <FaChartLine className="ml-2 text-yellow-300" />
                        </h2>
                        <p className="text-3xl font-bold text-white mt-4">
                            {formatCurrency(financialData.investments)}
                        </p>
                        <p className="text-green-200 mt-2">+ $1,200 (10.6%)</p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        Recent Transactions
                        <FaCreditCard className="ml-2 text-purple-600" />
                    </h2>
                    <ul className="space-y-6">
                        {financialData.transactions.map((transaction, index) => (
                            <li 
                                key={transaction._id || index} 
                                className="bg-white bg-opacity-80 flex justify-between items-center hover:bg-opacity-100 p-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <span className="font-semibold text-gray-800">{transaction.merchantName}</span>
                                <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(transaction.amount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Home;
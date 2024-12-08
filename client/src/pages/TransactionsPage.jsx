import React, { useEffect } from 'react';
import TransactionsList from './TransactionsList';
import CategoryInsights from './CategoryInsights';

const TransactionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  })
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      
      <CategoryInsights />
      
      <TransactionsList />
    </div>
  );
};

export default TransactionsPage;
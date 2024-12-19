import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, UserPlus, Home } from 'lucide-react';

const FamilyLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 shadow-xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Family Finance Management</h1>
          <p className="text-lg text-gray-600">Manage your family's finances together, efficiently and transparently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/family/create" className="transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <UserPlus className="w-12 h-12 text-emerald-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Create Family</h2>
              <p className="text-gray-600 text-center">Start a new family group and invite members</p>
            </div>
          </Link>

          <Link to="/family/manage" className="transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <Users className="w-12 h-12 text-emerald-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Manage Family</h2>
              <p className="text-gray-600 text-center">View and manage your family members</p>
            </div>
          </Link>

          <Link to="/family/expenses" className="transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <CreditCard className="w-12 h-12 text-emerald-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Shared Expenses</h2>
              <p className="text-gray-600 text-center">Track and manage family expenses</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FamilyLanding;
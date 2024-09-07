
import { Link } from 'react-router-dom';
import {
  FaChartLine,
  FaPiggyBank,
  FaRobot,
  FaShieldAlt,
  FaMoneyBillWave,
  FaBalanceScale
} from "react-icons/fa";

function Services() {
  return (
    <>
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h1>
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
            {/* Expense Tracking */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaMoneyBillWave className="text-blue-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Expense Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                Track your expenses seamlessly. Get insights into your spending habits and identify areas for improvement.
              </p>
              <Link
                to="/services/expenses"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                Manage Expenses &rarr;
              </Link>
            </div>

            {/* Budgeting */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaBalanceScale className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Budgeting
              </h2>
              <p className="text-gray-600 mb-4">
                Create and manage budgets to keep your finances on track. Set goals and monitor your progress over time.
              </p>
              <Link
                to="/services/budgets"
                className="text-green-600 hover:text-green-800 transition duration-300"
              >
                Create Budget &rarr;
              </Link>
            </div>

            {/* Bank Account Integration */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaPiggyBank className="text-purple-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bank Account Integration
              </h2>
              <p className="text-gray-600 mb-4">
                Link your bank accounts for real-time transaction import.
                Automatically categorize transactions with AI-driven insights.
              </p>
              <a
                href="#bank-integration"
                className="text-purple-600 hover:text-purple-800 transition duration-300"
              >
                Learn More &rarr;
              </a>
            </div>

            {/* Investment Portfolio Tracking */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaChartLine className="text-pink-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Investment Portfolio Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                Monitor your investments in stocks, bonds, crypto, and more.
                Analyze performance with detailed insights and visualizations.
              </p>
              <a
                href="#investment-tracking"
                className="text-pink-600 hover:text-pink-800 transition duration-300"
              >
                Learn More &rarr;
              </a>
            </div>

            {/* AI-driven Financial Advice */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaRobot className="text-yellow-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                AI-driven Financial Advice
              </h2>
              <p className="text-gray-600 mb-4">
                Get personalized financial advice powered by AI. Receive
                tailored recommendations for savings and investment strategies.
              </p>
              <a
                href="#ai-advice"
                className="text-yellow-600 hover:text-yellow-800 transition duration-300"
              >
                Learn More &rarr;
              </a>
            </div>

            {/* Secure Data Handling */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <FaShieldAlt className="text-indigo-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Secure Data Handling
              </h2>
              <p className="text-gray-600 mb-4">
                Your data`s security is our top priority. Enjoy peace of mind
                with end-to-end encryption and secure access controls.
              </p>
              <a
                href="#secure-data"
                className="text-indigo-600 hover:text-indigo-800 transition duration-300"
              >
                Learn More &rarr;
              </a>
            </div>
          </div>
        </div>
    </>
  );
}

export default Services;
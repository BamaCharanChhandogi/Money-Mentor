import { FaHandHoldingUsd, FaChartPie, FaChartLine, FaCreditCard } from 'react-icons/fa';  // Importing the icons

function Home() {
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
                <FaHandHoldingUsd className="ml-2 text-yellow-400" /> {/* Icon added */}
              </h2>
              <p className="text-3xl font-bold text-white mt-4">$45,000</p>
              <p className="text-green-200 mt-2">+ $2,000 (4.6%)</p>
            </div>
            {/* Card 2: Monthly Expenses */}
            <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
              <h2 className="text-white text-lg font-semibold flex items-center">
                Monthly Expenses
                <FaChartPie className="ml-2 text-yellow-200" /> {/* Icon added */}
              </h2>
              <p className="text-3xl font-bold text-white mt-4">$3,500</p>
              <p className="text-red-200 mt-2">- $200 (5.4%)</p>
            </div>
            {/* Card 3: Investments */}
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105">
              <h2 className="text-white text-lg font-semibold flex items-center">
                Investments
                <FaChartLine className="ml-2 text-yellow-300" /> {/* Icon added */}
              </h2>
              <p className="text-3xl font-bold text-white mt-4">$12,500</p>
              <p className="text-green-200 mt-2">+ $1,200 (10.6%)</p>
            </div>
          </div>
  
          {/* Recent Transactions */}
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              Recent Transactions
              <FaCreditCard className="ml-2 text-purple-600" /> {/* Icon added */}
            </h2>
            <ul className="space-y-6">
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Payment to Software Subscription</span>
                <span className="text-red-500 font-semibold">- $299.99</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Investment in Tech Fund</span>
                <span className="text-green-500 font-semibold">+ $5,000</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Real Estate Property Sale</span>
                <span className="text-green-500 font-semibold">+ $25,000</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Monthly Payroll</span>
                <span className="text-green-500 font-semibold">+ $10,000</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Utility Bill Payment</span>
                <span className="text-red-500 font-semibold">- $120</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Payment to Cloud Hosting</span>
                <span className="text-red-500 font-semibold">- $150</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Transfer to Savings Account</span>
                <span className="text-green-500 font-semibold">+ $2,500</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Annual Insurance Premium</span>
                <span className="text-red-500 font-semibold">- $1,200</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Payment for Freelance Project</span>
                <span className="text-green-500 font-semibold">+ $3,500</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Restaurant Bill Payment</span>
                <span className="text-red-500 font-semibold">- $80</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Refund from Vendor</span>
                <span className="text-green-500 font-semibold">+ $150</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Subscription Renewal</span>
                <span className="text-red-500 font-semibold">- $59.99</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Interest from Savings Account</span>
                <span className="text-green-500 font-semibold">+ $25</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Payment to Online Course</span>
                <span className="text-red-500 font-semibold">- $300</span>
              </li>
              <li className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <span className="font-semibold">Corporate Dividend Received</span>
                <span className="text-green-500 font-semibold">+ $1,000</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
}

export default Home;
function Home() {
    return (
        <section className="bg-gray-100 p-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
              Add Funds
            </button>
          </div>
  
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-gray-600 text-lg font-semibold">Total Balance</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">$45,000</p>
              <p className="text-green-500 mt-1">+ $2,000 (4.6%)</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-gray-600 text-lg font-semibold">Monthly Expenses</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">$3,500</p>
              <p className="text-red-500 mt-1">- $200 (5.4%)</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-gray-600 text-lg font-semibold">Investments</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">$12,500</p>
              <p className="text-green-500 mt-1">+ $1,200 (10.6%)</p>
            </div>
          </div>
  
          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>Payment to ABC Corp.</span>
                <span className="text-red-500">- $500</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Dividend from XYZ Inc.</span>
                <span className="text-green-500">+ $200</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Groceries from SuperMart</span>
                <span className="text-red-500">- $150</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Salary Deposit</span>
                <span className="text-green-500">+ $3,000</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
}

export default Home;

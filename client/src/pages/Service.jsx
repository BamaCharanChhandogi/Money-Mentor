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
  const services = [
    {
      icon: FaMoneyBillWave,
      iconColor: "text-sky-600",
      title: "Expense Tracking",
      description: "Track your expenses seamlessly. Get insights into your spending habits and identify areas for improvement.",
      link: "/services/expenses",
      linkText: "Manage Expenses",
      linkColor: "text-sky-600 hover:text-sky-800"
    },
    {
      icon: FaBalanceScale,
      iconColor: "text-emerald-600",
      title: "Budgeting",
      description: "Create and manage budgets to keep your finances on track. Set goals and monitor your progress over time.",
      link: "/services/budgets",
      linkText: "Create Budget",
      linkColor: "text-emerald-600 hover:text-emerald-800"
    },
    {
      icon: FaPiggyBank,
      iconColor: "text-violet-600",
      title: "Bank Account Integration",
      description: "Link your bank accounts for real-time transaction import. Automatically categorize transactions with AI-driven insights.",
      link: "/services/bank-accounts",
      linkText: "Connect Bank Account",
      linkColor: "text-violet-600 hover:text-violet-800"
    },
    {
      icon: FaChartLine,
      iconColor: "text-rose-600",
      title: "Investment Portfolio Tracking",
      description: "Monitor your investments in stocks, bonds, crypto, and more. Analyze performance with detailed insights and visualizations.",
      link: "/services/investments",
      linkText: "Track Investments",
      linkColor: "text-rose-600 hover:text-rose-800"
    },
    {
      icon: FaRobot,
      iconColor: "text-amber-600",
      title: "AI-driven Financial Advice",
      description: "Get personalized financial advice powered by AI. Receive tailored recommendations for savings and investment strategies.",
      link: "/ai-dashboard",
      linkText: "Get Advice",
      linkColor: "text-amber-600 hover:text-amber-800"
    },
    {
      icon: FaShieldAlt,
      iconColor: "text-indigo-600",
      title: "Transaction Categorization",
      description: "Your data's security is our top priority. Enjoy peace of mind with end-to-end encryption and secure access controls.",
      link: "/transactions",
      linkText: "Learn More",
      linkColor: "text-indigo-600 hover:text-indigo-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text 
            bg-gradient-to-r from-sky-500 to-indigo-600 mb-4">
            Our Financial Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering your financial journey with cutting-edge technology and personalized solutions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-8 
              transform transition duration-500 hover:-translate-y-2 
              hover:shadow-2xl hover:border-transparent"
            >
              <div className="flex items-center mb-6">
                <service.icon 
                  className={`${service.iconColor} text-5xl mr-4 
                  transform transition duration-300 group-hover:scale-110`} 
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  {service.title}
                </h2>
              </div>
              <p className="text-gray-600 mb-6 h-24 overflow-hidden">
                {service.description}
              </p>
              <Link
                to={service.link}
                className={`${service.linkColor} font-semibold 
                flex items-center transition duration-300 
                hover:gap-2 group`}
              >
                {service.linkText}
                <span className="ml-2 group-hover:translate-x-1 transition">
                  &rarr;
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 
            text-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Your Financial Future Starts Here
            </h3>
            <p className="text-xl mb-6">
              Unlock personalized financial insights and take control of your financial health
            </p>
            <Link
              to="/signup"
              className="bg-white text-indigo-600 px-8 py-3 
              rounded-full font-bold hover:bg-gray-100 
              transition duration-300 inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
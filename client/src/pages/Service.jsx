import { Link } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  Building2,
  TrendingUp,
  Brain,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

function Services() {
  const services = [
    {
      icon: Wallet,
      gradient: "from-blue-500 to-blue-700",
      title: "Expense Tracking",
      description: "Track your expenses seamlessly with intelligent categorization. Get real-time insights into your spending habits and identify areas for improvement.",
      link: "/services/expenses",
      linkText: "Manage Expenses",
      features: ["Auto-categorization", "Real-time sync", "Smart insights"]
    },
    {
      icon: PieChart,
      gradient: "from-emerald-500 to-emerald-700",
      title: "Smart Budgeting",
      description: "Create and manage budgets that adapt to your lifestyle. Set goals, monitor progress, and receive alerts when you're approaching limits.",
      link: "/services/budgets",
      linkText: "Create Budget",
      features: ["Goal setting", "Progress tracking", "Smart alerts"]
    },
    {
      icon: Building2,
      gradient: "from-purple-500 to-purple-700",
      title: "Bank Integration",
      description: "Securely connect your bank accounts for automatic transaction import. Powered by Plaid for bank-level security and reliability.",
      link: "/services/bank-accounts",
      linkText: "Connect Account",
      features: ["Secure connection", "Auto-import", "Multi-bank support"]
    },
    {
      icon: TrendingUp,
      gradient: "from-rose-500 to-rose-700",
      title: "Investment Tracking",
      description: "Monitor your investment portfolio across stocks, bonds, crypto, and more. Get detailed performance analytics and insights.",
      link: "/services/investments",
      linkText: "Track Investments",
      features: ["Portfolio analytics", "Performance metrics", "Asset allocation"]
    },
    {
      icon: Brain,
      gradient: "from-amber-500 to-amber-700",
      title: "AI Financial Advisor",
      description: "Get personalized financial advice powered by advanced AI. Receive tailored recommendations for savings, investments, and debt management.",
      link: "/ai-dashboard",
      linkText: "Get AI Advice",
      features: ["Personalized tips", "Smart predictions", "Goal optimization"]
    },
    {
      icon: Users,
      gradient: "from-indigo-500 to-indigo-700",
      title: "Family Finance",
      description: "Manage shared expenses and budgets with family members. Track contributions, split bills, and maintain financial transparency.",
      link: "/family",
      linkText: "Manage Family",
      features: ["Shared budgets", "Expense splitting", "Family insights"]
    }
  ];

  return (
    <div className="min-h-screen bg-mesh py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-6">
            <Sparkles className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="gradient-text-ocean">Our Financial Services</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Empowering your financial journey with cutting-edge technology and personalized solutions
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group glass-card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-success-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  to={service.link}
                  className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 group/link"
                >
                  <span>{service.linkText}</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-12 text-center shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-display font-bold text-white mb-4">
                Manage Family Finances Together
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Collaborate with family members, share budgets, split expenses, and achieve financial goals together
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/family"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 fade-in-up" style={{ animationDelay: '0.7s' }}>
          {[
            { icon: Shield, label: "Bank-Level Security", value: "256-bit SSL" },
            { icon: Users, label: "Active Users", value: "10,000+" },
            { icon: TrendingUp, label: "Avg. Savings", value: "$2,400/yr" },
            { icon: Sparkles, label: "AI Accuracy", value: "98%" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex p-3 bg-slate-100 rounded-xl mb-3">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Services;
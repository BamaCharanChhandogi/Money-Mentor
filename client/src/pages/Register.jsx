import { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, Calendar, Briefcase, DollarSign,
  Users, Home, Car, Shield, Sparkles, TrendingUp, CheckCircle
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    occupation: '',
    annualIncome: '',
    maritalStatus: '',
    dependents: '',
    ownHome: false,
    ownCar: false,
    healthConditions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await register(formData);
      if (response.success) {
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left Side - Branding (4 columns) */}
        <div className="hidden lg:block lg:col-span-4 space-y-8 fade-in-up">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-3xl font-display font-bold gradient-text-ocean">
              Money Mentor
            </Link>
            <h2 className="text-3xl font-bold text-slate-800 leading-tight">
              Start Your Financial Journey Today
            </h2>
            <p className="text-lg text-slate-600">
              Join thousands of users who are taking control of their financial future.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              "Personalized Financial Advice",
              "Smart Budget Tracking",
              "Investment Portfolio Management",
              "Family Finance Sharing"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-slate-700 font-medium">
                <span className="text-primary-500 font-bold">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 mt-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-0">
            <p className="text-sm font-medium text-slate-600 italic">
              "Money Mentor has completely transformed how I manage my expenses. Highly recommended!"
            </p>
            <div className="flex items-center mt-4 space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">JD</div>
              <div>
                <p className="text-xs font-bold text-slate-800">John Doe</p>
                <p className="text-xs text-slate-500">Early Adopter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form (8 columns) */}
        <div className="w-full lg:col-span-8 scale-in">
          <div className="glass-card p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8 lg:text-left">
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600">
                Enter your details to register
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2 fade-in-up">
                <Shield className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    icon={User}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    icon={Lock}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    icon={Calendar}
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Financial Profile Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Financial Profile</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    icon={Briefcase}
                    type="text"
                    name="occupation"
                    placeholder="Occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={DollarSign}
                    type="number"
                    name="annualIncome"
                    placeholder="Annual Income"
                    value={formData.annualIncome}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={Users}
                    type="text"
                    name="maritalStatus"
                    placeholder="Marital Status"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={Users}
                    type="number"
                    name="dependents"
                    placeholder="Number of Dependents"
                    value={formData.dependents}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Assets & Health Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Assets & Additional Info</h3>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="ownHome"
                      className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      checked={formData.ownHome}
                      onChange={handleChange}
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700 flex items-center">
                      <Home className="h-4 w-4 mr-1.5 text-slate-400" />
                      Own Home
                    </span>
                  </label>
                  <label className="flex items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="ownCar"
                      className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      checked={formData.ownCar}
                      onChange={handleChange}
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700 flex items-center">
                      <Car className="h-4 w-4 mr-1.5 text-slate-400" />
                      Own Car
                    </span>
                  </label>
                </div>

                <div className="relative mt-4">
                  <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    name="healthConditions"
                    placeholder="Health Conditions (Optional)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400 resize-none"
                    rows="2"
                    value={formData.healthConditions}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg shadow-xl shadow-primary-500/20"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-slate-400" />
    </div>
    <input
      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400"
      {...props}
    />
  </div>
);

export default Register;
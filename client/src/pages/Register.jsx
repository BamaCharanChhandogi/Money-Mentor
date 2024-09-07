import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Create Your Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-gray-700 font-semibold">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="occupation" className="block text-gray-700 font-semibold">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="annualIncome" className="block text-gray-700 font-semibold">Annual Income</label>
              <input
                type="number"
                id="annualIncome"
                name="annualIncome"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.annualIncome}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maritalStatus" className="block text-gray-700 font-semibold">Marital Status</label>
              <input
                type="text"
                id="maritalStatus"
                name="maritalStatus"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maritalStatus}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="dependents" className="block text-gray-700 font-semibold">Dependents</label>
              <input
                type="number"
                id="dependents"
                name="dependents"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dependents}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="ownHome"
              name="ownHome"
              className="mr-2"
              checked={formData.ownHome}
              onChange={handleChange}
            />
            <label htmlFor="ownHome" className="text-gray-700 font-semibold">Own Home</label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="ownCar"
              name="ownCar"
              className="mr-2"
              checked={formData.ownCar}
              onChange={handleChange}
            />
            <label htmlFor="ownCar" className="text-gray-700 font-semibold">Own Car</label>
          </div>

          <div className="mb-4">
            <label htmlFor="healthConditions" className="block text-gray-700 font-semibold">Health Conditions</label>
            <textarea
              id="healthConditions"
              name="healthConditions"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.healthConditions}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

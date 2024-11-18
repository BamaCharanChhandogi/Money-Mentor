/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import Alert, { AlertCircle, AlertTitle, AlertDescription } from '../ui/Alert';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../api';

const BudgetDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '', period: 'monthly' });
  const [error, setError] = useState('');
  const token=useSelector(state=>state.auth.token);
  
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${BASE_URL}/budgets`, {
        headers: {
          'Authorization': `Bearer ${token}` // Assume token is stored in localStorage
        }
      });
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      setError('Failed to load budgets. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const handlePeriodChange = (value) => {
    setNewBudget({ ...newBudget, period: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBudget)
      });
      if (!response.ok) throw new Error('Failed to create budget');
      fetchBudgets();
      setNewBudget({ category: '', amount: '', period: 'monthly' });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to create budget. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Budget Dashboard</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-4">
        <CardHeader>Add New Budget</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="category"
              value={newBudget.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <Input
              name="amount"
              type="number"
              value={newBudget.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              required
            />
            <Select onValueChange={handlePeriodChange} value={newBudget.period}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add Budget</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Budget Overview</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetDashboard;

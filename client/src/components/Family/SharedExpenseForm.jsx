import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-hot-toast";
import { PlusCircle, DollarSign, Users } from "lucide-react";

const SharedExpenses = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const { familyId } = useParams();

  // Fetch families
  useEffect(() => {
    const fetchFamilies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in again');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.data) {
          throw new Error('No data received from server');
        }

        const familiesData = response.data.families || [];
        setFamilies(familiesData);
        
        if (familyId) {
          const family = familiesData.find(f => f._id === familyId);
          if (family) {
            setSelectedFamily(family);
          } else {
            toast.error('Family not found');
          }
        }

      } catch (error) {
        console.error('Fetch error:', error);
        const errorMessage = error.response?.data?.message || 'Error fetching families';
        toast.error(errorMessage);
        
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, [familyId, navigate]);

  // Fetch shared expenses when family is selected
  useEffect(() => {
    const fetchSharedExpenses = async () => {
      if (!selectedFamily) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/shared-expenses/${selectedFamily._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data && Array.isArray(response.data.sharedExpenses)) {
          setSharedExpenses(response.data.sharedExpenses);
        } else {
          throw new Error('Invalid expenses data format');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error(error.response?.data?.message || "Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedExpenses();
  }, [selectedFamily]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !selectedFamily) return;

    const handleNewExpense = (newExpense) => {
      if (newExpense.familyGroup === selectedFamily._id) {
        setSharedExpenses((prev) => [...prev, newExpense]);
        toast.success("New expense added");
      }
    };

    const handleExpenseUpdated = (updatedExpense) => {
      if (updatedExpense.familyGroup === selectedFamily._id) {
        setSharedExpenses((prev) =>
          prev.map((expense) =>
            expense._id === updatedExpense._id ? updatedExpense : expense
          )
        );
        toast.success("Expense updated");
      }
    };

    socket.on("shared_expense_created", handleNewExpense);
    socket.on("shared_expense_updated", handleExpenseUpdated);

    return () => {
      socket.off("shared_expense_created", handleNewExpense);
      socket.off("shared_expense_updated", handleExpenseUpdated);
    };
  }, [socket, selectedFamily]);

  const handleFamilyChange = (familyId) => {
    const family = families.find((f) => f._id === familyId);
    setSelectedFamily(family);
    navigate(`/family/expenses/${familyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Shared Expenses
            </h2>
            {loading ? (
              <div className="animate-pulse h-10 w-48 bg-gray-200 rounded-lg"></div>
            ) : (
              families.length > 0 ? (
                <select
                  onChange={(e) => handleFamilyChange(e.target.value)}
                  value={selectedFamily?._id || ""}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Family</option>
                  {families.map((family) => (
                    <option key={family._id} value={family._id}>
                      {family.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-gray-500">
                  No families available. 
                  <button 
                    onClick={() => navigate('/family/create')}
                    className="ml-2 text-emerald-600 hover:text-emerald-700"
                  >
                    Create Family
                  </button>
                </div>
              )
            )}
          </div>

          {selectedFamily && (
            <>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="mb-6 flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                {showExpenseForm ? "Cancel" : "Add New Expense"}
              </button>

              {showExpenseForm && (
                <ExpenseForm
                  familyId={selectedFamily._id}
                  onSuccess={() => {
                    setShowExpenseForm(false);
                    toast.success("Expense added successfully");
                  }}
                />
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="animate-pulse bg-gray-100 rounded-xl p-6 h-48"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sharedExpenses.map((expense) => (
                    <ExpenseCard key={expense._id} expense={expense} />
                  ))}
                </div>
              )}

              {!loading && sharedExpenses.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No shared expenses yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ExpenseCard = ({ expense }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
            {expense.category}
          </span>
          <h3 className="mt-2 font-semibold text-lg">
            {expense.description}
          </h3>
        </div>
        <span className="text-xl font-bold text-emerald-600">
          ${expense.amount}
        </span>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Users className="w-4 h-4" />
          <span>Split Details</span>
        </div>
        <div className="space-y-2">
          {expense.splits?.map((split) => (
            <div
              key={split._id}
              className="flex justify-between text-sm"
            >
              <span>{split.user?.name}</span>
              <span
                className={`
                ${
                  split.status === "pending"
                    ? "text-yellow-600"
                    : split.status === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }
                font-medium
              `}
              >
                ${split.amount} • {split.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpenseForm = ({ familyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    splitType: "equal",
  });
  const [submitting, setSubmitting] = useState(false);
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/shared-expenses`,
        { ...formData, familyGroupId: familyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (socket) {
        socket.emit("create_shared_expense", {
          familyGroupId: familyId,
          ...response.data.sharedExpense,
        });
      }

      onSuccess();
      setFormData({
        amount: "",
        category: "",
        description: "",
        splitType: "equal",
      });
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(error.response?.data?.message || "Error creating expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select Category</option>
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split Type
          </label>
          <select
            value={formData.splitType}
            onChange={(e) =>
              setFormData({ ...formData, splitType: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="equal">Split Equally</option>
            <option value="percentage">Split by Percentage</option>
            <option value="custom">Custom Split</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`mt-6 w-full bg-emerald-500 text-white py-2 px-4 rounded-lg transition-colors ${
          submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'
        }`}
      >
        {submitting ? 'Creating...' : 'Create Expense'}
      </button>
    </form>
  );
};

export default SharedExpenses;
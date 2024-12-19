import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { toast } from 'react-hot-toast';
import { PlusCircle, DollarSign, Users } from 'lucide-react';

const FamilyDashboard = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  // Fetch family groups
  useEffect(() => {
    const fetchFamilies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFamilies(response.data.families);
      } catch (error) {
        toast.error('Error fetching families');
        console.error('Error fetching families:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  // Fetch shared expenses when family is selected
  useEffect(() => {
    const fetchSharedExpenses = async () => {
      if (!selectedFamily) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${BASE_URL}/shared-expenses/${selectedFamily._id}`,
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
    if (!socket) return;

    const handleSharedExpenseCreated = (newExpense) => {
      if (newExpense.familyGroup === selectedFamily?._id) {
        setSharedExpenses((prev) => [...prev, newExpense]);
        toast.success("New expense added");
      }
    };

    const handleSharedExpenseUpdated = (updatedExpense) => {
      if (updatedExpense.familyGroup === selectedFamily?._id) {
        setSharedExpenses((prev) =>
          prev.map((expense) =>
            expense._id === updatedExpense._id ? updatedExpense : expense
          )
        );
        toast.success("Expense updated");
      }
    };

    socket.on('shared_expense_created', handleSharedExpenseCreated);
    socket.on('shared_expense_updated', handleSharedExpenseUpdated);

    return () => {
      socket.off('shared_expense_created', handleSharedExpenseCreated);
      socket.off('shared_expense_updated', handleSharedExpenseUpdated);
    };
  }, [socket, selectedFamily]);

  // Join family group room when selected
  useEffect(() => {
    if (selectedFamily && socket) {
      socket.emit('join_family_group', selectedFamily._id);
      
      // Fetch family members when a family is selected
      const fetchFamilyMembers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BASE_URL}/family-groups/${selectedFamily._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFamilyMembers(response.data.family.members);
        } catch (error) {
          toast.error('Error fetching family members');
          console.error('Error fetching family members:', error);
        }
      };

      fetchFamilyMembers();
    }
  }, [selectedFamily, socket]);
  
  const handleInviteMember = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/family-groups/${selectedFamily._id}/members`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit socket event for invitation
      if (socket) {
        socket.emit('invite_member', {
          familyGroupId: selectedFamily._id,
          email: inviteEmail,
          inviterName: response.data.inviterName
        });
      }

      setInviteEmail('');
      toast.success('Member invited successfully!');
    } catch (error) {
      toast.error('Error inviting member');
      console.error('Error inviting member:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 shadow-xl py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Family</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Family
            </label>
            <select
              onChange={(e) => setSelectedFamily(families.find(f => f._id === e.target.value))}
              value={selectedFamily?._id || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a family group</option>
              {families.map(family => (
                <option key={family._id} value={family._id}>{family.name}</option>
              ))}
            </select>
          </div>

          {selectedFamily && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Family Members Section */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Invite Member</h3>
                    <div className="flex gap-4">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter email address"
                      />
                      <button
                        onClick={handleInviteMember}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Invite
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Family Members</h3>
                    <div className="space-y-3">
                      {familyMembers.map(member => (
                        <div
                          key={member.user._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">
                                {member.user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{member.user.name}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shared Expenses Section */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Shared Expenses</h3>
                    <button
                      onClick={() => setShowExpenseForm(!showExpenseForm)}
                      className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <PlusCircle className="w-5 h-5" />
                      {showExpenseForm ? "Cancel" : "Add Expense"}
                    </button>
                  </div>

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
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="animate-pulse bg-gray-100 rounded-xl p-6 h-32"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sharedExpenses.length === 0 ? (
                        <div className="text-center py-8">
                          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No shared expenses yet</p>
                        </div>
                      ) : (
                        sharedExpenses.map((expense) => (
                          <ExpenseCard key={expense._id} expense={expense} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
        `${BASE_URL}/shared-expenses`,
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
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-4">
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
            <option value="entertainment">Entertainment</option><option value="other">Other</option>
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

export default FamilyDashboard;
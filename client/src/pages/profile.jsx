import { useEffect, useState } from "react";
import { fetchUser, editUser, deleteUser } from "../api";
import { logoutSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  UserCircle2, 
  Edit2, 
  LogOut, 
  Save, 
  X, 
  Trash2 
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData.user);
        setFormData(userData.user);
      } catch (err) {
        navigate("/login");
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(formData);
      setUser(formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user data");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  
    if (confirmed) {
      try {
        await deleteUser();
        dispatch(logoutSuccess());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } catch (err) {
        setError("Failed to delete user data");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <UserCircle2 className="text-white w-12 h-12" />
              <h2 className="text-2xl font-bold text-white">
                Welcome, {user.name}
              </h2>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                title={isEditing ? "Cancel" : "Edit Profile"}
              >
                {isEditing ? <X className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
              </button>
              <button 
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Phone", name: "phone", type: "tel" },
                      { label: "Date of Birth", name: "dateOfBirth", type: "date" }
                    ].map(({ label, name, type }) => (
                      <div key={name} className="flex flex-col">
                        <label className="text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Occupation", name: "occupation", type: "text" },
                      { label: "Annual Income", name: "annualIncome", type: "number" },
                      { label: "Marital Status", name: "maritalStatus", type: "text" },
                      { label: "Dependents", name: "dependents", type: "number" }
                    ].map(({ label, name, type }) => (
                      <div key={name} className="flex flex-col">
                        <label className="text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center">
                      <label className="text-gray-700">Own Home</label>
                      <input
                        type="checkbox"
                        name="ownHome"
                        checked={formData.ownHome || false}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-gray-700">Own Car</label>
                      <input
                        type="checkbox"
                        name="ownCar"
                        checked={formData.ownCar || false}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information Display */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Personal Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Name", value: user.name },
                    { label: "Email", value: user.email },
                    { label: "Phone", value: user.phone || "N/A" },
                    { 
                      label: "Date of Birth", 
                      value: user.dateOfBirth 
                        ? new Date(user.dateOfBirth).toLocaleDateString() 
                        : "N/A" 
                    }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-700 font-medium">{label}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details Display */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Occupation", value: user.occupation || "N/A" },
                    { 
                      label: "Annual Income", 
                      value: user.annualIncome 
                        ? `$${user.annualIncome.toLocaleString()}` 
                        : "N/A" 
                    },
                    { label: "Marital Status", value: user.maritalStatus || "N/A" },
                    { label: "Dependents", value: user.dependents || "N/A" },
                    { label: "Own Home", value: user.ownHome ? "Yes" : "No" },
                    { label: "Own Car", value: user.ownCar ? "Yes" : "No" }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-700 font-medium">{label}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Close My Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
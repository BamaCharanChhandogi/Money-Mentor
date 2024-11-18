/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchUser, editUser, deleteUser } from "../api"; // Adjust the import path as necessary
import { logoutSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
        setFormData(userData.user); // Initialize form data with user data
      } catch (err) {
        navigate("/login");
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem("token"); // Remove token from localStorage
    // reload
    navigate("/login");
    window.location.reload();
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(formData);
      setUser(formData); // Update user state with new data
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
  

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-600">{error}</p>;
      </div>
    );

  return (
    <div className=" min-h-screen p-6 bg-slate-800">
      <div className="relative max-w-4xl mx-auto rounded-lg shadow-lg p-8 mt-12 bg-gradient-to-r from-blue-400 via-pink-500 to-blue-500">
        {/* Edit button positioned in the top-right corner */}
        <div className="flex justify-end gap-4">
          <button
            className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-pink-200 transition duration-300"
            onClick={handleEditClick}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-pink-200 transition duration-300 "
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Profile
        </h2>
        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label htmlFor="name" className="text-gray-700">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="email" className="text-gray-700">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="phone" className="text-gray-700">
                      Phone:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="dateOfBirth" className="text-gray-700">
                      Date of Birth:
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Additional Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label htmlFor="occupation" className="text-gray-700">
                      Occupation:
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation || ""}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="annualIncome" className="text-gray-700">
                      Annual Income:
                    </label>
                    <input
                      type="number"
                      id="annualIncome"
                      name="annualIncome"
                      value={formData.annualIncome || ""}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="maritalStatus" className="text-gray-700">
                      Marital Status:
                    </label>
                    <input
                      type="text"
                      id="maritalStatus"
                      name="maritalStatus"
                      value={formData.maritalStatus || ""}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="dependents" className="text-gray-700">
                      Dependents:
                    </label>
                    <input
                      type="number"
                      id="dependents"
                      name="dependents"
                      value={formData.dependents || ""}
                      onChange={handleInputChange}
                      className="text-gray-600 border p-2 rounded"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="ownHome" className="text-gray-700">
                      Own Home:
                    </label>
                    <input
                      type="checkbox"
                      id="ownHome"
                      name="ownHome"
                      checked={formData.ownHome || false}
                      onChange={(e) =>
                        setFormData({ ...formData, ownHome: e.target.checked })
                      }
                      className="text-gray-600"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="ownCar" className="text-gray-700">
                      Own Car:
                    </label>
                    <input
                      type="checkbox"
                      id="ownCar"
                      name="ownCar"
                      checked={formData.ownCar || false}
                      onChange={(e) =>
                        setFormData({ ...formData, ownCar: e.target.checked })
                      }
                      className="text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <strong className="text-gray-700">Name:</strong>
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Email:</strong>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Phone:</strong>
                  <span className="text-gray-600">{user.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Date of Birth:</strong>
                  <span className="text-gray-600">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Additional Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <strong className="text-gray-700">Occupation:</strong>
                  <span className="text-gray-600">
                    {user.occupation || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Annual Income:</strong>
                  <span className="text-gray-600">
                    ${user.annualIncome?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Marital Status:</strong>
                  <span className="text-gray-600">
                    {user.maritalStatus || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Dependents:</strong>
                  <span className="text-gray-600">
                    {user.dependents || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Own Home:</strong>
                  <span className="text-gray-600">
                    {user.ownHome ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Own Car:</strong>
                  <span className="text-gray-600">
                    {user.ownCar ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
           
          </div>
        )}
         <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-pink-200 transition duration-300 "
                onClick={handleDelete}
              >
                Close My Account
              </button>
            </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { adminCreateUser, getAllUsers, updateUser, deleteUser } from "../../../api/users";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
import AdminNavBar from "../../../components/layout/AdminNavBar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password_hash: "",
    role: "user",
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ status: 'none', color: 'text-gray-400', text: '' });
  const [error, setError] = useState(''); 

  // Password strength checker
  const getPasswordStrength = (password) => {
    const minLength = 8;
    const hasAlphaNumeric = /[a-zA-Z]/.test(password) && /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length === 0) {
      return { status: 'none', color: 'text-gray-400', text: '' };
    } else if (password.length < minLength) {
      return { status: 'weak', color: 'text-red-500', text: `Weak: Must be at least ${minLength} characters.` };
    } else if (password.length >= minLength && hasAlphaNumeric && hasSpecialChar) {
      return { status: 'strong', color: 'text-green-500', text: 'Strong: Excellent password.' };
    } else if (password.length >= minLength && hasAlphaNumeric) {
      return { status: 'good', color: 'text-yellow-500', text: 'Good: Add a special character for max strength.' };
    } else {
      return { status: 'weak', color: 'text-red-500', text: 'Weak: Requires letters, numbers, and at least 8 characters.' };
    }
  };

  const [editId, setEditId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Validate form before submit
  const isFormValid = () => {
    const { first_name, last_name, email, password_hash, role } = formData;
    if (!first_name || !last_name || !email || !password_hash || !role) {
      alert("Please fill in all fields.");
      return false;
    }
    return true;
  };

  // CREATE USER SUBMISSION
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return; // Stop submission if invalid
    try {
      await adminCreateUser(formData);
      setShowPopup(false);
      setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
      setPasswordStrength({ status: 'none', color: 'text-gray-400', text: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  // UPDATE USER
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.role) {
      alert("Please fill in all fields.");
      return;
    }
    await updateUser(editId, formData);
    setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.user_id || user.id);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email || "",
      password_hash: "",
    });
    setPasswordStrength({ status: 'none', color: 'text-gray-400', text: '' });
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
  };

  return (
    <div className="min-h-screen bg-black-50">
      <AdminNavBar />
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-4">User Management</h1>

        {/* Search and buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-full md:w-1/3">
            <Search size={18} className="text-gray-500" />
            <input className="ml-2 w-full outline-none" placeholder="Search" type="text" />
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border text-black rounded-lg bg-white">Role</button>
            <button className="px-4 py-2 border text-black rounded-lg bg-white">Status</button>

            <button
              onClick={() => setShowPopup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} /> Create User
            </button>
          </div>
        </div>

        {/* UPDATE FORM */}
        {editId !== null && (
          <div className="bg-gray-700 shadow-md rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="border p-3 rounded-lg"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
              <select
                className="border p-3 rounded-lg hover:bg-gray-600"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <div className="col-span-full flex gap-3 mt-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Update</button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-black-600 shadow-lg rounded-xl overflow-hidden text-white">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Role</th>
                <th className="pl-20 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-t hover:bg-gray-600">
                  <td className="p-4">{u.first_name} {u.last_name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 pr-40">{u.status}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4 pl-20 flex gap-2">
                    <button onClick={() => handleEdit(u)} className="px-3 py-1 bg-green-800 text-white rounded-lg flex items-center gap-1">
                      <Pencil size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(u.user_id)} className="px-3 py-1 bg-red-700 text-white rounded-lg flex items-center gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP SIGNUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-[400px] shadow-xl relative">
            <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 text-gray-300 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input type="text" placeholder="First Name" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
              <input type="text" placeholder="Last Name" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
              <input type="email" placeholder="Email" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <input type="password" placeholder="Password" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.password_hash} onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, password_hash: value });
                  setPasswordStrength(getPasswordStrength(value));
                }} required />
              <p className={`text-sm mt-2 font-medium ${passwordStrength.color}`}>{passwordStrength.text}</p>
              
              <label className="mt-2 font-medium">Choose Role:</label>
              <select className="p-3 rounded-lg bg-gray-700 border border-gray-600" value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => {setShowPopup(false)
                  setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
                  setPasswordStrength({ status: 'none', color: 'text-gray-400', text: '' });
                  setError('');
                }} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

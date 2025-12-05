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

  const [passwordStrength, setPasswordStrength] = useState({ status: 'none', color: 'text-gray-400', text: '' });
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  console.log(users)

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || u.role?.toLowerCase() === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      String(u.active_status).toLowerCase() === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const isFormValid = () => {
    const { first_name, last_name, email, password_hash, role } = formData;
    if (!first_name || !last_name || !email || !password_hash || !role) {
      alert("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.role) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await updateUser(editId, formData);
      setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
      setEditId(null);
      fetchUsers();
      setError(null);
    } catch (err) {
      window.alert(err.response?.data?.detail || "Something went wrong.");
    }
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
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      window.alert(err.response?.data?.detail || "Something went wrong.");
    }
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
        <p className="mb-5">Manage users and their access.<br></br>
          View, add, update, and delete users in your system. Control roles, and permissions from one place.</p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          {/* SEARCH BAR */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-full md:w-1/3">
            <Search size={18} className="text-gray-500" />
            <input
              className="ml-2 w-full outline-none text-black"
              placeholder="Search name or email..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* FILTER DROPDOWNS */}
          <div className="flex gap-3">

            {/* Role Dropdown */}
            <select
              className="px-4 py-2 border text-black rounded-lg bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            {/* Status Dropdown */}
            <select
              className="px-4 py-2 border text-black rounded-lg bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

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
            <div className="flex flex-row">
              <Pencil />
              <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            </div>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Name */}
              <div className="flex flex-col">
                <label className="mb-1 text-white font-medium">First Name</label>
                <input
                  className="border p-3 rounded-lg"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="mb-1 text-white font-medium">Last Name</label>
                <input
                  className="border p-3 rounded-lg"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label className="mb-1 text-white font-medium">Role</label>
                <select
                  className="border p-3 rounded-lg hover:bg-gray-600"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="col-span-full flex gap-3 mt-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Update</button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-black-600 shadow-lg rounded-xl overflow-hidden text-white">
          <div className="max-h-150 overflow-y-auto">
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
                {filteredUsers.map((u) => (
                  <tr key={u.user_id} className="border-t hover:bg-gray-600">
                    <td className="p-4 pr-20">{u.first_name} {u.last_name}</td>
                    <td className="p-4 pr-15">{u.email}</td>
                    <td className="p-4 pr-35">{
                      u.active_status === false ? (<span className="text-gray-500">Inactive</span>) : 
                      (<span className="text-green-400">Active</span>)
                      
                      }</td>
                    <td className="p-4">{u.role}</td>
                    <td className="py-4 px-7 flex justify-end gap-2">
                      <button onClick={() => handleEdit(u)}
                        className="px-3 py-1 bg-green-800 text-white rounded-lg flex items-center gap-1">
                        <Pencil size={16} /> Edit
                      </button>

                      <button onClick={() => handleDelete(u.user_id)}
                        className="px-3 py-1 bg-red-700 text-white rounded-lg flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-[400px] shadow-xl relative">
            <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 text-gray-300 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input type="text" placeholder="First Name" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />

              <input type="text" placeholder="Last Name" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />

              <input type="email" placeholder="Email" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

              <input type="password" placeholder="Password" className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.password_hash}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, password_hash: value });
                  setPasswordStrength(getPasswordStrength(value));
                }} />

              <p className={`text-sm mt-2 font-medium ${passwordStrength.color}`}>{passwordStrength.text}</p>

              <label className="mt-2 font-medium">Choose Role:</label>
              <select className="p-3 rounded-lg bg-gray-700 border border-gray-600"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setFormData({ first_name: "", last_name: "", email: "", password_hash: "", role: "user" });
                    setPasswordStrength({ status: 'none', color: 'text-gray-400', text: '' });
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">
                  Cancel
                </button>

                <button type="submit" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

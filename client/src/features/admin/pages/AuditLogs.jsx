import React, { useEffect, useState } from "react";
import { adminCreateUser, getAllUsers, updateUser, deleteUser } from "../../../api/users";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import AdminNavBar from "../../../components/layout/AdminNavBar";

    export default function UserCRUD() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });
    const [editId, setEditId] = useState(null);

    const fetchUsers = async () => {
        const res = await getAllUsers();
        setUsers(res || []);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
        await updateUser(editId, formData);
        } else {
        await adminCreateUser(formData);
        }
        setFormData({ first_name: "", last_name: "", email: "" });
        setEditId(null);
        fetchUsers();
    };

    const handleEdit = (user) => {
        setEditId(user.id);
        setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    };

    const handleCancel = () => {
        setEditId(null);
        setFormData({ first_name: "", last_name: "", email: "" });
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

  return (
    <div className="min-h-screen bg-grey-50">
      <AdminNavBar />

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">

        {/* CREATE / UPDATE FORM */}
        <div className="lg:col-span-1 bg-grey rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white-800 flex items-center gap-2">
            {editId ? "Edit User" : "Create User"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white transition ${
                  editId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Plus size={18} /> {editId ? "Update User" : "Create User"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>
       {/* USERS TABLE */}
            <div className="lg:col-span-2 bg-grey rounded-2xl shadow-lg p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold text-white-800 mb-4">Users</h2>

            <table className="min-w-full text-left border-collapse">
                <thead>
                <tr className="bg-grey-50 text-white-700 uppercase text-sm font-medium">
                    <th className="p-4 rounded-tl-lg">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 rounded-tr-lg">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b transition">
                    <td className="p-4">{user.first_name} {user.last_name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 flex gap-2">
                        <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                        Update
                        </button>

                        <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>


      </div>
    </div>
  );
}

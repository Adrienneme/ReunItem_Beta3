import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import profile from '../../../assets/icons/usericon.png'

const AdminSettings = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    first_name: "",
    last_name: "",
    email: ""
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out!");
    navigate('/login');
  };

  return (
    <div>
      <AdminNavBar />

      <div className="flex justify-center items-center mb-10">
        <div className="mt-7 w-full max-w-md p-6 bg-gray-900 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 mt-5 text-center"><b>Settings:</b></h2>
          <div className='flex flex-col items-center justify-center'>
            <img
              src={profile}
              alt="Profile"
              className='w-30'
            />
            <h2 className="text-2xl font-semibold mb-6 mt-5">Admin</h2>
          </div>

          <div className="text-center">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
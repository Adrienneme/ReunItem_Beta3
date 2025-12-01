import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.png"; // keep your logo
import { Home, Settings, ClipboardList , Users, UserCircle } from "lucide-react";

const AdminNavBar = ({ name = "Username", profile }) => {
  const user = JSON.parse(localStorage.getItem("user" || {}));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-t from-[#283c86] to-[#45a247] text-white flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 sm:px-10 py-3 sm:h-24 shadow-lg">

      {/* TOP USER SECTION */}
      <div className="flex items-center justify-between sm:justify-start sm:space-x-4 w-full sm:w-auto">
        <div className="flex items-center space-x-3">

          {/* USER ICON — fallback if no profile image */}
          {profile ? (
            <img
              src={profile}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          )}

          <h3 className="font-semibold text-lg sm:text-xl">
            Welcome {user.first_name || name || "Guest"}!
          </h3>
        </div>

        {/* MOBILE LOGO */}
        <div className="flex sm:hidden items-center space-x-2">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <h3 className="text-3xl font-bold">ReunItem</h3>
        </div>
      </div>

      {/* DESKTOP LOGO */}
      <div className="hidden sm:flex flex-row items-center space-y-1">
        <img src={logo} alt="ReunItem logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        <h3 className="text-xl sm:text-2xl font-bold tracking-wide">ReunItem</h3>
      </div>

      {/* NAV MENU */}
      <div className="flex justify-around sm:justify-end items-center space-x-4 sm:space-x-10 mt-3 sm:mt-0 w-full sm:w-auto">

        <Link to="/admin/home" className="flex flex-col items-center hover:text-yellow-300 transition">
          <Home className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0">Home</span>
        </Link>

        <Link to="/admin/usermanage" className="flex flex-col items-center hover:text-yellow-300 transition">
          <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0">User Manage</span>
        </Link>

        <Link to="/admin/auditlog" className="flex flex-col items-center hover:text-yellow-300 transition">
          <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0">Audit Logs</span>
        </Link>

        <Link to="/admin/adminsettings" className="flex flex-col items-center hover:text-yellow-300 transition">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0">Settings</span>
        </Link>

      </div>
    </nav>
  );
};

export default AdminNavBar;

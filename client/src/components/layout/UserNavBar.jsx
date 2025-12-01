import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.png";
import { Home, FolderOpen, Settings, UserCircle } from "lucide-react";

const UserNavBar = ({ name = "Username", profile }) => {
  const user = JSON.parse(localStorage.getItem("user" || {}));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-t from-[#283c86] to-[#45a247] text-white flex flex-wrap items-center justify-between px-10 py-3 shadow-lg">
      
      {/* User Info */}
      <div className="flex items-center flex-shrink-0 space-x-3 min-w-0">
        {profile ? (
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white flex-shrink-0"
          />
        ) : (
          <UserCircle className="w-10 h-10 text-white flex-shrink-0" />
        )}

        <h3 className="font-semibold text-lg truncate">
          Welcome {user.first_name || name || "Guest"}!
        </h3>
      </div>

      {/* Center Logo */}
      <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
        <img src={logo} alt="ReunItem logo" className="w-10 h-10 object-contain" />
        <h3 className="text-3xl font-bold truncate">ReunItem</h3>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center items-center space-x-4 mt-2 w-full sm:w-auto flex-shrink-0 gap-4">

        {/* Home */}
        <Link
          to="/user/home"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[60px]"
        >
          <Home className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">Home</span>
        </Link>

        {/* My Entries */}
        <Link
          to="/user/entries"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[80px]"
        >
          <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">My Entries</span>
        </Link>

        {/* Settings */}
        <Link
          to="/user/settings"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[80px]"
        >
          <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">Settings</span>
        </Link>

      </div>
    </nav>
  );
};

export default UserNavBar;

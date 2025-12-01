import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import folder from "../../assets/icons/folder.png";
import home from "../../assets/icons/home.png";
import settings from "../../assets/icons/setting.png";
import logo from "../../assets/icons/logo.png";
import usericon from "../../assets/icons/usericon.png";

const UserNavBar = ({ name = "Username", profile = usericon }) => {
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
      {/* Top Section / Left: Profile */}
      <div className="flex items-center flex-shrink-0 space-x-3 min-w-0">
        <img
          src={profile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white flex-shrink-0"
        />
        <h3 className="font-semibold text-lg truncate">
          Welcome {user.first_name || name || "Guest"}!
        </h3>
      </div>

      {/* Center Logo */}
      <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
        <img src={logo} alt="ReunItem logo" className="w-10 h-10 object-contain" />
        <h3 className="text-3xl font-bold truncate">ReunItem</h3>
      </div>

      {/* Menu Links */}
      <div className="flex flex-wrap justify-center items-center space-x-4 mt-2 w-full sm:w-auto flex-shrink-0 gap-4">
        <Link
          to="/user/home"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[60px]"
        >
          <img src={home} alt="Home" className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">Home</span>
        </Link>

        <Link
          to="/user/entries"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[80px]"
        >
          <img src={folder} alt="Entries" className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">My Entries</span>
        </Link>

        <Link
          to="/user/settings"
          className="flex flex-col items-center hover:text-yellow-300 transition-colors duration-200 min-w-[80px]"
        >
          <img src={settings} alt="Settings" className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm sm:text-base mt-0 truncate">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default UserNavBar;

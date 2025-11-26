import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../../components/layout/UserNavBar";
import { logoutUser } from "../../../api/users";
import { User2, Mail, LogOut, Palette, Globe, HelpCircle, FileText,
          Info, FileSignature, Star,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    first_name: "",
    last_name: "",
    email: "",
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-gray-100">
      <UserNavBar />

      <div className="flex justify-center px-4 mt-12">
        <div className="w-full max-w-lg">

          {/* Header */}
          <h2 className="text-3xl font-bold text-left mb-10">
            Settings:
          </h2>

          {/* Profile */}
          <div className="flex flex-row items-center mb-12">
            <div className="p-4 bg-gray-800 rounded-full">
              <User2 size={64} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-semibold mt-4 ml-5">
              user
            </h3>
          </div>

          {/* ---------- ACCOUNT INFO ---------- */}
          <div className="space-y-4 mb-10">
            <p className="text-sm uppercase tracking-wide text-gray-400">
              Account
            </p>

            <div className="flex items-center gap-3">
              <User2 size={18} className="text-green-300" />
              <p>
                <span className="font-medium">Full Name:</span>{" "}
                {user.first_name} {user.last_name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-green-300" />
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user.email}
              </p>
            </div>
          </div>

          {/* ---------- GENERAL SETTINGS (UI-only) ---------- */}
          <div className="space-y-6 mb-12">
            <p className="text-sm uppercase tracking-wide text-gray-400">
              General
            </p>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <Palette size={18} />
              <span>Appearance (Light / Dark Mode)</span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <Globe size={18} />
              <span>Language</span>
            </div>
          </div>

          {/* ---------- SUPPORT ---------- */}
          <div className="space-y-6 mb-12">
            <p className="text-sm uppercase tracking-wide text-gray-400">
              Support
            </p>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <HelpCircle size={18} />
              <span>Help & FAQ</span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <Star size={18} />
              <span>Rate This App</span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <FileSignature size={18} />
              <span>Send Feedback</span>
            </div>
          </div>

          {/* ---------- APP INFO ---------- */}
          <div className="space-y-4 mb-12">
            <p className="text-sm uppercase tracking-wide text-gray-400">
              App Info
            </p>

            <div className="flex items-center gap-3">
              <Info size={18} className="text-green-300" />
              <span>App Version: 1.0.0</span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <FileText size={18} />
              <span>Terms & Privacy Policy</span>
            </div>
          </div>

          {/* ---------- LOGOUT ---------- */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-3 mt-6 
              bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition mb-10"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;

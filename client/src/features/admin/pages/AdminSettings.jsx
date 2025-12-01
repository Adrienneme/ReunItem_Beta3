import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import profile from "../../../assets/icons/usericon.png";
import { backupAllTables, restoreAllTables } from "../../../api/admin";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out!");
    navigate("/login");
  };

  // ---------------- Backup ----------------
  const handleBackup = async () => {
    if (!window.confirm("Are you sure you want to download a full backup?")) return;

    setLoading(true);
    try {
      const res = await backupAllTables();

      // Convert response data to Blob for download
      const blob = new Blob([res.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `full_backup_${new Date().toISOString().replace(/[:.]/g, "_")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      alert("Backup downloaded successfully!");
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Backup failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Restore ----------------
  const handleRestore = async () => {
    if (!window.confirm("Are you sure you want to restore the latest backup?")) return;

    setLoading(true);
    try {
      const res = await restoreAllTables(); // Calls backend to restore latest backup
      alert(res.message || "Restore completed successfully!");
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Restore failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavBar />
      <div className="flex justify-center items-center mb-10">
        <div className="mt-7 w-full max-w-md p-6 bg-gray-900 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 mt-5 text-center">
            <b>Settings:</b>
          </h2>

          <div className="flex flex-col items-center justify-center">
            <img src={profile} alt="Profile" className="w-30" />
            <h2 className="text-2xl font-semibold mb-6 mt-5">Admin</h2>
          </div>

          {/* Backup Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleBackup}
              disabled={loading}
              className={`px-6 py-2 rounded text-white mb-3 transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Processing..." : "Download Backup"}
            </button>
          </div>

          {/* Restore Button */}
          <div className="text-center">
            <button
              onClick={handleRestore}
              disabled={loading}
              className={`px-6 py-2 rounded text-white transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading ? "Processing..." : "Restore Latest Backup"}
            </button>
          </div>

          {/* Logout Button */}
          <div className="text-center mt-4">
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

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import profile from "../../../assets/icons/usericon.png";
import { backupAllTables, restoreAllTables } from "../../../api/admin";

const AdminSettings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

  // ===================== Logout=======
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out!");
    navigate("/login");
  };

  // ===================== Backup===============
  const handleBackup = async () => {
    if (!window.confirm("Are you sure you want to download a full backup?")) return;

    setLoading(true);
    try {
      const res = await backupAllTables();

      const blob = new Blob([res.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `full_backup_${new Date().toISOString().replace(/[:.]/g, "_")}.json`;
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

  // ===================== Restore =========
  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    if (!window.confirm("Are you sure you want to restore this backup? This will overwrite existing data.")) return;

    setLoading(true);
    try {
      await restoreAllTables(file);
      alert("Database restored successfully!");
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Restore failed. Check console for details.");
    } finally {
      setLoading(false);
      e.target.value = null; // reset file input
    }
  };

  return (
    <div>
      <AdminNavBar />
      <div className="flex justify-center items-center mb-10">
        <div className="mt-7 w-full max-w-md p-6 bg-gray-900 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 mt-5 text-center"><b>Settings:</b></h2>
          <div className="flex flex-col items-center justify-center">
            <img src={profile} alt="Profile" className="w-30" />
            <h2 className="text-2xl font-semibold mb-6 mt-5">Admin</h2>
          </div>

          {/* BACKUP BUTTON */}
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

          {/* RESTORE (UPLOAD FILE) */}
          <div className="text-center">
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              hidden
              onChange={handleRestore}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              className={`px-6 py-2 rounded text-white transition ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading ? "Processing..." : "Restore Database"}
            </button>
          </div>

          {/* LOGOUT */}
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

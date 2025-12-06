import React, { useState, useEffect } from "react"; // FIXED: added useEffect, removed duplicate import
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../../components/layout/AdminNavBar";
import { logoutUser } from "../../../api/users";
import formatBackupName from "../ui/formatBackupName";
import LinearLoad from "../../../components/ui/LinearLoad";

import { backupAllTables, restoreAllTables, getBackupList } from "../../../api/admin";

import {
  User2, Mail, LogOut, Palette, Globe,
  FileText, Info, ArrowLeft, HardDrive, X
} from "lucide-react";

const AdminSettings = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    first_name: "",
    last_name: "",
    email: "",
  };

  const [showBackupPanel, setShowBackupPanel] = useState(false); // ADDED
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [backupList, setBackupList] = useState([]); // For metadata list

  const handleLogout = async () => {
    const res = JSON.parse(localStorage.getItem("user"));
    const user_id = res?.user_id
    console.log(user_id)
    await logoutUser(user_id);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  //Metadata list
  useEffect(() => {
    const fetchBackupList = async () => {
      try {
        const res = await getBackupList();
        setBackupList(res.backups || []);
        console.log(res.backups)
      } catch (err) {
        console.error(err);
        setBackupList([]);
      }
    };

    fetchBackupList();
  }, []);

  //Backup function
  const handleBackup = async () => {
    if (!window.confirm("Download full system backup?")) return;

    setLoadingBackup(true);
    try {
      await backupAllTables();
      alert("Backup downloaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Backup failed. Check console.");
    } finally {
      setLoadingBackup(false);
    }
  };

  //Restore function
  const handleRestore = async () => {
    if (
      !window.confirm(
        "Restore the latest backup? This will overwrite existing data."
      )
    )
      return;

    setLoadingRestore(true);
    try {
      const res = await restoreAllTables();
      alert(res?.message || "Restore completed successfully!");
    } catch (error) {
      console.error(error);
      alert("Restore failed. Check console.");
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <div>
      <AdminNavBar />

      {/* MAIN PAGE LAYOUT – NOW SUPPORTS RIGHT-SIDE PANEL */}
      <div className="flex justify-left ml-25 px-4 mt-12 relative">

        {/* LEFT COLUMN: SETTINGS CONTENT */}
        <div className="w-full max-w-lg">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-green-300 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h2 className="text-3xl font-bold text-left mb-10">Settings:</h2>

          {/* Profile */}
          <div className="flex flex-row items-center mb-12">
            <div className="p-4 bg-gray-800 rounded-full">
              <User2 size={64} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-semibold mt-4 ml-5">
              {user.first_name}
            </h3>
          </div>

          {/* ACCOUNT INFO */}
          <div className="space-y-4 mb-10">
            <p className="text-sm uppercase tracking-wide text-gray-400">Account</p>

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

          {/* GENERAL */}
          <div className="space-y-6 mb-12">
            <p className="text-sm uppercase tracking-wide text-gray-400">General</p>

            <div className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition">
              <Globe size={18} />
              <span>Language</span>
            </div>

            {/* BACKUP BUTTON — ADDED */}
            <div
              onClick={() => setShowBackupPanel(true)}
              className="flex items-center gap-3 cursor-pointer hover:text-green-300 transition"
            >
              <HardDrive size={18} />
              <span>Backup & Restore</span>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-3 mt-6 
              bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition mb-10"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

        {/* RIGHT-SIDE BACKUP PANEL (INLINE, NOT POPUP) */}
        {showBackupPanel && (
          <div className="absolute right-0 top-0 w-[500px] h-full bg-gray-900 text-white p-6 shadow-2xl rounded-l-xl">

            <div className="flex justify-between items-center mb-6">
              <HardDrive size={35} />
              <h2 className="text-2xl font-bold">Backup & Restore</h2>

              <button onClick={() => setShowBackupPanel(false)}>
                <X size={22} className="text-gray-300 hover:text-white" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Manage data backups and restore previous system states.
            </p>

            <div className="space-y-4">

              {/* BACKUP BUTTON */}
              <button
                onClick={handleBackup}
                disabled={loadingBackup}
                className="w-full py-3 mb-10 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
              >
                {loadingBackup ? (
                  <>
                    <span>Backing up system data...</span>
                    <LinearLoad />
                  </>
                ) : "Backup System Data"}
              </button>

              {/* RESTORE BUTTON */}
              <button
                onClick={handleRestore}
                disabled={loadingRestore}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                {loadingRestore ? (
                  <>
                    <span>Restoring system data...</span>
                    <LinearLoad />
                  </>
                ) : "Restore System Data"}
              </button>

              {/* Metadata list */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="font-semibold">Recent Backups</p>

                {backupList.length === 0 ? (
                  <p className="text-sm text-gray-400 mt-2">• No backups found</p>
                ) : (
                  <ul
                    className="text-sm text-gray-300 mt-2 space-y-1 overflow-y-auto pr-2"
                    style={{ maxHeight: "200px" }} 
                  >
                    {backupList.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-gray-500 mr-2">•</span>
                        <span>{formatBackupName(file)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;

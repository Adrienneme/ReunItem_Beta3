import React from 'react';
import AdminNavBar from '../../../components/layout/AdminNavBar';
import HomeButton from '../../../components/ui/HomeButton';
import { ClipboardList, FolderSearch, ListChecks, Archive } from "lucide-react";

const AdminHome = ({ name = "Admin" }) => {
  return (
    <div className="mb-6">

      <AdminNavBar name={name} />

      <div className="flex flex-row items-center justify-center mt-20 gap-20">
        
        {/* Pending Submissions */}
        <HomeButton to="/admin/pendingsubmissions" color="blue">
          <div className="flex flex-col items-center">
            <ClipboardList className="w-8 h-8 mb-2" />
            Pending Reports
          </div>
        </HomeButton>

        {/* Lost/Found Entries */}
        <HomeButton to="/admin/lostandfoundrep" color="blue">
          <div className="flex flex-col items-center">
            <FolderSearch className="w-8 h-8 mb-2" />
            Lost/Found Items
          </div>
        </HomeButton>

      </div>

      <div className="flex flex-row items-center justify-center mt-10 gap-20">

        {/* Claim Requests */}
        <HomeButton to="/admin/claimrequest" color="blue">
          <div className="flex flex-col items-center">
            <ListChecks className="w-8 h-8 mb-2" />
            Claim Requests
          </div>
        </HomeButton>

        {/* Archived */}
        <HomeButton to="/admin/archived" color='blue'>
          <div className="flex flex-col items-center">
            <Archive className="w-8 h-8 mb-2" />
            Archive
          </div>
        </HomeButton>

      </div>

    </div>
  );
};

export default AdminHome;

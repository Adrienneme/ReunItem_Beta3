import React from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import HomeButton from '../../../components/ui/HomeButton'

const AdminHome = ({
   name = "Admin"
  }) => {
  return (
    <div className="mb-6">

      <AdminNavBar name = {name} />
      
      <div className='flex flex-row items-center justify-center mt-20 gap-20'>
        <HomeButton  to="/admin/pendingsubmissions" color='green'>
          Pending Submissions
        </HomeButton>

        <HomeButton to="/admin/lostandfoundrep" color='green'>
          Lost/Found Entries 
        </HomeButton>
      </div>

      <div className='flex flex-row items-center justify-center mt-10 gap-20'>
        <HomeButton to="/admin/claimrequest" color='green'>
          Claim Requests
        </HomeButton>

        <HomeButton to="/admin/archived">
          Archived 
        </HomeButton>
      </div>
    </div>
  )
}

export default AdminHome

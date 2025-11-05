import React from 'react'
import AdminNavBar from '../../../components/layout/AdminNavBar'
import HomeButton from '../../../components/ui/HomeButton'

const AdminHome = ({
   name = "Admin"
  }) => {
  return (
    <div>

      <AdminNavBar name = {name} />
      
      <div className='flex flex-row items-center justify-center mt-60 gap-20'>
        <HomeButton  to="/admin/pendingsubmissions" color='red'>
          Pending Submissions
        </HomeButton>

        <HomeButton to="/admin/lostandfoundrep" color='green'>
          Lost/Found Entries 
        </HomeButton>
      </div>

      <div className='flex flex-row items-center justify-center mt-10 gap-20'>
        <HomeButton to="/admin/claimrequest" color='red'>
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

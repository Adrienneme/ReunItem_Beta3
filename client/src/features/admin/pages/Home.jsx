import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'
import { Link } from 'react-router-dom'

const AdminHome = ({
   name = "Admin"
  }) => {
  return (
    <div>

      <UserNavBar name = {name} />
      
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

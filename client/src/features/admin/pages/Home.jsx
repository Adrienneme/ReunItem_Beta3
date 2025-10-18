import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'
import ButtonUI from '../../../components/ui/ButtonUI'
import { Link } from 'react-router-dom'

const AdminHome = ({
   name = "Admin"
  }) => {
  return (
    <div>

      <UserNavBar name = {name} />
      
      <div className='flex flex-row items-center justify-center mt-15 gap-8'>
        <HomeButton color='red'>
          Pending Submissions
        </HomeButton>

        <HomeButton color='green'>
          Lost/Found Entries 
        </HomeButton>
      </div>

      <div className='flex flex-row items-center justify-center mt-10 gap-8'>
        <Link to="/admin/claimrequest"> 
        <HomeButton color='red'>
          Claim Requests
        </HomeButton>
        </Link>

        <Link to="/admin/archived"> 
        <HomeButton>
          Archived 
        </HomeButton>
        </Link>



      </div>
    </div>
  )
}

export default AdminHome

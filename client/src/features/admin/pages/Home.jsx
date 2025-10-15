import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'

const AdminHome = () => {
  return (
    <div>
      <UserNavBar />
      
      <div className='flex flex-row items-center justify-center mt-15 gap-8'>
        <HomeButton color='red'>
          Pending Submissions
        </HomeButton>

        <HomeButton color='green'>
          Lost/Found Entries 
        </HomeButton>
      </div>
      <div className='flex flex-row items-center justify-center mt-10 gap-8'>
        <HomeButton color='red'>
          Claim Requests
        </HomeButton>

        <HomeButton>
          Archived 
        </HomeButton>
      </div>

    </div>
  )
}

export default AdminHome

import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'

export default function MyEntriesPage() {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center mt-15'>
        <HomeButton to='/user/lost-entries' color='black' onClick={() => alert('Going to Report Lost Submission Form...')}>
          View Lost Items
        </HomeButton>
        
        <HomeButton to='/user/found-entries' color='gray'>
          View Found Item
        </HomeButton>
      </div>
    </div>
  )
}

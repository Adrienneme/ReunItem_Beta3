import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'

//Main User Page
const Home = () => {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center mt-15'>
        <HomeButton to='/user/lost-form' color='green' onClick={() => alert('Going to Report Lost Submission Form...')}>
          Report Lost Item
        </HomeButton>
        
        <HomeButton to='/user/found-form' color='blue'>
          Report Found Item
        </HomeButton>
      </div>
    </div>
  )
}

export default Home

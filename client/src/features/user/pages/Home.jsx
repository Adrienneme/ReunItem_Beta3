import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'
import { SquarePen } from 'lucide-react'

//Main User Page
const Home = () => {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center mt-15'>
        <HomeButton to='/user/lost-form' color='black'>
          <div className='flex flex-row justify-center items-center gap-3'>
            <SquarePen />
            Report Lost Item
          </div>
        </HomeButton>

        <HomeButton to='/user/found-form' color='blue'>
          <div className='flex flex-row justify-center items-center gap-3'>
            <SquarePen />
            Report Found Item
          </div>
        </HomeButton>
      </div>
    </div>
  )
}

export default Home

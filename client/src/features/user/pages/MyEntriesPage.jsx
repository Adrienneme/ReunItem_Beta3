import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'
import { FileX, PackageSearch } from 'lucide-react'

export default function MyEntriesPage() {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center mt-15'>
        <HomeButton to='/user/lost-entries' color='black'>
          <div className='flex flex-row justify-center items-center gap-3'>
            <FileX />
            View Lost Items
          </div>
        </HomeButton>

        <HomeButton to='/user/found-entries' color='blue'>
          <div className='flex flex-row justify-center items-center gap-3'>
            <PackageSearch />
            View Found Item
          </div>
        </HomeButton>
      </div>
    </div>
  )
}

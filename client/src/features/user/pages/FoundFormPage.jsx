import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import { Button } from '@mui/joy'

const FoundFormPage = () => {
  return (
    <div>
      <UserNavBar />
      {/*FoundBaseForm*/}
      <div>
        
      </div>

      {/*BUtton Functions*/}
      <div className='flex flex-col items-center'>
        <h1>Report Found Item:</h1>
        <Button variant='solid' color='success'>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default FoundFormPage

import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import FoundBaseForm from '../../../components/forms/FoundBaseForm'
import { Button } from '@mui/joy'

//Found Entry Subsmission Page (Creating Entries)

const FoundFormPage = () => {
  return (
    <div>
      <UserNavBar />
      <div className='flex flex-col items-center'>
        <h1 className='mt-5'>Report Found Item:</h1>
        {/*FoundBaseForm*/}
        <div>
          <FoundBaseForm />
        </div>

        {/*BUtton Functions*/}
        <div className='flex flex-col items-center'>
          <Button variant='solid' color='success'>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FoundFormPage

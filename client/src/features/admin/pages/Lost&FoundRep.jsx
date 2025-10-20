import React from 'react'
import UserNavBar from '../../../components/layout/UserNavBar'
import Cards from '../../../components/ui/Cards'
import FilterDropdown from '../../../components/ui/Filters'

function LostFoundRep() {
  return (
    <div>
     <UserNavBar />
     {/* Filter Dropdown */}
           <div className="flex flex-wrap justify-center mt-10">
             <FilterDropdown 
              label="Filter "
              options={["All", "Returned", "Discarded", "Donated"]}
             />
           </div>

     {/* Card Item */}
     <div className="flex flex-wrap justify-center gap-10 mt-10">
        <Cards 
         linkTo="/admin/foundcardview"
        />
        <Cards 
        linkTo="/admin/foundcardview"
        />
        <Cards 
        linkTo="/admin/foundcardview"
        />
      
      </div>
    </div>
  )
}

export default LostFoundRep

import UserNavBar from '../../../components/layout/UserNavBar'
import Cards from '../../../components/ui/Cards'
import FilterDropdown from '../../../components/ui/Filters'
const Archived = ({
   
}) => {
  return (
    <div>
     <UserNavBar />
     {/* Filter Dropdown */}
           <div className="flex flex-wrap justify-center mt-10">
             <FilterDropdown />
           </div>

     {/* Card Item */}
     <div className="flex flex-wrap justify-center gap-10 mt-10">
      <Cards />
      <Cards />
      <Cards />
      <Cards />
     
      </div>
    </div>
  )
}

export default Archived
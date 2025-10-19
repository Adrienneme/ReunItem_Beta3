import UserNavBar from '../../../components/layout/UserNavBar'
import Cards from '../../../components/ui/Cards'

const Archived = ({
   
}) => {
  return (
    <div>
     <UserNavBar />
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
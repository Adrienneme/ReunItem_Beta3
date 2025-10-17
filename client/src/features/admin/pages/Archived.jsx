import UserNavBar from '../../../components/layout/UserNavBar'
import HomeButton from '../../../components/ui/HomeButton'
import Cards from '../../../components/ui/Cards'
import { Link } from 'react-router-dom';

const Archived = ({
    status = null
}) => {
  return (
    <div>
     <UserNavBar />
     <div>
      <Cards />
      </div>
    </div>
  )
}

export default Archived
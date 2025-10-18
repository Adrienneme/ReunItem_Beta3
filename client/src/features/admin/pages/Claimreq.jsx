import UserNavBar from '../../../components/layout/UserNavBar'
import Cards from '../../../components/ui/Cards';

const ClaimRequest = () => {
    return (

        <div>
         <UserNavBar />
          <div className= "flex justify-center gap-12 mt-10">
            <Cards  />
             <Cards  />
              <Cards  />
          </div>
       </div>
    )
    
};

export default ClaimRequest;
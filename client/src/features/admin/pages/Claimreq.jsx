import Card from '@mui/material/Card';
import UserNavBar from '../../../components/layout/UserNavBar'
import Cards from '../../../components/ui/Cards';


const ClaimRequest = () => {
    return (

        <div>
         <UserNavBar />
         <span className="flex justify-center gap-12 mt-10"> Claim Requests From Finders</span>
          <div className= "flex justify-center gap-12 mt-10">
            <Cards  
            name="Wallet"
            linkTo={"/admin/foundcardview"}
            />
             <Cards  
             name="Wallet"
             linkTo={"/admin/foundcardview"}
             />
              <Cards  
              name="Wallet"
              linkTo={"/admin/foundcardview"}
              />
          </div>
       </div>
    )
    
};

export default ClaimRequest;
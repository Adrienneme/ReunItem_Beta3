import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';

// User pages
import Home from './features/user/pages/Home';
import LostFormPage from './features/user/pages/lost/LostFormPage';
import FoundFormPage from './features/user/pages/found/FoundFormPage';
import MyEntriesPage from './features/user/pages/MyEntriesPage';
import Settings from './features/user/pages/Settings';
import LostEntriesPage from './features/user/pages/lost/LostEntriesPage';
import LostViewPage from './features/user/pages/lost/LostViewPage';
import FoundEntriesPage from './features/user/pages/found/FoundEntriesPage';
import FoundViewPage from './features/user/pages/found/FoundViewPage';
import MatchedItemsSelection from './features/user/pages/lost/MatchedItemsSelection';
import MatchedItemDetail from './features/user/pages/lost/MatchedItemDetail';
import MatchedLost from './features/user/pages/found/MatchedLost';


// Auth pages
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';

// Admin pages
import AdminHome from './features/admin/pages/Home';
import Archived from './features/admin/pages/Archived';
import ClaimRequest from './features/admin/pages/Claimreq';
import Pendingsub from './features/admin/pages/PendingSub';
import LostFoundRep from './features/admin/pages/Lost&FoundRep';
import FoundCardView from './features/adminfound/FoundCardView';
import FoundEntriesView from './features/adminfound/FoundEntriesAdmin';
import LostCardView from './features/adminlost/LostCardView';
import LostEntriesView from './features/adminlost/LostEntriesAdmin';
import AdminSettings from './features/admin/pages/AdminSettings';


function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected User Routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoutes requiredRole={"user"}>
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="lost-form" element={<LostFormPage />} />
              <Route path="found-form" element={<FoundFormPage />} />
              <Route path="entries" element={<MyEntriesPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path='lost-entries' element={<LostEntriesPage/>}/>
              <Route path='lost-entries-detail' element={<LostViewPage/>}/> 
              <Route path='found-entries' element={<FoundEntriesPage/>}/>
              <Route path='found-entries-detail' element={<FoundViewPage/>}/>   
              <Route path='matched-entries' element={<MatchedItemsSelection/>}/>  
              <Route path='matched-entry-detail' element={<MatchedItemDetail/>}/>
              <Route path='matched-lost-detail' element={<MatchedLost/>}/>       
            </Routes>
          </ProtectedRoutes>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoutes requiredRole="admin">
            <Routes>
              <Route path="home" element={<AdminHome />} />
              <Route path="archived" element={<Archived />} />
              <Route path="claimrequest" element={<ClaimRequest />} />
              <Route path="pendingsubmissions" element={<Pendingsub />} />
              <Route path="lostandfoundrep" element={<LostFoundRep />} />
              <Route path="foundcardview" element={<FoundCardView />} />
              <Route path="foundentryadmin" element={<FoundEntriesView />} />
              <Route path="lostentryadmin" element={<LostEntriesView />} />
              <Route path="lostcardview" element={<LostCardView />} />
              <Route path="adminsettings" element={<AdminSettings/>} />
            </Routes> 
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;

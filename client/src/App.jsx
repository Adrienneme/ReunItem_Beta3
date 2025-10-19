import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';

// User pages
import Home from './features/user/pages/Home';
import LostFormPage from './features/user/pages/LostFormPage';
import FoundFormPage from './features/user/pages/FoundFormPage';
import MyEntriesPage from './features/user/pages/MyEntriesPage';
import Settings from './features/user/pages/Settings';

// Auth pages
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';

// Admin pages
import AdminHome from './features/admin/pages/Home';
import Archived from './features/admin/pages/Archived';
import ClaimRequest from './features/admin/pages/Claimreq';
import FoundEntry from './features/admin/pages/FoundEntry';

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
              <Route path="foundentries" element={<FoundEntry />} />
            </Routes>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;

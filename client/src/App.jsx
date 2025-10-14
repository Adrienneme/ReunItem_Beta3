import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './features/user/pages/Home'
import LostFormPage from './features/user/pages/LostFormPage'
import FoundFormPage from './features/user/pages/FoundFormPage'
import Login from './features/auth/Login'
import SignUp from './features/auth/SignUp'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/user/home' element={<Home/>}/>
        <Route path='/user/lost-form' element={<LostFormPage/>}/>
        <Route path='/user/found-form' element={<FoundFormPage/>}/>
      </Routes>
    </>
  )
}

export default App

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './features/user/pages/Home'
import LostFormPage from './features/user/pages/LostFormPage'
import FoundFormPage from './features/user/pages/FoundFormPage'

function App() {

  return (
    <>
      <Routes>

        {/* Default route */}
        <Route path='/' element={<Home/>}/>

        {/* User routes */}
        <Route path='/user/home' element={<Home/>}/>
        <Route path='/user/lost-form' element={<LostFormPage/>}/>
        <Route path='/user/found-form' element={<FoundFormPage/>}/>
        
      </Routes>
    </>
  )
}

export default App

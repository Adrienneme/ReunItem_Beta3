import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './features/user/pages/Home'

function App() {

  return (
    <>
      <Routes>
        <Route path='/user/home' element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App

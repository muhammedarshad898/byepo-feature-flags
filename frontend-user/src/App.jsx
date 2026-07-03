import { useState } from 'react'

import './App.css'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import UserHome from './pages/UserHome'

function App() {
 

  return (
    <>
     <BrowserRouter>
     <Routes>

      <Route path='/' element={<UserHome></UserHome>}></Route>
     </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App

import { useState } from 'react'

import './App.css'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import UserHome from './pages/UserHome'
import ProtectedRoute from './services/ProtectedRoute'

function App() {
 

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<UserHome></UserHome>}></Route>
      </Route>
     </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App

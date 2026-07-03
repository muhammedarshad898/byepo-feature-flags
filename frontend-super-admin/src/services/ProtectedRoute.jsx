import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ redirectPath = '/auth' }) => {
  const token = localStorage.getItem('token')
  

  if (!token) {
    return <Navigate to={redirectPath}/>
  }

  return <Outlet />
}

export default ProtectedRoute

import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ redirectPath = '/auth' }) => {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute

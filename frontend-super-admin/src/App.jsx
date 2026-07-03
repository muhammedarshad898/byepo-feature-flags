
import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './services/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard></Dashboard>} />
        </Route>
      </Routes>


      <ToastContainer />
    </BrowserRouter>
  )
}

export default App

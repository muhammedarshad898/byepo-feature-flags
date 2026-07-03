import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'

function Auth() {
 const [formData,setFormData]=useState({
  email:"",password:""
 })

const navigate=useNavigate()
 
   const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      console.log(apiUrl)
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData)
      if(res.status==200){
         localStorage.setItem('token', res.data.token)
         toast.success("logined Successfully")
         navigate('/dashboard')

      }

     

    } catch (err) {
   toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }
  

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h1 className="h3 mb-2">Welcome Back</h1>
                <p className="text-muted mb-4">Sign in to continue to your dashboard.</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      
                      onChange={e=>setFormData({...formData,email:e.target.value})}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      
                      onChange={e=>setFormData({...formData,password:e.target.value})}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
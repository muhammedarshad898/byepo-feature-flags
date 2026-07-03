import React from 'react'
import { useState,useEffect } from 'react';
import Addorganisation from '../components/Addorganisation'
import Table from 'react-bootstrap/Table';
import axios from 'axios'

function Dashboard() {
  const [orgs, setOrgs] = useState([])
  useEffect(() => {
    fetchOrgs()
  }, [])

  const apiUrl=import.meta.env.VITE_API_URL

  const fetchOrgs = async() => {

    try{
       const res=await axios.get(`${apiUrl}/api/superadmin/organizations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.status==200){
        setOrgs(res.data)
      }

    }
    catch(err){
      console.log(err)

    }
  }

  const handleOrgCreated = (newOrg) => {
    setOrgs([...orgs, newOrg])
  }

    
    
   
      
  
  return (
   <>

   <div className='container mt-5'>

    <div className='mb-3'>
        <Addorganisation onOrgCreated={handleOrgCreated}></Addorganisation>
    </div>
    {
      orgs.length>0?
    
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>SL NO</th>
          <th>Organisation Name</th>
        </tr>
      </thead>
      <tbody>
       {orgs.map((org, index) => (
              <tr key={org._id}>
                <td>{index + 1}</td>
                <td>{org.name}</td>
               
              </tr>
            ))}
        
      </tbody>
    </Table>
    :<h1 className='text-center text-danger'>No Content Available</h1>
}

   </div>
   
   </>
  )
}

export default Dashboard
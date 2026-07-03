import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import axios from 'axios';


function Addorganisation({onOrgCreated}) {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState('')

  const handleSave = async () => {
    try {

      const apiUrl = import.meta.env.VITE_API_URL 
      const res = await axios.post(
        `${apiUrl}/api/superadmin/organizations`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if(res.status==201){
        toast.success("Organization Created")
         onOrgCreated(res.data)  
      setName('')
      handleClose()
      }

      

    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create organization')
    }
  }


  return (
  <>
   <Button variant="primary" onClick={handleShow}>
        Add New Organisation 
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a New Organisation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Organisation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} >Save Organisation</Button>
        </Modal.Footer>
      </Modal>
  
  </>
  )
}

export default Addorganisation
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { createFlagApi } from '../services/allApi'
import {toast} from 'react-toastify'

function Addflagmodal({ show, onClose,onFlagCreated}) {
  const [key, setKey] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      const res = await createFlagApi({ key }, headers)

      onFlagCreated(res.data)
      setKey('')
      onClose()
      toast.success('Feature flag created')

    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create Feature Flag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Feature key e.g. navbar_v2"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-100">
            Create Flag
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default Addflagmodal
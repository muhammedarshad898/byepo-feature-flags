
import React, { useState,useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Addflagmodal from '../components/Addflagmodal'
import { getFlagsApi,deleteFlagApi,updateFlagApi } from '../services/allApi'
import {toast} from 'react-toastify'



function Dashboard() {
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
        fetchFlags()
    }, [])


  const fetchFlags = async () => {
        try {
            setLoading(true)
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
            const res = await getFlagsApi(headers)
            
            if (res.status === 200) {
                setFlags(res.data)
            }
        } catch (err) {
            console.error('Error fetching flags:', err)
            toast.error(err.response?.data?.error || 'Failed to fetch flags')
        } finally {
            setLoading(false)
        }
    }

  const handleFlagCreated = (newFlag) => {
    setFlags([...flags, newFlag])
  }

  
  if (loading) {
        return <div className="container mt-4"><p>Loading flags...</p></div>
    }

    const handleDelete = async (id) => {
    
    if (!window.confirm('Are you sure you want to delete this flag?')) {
        return
    }

    try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
        const res = await deleteFlagApi(id, headers)
        
        if (res.status === 200) {
            
            setFlags(flags.filter(flag => flag._id !== id))
            toast.success('Flag deleted successfully')
        }
    } catch (err) {
        console.error('Error deleting flag:', err)
        toast.error(err.response?.data?.error || 'Failed to delete flag')
    }
}

const handleToggleFlag = async (id) => {
    // Find the current flag to get its current state
    const currentFlag = flags.find(flag => flag._id === id)
    const newState = !currentFlag.enabled

    // Optimistic update - show change immediately
    setFlags(flags.map(flag =>
        flag._id === id ? { ...flag, enabled: newState } : flag
    ))

    try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
        const res = await updateFlagApi({ enabled: newState }, id, headers)

        if (res.status === 200) {
            toast.success('Flag updated successfully')
        }
    } catch (err) {
        // Revert on error
        setFlags(flags.map(flag =>
            flag._id === id ? { ...flag, enabled: !newState } : flag
        ))
        console.error('Error updating flag:', err)
        toast.error(err.response?.data?.error || 'Failed to update flag')
    }
}
  return (
    <>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Feature Flags</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Flag
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Feature Key</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flags.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center">No flags found</td>
                            </tr>
                        ) : (
                            flags.map(flag => (
                                <tr key={flag._id}>
                                    <td>{flag.key}</td>
                                    <td>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={flag.enabled}
                                               onChange={() => handleToggleFlag(flag._id)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                      <button className='btn btn-danger' onClick={() => handleDelete(flag._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
        </tbody>
      </Table>

      <Addflagmodal show={showModal}
        onClose={() => setShowModal(false)}
        onFlagCreated={handleFlagCreated}
       ></Addflagmodal>
    </div>
    
    
    </>
  )
}

export default Dashboard
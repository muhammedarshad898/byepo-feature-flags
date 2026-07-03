import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { getPublicOrganizations, getPublicFlags,checkFeatureStatus } from '../services/allApi'

function UserHome() {
  const [orgId, setOrgId] = useState('')
  const [featureKey, setFeatureKey] = useState('')
  const [result, setResult] = useState(null)   
  const [orgs, setOrgs] = useState([])
  const [flags, setFlags] = useState([])
  const [loadingOrgs, setLoadingOrgs] = useState(true)
  const [loadingFlags, setLoadingFlags] = useState(false)

  const fetchOrganizations = async () => {
    try {
      setLoadingOrgs(true)
      const res = await getPublicOrganizations()
      setOrgs(res.data)
    } catch (err) {
      console.error('Error fetching organizations:', err)
    } finally {
      setLoadingOrgs(false)
    }
  }

  const fetchFlags = async (organizationId) => {
    try {
      setLoadingFlags(true)
      const res = await getPublicFlags(organizationId)
      setFlags(res.data)
    } catch (err) {
      console.error('Error fetching flags:', err)
      setFlags([])
    } finally {
      setLoadingFlags(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleOrganizationChange = async (value) => {
    setOrgId(value)
    setFeatureKey('')
    setResult(null)

    if (value) {
      await fetchFlags(value)
    } else {
      setFlags([])
    }
  }

 const handleCheck = async (e) => {
  e.preventDefault()

  try {
    const res = await checkFeatureStatus(orgId, featureKey)
    setResult(res.data.enabled)
  } catch (err) {
    if (err.response?.status === 404) {
      setResult(false)
    } else {
      console.error('Error checking feature:', err)
      
    }
  }
}

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: '400px' }}>
        <h4 className="text-center mb-4">Check Feature Status</h4>

        <form onSubmit={handleCheck}>
          <div className="mb-3">
            <label className="form-label">Organization</label>
            <select
              className="form-select"
              value={orgId}
              onChange={(e) => handleOrganizationChange(e.target.value)}
              required
            >
              <option value="">Select your organization</option>
              {orgs.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
            {loadingOrgs && <div className="form-text">Loading organizations...</div>}
            {!loadingOrgs && orgs.length === 0 && (
              <div className="form-text text-danger">No organizations available</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Feature</label>
            <select
              className="form-select"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
              required
              disabled={!orgId || loadingFlags}
            >
              <option value="">Select a feature</option>
              {flags.map(flag => (
                <option key={flag._id} value={flag.key}>{flag.key}</option>
              ))}
            </select>
            {loadingFlags && <div className="form-text">Loading flags...</div>}
            {!loadingFlags && orgId && flags.length === 0 && (
              <div className="form-text text-danger">No flags found for this organization</div>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-100">
            Check Feature
          </Button>
        </form>

        {result !== null && (
          <div className={`alert mt-4 text-center mb-0 ${result ? 'alert-success' : 'alert-secondary'}`}>
            {result ? 'Feature is Enabled ✅' : 'Feature is Disabled ❌'}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserHome
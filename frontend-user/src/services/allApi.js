import axios from 'axios'

export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getPublicOrganizations = async () => {
  return axios.get(`${apiUrl}/api/public/organizations`)
}

export const getPublicFlags = async (orgId) => {
  return axios.get(`${apiUrl}/api/public/flags`, {
    params: { orgId }
  })
}
export const checkFeatureStatus = async (orgId, key) => {
  return axios.get(`${apiUrl}/api/public/check`, {
    params: { orgId, key }
  })
}

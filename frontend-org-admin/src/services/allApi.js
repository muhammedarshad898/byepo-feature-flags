export const apiUrl=import.meta.env.VITE_API_URL
import axios from 'axios'




// ---------- Auth ----------

export const signupApi = async (data) => {
  return await axios.post(`${apiUrl}/api/auth/signup`, data)
}

export const loginApi = async (data) => {
  return await axios.post(`${apiUrl}/api/auth/login`, data)
}

// ---------- Organizations (for signup dropdown) ----------

export const getOrganizationsApi = async () => {
  return await axios.get(`${apiUrl}/api/public/organizations`)
}

// ---------- Feature Flags ----------

export const getFlagsApi = async (headers) => {
  return await axios.get(`${apiUrl}/api/flags`, { headers })
}

export const createFlagApi = async (data, headers) => {
  return await axios.post(`${apiUrl}/api/flags`, data, { headers })
}

export const updateFlagApi = async (data, id, headers) => {
  return await axios.patch(`${apiUrl}/api/flags/${id}`, data, { headers })
}

export const deleteFlagApi = async (id, headers) => {
  return await axios.delete(`${apiUrl}/api/flags/${id}`, { headers })
}


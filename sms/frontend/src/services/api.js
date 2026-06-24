import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request interceptor: attach JWT ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401/500 globally ───────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (status === 401) {
      store.dispatch(logout())
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('You do not have permission to do this.')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject({ message, status, data: error.response?.data })
  }
)

export default api

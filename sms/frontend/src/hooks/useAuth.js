import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export function useAuth() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const auth      = useSelector(s => s.auth)

  const login = async (credentials) => {
    dispatch(loginStart())
    try {
      const { data } = await authService.login(credentials)
      const payload   = data.data ?? data
      dispatch(loginSuccess({
        user:  payload.user  ?? payload,
        token: payload.token ?? payload.accessToken,
      }))
      toast.success('Welcome back!')
      const userType = (payload.user ?? payload)?.userType
      navigate(userType === 'SUPER_ADMIN' || userType === 'SOCIETY_ADMIN'
        ? '/admin/dashboard' : '/resident/dashboard')
    } catch (err) {
      dispatch(loginFailure(err.message))
      toast.error(err.message || 'Login failed')
    }
  }

  const doLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const isAdmin = () => {
    const t = auth.user?.userType
    return t === 'SUPER_ADMIN' || t === 'SOCIETY_ADMIN' || t === 'COMMITTEE_MEMBER'
  }

  const isSuperAdmin = () => auth.user?.userType === 'SUPER_ADMIN'

  return { ...auth, login, logout: doLogout, isAdmin, isSuperAdmin }
}

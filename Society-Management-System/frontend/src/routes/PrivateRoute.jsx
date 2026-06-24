import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Redirects unauthenticated users to /login.
 * If roles are specified, also checks user role.
 */
export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user?.userType)) {
    const isAdmin = user?.userType === 'SUPER_ADMIN' || user?.userType === 'SOCIETY_ADMIN'
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/resident/dashboard'} replace />
  }

  return children
}

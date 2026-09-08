import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading…</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

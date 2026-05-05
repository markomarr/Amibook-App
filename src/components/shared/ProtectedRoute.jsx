import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoadingScreen from '@/components/shared/LoadingScreen'

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) return <LoadingScreen />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}


import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoadingScreen from '@/components/shared/LoadingScreen'

export default function AdminRoute({ children }) {
  const { user, profile, isLoading } = useAuthStore()
  const navigate = useNavigate()

  if (isLoading) return <LoadingScreen />

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  if (profile?.role !== 'admin') {
    navigate('/', { replace: true })
    return null
  }

  return children
}

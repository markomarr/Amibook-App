import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/shared/LoadingScreen'

export default function ProtectedRoute({ children }) {
  const { user, isLoading, setUser, setLoading, fetchProfile } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Cek session aktif saat pertama load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) fetchProfile(currentUser.id)
      setLoading(false)
    })

    // Dengarkan perubahan auth state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) fetchProfile(currentUser.id)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) return <LoadingScreen />

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return children
}

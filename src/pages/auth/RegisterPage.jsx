import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', nim: '', email: '', password: '', confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.fullName || !form.nim || !form.email || !form.password) {
      toast.error('Semua field wajib diisi')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Password tidak cocok')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)
    try {
      const result = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        nim: form.nim,
      })
      
      // If Supabase auto-confirms, session will exist immediately
      if (result?.session) {
        toast.success('Pendaftaran berhasil! Selamat datang.')
        navigate('/')
      } else {
        // Email confirmation required
        toast.success('Pendaftaran berhasil! Silakan cek email untuk verifikasi, lalu login.')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.message ?? 'Gagal mendaftar, coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  const fields = [
    { name: 'fullName', label: 'Nama Lengkap', placeholder: 'Budi Santoso', type: 'text' },
    { name: 'nim', label: 'NIM', placeholder: '220411012345', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'nim@mahasiswa.kampus.ac.id', type: 'email' },
    { name: 'password', label: 'Password', placeholder: 'Min. 6 karakter', type: 'password' },
    { name: 'confirmPassword', label: 'Konfirmasi Password', placeholder: 'Ulangi password', type: 'password' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-ink">Daftar Anggota</h2>
        <p className="text-ink-muted mt-1 text-sm">Buat akun untuk akses perpustakaan digital</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, placeholder, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="input"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted mt-6">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}

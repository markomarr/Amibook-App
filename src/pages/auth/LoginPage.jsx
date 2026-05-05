import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Email dan password wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Selamat datang kembali!')
      navigate('/')
    } catch (error) {
      const msg = error.message || 'Terjadi kesalahan, coba lagi'
      if (msg.includes('Invalid login credentials')) {
        toast.error('Email atau password salah')
      } else {
        toast.error(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h2>
        <p className="font-body text-sm text-slate-500">Silakan masuk menggunakan kredensial akademik Anda.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/* Email Input */}
        <div className="space-y-2 relative group">
          <label htmlFor="email" className="block font-label text-sm font-semibold text-slate-700 ml-1">Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-700 transition-colors">badge</span>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nim@mahasiswa.kampus.ac.id"
              className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-body text-sm focus:bg-white focus:ring-0 transition-all duration-300 ease-in-out placeholder:text-slate-400 peer"
              style={{ boxShadow: 'inset 0 0 0 1px transparent' }}
              required
              autoComplete="email"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none transition-colors duration-300 ring-1 ring-slate-200 peer-focus:ring-primary-500/50"></div>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2 relative group">
          <label htmlFor="password" className="block font-label text-sm font-semibold text-slate-700 ml-1">Kata Sandi</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-700 transition-colors">key</span>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-body text-sm tracking-widest focus:bg-white focus:ring-0 transition-all duration-300 ease-in-out placeholder:text-slate-400 placeholder:tracking-normal peer"
              style={{ boxShadow: 'inset 0 0 0 1px transparent' }}
              required
              autoComplete="current-password"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none transition-colors duration-300 ring-1 ring-slate-200 peer-focus:ring-primary-500/50"></div>
          </div>
        </div>

        {/* Forgot Password & Register Link */}
        <div className="flex justify-between pt-1">
          <Link to="/register" className="font-label text-sm font-semibold text-primary-700 hover:text-primary-500 transition-colors duration-300">
            Daftar
          </Link>
          <a href="#" className="font-label text-sm font-semibold text-primary-700 hover:text-primary-500 transition-colors duration-300">
            Lupa kata sandi?
          </a>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 text-white rounded-xl py-4 px-8 mt-4 font-label font-bold text-base tracking-wide hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-700/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <span>Masuk</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </>
          )}
        </button>
      </form>
    </>
  )
}

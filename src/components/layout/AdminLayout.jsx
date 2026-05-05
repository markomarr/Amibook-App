import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, RefreshCw, Users, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const adminNav = [
  { to: '/admin/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/books',       icon: BookOpen,        label: 'Kelola Buku' },
  { to: '/admin/borrowings',  icon: RefreshCw,       label: 'Peminjaman' },
  { to: '/admin/users',       icon: Users,           label: 'Data Anggota' },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex app-shell">

      {/* ── Admin Sidebar ─────────────────────── */}
      <aside className="w-64 bg-ink flex flex-col fixed h-full">
        <div className="px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 hero-gradient rounded-2xl flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white leading-tight">AMIBOOK</p>
              <p className="text-xs text-purple-100/80 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-purple-100/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <div className="pt-2">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-100/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              Kembali ke Beranda
            </NavLink>
          </div>
        </nav>

        <div className="px-3 py-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
              <p className="text-xs text-purple-100/70">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-purple-100/70 hover:bg-red-900/40 hover:text-red-200 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Admin Content ─────────────────────── */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/',              icon: 'home',       label: 'Beranda' },
  { to: '/catalog',       icon: 'library_books',   label: 'Katalog' },
  { to: '/my-borrowings', icon: 'history_edu', label: 'Aktivitas' },
  { to: '/profile',       icon: 'person',       label: 'Profil' },
]

export default function UserLayout() {
  const { profile, signOut, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body antialiased selection:bg-tertiary-container selection:text-on-tertiary-container flex flex-col md:flex-row">
      
      {/* ── Mobile TopAppBar ───────────────────────────────── */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm shadow-purple-900/5 transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <button className="text-slate-500 hover:bg-purple-50 rounded-full p-2 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <span className="font-display font-extrabold tracking-tighter text-xl text-primary-700">AMIBOOK</span>
          <button className="text-slate-500 hover:bg-purple-50 rounded-full p-2 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </header>

      {/* ── Desktop Navigation Drawer ───────────────────────────────── */}
      <nav className="hidden md:flex bg-white h-full w-80 rounded-r-[2rem] border-r border-purple-100 shadow-2xl fixed left-0 top-0 z-40 flex-col py-8 gap-6 transition-colors duration-300">
        <div className="px-6 mb-4">
          <h2 className="text-primary-800 font-extrabold text-2xl font-headline tracking-tight">AMIBOOK</h2>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-slate-900 truncate">{profile?.full_name ?? 'Universitas Amikom'}</p>
              <p className="text-sm text-slate-500 truncate">{profile?.nim ?? 'Yogyakarta Catalog'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 px-4 font-display text-sm flex-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl ease-emphasized duration-500 transition-all ${
                  isActive 
                    ? 'bg-primary-100 text-primary-800 font-bold translate-x-1' 
                    : 'text-slate-600 hover:bg-purple-50 hover:text-primary-700 hover:translate-x-1'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              {label}
            </NavLink>
          ))}

          {isAdmin() && (
            <NavLink
              to="/admin/dashboard"
              className="flex items-center gap-4 px-4 py-3 rounded-xl ease-emphasized duration-500 transition-all text-amber-700 bg-amber-50 hover:bg-amber-100 hover:translate-x-1 mt-4 font-bold"
            >
              <ShieldCheck size={20} />
              Panel Admin
            </NavLink>
          )}
        </div>
        
        <div className="px-8 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl w-full font-bold transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main content ────────────────────────── */}
      <main className="flex-1 md:ml-80 min-h-screen pt-24 pb-32 md:py-12 px-6">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_32px_rgba(64,36,69,0.06)] rounded-t-[2rem]">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] ${
                isActive 
                  ? 'text-primary-700 bg-primary-100/50 rounded-2xl px-3 py-1 scale-110' 
                  : 'text-slate-400 hover:text-primary-600'
              }`
            }
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            <span className="font-body text-[11px] font-semibold mt-1">{label}</span>
          </NavLink>
        ))}
      </nav>
      
    </div>
  )
}

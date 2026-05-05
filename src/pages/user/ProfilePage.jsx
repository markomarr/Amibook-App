import { useAuthStore } from '@/store/authStore'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    toast.success('Berhasil logout')
    navigate('/login')
  }

  return (
    <div className="w-full max-w-4xl mx-auto md:py-8 space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">Profil Pengguna</h1>
        <p className="text-slate-600 mt-2 text-lg">Kelola informasi personal, preferensi, dan keamanan akun Anda.</p>
      </div>

      {/* Main Identity Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 p-1 flex-shrink-0 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-extrabold text-primary-700">
               {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left pt-2">
            <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              Mahasiswa Aktif
            </div>
            <h2 className="text-3xl font-headline font-extrabold text-slate-900 mb-1">{profile?.full_name ?? 'Pengguna Amibook'}</h2>
            <p className="text-slate-500 font-medium font-mono text-lg mb-6">{profile?.nim ?? 'NIM tidak tersedia'}</p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 transition-colors">
                Edit Profil
              </button>
              <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                Ganti Kata Sandi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Settings */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined">manage_accounts</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900">Pengaturan Akun</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Alamat Email</p>
                <p className="text-slate-500 text-xs mt-1">{user?.email ?? 'email@mahasiswa.ac.id'}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Program Studi</p>
                <p className="text-slate-500 text-xs mt-1">Informatika</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined">tune</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900">Preferensi</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Notifikasi Peminjaman</p>
                <p className="text-slate-500 text-xs mt-1">Peringatan sebelum jatuh tempo</p>
              </div>
              <div className="w-10 h-6 bg-primary-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Bahasa Aplikasi</p>
                <p className="text-slate-500 text-xs mt-1">Bahasa Indonesia</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 md:col-span-2">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined">help</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900">Bantuan & Dukungan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:bg-primary-50 transition-colors cursor-pointer flex flex-col items-center text-center gap-3 group">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-600 text-3xl transition-colors">menu_book</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Panduan Aplikasi</p>
                  <p className="text-slate-500 text-xs mt-1">Cara penggunaan Amibook</p>
                </div>
             </div>
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:bg-primary-50 transition-colors cursor-pointer flex flex-col items-center text-center gap-3 group">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-600 text-3xl transition-colors">forum</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">FAQ</p>
                  <p className="text-slate-500 text-xs mt-1">Pertanyaan yang sering diajukan</p>
                </div>
             </div>
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:bg-primary-50 transition-colors cursor-pointer flex flex-col items-center text-center gap-3 group">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-600 text-3xl transition-colors">support_agent</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Hubungi Pustakawan</p>
                  <p className="text-slate-500 text-xs mt-1">Butuh bantuan langsung?</p>
                </div>
             </div>
          </div>
        </div>

      </div>

       {/* Mobile Logout Button (Visible only on mobile/tablet as sidebar has one) */}
      <div className="mt-8 md:hidden">
        <button onClick={handleLogout} className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors">
          <LogOut size={20} />
          Keluar dari Akun
        </button>
      </div>

    </div>
  )
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMyBorrowings, returnBook } from '@/services/bookService'
import BookCover from '@/components/shared/BookCover'
import { format, isAfter, differenceInDays } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MyBorrowingsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [returningId, setReturningId] = useState(null)
  const [filter, setFilter] = useState('all')

  const { data: borrowings = [], isLoading } = useQuery({
    queryKey: ['my-borrowings', user?.id],
    queryFn: () => getMyBorrowings(user?.id),
    enabled: !!user?.id,
  })

  const handleReturn = async (borrowingId) => {
    setReturningId(borrowingId)
    try {
      await returnBook(borrowingId)
      queryClient.invalidateQueries({ queryKey: ['my-borrowings'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Buku berhasil dikembalikan!')
    } catch {
      toast.error('Gagal mengembalikan buku')
    } finally {
      setReturningId(null)
    }
  }

  const filtered = borrowings.filter(b => {
    if (filter === 'active') return b.status === 'active'
    if (filter === 'returned') return b.status === 'returned'
    return true
  })

  const tabs = [
    { key: 'all', label: 'Semua Aktivitas', count: borrowings.length },
    { key: 'active', label: 'Sedang Dipinjam', count: borrowings.filter(b => b.status === 'active').length },
    { key: 'returned', label: 'Selesai', count: borrowings.filter(b => b.status === 'returned').length },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto md:py-8 space-y-8">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">Aktivitas Peminjaman</h1>
        <p className="text-slate-600 mt-2 text-lg">Pantau dan kelola semua buku yang sedang atau pernah Anda pinjam.</p>
      </div>

      {/* Tabs Filter */}
      <div className="mb-8 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max pb-2">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                filter === key
                  ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
                  : 'bg-white text-slate-600 hover:bg-primary-50 border border-slate-200'
              }`}
            >
              {label} {count > 0 && <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${filter === key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{count}</span>}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-primary-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <BookOpen size={64} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-lg">Belum ada aktivitas peminjaman</p>
          <p className="text-slate-400 mt-2">Mulai eksplorasi katalog kami untuk meminjam buku.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const isOverdue = b.status === 'active' && isAfter(new Date(), new Date(b.due_date))
            const daysLeft = differenceInDays(new Date(b.due_date), new Date())

            return (
              <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-100 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden group">
                
                {/* Decorative Indicator for Overdue */}
                {isOverdue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>}

                {/* Cover Image */}
                <div className="w-24 md:w-32 flex-shrink-0">
                  <BookCover book={b.books} size="sm" className="w-24 md:w-32 h-32 md:h-44 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="flex-1 w-full min-w-0 flex flex-col h-full">
                  
                  {/* Status Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    {b.status === 'returned' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Selesai
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> Terlambat {Math.abs(daysLeft)} hari
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {daysLeft} hari tersisa
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline text-xl font-bold text-slate-900 leading-snug line-clamp-2 mb-1">{b.books?.title}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-4">{b.books?.author}</p>

                  <div className="grid grid-cols-2 gap-4 mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tanggal Pinjam</p>
                      <p className="text-slate-800 font-medium text-sm">{format(new Date(b.created_at), 'dd MMM yyyy', { locale: idLocale })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        {b.status === 'returned' ? 'Dikembalikan Pada' : 'Batas Kembali'}
                      </p>
                      <p className={`font-medium text-sm ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {b.status === 'returned'
                          ? format(new Date(b.returned_at), 'dd MMM yyyy', { locale: idLocale })
                          : format(new Date(b.due_date), 'dd MMM yyyy', { locale: idLocale })
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return button (Active only) */}
                {b.status === 'active' && (
                  <div className="w-full sm:w-auto mt-4 sm:mt-0 self-center sm:self-stretch flex items-center">
                    <button
                      onClick={() => handleReturn(b.id)}
                      disabled={returningId === b.id}
                      className="w-full sm:w-auto px-6 py-3 bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {returningId === b.id ? <Loader2 size={16} className="animate-spin" /> : <span className="material-symbols-outlined text-[18px]">assignment_return</span>}
                      {returningId === b.id ? 'Proses...' : 'Kembalikan Buku'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { BookOpen, Users, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'
import { getDashboardStats, getAllBorrowings } from '@/services/bookService'
import { format, isAfter } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // refresh tiap 30 detik
  })

  const { data: borrowings = [] } = useQuery({
    queryKey: ['all-borrowings'],
    queryFn: getAllBorrowings,
  })

  const recentBorrowings = borrowings.slice(0, 8)

  const statCards = [
    { label: 'Total Buku', value: stats?.totalBooks ?? 0, icon: BookOpen, color: 'status-info' },
    { label: 'Total Anggota', value: stats?.totalMembers ?? 0, icon: Users, color: 'status-neutral' },
    { label: 'Peminjaman Aktif', value: stats?.activeBorrowings ?? 0, icon: RefreshCw, color: 'status-warning' },
    { label: 'Terlambat', value: stats?.overdueBorrowings ?? 0, icon: AlertTriangle, color: 'status-danger' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-ink">Dashboard Admin</h1>
        <p className="text-ink-muted mt-1">Ringkasan sistem perpustakaan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            {statsLoading
              ? <div className="h-8 w-16 bg-surface-container rounded animate-pulse mb-1" />
              : <div className="text-2xl font-display font-bold text-ink">{value}</div>
            }
            <div className="text-sm text-ink-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent borrowings table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="font-display font-semibold text-ink">Peminjaman Terkini</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container">
                <th className="text-left px-6 py-3 font-medium text-ink-muted">Anggota</th>
                <th className="text-left px-6 py-3 font-medium text-ink-muted">Buku</th>
                <th className="text-left px-6 py-3 font-medium text-ink-muted">Jatuh Tempo</th>
                <th className="text-left px-6 py-3 font-medium text-ink-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBorrowings.map((b) => {
                const isOverdue = b.status === 'active' && isAfter(new Date(), new Date(b.due_date))
                return (
                  <tr key={b.id} className="hover:bg-surface-low/60 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-ink">{b.profiles?.full_name ?? '-'}</p>
                      <p className="text-xs text-ink-soft">{b.profiles?.nim}</p>
                    </td>
                    <td className="px-6 py-3 max-w-xs">
                      <p className="text-ink line-clamp-1">{b.books?.title}</p>
                      <p className="text-xs text-ink-soft">{b.books?.author}</p>
                    </td>
                    <td className="px-6 py-3 text-ink-muted">
                      {format(new Date(b.due_date), 'dd MMM yyyy', { locale: idLocale })}
                    </td>
                    <td className="px-6 py-3">
                      {b.status === 'returned' ? (
                        <span className="badge status-success">Dikembalikan</span>
                      ) : isOverdue ? (
                        <span className="badge status-danger">Terlambat</span>
                      ) : (
                        <span className="badge status-info">Aktif</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {recentBorrowings.length === 0 && (
            <div className="text-center py-12 text-ink-soft text-sm">Belum ada data peminjaman</div>
          )}
        </div>
      </div>
    </div>
  )
}

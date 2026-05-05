import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, User, Tag, Hash, ArrowLeft, Loader2 } from 'lucide-react'
import { getBookById, borrowBook } from '@/services/bookService'
import { useAuthStore } from '@/store/authStore'
import { addDays, format } from 'date-fns'
import { id } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function BookDetailPage() {
  const { id: bookId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [isBorrowing, setIsBorrowing] = useState(false)

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId),
  })

  const dueDate = addDays(new Date(), 7) // 7 hari masa pinjam default

  const handleBorrow = async () => {
    setIsBorrowing(true)
    try {
      await borrowBook({ bookId, userId: user.id, dueDate: dueDate.toISOString() })
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      queryClient.invalidateQueries({ queryKey: ['my-borrowings'] })
      toast.success('Buku berhasil dipinjam! Jatuh tempo: ' + format(dueDate, 'dd MMM yyyy', { locale: id }))
      navigate('/my-borrowings')
    } catch (error) {
      toast.error(error.message ?? 'Gagal meminjam buku')
    } finally {
      setIsBorrowing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="animate-spin text-primary-600" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-32 flex flex-col items-center">
         <BookOpen size={64} className="text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium text-lg">Buku tidak ditemukan.</p>
        <button onClick={() => navigate('/catalog')} className="mt-6 text-primary-700 font-bold hover:underline">Kembali ke Katalog</button>
      </div>
    )
  }

  const isAvailable = book.available_copies > 0

  return (
    <div className="max-w-7xl mx-auto md:py-8 space-y-8">
      {/* Top Bar / Back Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline font-bold text-slate-500">Kembali ke Katalog</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
        
        {/* Left Column: Image & Sticky Actions */}
        <div className="w-full lg:w-1/3 flex-shrink-0 lg:sticky lg:top-8 space-y-8">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
            <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-inner relative flex items-center justify-center">
               {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={80} className="text-slate-300" />
                )}
                
                {/* Visual availability status tag on image */}
                <div className={`absolute top-4 right-4 text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur ${isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                  {isAvailable ? 'Tersedia' : 'Sedang Dipinjam'}
                </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {isAvailable ? (
              <>
                <p className="text-sm text-center text-slate-500 font-medium mb-2">
                  Jatuh tempo peminjaman: <strong className="text-slate-900">{format(dueDate, 'EEEE, dd MMMM yyyy', { locale: id })}</strong>
                </p>
                <button
                  onClick={handleBorrow}
                  disabled={isBorrowing}
                  className="w-full py-4 bg-primary-700 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-primary-700/20 hover:bg-primary-800 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isBorrowing ? <Loader2 size={20} className="animate-spin" /> : <span className="material-symbols-outlined">book</span>}
                  {isBorrowing ? 'Memproses...' : 'Pinjam Buku Ini'}
                </button>
              </>
            ) : (
              <button disabled className="w-full py-4 bg-slate-200 text-slate-500 rounded-2xl font-bold tracking-wide shadow-inner cursor-not-allowed flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">schedule</span>
                Tidak Tersedia
              </button>
            )}
            
            <button className="w-full py-4 bg-white border-2 border-primary-100 text-primary-700 rounded-2xl font-bold tracking-wide hover:bg-primary-50 transition-all flex justify-center items-center gap-2">
              <span className="material-symbols-outlined">bookmark_add</span>
              Simpan ke Koleksi
            </button>
          </div>
        </div>

        {/* Right Column: Book Details */}
        <div className="flex-1 space-y-10">
          
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {book.categories?.name && (
                <span className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-md tracking-wide">
                  {book.categories.name}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 leading-tight mb-4">{book.title}</h1>
            <p className="text-xl text-slate-500 font-medium mb-6">oleh <span className="text-slate-800 font-bold">{book.author}</span></p>
            
            <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                   <span key={star} className={`material-symbols-outlined text-2xl ${star === 5 ? 'text-amber-200' : 'text-amber-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="text-lg font-bold text-slate-800 ml-2">4.8</span>
                <span className="text-slate-500 ml-1">(120 ulasan)</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Information */}
          <div>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-6">Informasi Buku</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                <span className="material-symbols-outlined text-slate-400 mb-2">apartment</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Penerbit</p>
                <p className="text-slate-900 font-medium line-clamp-1" title={book.publisher}>{book.publisher || '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                <span className="material-symbols-outlined text-slate-400 mb-2">calendar_month</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tahun Terbit</p>
                <p className="text-slate-900 font-medium">{book.year || '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                <span className="material-symbols-outlined text-slate-400 mb-2">library_books</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stok Eksemplar</p>
                <p className="text-slate-900 font-medium">{book.available_copies} / {book.total_copies}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                <span className="material-symbols-outlined text-slate-400 mb-2">tag</span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">ISBN</p>
                <p className="text-slate-900 font-medium truncate" title={book.isbn}>{book.isbn || '-'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="text-xl font-headline font-bold text-slate-900 mb-6">Sinopsis</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-body">
                <p className="whitespace-pre-line">{book.description}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

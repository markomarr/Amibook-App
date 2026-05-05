import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Filter } from 'lucide-react'
import { getBooks, getCategories } from '@/services/bookService'
import { getBookCoverUrl } from '@/utils/bookUtils'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 12

  const { data, isLoading } = useQuery({
    queryKey: ['books', { search, category, page }],
    queryFn: () => getBooks({ search, category, page, limit: LIMIT }),
    keepPreviousData: true,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const totalPages = Math.ceil((data?.count ?? 0) / LIMIT)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="w-full max-w-7xl mx-auto md:py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Katalog Perpustakaan</h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-lg">Eksplorasi koleksi literatur akademik dan temukan sumber referensi terbaik untuk studi Anda.</p>
        </div>
      </div>

      {/* Search & Filter Glass Bar */}
      <div className="sticky top-20 md:top-6 z-30 mb-10">
        <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-primary-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Cari judul buku, penulis, atau ISBN..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-400 shadow-inner"
            />
          </div>
          <button className="bg-primary-100 text-primary-700 p-4 rounded-xl flex items-center justify-center hover:bg-primary-200 transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Categories / Departments */}
      <div className="mb-12 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="flex gap-3 min-w-max pb-4">
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${
              category === '' ? 'bg-primary-700 text-white shadow-primary-700/20' : 'bg-white text-slate-600 hover:bg-primary-50 border border-primary-100'
            }`}
          >
            Semua
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setPage(1); }}
              className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${
                category === c.id ? 'bg-primary-700 text-white shadow-primary-700/20' : 'bg-white text-slate-600 hover:bg-primary-50 border border-primary-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {data && (
        <p className="text-sm text-slate-500 mb-4 font-body">
          Menampilkan <strong className="text-slate-900">{data.data?.length}</strong> dari{' '}
          <strong className="text-slate-900">{data.count}</strong> buku
        </p>
      )}

      {/* Book Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-5 shadow-sm border border-primary-100 flex flex-col h-96">
              <div className="w-full aspect-[3/4] bg-slate-100 rounded-xl mb-5" />
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
              <div className="h-6 bg-slate-100 rounded w-full mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-6" />
              <div className="mt-auto h-10 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {(data?.data ?? []).map((book) => (
            <article key={book.id} className="bg-white rounded-2xl p-5 shadow-sm border border-primary-100 hover:shadow-lg hover:shadow-primary-900/5 transition-all duration-300 flex flex-col group">
              <Link to={`/books/${book.id}`} className="relative w-full aspect-[3/4] mb-5 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {getBookCoverUrl(book) ? (
                  <img src={getBookCoverUrl(book)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <BookOpen size={48} className="text-primary-300" />
                )}
                
                {/* Available Badge as 'Baru' if condition met, using it for something visual */}
                {book.available_copies > 0 && (
                   <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                     Tersedia
                   </div>
                )}
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wide text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                    {book.categories?.name || 'Kategori'}
                  </span>
                  <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-slate-800 ml-1 text-sm">4.8</span>
                  </div>
                </div>
                
                <Link to={`/books/${book.id}`}>
                  <h3 className="font-headline font-bold text-xl text-slate-900 leading-tight mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 mb-6 font-medium line-clamp-1">{book.author}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${book.available_copies > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {book.available_copies > 0 ? 'check_circle' : 'schedule'}
                    </span>
                    <span className="text-xs font-bold tracking-wide uppercase">
                      {book.available_copies > 0 ? 'Tersedia' : 'Dipinjam'}
                    </span>
                  </div>
                  
                  <button className="bg-primary-50 text-primary-700 hover:bg-primary-100 p-2.5 rounded-full transition-colors">
                    <span className="material-symbols-outlined">bookmark_add</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Buku tidak ditemukan</p>
          <p className="text-sm text-slate-400 mt-1">Coba kata kunci lain atau hapus filter</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            ← Sebelumnya
          </button>
          <span className="flex items-center px-4 text-sm text-slate-500 font-medium">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  )
}

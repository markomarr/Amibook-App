import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMyBorrowings, getBooks } from '@/services/bookService'
import { format, isAfter } from 'date-fns'
import { id } from 'date-fns/locale'
import { getBookCoverUrl } from '@/utils/bookUtils'

export default function HomePage() {
  const { profile, user } = useAuthStore()

  const { data: borrowings = [] } = useQuery({
    queryKey: ['my-borrowings', user?.id],
    queryFn: () => getMyBorrowings(user?.id),
    enabled: !!user?.id,
  })

  const { data: booksData } = useQuery({
    queryKey: ['books', { limit: 6 }],
    queryFn: () => getBooks({ limit: 6 }),
  })

  const activeBorrowings = borrowings.filter(b => b.status === 'active')
  const currentlyReading = activeBorrowings[0] // Just taking the first one for the hero card
  
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Greeting Section with Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-sm border border-primary-100 mb-10 bg-slate-900">
        <img src="/hero-banner.png" alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/60 mix-blend-multiply"></div>
        <div className="relative z-10 p-8 md:p-12 text-white">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-2">
            Halo, {profile?.full_name?.split(' ')[0] ?? 'Pengguna'}! 👋
          </h1>
          <p className="font-body text-base md:text-lg text-primary-100 max-w-lg leading-relaxed">
            Selamat datang di perpustakaan digital Anda. Temukan ribuan literatur akademik untuk mendukung studi dan riset Anda.
          </p>
        </div>
      </section>

      {/* Sedang Dibaca (Currently Reading) */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Sedang Dibaca</h2>
          <span className="material-symbols-outlined text-outline text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>
        
        {currentlyReading ? (
          <div className="relative bg-surface-container-highest rounded-[1.5rem] p-6 ring-1 ring-outline-variant/15 flex flex-col sm:flex-row gap-6 items-start mt-10">
            {/* Overlapping Image */}
            <div className="w-28 h-40 rounded-xl overflow-hidden -mt-12 flex-shrink-0 z-10 ring-1 ring-outline-variant/30 shadow-lg shadow-on-surface/5 bg-surface flex items-center justify-center">
              {getBookCoverUrl(currentlyReading.books) ? (
                <img src={getBookCoverUrl(currentlyReading.books)} alt="Book Cover" className="w-full h-full object-cover" />
              ) : (
                <BookOpen size={40} className="text-primary-300" />
              )}
            </div>
            
            <div className="flex-1 w-full">
              <span className="inline-block px-3 py-1 bg-surface-container rounded-full text-[10px] font-label font-bold text-primary uppercase tracking-widest mb-2">
                {currentlyReading.books?.categories?.name || 'Buku'}
              </span>
              <h3 className="font-headline text-xl font-bold text-on-surface leading-snug line-clamp-2">
                {currentlyReading.books?.title}
              </h3>
              <p className="font-label text-sm text-on-surface-variant mt-1">{currentlyReading.books?.author}</p>
              
              {/* Fake Progress for visual appeal, can be replaced with real data if available */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-container rounded-full w-[45%] relative">
                    <div className="absolute inset-0 bg-white/20"></div>
                  </div>
                </div>
                <span className="font-label text-xs font-bold text-on-tertiary-container">45%</span>
              </div>
              
              <Link to={`/my-borrowings`} className="block mt-6 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-label text-sm font-bold py-3 px-6 rounded-full w-full text-center hover:scale-[1.02] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]">
                Lanjutkan
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl p-6 text-center ring-1 ring-outline-variant/15">
            <p className="text-on-surface-variant font-body">Belum ada buku yang sedang dipinjam.</p>
            <Link to="/catalog" className="inline-block mt-4 text-primary font-bold hover:underline">Cari Buku</Link>
          </div>
        )}
      </section>

      {/* Rekomendasi Buku (Book Recommendations) */}
      <section className="mb-14">
        <div className="mb-8 flex justify-between items-end">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Rekomendasi Buku</h2>
          <Link to="/catalog" className="font-label text-sm font-bold text-primary hover:text-primary-dim transition-colors">Lihat Semua</Link>
        </div>
        
        <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {(booksData?.data || []).map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="snap-start flex-shrink-0 w-40 bg-surface-container-low rounded-xl p-4 flex flex-col items-center text-center relative mt-6 ring-1 ring-outline-variant/15 hover:bg-surface-container transition-colors duration-300 group">
              <div className="w-28 h-40 rounded-lg overflow-hidden -mt-10 z-10 shadow-md shadow-on-surface/5 group-hover:-translate-y-1 transition-transform duration-300 bg-surface flex items-center justify-center">
                {getBookCoverUrl(book) ? (
                  <img src={getBookCoverUrl(book)} alt="Book Cover" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={30} className="text-primary-300" />
                )}
              </div>
              <div className="mt-4 w-full">
                <h3 className="font-headline text-sm font-bold text-on-surface leading-tight line-clamp-2" title={book.title}>{book.title}</h3>
                <p className="font-label text-xs text-on-surface-variant mt-2 line-clamp-1">{book.author}</p>
              </div>
            </Link>
          ))}
          {(!booksData?.data || booksData.data.length === 0) && (
            <p className="text-on-surface-variant font-body">Belum ada rekomendasi.</p>
          )}
        </div>
      </section>

      {/* Berita Kampus (Campus News) */}
      <section className="mb-8">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Berita Kampus</h2>
        <div className="flex flex-col gap-4">
          
          <div className="bg-surface-container-low rounded-[1.25rem] p-4 flex gap-5 items-center ring-1 ring-outline-variant/10 hover:bg-surface-container transition-colors duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center text-primary-300">
               <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-label font-bold text-tertiary-dim uppercase tracking-widest">Pengumuman</span>
              <h3 className="font-headline text-sm font-bold text-on-surface mt-1 leading-snug">Jadwal Pengembalian Buku Akhir Semester Genap</h3>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </div>

          <div className="bg-surface-container-low rounded-[1.25rem] p-4 flex gap-5 items-center ring-1 ring-outline-variant/10 hover:bg-surface-container transition-colors duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center text-primary-300">
               <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-label font-bold text-primary uppercase tracking-widest">Seminar</span>
              <h3 className="font-headline text-sm font-bold text-on-surface mt-1 leading-snug">Bedah Buku: Dinamika Politik Lokal bersama Penulis</h3>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </div>
          
        </div>
      </section>
    </div>
  )
}

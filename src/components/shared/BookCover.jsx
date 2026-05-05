import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { getBookCoverUrl } from '@/utils/bookUtils'

/**
 * BookCover — renders book cover with smooth loading transition.
 * Shows a skeleton placeholder while the image loads, then fades in.
 * Falls back to an icon if no URL or if the image fails to load.
 */
export default function BookCover({ book, size = 'md', className = '' }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'error'
  const coverUrl = getBookCoverUrl(book)

  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-28 h-40',
    lg: 'w-full aspect-[3/4]',
  }

  const iconSizes = { sm: 24, md: 32, lg: 64 }

  if (!coverUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center`}>
        <BookOpen size={iconSizes[size]} className="text-primary-300" />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-xl overflow-hidden relative bg-slate-100`}>
      {/* Skeleton pulse while loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse flex items-center justify-center">
          <BookOpen size={iconSizes[size]} className="text-primary-200" />
        </div>
      )}

      {/* Actual image — fades in once loaded */}
      <img
        src={coverUrl}
        alt={book?.title || 'Book cover'}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        loading="lazy"
      />

      {/* Fallback icon on error */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
          <BookOpen size={iconSizes[size]} className="text-primary-300" />
        </div>
      )}
    </div>
  )
}

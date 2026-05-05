export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-xl font-bold text-gray-800">AMIBOOK</span>
      </div>

      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Memuat...</p>
    </div>
  )
}

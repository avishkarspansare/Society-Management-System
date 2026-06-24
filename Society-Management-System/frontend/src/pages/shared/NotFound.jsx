import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        {/* Big 404 */}
        <div className="relative inline-block mb-8">
          <p className="text-[10rem] font-display font-black text-surface-800 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-5xl font-display font-bold text-gradient">Oops!</p>
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-surface-100 mb-3">Page not found</h1>
        <p className="text-surface-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-secondary gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
          <Link to="/admin/dashboard" className="btn-primary gap-2">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Header({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth()
  const unreadCount = useSelector(s => s.notifications.unreadCount)
  const [dropOpen, setDropOpen] = useState(false)

  const prefix = isAdmin() ? '/admin' : '/resident'

  return (
    <header className="h-16 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50 flex items-center justify-between px-4 lg:px-6 z-10 sticky top-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-surface-800/60 border border-surface-700/40 rounded-xl px-3 py-2 w-64">
          <Search className="w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-surface-300 placeholder-surface-500 focus:outline-none flex-1"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <Link
          to={`${prefix}/profile`}
          className="relative p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-700/60 transition-all"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(d => !d)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-700/60 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-surface-100 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-surface-400">{user?.userType?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-surface-500" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-card py-1 animate-fade-in z-50">
              <Link
                to={`${prefix}/profile`}
                onClick={() => setDropOpen(false)}
                className="block px-4 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-700/50 transition-colors"
              >
                My Profile
              </Link>
              <div className="divider my-1" />
              <button
                onClick={() => { setDropOpen(false); logout() }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

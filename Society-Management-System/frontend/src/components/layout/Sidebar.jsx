import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, Users, Building2, CreditCard, MessageSquare,
  UserCheck, Megaphone, Calendar, Dumbbell, Bell, Settings,
  LogOut, Building, ChevronRight, ShieldCheck,
} from 'lucide-react'

const adminLinks = [
  { to: '/admin/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/users',         label: 'Residents',      icon: Users },
  { to: '/admin/units',         label: 'Units',          icon: Building },
  { to: '/admin/payments',      label: 'Payments',       icon: CreditCard },
  { to: '/admin/complaints',    label: 'Complaints',     icon: MessageSquare },
  { to: '/admin/visitors',      label: 'Visitors',       icon: UserCheck },
  { to: '/admin/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/admin/events',        label: 'Events',         icon: Calendar },
  { to: '/admin/amenities',     label: 'Amenities',      icon: Dumbbell },
]

const residentLinks = [
  { to: '/resident/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/resident/payments',      label: 'Payments',      icon: CreditCard },
  { to: '/resident/complaints',    label: 'Complaints',    icon: MessageSquare },
  { to: '/resident/visitors',      label: 'Visitors',      icon: UserCheck },
  { to: '/resident/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/resident/amenities',     label: 'Amenities',     icon: Dumbbell },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth()
  const links = isAdmin() ? adminLinks : residentLinks

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        bg-surface-900/95 backdrop-blur-xl border-r border-surface-700/50
        transition-all duration-300 ease-in-out
        ${open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}
        lg:w-64 lg:static lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-700/50 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-surface-50 text-sm leading-tight">Society</p>
            <p className="text-xs text-primary-400 font-medium">Management System</p>
          </div>
        </div>

        {/* User badge */}
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-surface-800/60 border border-surface-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-surface-100 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-surface-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.userType?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-surface-500">
            {isAdmin() ? 'Administration' : 'My Account'}
          </p>

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'nav-item-active' : 'nav-item'
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </NavLink>
          ))}

          <div className="divider my-3" />

          <NavLink to={`${isAdmin() ? "/admin" : "/resident"}/profile`} onClick={onClose} className="nav-item">
            <Settings className="w-4 h-4 shrink-0" />
            <span>Profile & Settings</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-surface-700/50 shrink-0">
          <button
            onClick={logout}
            className="w-full nav-item text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

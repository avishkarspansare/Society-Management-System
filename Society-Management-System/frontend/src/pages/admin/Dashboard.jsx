import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { societyService } from '../../services/societyService'
import StatCard from '../../components/common/StatCard'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import {
  Building, Users, CreditCard, MessageSquare, UserCheck,
  Megaphone, Calendar, AlertTriangle, TrendingUp, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']

const mockTrend = [
  { month: 'Jan', payments: 42, complaints: 8 },
  { month: 'Feb', payments: 55, complaints: 12 },
  { month: 'Mar', payments: 48, complaints: 7 },
  { month: 'Apr', payments: 70, complaints: 15 },
  { month: 'May', payments: 60, complaints: 10 },
  { month: 'Jun', payments: 85, complaints: 6 },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const societyId = user?.societyId
    if (!societyId) { setLoading(false); return }
    societyService.getDashboard(societyId)
      .then(r => setStats(r.data?.data ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, <span className="text-primary-400 font-medium">{user?.firstName}</span>!
          Here's what's happening in your society today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Units"       value={stats?.totalUnits       ?? '—'} icon={Building}      color="primary" />
        <StatCard label="Occupied Units"    value={stats?.occupiedUnits    ?? '—'} icon={Users}         color="success" />
        <StatCard label="Pending Payments"  value={stats?.pendingPayments  ?? '—'} icon={CreditCard}    color="warning" />
        <StatCard label="Open Complaints"   value={stats?.openComplaints   ?? '—'} icon={MessageSquare} color="danger"  />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Visitors"      value={stats?.activeVisitors      ?? '—'} icon={UserCheck}     color="info"    />
        <StatCard label="Visitors Today"       value={stats?.visitorsToday       ?? '—'} icon={Activity}      color="primary" />
        <StatCard label="Active Announcements" value={stats?.activeAnnouncements ?? '—'} icon={Megaphone}     color="accent"  />
        <StatCard label="Upcoming Events"      value={stats?.upcomingEvents      ?? '—'} icon={Calendar}      color="success" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="text-base font-display font-semibold text-surface-100 mb-4">Payment & Complaint Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="payments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"   stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%"  stopColor="#6366f1" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="complaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"   stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%"  stopColor="#f59e0b" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }}
                cursor={{ stroke: '#334155' }}
              />
              <Area type="monotone" dataKey="payments"   stroke="#6366f1" fill="url(#payments)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="complaints" stroke="#f59e0b" fill="url(#complaints)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <div className="w-3 h-3 rounded-full bg-primary-500" /> Payments
            </div>
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <div className="w-3 h-3 rounded-full bg-accent-500" /> Complaints
            </div>
          </div>
        </div>

        {/* Occupancy donut */}
        <div className="glass-card p-5 flex flex-col">
          <h2 className="text-base font-display font-semibold text-surface-100 mb-4">Unit Occupancy</h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Occupied', value: stats?.occupiedUnits ?? 70 },
                    { name: 'Vacant',   value: stats?.vacantUnits   ?? 30 },
                  ]}
                  cx="50%" cy="50%" innerRadius={55} outerRadius={75}
                  dataKey="value" paddingAngle={3}
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#334155" />
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-primary-400">{stats?.occupiedUnits ?? '—'}</p>
              <p className="text-xs text-surface-500">Occupied</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-surface-400">{stats?.vacantUnits ?? '—'}</p>
              <p className="text-xs text-surface-500">Vacant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent announcements */}
      {stats?.recentAnnouncements?.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-base font-display font-semibold text-surface-100 mb-4 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-accent-400" /> Recent Announcements
          </h2>
          <div className="space-y-3">
            {stats.recentAnnouncements.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-700/30 transition-colors">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  a.announcementType === 'EMERGENCY' ? 'bg-red-400' :
                  a.announcementType === 'MAINTENANCE' ? 'bg-amber-400' : 'bg-primary-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-200 truncate">{a.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{a.content}</p>
                </div>
                <Badge variant={a.announcementType === 'EMERGENCY' ? 'danger' : 'info'}>
                  {a.announcementType}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { announcementService } from '../../services/announcementService'
import Badge from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { Bell, RefreshCw, AlertTriangle, Info, Wrench, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  EMERGENCY:   { icon: AlertTriangle, color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',     variant: 'danger'  },
  MAINTENANCE: { icon: Wrench,        color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20', variant: 'warning' },
  EVENT:       { icon: Calendar,      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', variant: 'success' },
  GENERAL:     { icon: Bell,          color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20', variant: 'primary' },
  NOTICE:      { icon: Info,          color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',   variant: 'info'    },
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ResidentAnnouncements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('ALL')

  const FILTERS = ['ALL', 'GENERAL', 'EMERGENCY', 'MAINTENANCE', 'EVENT', 'NOTICE']

  const fetchAnnouncements = useCallback(() => {
    if (!user?.societyId) return setLoading(false)
    setLoading(true)
    announcementService.getActive(user.societyId)
      .then(r => setAnnouncements(r.data?.data ?? []))
      .catch(() => toast.error('Failed to load announcements'))
      .finally(() => setLoading(false))
  }, [user?.societyId])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const filtered = filter === 'ALL' ? announcements
    : announcements.filter(a => a.announcementType === filter)

  // Sort emergencies first
  const sorted = [...filtered].sort((a, b) => {
    if (a.announcementType === 'EMERGENCY' && b.announcementType !== 'EMERGENCY') return -1
    if (b.announcementType === 'EMERGENCY' && a.announcementType !== 'EMERGENCY') return 1
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Society notices and updates</p>
        </div>
        <button onClick={fetchAnnouncements} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-surface-800 text-surface-400 hover:text-surface-100 border border-surface-700/50'
            }`}
          >
            {f}
            {f !== 'ALL' && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({announcements.filter(a => a.announcementType === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : sorted.length === 0 ? (
        <div className="py-12 text-center text-surface-500">No announcements</div>
      ) : (
        <div className="space-y-3">
          {sorted.map(a => {
            const cfg = TYPE_CONFIG[a.announcementType] || TYPE_CONFIG.GENERAL
            const Icon = cfg.icon
            return (
              <div key={a.id} className={`glass-card p-5 border ${cfg.bg} transition-all hover:scale-[1.005]`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-surface-100">{a.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={cfg.variant}>{a.announcementType}</Badge>
                        <span className="text-xs text-surface-500">{formatDate(a.createdAt)}</span>
                      </div>
                    </div>
                    {a.content && (
                      <p className="text-sm text-surface-400 mt-2 leading-relaxed">{a.content}</p>
                    )}
                    {a.expiryDate && (
                      <p className="text-xs text-surface-500 mt-2">
                        Valid until: {formatDate(a.expiryDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

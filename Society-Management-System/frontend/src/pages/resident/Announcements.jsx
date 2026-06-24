import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { announcementService } from '../../services/announcementService'
import Badge from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { Megaphone, Bell, AlertTriangle, Info, Calendar } from 'lucide-react'

const typeIcon = (type) => {
  const icons = { URGENT: AlertTriangle, EVENT: Calendar, GENERAL: Info, MAINTENANCE: Bell }
  const Ic = icons[type] || Megaphone
  return <Ic className="w-4 h-4" />
}

const typeVariant = (type) =>
  ({ URGENT:'danger', EVENT:'success', GENERAL:'info', MAINTENANCE:'warning' }[type] || 'primary')

export default function ResidentAnnouncements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('ALL')

  useEffect(() => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    announcementService.getActive(sid)
      .then(r => setAnnouncements(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'ALL' ? announcements
    : announcements.filter(a => a.announcementType === filter)

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">Stay informed about what's happening in your society</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL','URGENT','GENERAL','EVENT','MAINTENANCE'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === t ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'btn-ghost py-1.5'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-surface-500">
          <Megaphone className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className={`glass-card p-5 border-l-4 ${
              a.announcementType === 'URGENT' ? 'border-l-red-500' :
              a.announcementType === 'EVENT'  ? 'border-l-emerald-500' :
              a.announcementType === 'MAINTENANCE' ? 'border-l-amber-500' :
              'border-l-primary-500'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${
                  a.announcementType === 'URGENT' ? 'text-red-400' :
                  a.announcementType === 'EVENT'  ? 'text-emerald-400' :
                  a.announcementType === 'MAINTENANCE' ? 'text-amber-400' : 'text-primary-400'
                }`}>
                  {typeIcon(a.announcementType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-surface-100">{a.title}</h3>
                    <Badge variant={typeVariant(a.announcementType)}>
                      {a.announcementType}
                    </Badge>
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed mb-2">{a.content}</p>
                  <p className="text-xs text-surface-500">
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', {
                      day:'numeric', month:'long', year:'numeric'
                    }) : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

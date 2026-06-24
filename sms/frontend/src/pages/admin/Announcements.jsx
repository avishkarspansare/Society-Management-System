import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { announcementService } from '../../services/announcementService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Megaphone, Plus, Trash2, Bell } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const TYPES = ['GENERAL', 'MAINTENANCE', 'EMERGENCY', 'EVENT', 'FINANCIAL']

const typeColor = { EMERGENCY: 'danger', MAINTENANCE: 'warning', FINANCIAL: 'info', EVENT: 'success', GENERAL: 'default' }

export default function AdminAnnouncements() {
  const { user } = useAuth()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const fetch = () => {
    setLoading(true)
    announcementService.getAll(user?.societyId, { page: 0, size: 50 })
      .then(r => setItems(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load announcements'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleCreate = async (data) => {
    try {
      await announcementService.create({ ...data, societyId: user?.societyId })
      toast.success('Announcement created!'); reset(); setShowModal(false); fetch()
    } catch { toast.error('Failed to create') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try { await announcementService.delete(id); toast.success('Deleted'); fetch() }
    catch { toast.error('Failed to delete') }
  }

  const handleNotify = async (id) => {
    try { await announcementService.notify(id); toast.success('Notification sent to all residents!') }
    catch { toast.error('Failed to send notification') }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Post and manage society announcements</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {loading ? <PageLoader /> : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="glass-card p-12 text-center text-surface-500">No announcements yet</div>
          ) : items.map(a => (
            <div key={a.id} className="glass-card-hover p-5 flex items-start gap-4">
              <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                a.announcementType === 'EMERGENCY' ? 'bg-red-400' :
                a.announcementType === 'MAINTENANCE' ? 'bg-amber-400' : 'bg-primary-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-surface-100">{a.title}</h3>
                  <Badge variant={typeColor[a.announcementType] || 'default'}>{a.announcementType}</Badge>
                </div>
                <p className="text-sm text-surface-400 mt-1 line-clamp-2">{a.content}</p>
                <p className="text-xs text-surface-500 mt-2">
                  By {a.createdByUserName} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleNotify(a.id)} className="btn-ghost text-xs p-1.5 text-primary-400 tooltip" title="Send notification">
                  <Bell className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="btn-ghost text-xs p-1.5 text-red-400" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Announcement"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button form="ann-form" type="submit" className="btn-primary">Post</button>
          </>
        }
      >
        <form id="ann-form" onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input {...register('title', { required: true })} className="form-input" placeholder="Announcement title" />
          </div>
          <div>
            <label className="form-label">Type *</label>
            <select {...register('announcementType', { required: true })} className="form-input">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Priority (1=high, 5=low)</label>
            <input {...register('priority', { valueAsNumber: true })} type="number" min={1} max={5} defaultValue={3} className="form-input" />
          </div>
          <div>
            <label className="form-label">Content *</label>
            <textarea {...register('content', { required: true })} rows={4} className="form-input resize-none" placeholder="Announcement details..." />
          </div>
        </form>
      </Modal>
    </div>
  )
}

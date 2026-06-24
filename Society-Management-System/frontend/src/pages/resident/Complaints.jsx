import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { complaintService } from '../../services/complaintService'
import Badge, { statusVariant } from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MessageSquare, Plus, AlertTriangle, Filter } from 'lucide-react'

const CATEGORIES = ['Plumbing','Electrical','Elevator','Security','Cleanliness','Noise','Parking','Internet','Other']
const PRIORITIES  = ['LOW','MEDIUM','HIGH','CRITICAL']

const priorityVariant = (p) =>
  ({ LOW:'info', MEDIUM:'warning', HIGH:'danger', CRITICAL:'danger' }[p] || 'primary')

export default function ResidentComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('ALL')
  const [showModal,  setShowModal]  = useState(false)
  const [saving,     setSaving]     = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchComplaints = () => {
    complaintService.getMine({ page: 0, size: 100 })
      .then(r => setComplaints(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchComplaints() }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await complaintService.create({ ...data, societyId: user?.societyId })
      toast.success('Complaint submitted')
      fetchComplaints(); setShowModal(false); reset()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter)

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">Raise and track your complaints</p>
        </div>
        <button onClick={() => { reset(); setShowModal(true) }} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-surface-500" />
        {['ALL','OPEN','IN_PROGRESS','RESOLVED','CLOSED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === s ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'btn-ghost py-1.5'
            }`}
          >{s.replace('_',' ')}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-16 text-surface-500">
          <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-surface-100 truncate">{c.title}</h3>
                  <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                  <Badge variant={priorityVariant(c.priority)}>{c.priority}</Badge>
                </div>
                <p className="text-sm text-surface-400 mb-2 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {c.category}
                  </span>
                  <span>#{c.id}</span>
                  <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : ''}</span>
                </div>
              </div>
              {c.status === 'RESOLVED' && (
                <div className="text-xs text-emerald-400 shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                  ✓ Resolved
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Raise a Complaint">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input className="form-input" {...register('title', { required: true })} placeholder="Brief summary of the issue" />
            {errors.title && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select className="form-input" {...register('category', { required: true })}>
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select className="form-input" {...register('priority')} defaultValue="MEDIUM">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Description *</label>
            <textarea rows={4} className="form-input resize-none" {...register('description', { required: true })}
              placeholder="Describe the issue in detail…" />
            {errors.description && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Submitting…' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

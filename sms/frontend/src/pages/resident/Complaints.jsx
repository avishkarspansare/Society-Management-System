import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { complaintService } from '../../services/complaintService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { MessageSquare, RefreshCw, Plus, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'Security', 'Parking', 'Noise', 'Lift', 'Other']
const PRIORITIES  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function ComplaintForm({ onSubmit, onClose, loading }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { category: 'Plumbing', priority: 'MEDIUM' }
  })
  const [classifying, setClassifying] = useState(false)
  const title = watch('title')
  const description = watch('description')

  const autoClassify = async () => {
    if (!title || !description) return toast.error('Enter title and description first')
    setClassifying(true)
    try {
      const r = await complaintService.classify(title, description)
      const d = r.data?.data ?? r.data
      if (d?.category) setValue('category', d.category)
      if (d?.priority) setValue('priority', d.priority)
      toast.success('AI classified your complaint!')
    } catch { toast.error('AI classification unavailable') }
    finally { setClassifying(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input {...register('title', { required: 'Required' })} className="form-input" placeholder="Brief description of the issue" />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="form-label">Details *</label>
        <textarea {...register('description', { required: 'Required' })} rows={4} className="form-input resize-none"
          placeholder="Describe the problem in detail…" />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Category</label>
          <select {...register('category')} className="form-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Priority</label>
          <select {...register('priority')} className="form-input">
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <button type="button" onClick={autoClassify} disabled={classifying}
        className="btn-ghost text-xs text-primary-400 gap-1.5 border border-primary-500/30 hover:bg-primary-500/10">
        <Sparkles className="w-3.5 h-3.5" />
        {classifying ? 'Classifying…' : 'AI Auto-classify'}
      </button>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </div>
    </form>
  )
}

export default function ResidentComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [showModal, setShowModal]   = useState(false)

  const fetchComplaints = useCallback(() => {
    setLoading(true)
    complaintService.getMine({ page: 0, size: 50 })
      .then(r => setComplaints(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchComplaints() }, [fetchComplaints])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await complaintService.create({ ...data, societyId: user?.societyId })
      toast.success('Complaint submitted!')
      setShowModal(false)
      fetchComplaints()
    } catch (e) { toast.error(e.message || 'Failed to submit') }
    finally { setSaving(false) }
  }

  const PRIORITY_VARIANT = { CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'default' }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">Submit and track maintenance requests</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchComplaints} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> New Complaint
          </button>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open',        val: complaints.filter(c => c.status === 'OPEN').length,        color: 'text-blue-400' },
          { label: 'In Progress', val: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: 'text-amber-400' },
          { label: 'Resolved',    val: complaints.filter(c => c.status === 'RESOLVED').length,    color: 'text-emerald-400' },
          { label: 'Total',       val: complaints.length,                                          color: 'text-surface-100' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${color}`}>{val}</p>
            <p className="text-xs text-surface-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['#', 'Title', 'Category', 'Priority', 'Status', 'Submitted'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center"><PageLoader /></td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-surface-500">No complaints raised</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id} className="table-row">
                <td className="table-td text-surface-500 text-xs">#{c.id}</td>
                <td className="table-td font-medium text-surface-200 max-w-[200px] truncate">{c.title}</td>
                <td className="table-td text-surface-400">{c.category}</td>
                <td className="table-td">
                  <Badge variant={PRIORITY_VARIANT[c.priority] || 'default'}>{c.priority}</Badge>
                </td>
                <td className="table-td">
                  <Badge variant={statusVariant(c.status)}>{c.status?.replace('_', ' ')}</Badge>
                </td>
                <td className="table-td text-surface-500 text-xs">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Complaint" size="lg">
        <ComplaintForm onSubmit={handleCreate} onClose={() => setShowModal(false)} loading={saving} />
      </Modal>
    </div>
  )
}

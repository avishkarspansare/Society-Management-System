import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { visitorService } from '../../services/visitorService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UserCheck, Plus, QrCode, Filter } from 'lucide-react'

const statusVariant = (s) =>
  ({ PENDING:'warning', APPROVED:'success', CHECKED_IN:'info', CHECKED_OUT:'primary', DENIED:'danger' }[s] || 'primary')

export default function ResidentVisitors() {
  const { user } = useAuth()
  const [visitors,  setVisitors]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [saving,    setSaving]    = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchVisitors = () => {
    visitorService.getMine({ page: 0, size: 100 })
      .then(r => setVisitors(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVisitors() }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await visitorService.create({ ...data, societyId: user?.societyId })
      toast.success('Visitor registered')
      fetchVisitors(); setShowModal(false); reset()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const filtered = filter === 'ALL' ? visitors : visitors.filter(v => v.status === filter)

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">My Visitors</h1>
          <p className="page-subtitle">Register and track your guests</p>
        </div>
        <button onClick={() => { reset(); setShowModal(true) }} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Register Visitor
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-surface-500" />
        {['ALL','PENDING','APPROVED','CHECKED_IN','CHECKED_OUT'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === s ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'btn-ghost py-1.5'
            }`}
          >{s.replace('_',' ')}</button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-surface-500">
            <UserCheck className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No visitors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700/50">
                  {['Visitor','Phone','Purpose','Expected In','Status','Code'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-surface-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-surface-200">{v.visitorName}</p>
                      <p className="text-xs text-surface-500">{v.vehicleNumber || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-surface-400">{v.visitorPhone}</td>
                    <td className="px-5 py-4 text-surface-400">{v.purpose}</td>
                    <td className="px-5 py-4 text-surface-400">
                      {v.expectedArrivalTime ? new Date(v.expectedArrivalTime).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : '—'}
                    </td>
                    <td className="px-5 py-4"><Badge variant={statusVariant(v.status)}>{v.status?.replace('_',' ')}</Badge></td>
                    <td className="px-5 py-4">
                      {v.uniqueCode ? (
                        <span className="flex items-center gap-1 text-xs font-mono text-primary-400">
                          <QrCode className="w-3.5 h-3.5" /> {v.uniqueCode}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Visitor">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Visitor Name *</label>
            <input className="form-input" {...register('visitorName', { required: true })} />
            {errors.visitorName && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div>
            <label className="form-label">Phone Number *</label>
            <input className="form-input" {...register('visitorPhone', { required: true })} />
          </div>

          <div>
            <label className="form-label">Purpose of Visit *</label>
            <input className="form-input" {...register('purpose', { required: true })} placeholder="e.g. Delivery, Meeting, Repair…" />
          </div>

          <div>
            <label className="form-label">Expected Arrival</label>
            <input type="datetime-local" className="form-input" {...register('expectedArrivalTime')} />
          </div>

          <div>
            <label className="form-label">Vehicle Number (optional)</label>
            <input className="form-input" {...register('vehicleNumber')} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Registering…' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

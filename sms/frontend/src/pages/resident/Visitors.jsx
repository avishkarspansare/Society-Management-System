import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { visitorService } from '../../services/visitorService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { UserCheck, RefreshCw, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function VisitorForm({ onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Visitor Name *</label>
          <input {...register('visitorName', { required: 'Required' })} className="form-input" placeholder="Full name" />
          {errors.visitorName && <p className="text-xs text-red-400 mt-1">{errors.visitorName.message}</p>}
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input {...register('visitorPhone')} className="form-input" placeholder="10-digit number" />
        </div>
      </div>
      <div>
        <label className="form-label">Purpose of Visit *</label>
        <input {...register('purpose', { required: 'Required' })} className="form-input" placeholder="Guest / Delivery / Service etc." />
        {errors.purpose && <p className="text-xs text-red-400 mt-1">{errors.purpose.message}</p>}
      </div>
      <div>
        <label className="form-label">Vehicle Number</label>
        <input {...register('vehicleNumber')} className="form-input" placeholder="MH 12 AB 1234" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Registering…' : 'Register Visitor'}
        </button>
      </div>
    </form>
  )
}

export default function ResidentVisitors() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [showModal, setShowModal] = useState(false)

  const societyId = user?.societyId

  const fetchVisitors = useCallback(() => {
    if (!societyId || !user?.unitId) return setLoading(false)
    setLoading(true)
    visitorService.getByUnit(user.unitId, { page: 0, size: 50 })
      .then(r => setVisitors(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load visitors'))
      .finally(() => setLoading(false))
  }, [societyId, user?.unitId])

  useEffect(() => { fetchVisitors() }, [fetchVisitors])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await visitorService.register(societyId, {
        ...data,
        unitId: user?.unitId,
        residentId: user?.id,
      })
      toast.success('Visitor registered!')
      setShowModal(false)
      fetchVisitors()
    } catch (e) { toast.error(e.message || 'Failed to register visitor') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">My Visitors</h1>
          <p className="page-subtitle">Manage expected and past visitors to your unit</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchVisitors} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Register Visitor
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Visitor', 'Phone', 'Purpose', 'Vehicle', 'Check In', 'Check Out', 'Status'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center"><PageLoader /></td></tr>
            ) : visitors.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-surface-500">No visitor records</td></tr>
            ) : visitors.map(v => (
              <tr key={v.id} className="table-row">
                <td className="table-td font-medium text-surface-100">{v.visitorName}</td>
                <td className="table-td text-surface-400 text-xs">{v.visitorPhone || '—'}</td>
                <td className="table-td text-surface-400">{v.purpose}</td>
                <td className="table-td text-surface-500 text-xs">{v.vehicleNumber || '—'}</td>
                <td className="table-td text-surface-400 text-xs">{formatDateTime(v.checkInTime)}</td>
                <td className="table-td text-surface-400 text-xs">{formatDateTime(v.checkOutTime)}</td>
                <td className="table-td">
                  <Badge variant={statusVariant(v.status)}>{v.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Visitor" size="md">
        <VisitorForm onSubmit={handleCreate} onClose={() => setShowModal(false)} loading={saving} />
      </Modal>
    </div>
  )
}

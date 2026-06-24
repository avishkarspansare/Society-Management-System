import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { visitorService } from '../../services/visitorService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { UserCheck, RefreshCw, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function AdminVisitors() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const fetch = () => {
    setLoading(true)
    visitorService.getToday(user?.societyId)
      .then(r => setVisitors(r.data?.data ?? []))
      .catch(() => toast.error('Failed to load visitors'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleCheckIn = async (id) => {
    try { await visitorService.checkIn(id); toast.success('Checked in!'); fetch() }
    catch { toast.error('Check-in failed') }
  }

  const handleCheckOut = async (id) => {
    try { await visitorService.checkOut(id); toast.success('Checked out!'); fetch() }
    catch { toast.error('Check-out failed') }
  }

  const handleRegister = async (data) => {
    try {
      await visitorService.register(user?.societyId, data)
      toast.success('Visitor registered!')
      reset(); setShowModal(false); fetch()
    } catch { toast.error('Registration failed') }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Visitors</h1>
          <p className="page-subtitle">Today's visitor log and gate management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetch} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <UserPlus className="w-4 h-4" /> Register Visitor
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Visitor', 'Purpose', 'Unit', 'Check-In', 'Check-Out', 'Status', 'Actions'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center"><PageLoader /></td></tr>
            ) : visitors.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-surface-500">No visitors today</td></tr>
            ) : visitors.map(v => (
              <tr key={v.id} className="table-row">
                <td className="table-td">
                  <p className="font-medium text-surface-200">{v.visitorName}</p>
                  <p className="text-xs text-surface-500">{v.visitorPhone}</p>
                </td>
                <td className="table-td text-surface-400">{v.purpose}</td>
                <td className="table-td">{v.unitNumber ?? v.unitId}</td>
                <td className="table-td text-xs text-surface-500">
                  {v.checkInTime ? new Date(v.checkInTime).toLocaleTimeString() : '—'}
                </td>
                <td className="table-td text-xs text-surface-500">
                  {v.checkOutTime ? new Date(v.checkOutTime).toLocaleTimeString() : '—'}
                </td>
                <td className="table-td">
                  <Badge variant={statusVariant(v.status)}>{v.status}</Badge>
                </td>
                <td className="table-td">
                  {v.status === 'EXPECTED' && (
                    <button onClick={() => handleCheckIn(v.id)} className="btn-ghost text-xs py-1 px-2 text-emerald-400">
                      Check In
                    </button>
                  )}
                  {v.status === 'CHECKED_IN' && (
                    <button onClick={() => handleCheckOut(v.id)} className="btn-ghost text-xs py-1 px-2 text-amber-400">
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register visitor modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Visitor"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button form="visitor-form" type="submit" className="btn-primary">Register</button>
          </>
        }
      >
        <form id="visitor-form" onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Visitor Name *</label>
              <input {...register('visitorName', { required: true })} className="form-input" placeholder="Full name" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input {...register('visitorPhone')} className="form-input" placeholder="+91..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Unit ID *</label>
              <input {...register('unitId', { required: true, valueAsNumber: true })} type="number" className="form-input" placeholder="Unit ID" />
            </div>
            <div>
              <label className="form-label">Purpose *</label>
              <input {...register('purpose', { required: true })} className="form-input" placeholder="e.g. Delivery, Guest" />
            </div>
          </div>
          <div>
            <label className="form-label">Vehicle Number</label>
            <input {...register('vehicleNumber')} className="form-input" placeholder="MH01AB1234" />
          </div>
        </form>
      </Modal>
    </div>
  )
}

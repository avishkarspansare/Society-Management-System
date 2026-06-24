import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { paymentService } from '../../services/paymentService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CreditCard, Receipt, Plus, Filter } from 'lucide-react'

const PAYMENT_MODES = ['ONLINE','CASH','CHEQUE','UPI','BANK_TRANSFER']
const PAYMENT_TYPES = ['MAINTENANCE','PARKING','CLUBHOUSE','EVENT','PENALTY','DEPOSIT']

export default function ResidentPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [saving,    setSaving]   = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchPayments = () => {
    paymentService.getMine({ page: 0, size: 100 })
      .then(r => setPayments(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await paymentService.create({
        ...data,
        societyId: user?.societyId,
        userId:    user?.id,
        amount:    Number(data.amount),
      })
      toast.success('Payment recorded')
      fetchPayments(); setShowModal(false); reset()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const filtered = filter === 'ALL' ? payments : payments.filter(p => p.paymentStatus === filter)

  const summary = {
    total:   payments.reduce((s, p) => s + Number(p.totalAmount || p.amount || 0), 0),
    pending: payments.filter(p => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE').reduce((s,p) => s + Number(p.totalAmount || p.amount || 0), 0),
    paid:    payments.filter(p => p.paymentStatus === 'PAID').reduce((s,p) => s + Number(p.totalAmount || p.amount || 0), 0),
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">My Payments</h1>
          <p className="page-subtitle">Track and manage your maintenance dues</p>
        </div>
        <button onClick={() => { reset(); setShowModal(true) }} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Pay Now
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Dues',    value: summary.total,   color: 'text-surface-200' },
          { label: 'Amount Pending', value: summary.pending, color: 'text-amber-400' },
          { label: 'Total Paid',    value: summary.paid,    color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-5">
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold font-display ${color}`}>₹{value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-surface-500" />
        {['ALL','PENDING','PAID','OVERDUE','PARTIAL'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === s ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' : 'btn-ghost py-1.5'
            }`}
          >{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-surface-500">
            <CreditCard className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700/50">
                  {['Type','Amount','Due Date','Paid Date','Mode','Status','Receipt'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-surface-700/20 transition-colors">
                    <td className="px-5 py-4 font-medium text-surface-200">{p.paymentType}</td>
                    <td className="px-5 py-4 font-semibold text-surface-100">₹{Number(p.totalAmount || p.amount).toLocaleString()}</td>
                    <td className="px-5 py-4 text-surface-400">{p.dueDate}</td>
                    <td className="px-5 py-4 text-surface-400">{p.paidDate || '—'}</td>
                    <td className="px-5 py-4 text-surface-400">{p.paymentMode || '—'}</td>
                    <td className="px-5 py-4"><Badge variant={statusVariant(p.paymentStatus)}>{p.paymentStatus}</Badge></td>
                    <td className="px-5 py-4">
                      {p.receiptNumber ? (
                        <span className="flex items-center gap-1 text-xs text-primary-400">
                          <Receipt className="w-3.5 h-3.5" /> {p.receiptNumber}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Make a Payment">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Payment Type *</label>
            <select className="form-input" {...register('paymentType', { required: true })}>
              <option value="">Select</option>
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.paymentType && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div>
            <label className="form-label">Amount (₹) *</label>
            <input type="number" step="0.01" className="form-input" {...register('amount', { required: true, min: 1 })} />
            {errors.amount && <p className="text-xs text-red-400 mt-1">Enter valid amount</p>}
          </div>

          <div>
            <label className="form-label">Payment Mode *</label>
            <select className="form-input" {...register('paymentMode', { required: true })}>
              <option value="">Select</option>
              {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Due Date *</label>
            <input type="date" className="form-input" {...register('dueDate', { required: true })} />
          </div>

          <div>
            <label className="form-label">Transaction ID</label>
            <input className="form-input" {...register('transactionId')} placeholder="Optional" />
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea rows={2} className="form-input resize-none" {...register('notes')} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Processing…' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

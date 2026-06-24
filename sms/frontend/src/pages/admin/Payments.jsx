import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { paymentService } from '../../services/paymentService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { CreditCard, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(0)

  const fetchPayments = () => {
    setLoading(true)
    paymentService.bySociety(user?.societyId, { page, size: 20 })
      .then(r => setPayments((r.data?.data?.content ?? r.data?.data ?? []) ))
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [page])

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Track and manage all society payments</p>
        </div>
        <button onClick={fetchPayments} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Resident', 'Type', 'Amount', 'Due Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center"><PageLoader /></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-surface-500">No payments found</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} className="table-row">
                <td className="table-td font-medium text-surface-200">{p.userName ?? p.userId}</td>
                <td className="table-td">{p.paymentType}</td>
                <td className="table-td font-semibold text-surface-100">{formatCurrency(p.amount)}</td>
                <td className="table-td">{formatDate(p.dueDate)}</td>
                <td className="table-td">
                  <Badge variant={statusVariant(p.paymentStatus)}>{p.paymentStatus}</Badge>
                </td>
                <td className="table-td">
                  {p.paymentStatus === 'PENDING' && (
                    <button
                      className="btn-ghost text-xs py-1 px-2"
                      onClick={() => paymentService.sendReminder(p.id).then(() => toast.success('Reminder sent!'))}
                    >
                      Remind
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

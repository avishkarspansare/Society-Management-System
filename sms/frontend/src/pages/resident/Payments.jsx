import { useEffect, useState } from 'react'
import { paymentService } from '../../services/paymentService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { CreditCard, RefreshCw, FileText, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ResidentPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = () => {
    setLoading(true)
    paymentService.getMine({ page, size: 15 })
      .then(r => {
        const d = r.data?.data
        if (d?.content) { setPayments(d.content); setTotalPages(d.totalPages ?? 1) }
        else { setPayments(Array.isArray(d) ? d : []) }
      })
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [page])

  const pending = payments.filter(p => p.paymentStatus === 'PENDING' || p.paymentStatus === 'OVERDUE')
  const total   = pending.reduce((s, p) => s + Number(p.totalAmount ?? p.amount ?? 0), 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">My Payments</h1>
          <p className="page-subtitle">Track your maintenance and other charges</p>
        </div>
        <button onClick={fetchPayments} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-surface-500 uppercase tracking-wider">Total Due</p>
          <p className="text-xl font-display font-bold text-amber-400 mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-surface-500 uppercase tracking-wider">Pending</p>
          <p className="text-xl font-display font-bold text-red-400 mt-1">{pending.length}</p>
        </div>
        <div className="glass-card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-surface-500 uppercase tracking-wider">Paid This Year</p>
          <p className="text-xl font-display font-bold text-emerald-400 mt-1">
            {formatCurrency(payments.filter(p => p.paymentStatus === 'PAID').reduce((s, p) => s + Number(p.amount ?? 0), 0))}
          </p>
        </div>
      </div>

      {/* Payment table */}
      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Type', 'Amount', 'Late Fee', 'Due Date', 'Paid Date', 'Mode', 'Status'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center"><PageLoader /></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-surface-500">No payment records</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} className="table-row">
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    <span className="font-medium text-surface-200">{p.paymentType?.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="table-td font-semibold text-surface-100">{formatCurrency(p.amount)}</td>
                <td className="table-td text-red-400 text-xs">{p.lateFee > 0 ? formatCurrency(p.lateFee) : '—'}</td>
                <td className="table-td">{formatDate(p.dueDate)}</td>
                <td className="table-td text-surface-400">{formatDate(p.paidDate)}</td>
                <td className="table-td text-surface-400 text-xs">{p.paymentMode || '—'}</td>
                <td className="table-td">
                  <Badge variant={statusVariant(p.paymentStatus)}>{p.paymentStatus}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40">Prev</button>
          <span className="flex items-center text-sm text-surface-400 px-2">{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}

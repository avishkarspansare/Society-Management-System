import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { complaintService } from '../../services/complaintService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import { MessageSquare, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetch = () => {
    setLoading(true)
    complaintService.bySociety(user?.societyId, { page: 0, size: 50 })
      .then(r => setComplaints(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const updateStatus = async (id, status) => {
    try {
      await complaintService.updateStatus(id, status)
      toast.success('Status updated')
      fetch()
    } catch { toast.error('Failed to update status') }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Complaints</h1>
          <p className="page-subtitle">Manage and resolve resident complaints</p>
        </div>
        <button onClick={fetch} className="btn-secondary"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['#', 'Title', 'Category', 'Priority', 'Status', 'Submitted', 'Actions'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center"><PageLoader /></td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-surface-500">No complaints found</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id} className="table-row">
                <td className="table-td text-surface-500">#{c.id}</td>
                <td className="table-td font-medium text-surface-200 max-w-[200px] truncate">{c.title}</td>
                <td className="table-td">{c.category}</td>
                <td className="table-td">
                  <Badge variant={c.priority === 'CRITICAL' ? 'danger' : c.priority === 'HIGH' ? 'warning' : 'default'}>
                    {c.priority}
                  </Badge>
                </td>
                <td className="table-td">
                  <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                </td>
                <td className="table-td text-surface-500 text-xs">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="table-td">
                  {c.status === 'OPEN' && (
                    <button
                      onClick={() => updateStatus(c.id, 'IN_PROGRESS')}
                      className="btn-ghost text-xs py-1 px-2 text-amber-400"
                    >
                      Start
                    </button>
                  )}
                  {c.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateStatus(c.id, 'RESOLVED')}
                      className="btn-ghost text-xs py-1 px-2 text-emerald-400"
                    >
                      Resolve
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

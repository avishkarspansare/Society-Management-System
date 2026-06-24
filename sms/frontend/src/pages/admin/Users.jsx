import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Users, RefreshCw, UserPlus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const TYPE_VARIANTS = {
  SUPER_ADMIN: 'danger', SOCIETY_ADMIN: 'warning',
  COMMITTEE_MEMBER: 'info', RESIDENT: 'primary',
  SECURITY: 'success', STAFF: 'default',
}

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchUsers = useCallback(() => {
    if (!user?.societyId) return
    setLoading(true)
    userService.getBySociety(user.societyId, { page: 0, size: 100 })
      .then(r => setUsers(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load residents'))
      .finally(() => setLoading(false))
  }, [user?.societyId])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleStatus = async (u) => {
    try {
      await userService.updateStatus(u.id, !u.isActive)
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`)
      fetchUsers()
    } catch { toast.error('Failed to update status') }
  }

  const deleteUser = async () => {
    if (!deleteTarget) return
    try {
      await userService.delete(deleteTarget.id)
      toast.success('User removed')
      setDeleteTarget(null)
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Residents</h1>
          <p className="page-subtitle">Manage society members and residents</p>
        </div>
        <button onClick={fetchUsers} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          className="form-input pl-9"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Name', 'Email', 'Phone', 'Role', 'Unit', 'Status', 'Actions'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center"><PageLoader /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-surface-500">No residents found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="table-row">
                <td className="table-td">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <span className="font-medium text-surface-100">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="table-td text-surface-400 text-xs">{u.email}</td>
                <td className="table-td text-surface-400">{u.phone}</td>
                <td className="table-td">
                  <Badge variant={TYPE_VARIANTS[u.userType] || 'default'}>
                    {u.userType?.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="table-td text-surface-400">{u.unitNumber || '—'}</td>
                <td className="table-td">
                  <Badge variant={u.isActive ? 'success' : 'default'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="table-td">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`btn-ghost text-xs py-1 px-2 ${u.isActive ? 'text-amber-400' : 'text-emerald-400'}`}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {u.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="btn-ghost text-xs py-1 px-2 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Resident"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={deleteUser} className="btn-danger">Remove</button>
          </>
        }
      >
        <p className="text-surface-300 text-sm">
          Are you sure you want to remove <span className="font-semibold text-surface-100">
            {deleteTarget?.firstName} {deleteTarget?.lastName}
          </span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

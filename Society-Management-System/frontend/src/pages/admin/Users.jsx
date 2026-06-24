import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userService } from '../../services/userService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Users, Plus, Search, Pencil, Trash2, UserCheck, ShieldCheck,
} from 'lucide-react'

const ROLES = ['SUPER_ADMIN','SOCIETY_ADMIN','COMMITTEE_MEMBER','RESIDENT','SECURITY','STAFF']

const roleVariant = (role) => {
  const m = { SUPER_ADMIN:'danger', SOCIETY_ADMIN:'warning', COMMITTEE_MEMBER:'info',
               RESIDENT:'success', SECURITY:'primary', STAFF:'primary' }
  return m[role] || 'primary'
}

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchUsers = () => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    userService.getAll(sid)
      .then(r => setUsers(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [user])

  const openCreate = () => { setEditing(null); reset({}); setShowModal(true) }
  const openEdit   = (u)  => { setEditing(u);  reset(u);  setShowModal(true) }
  const closeModal = ()   => setShowModal(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) {
        await userService.update(editing.id, { ...data, societyId: user?.societyId })
        toast.success('User updated')
      } else {
        await userService.create({ ...data, societyId: user?.societyId })
        toast.success('User created')
      }
      fetchUsers()
      closeModal()
    } catch (e) {
      toast.error(e.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await userService.delete(id)
      toast.success('User removed')
      setUsers(u => u.filter(x => x.id !== id))
    } catch (e) {
      toast.error(e.message || 'Failed to delete')
    }
  }

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Residents & Staff</h1>
          <p className="page-subtitle">Manage all society members and staff</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-surface-400 shrink-0" />
        <input
          className="bg-transparent flex-1 text-sm text-surface-200 placeholder-surface-500 outline-none"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-surface-500">
            <Users className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700/50">
                  {['Name','Email','Phone','Type','Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-surface-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <span className="font-medium text-surface-200">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-surface-400">{u.email}</td>
                    <td className="px-5 py-4 text-surface-400">{u.phone}</td>
                    <td className="px-5 py-4"><Badge variant={roleVariant(u.userType)}>{u.userType}</Badge></td>
                    <td className="px-5 py-4">
                      <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="btn-ghost p-1.5">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name *</label>
              <input className="form-input" {...register('firstName', { required: true })} />
              {errors.firstName && <p className="text-xs text-red-400 mt-1">Required</p>}
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input className="form-input" {...register('lastName', { required: true })} />
              {errors.lastName && <p className="text-xs text-red-400 mt-1">Required</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input type="email" className="form-input" {...register('email', { required: true })} />
            {errors.email && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div>
            <label className="form-label">Phone *</label>
            <input className="form-input" {...register('phone', { required: true })} />
          </div>

          <div>
            <label className="form-label">Role *</label>
            <select className="form-input" {...register('userType', { required: true })}>
              <option value="">Select role</option>
              {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
            </select>
          </div>

          {!editing && (
            <div>
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" {...register('password', { required: !editing })} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : (editing ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

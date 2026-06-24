import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { unitService } from '../../services/unitService'
import Badge, { statusVariant } from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Building, RefreshCw, Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const UNIT_TYPES = ['FLAT', 'VILLA', 'ROW_HOUSE', 'SHOP', 'OFFICE']
const UNIT_STATUSES = ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE']

function UnitForm({ defaultValues, onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Unit Number *</label>
          <input {...register('unitNumber', { required: 'Required' })} className="form-input" placeholder="A-101" />
          {errors.unitNumber && <p className="text-xs text-red-400 mt-1">{errors.unitNumber.message}</p>}
        </div>
        <div>
          <label className="form-label">Floor</label>
          <input {...register('floorNumber')} type="number" className="form-input" placeholder="1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Type</label>
          <select {...register('unitType')} className="form-input">
            {UNIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Area (sq ft)</label>
          <input {...register('areaSqft')} type="number" step="0.01" className="form-input" placeholder="850" />
        </div>
      </div>
      <div>
        <label className="form-label">Status</label>
        <select {...register('status')} className="form-input">
          {UNIT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : defaultValues?.id ? 'Update Unit' : 'Add Unit'}
        </button>
      </div>
    </form>
  )
}

export default function AdminUnits() {
  const { user } = useAuth()
  const [units, setUnits]     = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null) // null | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const societyId = user?.societyId

  const fetchUnits = useCallback(() => {
    if (!societyId) return
    setLoading(true)
    unitService.getBySociety(societyId, { page: 0, size: 200 })
      .then(r => setUnits(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load units'))
      .finally(() => setLoading(false))
  }, [societyId])

  useEffect(() => { fetchUnits() }, [fetchUnits])

  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await unitService.create({ ...data, societyId })
      toast.success('Unit added!')
      setModal(null)
      fetchUnits()
    } catch (e) { toast.error(e.message || 'Failed to add unit') }
    finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await unitService.update(editTarget.id, data)
      toast.success('Unit updated!')
      setModal(null); setEditTarget(null)
      fetchUnits()
    } catch (e) { toast.error(e.message || 'Failed to update unit') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await unitService.delete(deleteTarget.id)
      toast.success('Unit deleted')
      setDeleteTarget(null)
      fetchUnits()
    } catch { toast.error('Failed to delete unit') }
  }

  const filtered = units.filter(u =>
    `${u.unitNumber} ${u.unitType} ${u.ownerName || ''} ${u.tenantName || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Units / Flats</h1>
          <p className="page-subtitle">Manage all residential and commercial units</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchUnits} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal('add')} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Unit
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: units.length, color: 'text-surface-100' },
          { label: 'Occupied', value: units.filter(u => u.isOccupied).length, color: 'text-emerald-400' },
          { label: 'Vacant', value: units.filter(u => !u.isOccupied && u.status === 'ACTIVE').length, color: 'text-amber-400' },
          { label: 'Maintenance', value: units.filter(u => u.status === 'UNDER_MAINTENANCE').length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input className="form-input pl-9" placeholder="Search units…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrapper">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              {['Unit #', 'Floor', 'Type', 'Area', 'Owner', 'Occupancy', 'Status', 'Actions'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center"><PageLoader /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-surface-500">No units found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="table-row">
                <td className="table-td font-semibold text-surface-100">{u.unitNumber}</td>
                <td className="table-td text-surface-400">{u.floorNumber ?? '—'}</td>
                <td className="table-td">
                  <Badge variant="info">{u.unitType}</Badge>
                </td>
                <td className="table-td text-surface-400">{u.areaSqft ? `${u.areaSqft} ft²` : '—'}</td>
                <td className="table-td text-surface-300">{u.ownerName || '—'}</td>
                <td className="table-td">
                  <Badge variant={u.isOccupied ? 'success' : 'warning'}>
                    {u.isOccupied ? 'Occupied' : 'Vacant'}
                  </Badge>
                </td>
                <td className="table-td">
                  <Badge variant={statusVariant(u.status)}>{u.status?.replace('_', ' ')}</Badge>
                </td>
                <td className="table-td">
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditTarget(u); setModal('edit') }}
                      className="btn-ghost text-xs py-1 px-2 text-primary-400"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="btn-ghost text-xs py-1 px-2 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Unit" size="md">
        <UnitForm onSubmit={handleAdd} onClose={() => setModal(null)} loading={saving} defaultValues={{ unitType: 'FLAT', status: 'ACTIVE' }} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setEditTarget(null) }} title="Edit Unit" size="md">
        <UnitForm onSubmit={handleEdit} onClose={() => { setModal(null); setEditTarget(null) }} loading={saving} defaultValues={editTarget} />
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Unit" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <p className="text-surface-300 text-sm">Delete unit <span className="font-semibold text-surface-100">{deleteTarget?.unitNumber}</span>? This cannot be undone.</p>
      </Modal>
    </div>
  )
}

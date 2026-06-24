import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { unitService } from '../../services/unitService'
import { buildingService } from '../../services/buildingService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Building, Plus, Search, Pencil, Trash2 } from 'lucide-react'

const unitTypeOptions = ['FLAT','VILLA','ROW_HOUSE','SHOP','OFFICE']
const statusOptions   = ['ACTIVE','INACTIVE','UNDER_MAINTENANCE']

const statusVariant = (s) =>
  ({ ACTIVE:'success', INACTIVE:'danger', UNDER_MAINTENANCE:'warning' }[s] || 'primary')

export default function AdminUnits() {
  const { user } = useAuth()
  const [units,     setUnits]     = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [saving,    setSaving]    = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchData = () => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    Promise.all([
      unitService.getAll(sid, { page: 0, size: 200 }),
      buildingService.getAll(sid),
    ]).then(([uR, bR]) => {
      setUnits(uR.data?.data?.content ?? uR.data?.data ?? [])
      setBuildings(bR.data?.data ?? [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [user])

  const openCreate = () => { setEditing(null); reset({}); setShowModal(true) }
  const openEdit   = (u) => { setEditing(u); reset(u); setShowModal(true) }
  const closeModal = ()  => setShowModal(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, societyId: user?.societyId, floorNumber: Number(data.floorNumber) }
      if (editing) {
        await unitService.update(editing.id, payload)
        toast.success('Unit updated')
      } else {
        await unitService.create(payload)
        toast.success('Unit created')
      }
      fetchData(); closeModal()
    } catch (e) {
      toast.error(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this unit?')) return
    try {
      await unitService.delete(id); toast.success('Unit deleted')
      setUnits(u => u.filter(x => x.id !== id))
    } catch (e) { toast.error(e.message || 'Failed') }
  }

  const buildingName = (bId) => buildings.find(b => b.id === bId)?.name ?? '—'
  const filtered = units.filter(u =>
    `${u.unitNumber} ${u.unitType} ${u.status}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Units</h1>
          <p className="page-subtitle">Manage flats, villas and other units in your society</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-surface-400 shrink-0" />
        <input
          className="bg-transparent flex-1 text-sm text-surface-200 placeholder-surface-500 outline-none"
          placeholder="Search by unit number or type…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-surface-500">
            <Building className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No units found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700/50">
                  {['Unit No.','Building','Floor','Type','Area (sqft)','Status','Occupied','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/30">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-surface-700/20 transition-colors">
                    <td className="px-5 py-4 font-medium text-surface-200">{u.unitNumber}</td>
                    <td className="px-5 py-4 text-surface-400">{buildingName(u.buildingId)}</td>
                    <td className="px-5 py-4 text-surface-400">{u.floorNumber ?? '—'}</td>
                    <td className="px-5 py-4"><Badge variant="info">{u.unitType}</Badge></td>
                    <td className="px-5 py-4 text-surface-400">{u.areaSqft ?? '—'}</td>
                    <td className="px-5 py-4"><Badge variant={statusVariant(u.status)}>{u.status}</Badge></td>
                    <td className="px-5 py-4"><Badge variant={u.isOccupied ? 'success' : 'warning'}>{u.isOccupied ? 'Yes' : 'No'}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(u.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Unit' : 'Add Unit'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Unit Number *</label>
              <input className="form-input" {...register('unitNumber', { required: true })} />
              {errors.unitNumber && <p className="text-xs text-red-400 mt-1">Required</p>}
            </div>
            <div>
              <label className="form-label">Floor</label>
              <input type="number" className="form-input" {...register('floorNumber')} />
            </div>
          </div>

          <div>
            <label className="form-label">Building</label>
            <select className="form-input" {...register('buildingId')}>
              <option value="">Select building</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Type *</label>
              <select className="form-input" {...register('unitType', { required: true })}>
                <option value="">Select</option>
                {unitTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Area (sqft)</label>
              <input type="number" step="0.01" className="form-input" {...register('areaSqft')} />
            </div>
          </div>

          {editing && (
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register('status')}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : (editing ? 'Update Unit' : 'Create Unit')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

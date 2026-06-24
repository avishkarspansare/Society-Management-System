import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { amenityService } from '../../services/amenityService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Dumbbell, Plus, Pencil, Trash2, Clock, DollarSign } from 'lucide-react'

const AMENITY_TYPES = ['SWIMMING_POOL','GYM','CLUBHOUSE','TENNIS_COURT','BADMINTON_COURT','YOGA_ROOM','LIBRARY','GARDEN','PARKING']

export default function AdminAmenities() {
  const { user } = useAuth()
  const [amenities, setAmenities] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [saving,    setSaving]    = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchAmenities = () => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    amenityService.getAll(sid)
      .then(r => setAmenities(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAmenities() }, [user])

  const openCreate = () => { setEditing(null); reset({}); setShowModal(true) }
  const openEdit   = (a) => { setEditing(a); reset(a); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        societyId: user?.societyId,
        capacity:  Number(data.capacity),
        feePerHour: data.feePerHour ? Number(data.feePerHour) : null,
        maxBookingHours: Number(data.maxBookingHours) || 2,
        isActive: true,
      }
      if (editing) {
        await amenityService.update(editing.id, payload); toast.success('Amenity updated')
      } else {
        await amenityService.create(payload); toast.success('Amenity added')
      }
      fetchAmenities(); closeModal()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this amenity?')) return
    try { await amenityService.delete(id); toast.success('Deleted'); setAmenities(a => a.filter(x => x.id !== id))
    } catch (e) { toast.error(e.message || 'Failed') }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Amenities</h1>
          <p className="page-subtitle">Manage bookable facilities in your society</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Amenity
        </button>
      </div>

      {amenities.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-surface-500">
          <Dumbbell className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No amenities added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {amenities.map(am => (
            <div key={am.id} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-surface-100">{am.name}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{am.amenityType?.replace(/_/g,' ')}</p>
                </div>
                <Badge variant={am.isActive ? 'success' : 'danger'}>
                  {am.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {am.description && <p className="text-sm text-surface-400 line-clamp-2">{am.description}</p>}

              <div className="flex items-center gap-4 text-xs text-surface-500">
                {am.capacity && (
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5" /> Cap: {am.capacity}
                  </span>
                )}
                {am.maxBookingHours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Max {am.maxBookingHours}h
                  </span>
                )}
                {am.feePerHour != null && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> ₹{am.feePerHour}/hr
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-surface-700/40">
                <button onClick={() => openEdit(am)} className="btn-ghost text-xs py-1 px-3 flex-1 justify-center">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(am.id)} className="btn-ghost text-xs py-1 px-3 flex-1 justify-center text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Amenity' : 'Add Amenity'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Name *</label>
            <input className="form-input" {...register('name', { required: true })} />
            {errors.name && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div>
            <label className="form-label">Type *</label>
            <select className="form-input" {...register('amenityType', { required: true })}>
              <option value="">Select type</option>
              {AMENITY_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea rows={2} className="form-input resize-none" {...register('description')} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Capacity</label>
              <input type="number" className="form-input" {...register('capacity')} />
            </div>
            <div>
              <label className="form-label">Max Hours</label>
              <input type="number" className="form-input" {...register('maxBookingHours')} defaultValue={2} />
            </div>
            <div>
              <label className="form-label">Fee/Hour (₹)</label>
              <input type="number" step="0.01" className="form-input" {...register('feePerHour')} placeholder="0 = free" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Opening Time</label>
              <input type="time" className="form-input" {...register('openingTime')} />
            </div>
            <div>
              <label className="form-label">Closing Time</label>
              <input type="time" className="form-input" {...register('closingTime')} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : (editing ? 'Update' : 'Add Amenity')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

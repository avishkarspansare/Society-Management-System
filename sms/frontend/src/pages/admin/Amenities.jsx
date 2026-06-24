import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { amenityService } from '../../services/amenityService'
import Badge from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Dumbbell, RefreshCw, Plus, Pencil, Trash2, Clock, DollarSign, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function AmenityForm({ defaultValues, onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Name *</label>
          <input {...register('name', { required: 'Required' })} className="form-input" placeholder="Swimming Pool" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="form-label">Capacity</label>
          <input {...register('capacity')} type="number" className="form-input" placeholder="20" />
        </div>
      </div>
      <div>
        <label className="form-label">Description</label>
        <textarea {...register('description')} rows={2} className="form-input resize-none" placeholder="Amenity description…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Opening Time</label>
          <input {...register('openingTime')} type="time" className="form-input" />
        </div>
        <div>
          <label className="form-label">Closing Time</label>
          <input {...register('closingTime')} type="time" className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Booking Fee (₹)</label>
          <input {...register('bookingFee')} type="number" step="0.01" className="form-input" placeholder="0" />
        </div>
        <div>
          <label className="form-label">Max Booking Hours</label>
          <input {...register('maxBookingHours')} type="number" className="form-input" placeholder="2" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('requiresBooking')} type="checkbox" id="req-book" className="w-4 h-4 accent-primary-500" />
        <label htmlFor="req-book" className="text-sm text-surface-300">Requires advance booking</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : defaultValues?.id ? 'Update' : 'Add Amenity'}
        </button>
      </div>
    </form>
  )
}

export default function AdminAmenities() {
  const { user } = useAuth()
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [modal, setModal]         = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const societyId = user?.societyId

  const fetchAmenities = useCallback(() => {
    if (!societyId) return
    setLoading(true)
    amenityService.getAll(societyId, { page: 0, size: 50 })
      .then(r => setAmenities(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load amenities'))
      .finally(() => setLoading(false))
  }, [societyId])

  useEffect(() => { fetchAmenities() }, [fetchAmenities])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await amenityService.create({ ...data, societyId })
      toast.success('Amenity added!')
      setModal(null); fetchAmenities()
    } catch (e) { toast.error(e.message || 'Failed to add amenity') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (data) => {
    setSaving(true)
    try {
      await amenityService.update(editTarget.id, data)
      toast.success('Amenity updated!')
      setModal(null); setEditTarget(null); fetchAmenities()
    } catch (e) { toast.error(e.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await amenityService.delete(deleteTarget.id)
      toast.success('Amenity deleted')
      setDeleteTarget(null); fetchAmenities()
    } catch { toast.error('Failed to delete amenity') }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Amenities</h1>
          <p className="page-subtitle">Manage society facilities and bookings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAmenities} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal('add')} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Amenity
          </button>
        </div>
      </div>

      {loading ? <PageLoader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {amenities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-surface-500">No amenities configured</div>
          ) : amenities.map(a => (
            <div key={a.id} className="glass-card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-surface-100">{a.name}</p>
                  {a.description && (
                    <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{a.description}</p>
                  )}
                </div>
                <Badge variant={a.isActive !== false ? 'success' : 'default'}>
                  {a.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-surface-400">
                {a.openingTime && a.closingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    {a.openingTime} – {a.closingTime}
                  </div>
                )}
                {a.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Cap: {a.capacity}
                  </div>
                )}
                {a.bookingFee != null && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                    ₹{a.bookingFee} / booking
                  </div>
                )}
                {a.requiresBooking && (
                  <div className="text-amber-400">Booking required</div>
                )}
              </div>
              <div className="flex gap-2 mt-auto pt-2 border-t border-surface-700/40">
                <button onClick={() => { setEditTarget(a); setModal('edit') }} className="btn-ghost text-xs flex-1 justify-center text-primary-400">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteTarget(a)} className="btn-ghost text-xs flex-1 justify-center text-red-400">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Amenity" size="md">
        <AmenityForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} defaultValues={{ requiresBooking: false }} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setEditTarget(null) }} title="Edit Amenity" size="md">
        <AmenityForm onSubmit={handleUpdate} onClose={() => { setModal(null); setEditTarget(null) }} loading={saving} defaultValues={editTarget} />
      </Modal>
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Amenity" size="sm"
        footer={<><button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button><button onClick={handleDelete} className="btn-danger">Delete</button></>}
      >
        <p className="text-surface-300 text-sm">Delete <span className="font-semibold text-surface-100">"{deleteTarget?.name}"</span>?</p>
      </Modal>
    </div>
  )
}

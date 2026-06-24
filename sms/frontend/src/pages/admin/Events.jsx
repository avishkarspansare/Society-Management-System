import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { eventService } from '../../services/eventService'
import Badge from '../../components/common/Badge'
import { PageLoader } from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { Calendar, RefreshCw, Plus, Pencil, Trash2, MapPin, Users, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function EventForm({ defaultValues, onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Event Title *</label>
        <input {...register('title', { required: 'Required' })} className="form-input" placeholder="Annual General Meeting" />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="form-label">Description</label>
        <textarea {...register('description')} rows={3} className="form-input resize-none" placeholder="Event details…" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Start Date & Time *</label>
          <input {...register('startDateTime', { required: 'Required' })} type="datetime-local" className="form-input" />
          {errors.startDateTime && <p className="text-xs text-red-400 mt-1">{errors.startDateTime.message}</p>}
        </div>
        <div>
          <label className="form-label">End Date & Time</label>
          <input {...register('endDateTime')} type="datetime-local" className="form-input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Venue</label>
          <input {...register('venue')} className="form-input" placeholder="Clubhouse / Hall" />
        </div>
        <div>
          <label className="form-label">Max Attendees</label>
          <input {...register('maxAttendees')} type="number" className="form-input" placeholder="100" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('registrationRequired')} type="checkbox" id="reg-req" className="w-4 h-4 accent-primary-500" />
        <label htmlFor="reg-req" className="text-sm text-surface-300">Registration required</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : defaultValues?.id ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

export default function AdminEvents() {
  const { user } = useAuth()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [modal, setModal]     = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const societyId = user?.societyId

  const fetchEvents = useCallback(() => {
    if (!societyId) return
    setLoading(true)
    eventService.getAll(societyId, { page: 0, size: 50 })
      .then(r => setEvents(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }, [societyId])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleCreate = async (data) => {
    setSaving(true)
    try {
      await eventService.create({ ...data, societyId })
      toast.success('Event created!')
      setModal(null); fetchEvents()
    } catch (e) { toast.error(e.message || 'Failed to create event') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (data) => {
    setSaving(true)
    try {
      await eventService.update(editTarget.id, data)
      toast.success('Event updated!')
      setModal(null); setEditTarget(null); fetchEvents()
    } catch (e) { toast.error(e.message || 'Failed to update event') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await eventService.delete(deleteTarget.id)
      toast.success('Event deleted')
      setDeleteTarget(null); fetchEvents()
    } catch { toast.error('Failed to delete event') }
  }

  const isUpcoming = (e) => e.startDateTime && new Date(e.startDateTime) > new Date()

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Plan and manage society events</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchEvents} className="btn-secondary"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal('add')} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {loading ? <PageLoader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full py-12 text-center text-surface-500">No events scheduled</div>
          ) : events.map(ev => {
            const upcoming = isUpcoming(ev)
            return (
              <div key={ev.id} className="glass-card-hover p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-100 truncate">{ev.title}</p>
                    {ev.description && (
                      <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{ev.description}</p>
                    )}
                  </div>
                  <Badge variant={upcoming ? 'success' : 'default'}>
                    {upcoming ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-surface-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    {formatDateTime(ev.startDateTime)}
                    {ev.endDateTime && ` – ${formatDateTime(ev.endDateTime)}`}
                  </div>
                  {ev.venue && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                      {ev.venue}
                    </div>
                  )}
                  {ev.maxAttendees && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {ev.registeredCount ?? 0} / {ev.maxAttendees} attendees
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-auto pt-2 border-t border-surface-700/40">
                  <button
                    onClick={() => { setEditTarget(ev); setModal('edit') }}
                    className="btn-ghost text-xs flex-1 justify-center text-primary-400"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(ev)}
                    className="btn-ghost text-xs flex-1 justify-center text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Create Event" size="lg">
        <EventForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} defaultValues={{}} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setEditTarget(null) }} title="Edit Event" size="lg">
        <EventForm onSubmit={handleUpdate} onClose={() => { setModal(null); setEditTarget(null) }} loading={saving} defaultValues={editTarget} />
      </Modal>
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Event" size="sm"
        footer={<><button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button><button onClick={handleDelete} className="btn-danger">Delete</button></>}
      >
        <p className="text-surface-300 text-sm">Delete event <span className="font-semibold text-surface-100">"{deleteTarget?.title}"</span>?</p>
      </Modal>
    </div>
  )
}

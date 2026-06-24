import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { eventService } from '../../services/eventService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { PageLoader } from '../../components/common/Spinner'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Calendar, Plus, Pencil, Trash2, Users } from 'lucide-react'

export default function AdminEvents() {
  const { user } = useAuth()
  const [events,    setEvents]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [saving,    setSaving]    = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const fetchEvents = () => {
    const sid = user?.societyId
    if (!sid) { setLoading(false); return }
    eventService.getAll(sid)
      .then(r => setEvents(r.data?.data?.content ?? r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEvents() }, [user])

  const openCreate = () => { setEditing(null); reset({}); setShowModal(true) }
  const openEdit   = (e) => {
    setEditing(e)
    reset({ ...e, startTime: e.startTime?.slice(0,16), endTime: e.endTime?.slice(0,16) })
    setShowModal(true)
  }
  const closeModal = () => setShowModal(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, societyId: user?.societyId, maxParticipants: Number(data.maxParticipants) || null }
      if (editing) {
        await eventService.update(editing.id, payload); toast.success('Event updated')
      } else {
        await eventService.create(payload); toast.success('Event created')
      }
      fetchEvents(); closeModal()
    } catch (e) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try { await eventService.delete(id); toast.success('Deleted'); setEvents(e => e.filter(x => x.id !== id))
    } catch (e) { toast.error(e.message || 'Failed') }
  }

  const isFuture = (d) => new Date(d) > new Date()

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Organise and manage community events</p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-surface-500">
          <Calendar className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-surface-100 leading-tight">{ev.title}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{ev.venue}</p>
                </div>
                <Badge variant={isFuture(ev.startTime) ? 'success' : 'primary'}>
                  {isFuture(ev.startTime) ? 'Upcoming' : 'Past'}
                </Badge>
              </div>

              <p className="text-sm text-surface-400 line-clamp-2">{ev.description}</p>

              <div className="flex items-center gap-4 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ev.startTime).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </span>
                {ev.maxParticipants && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Max {ev.maxParticipants}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-surface-700/40">
                <button onClick={() => openEdit(ev)} className="btn-ghost text-xs py-1 px-3 flex-1 justify-center">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(ev.id)} className="btn-ghost text-xs py-1 px-3 flex-1 justify-center text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Event' : 'New Event'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input className="form-input" {...register('title', { required: true })} />
            {errors.title && <p className="text-xs text-red-400 mt-1">Required</p>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea rows={3} className="form-input resize-none" {...register('description')} />
          </div>

          <div>
            <label className="form-label">Venue *</label>
            <input className="form-input" {...register('venue', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Time *</label>
              <input type="datetime-local" className="form-input" {...register('startTime', { required: true })} />
            </div>
            <div>
              <label className="form-label">End Time *</label>
              <input type="datetime-local" className="form-input" {...register('endTime', { required: true })} />
            </div>
          </div>

          <div>
            <label className="form-label">Max Participants</label>
            <input type="number" className="form-input" {...register('maxParticipants')} placeholder="Leave blank for unlimited" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="registrationRequired" className="accent-primary-500" {...register('registrationRequired')} />
            <label htmlFor="registrationRequired" className="text-sm text-surface-300">Registration required</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : (editing ? 'Update' : 'Create Event')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

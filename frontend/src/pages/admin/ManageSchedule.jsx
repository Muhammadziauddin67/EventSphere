import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2, X, Loader2, CalendarDays, Clock } from 'lucide-react'
import { toast } from 'sonner'

const empty = {
  expoId: '', title: '', speaker: '', topic: '',
  location: '', startTime: '', endTime: '', capacity: ''
}
const inputClass = `w-full h-10 px-3 rounded-lg border border-gray-200 bg-white
text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
focus:ring-2 focus:ring-[#FFA641]/20 transition-all`
const handleDelete = async (id) => {
  setDeleteId(id)
  toast.message('Delete this session?', {
    action: {
      label: 'Delete',
      onClick: async () => {
        try {
          await axios.delete(`http://localhost:8000/admin/sessions/${id}`, { headers })
          toast.success('Session deleted')
          setSessions(prev => prev.filter(s => s._id !== id))
        } catch (error) {
          toast.error('Failed to delete')
        }
      }
    }
  })
}
const ManageSchedule = () => {
  const [expos,     setExpos]     = useState([])
  const [sessions,  setSessions]  = useState([])
  const [selectedExpo, setSelectedExpo] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(empty)
  const [saving,    setSaving]    = useState(false)
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }
  const [deleteId, setDeleteId] = useState(null)
  // fetch expos for dropdown
  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/admin/expos', { headers })
        setExpos(res.data.data)
        if (res.data.data.length > 0) setSelectedExpo(res.data.data[0]._id)
      } catch (error) { console.log(error) }
    }
    fetchExpos()
  }, [])

  // fetch sessions when expo selected
  useEffect(() => {
    if (!selectedExpo) return
    const fetchSessions = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:8000/admin/sessions/${selectedExpo}`, { headers })
        setSessions(res.data.data)
      } catch (error) { console.log(error) }
      finally { setLoading(false) }
    }
    fetchSessions()
  }, [selectedExpo])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...empty, expoId: selectedExpo })
    setShowModal(true)
  }

  const openEdit = (session) => {
    setEditing(session)
    setForm({
      ...session,
      expoId:    session.expoId,
      startTime: session.startTime?.slice(0, 16),
      endTime:   session.endTime?.slice(0, 16),
    })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditing(null); setForm(empty) }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editing) {
        await axios.put(`http://localhost:8000/admin/sessions/${editing._id}`, form, { headers })
        toast.success('Session updated')
      } else {
        await axios.post('http://localhost:8000/admin/sessions', form, { headers })
        toast.success('Session created')
      }
      closeModal()
      const res = await axios.get(`http://localhost:8000/admin/sessions/${selectedExpo}`, { headers })
      setSessions(res.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    toast.message('Delete this session?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await axios.delete(
              `http://localhost:8000/admin/sessions/${id}`,
              { headers }
            )
  
            toast.success('Session deleted')
            setSessions(prev => prev.filter(s => s._id !== id))
  
          } catch (error) {
            console.log(error)
            toast.error(
              error.response?.data?.message || 'Failed to delete'
            )
          }
        }
      }
    })
  }

  const formatTime = (dt) => dt ? new Date(dt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—'


  return (
    <div>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Schedule</h2>
          <p className='text-gray-400 text-sm'>{sessions.length} sessions</p>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto'>
          {/* Expo selector */}
          <select
            value={selectedExpo}
            onChange={e => setSelectedExpo(e.target.value)}
           className='h-10 w-full sm:w-auto px-3 rounded-lg border border-gray-200 bg-white text-[#2C3E50] text-sm outline-none focus:border-[#FFA641] transition-all'
          >
            {expos.map(expo => (
              <option key={expo._id} value={expo._id}>{expo.title}</option>
            ))}
          </select>
          <button onClick={openCreate}
                  className='w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFA641] hover:bg-[#ffb55a] text-[#2C3E50] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors'>
            <Plus className='w-4 h-4' /> Add Session
          </button>
        </div>
      </div>

      {/* Sessions */}
      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
        </div>
      ) : sessions.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <CalendarDays className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No sessions yet for this expo.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {sessions.map(session => (
            <div key={session._id}
            className='bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
         <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-start'>
                {/* Time block */}
                <div className='bg-[#2C3E50] rounded-lg px-3 py-2 text-center flex-shrink-0 min-w-[64px] sm:min-w-[80px]'>
                  <p className='text-[#FFA641] text-xs font-bold'>
                    {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className='text-white text-sm font-bold'>
                    {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div>
                  <p className='font-bold text-[#2C3E50] mb-1'>{session.title}</p>
                  <div className='flex flex-wrap gap-3 text-xs text-gray-400'>
                    {session.speaker  && <span>🎤 {session.speaker}</span>}
                    {session.topic    && <span>📌 {session.topic}</span>}
                    {session.location && <span>📍 {session.location}</span>}
                    {session.capacity && <span>👥 Capacity: {session.capacity}</span>}
                  </div>
                  <div className='flex items-center gap-1 mt-1.5 text-xs text-gray-300'>
                    <Clock className='w-3 h-3' />
                    {formatTime(session.startTime)} → {formatTime(session.endTime)}
                  </div>
                </div>
              </div>

              <div className='flex gap-2 sm:flex-shrink-0 self-end sm:self-auto'>
                <button onClick={() => openEdit(session)}
                        className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                                   hover:text-[#2C3E50] transition-colors'>
                  <Pencil className='w-4 h-4' />
                </button>
                <button onClick={() => handleDelete(session._id)}
                        className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                                   hover:text-red-500 transition-colors'>
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
    <div className='fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-2 sm:px-4'>
          <div style={{ fontFamily: "'Jost', sans-serif" }}
               className='bg-white rounded-2xl p-5 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6'>
              <h3 className='text-lg font-bold text-[#2C3E50]'>
                {editing ? 'Edit Session' : 'Add Session'}
              </h3>
              <button onClick={closeModal} className='text-gray-400 hover:text-[#2C3E50]'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-4'>
              {[
                { label: 'Session Title', key: 'title',    type: 'text',     placeholder: 'e.g. Keynote Address' },
                { label: 'Speaker',       key: 'speaker',  type: 'text',     placeholder: 'Speaker name' },
                { label: 'Topic',         key: 'topic',    type: 'text',     placeholder: 'Topic or subject' },
                { label: 'Location',      key: 'location', type: 'text',     placeholder: 'Hall / Room' },
                { label: 'Start Time',    key: 'startTime',type: 'datetime-local', placeholder: '' },
                { label: 'End Time',      key: 'endTime',  type: 'datetime-local', placeholder: '' },
                { label: 'Capacity',      key: 'capacity', type: 'number',   placeholder: 'Max attendees' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>{label}</label>
                  <input
                    type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-3 mt-6'>
              <button onClick={closeModal}
                      className='flex-1 h-10 border border-gray-200 rounded-lg text-sm
                                 font-semibold text-gray-500 hover:bg-gray-50 transition-colors'>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                      className='flex-1 h-10 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                                 text-[#2C3E50] font-bold text-sm rounded-lg
                                 flex items-center justify-center gap-2 transition-colors'>
                {saving ? <><Loader2 className='w-4 h-4 animate-spin' />Saving...</> : 'Save Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSchedule
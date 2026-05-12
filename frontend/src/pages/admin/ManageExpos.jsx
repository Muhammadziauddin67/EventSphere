import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2, X, Loader2, LayoutGrid } from 'lucide-react'  // ← added LayoutGrid
import { toast } from 'sonner'
import FloorPlan from './FloorPlan'  // ← added

const empty = { title: '', date: '', location: '', city: '', description: '', theme: '', status: 'draft', type: 'expo', artist: '', team: '', tickets: [] , venueImage:'', gallery:[], mapLocation:{ address:'' } }

const ManageExpos = () => {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [floorPlanExpo, setFloorPlanExpo] = useState(null)  // ← added
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchExpos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/expos', { headers })
      setExpos(res.data.data)
    } catch (error) { console.log(error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchExpos() }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (expo) => { setEditing(expo); setForm({ ...expo, date: expo.date?.slice(0, 10) }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(empty) }

  const handleSave = async () => {
    try {
      setSaving(true)
      if (editing) {
        await axios.put(`http://localhost:8000/admin/expos/${editing._id}`, form, { headers })
        toast.success('Expo updated')
      } else {
        await axios.post('http://localhost:8000/admin/expos', form, { headers })
        toast.success('Expo created')
      }
      closeModal()
      fetchExpos()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expo?')) return
    try {
      await axios.delete(`http://localhost:8000/admin/expos/${id}`, { headers })
      toast.success('Expo deleted')
      fetchExpos()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const inputClass = `w-full h-10 px-3 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all`

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    
    <div>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Expos</h2>
          <p className='text-gray-400 text-sm'>{expos.length} total</p>
        </div>
        <button onClick={openCreate}
          className='flex items-center gap-2 bg-[#FFA641] hover:bg-[#ffb55a]
                           text-[#2C3E50] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors'>
          <Plus className='w-4 h-4' /> Create Expo
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        {expos.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-16'>No expos yet — create your first one.</p>
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100 bg-gray-50'>
                {['Title', 'Location', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className='text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {expos.map(expo => (
                <tr key={expo._id} className='hover:bg-gray-50/50 transition-colors'>
                  <td className='px-5 py-3'>
                    <p className='text-sm font-semibold text-[#2C3E50]'>{expo.title}</p>
                    <p className='text-xs text-gray-400'>{expo.theme}</p>
                  </td>
                  <td className='px-5 py-3 text-sm text-gray-500'>{expo.location}</td>
                  <td className='px-5 py-3 text-sm text-gray-500'>
                    {new Date(expo.date).toLocaleDateString()}
                  </td>
                  <td className='px-5 py-3'>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                      ${expo.status === 'published' ? 'bg-green-50 text-green-600'
                        : expo.status === 'closed' ? 'bg-gray-100 text-gray-500'
                          : 'bg-orange-50 text-orange-500'}`}>
                      {expo.status}
                    </span>
                  </td>
                  <td className='px-5 py-3'>
                    <div className='flex items-center gap-2'>
                      {/* ── Floor Plan button ── */}
                      <button onClick={() => setFloorPlanExpo(expo)}
                        className='p-1.5 rounded-lg hover:bg-blue-50 text-gray-400
                                         hover:text-blue-500 transition-colors'
                        title='Floor Plan'>
                        <LayoutGrid className='w-4 h-4' />
                      </button>
                      <button onClick={() => openEdit(expo)}
                        className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                                         hover:text-[#2C3E50] transition-colors'>
                        <Pencil className='w-4 h-4' />
                      </button>
                      <button onClick={() => handleDelete(expo._id)}
                        className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                                         hover:text-red-500 transition-colors'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
 <div className='fixed inset-0 bg-black/40 flex items-end md:items-center
 justify-center z-50 px-0 md:px-4'>
          <div  style={{ fontFamily: "'Jost', sans-serif" }}
  className='bg-white rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full
  md:max-w-lg max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-bold text-[#2C3E50]'>
                {editing ? 'Edit Expo' : 'Create Expo'}
              </h3>
              <button onClick={closeModal} className='text-gray-400 hover:text-[#2C3E50] transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-4'>
              {[
                { label: 'Title', key: 'title', type: 'text', placeholder: 'Expo title' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'City, Country' },
                { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                { label: 'Theme', key: 'theme', type: 'text', placeholder: 'e.g. Technology, Healthcare' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputClass} />
                </div>
              ))}
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  Venue Image URL
                </label>
                <input type='url' placeholder='https://...' value={form.venueImage || ''}
                  onChange={e => setForm(p => ({ ...p, venueImage: e.target.value }))}
                  className={inputClass} />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  Map Location
                </label>
                <input type='text' placeholder='Full address for map'
                  value={form.mapLocation?.address || ''}
                  onChange={e => setForm(p => ({
                    ...p, mapLocation: { ...p.mapLocation, address: e.target.value }
                  }))}
                  className={inputClass} />
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-semibold text-[#2C3E50]'>Gallery Images</label>
                  <button type='button'
                    onClick={() => setForm(p => ({
                      ...p, gallery: [...(p.gallery || []), '']
                    }))}
                    className='text-xs text-[#FFA641] font-semibold hover:underline'>
                    + Add image
                  </button>
                </div>
                {(form.gallery || []).map((url, i) => (
                  <div key={i} className='flex gap-2 mb-2'>
                    <input type='url' placeholder='Image URL' value={url}
                      onChange={e => {
                        const g = [...form.gallery]
                        g[i] = e.target.value
                        setForm(p => ({ ...p, gallery: g }))
                      }}
                      className='flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm
                        outline-none focus:border-[#FFA641]' />
                    <button type='button'
                      onClick={() => setForm(p => ({
                        ...p, gallery: p.gallery.filter((_, idx) => idx !== i)
                      }))}
                      className='text-red-400 text-xs px-1'>✕</button>
                  </div>
                ))}
              </div>
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Description</label>
                <textarea value={form.description} rows={3}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder='Brief description of the expo'
                  className={`${inputClass} h-auto py-2 resize-none`} />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Status</label>
                <select value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className={inputClass}>
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
                  <option value='closed'>Closed</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Event Type</label>
                <select value={form.type || 'expo'}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className={inputClass}>
                  <option value='expo'>Expo / Trade Show</option>
                  <option value='concert'>Concert</option>
                  <option value='sports'>Sports</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>City</label>
                <input type='text' placeholder='e.g. Dubai' value={form.city || ''}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className={inputClass} />
              </div>

              {form.type === 'concert' && (
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Artist</label>
                  <input type='text' placeholder='Artist or band name' value={form.artist || ''}
                    onChange={e => setForm(p => ({ ...p, artist: e.target.value }))}
                    className={inputClass} />
                </div>
              )}

              {form.type === 'sports' && (
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Teams</label>
                  <input type='text' placeholder='e.g. Real Madrid vs Barcelona' value={form.team || ''}
                    onChange={e => setForm(p => ({ ...p, team: e.target.value }))}
                    className={inputClass} />
                </div>
              )}

              {/* Ticket tiers */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-semibold text-[#2C3E50]'>Ticket Tiers</label>
                  <button type='button'
                    onClick={() => setForm(p => ({
                      ...p,
                      tickets: [...(p.tickets || []), { tierName: '', price: '', capacity: '' }]
                    }))}
                    className='text-xs text-[#FFA641] font-semibold hover:underline'>
                    + Add tier
                  </button>
                </div>
                {(form.tickets || []).map((tier, i) => (
                  <div key={i} className='flex gap-2 mb-2'>
                    <input type='text' placeholder='Tier name (e.g. VIP)'
                      value={tier.tierName}
                      onChange={e => {
                        const t = [...form.tickets]
                        t[i].tierName = e.target.value
                        setForm(p => ({ ...p, tickets: t }))
                      }}
                      className='flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm
                        outline-none focus:border-[#FFA641]' />
                    <input type='number' placeholder='Price'
                      value={tier.price}
                      onChange={e => {
                        const t = [...form.tickets]
                        t[i].price = e.target.value
                        setForm(p => ({ ...p, tickets: t }))
                      }}
                      className='w-24 h-9 px-3 rounded-lg border border-gray-200 text-sm
                        outline-none focus:border-[#FFA641]' />
                    <input type='number' placeholder='Capacity'
                      value={tier.capacity}
                      onChange={e => {
                        const t = [...form.tickets]
                        t[i].capacity = e.target.value
                        setForm(p => ({ ...p, tickets: t }))
                      }}
                      className='w-24 h-9 px-3 rounded-lg border border-gray-200 text-sm
                        outline-none focus:border-[#FFA641]' />
                    <button type='button'
                      onClick={() => setForm(p => ({
                        ...p,
                        tickets: p.tickets.filter((_, idx) => idx !== i)
                      }))}
                      className='text-red-400 hover:text-red-600 text-xs px-1'>✕</button>
                  </div>
                ))}
              </div>
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
                {saving ? <><Loader2 className='w-4 h-4 animate-spin' /> Saving...</> : 'Save Expo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floor Plan Modal ── */}
      {floorPlanExpo && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-bold text-[#2C3E50]'>
                Floor Plan — {floorPlanExpo.title}
              </h3>
              <button onClick={() => setFloorPlanExpo(null)}
                className='text-gray-400 hover:text-[#2C3E50] transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <FloorPlan expoId={floorPlanExpo._id} mode='view' eventType={floorPlanExpo.type} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageExpos
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, Store } from 'lucide-react'
import { toast } from 'sonner'

const MyBooth = () => {
  const [apps,   setApps]   = useState([])
  const [booth,  setBooth]  = useState(null)
  const [selectedExpo, setSelectedExpo] = useState('')
  const [saving, setSaving] = useState(false)
  const [form,   setForm]   = useState({ products: '', staffInfo: '' })
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/applications', { headers })
        const approved = res.data.data.filter(a => a.status === 'approved')
        setApps(approved)
        if (approved.length > 0) setSelectedExpo(approved[0].expoId?._id)
      } catch (e) { console.log(e) }
    }
    fetchApps()
  }, [])

  useEffect(() => {
    if (!selectedExpo) return
    const fetchBooth = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/exhibitor/booth/${selectedExpo}`, { headers })
        setBooth(res.data.data)
        if (res.data.data) {
          setForm({
            products:  res.data.data.products?.join(', ') || '',
            staffInfo: res.data.data.staffInfo || ''
          })
        }
      } catch (e) { console.log(e) }
    }
    fetchBooth()
  }, [selectedExpo])

  const handleSave = async () => {
    if (!booth) return
    try {
      setSaving(true)
      await axios.put(`http://localhost:8000/exhibitor/booth/${booth._id}`, {
        products:  form.products.split(',').map(p => p.trim()).filter(Boolean),
        staffInfo: form.staffInfo
      }, { headers })
      toast.success('Booth details updated')
    } catch (e) {
      toast.error('Failed to update booth')
    } finally { setSaving(false) }
  }

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all placeholder:text-gray-300`

  return (
    <div className='max-w-2xl space-y-6'>
      <div>
        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Exhibitor Portal</p>
        <h2 className='text-2xl font-bold text-[#2C3E50]'>My Booth</h2>
      </div>

      {apps.length === 0 ? (
        <div className='bg-white rounded-2xl border border-gray-100 py-16 text-center'>
          <Store className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No approved applications yet.</p>
          <p className='text-gray-300 text-xs mt-1'>
            Once your application is approved, your booth will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Expo selector if multiple approved */}
          {apps.length > 1 && (
            <select value={selectedExpo}
                    onChange={e => setSelectedExpo(e.target.value)}
                    className={inputClass}>
              {apps.map(app => (
                <option key={app._id} value={app.expoId?._id}>
                  {app.expoId?.title}
                </option>
              ))}
            </select>
          )}

          {!booth ? (
            <div className='bg-white rounded-2xl border border-gray-100 py-12 text-center'>
              <p className='text-gray-400 text-sm'>No booth assigned yet for this expo.</p>
              <p className='text-gray-300 text-xs mt-1'>The admin will assign your booth after approval.</p>
            </div>
          ) : (
            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              {/* Booth info */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100'>
                <div className='w-16 h-16 rounded-xl bg-[#2C3E50] flex items-center
                                justify-center text-[#FFA641] font-bold text-lg'>
                  {booth.boothNumber}
                </div>
                <div>
                  <p className='font-bold text-[#2C3E50] text-lg'>Booth {booth.boothNumber}</p>
                  <div className='flex gap-3 mt-1 text-xs text-gray-400'>
                    <span>Size: {booth.size || 'Standard'}</span>
                    <span className={`font-semibold
                      ${booth.status==='occupied' ? 'text-green-600'
                      : booth.status==='reserved' ? 'text-amber-600' : 'text-gray-400'}`}>
                      {booth.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                    Products / Services showcased
                    <span className='text-gray-400 font-normal ml-1'>(comma separated)</span>
                  </label>
                  <input type='text' value={form.products}
                         onChange={e => setForm(p => ({ ...p, products: e.target.value }))}
                         placeholder='e.g. AI Platform, Cloud API, IoT Sensors'
                         className={inputClass} />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                    Staff Information
                  </label>
                  <textarea rows={3} value={form.staffInfo}
                            onChange={e => setForm(p => ({ ...p, staffInfo: e.target.value }))}
                            placeholder='Staff names, roles, contact info...'
                            className={`${inputClass} h-auto py-3 resize-none`} />
                </div>

                <button onClick={handleSave} disabled={saving}
                        className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                                   text-[#2C3E50] font-bold text-sm rounded-lg
                                   flex items-center justify-center gap-2 transition-colors'>
                  {saving
                    ? <><Loader2 className='w-4 h-4 animate-spin' /> Saving...</>
                    : 'Save Booth Details'
                  }
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyBooth
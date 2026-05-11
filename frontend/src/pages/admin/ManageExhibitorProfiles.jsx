import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const ManageExhibitorProfiles = () => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchProfiles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/exhibitor-profiles', { headers })
      setProfiles(res.data.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleChange = (id, field, value) => {
    setProfiles(prev =>
      prev.map(p => p._id === id ? { ...p, [field]: value } : p)
    )
  }

  const handleSave = async (profile) => {
    try {
      setSaving(profile._id)

      await axios.put(
        `http://localhost:8000/admin/exhibitor-profiles/${profile._id}`,
        profile,
        { headers }
      )

      toast.success('Profile updated')
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return (
    <div className='flex justify-center items-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-[#2C3E50]'>Exhibitor Profiles</h2>
        <p className='text-gray-400 text-sm'>{profiles.length} profiles</p>
      </div>

      {profiles.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <p className='text-gray-400 text-sm'>No exhibitor profiles found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {profiles.map(p => (
            <div key={p._id} className='bg-white border border-gray-100 rounded-xl p-5'>
              
              <div className='grid gap-3 mb-4'>
                <input
                  value={p.company || ''}
                  onChange={e => handleChange(p._id, 'company', e.target.value)}
                  placeholder='Company'
                  className='border rounded-lg px-3 py-2 text-sm'
                />

                <textarea
                  value={p.description || ''}
                  onChange={e => handleChange(p._id, 'description', e.target.value)}
                  placeholder='Description'
                  className='border rounded-lg px-3 py-2 text-sm'
                />

                <input
                  value={p.logoUrl || ''}
                  onChange={e => handleChange(p._id, 'logoUrl', e.target.value)}
                  placeholder='Logo URL'
                  className='border rounded-lg px-3 py-2 text-sm'
                />

                <input
                  value={p.products || ''}
                  onChange={e => handleChange(p._id, 'products', e.target.value)}
                  placeholder='Products (comma separated)'
                  className='border rounded-lg px-3 py-2 text-sm'
                />

                <input
                  value={p.contact || ''}
                  onChange={e => handleChange(p._id, 'contact', e.target.value)}
                  placeholder='Contact'
                  className='border rounded-lg px-3 py-2 text-sm'
                />
              </div>

              <button
                onClick={() => handleSave(p)}
                disabled={saving === p._id}
                className='w-full h-9 bg-[#2C3E50] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50'
              >
                {saving === p._id
                  ? <Loader2 className='w-4 h-4 animate-spin' />
                  : <><Save className='w-4 h-4' /> Save</>}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageExhibitorProfiles
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, Save, Search } from 'lucide-react'
import { toast } from 'sonner'

const ManageExhibitorProfiles = () => {
  const [profiles, setProfiles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(null)
  const [search,   setSearch]   = useState('')
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get('http://localhost:8000/admin/exhibitor-profiles', { headers })
      .then(res => setProfiles(res.data.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (id, field, value) => {
    setProfiles(prev => prev.map(p => p._id === id ? { ...p, [field]: value } : p))
  }

  const handleSave = async (profile) => {
    try {
      setSaving(profile._id)
      await axios.put(
        `http://localhost:8000/admin/exhibitor-profiles/${profile.userId?._id || profile._id}`,
        {
          company:     profile.company,
          description: profile.description,
          logo:        profile.logo,
          website:     profile.website,
          products:    typeof profile.products === 'string'
                         ? profile.products.split(',').map(p => p.trim()).filter(Boolean)
                         : profile.products,
          contactInfo: profile.contactInfo || {},
        },
        { headers }
      )
      toast.success('Profile updated')
    } catch (e) { toast.error('Update failed') }
    finally { setSaving(null) }
  }

  const filtered = profiles.filter(p =>
    !search ||
    p.company?.toLowerCase().includes(search.toLowerCase()) ||
    p.userId?.username?.toLowerCase().includes(search.toLowerCase())
  )

  const inputClass = 'w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-[#2C3E50] outline-none focus:border-[#FFA641] transition-all'

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Exhibitor Profiles</h2>
          <p className='text-gray-400 text-sm'>{profiles.length} profiles</p>
        </div>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input type='text' placeholder='Search...' value={search}
                 onChange={e => setSearch(e.target.value)}
                 className='h-9 pl-9 pr-4 rounded-lg border border-gray-200 text-sm
                            text-[#2C3E50] outline-none focus:border-[#FFA641] w-full md:w-48' />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <p className='text-gray-400 text-sm'>No exhibitor profiles found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
          {filtered.map(p => (
            <div key={p._id} className='bg-white border border-gray-100 rounded-xl p-5'>
              {/* Header */}
              <div className='flex items-center gap-3 mb-4 pb-4 border-b border-gray-100'>
                {p.logo ? (
                  <img src={p.logo} alt='Logo' className='w-12 h-12 rounded-xl object-cover flex-shrink-0' />
                ) : (
                  <div className='w-12 h-12 rounded-xl bg-[#2C3E50] flex items-center
                                  justify-center text-[#FFA641] font-bold text-lg flex-shrink-0'>
                    {p.company?.[0]?.toUpperCase() || p.userId?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className='font-bold text-[#2C3E50] text-sm'>{p.userId?.username}</p>
                  <p className='text-xs text-gray-400'>{p.userId?.email}</p>
                </div>
              </div>

              <div className='grid gap-2 mb-4'>
                {[
                  { label: 'Company',     key: 'company',     placeholder: 'Company name'          },
                  { label: 'Logo URL',    key: 'logo',        placeholder: 'https://...'           },
                  { label: 'Website',     key: 'website',     placeholder: 'https://...'           },
                  { label: 'Products',    key: 'products',    placeholder: 'Comma separated'       },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className='block text-xs font-semibold text-gray-400 mb-0.5'>{label}</label>
                    <input type='text' placeholder={placeholder}
                           value={typeof p[key] === 'object' ? (p[key] || []).join(', ') : (p[key] || '')}
                           onChange={e => handleChange(p._id, key, e.target.value)}
                           className={inputClass} />
                  </div>
                ))}

                <div>
                  <label className='block text-xs font-semibold text-gray-400 mb-0.5'>Description</label>
                  <textarea rows={2} value={p.description || ''}
                            onChange={e => handleChange(p._id, 'description', e.target.value)}
                            placeholder='Company description'
                            className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                                       text-[#2C3E50] outline-none focus:border-[#FFA641] resize-none' />
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <label className='block text-xs font-semibold text-gray-400 mb-0.5'>Phone</label>
                    <input type='text' value={p.contactInfo?.phone || ''}
                           onChange={e => handleChange(p._id, 'contactInfo',
                             { ...p.contactInfo, phone: e.target.value })}
                           placeholder='+1 234...'
                           className={inputClass} />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-gray-400 mb-0.5'>Address</label>
                    <input type='text' value={p.contactInfo?.address || ''}
                           onChange={e => handleChange(p._id, 'contactInfo',
                             { ...p.contactInfo, address: e.target.value })}
                           placeholder='Address'
                           className={inputClass} />
                  </div>
                </div>
              </div>

              <button onClick={() => handleSave(p)} disabled={saving === p._id}
                      className='w-full h-9 bg-[#2C3E50] hover:bg-[#FFA641] hover:text-[#2C3E50]
                                 text-white text-xs font-bold rounded-lg
                                 flex items-center justify-center gap-2 disabled:opacity-50
                                 transition-colors'>
                {saving === p._id
                  ? <Loader2 className='w-4 h-4 animate-spin' />
                  : <><Save className='w-4 h-4' /> Save Profile</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageExhibitorProfiles
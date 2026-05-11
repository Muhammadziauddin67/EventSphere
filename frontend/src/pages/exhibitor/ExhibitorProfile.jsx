import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { getData } from '@/context/userContext'

const ExhibitorProfile = () => {
  const { user } = getData()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    logo: '', company: '', description: '', website: '',
    products: '', phone: '', address: ''
  })
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }
  const [uploading, setUploading] = useState(false)
  const [logo, setLogo] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/profile', { headers })
        const p = res.data.data
        setLogo(p.logo || '')
        setForm({
          company: p.company || '',
          description: p.description || '',
          website: p.website || '',
          products: p.products?.join(', ') || '',
          phone: p.contactInfo?.phone || '',
          address: p.contactInfo?.address || '',
        })
      } catch (e) { console.log(e) }
      finally { setLoading(false) }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await axios.put('http://localhost:8000/exhibitor/profile', {
        company: form.company,
        description: form.description,
        website: form.website,
        products: form.products.split(',').map(p => p.trim()).filter(Boolean),
        contactInfo: { phone: form.phone, address: form.address }
      }, { headers })
      toast.success('Profile updated successfully')
    } catch (e) {
      toast.error('Failed to update profile')
    } finally { setSaving(false) }
  }

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all placeholder:text-gray-300`

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div className='max-w-2xl space-y-6'>
      <div>
        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Exhibitor Portal</p>
        <h2 className='text-2xl font-bold text-[#2C3E50]'>My Profile</h2>
      </div>

      {/* Account info */}
      <div className='bg-white rounded-2xl border border-gray-100 p-6'>
        <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-100'>
          <div className='w-14 h-14 rounded-full bg-[#FFA641] flex items-center
                          justify-center text-[#2C3E50] font-bold text-xl'>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className='font-bold text-[#2C3E50]'>{user?.username}</p>
            <p className='text-sm text-gray-400'>{user?.email}</p>
            <span className='text-xs bg-amber-50 text-amber-600 font-semibold
                             px-2 py-0.5 rounded-full'>Exhibitor</span>
          </div>
        </div>
        <p className='text-xs text-gray-400'>
          Account details are managed separately. Update your company profile below.
        </p>
      </div>

      {/* Company profile */}
      <div className='bg-white rounded-2xl border border-gray-100 p-6 space-y-4'>
        <h3 className='font-bold text-[#2C3E50]'>Company Profile</h3>
        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Company Logo</label>
          <div className='flex items-center gap-4'>
            {logo ? (
              <img src={logo} alt='Logo' className='w-16 h-16 rounded-xl object-cover border border-gray-200' />
            ) : (
              <div className='w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 text-xs'>
                No logo
              </div>
            )}
            <label className='cursor-pointer'>
              <span className='text-xs bg-[#2C3E50] text-white font-bold px-4 py-2 rounded-lg
                       hover:bg-[#FFA641] hover:text-[#2C3E50] transition-colors'>
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </span>
              <input type='file' accept='image/*' className='hidden'
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (!file) return
                  const formData = new FormData()
                  formData.append('logo', file)
                  setUploading(true)
                  try {
                    const res = await axios.post(
                      'http://localhost:8000/exhibitor/profile/logo',
                      formData,
                      { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
                    )
                    setLogo(res.data.logo)
                    toast.success('Logo uploaded!')
                  } catch (e) { toast.error('Upload failed') }
                  finally { setUploading(false) }
                }} />
            </label>
          </div>
        </div>
        {[
          { label: 'Company Name', key: 'company', type: 'text', placeholder: 'Your company name' },
          { label: 'Website', key: 'website', type: 'url', placeholder: 'https://yourcompany.com' },
          { label: 'Products / Services', key: 'products', type: 'text', placeholder: 'Comma separated: AI, Cloud, IoT' },
          { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+1 234 567 8900' },
          { label: 'Address', key: 'address', type: 'text', placeholder: 'Company address' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>{label}</label>
            <input type={type} placeholder={placeholder} value={form[key]}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className={inputClass} />
          </div>
        ))}

        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Description</label>
          <textarea rows={4} value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder='Tell attendees about your company...'
            className={`${inputClass} h-auto py-3 resize-none`} />
        </div>

        <button onClick={handleSave} disabled={saving}
          className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                           text-[#2C3E50] font-bold text-sm rounded-lg
                           flex items-center justify-center gap-2 transition-colors'>
          {saving
            ? <><Loader2 className='w-4 h-4 animate-spin' /> Saving...</>
            : 'Save Profile'
          }
        </button>
      </div>
    </div>
  )
}

export default ExhibitorProfile
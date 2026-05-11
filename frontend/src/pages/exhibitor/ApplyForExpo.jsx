import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import FloorPlan from '../admin/FloorPlan'

const ApplyForExpo = () => {
  const [expos,         setExpos]         = useState([])
  const [selectedExpo,  setSelectedExpo]  = useState('')
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [showFloor,     setShowFloor]     = useState(false)
  const [isLoading,     setIsLoading]     = useState(false)
  const [submitted,     setSubmitted]     = useState(false)
  const [form, setForm] = useState({ company: '', description: '', products: '' })
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/expos', { headers })
        setExpos(res.data.data)
      } catch (e) { console.log(e) }
    }
    fetchExpos()
  }, [])

  const handleSubmit = async () => {
    if (!selectedExpo || !form.company)
      return toast.error('Please select an expo and enter your company name')
    try {
      setIsLoading(true)
      await axios.post('http://localhost:8000/exhibitor/apply', {
        expoId:    selectedExpo,
        company:   form.company,
        description: form.description,
        products:  form.products,
        boothId:   selectedBooth?._id || null,
      }, { headers })
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally { setIsLoading(false) }
  }

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all placeholder:text-gray-300`

  if (submitted) return (
    <div className='flex items-center justify-center min-h-[400px]'>
      <div className='text-center'>
        <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center
                        justify-center mx-auto mb-4'>
          <CheckCircle className='w-8 h-8 text-[#FFA641]' />
        </div>
        <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>Application submitted!</h2>
        <p className='text-gray-400 text-sm'>The admin will review your application shortly.</p>
      </div>
    </div>
  )

  return (
    <div className='max-w-2xl'>
      <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Exhibitor Portal</p>
      <h2 className='text-2xl font-bold text-[#2C3E50] mb-1'>Apply for an Expo</h2>
      <p className='text-gray-400 text-sm mb-8'>
        Fill in your company details and optionally select a booth from the floor plan.
      </p>

      <div className='bg-white rounded-2xl border border-gray-100 p-6 space-y-5'>

        {/* Expo selector */}
        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Select Expo</label>
          <select value={selectedExpo}
                  onChange={e => { setSelectedExpo(e.target.value); setSelectedBooth(null); setShowFloor(false) }}
                  className={inputClass}>
            <option value=''>Choose an expo...</option>
            {expos.map(expo => (
              <option key={expo._id} value={expo._id}>
                {expo.title} — {expo.location} ({new Date(expo.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Company details */}
        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Company Name</label>
          <input type='text' placeholder='Your company name' value={form.company}
                 onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                 className={inputClass} />
        </div>

        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
            Products / Services
          </label>
          <input type='text' placeholder='e.g. AI Software, Cloud Solutions'
                 value={form.products}
                 onChange={e => setForm(p => ({ ...p, products: e.target.value }))}
                 className={inputClass} />
        </div>

        <div>
          <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Description</label>
          <textarea rows={3} placeholder='Tell the organizer about your company...'
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className={`${inputClass} h-auto py-3 resize-none`} />
        </div>

        {/* Booth selection */}
        {selectedExpo && (
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='text-sm font-semibold text-[#2C3E50]'>
                Select a Booth{' '}
                <span className='text-gray-400 font-normal'>(optional)</span>
              </label>
              <button onClick={() => setShowFloor(!showFloor)}
                      className='text-xs text-[#FFA641] font-semibold hover:underline'>
                {showFloor ? 'Hide floor plan' : 'View floor plan →'}
              </button>
            </div>

            {selectedBooth && (
              <div className='flex items-center justify-between bg-[#FFA641]/10 border
                              border-[#FFA641]/30 rounded-lg px-4 py-2.5 mb-3'>
                <span className='text-sm font-semibold text-[#2C3E50]'>
                  ✓ Booth {selectedBooth.boothNumber} selected
                </span>
                <button onClick={() => setSelectedBooth(null)}
                        className='text-xs text-gray-400 hover:text-red-500 transition-colors'>
                  Remove
                </button>
              </div>
            )}

            {showFloor && (
              <div className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
                <FloorPlan
                  expoId={selectedExpo}
                  mode='select'
                  onBoothSelect={setSelectedBooth}
                />
              </div>
            )}
          </div>
        )}

        <button onClick={handleSubmit} disabled={isLoading}
                className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                           text-[#2C3E50] font-bold text-sm rounded-lg
                           flex items-center justify-center gap-2 transition-colors'>
          {isLoading
            ? <><Loader2 className='w-4 h-4 animate-spin' /> Submitting...</>
            : 'Submit Application'
          }
        </button>
      </div>
    </div>
  )
}

export default ApplyForExpo
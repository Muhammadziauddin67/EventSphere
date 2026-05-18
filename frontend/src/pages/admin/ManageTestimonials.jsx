import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/testimonials', { headers })
      setTestimonials(res.data.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTestimonials() }, [])

  const handleApprove = async (id, approved, role) => {
    try {
      await axios.put(`http://localhost:8000/admin/testimonials/${id}`,
        { approved, role }, { headers })  // removed showOn
      toast.success(approved ? 'Approved!' : 'Unapproved')
      fetchTestimonials()
    } catch (e) { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await axios.delete(`http://localhost:8000/admin/testimonials/${id}`, { headers })
      toast.success('Deleted')
      setTestimonials(prev => prev.filter(t => t._id !== id))
    } catch (e) { toast.error('Failed') }
  }

  const filtered = filter === 'all' ? testimonials
    : filter === 'approved' ? testimonials.filter(t => t.approved)
      : testimonials.filter(t => !t.approved)

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Testimonials</h2>
          <p className='text-gray-400 text-sm'>{testimonials.length} total</p>
        </div>
        <div className='flex gap-1 bg-white border border-gray-100 rounded-lg p-1'>
          {['all', 'approved', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-colors
                      ${filter === f ? 'bg-[#2C3E50] text-white' : 'text-gray-400 hover:text-[#2C3E50]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <Star className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No testimonials yet.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filtered.map(item => (
            <div key={item._id} className='bg-white rounded-xl border border-gray-100 p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1 flex-wrap'>
                    <div className='w-8 h-8 rounded-full bg-[#2C3E50] flex items-center justify-center text-[#FFA641] font-bold text-xs flex-shrink-0'>
                      {item.userId?.username?.[0]?.toUpperCase()}
                    </div>
                    <span className='font-semibold text-sm text-[#2C3E50]'>{item.userId?.username}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
      ${item.approved ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                      {item.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className='flex gap-0.5 mb-2'>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={s <= (item.rating || 5) ? 'text-[#FFA641]' : 'text-gray-200'}>★</span>
                    ))}
                  </div>

                  <p className='text-sm text-gray-500 italic mb-3'>"{item.quote}"</p>

                  {/* Admin sets role */}
                  <div className='flex items-center gap-2'>
                    <label className='text-xs text-gray-400'>Role label:</label>
                    <input type='text' defaultValue={item.role || ''}
                      onBlur={e => handleApprove(item._id, item.approved, e.target.value)}
                      placeholder='e.g. Event Organizer'
                      className='text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#FFA641] w-40' />
                  </div>
                </div>
                <div className='flex gap-2 flex-shrink-0 flex-col sm:flex-row items-stretch sm:items-center'>
                  <button
                    onClick={() => handleApprove(item._id, !item.approved, item.showOn)}
                    className={`p-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1
                      ${item.approved
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    <CheckCircle className='w-4 h-4' />
                    {item.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className='p-2 sm:p-2.5 rounded-lg hover:bg-red-50 text-gray-400
             hover:text-red-500 transition-colors
             flex items-center justify-center min-w-10 min-h-10'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageTestimonials
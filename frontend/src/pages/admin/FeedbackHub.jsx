import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { MessageSquare, CheckCircle, X } from 'lucide-react'

const FeedbackHub = () => {
  const [feedback, setFeedback]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [filter,   setFilter]       = useState('all')
  const [active,   setActive]       = useState(null)
  const [response, setResponse]     = useState('')
  const [status,   setStatus]       = useState('reviewed')
  const [saving,   setSaving]       = useState(false)
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/feedback', { headers })
      setFeedback(res.data.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFeedback() }, [])

  const handleRespond = async () => {
    try {
      setSaving(true)
      await axios.put(`http://localhost:8000/admin/feedback/${active._id}`,
        { status, response }, { headers })
      toast.success('Response sent')
      setActive(null)
      setResponse('')
      fetchFeedback()
    } catch (e) { toast.error('Failed to respond') }
    finally { setSaving(false) }
  }

  const typeColors = {
    general:    'bg-blue-50 text-blue-600',
    suggestion: 'bg-purple-50 text-purple-600',
    issue:      'bg-red-50 text-red-500',
  }

  const statusColors = {
    open:     'bg-orange-50 text-orange-500',
    reviewed: 'bg-blue-50 text-blue-600',
    resolved: 'bg-green-50 text-green-600',
  }

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.status === filter)

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Feedback Hub</h2>
          <p className='text-gray-400 text-sm'>{feedback.length} total submissions</p>
        </div>
        <div className='flex gap-1 bg-white border border-gray-100 rounded-lg p-1'>
          {['all', 'open', 'reviewed', 'resolved'].map(f => (
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
          <MessageSquare className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No feedback yet.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filtered.map(item => (
            <div key={item._id}
                 className='bg-white rounded-xl border border-gray-100 p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2 flex-wrap'>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize
                                      ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize
                                      ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                    <span className='text-xs text-gray-400'>
                      {item.userId?.username} · {item.userId?.email}
                    </span>
                    <span className='text-xs text-gray-300'>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-sm text-[#2C3E50] leading-relaxed mb-2'>{item.message}</p>
                  {item.response && (
                    <div className='bg-green-50 border border-green-100 rounded-lg p-3 mt-2'>
                      <p className='text-xs font-bold text-green-600 mb-1'>Your response:</p>
                      <p className='text-xs text-green-700'>{item.response}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => { setActive(item); setStatus(item.status); setResponse(item.response || '') }}
                        className='flex-shrink-0 text-xs bg-[#FFA641] text-[#2C3E50] font-bold
                                   px-3 py-1.5 rounded-lg hover:bg-[#ffb55a] transition-colors'>
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response modal */}
      {active && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4'>
          <div style={{ fontFamily: "'Jost', sans-serif" }}
               className='bg-white rounded-2xl p-6 w-full max-w-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold text-[#2C3E50]'>Respond to Feedback</h3>
              <button onClick={() => setActive(null)} className='text-gray-400 hover:text-[#2C3E50]'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='bg-gray-50 rounded-xl p-4 mb-4'>
              <p className='text-sm text-[#2C3E50]'>{active.message}</p>
              <p className='text-xs text-gray-400 mt-2'>— {active.userId?.username}</p>
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                      className='w-full h-10 px-3 rounded-lg border border-gray-200 text-sm
                                 outline-none focus:border-[#FFA641]'>
                <option value='open'>Open</option>
                <option value='reviewed'>Reviewed</option>
                <option value='resolved'>Resolved</option>
              </select>
            </div>
            <div className='mb-5'>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Response (optional)
              </label>
              <textarea rows={4} value={response}
                        onChange={e => setResponse(e.target.value)}
                        placeholder='Write your response...'
                        className='w-full px-4 py-3 rounded-lg border border-gray-200 text-sm
                                   text-[#2C3E50] outline-none focus:border-[#FFA641] resize-none' />
            </div>
            <div className='flex gap-3'>
              <button onClick={() => setActive(null)}
                      className='flex-1 h-10 border border-gray-200 rounded-lg text-sm
                                 font-semibold text-gray-500 hover:bg-gray-50'>
                Cancel
              </button>
              <button onClick={handleRespond} disabled={saving}
                      className='flex-1 h-10 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                                 text-[#2C3E50] font-bold text-sm rounded-lg
                                 flex items-center justify-center gap-2 transition-colors'>
                {saving ? 'Saving...' : 'Save Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackHub
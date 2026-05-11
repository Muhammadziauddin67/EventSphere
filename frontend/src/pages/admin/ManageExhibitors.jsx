import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ManageExhibitors = () => {
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [updating,     setUpdating]     = useState(null)
  const [filter,       setFilter]       = useState('all')
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/applications', { headers })
      setApplications(res.data.data)
    } catch (error) { console.log(error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchApplications() }, [])

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id)
      await axios.put(`http://localhost:8000/admin/applications/${id}/status`, { status }, { headers })
      toast.success(`Application ${status}`)
      fetchApplications()
    } catch (error) {
      toast.error('Failed to update status')
    } finally { setUpdating(null) }
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

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
          <h2 className='text-xl font-bold text-[#2C3E50]'>Exhibitor Applications</h2>
          <p className='text-gray-400 text-sm'>{applications.length} total</p>
        </div>
        {/* Filter tabs */}
        <div className='flex gap-1 bg-white border border-gray-100 rounded-lg p-1'>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-colors
                      ${filter === f
                        ? 'bg-[#2C3E50] text-white'
                        : 'text-gray-400 hover:text-[#2C3E50]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <p className='text-gray-400 text-sm'>No {filter === 'all' ? '' : filter} applications.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {filtered.map(app => (
            <div key={app._id}
                 className='bg-white rounded-xl border border-gray-100 p-5'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-[#2C3E50] flex items-center
                                  justify-center text-white font-bold text-sm flex-shrink-0'>
                    {app.company?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className='font-bold text-[#2C3E50] text-sm'>{app.company}</p>
                    <p className='text-xs text-gray-400'>{app.exhibitorId?.username} · {app.exhibitorId?.email}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0
                  ${app.status === 'approved' ? 'bg-green-50 text-green-600'
                  : app.status === 'rejected' ? 'bg-red-50 text-red-500'
                  : 'bg-orange-50 text-orange-500'}`}>
                  {app.status}
                </span>
              </div>

              <div className='bg-gray-50 rounded-lg px-3 py-2 mb-4'>
                <p className='text-xs text-gray-400 mb-0.5'>Applying for</p>
                <p className='text-sm font-semibold text-[#2C3E50]'>{app.expoId?.title}</p>
              </div>

              {app.description && (
                <p className='text-xs text-gray-400 leading-relaxed mb-4'>{app.description}</p>
              )}

              {app.status === 'pending' && (
                <div className='flex gap-2'>
                  <button
                    onClick={() => updateStatus(app._id, 'approved')}
                    disabled={updating === app._id}
                    className='flex-1 h-9 bg-green-50 hover:bg-green-100 text-green-600
                               font-bold text-xs rounded-lg flex items-center justify-center
                               gap-1.5 transition-colors disabled:opacity-50'>
                    {updating === app._id
                      ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                      : <><CheckCircle className='w-3.5 h-3.5' /> Approve</>}
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, 'rejected')}
                    disabled={updating === app._id}
                    className='flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-500
                               font-bold text-xs rounded-lg flex items-center justify-center
                               gap-1.5 transition-colors disabled:opacity-50'>
                    {updating === app._id
                      ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                      : <><XCircle className='w-3.5 h-3.5' /> Reject</>}
                  </button>
                </div>
              )}

              {app.status !== 'pending' && (
                <button
                  onClick={() => updateStatus(app._id, 'pending')}
                  className='w-full h-9 border border-gray-200 hover:bg-gray-50 text-gray-400
                             font-semibold text-xs rounded-lg transition-colors'>
                  Reset to Pending
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageExhibitors
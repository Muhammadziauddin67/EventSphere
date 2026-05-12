import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ManageExhibitors = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('all')
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }
  const [boothsMap, setBoothsMap] = useState({})
  const [assigning, setAssigning] = useState(null)

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/applications', { headers })
      setApplications(res.data.data)
    } catch (error) {
      console.log("STATUS:", error.response?.status)
      console.log("DATA:", error.response?.data)
    }
    finally { setLoading(false) }
  }
  const fetchBooths = async (expoId) => {
    if (!expoId) return []

    const res = await axios.get(
      `http://localhost:8000/admin/booths/${expoId}`,
      { headers }
    )


    return res.data.data.filter(b => b.status === 'available')
  }

  const handleAssignBooth = async (applicationId, boothId) => {
    try {
      setAssigning(applicationId)
      await axios.put(`http://localhost:8000/admin/applications/${applicationId}/booth`,
        { boothId }, { headers })
      toast.success('Booth assigned!')
      fetchApplications()
    } catch (e) { toast.error('Failed to assign booth') }
    finally { setAssigning(null) }
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
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Exhibitor Applications</h2>
          <p className='text-gray-400 text-sm'>{applications.length} total</p>
        </div>
        {/* Filter tabs */}
        <div className='w-full lg:w-auto overflow-x-auto scrollbar-hide'>
          <div className='flex min-w-max gap-1 bg-white border border-gray-100 rounded-lg p-1'>
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
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <p className='text-gray-400 text-sm'>No {filter === 'all' ? '' : filter} applications.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
            {filtered.map(app => (
              <div
                key={app._id}
                className='bg-white rounded-xl border border-gray-100 p-4 sm:p-5'
              >
                {/* Top */}
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4'>

                  <div className='flex items-start gap-3 min-w-0'>
                    <div
                      className='w-10 h-10 rounded-full bg-[#2C3E50]
            flex items-center justify-center text-white
            font-bold text-sm flex-shrink-0'
                    >
                      {app.company?.[0]?.toUpperCase()}
                    </div>

                    <div className='min-w-0'>
                      <p className='font-bold text-[#2C3E50] text-sm break-words'>
                        {app.company}
                      </p>

                      <p className='text-xs text-gray-400 break-all'>
                        {app.exhibitorId?.username} · {app.exhibitorId?.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit
          ${app.status === 'approved'
                        ? 'bg-green-50 text-green-600'
                        : app.status === 'rejected'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-orange-50 text-orange-500'
                      }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Expo */}
                <div className='bg-gray-50 rounded-lg px-3 py-2 mb-4'>
                  <p className='text-xs text-gray-400 mb-0.5'>
                    Applying for
                  </p>

                  <p className='text-sm font-semibold text-[#2C3E50] break-words'>
                    {app.expoId?.title}
                  </p>
                </div>

                {/* Description */}
                {app.description && (
                  <p className='text-xs text-gray-400 leading-relaxed mb-4 break-words'>
                    {app.description}
                  </p>
                )}

                {/* Pending buttons */}
                {app.status === 'pending' && (
                  <div className='flex flex-col sm:flex-row gap-2'>

                    <button
                      onClick={() => updateStatus(app._id, 'approved')}
                      disabled={updating === app._id}
                      className='flex-1 h-10 bg-green-50 hover:bg-green-100
            text-green-600 font-bold text-xs rounded-lg
            flex items-center justify-center gap-1.5
            transition-colors disabled:opacity-50'
                    >
                      {updating === app._id
                        ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                        : <><CheckCircle className='w-3.5 h-3.5' /> Approve</>}
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, 'rejected')}
                      disabled={updating === app._id}
                      className='flex-1 h-10 bg-red-50 hover:bg-red-100
            text-red-500 font-bold text-xs rounded-lg
            flex items-center justify-center gap-1.5
            transition-colors disabled:opacity-50'
                    >
                      {updating === app._id
                        ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                        : <><XCircle className='w-3.5 h-3.5' /> Reject</>}
                    </button>
                  </div>
                )}

                {/* Approved booth assignment */}
                {app.status === 'approved' && (
                  <div className='mt-4 pt-4 border-t border-gray-100'>

                    {app.boothId ? (
                      <div className='flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold'>
                        <span>Booth Assigned</span>
                        <span>
                          {app.boothId.boothNumber || "N/A"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className='text-xs text-gray-400 mb-2'>
                          Assign a booth
                        </p>

                        <div className='flex flex-col sm:flex-row gap-2'>
                          <select
                            onFocus={async () => {
                              const expoId = app.expoId?._id || app.expoId

                              if (!expoId) return toast.error("Missing Expo ID")

                              if (!boothsMap[expoId]) {
                                const booths = await fetchBooths(expoId)
                                setBoothsMap(prev => ({
                                  ...prev,
                                  [expoId]: booths
                                }))
                              }
                            }}
                            id={`booth-select-${app._id}`}
                            className='flex-1 h-10 px-3 text-xs rounded-lg border border-gray-200'
                          >
                            <option value=''>Select booth...</option>

                            {(boothsMap[app.expoId?._id || app.expoId] || []).map(b => (
                              <option key={b._id} value={b._id}>
                                Booth {b.boothNumber}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => {
                              const sel = document.getElementById(`booth-select-${app._id}`)
                              if (sel.value) handleAssignBooth(app._id, sel.value)
                              else toast.error("Select booth first")
                            }}
                            className='h-10 px-4 bg-[#2C3E50] text-white text-xs font-bold rounded-lg'
                          >
                            Assign
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Reset */}
                {app.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(app._id, 'pending')}
                    className='w-full h-10 border border-gray-200
          hover:bg-gray-50 text-gray-400
          font-semibold text-xs rounded-lg
          transition-colors mt-4'
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageExhibitors
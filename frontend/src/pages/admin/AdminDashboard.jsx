import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, Users, CheckCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [expos, setExpos]               = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expoRes, appRes] = await Promise.all([
          axios.get('http://localhost:8000/admin/expos',        { headers }),
          axios.get('http://localhost:8000/admin/applications', { headers }),
        ])
        setExpos(expoRes.data.data)
        setApplications(appRes.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'Total Expos',          value: expos.length,                                          icon: CalendarDays, color: 'bg-[#2C3E50]' },
    { label: 'Total Applications',   value: applications.length,                                   icon: Users,        color: 'bg-[#FFA641]' },
    { label: 'Approved',             value: applications.filter(a => a.status === 'approved').length, icon: CheckCircle,  color: 'bg-green-500' },
    { label: 'Pending Review',       value: applications.filter(a => a.status === 'pending').length,  icon: Clock,        color: 'bg-orange-400' },
  ]

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div className='space-y-8'>

      {/* Stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className='bg-white rounded-xl p-5 border border-gray-100'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-gray-400 text-sm font-medium'>{label}</p>
              <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center`}>
                <Icon className='w-4 h-4 text-white' />
              </div>
            </div>
            <p className='text-3xl font-bold text-[#2C3E50]'>{value}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* Recent expos */}
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
            <h2 className='font-bold text-[#2C3E50]'>Recent Expos</h2>
            <Link to='/admin/expos'
                  className='text-[#FFA641] text-xs font-semibold hover:underline no-underline'>
              View all
            </Link>
          </div>
          {expos.length === 0 ? (
            <p className='text-gray-400 text-sm text-center py-10'>No expos yet</p>
          ) : (
            <div className='divide-y divide-gray-50'>
              {expos.slice(0, 5).map(expo => (
                <div key={expo._id} className='flex items-center justify-between px-5 py-3'>
                  <div>
                    <p className='text-sm font-semibold text-[#2C3E50]'>{expo.title}</p>
                    <p className='text-xs text-gray-400'>{expo.location} · {new Date(expo.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${expo.status === 'published' ? 'bg-green-50 text-green-600'
                    : expo.status === 'closed'    ? 'bg-gray-100 text-gray-500'
                    : 'bg-orange-50 text-orange-500'}`}>
                    {expo.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
            <h2 className='font-bold text-[#2C3E50]'>Recent Applications</h2>
            <Link to='/admin/exhibitors'
                  className='text-[#FFA641] text-xs font-semibold hover:underline no-underline'>
              View all
            </Link>
          </div>
          {applications.length === 0 ? (
            <p className='text-gray-400 text-sm text-center py-10'>No applications yet</p>
          ) : (
            <div className='divide-y divide-gray-50'>
              {applications.slice(0, 5).map(app => (
                <div key={app._id} className='flex items-center justify-between px-5 py-3'>
                  <div>
                    <p className='text-sm font-semibold text-[#2C3E50]'>{app.company}</p>
                    <p className='text-xs text-gray-400'>{app.exhibitorId?.username} · {app.expoId?.title}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${app.status === 'approved' ? 'bg-green-50 text-green-600'
                    : app.status === 'rejected' ? 'bg-red-50 text-red-500'
                    : 'bg-orange-50 text-orange-500'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
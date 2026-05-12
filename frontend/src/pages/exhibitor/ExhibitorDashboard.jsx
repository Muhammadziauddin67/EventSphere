import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, Store, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getData } from '@/context/userContext'

const ExhibitorDashboard = () => {
  const { user }           = getData()
  const [apps,  setApps]  = useState([])
  const [loading, setLoading] = useState(true)
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/applications', { headers })
        setApps(res.data.data)
      } catch (e) { console.log(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const stats = [
    { label: 'Total Applied',  value: apps.length,                                        icon: CalendarDays, color: 'bg-[#2C3E50]' },
    { label: 'Pending',        value: apps.filter(a => a.status==='pending').length,       icon: Clock,        color: 'bg-amber-400' },
    { label: 'Approved',       value: apps.filter(a => a.status==='approved').length,      icon: CheckCircle,  color: 'bg-green-500' },
    { label: 'Rejected',       value: apps.filter(a => a.status==='rejected').length,      icon: XCircle,      color: 'bg-red-400'   },
  ]

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-1'>Welcome back</p>
        <h2 className='text-2xl font-bold text-[#2C3E50]'>{user?.username}</h2>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className='bg-white rounded-xl p-5 border border-gray-100'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-gray-400 text-sm'>{label}</p>
              <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center`}>
                <Icon className='w-4 h-4 text-white' />
              </div>
            </div>
            <p className='text-3xl font-bold text-[#2C3E50]'>{value}</p>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <h3 className='font-bold text-[#2C3E50]'>My Applications</h3>
          <Link to='/exhibitor/apply'
                className='text-[#FFA641] text-xs font-semibold hover:underline no-underline
                           flex items-center gap-1'>
            Apply for expo <ArrowRight className='w-3 h-3' />
          </Link>
        </div>
        {apps.length === 0 ? (
          <div className='py-16 text-center'>
            <p className='text-gray-400 text-sm mb-3'>No applications yet.</p>
            <Link to='/exhibitor/apply'
                  className='inline-block bg-[#FFA641] text-[#2C3E50] font-bold text-sm
                             px-5 py-2 rounded-lg no-underline hover:bg-[#ffb55a] transition-colors'>
              Apply for your first expo
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-gray-50'>
            {apps.map(app => (
              <div key={app._id} className='flex items-center justify-between px-5 py-4'>
                <div>
                  <p className='font-semibold text-sm text-[#2C3E50]'>{app.expoId?.title}</p>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {app.expoId?.location} ·{' '}
                    {app.expoId?.date ? new Date(app.expoId.date).toLocaleDateString() : '—'}
                    {app.boothId && ` · Booth ${app.boothId.boothNumber}`}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full
                  ${app.status==='approved' ? 'bg-green-50 text-green-600'
                  : app.status==='rejected' ? 'bg-red-50 text-red-500'
                  : 'bg-amber-50 text-amber-600'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExhibitorDashboard
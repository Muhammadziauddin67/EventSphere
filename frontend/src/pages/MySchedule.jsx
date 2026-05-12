import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MySchedule = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:8000/attendee/my-registrations', { headers })
        setSessions(res.data.data)
      } catch (e) { console.log(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
      className='bg-[#f7f6f2] min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12'>
      <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>My Account</p>
      <h1 className='text-3xl font-bold text-[#2C3E50] mb-1'>My Schedule</h1>
      <p className='text-gray-400 text-sm mb-8'>Sessions you've registered for.</p>

      {sessions.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-20 text-center'>
          <CalendarDays className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm mb-3'>No sessions registered yet.</p>
          <button onClick={() => navigate('/events')}
            className='text-xs bg-[#FFA641] text-[#2C3E50] font-bold px-5 py-2
                             rounded-lg hover:bg-[#ffb55a] transition-colors'>
            Browse Events
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {sessions.map(session => (
            <div key={session._id}
              className='bg-white rounded-xl border border-gray-100 p-4 md:p-5
            flex flex-col sm:flex-row gap-4'>
              <div
                className='bg-[#2C3E50] rounded-xl px-3 py-3 text-center
  flex-shrink-0 w-full sm:w-[72px]'
              >
                <p className='text-[#FFA641] text-[10px] font-bold'>
                  {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className='text-white text-sm font-bold mt-0.5'>
                  {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-bold text-[#2C3E50] mb-1 break-words'>
                  {session.title}
                </p>
                <p className='text-xs text-[#FFA641] font-semibold mb-2'>{session.expoId?.title}</p>
                <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-xs text-gray-400'>
                  {session.speaker && <span>🎤 {session.speaker}</span>}
                  {session.location && (
                    <span className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />{session.location}
                    </span>
                  )}
                  <span className='flex items-center gap-1'>
                    <Clock className='w-3 h-3' />
                    {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    {' → '}
                    {new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <span
                className='self-start sm:self-auto flex-shrink-0 text-xs
  bg-green-50 text-green-600 font-bold px-3 py-1
  rounded-full h-fit'
              >
                Registered
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MySchedule
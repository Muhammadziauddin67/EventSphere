import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, CalendarDays, Ticket, Bookmark } from 'lucide-react'
import { getData } from '@/context/userContext'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { user, setUser } = getData()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ username: '', email: '' })
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (user) setForm({ username: user.username, email: user.email })
    const fetchData = async () => {
      try {
        const [ticketRes, bmRes, sessionRes] = await Promise.all([
          axios.get('http://localhost:8000/attendee/my-tickets', { headers }),
          axios.get('http://localhost:8000/attendee/bookmarks', { headers }),
          axios.get('http://localhost:8000/attendee/my-registrations', { headers }),
        ])
        setTickets(ticketRes.data.data)
        setBookmarks(bmRes.data.data)
        setSessions(sessionRes.data.data)
      } catch (e) { console.log(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all`

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen flex flex-col'>

      <div className='flex-1 px-4 md:px-16 py-12'>

        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>
          Account
        </p>

        <h1 className='text-3xl font-bold text-[#2C3E50] mb-8'>
          My Profile
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

          {/* Left — profile info */}
          <div className='space-y-5'>
            {/* Avatar */}
            <div className='bg-white rounded-2xl border border-gray-100 p-6 text-center'>
              <div className='w-20 h-20 rounded-full bg-[#FFA641] flex items-center
                            justify-center text-[#2C3E50] font-bold text-3xl mx-auto mb-3'>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <p className='font-bold text-[#2C3E50] text-lg'>{user?.username}</p>
              <p className='text-gray-400 text-sm'>{user?.email}</p>
              <span className='inline-block mt-2 text-xs bg-amber-50 text-amber-600
                             font-bold px-3 py-1 rounded-full capitalize'>
                {user?.role}
              </span>
            </div>

            {/* Quick stats */}
            <div className='bg-white rounded-2xl border border-gray-100 p-5'>
              <h3 className='font-bold text-[#2C3E50] mb-4 text-sm'>Activity</h3>
              {[
                { label: 'Tickets booked', value: tickets.filter(t => t.status === 'confirmed').length, icon: Ticket, path: '/my-tickets' },
                { label: 'Bookmarks', value: bookmarks.length, icon: Bookmark, path: '/bookmarks' },
                { label: 'Sessions joined', value: sessions.length, icon: CalendarDays, path: '/my-schedule' },
              ].map(({ label, value, icon: Icon, path }) => (
                <div key={label}
                  onClick={() => navigate(path)}
                  className='flex items-center justify-between py-3 border-b border-gray-50
                              last:border-0 cursor-pointer hover:text-[#FFA641] transition-colors group'>
                  <div className='flex items-center gap-2.5'>
                    <Icon className='w-4 h-4 text-gray-300 group-hover:text-[#FFA641] transition-colors' />
                    <span className='text-sm text-gray-500'>{label}</span>
                  </div>
                  <span className='font-bold text-[#2C3E50]'>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — edit profile */}
          <div className='lg:col-span-2 space-y-5'>
            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              <h3 className='font-bold text-[#2C3E50] mb-5'>Account Information</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                    Full name
                  </label>
                  <input type='text' value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                    Email address
                  </label>
                  <input type='email' value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={inputClass} />
                </div>
                <p className='text-xs text-gray-400'>
                  To change your password, use the{' '}
                  <span onClick={() => navigate('/forgot-password')}
                    className='text-[#FFA641] cursor-pointer hover:underline'>
                    forgot password
                  </span>{' '}flow.
                </p>
              </div>
            </div>

            {/* Recent tickets */}
            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-bold text-[#2C3E50]'>Recent Tickets</h3>
                <button onClick={() => navigate('/my-tickets')}
                  className='text-xs text-[#FFA641] font-semibold hover:underline'>
                  View all →
                </button>
              </div>
              {tickets.length === 0 ? (
                <p className='text-gray-400 text-sm text-center py-4'>No tickets yet.</p>
              ) : (
                <div className='space-y-2'>
                  {tickets.slice(0, 3).map(t => (
                    <div key={t._id}
                      onClick={() => navigate(`/event/${t.expoId?._id}`)}
                      className='flex items-center justify-between p-3 bg-gray-50
                                  rounded-lg cursor-pointer hover:bg-gray-100 transition-colors'>
                      <div>
                        <p className='text-sm font-semibold text-[#2C3E50]'>{t.expoId?.title}</p>
                        <p className='text-xs text-gray-400'>{t.tierName} · ${t.price}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${t.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
        {/* ── Footer ── */}
        <footer className='bg-[#1a2a38] px-16 pt-12 pb-6'>
        <div className='w-full'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/8'>
            <div>
              <p className='text-white font-bold text-lg mb-2'>
                Event<span className='text-[#FFA641]'>Sphere</span>
              </p>
              <p className='text-white/35 text-sm font-light leading-relaxed max-w-xs'>
                The all-in-one platform for managing world-class expos and trade shows.
              </p>
            </div>
            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>Platform</p>
              {[
                { label: 'Expos', path: '/events?type=expo' },
                { label: 'Concerts', path: '/events?type=concert' },
                { label: 'Sports', path: '/events?type=sports' },
                { label: 'Browse All', path: '/events' },
              ].map(l => (
                <p key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>
                  {l.label}
                </p>
              ))}
            </div>
            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>Company</p>
              {[
                { label: 'About', path: '/about' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/feedback' },
                { label: 'Privacy Policy', path: '/privacy' },
              ].map(l => (
                <p key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>
                  {l.label}
                </p>
              ))}
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 text-white/20 text-xs'>
            <span>© 2026 EventSphere Management. All rights reserved.</span>
            <span>Built with MERN Stack</span>
          </div>
        </div>
      </footer>


    </div>


  )
}

export default ProfilePage
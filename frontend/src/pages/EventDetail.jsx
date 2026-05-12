import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowLeft, Bookmark, Clock, Users, CheckCircle, Minus, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { getData } from '@/context/userContext'
import FloorPlan from '../pages/admin/FloorPlan'

const tabs = ['Overview', 'Tickets', 'Sessions', 'Exhibitors', 'Floor Plan']

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = getData()
  const [expo, setExpo] = useState(null)
  const [sessions, setSessions] = useState([])
  const [exhibitors, setExhibitors] = useState([])
  const [booths, setBooths] = useState([])
  const [activeTab, setActiveTab] = useState('Overview')
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [quantities, setQuantities] = useState({})
  const [booking, setBooking] = useState(null)
  const [registered, setRegistered] = useState({})
  const token = localStorage.getItem('accessToken')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const [exhibitorSearch, setExhibitorSearch] = useState('')
  const [exhibitorCategory, setExhibitorCategory] = useState('')
  const isMobile = window.innerWidth < 640

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [expoRes, sessionRes, exhibRes, boothRes] = await Promise.all([
          axios.get(`http://localhost:8000/attendee/expos/${id}`),
          axios.get(`http://localhost:8000/attendee/expos/${id}/sessions`),
          axios.get(`http://localhost:8000/attendee/expos/${id}/exhibitors`),
          axios.get(`http://localhost:8000/attendee/expos/${id}/floorplan`),
        ])
        setExpo(expoRes.data.data)
        setSessions(sessionRes.data.data)
        setExhibitors(exhibRes.data.data)
        setBooths(boothRes.data.data)

        // check bookmark
        if (user && token) {
          try {
            const bmRes = await axios.get(
              `http://localhost:8000/attendee/bookmarks/${id}/check`, { headers })
            setBookmarked(bmRes.data.bookmarked)
          } catch (e) { /* not logged in, ignore */ }
        }
      } catch (e) {
        console.log('API ERROR:', e.response?.data || e.message)
      }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [id])

  const handleBookmark = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await axios.post(
        `http://localhost:8000/attendee/bookmarks/${id}`, {}, { headers }
      )
      setBookmarked(prev => !prev)
      toast.success(res.data.message)
    } catch (e) {
      console.log(e.response?.data || e.message)
      toast.error('Something went wrong')
    }
  }

  const handleBookTicket = (tier) => {
    if (!user) return navigate('/login')
    const qty = quantities[tier.tierName] || 1
    navigate('/payment', {
      state: {
        expoId: id,
        tierName: tier.tierName,
        quantity: qty,
        price: tier.price * qty,
        eventTitle: expo.title,
      }
    })
  }

  const handleRegister = async (sessionId) => {
    if (!user) return navigate('/login')
    try {
      await axios.post(
        `http://localhost:8000/attendee/sessions/${sessionId}/register`, {}, { headers })
      setRegistered(prev => ({ ...prev, [sessionId]: true }))
      toast.success('Registered for session!')
    } catch (e) { toast.error(e.response?.data?.message || 'Something went wrong') }
  }

  // ticket tiers sorted highest to lowest price
  const sortedTiers = expo?.tickets
    ? [...expo.tickets].sort((a, b) => b.price - a.price)
    : []

  // floor plan grouping
  const groupByZone = (booths) => booths.reduce((acc, b) => {
    const zone = b.boothNumber?.[0] || 'A'
    if (!acc[zone]) acc[zone] = []
    acc[zone].push(b)
    return acc
  }, {})

  const zoneLabels = {
    A: 'Zone A',
    B: 'Zone B',
    C: 'Zone C',
    D: 'Zone D',
    E: 'Zone E',
    F: 'Zone F',
    G: 'Zone G',
    H: 'Zone H',
    I: 'Zone I',
    J: 'Zone J',
  }
  const filteredExhibitors = exhibitors.filter(app => {
    const matchSearch = !exhibitorSearch ||
      app.company?.toLowerCase().includes(exhibitorSearch.toLowerCase()) ||
      app.products?.toLowerCase().includes(exhibitorSearch.toLowerCase()) ||
      app.description?.toLowerCase().includes(exhibitorSearch.toLowerCase())
    const matchCategory = !exhibitorCategory ||
      app.products?.toLowerCase().includes(exhibitorCategory.toLowerCase())
    return matchSearch && matchCategory
  })
  const exhibitorCategories = [...new Set(
    exhibitors.flatMap(a => a.products?.split(',').map(p => p.trim()) || []).filter(Boolean)
  )]
  const statusColors = {
    available: 'bg-green-100 border-green-300 text-green-700',
    reserved: 'bg-amber-100 border-amber-300 text-amber-700',
    occupied: 'bg-[#2C3E50] border-[#2C3E50] text-[#FFA641]',
  }

  const zones = groupByZone(booths)
  const zoneKeys = Object.keys(zones).sort()
  if (loading) return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  if (!expo) return (
    <div className='text-center py-32 text-gray-400'>Event not found.</div>
  )

  const totalSold = expo.tickets?.reduce((a, t) => a + (t.sold || 0), 0) || 0
  const totalCap = expo.tickets?.reduce((a, t) => a + (t.capacity || 0), 0) || 0
  const isSoldOut = expo.tickets?.length > 0 && expo.tickets.every(t => t.sold >= t.capacity)


  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen'>

      {/* Hero */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-8 md:py-12 relative overflow-hidden'>
        <div className='absolute right-0 top-0 bottom-0 w-96 opacity-5 flex items-center justify-center pointer-events-none'>
          <svg viewBox="0 0 300 300" fill="none" className='w-full h-full'>
            <circle cx="150" cy="150" r="140" stroke="white" strokeWidth="2" />
            <ellipse cx="150" cy="150" rx="60" ry="140" stroke="white" strokeWidth="1.5" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>

        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>

          <div className='flex-1'>
            {expo.type && (
              <span className='inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 text-white'>
                {expo.type}
              </span>
            )}

            <h1 className='text-2xl md:text-4xl font-bold text-white mb-2'>
              {expo.title}
            </h1>

            <div className='flex gap-5 text-white/60 text-sm flex-wrap'>
              <span className='flex items-center gap-1.5'>
                <CalendarDays className='w-4 h-4' />
                {new Date(expo.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>

              <span className='flex items-center gap-1.5'>
                <MapPin className='w-4 h-4' />
                {expo.location}{expo.city ? `, ${expo.city}` : ''}
              </span>

              {totalCap > 0 && (
                <span className='flex items-center gap-1.5'>
                  <Users className='w-4 h-4' />
                  {totalSold} / {totalCap} registered
                </span>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2 flex-wrap'>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border
                 ${bookmarked
                  ? 'bg-[#FFA641] text-[#2C3E50] border-[#FFA641]'
                  : 'border-white/30 text-white hover:border-white/60'
                }`}
            >
              <Bookmark className='w-4 h-4' fill={bookmarked ? 'currentColor' : 'none'} />
              {bookmarked ? 'Saved' : 'Save'}
            </button>

            {isSoldOut ? (
              <span className='bg-red-500/20 text-red-300 text-sm font-bold px-4 py-2.5 rounded-lg'>
                Sold Out
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('Tickets')}
                className='bg-[#FFA641] text-[#2C3E50] font-bold text-sm px-5 py-2.5 rounded-lg'
              >
                Get Tickets
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='px-4 md:px-4 py-6'>

        {/* Tabs */}
        <div className='overflow-x-auto mb-6'>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-max min-w-full">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors
          ${activeTab === tab
                      ? 'bg-[#2C3E50] text-white'
                      : 'text-gray-400 hover:text-[#2C3E50]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <br />

          {/* ── Overview ── */}
          {activeTab === 'Overview' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
              <div className='lg:col-span-2 space-y-5'>
                <div className='bg-white rounded-xl border border-gray-100 p-6'>
                  <h3 className='font-bold text-[#2C3E50] mb-3'>About this Event</h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>
                    {expo.description || 'No description provided.'}
                  </p>
                </div>
                {expo.venueImage && (
                  <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
                    <img src={expo.venueImage} alt='Venue'
                      className='w-full h-64 object-cover' />
                  </div>
                )}
                {expo.mapLocation?.address && (
                  <div className='bg-white rounded-xl border border-gray-100 p-6'>
                    <h3 className='font-bold text-[#2C3E50] mb-3'>📍 Venue Location</h3>
                    <p className='text-gray-500 text-sm mb-3'>{expo.mapLocation.address}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(expo.mapLocation.address)}`}
                      target='_blank' rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 text-xs bg-[#2C3E50] text-white
                  font-bold px-4 py-2 rounded-lg hover:bg-[#FFA641] hover:text-[#2C3E50]
                  transition-colors no-underline'>
                      View on Google Maps →
                    </a>
                  </div>
                )}
                {expo.gallery?.length > 0 && (
                  <div className='bg-white rounded-xl border border-gray-100 p-6'>
                    <h3 className='font-bold text-[#2C3E50] mb-4'>Venue Gallery</h3>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                      {expo.gallery.map((img, i) => (
                        <img key={i} src={img} alt={`Gallery ${i + 1}`}
                          className='w-full h-32 object-cover rounded-lg cursor-pointer
                        hover:opacity-90 transition-opacity' />
                      ))}
                    </div>
                  </div>
                )}
                {sessions.length > 0 && (
                  <div className='bg-white rounded-xl border border-gray-100 p-6'>
                    <h3 className='font-bold text-[#2C3E50] mb-4'>Featured Sessions</h3>
                    <div className='space-y-3'>
                      {sessions.slice(0, 3).map(s => (
                        <div key={s._id} className='flex gap-3 items-center p-3 bg-gray-50 rounded-lg'>
                          <div className='bg-[#2C3E50] rounded-lg p-2 text-center flex-shrink-0'>
                            <p className='text-[#FFA641] text-[10px] font-bold'>
                              {new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm font-semibold text-[#2C3E50]'>{s.title}</p>
                            <p className='text-xs text-gray-400'>
                              {s.speaker && `${s.speaker} · `}
                              {new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {sessions.length > 3 && (
                        <button onClick={() => setActiveTab('Sessions')}
                          className='text-xs text-[#FFA641] font-semibold hover:underline'>
                          View all {sessions.length} sessions →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <div className='bg-white rounded-xl border border-gray-100 p-5'>
                  <h3 className='font-bold text-[#2C3E50] mb-4 text-sm'>Event Info</h3>
                  {[
                    { label: 'Type', value: expo.type },
                    { label: 'Category', value: expo.category || expo.theme },
                    { label: 'Date', value: new Date(expo.date).toLocaleDateString() },
                    { label: 'Location', value: expo.location },
                    { label: 'City', value: expo.city },
                    { label: 'Exhibitors', value: exhibitors.length },
                    { label: 'Sessions', value: sessions.length },
                  ].filter(i => i.value).map(({ label, value }) => (
                    <div key={label} className='flex justify-between py-2 border-b border-gray-50 last:border-0'>
                      <span className='text-xs text-gray-400'>{label}</span>
                      <span className='text-xs font-semibold text-[#2C3E50] capitalize'>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Quick ticket buy */}
                {sortedTiers.length > 0 && (
                  <div className='bg-[#2C3E50] rounded-xl p-5'>
                    <p className='text-white/60 text-xs mb-1'>Starting from</p>
                    <p className='text-[#FFA641] text-2xl font-bold mb-3'>
                      ${Math.min(...sortedTiers.map(t => t.price))}
                    </p>
                    <button onClick={() => setActiveTab('Tickets')}
                      disabled={isSoldOut}
                      className='w-full h-10 bg-[#FFA641] text-[#2C3E50] font-bold
                                     text-sm rounded-lg hover:bg-[#ffb55a] disabled:opacity-50
                                     transition-colors'>
                      {isSoldOut ? 'Sold Out' : 'Get Tickets →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tickets ── */}
          {activeTab === 'Tickets' && (
            <div className='max-w-2xl w-full space-y-4 min-h-screen'>
              {sortedTiers.length === 0 ? (
                <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
                  <p className='text-gray-400 text-sm'>No tickets available for this event.</p>
                </div>
              ) : (
                sortedTiers.map(tier => {
                  const remaining = tier.capacity - (tier.sold || 0)
                  const isOut = remaining <= 0
                  const qty = quantities[tier.tierName] || 1

                  return (
                    <div key={tier.tierName}
                      className={`bg-white rounded-xl border p-5 transition-colors
                         ${isOut ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-[#FFA641]'}`}>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <p className='font-bold text-[#2C3E50] text-lg'>{tier.tierName}</p>
                          <p className='text-gray-400 text-xs mt-0.5'>
                            {isOut ? (
                              <span className='text-red-500 font-semibold'>Sold out</span>
                            ) : (
                              <span>{remaining} remaining · {tier.sold || 0} sold</span>
                            )}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-2xl font-bold text-[#2C3E50]'>${tier.price}</p>
                          <p className='text-xs text-gray-400'>per ticket</p>
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className='h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden'>
                        <div
                          className={`h-full rounded-full transition-all
                          ${isOut ? 'bg-red-400' : remaining < 20 ? 'bg-amber-400' : 'bg-green-400'}`}
                          style={{ width: `${Math.min((tier.sold / tier.capacity) * 100, 100)}%` }}
                        />
                      </div>

                      {!isOut && (
                        <div className='flex items-center justify-between'>
                          {/* Quantity selector */}
                          <div className='flex items-center gap-3'>
                            <button
                              onClick={() => setQuantities(p => ({
                                ...p, [tier.tierName]: Math.max(1, (p[tier.tierName] || 1) - 1)
                              }))}
                              className='w-8 h-8 rounded-lg border border-gray-200 flex items-center
                                       justify-center text-gray-400 hover:border-[#FFA641] transition-colors'>
                              <Minus className='w-3 h-3' />
                            </button>
                            <span className='font-bold text-[#2C3E50] w-4 text-center'>{qty}</span>
                            <button
                              onClick={() => setQuantities(p => ({
                                ...p, [tier.tierName]: Math.min(remaining, (p[tier.tierName] || 1) + 1)
                              }))}
                              className='w-8 h-8 rounded-lg border border-gray-200 flex items-center
                                       justify-center text-gray-400 hover:border-[#FFA641] transition-colors'>
                              <Plus className='w-3 h-3' />
                            </button>
                            <span className='text-sm text-gray-400'>= <strong className='text-[#2C3E50]'>${tier.price * qty}</strong></span>
                          </div>

                          <button
                            onClick={() => handleBookTicket(tier)}
                            disabled={booking === tier.tierName || !user}
                            className='h-10 px-6 bg-[#FFA641] text-[#2C3E50] font-bold text-sm
                                     rounded-lg hover:bg-[#ffb55a] disabled:opacity-50 transition-colors'>
                            {booking === tier.tierName ? 'Booking...'
                              : !user ? 'Login to book'
                                : 'Book Now'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}

              {isSoldOut && (
                <div className='bg-red-50 border border-red-100 rounded-xl p-5 text-center'>
                  <p className='text-red-500 font-bold'>This event is fully booked.</p>
                  <p className='text-red-400 text-sm mt-1'>Check back later for cancellations.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Sessions ── */}
          {activeTab === 'Sessions' && (
            <div className='bg-white rounded-xl border border-gray-100 md:p-5 min-h-[250px] flex flex-col sm:flex-row items-start justify-between gap-4 mb-8'>
              {sessions.length === 0 ? (
                <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="w-full min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400 text-sm">No sessions scheduled yet.</p>
                  </div>
                </div>
              ) : sessions.map(session => {
                const isFull = session.capacity && session.attendees?.length >= session.capacity
                return (

                  <div key={session._id}

                    className='bg-white rounded-xl border border-gray-100 p-6
                                flex  justify-between gap-4'>
                    <div className='flex gap-4 items-start'>
                      <div className='bg-[#2C3E50] rounded-lg px-3 py-2.5 text-center flex-shrink-0 min-w-[72px]'>
                        <p className='text-[#FFA641] text-[10px] font-bold'>
                          {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className='text-white text-xs font-bold mt-0.5'>
                          {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className='font-bold text-[#2C3E50] mb-1'>{session.title}</p>
                        <div className='flex flex-wrap gap-3 text-xs text-gray-400 mb-1'>
                          {session.speaker && <span>🎤 {session.speaker}</span>}
                          {session.topic && <span>📌 {session.topic}</span>}
                          {session.location && <span>📍 {session.location}</span>}
                        </div>
                        <div className='flex items-center gap-3 text-xs text-gray-300'>
                          <span className='flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            {' → '}
                            {new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {session.capacity && (
                            <span className={`flex items-center gap-1 ${isFull ? 'text-red-400' : ''}`}>
                              <Users className='w-3 h-3' />
                              {session.attendees?.length || 0}/{session.capacity}
                              {isFull && ' · Full'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRegister(session._id)}
                      disabled={isFull || registered[session._id]}
                      className={`flex-shrink-0 h-9 px-4 rounded-lg text-xs font-bold
                                flex items-center gap-1.5 transition-colors
                                ${registered[session._id]
                          ? 'bg-green-50 text-green-600 cursor-default'
                          : isFull
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FFA641] text-[#2C3E50] hover:bg-[#ffb55a]'}`}>
                      {registered[session._id]
                        ? <><CheckCircle className='w-3.5 h-3.5' /> Registered</>
                        : isFull ? 'Full' : 'Register'
                      }
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Exhibitors ── */}
          {activeTab === 'Exhibitors' && (
            <div>

              {exhibitors.length === 0 ? (
                <div className='bg-white rounded-xl border border-gray-100 py-16 text-center min-h-[650px] flex items-center justify-center mb-8'>
                  <p className='text-gray-400 text-sm'>No approved exhibitors yet.</p>
                </div>
              ) : (
                <>
                  {/* Filters */}
                  <div className='flex flex-col md:flex-row gap-3 mb-5'>

                    <div className='relative flex-1'>
                      <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />

                      <input
                        type='text'
                        placeholder='Search exhibitors...'
                        value={exhibitorSearch}
                        onChange={e => setExhibitorSearch(e.target.value)}
                        className='w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white
              text-[#2C3E50] text-sm outline-none focus:border-[#FFA641] transition-all'
                      />
                    </div>

                    <select
                      value={exhibitorCategory}
                      onChange={e => setExhibitorCategory(e.target.value)}
                      className='h-10 px-3 rounded-lg border border-gray-200 bg-white
            text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
            transition-all md:w-56'
                    >
                      <option value=''>All categories</option>

                      {exhibitorCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                  </div>

                  {/* Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8'>

                    {filteredExhibitors.map(app => (
                      <div
                        key={app._id}
                        onClick={() => navigate(`/exhibitor-detail/${app._id}`)}
                        className='bg-white rounded-xl border border-gray-100 p-5
                             hover:border-[#FFA641] transition-colors cursor-pointer'
                      >

                        <div className='flex items-center gap-3 mb-3'>
                          <div className='w-10 h-10 rounded-xl bg-[#2C3E50]
                flex items-center justify-center text-[#FFA641]
                font-bold text-sm flex-shrink-0'>
                            {app.company?.[0]?.toUpperCase()}
                          </div>

                          <div className='min-w-0'>
                            <p className='font-bold text-[#2C3E50] text-sm truncate'>
                              {app.company}
                            </p>

                            {app.boothId && (
                              <p className='text-xs text-gray-400'>
                                Booth {app.boothId.boothNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        {app.products && (
                          <p className='text-xs text-gray-400 mb-2 line-clamp-2'>
                            {app.products}
                          </p>
                        )}

                        {app.description && (
                          <p className='text-xs text-gray-300 leading-relaxed line-clamp-2'>
                            {app.description}
                          </p>
                        )}

                      </div>
                    ))}

                  </div>
                </>
              )}

            </div>
          )}

          {/* ── Floor Plan ── */}
          {activeTab === 'Floor Plan' && (
            <div className='bg-white rounded-xl border border-gray-100 p-6'>
              <FloorPlan
                expoId={id}
                mode='attendee'
                eventType={expo.type}
              />
            </div>
          )}

        </div>


      </div>


      {/* ── Footer ── */}
      <footer className='bg-[#1a2a38] px-16 pt-12 pb-6 mt-5'>
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

export default EventDetail
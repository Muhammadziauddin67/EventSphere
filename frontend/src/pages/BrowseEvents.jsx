import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, MapPin, Search, Music, Trophy, Building2, Bookmark } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getData } from '@/context/userContext'
import { toast } from 'sonner'
import { EventCardSkeleton } from '@/components/ui/Skeleton'



const categories = [
  { key: 'all', label: 'All Events', icon: Building2 },
  { key: 'expo', label: 'Expos', icon: Building2 },
  { key: 'concert', label: 'Concerts', icon: Music },
  { key: 'sports', label: 'Sports', icon: Trophy },
]

const typeColors = {
  expo: 'bg-blue-50 text-blue-600',
  concert: 'bg-purple-50 text-purple-600',
  sports: 'bg-green-50 text-green-600',
}

const BrowseEvents = () => {
  const { user } = getData()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('all')
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const [bookmarked, setBookmarked] = useState({})
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (type !== 'all') params.append('type', type)
      if (city) params.append('city', city)
      if (search) params.append('search', search)
      if (dateFilter) params.append('dateFilter', dateFilter)
      const res = await axios.get(`http://localhost:8000/attendee/expos?${params}`)
      setEvents(res.data.data)
      const uniqueCities = [...new Set(res.data.data.map(e => e.city).filter(Boolean))]
      setCities(uniqueCities)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const t = params.get('type')
    setType(t || 'all')
  }, [location.search])
  useEffect(() => {
    fetchEvents()
  }, [type, city, dateFilter])

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchEvents()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
  }

  const handleBookmark = async (e, expoId) => {
    e.stopPropagation()
    if (!user) return navigate('/login')
    try {
      const res = await axios.post(
        `http://localhost:8000/attendee/bookmarks/${expoId}`, {}, { headers })
      setBookmarked(prev => ({ ...prev, [expoId]: res.data.bookmarked }))
      toast.success(res.data.message)
    } catch (err) { toast.error('Something went wrong') }
  }

  const isSoldOut = (expo) =>
    expo.tickets?.length > 0 &&
    expo.tickets.every(t => t.sold >= t.capacity)

  const lowestPrice = (expo) => {
    if (!expo.tickets?.length) return null
    const prices = expo.tickets.map(t => t.price).filter(Boolean)
    return prices.length ? Math.min(...prices) : null
  }
  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen'>

      {/* Hero search bar */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-8 md:py-12'>
        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Discover</p>
        <h1 className='text-4xl font-bold text-white mb-6'>Find your next experience</h1>

        <div className='bg-white rounded-2xl p-4 max-w-3xl flex gap-0 overflow-hidden flex-col md:flex-row'>
          {/* Search input */}
          <div className='flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200'>
            <Search className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <input type='text' placeholder='Artists, events, teams...'
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className='w-full text-sm text-[#2C3E50] outline-none placeholder:text-gray-300' />
          </div>
          {/* City filter */}
          <div className='flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200'>
            <MapPin className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <select value={city} onChange={e => setCity(e.target.value)}
              className='text-sm text-[#2C3E50] outline-none bg-transparent cursor-pointer'>
              <option value=''>All cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Date filter */}
          <div className='flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200'>
            <CalendarDays className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <div className='flex items-center gap-2 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-200'>
              <CalendarDays className='w-4 h-4 text-gray-400 flex-shrink-0' />
              <input type='date' value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className='text-sm text-[#2C3E50] outline-none bg-transparent min-w-[110px]' />
              <span className='text-gray-300 text-xs'>→</span>
              <input type='date' value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className='text-sm text-[#2C3E50] outline-none bg-transparent min-w-[110px]' />
            </div>
          </div>

          <button onClick={fetchEvents}
            className='bg-[#FFA641] text-[#2C3E50] font-bold text-sm px-6
                       hover:bg-[#ffb55a] transition-colors'>
            Search
          </button>
        </div>
      </div>

      <div className='px-16 py-8 flex-1 min-h-screen'>
        {/* Category filters */}
        <div className='flex gap-2 mb-8 flex-wrap'>
          {categories.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setType(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm
                                font-semibold border transition-colors
                                ${type === key
                  ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#2C3E50]'}`}>
              <Icon className='w-4 h-4' />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {Array(8).fill(0).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className='bg-white rounded-xl border border-gray-100 py-20 text-center min-h-[400px] flex items-center justify-center'>
            <p className='text-gray-400'>No events found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className='text-gray-400 text-sm mb-5'>{events.length} events found</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {events.map(event => {
                const soldOut = isSoldOut(event)
                const minPrice = lowestPrice(event)
                const isBookmarked = bookmarked[event._id]

                return (
                  <div key={event._id}
                    onClick={() => navigate(`/event/${event._id}`)}
                    className='bg-white rounded-xl border border-gray-100 overflow-hidden
                                  cursor-pointer hover:border-[#FFA641] hover:-translate-y-0.5
                                  transition-all group'>
                    {/* Image area */}
                    <div className='h-40 relative overflow-hidden bg-[#2C3E50]'>
                      {event.venueImage ? (
                        <img src={event.venueImage} alt={event.title}
                          className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center opacity-20'>
                          {event.type === 'concert' && <Music className='w-20 h-20 text-white' />}
                          {event.type === 'sports' && <Trophy className='w-20 h-20 text-white' />}
                          {event.type === 'expo' && <Building2 className='w-20 h-20 text-white' />}
                          {!event.type && <Building2 className='w-20 h-20 text-white' />}
                        </div>
                      )}
                      {/* overlay gradient for readability */}
                      {event.venueImage && (
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                      )}
                      {/* badges */}
                      <span className={`absolute top-3 left-3 text-[0.65rem] font-bold
                    px-2.5 py-1 rounded-full uppercase z-10 ${typeColors[event.type]}`}>
                        {event.type}
                      </span>
                      <button onClick={e => handleBookmark(e, event._id)}
                        className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center
                      justify-center transition-colors z-10
                      ${isBookmarked ? 'bg-[#FFA641] text-[#2C3E50]' : 'bg-white/20 text-white'}`}>
                        <Bookmark className='w-3.5 h-3.5' fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      {event.artist && (
                        <p className='absolute bottom-3 left-3 text-white font-bold text-sm z-10'>{event.artist}</p>
                      )}
                      {event.team && (
                        <p className='absolute bottom-3 left-3 text-white font-bold text-sm z-10'>{event.team}</p>
                      )}
                      {soldOut && (
                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-10'>
                          <span className='bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase'>
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className='p-4'>
                      <p className='text-[#2C3E50] font-bold text-sm leading-snug mb-2 line-clamp-2'>
                        {event.title}
                      </p>
                      <div className='flex flex-col gap-1 text-xs text-gray-400 mb-3'>
                        <span className='flex items-center gap-1'>
                          <CalendarDays className='w-3 h-3' />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                        <span className='flex items-center gap-1'>
                          <MapPin className='w-3 h-3' />{event.location}{event.city ? `, ${event.city}` : ''}
                        </span>
                      </div>

                      <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                        {minPrice !== null ? (
                          <span className='text-xs text-gray-400'>
                            From <strong className='text-[#2C3E50]'>${minPrice}</strong>
                          </span>
                        ) : (
                          <span className='text-xs text-gray-300'>Free entry</span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/event/${event._id}`) }}
                          disabled={soldOut}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                            ${soldOut
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#2C3E50] text-white hover:bg-[#FFA641] hover:text-[#2C3E50]'}`}>
                          {soldOut ? 'Sold Out' : 'View →'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
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
                { label: 'Contact', path: '/contact' },
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

export default BrowseEvents
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Hero from '@/components/ui/Hero'
import {
  CalendarDays,
  MapPin,
  Music,
  Trophy,
  Building2,
  Bookmark
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'
import { getData } from '@/context/userContext'

const defaultTestimonials = [
  {
    initials: 'SR',
    name: 'Sarah Rahman',
    role: 'Conference Organizer',
    quote: 'EventSphere made managing registrations, schedules, and attendees incredibly simple.'
  },
  {
    initials: 'JK',
    name: 'James Kowalski',
    role: 'Music Event Coordinator',
    quote: 'The platform helped us streamline ticketing and audience engagement for our live events.'
  },
  {
    initials: 'AM',
    name: 'Aisha Mensah',
    role: 'Event Attendee',
    quote: 'Discovering concerts, sports events, and expos in one place feels seamless.'
  },
]
const typeColors = {
  expo: 'bg-blue-50 text-blue-600',
  concert: 'bg-purple-50 text-purple-600',
  sports: 'bg-green-50 text-green-600',
}

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState({})
  const [testimonials, setTestimonials] = useState([])
  const [events, setEvents] = useState([])

  const isSoldOut = (expo) =>
    expo.tickets?.length > 0 &&
    expo.tickets.every(t => t.sold >= t.capacity)
  
  const lowestPrice = (expo) => {
    if (!expo.tickets?.length) return null
  
    const prices = expo.tickets
      .map(t => t.price)
      .filter(Boolean)
  
    return prices.length
      ? Math.min(...prices)
      : null
  }
  const { user } = getData()

  const token = localStorage.getItem('accessToken')

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {}

    
  useEffect(() => {
    axios.get('http://localhost:8000/attendee/testimonials?page=home')
      .then(res => setTestimonials(res.data.data))
      .catch(console.log)
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)

        const res = await axios.get(
          'http://localhost:8000/attendee/expos'
        )

        setEvents(res.data.data.slice(0, 4))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
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

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <Hero />

      {/* Featured Expos */}
      <section className='bg-[#f7f6f2] py-20 px-16'>
        <div className='w-full'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Upcoming Events</p>
          <h2 className='text-3xl font-bold text-[#2C3E50] mb-2'>
            Featured Events
          </h2>
          <p className='text-gray-400 font-light mb-10'>
            Explore upcoming events, concerts, conferences, sports, and live experiences.
          </p>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {Array(8).fill(0).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className='bg-white rounded-xl border border-gray-100 py-20 text-center min-h-[400px] flex items-center justify-center'>
              <p className='text-gray-400'>No events found Happening Right now</p>
            </div>
          ) : (
            <>
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
      </section>

      {/* Testimonials */}
      <section className='bg-[#2C3E50] py-20 px-16'>
        <div className='w-full'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>What people say</p>
          <h2 className='text-3xl font-bold text-white mb-10'>Trusted by Many worldwide</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {testimonials.length > 0 ? testimonials.map(t => (
              <div key={t._id} className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <p className='text-[#FFA641] mb-3 text-sm'>★★★★★</p>
                <p className='text-white/70 text-sm mb-5'>"{t.quote}"</p>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-[#FFA641] flex items-center justify-center
                      text-[#2C3E50] font-bold text-sm flex-shrink-0'>
                    {t.userId?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className='text-white text-sm font-semibold'>{t.userId?.username}</p>
                    <p className='text-white/40 text-xs'>{t.role}</p>
                  </div>
                </div>
              </div>
            )) : (
              // fallback static testimonials if none approved yet
              defaultTestimonials.map(t => (<div key={t.name} className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <p className='text-[#FFA641] mb-3 text-sm'>★★★★★</p>
                <p className='text-white/70 text-sm mb-5'>"{t.quote}"</p>

                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-[#FFA641] flex items-center justify-center text-[#2C3E50] font-bold text-sm'>
                    {t.initials}
                  </div>

                  <div>
                    <p className='text-white text-sm font-semibold'>{t.name}</p>
                    <p className='text-white/40 text-xs'>{t.role}</p>
                  </div>
                </div>
              </div>))
            )}
          </div>
        </div>
      </section>

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

export default Home
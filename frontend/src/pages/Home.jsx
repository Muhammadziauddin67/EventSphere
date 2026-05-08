import React from 'react'
import Hero from '@/components/ui/Hero'
import { CalendarDays, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const expos = [
  { id: 1, title: 'Global Tech Expo 2025', category: 'Technology', date: 'Jun 14–16', location: 'Dubai', attendees: '4,200', badge: 'Featured' },
  { id: 2, title: 'MedWorld Trade Show', category: 'Healthcare', date: 'Jul 3–5', location: 'London', attendees: '2,850', badge: 'New' },
  { id: 3, title: 'Green Future Summit', category: 'Sustainability', date: 'Aug 20–22', location: 'Berlin', attendees: '1,600', badge: null },
  { id: 4, title: 'Couture & Commerce 2025', category: 'Fashion', date: 'Sep 8–10', location: 'Milan', attendees: '3,100', badge: 'Selling fast' },
]

const testimonials = [
  { initials: 'SR', name: 'Sarah Rahman', role: 'Lead Organizer, TechWorld Expo', quote: 'EventSphere completely transformed how we run our annual trade show. The booth management alone saved us weeks of back-and-forth.' },
  { initials: 'JK', name: 'James Kowalski', role: 'Marketing Director, NovaTech', quote: 'As an exhibitor, having a dedicated portal to manage our booth, staff, and communications in one place is exactly what we needed.' },
  { initials: 'AM', name: 'Aisha Mensah', role: 'Attendee, MedWorld 2024', quote: 'Found three incredible exhibitors at MedWorld through the platform. The search and filtering made discovery genuinely effortless.' },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <Hero />

      {/* ── Featured Expos ── */}
      <section className='bg-[#f7f6f2] py-20 px-16'>
        <div className='w-full'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Upcoming Events</p>
          <h2 className='text-3xl font-bold text-[#2C3E50] mb-2'>Featured Expos</h2>
          <p className='text-gray-400 font-light mb-10'>Discover world-class exhibitions and trade shows happening near you.</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {expos.map(expo => (
              <div key={expo.id}
                className='bg-white border border-gray-200 rounded-xl overflow-hidden
                              cursor-pointer hover:border-[#FFA641] transition-colors'>
                {/* Card image area */}
                <div className='h-32 bg-[#2C3E50] relative flex items-center justify-center'>
                  {expo.badge && (
                    <span className='absolute top-2.5 left-2.5 bg-[#FFA641] text-[#2C3E50]
                                     text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-wide'>
                      {expo.badge}
                    </span>
                  )}
                </div>
                {/* Card body */}
                <div className='p-4'>
                  <p className='text-[#FFA641] text-[0.7rem] font-bold uppercase tracking-wider mb-1'>
                    {expo.category}
                  </p>
                  <p className='text-[#2C3E50] font-semibold text-sm leading-snug mb-3'>
                    {expo.title}
                  </p>
                  <div className='flex gap-3 text-gray-400 text-xs'>
                    <span className='flex items-center gap-1'>
                      <CalendarDays className='w-3 h-3' />{expo.date}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />{expo.location}
                    </span>
                  </div>
                  <div className='flex justify-between items-center mt-3 pt-3 border-t border-gray-100'>
                    <span className='text-xs text-gray-400'>{expo.attendees} registered</span>
                    <button
                      onClick={() => navigate(`/expos/${expo.id}`)}
                      className='bg-[#2C3E50] text-white text-xs font-semibold px-3 py-1.5
                                 rounded-md hover:bg-[#FFA641] hover:text-[#2C3E50] transition-colors'>
                      View Expo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className='bg-[#2C3E50] py-20 px-16'>
        <div className='w-full'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>What people say</p>
          <h2 className='text-3xl font-bold text-white mb-10'>Trusted by organizers worldwide</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {testimonials.map(t => (
              <div key={t.name}
                className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <p className='text-[#FFA641] tracking-widest mb-3 text-sm'>★★★★★</p>
                <p className='text-white/70 text-sm leading-relaxed font-light mb-5'>"{t.quote}"</p>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-[#FFA641] flex items-center justify-center
                                  text-[#2C3E50] font-bold text-sm flex-shrink-0'>
                    {t.initials}
                  </div>
                  <div>
                    <p className='text-white text-sm font-semibold'>{t.name}</p>
                    <p className='text-white/40 text-xs'>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
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
              {['Expos', 'Exhibitors', 'Schedule', 'Analytics'].map(l => (
                <p key={l} className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>{l}</p>
              ))}
            </div>
            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>Company</p>
              {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map(l => (
                <p key={l} className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>{l}</p>
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
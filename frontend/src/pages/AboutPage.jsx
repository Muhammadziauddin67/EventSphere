import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Users, Zap, Shield } from 'lucide-react'

const AboutPage = () => {
  const navigate = useNavigate()

  const values = [
    { icon: Globe,  title: 'Global Reach',       desc: 'Connecting organizers, exhibitors and attendees across 50+ countries.' },
    { icon: Users,  title: 'Community First',     desc: 'Built around the needs of every stakeholder in the event ecosystem.' },
    { icon: Zap,    title: 'Real-time Platform',  desc: 'Live updates, instant booking confirmations and seamless communication.' },
    { icon: Shield, title: 'Secure & Reliable',   desc: '99.9% uptime with enterprise-grade security protecting every transaction.' },
  ]

  const team = [
    { initials: 'ZA', name: 'Zia Aziz',     role: 'Founder & CEO'        },
    { initials: 'SR', name: 'Sara Raza',      role: 'Head of Product'      },
    { initials: 'AK', name: 'Ahmed Khan',     role: 'Lead Engineer'        },
    { initials: 'FM', name: 'Fatima Malik',   role: 'Head of Partnerships' },
  ]

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen'>

      {/* Hero */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-20 text-center relative overflow-hidden'>
        <div className='absolute inset-0 opacity-5 flex items-center justify-center'>
          <svg width="600" height="400" viewBox="0 0 600 400" fill="none">
            <circle cx="300" cy="200" r="180" stroke="white" strokeWidth="1.5"/>
            <ellipse cx="300" cy="200" rx="80" ry="180" stroke="white" strokeWidth="1"/>
            <line x1="20" y1="200" x2="580" y2="200" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
        <span className='inline-block text-[#FFA641] text-xs font-bold tracking-widest
                         uppercase mb-4'>About EventSphere</span>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-5 relative'>
          The world's leading<br />expo management platform
        </h1>
        <p className='text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed'>
          EventSphere was built to solve the chaos of managing large-scale expos and trade shows.
          From booth allocation to real-time attendee engagement — we handle it all.
        </p>
      </div>

      {/* Stats */}
      <div className='bg-white border-b border-gray-100 px-4 md:px-16 py-10'>
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {[
            ['240+', 'Expos hosted'],
            ['12,000+', 'Exhibitors'],
            ['500,000+', 'Attendees'],
            ['50+', 'Countries'],
          ].map(([num, lbl]) => (
            <div key={lbl}>
              <p className='text-3xl font-bold text-[#FFA641] mb-1'>{num}</p>
              <p className='text-gray-400 text-sm'>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className='px-4 md:px-16 py-16'>
        <div className='max-w-3xl mx-auto text-center'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-3'>Our Mission</p>
          <h2 className='text-3xl font-bold text-[#2C3E50] mb-5'>
            Making every expo experience unforgettable
          </h2>
          <p className='text-gray-500 leading-relaxed'>
            We believe that great events change industries, build communities, and spark innovations.
            EventSphere exists to remove every friction point between an organizer's vision and its
            execution — so the focus stays on what matters: the experience.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className='bg-white px-4 md:px-16 py-16'>
        <div className='max-w-5xl mx-auto'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-3 text-center'>
            What we stand for
          </p>
          <h2 className='text-3xl font-bold text-[#2C3E50] mb-10 text-center'>Our values</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className='text-center'>
                <div className='w-14 h-14 rounded-2xl bg-[#2C3E50] flex items-center
                                justify-center mx-auto mb-4'>
                  <Icon className='w-6 h-6 text-[#FFA641]' />
                </div>
                <h3 className='font-bold text-[#2C3E50] mb-2'>{title}</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className='px-4 md:px-16 py-16'>
        <div className='max-w-4xl mx-auto'>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-3 text-center'>
            The people behind EventSphere
          </p>
          <h2 className='text-3xl font-bold text-[#2C3E50] mb-10 text-center'>Meet the team</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {team.map(({ initials, name, role }) => (
              <div key={name} className='text-center'>
                <div className='w-16 h-16 rounded-full bg-[#2C3E50] flex items-center
                                justify-center text-[#FFA641] font-bold text-xl mx-auto mb-3'>
                  {initials}
                </div>
                <p className='font-bold text-[#2C3E50] text-sm'>{name}</p>
                <p className='text-gray-400 text-xs mt-0.5'>{role}</p>
              </div>
            ))}
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

export default AboutPage
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'

const posts = [
  {
    id: 1,
    category: 'Industry News',
    title: 'The Future of Expo Management: AI and Real-Time Analytics',
    excerpt: 'How artificial intelligence is transforming the way organizers manage large-scale trade shows and expos in 2025.',
    date: 'May 8, 2025',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    category: 'Tips & Tricks',
    title: '10 Ways to Maximize Your Exhibitor Booth ROI',
    excerpt: 'Expert strategies for exhibitors looking to generate more leads and close more deals at their next expo.',
    date: 'May 3, 2025',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 3,
    category: 'Event Spotlight',
    title: 'Inside Global Tech Expo 2025: What to Expect',
    excerpt: 'A preview of the biggest tech expo of the year — sessions, exhibitors, and exclusive announcements.',
    date: 'Apr 28, 2025',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 4,
    category: 'Sports',
    title: 'How Stadium Events Are Evolving with Digital Ticketing',
    excerpt: 'From mobile tickets to real-time seat selection, the stadium experience has never been smarter.',
    date: 'Apr 22, 2025',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 5,
    category: 'Concerts',
    title: 'Artist Spotlight: The Rise of Hybrid Concert Events',
    excerpt: 'How artists and event organizers are combining in-person and virtual experiences for global audiences.',
    date: 'Apr 15, 2025',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 6,
    category: 'Platform Updates',
    title: 'New Feature: Interactive Floor Plans for All Events',
    excerpt: 'EventSphere now supports fully interactive, colour-coded venue maps for every event type.',
    date: 'Apr 10, 2025',
    readTime: '3 min read',
    featured: false,
  },
]

const categoryColors = {
  'Industry News':    'bg-blue-50 text-blue-600',
  'Tips & Tricks':    'bg-purple-50 text-purple-600',
  'Event Spotlight':  'bg-amber-50 text-amber-600',
  'Sports':           'bg-green-50 text-green-600',
  'Concerts':         'bg-pink-50 text-pink-600',
  'Platform Updates': 'bg-orange-50 text-orange-600',
}

const BlogPage = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...new Set(posts.map(p => p.category))]

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const featured = posts.find(p => p.featured)
  const rest     = filtered.filter(p => !p.featured || activeCategory !== 'All')

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen'>

      {/* Hero */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-16'>
        <span className='text-[#FFA641] text-xs font-bold tracking-widest uppercase'>
          EventSphere Blog
        </span>
        <h1 className='text-4xl font-bold text-white mt-2 mb-3'>
          News, insights & event highlights
        </h1>
        <p className='text-white/60 text-lg font-light max-w-xl'>
          Stay up to date with the latest in expo management, concerts, sports events, and platform updates.
        </p>
      </div>

      <div className='px-4 md:px-16 py-10'>

        {/* Featured post */}
        {activeCategory === 'All' && featured && (
          <div className='bg-[#2C3E50] rounded-2xl p-8 mb-10 cursor-pointer
                          hover:opacity-95 transition-opacity relative overflow-hidden'>
            <div className='absolute right-0 top-0 bottom-0 w-64 opacity-5 flex items-center'>
              <svg viewBox="0 0 300 300" fill="none" className='w-full h-full'>
                <circle cx="150" cy="150" r="140" stroke="white" strokeWidth="2"/>
                <ellipse cx="150" cy="150" rx="60" ry="140" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4
                             ${categoryColors[featured.category]}`}>
              {featured.category}
            </span>
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl'>
              {featured.title}
            </h2>
            <p className='text-white/60 mb-5 max-w-xl leading-relaxed'>{featured.excerpt}</p>
            <div className='flex items-center gap-4 text-white/40 text-xs'>
              <span className='flex items-center gap-1'>
                <CalendarDays className='w-3 h-3' />{featured.date}
              </span>
              <span>{featured.readTime}</span>
              <span className='text-[#FFA641] font-semibold flex items-center gap-1'>
                Read more <ArrowRight className='w-3 h-3' />
              </span>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className='flex gap-2 mb-8 flex-wrap'>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold
                                border transition-colors
                                ${activeCategory === cat
                                  ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#2C3E50]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {rest.map(post => (
            <div key={post.id}
                 className='bg-white rounded-xl border border-gray-100 p-6
                            cursor-pointer hover:border-[#FFA641] transition-colors'>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4
                               ${categoryColors[post.category]}`}>
                {post.category}
              </span>
              <h3 className='font-bold text-[#2C3E50] text-base leading-snug mb-3'>
                {post.title}
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3'>
                {post.excerpt}
              </p>
              <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                <div className='flex items-center gap-3 text-xs text-gray-300'>
                  <span className='flex items-center gap-1'>
                    <CalendarDays className='w-3 h-3' />{post.date}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <span className='text-xs text-[#FFA641] font-semibold
                                 flex items-center gap-1 hover:underline'>
                  Read <ArrowRight className='w-3 h-3' />
                </span>
              </div>
            </div>
          ))}
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

export default BlogPage
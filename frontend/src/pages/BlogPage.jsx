import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ArrowRight, MapPin } from 'lucide-react'

const staticPosts = [
  {
    id: 1,
    category: 'Industry News',
    title: 'The Future of Expo Management: AI and Real-Time Analytics',
    excerpt:
      'How artificial intelligence is transforming the way organizers manage large-scale trade shows and expos in 2025.',
    date: 'May 8, 2025',
    readTime: '5 min read',
    featured: true,
    link: '#',
  },
  {
    id: 2,
    category: 'Tips & Tricks',
    title: '10 Ways to Maximize Your Exhibitor Booth ROI',
    excerpt:
      'Expert strategies for exhibitors looking to generate more leads and close more deals at their next expo.',
    date: 'May 3, 2025',
    readTime: '7 min read',
    featured: false,
    link: '#',
  },
  {
    id: 3,
    category: 'Event Spotlight',
    title: 'Inside Global Tech Expo 2025: What to Expect',
    excerpt:
      'A preview of the biggest tech expo of the year — sessions, exhibitors, and exclusive announcements.',
    date: 'Apr 28, 2025',
    readTime: '4 min read',
    featured: false,
    link: '#',
  },
]

const categoryColors = {
  'Industry News': 'bg-blue-50 text-blue-600',
  'Tips & Tricks': 'bg-purple-50 text-purple-600',
  'Event Spotlight': 'bg-amber-50 text-amber-600',
  Sports: 'bg-green-50 text-green-600',
  Concerts: 'bg-pink-50 text-pink-600',
  'Platform Updates': 'bg-orange-50 text-orange-600',
}

const rssFeeds = [
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/sport/rss.xml',
    category: 'Sports',
  },
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.billboard.com/feed/',
    category: 'Concerts',
  },
  {
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/',
    category: 'Industry News',
  },
]

const BlogPage = () => {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [posts, setPosts] = useState(staticPosts)
  const [activeCategory, setActiveCategory] = useState('All')
  const [loadingBlogs, setLoadingBlogs] = useState(true)

  // Categories
  const categories = ['All', ...new Set(posts.map(p => p.category))]

  // Filtered blogs
  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter(p => p.category === activeCategory)

  const featured = posts.find(p => p.featured)
  const rest = filtered.filter(
    p => !p.featured || activeCategory !== 'All'
  )

  // Fetch expos
  useEffect(() => {
    axios
      .get('http://localhost:8000/attendee/expos')
      .then(res => setEvents(res.data.data.slice(0, 4)))
      .catch(console.log)
  }, [])

  // Fetch blogs from public RSS APIs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const responses = await Promise.allSettled(
          rssFeeds.map(feed => axios.get(feed.url))
        )

        let dynamicBlogs = []

        responses.forEach((result, index) => {
          // skip failed APIs
          if (result.status !== 'fulfilled') {
            console.log(
              `${rssFeeds[index].category} feed failed`
            )
            return
          }

          const response = result.value

          const items = response.data.items?.slice(0, 4) || []

          const formatted = items.map((item, i) => {
            let image = ''

            // 1. thumbnail
            if (item.thumbnail) {
              image = item.thumbnail
            }

            // 2. enclosure
            else if (
              item.enclosure &&
              item.enclosure.link &&
              item.enclosure.type?.includes('image')
            ) {
              image = item.enclosure.link
            }

            // 3. extract first image from HTML description
            else if (item.description) {
              const match = item.description.match(
                /<img[^>]+src=["']([^"']+)["']/i
              )

              if (match && match[1]) {
                image = match[1]
              }
            }

            // 4. fallback image by category
            if (!image) {
              if (rssFeeds[index].category === 'Concerts') {
                image =
                  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop'
              } else if (rssFeeds[index].category === 'Industry News') {
                image =
                  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop'
              } else {
                image =
                  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop'
              }
            }

            return {
              id: `${index}-${i}`,
              category: rssFeeds[index].category,
              title: item.title,
              excerpt:
                item.description
                  ?.replace(/<[^>]*>/g, '')
                  ?.slice(0, 140) + '...',
              date: new Date(item.pubDate).toLocaleDateString(),
              readTime: '5 min read',
              featured: dynamicBlogs.length === 0 && i === 0,
              link: item.link,
              image,
            }
          })

          dynamicBlogs = [...dynamicBlogs, ...formatted]
        })

        // fallback
        if (dynamicBlogs.length > 0) {
          setPosts(dynamicBlogs)
        } else {
          setPosts(staticPosts)
        }
      } catch (error) {
        console.log('RSS Fetch Failed:', error)
        setPosts(staticPosts)
      } finally {
        setLoadingBlogs(false)
      }
    }

    fetchBlogs()
  }, [])
  return (
    <div
      style={{ fontFamily: "'Jost', sans-serif" }}
      className='bg-[#f7f6f2] min-h-screen'
    >
      {/* Hero */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-16'>
        <span className='text-[#FFA641] text-xs font-bold tracking-widest uppercase'>
          EventSphere Blog
        </span>

        <h1 className='text-4xl font-bold text-white mt-2 mb-3'>
          News, insights & event highlights
        </h1>

        <p className='text-white/60 text-lg font-light max-w-xl'>
          Stay up to date with the latest in expo management, concerts,
          sports events, and platform updates.
        </p>
      </div>

      <div className='px-4 md:px-16 py-10'>
        {/* Featured */}
        {activeCategory === 'All' && featured && (
          <a
            href={featured.link}
            target='_blank'
            rel='noopener noreferrer'
            className='block bg-[#2C3E50] rounded-2xl p-8 mb-10 cursor-pointer
            hover:opacity-95 transition-opacity relative overflow-hidden'
          >
            <div className='absolute right-0 top-0 bottom-0 w-64 opacity-5 flex items-center'>
              <svg
                viewBox='0 0 300 300'
                fill='none'
                className='w-full h-full'
              >
                <circle
                  cx='150'
                  cy='150'
                  r='140'
                  stroke='white'
                  strokeWidth='2'
                />
                <ellipse
                  cx='150'
                  cy='150'
                  rx='60'
                  ry='140'
                  stroke='white'
                  strokeWidth='1.5'
                />
              </svg>
            </div>

            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4
              ${categoryColors[featured.category]}`}
            >
              {featured.category}
            </span>

            <h2 className='text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl'>
              {featured.title}
            </h2>

            <p className='text-white/60 mb-5 max-w-xl leading-relaxed'>
              {featured.excerpt}
            </p>

            <div className='flex items-center gap-4 text-white/40 text-xs'>
              <span className='flex items-center gap-1'>
                <CalendarDays className='w-3 h-3' />
                {featured.date}
              </span>

              <span>{featured.readTime}</span>

              <span className='text-[#FFA641] font-semibold flex items-center gap-1'>
                Read more <ArrowRight className='w-3 h-3' />
              </span>
            </div>
          </a>
        )}

        {/* Categories */}
        <div className='flex gap-2 mb-8 flex-wrap'>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold
              border transition-colors
              ${activeCategory === cat
                  ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#2C3E50]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loadingBlogs && (
          <p className='text-gray-400 text-sm mb-6'>
            Loading latest blogs...
          </p>
        )}

        {/* Blog Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {rest.map(post => (
            <a
              key={post.id}
              href={post.link}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-white rounded-xl border border-gray-100 overflow-hidden
      cursor-pointer hover:border-[#FFA641] transition-colors group'
            >
              {/* IMAGE */}
              <div className='h-52 overflow-hidden bg-gray-100'>
                <img
                  src={post.image}
                  alt={post.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  loading='lazy'
                  onError={e => {
                    e.currentTarget.src =
                      'https://placehold.co/600x400/2C3E50/FFA641?text=EventSphere'
                  }}
                />
              </div>

              <div className='p-6'>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4
          ${categoryColors[post.category]}`}
                >
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
                      <CalendarDays className='w-3 h-3' />
                      {post.date}
                    </span>

                    <span>{post.readTime}</span>
                  </div>

                  <span
                    className='text-xs text-[#FFA641] font-semibold
            flex items-center gap-1 hover:underline'
                  >
                    Read <ArrowRight className='w-3 h-3' />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Expos */}
      <section className='bg-[#f7f6f2] py-20 px-16'>
        <div className='w-full'>

          <div className='bg-[#2C3E50] rounded-2xl p-8 mb-10 relative overflow-hidden'>
            <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>
              Upcoming Events
            </p>

            <h2 className='text-3xl font-bold text-white mb-2'>
              Featured Events
            </h2>

            <p className='text-gray-400 font-light'>
              Discover world-class exhibitions and trade shows happening right now
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {events.map(expo => {
              const typeColors = {
                expo: 'bg-blue-50 text-blue-600',
                concert: 'bg-purple-50 text-purple-600',
                sports: 'bg-green-50 text-green-600',
              }

              return (
                <div
                  key={expo._id}
                  onClick={() => navigate(`/event/${expo._id}`)}
                  className='bg-white rounded-xl border border-gray-100 overflow-hidden
            cursor-pointer hover:border-[#FFA641] hover:-translate-y-0.5 transition-all group'
                >
                  {/* IMAGE */}
                  <div className='h-36 bg-[#2C3E50] relative overflow-hidden'>
                    {expo.venueImage ? (
                      <img
                        src={expo.venueImage}
                        alt={expo.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center opacity-20 text-white'>
                        <MapPin className='w-10 h-10' />
                      </div>
                    )}

                    {/* TYPE BADGE */}
                    <span className={`absolute top-3 left-3 text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase
                ${typeColors[expo.type] || 'bg-gray-100 text-gray-600'}`}>
                      {expo.type || 'event'}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className='p-4'>
                    <p className='text-[#2C3E50] font-semibold text-sm mb-2 line-clamp-2'>
                      {expo.title}
                    </p>

                    <div className='flex items-center gap-2 text-xs text-gray-400 mb-3'>
                      <CalendarDays className='w-3 h-3' />
                      {new Date(expo.date).toLocaleDateString()}
                    </div>

                    <div className='flex items-center gap-2 text-xs text-gray-400'>
                      <MapPin className='w-3 h-3' />
                      {expo.location}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/event/${expo._id}`)
                      }}
                      className='mt-4 w-full bg-[#2C3E50] text-white text-xs font-semibold py-2 rounded-md
                hover:bg-[#FFA641] hover:text-[#2C3E50] transition-colors'
                    >
                      View Event
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>
                Platform
              </p>

              {[
                { label: 'Expos', path: '/events?type=expo' },
                { label: 'Concerts', path: '/events?type=concert' },
                { label: 'Sports', path: '/events?type=sports' },
                { label: 'Browse All', path: '/events' },
              ].map(l => (
                <p
                  key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'
                >
                  {l.label}
                </p>
              ))}
            </div>

            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>
                Company
              </p>

              {[
                { label: 'About', path: '/about' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/feedback' },
                { label: 'Privacy Policy', path: '/privacy' },
              ].map(l => (
                <p
                  key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'
                >
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
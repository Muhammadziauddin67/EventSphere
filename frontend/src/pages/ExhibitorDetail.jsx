import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

const ExhibitorDetail = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost:8000/attendee/exhibitors/${applicationId}`)
      .then(res => setData(res.data.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [applicationId])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#f7f6f2]'>
        <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (!data) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#f7f6f2]'>
        <p className='text-gray-400 text-lg'>Exhibitor not found.</p>
      </div>
    )
  }

  const { company, description, products, profile } = data

  const productList =
    profile?.products?.length > 0
      ? profile.products
      : products?.split(',') || []

  return (
    <div
      style={{ fontFamily: "'Jost', sans-serif" }}
      className='bg-[#f7f6f2] min-h-screen flex flex-col'
    >
      {/* Top Section */}
      <div className='flex-1 px-4 md:px-10 lg:px-20 py-6 md:py-10'>
        <div className='max-w-7xl mx-auto'>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 bg-[#FFA641] text-[#2C3E50]
             px-4 py-2 rounded-full text-sm font-semibold
             shadow-sm hover:bg-black hover:text-[#FFA641]
             transition-colors mb-3'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </button>

          {/* Header */}
          <div
            className='bg-[#2C3E50] rounded-3xl p-6 md:p-10 mb-8
                       flex flex-col md:flex-row md:items-center gap-6'
          >
            {profile?.logo ? (
              <img
                src={profile.logo}
                alt='Logo'
                className='w-24 h-24 rounded-2xl object-cover border border-white/10'
              />
            ) : (
              <div
                className='w-24 h-24 rounded-2xl bg-[#FFA641]
                           flex items-center justify-center
                           text-[#2C3E50] font-bold text-4xl'
              >
                {company?.[0]?.toUpperCase()}
              </div>
            )}

            <div className='flex-1'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
                {company}
              </h1>

              {data.boothId && (
                <span
                  className='inline-flex items-center
                             text-sm bg-[#FFA641]/20 text-[#FFA641]
                             font-semibold px-4 py-2 rounded-full'
                >
                  Booth {data.boothId.boothNumber}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Side */}
            <div className='lg:col-span-2 space-y-6'>
              {/* About */}
              <div className='bg-white rounded-2xl border border-gray-100 p-7 shadow-sm'>
                <h3 className='text-xl font-bold text-[#2C3E50] mb-4'>
                  About
                </h3>

                <p className='text-gray-600 leading-8 text-[15px]'>
                  {profile?.description ||
                    description ||
                    'No description provided.'}
                </p>
              </div>

              {/* Products */}
              {productList.length > 0 && (
                <div className='bg-white rounded-2xl border border-gray-100 p-7 shadow-sm'>
                  <h3 className='text-xl font-bold text-[#2C3E50] mb-5'>
                    Products & Services
                  </h3>

                  <div className='flex flex-wrap gap-3'>
                    {productList.map((p, i) => (
                      <span
                        key={i}
                        className='bg-[#2C3E50]/10 text-[#2C3E50]
                                   px-4 py-2 rounded-full
                                   text-sm font-semibold'
                      >
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className='space-y-6'>
              {/* Contact */}
              <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                <h3 className='text-lg font-bold text-[#2C3E50] mb-5'>
                  Contact Information
                </h3>

                {[
                  {
                    icon: Globe,
                    value: profile?.website,
                    label: 'Website'
                  },
                  {
                    icon: Phone,
                    value: profile?.contactInfo?.phone,
                    label: 'Phone'
                  },
                  {
                    icon: MapPin,
                    value: profile?.contactInfo?.address,
                    label: 'Address'
                  },
                  {
                    icon: Mail,
                    value: data.exhibitorId?.email,
                    label: 'Email'
                  }
                ]
                  .filter(item => item.value)
                  .map(({ icon: Icon, value, label }) => (
                    <div
                      key={label}
                      className='flex gap-4 py-4 border-b border-gray-100 last:border-b-0'
                    >
                      <div
                        className='w-10 h-10 rounded-xl bg-[#2C3E50]/5
                                   flex items-center justify-center flex-shrink-0'
                      >
                        <Icon className='w-4 h-4 text-[#2C3E50]' />
                      </div>

                      <div className='min-w-0'>
                        <p className='text-xs text-gray-400 mb-1'>{label}</p>

                        {label === 'Website' ? (
                          <a
                            href={
                              value.startsWith('http')
                                ? value
                                : `https://${value}`
                            }
                            target='_blank'
                            rel='noreferrer'
                            className='text-sm font-medium text-[#2C3E50]
                                       break-all hover:text-[#FFA641]'
                          >
                            {value}
                          </a>
                        ) : (
                          <p className='text-sm font-medium text-[#2C3E50] break-words'>
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                {![
                  profile?.website,
                  profile?.contactInfo?.phone,
                  profile?.contactInfo?.address
                ].some(Boolean) && (
                    <p className='text-sm text-gray-400'>
                      No contact info provided.
                    </p>
                  )}
              </div>

              {/* Event */}
              <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
                <h3 className='text-lg font-bold text-[#2C3E50] mb-4'>
                  Event Information
                </h3>

                <p className='text-lg font-semibold text-[#2C3E50]'>
                  {data.expoId?.title}
                </p>

                <div className='mt-3 space-y-2 text-sm text-gray-500'>
                  <p>{data.expoId?.location}</p>

                  <p>
                    {data.expoId?.date
                      ? new Date(data.expoId.date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }
                      )
                      : '—'}
                  </p>
                </div>
              </div>
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

export default ExhibitorDetail
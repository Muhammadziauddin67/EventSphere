import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Globe, Phone, Mail } from 'lucide-react'

const ExhibitorDetail = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:8000/attendee/exhibitors/${applicationId}`)
      .then(res => setData(res.data.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [applicationId])

  if (loading) return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  if (!data) return <div className='text-center py-32 text-gray-400'>Exhibitor not found.</div>

  const { company, description, products, profile } = data

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='bg-[#f7f6f2] min-h-screen px-4 md:px-16 py-12'>
      <button onClick={() => navigate(-1)}
              className='flex items-center gap-2 text-gray-400 hover:text-[#2C3E50]
                         text-sm mb-6 transition-colors'>
        <ArrowLeft className='w-4 h-4' /> Back
      </button>

      <div className='max-w-3xl'>
        {/* Header */}
        <div className='bg-[#2C3E50] rounded-2xl p-8 mb-6 flex items-center gap-6'>
          {profile?.logo ? (
            <img src={profile.logo} alt='Logo'
                 className='w-20 h-20 rounded-xl object-cover flex-shrink-0' />
          ) : (
            <div className='w-20 h-20 rounded-xl bg-[#FFA641] flex items-center
                            justify-center text-[#2C3E50] font-bold text-3xl flex-shrink-0'>
              {company?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className='text-2xl font-bold text-white mb-1'>{company}</h1>
            {data.boothId && (
              <span className='text-xs bg-[#FFA641]/20 text-[#FFA641] font-bold
                               px-3 py-1 rounded-full'>
                Booth {data.boothId.boothNumber}
              </span>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {/* Main info */}
          <div className='md:col-span-2 space-y-5'>
            <div className='bg-white rounded-xl border border-gray-100 p-6'>
              <h3 className='font-bold text-[#2C3E50] mb-3'>About</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                {profile?.description || description || 'No description provided.'}
              </p>
            </div>

            {(profile?.products?.length > 0 || products) && (
              <div className='bg-white rounded-xl border border-gray-100 p-6'>
                <h3 className='font-bold text-[#2C3E50] mb-3'>Products & Services</h3>
                <div className='flex flex-wrap gap-2'>
                  {(profile?.products?.length > 0
                    ? profile.products
                    : products?.split(',') || []
                  ).map((p, i) => (
                    <span key={i} className='text-xs bg-[#2C3E50]/10 text-[#2C3E50]
                                             font-semibold px-3 py-1 rounded-full'>
                      {p.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <div className='bg-white rounded-xl border border-gray-100 p-5'>
              <h3 className='font-bold text-[#2C3E50] mb-4 text-sm'>Contact Info</h3>
              {[
                { icon: Globe,  value: profile?.website,             label: 'Website'  },
                { icon: Phone,  value: profile?.contactInfo?.phone,  label: 'Phone'    },
                { icon: MapPin, value: profile?.contactInfo?.address,label: 'Address'  },
                { icon: Mail,   value: data.exhibitorId?.email,      label: 'Email'    },
              ].filter(i => i.value).map(({ icon: Icon, value, label }) => (
                <div key={label} className='flex gap-3 py-2 border-b border-gray-50 last:border-0'>
                  <Icon className='w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-xs text-gray-400'>{label}</p>
                    <p className='text-sm text-[#2C3E50] font-medium'>{value}</p>
                  </div>
                </div>
              ))}
              {![profile?.website, profile?.contactInfo?.phone, profile?.contactInfo?.address].some(Boolean) && (
                <p className='text-gray-300 text-xs'>No contact info provided.</p>
              )}
            </div>

            <div className='bg-white rounded-xl border border-gray-100 p-5'>
              <h3 className='font-bold text-[#2C3E50] mb-3 text-sm'>Event</h3>
              <p className='text-sm font-semibold text-[#2C3E50]'>{data.expoId?.title}</p>
              <p className='text-xs text-gray-400 mt-1'>{data.expoId?.location}</p>
              <p className='text-xs text-gray-400'>
                {data.expoId?.date
                  ? new Date(data.expoId.date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExhibitorDetail
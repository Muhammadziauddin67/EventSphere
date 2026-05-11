import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, MapPin, Bookmark, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading,   setLoading]   = useState(true)
  const navigate = useNavigate()
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/attendee/bookmarks', { headers })
      setBookmarks(res.data.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookmarks() }, [])

  const handleRemove = async (e, expoId) => {
    e.stopPropagation()
    try {
      await axios.post(`http://localhost:8000/attendee/bookmarks/${expoId}`, {}, { headers })
      toast.success('Bookmark removed')
      setBookmarks(prev => prev.filter(b => b.expoId?._id !== expoId))
    } catch (err) { toast.error('Something went wrong') }
  }

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='bg-[#f7f6f2] min-h-screen px-16 py-12'>
      <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>My Account</p>
      <h1 className='text-3xl font-bold text-[#2C3E50] mb-1'>Bookmarks</h1>
      <p className='text-gray-400 text-sm mb-8'>Events you've saved for later.</p>

      {bookmarks.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-20 text-center'>
          <Bookmark className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm mb-3'>No bookmarks yet.</p>
          <button onClick={() => navigate('/events')}
                  className='text-xs bg-[#FFA641] text-[#2C3E50] font-bold px-5 py-2
                             rounded-lg hover:bg-[#ffb55a] transition-colors'>
            Browse Events
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {bookmarks.map(({ expoId: expo }) => (
            expo && (
              <div key={expo._id}
                   onClick={() => navigate(`/event/${expo._id}`)}
                   className='bg-white rounded-xl border border-gray-100 overflow-hidden
                              cursor-pointer hover:border-[#FFA641] transition-colors group'>
                <div className='h-32 bg-[#2C3E50] relative flex items-center justify-center'>
                  <p className='text-white font-bold text-sm px-4 text-center'>{expo.title}</p>
                  <button
                    onClick={e => handleRemove(e, expo._id)}
                    className='absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-red-500
                               rounded-full flex items-center justify-center text-white
                               transition-colors'>
                    <Trash2 className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='p-4'>
                  <div className='flex flex-col gap-1 text-xs text-gray-400 mb-3'>
                    <span className='flex items-center gap-1'>
                      <CalendarDays className='w-3 h-3' />
                      {new Date(expo.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />{expo.location}
                    </span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/event/${expo._id}`) }}
                    className='w-full h-8 bg-[#2C3E50] text-white text-xs font-bold
                               rounded-lg hover:bg-[#FFA641] hover:text-[#2C3E50] transition-colors'>
                    View Event
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookmarks
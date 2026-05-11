import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }
  const [cancelling, setCancelling] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:8000/attendee/my-tickets', { headers })
        setTickets(res.data.data)
      } catch (e) { console.log(e) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])
  const handleCancel = async (ticketId) => {
    try {
      setCancelling(ticketId)
  
      await axios.put(
        `http://localhost:8000/attendee/tickets/${ticketId}/cancel`,
        {},
        { headers }
      )
  
      toast.success('Booking cancelled')
  
      setTickets(prev => prev.filter(t => t._id !== ticketId))
  
      setConfirmCancel(null)
    } catch (e) {
      console.log(e.response?.data)
      toast.error(e.response?.data?.message || 'Failed to cancel')
    } finally {
      setCancelling(null)
    }
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
      <h1 className='text-3xl font-bold text-[#2C3E50] mb-1'>My Tickets</h1>
      <p className='text-gray-400 text-sm mb-8'>All your booked tickets in one place.</p>

      {tickets.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-100 py-20 text-center'>
          <Ticket className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm mb-3'>No tickets booked yet.</p>
          <button onClick={() => navigate('/events')}
            className='text-xs bg-[#FFA641] text-[#2C3E50] font-bold px-5 py-2
                             rounded-lg hover:bg-[#ffb55a] transition-colors'>
            Browse Events
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {tickets.map(ticket => (
            <div key={ticket._id} className='bg-[#2C3E50] rounded-xl px-5 py-4 flex-shrink-0 sm:min-w-[120px] flex sm:flex-col items-center justify-center text-center gap-3 sm:gap-0'>
              {/* Ticket stub design */}
              <div className='bg-[#2C3E50] rounded-xl px-5 py-4 flex-shrink-0 min-w-[120px]
                              flex flex-col items-center justify-center text-center'>
                <p className='text-[#FFA641] text-xs font-bold uppercase tracking-wider mb-1'>
                  {ticket.tierName}
                </p>
                <p className='text-white text-xl font-bold'>${ticket.price}</p>
                <p className='text-white/40 text-xs mt-1'>
                  {ticket.quantity > 1 ? `× ${ticket.quantity}` : '1 ticket'}
                </p>
              </div>

              <div className='flex-1'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-bold text-[#2C3E50] text-base mb-1'>
                      {ticket.expoId?.title}
                    </p>
                    <div className='flex flex-col gap-1 text-xs text-gray-400 mb-3'>
                      <span className='flex items-center gap-1'>
                        <CalendarDays className='w-3 h-3' />
                        {ticket.expoId?.date
                          ? new Date(ticket.expoId.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
                          })
                          : '—'}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3' />{ticket.expoId?.location}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full
                    ${ticket.status === 'confirmed'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-500'}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                  <div>
                    <p className='text-xs text-gray-400'>Booking reference</p>
                    <p className='text-xs font-mono font-bold text-[#2C3E50]'>{ticket.bookingRef}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/event/${ticket.expoId?._id}`)}
                    className='text-xs text-[#FFA641] font-semibold hover:underline'>
                    View Event →
                  </button>
                </div>
                {ticket.status === 'confirmed' && (
                  <>
                    {confirmCancel === ticket._id ? (
                      <div className='mt-3 pt-3 border-t border-gray-100 flex items-center gap-3'>
                        <p className='text-xs text-red-500 flex-1'>Cancel this booking?</p>
                        <button onClick={() => setConfirmCancel(null)}
                          className='text-xs text-gray-400 font-semibold px-3 py-1.5
                           border border-gray-200 rounded-lg hover:bg-gray-50'>
                          Keep it
                        </button>
                        <button onClick={() => handleCancel(ticket._id)}
                          disabled={cancelling === ticket._id}
                          className='text-xs text-red-500 font-semibold px-3 py-1.5
                           border border-red-200 rounded-lg hover:bg-red-50 transition-colors'>
                          {cancelling === ticket._id ? 'Cancelling...' : 'Yes, cancel'}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmCancel(ticket._id)}
                        className='mt-3 text-xs text-red-400 hover:text-red-600 font-semibold
                         hover:underline transition-colors'>
                        Cancel booking
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTickets
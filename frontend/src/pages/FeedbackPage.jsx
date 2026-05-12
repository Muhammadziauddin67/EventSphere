import React, { useState } from 'react'
import axios from 'axios'
import { Loader2, CheckCircle, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { getData } from '@/context/userContext'

const FeedbackPage = () => {
  const { user } = getData()
  const navigate = useNavigate()
  const [form, setForm] = useState({ type: 'general', message: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tForm, setTForm] = useState({ quote: '', rating: 5, showOn: 'home' })
  const [tLoading, setTLoading] = useState(false)
  const [tSubmitted, setTSubmitted] = useState(false)
  const token = localStorage.getItem('accessToken')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const handleSubmit = async () => {
    if (!form.message.trim()) return toast.error('Please enter a message')
    if (!user && !form.email) return toast.error('Please enter your email')
    try {
      setLoading(true)
      await axios.post('http://localhost:8000/attendee/feedback', form, { headers })
      setSubmitted(true)
    } catch (e) {
      toast.error('Something went wrong')
    } finally { setLoading(false) }
  }

  const inputClass = `w-full px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all placeholder:text-gray-300`

  if (submitted) return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
      className='min-h-screen bg-[#f7f6f2] flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl p-12 text-center max-w-md w-full'>
        <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center
                        justify-center mx-auto mb-5'>
          <CheckCircle className='w-8 h-8 text-[#FFA641]' />
        </div>
        <h2 className='text-2xl font-bold text-[#2C3E50] mb-2'>Thank you!</h2>
        <p className='text-gray-400 text-sm mb-6'>
          Your feedback has been submitted. We'll review it and get back to you if needed.
        </p>
        <div className='flex gap-3 justify-center'>
          <button onClick={() => setSubmitted(false)}
            className='border border-gray-200 text-gray-500 font-semibold
                             px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors'>
            Submit another
          </button>
          <button onClick={() => navigate('/')}
            className='bg-[#FFA641] text-[#2C3E50] font-bold px-5 py-2
                             rounded-lg text-sm hover:bg-[#ffb55a] transition-colors'>
            Go home
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
      className='min-h-screen bg-[#f7f6f2]'>
      {/* Hero */}
      <div className='bg-[#2C3E50] px-4 md:px-16 py-16 text-center'>
        <div className='w-14 h-14 rounded-2xl bg-[#FFA641]/20 flex items-center
                        justify-center mx-auto mb-4'>
          <MessageSquare className='w-7 h-7 text-[#FFA641]' />
        </div>
        <h1 className='text-3xl font-bold text-white mb-3'>Feedback & Support</h1>
        <p className='text-white/60 max-w-md mx-auto text-sm leading-relaxed'>
          Have a suggestion, spotted an issue, or just want to share your experience?
          We read every message.
        </p>
      </div>

      <div className='px-4 md:px-16 py-12 max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

          {/* ── Feedback Form (2/3 width) ── */}
          <div className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 space-y-5'>
            <h2 className='font-bold text-[#2C3E50] text-lg'>Send us a message</h2>

            {!user && (
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  Your email
                </label>
                <input
                  type='email'
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder='you@example.com'
                  className={`${inputClass} h-11`}
                />
              </div>
            )}

            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Feedback type
              </label>

              <div className='grid grid-cols-3 gap-2'>
                {[
                  { value: 'general', label: '💬 General' },
                  { value: 'suggestion', label: '💡 Suggestion' },
                  { value: 'issue', label: '🐛 Issue' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm(p => ({ ...p, type: value }))}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors
              ${form.type === value
                        ? 'border-[#FFA641] bg-[#FFA641]/10 text-[#2C3E50]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Your message
              </label>

              <textarea
                rows={6}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder='Tell us what you think...'
                className={`${inputClass} py-3 resize-none`}
              />

              <p className='text-xs text-gray-400 mt-1 text-right'>
                {form.message.length}/500
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
        text-[#2C3E50] font-bold text-sm rounded-xl flex items-center justify-center gap-2'
            >
              {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> Sending...</> : 'Send Feedback'}
            </button>
          </div>

          {/* ── Testimonial (1/3 width) ── */}
          <div className='bg-white rounded-2xl border border-gray-100 p-8 space-y-5'>
            <h2 className='font-bold text-[#2C3E50] text-lg'>
              Share your experience
            </h2>

            <p className='text-gray-400 text-sm'>
              Leave a testimonial — if approved it may appear on our website.
            </p>

            {tSubmitted ? (
              <p className='text-green-600 text-sm font-semibold'>
                ✓ Testimonial submitted!
              </p>
            ) : (
              <>
                <div>
                  <label className='block text-sm font-semibold text-[#2C3E50] mb-2'>
                    Your rating
                  </label>

                  <div className='flex gap-1'>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setTForm(p => ({ ...p, rating: star }))}
                        className={`text-2xl ${star <= tForm.rating ? 'text-[#FFA641]' : 'text-gray-200'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={tForm.quote}
                  onChange={e => setTForm(p => ({ ...p, quote: e.target.value }))}
                  placeholder='Share your experience...'
                  className={`${inputClass} py-3 resize-none`}
                />

                <button
                  disabled={tLoading || !tForm.quote.trim()}
                  onClick={async () => {
                    if (!user) return toast.error('Login required')
                    setTLoading(true)
                    try {
                      await axios.post(
                        'http://localhost:8000/attendee/testimonials',
                        tForm,
                        { headers }
                      )
                      setTSubmitted(true)
                    } catch {
                      toast.error('Failed to submit')
                    } finally {
                      setTLoading(false)
                    }
                  }}
                  className='w-full h-11 bg-[#2C3E50] hover:bg-[#FFA641] hover:text-[#2C3E50]
            text-white font-bold text-sm rounded-xl'
                >
                  {tLoading ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </>
            )}
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

export default FeedbackPage
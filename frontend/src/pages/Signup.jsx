import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import logo from '@/assets/eventsphere_logo.png'

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'attendee',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post('http://localhost:8000/user/register', formData, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/verify')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none
    focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
    transition-all placeholder:text-gray-300`

  return (
    <div
      style={{ fontFamily: "'Jost', sans-serif" }}
      className='min-h-screen bg-[#2C3E50] flex'
    >
      {/* Left panel */}
      <div className='hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden'>
        {/* Watermark globe */}
        <div className='absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none'>
          <svg width="500" height="500" viewBox="0 0 520 520" fill="none">
            <circle cx="260" cy="260" r="240" stroke="white" strokeWidth="2"/>
            <ellipse cx="260" cy="260" rx="100" ry="240" stroke="white" strokeWidth="1.5"/>
            <ellipse cx="260" cy="260" rx="180" ry="240" stroke="white" strokeWidth="1"/>
            <line x1="20" y1="260" x2="500" y2="260" stroke="white" strokeWidth="1.5"/>
            <line x1="40" y1="160" x2="480" y2="160" stroke="white" strokeWidth="1"/>
            <line x1="40" y1="360" x2="480" y2="360" stroke="white" strokeWidth="1"/>
            <rect x="175" y="195" width="170" height="130" rx="8" stroke="white" strokeWidth="2"/>
            <line x1="175" y1="260" x2="345" y2="260" stroke="white" strokeWidth="1.2"/>
            <line x1="215" y1="195" x2="215" y2="325" stroke="white" strokeWidth="1"/>
            <circle cx="345" cy="195" r="18" fill="white"/>
          </svg>
        </div>

        <Link to='/' className='flex items-center gap-2.5 no-underline'>
                <img src={logo} alt="EventSphere" className='h-9 w-auto' />
        </Link>

        <div>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-3'>Join the platform</p>
          <h2 className='text-4xl font-bold text-white leading-tight mb-4'>
            Where great<br />expos begin.
          </h2>
          <p className='text-white/40 font-light text-base leading-relaxed max-w-sm'>
            Whether you're organizing, exhibiting, or attending — EventSphere gives you the tools to make every expo unforgettable.
          </p>

          <div className='flex gap-8 mt-12'>
            {[['240+', 'Expos hosted'], ['12k', 'Exhibitors'], ['98%', 'Satisfaction']].map(([num, lbl]) => (
              <div key={lbl}>
                <p className='text-[#FFA641] text-xl font-bold'>{num}</p>
                <p className='text-white/35 text-xs mt-0.5'>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className='text-white/20 text-xs'>© 2026 EventSphere Management</p>
      </div>

      {/* Right panel */}
      <div className='w-full lg:w-1/2 bg-[#f7f6f2] flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>

          {/* Mobile logo */}
          <div className='lg:hidden mb-8'>
            <Link to='/'>
            <img src={logo} alt="EventSphere" className='h-8 w-auto' />
            </Link>
          </div>

          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Get started</p>
          <h1 className='text-3xl font-bold text-[#2C3E50] mb-1'>Create account</h1>
          <p className='text-gray-400 font-light mb-8'>
            Already have an account?{' '}
            <Link to='/login' className='text-[#FFA641] font-semibold hover:underline'>
              Sign in
            </Link>
          </p>

          <div className='space-y-5'>

            {/* Full name */}
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Full name
              </label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter your full name'
                autoComplete='name'
                required
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Email address
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                autoComplete='email'
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Create a password'
                  autoComplete='new-password'
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-[#2C3E50] transition-colors'
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                I am registering as
              </label>
              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value='attendee'>Attendee</option>
                <option value='exhibitor'>Exhibitor</option>
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                         text-[#2C3E50] font-bold text-sm rounded-lg
                         flex items-center justify-center gap-2 transition-colors mt-2'
            >
              {isLoading
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Creating account...</>
                : 'Create my account'
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
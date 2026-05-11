import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { getData } from '@/context/userContext'
import logo from '@/assets/eventsphere_logo.png'
import { loginSchema } from '@/validators/schemas'

const Login = () => {
  const { setUser } = getData()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post('http://localhost:8000/user/login', formData, {
        headers: { 'Content-Type': 'application/json' }
      })
      const result = loginSchema.safeParse(formData)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const firstError = Object.values(errors)[0]?.[0]
        return toast.error(firstError)
      }
      if (res.data.success) {
        setUser(res.data.user)
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        toast.success(res.data.message)
        // redirect based on role
        if (res.data.user.role === 'admin')
          navigate('/admin')
        else if (res.data.user.role === 'exhibitor')
          navigate('/exhibitor')
        else navigate('/')
      }
    } catch (error) {
      const msg = error.response?.data?.message
      toast.error(msg || 'Something went wrong! Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
            <circle cx="260" cy="260" r="240" stroke="white" strokeWidth="2" />
            <ellipse cx="260" cy="260" rx="100" ry="240" stroke="white" strokeWidth="1.5" />
            <ellipse cx="260" cy="260" rx="180" ry="240" stroke="white" strokeWidth="1" />
            <line x1="20" y1="260" x2="500" y2="260" stroke="white" strokeWidth="1.5" />
            <line x1="40" y1="160" x2="480" y2="160" stroke="white" strokeWidth="1" />
            <line x1="40" y1="360" x2="480" y2="360" stroke="white" strokeWidth="1" />
            <rect x="175" y="195" width="170" height="130" rx="8" stroke="white" strokeWidth="2" />
            <line x1="175" y1="260" x2="345" y2="260" stroke="white" strokeWidth="1.2" />
            <line x1="215" y1="195" x2="215" y2="325" stroke="white" strokeWidth="1" />
            <circle cx="345" cy="195" r="18" fill="white" />
          </svg>
        </div>

        <Link to='/' className='flex items-center gap-2.5 no-underline'>
          <img src={logo} alt="EventSphere" className='h-9 w-auto' />
        </Link>

        <div>
          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-3'>Welcome back</p>
          <h2 className='text-4xl font-bold text-white leading-tight mb-4'>
            Your next big<br />expo awaits.
          </h2>
          <p className='text-white/40 font-light text-base leading-relaxed max-w-sm'>
            Log in to manage your events, connect with exhibitors, and engage your audience — all in one place.
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
              <img src={logo} alt="EventSphere" className='h-9 w-auto' />
            </Link>
          </div>

          <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Account access</p>
          <h1 className='text-3xl font-bold text-[#2C3E50] mb-1'>Sign in</h1>
          <p className='text-gray-400 font-light mb-8'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-[#FFA641] font-semibold hover:underline'>
              Register here
            </Link>
          </p>

          <div className='space-y-5'>
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
                required
                className='w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
                           text-[#2C3E50] text-sm outline-none
                           focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
                           transition-all placeholder:text-gray-300'
              />
            </div>

            {/* Password */}
            <div>
              <div className='flex justify-between items-center mb-1.5'>
                <label className='block text-sm font-semibold text-[#2C3E50]'>
                  Password
                </label>
                <Link
                  to='/forgot-password'
                  className='text-xs text-[#FFA641] font-semibold hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  required
                  className='w-full h-11 px-4 pr-11 rounded-lg border border-gray-200 bg-white
                             text-[#2C3E50] text-sm outline-none
                             focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
                             transition-all placeholder:text-gray-300'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-[#2C3E50] transition-colors'
                >
                  {showPassword
                    ? <EyeOff className='w-4 h-4' />
                    : <Eye className='w-4 h-4' />}
                </button>
              </div>
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
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Signing in...</>
                : 'Sign in to EventSphere'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
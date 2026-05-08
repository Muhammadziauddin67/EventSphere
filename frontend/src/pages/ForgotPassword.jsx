import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { CheckCircle, Loader2, Mail  } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleForgotPassword = async (e)=>{
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/user/forgot-password`, {
        email
      });
      if(res.data.success){
        navigate(`/verify-otp/${email}`)
        toast.success(res.data.message)
        setEmail("")
      }
    } catch (error) {
      console.log(error);

    } finally{
      setIsLoading(false)
    }
  }
  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='bg-[#f7f6f2] rounded-2xl p-10 w-full max-w-md'>

        <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-5'>
          <Mail className='w-8 h-8 text-[#FFA641]' />
        </div>

        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2 text-center'>
          Account recovery
        </p>
        <h2 className='text-2xl font-bold text-[#2C3E50] mb-2 text-center'>Forgot password?</h2>
        <p className='text-gray-400 text-sm font-light text-center leading-relaxed mb-8'>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleForgotPassword} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
              Email address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              required
              disabled={isLoading}
              className='w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
                         text-[#2C3E50] text-sm outline-none
                         focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
                         transition-all placeholder:text-gray-300 disabled:opacity-50'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                       text-[#2C3E50] font-bold text-sm rounded-lg
                       flex items-center justify-center gap-2 transition-colors'
          >
            {isLoading
              ? <><Loader2 className='w-4 h-4 animate-spin' /> Sending OTP...</>
              : 'Send OTP'
            }
          </button>
        </form>

        <p className='text-center text-sm text-gray-400 mt-6'>
          Remember your password?{' '}
          <Link to='/login' className='text-[#FFA641] font-semibold hover:underline'>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword
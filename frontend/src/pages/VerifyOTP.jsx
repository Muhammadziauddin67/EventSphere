import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const VerifyOTP = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()

  const handleChange = (index, value) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/user/verify-otp/${email}`, {
        otp: finalOtp,
      })
      setSuccessMessage(res.data.message)
      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='bg-[#f7f6f2] rounded-2xl p-10 w-full max-w-md'>

        {isVerified ? (
          <div className='text-center py-4'>
            <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-[#FFA641]' />
            </div>
            <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>OTP verified!</h2>
            <p className='text-gray-400 text-sm font-light mb-1'>{successMessage}</p>
            <div className='flex items-center justify-center gap-2 mt-4 text-gray-300 text-xs'>
              <Loader2 className='w-3 h-3 animate-spin' /> Redirecting...
            </div>
          </div>
        ) : (
          <>
            <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Password reset</p>
            <h2 className='text-2xl font-bold text-[#2C3E50] mb-1'>Enter your OTP</h2>
            <p className='text-gray-400 text-sm font-light mb-8'>
              We sent a 6-digit code to <span className='font-semibold text-[#2C3E50]'>{email}</span>
            </p>

            {error && (
              <div className='bg-red-50 border border-red-100 text-red-500 text-sm rounded-lg px-4 py-3 mb-6'>
                {error}
              </div>
            )}

            {/* OTP boxes */}
            <div className='flex justify-between gap-2 mb-8'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type='text'
                  inputMode='numeric'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className='w-12 h-14 text-center text-xl font-bold rounded-lg
                             border-2 border-gray-200 bg-white text-[#2C3E50] outline-none
                             focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
                             transition-all'
                />
              ))}
            </div>

            <div className='space-y-3'>
              <button
                onClick={handleVerify}
                disabled={isLoading || otp.some(d => d === '')}
                className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-50
                           text-[#2C3E50] font-bold text-sm rounded-lg
                           flex items-center justify-center gap-2 transition-colors'
              >
                {isLoading
                  ? <><Loader2 className='w-4 h-4 animate-spin' /> Verifying...</>
                  : 'Verify code'
                }
              </button>

              <button
                onClick={clearOtp}
                disabled={isLoading}
                className='w-full h-11 bg-white border border-gray-200 hover:border-gray-300
                           text-[#2C3E50] font-semibold text-sm rounded-lg
                           flex items-center justify-center gap-2 transition-colors'
              >
                <RotateCcw className='w-4 h-4' /> Clear
              </button>
            </div>

            <p className='text-center text-sm text-gray-400 mt-6'>
              Wrong email?{' '}
              <Link to='/forgot-password' className='text-[#FFA641] font-semibold hover:underline'>
                Go back
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  )
}

export default VerifyOTP
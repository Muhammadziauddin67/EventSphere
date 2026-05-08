import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import {CheckCircle, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ChangePassword = () => {
  const { email } = useParams()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)      // ← add
const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const handleChangePassword = async () => {
    setError("")
    setSuccess("")

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/user/change-password/${email}`, {
        newPassword,
        confirmPassword
      })

      setSuccess(res.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  const inputClass = `w-full h-11 px-4 pr-11 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none
    focus:border-[#FFA641] focus:ring-2 focus:ring-[#FFA641]/20
    transition-all placeholder:text-gray-300`

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='bg-[#f7f6f2] rounded-2xl p-10 w-full max-w-md'>

        {success ? (
          <div className='text-center py-4'>
            <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-[#FFA641]' />
            </div>
            <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>Password changed!</h2>
            <p className='text-gray-400 text-sm font-light mb-1'>{success}</p>
            <p className='text-gray-300 text-xs'>Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-5'>
              <LockKeyhole className='w-8 h-8 text-[#FFA641]' />
            </div>

            <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2 text-center'>
              Almost done
            </p>
            <h2 className='text-2xl font-bold text-[#2C3E50] mb-2 text-center'>Set new password</h2>
            <p className='text-gray-400 text-sm font-light text-center mb-8'>
              Creating a new password for{' '}
              <span className='font-semibold text-[#2C3E50]'>{email}</span>
            </p>

            {error && (
              <div className='bg-red-50 border border-red-100 text-red-500 text-sm
                              rounded-lg px-4 py-3 mb-6'>
                {error}
              </div>
            )}

            <div className='space-y-5'>
              {/* New password */}
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  New password
                </label>
                <div className='relative'>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Enter new password'
                    className={inputClass}
                  />
                  <button
                    type='button'
                    onClick={() => setShowNew(!showNew)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-[#2C3E50] transition-colors'
                  >
                    {showNew ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  Confirm password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    className={inputClass}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirm(!showConfirm)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-[#2C3E50] transition-colors'
                  >
                    {showConfirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className='w-full h-11 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                           text-[#2C3E50] font-bold text-sm rounded-lg
                           flex items-center justify-center gap-2 transition-colors'
              >
                {isLoading
                  ? <><Loader2 className='w-4 h-4 animate-spin' /> Changing password...</>
                  : 'Change password'
                }
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default ChangePassword
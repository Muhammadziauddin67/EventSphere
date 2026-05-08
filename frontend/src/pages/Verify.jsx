import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const Verify = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying')
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(`http://localhost:8000/user/verify`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          setStatus('success')
          setTimeout(() => navigate('/login'), 2000)
        } else {
          setStatus('error')
        }
      } catch (error) {
        setStatus('error')
      }
    }
    verifyEmail()
  }, [token, navigate])

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='bg-[#f7f6f2] rounded-2xl p-10 w-full max-w-md text-center'>

        {status === 'verifying' && (
          <>
            <Loader2 className='w-12 h-12 animate-spin text-[#FFA641] mx-auto mb-4' />
            <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>Verifying your email...</h2>
            <p className='text-gray-400 text-sm font-light'>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-[#FFA641]' />
            </div>
            <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>Email verified!</h2>
            <p className='text-gray-400 text-sm font-light mb-1'>Your account is now active.</p>
            <p className='text-gray-300 text-xs'>Redirecting you to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
              <XCircle className='w-8 h-8 text-red-400' />
            </div>
            <h2 className='text-xl font-bold text-[#2C3E50] mb-2'>Verification failed</h2>
            <p className='text-gray-400 text-sm font-light mb-6'>
              This link is invalid or has expired.
            </p>
            <Link to='/login'
                  className='inline-block bg-[#FFA641] text-[#2C3E50] font-bold text-sm
                             px-6 py-2.5 rounded-lg hover:bg-[#ffb55a] transition-colors no-underline'>
              Back to login
            </Link>
          </>
        )}

      </div>
    </div>
  )
}

export default Verify
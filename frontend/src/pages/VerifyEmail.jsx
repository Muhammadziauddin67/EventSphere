import React from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

const VerifyEmail = () => {
  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='bg-[#f7f6f2] rounded-2xl p-10 w-full max-w-md text-center'>

        <div className='w-16 h-16 rounded-full bg-[#FFA641]/15 flex items-center justify-center mx-auto mb-5'>
          <Mail className='w-8 h-8 text-[#FFA641]' />
        </div>

        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>One more step</p>
        <h2 className='text-2xl font-bold text-[#2C3E50] mb-3'>Check your inbox</h2>
        <p className='text-gray-400 text-sm font-light leading-relaxed mb-8'>
          We've sent a verification link to your email address. Click it to activate your account and get started.
        </p>

        <div className='bg-white border border-gray-100 rounded-xl p-4 text-xs text-gray-400 mb-6'>
          Didn't get the email? Check your spam folder or{' '}
          <Link to='/register' className='text-[#FFA641] font-semibold hover:underline'>
            try registering again
          </Link>
        </div>

        <Link to='/login'
              className='inline-block text-[#2C3E50] font-semibold text-sm
                         hover:text-[#FFA641] transition-colors no-underline'>
          ← Back to login
        </Link>

      </div>
    </div>
  )
}

export default VerifyEmail
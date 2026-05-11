import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#2C3E50] flex items-center justify-center px-4'>
      <div className='text-center'>
        <p className='text-[#FFA641] text-8xl font-bold mb-4'>404</p>
        <h1 className='text-3xl font-bold text-white mb-3'>Page not found</h1>
        <p className='text-white/50 mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className='flex gap-3 justify-center'>
          <button onClick={() => navigate('/')}
                  className='border border-white/30 text-white font-semibold px-6 py-2.5
                             rounded-lg hover:border-white/60 transition-colors text-sm'>
            Go to Home
          </button>
          <button onClick={() => navigate('/')}
                  className='bg-[#FFA641] text-[#2C3E50] font-bold px-6 py-2.5
                             rounded-lg hover:bg-[#ffb55a] transition-colors text-sm'>
            Go to login
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
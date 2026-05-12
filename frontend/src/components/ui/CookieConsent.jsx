import React, { useState, useEffect, useRef } from 'react'
import { Cookie } from 'lucide-react'
import { getData } from '@/context/userContext'

const CookieConsent = () => {
  const { user } = getData()
  const [show, setShow] = useState(false)
  const hasChecked = useRef(false)
  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') return
    if (hasChecked.current) return  // ← prevents re-triggering on re-renders
    hasChecked.current = true
  
    const consentKey = `cookieConsent_${user.email}`
    if (!localStorage.getItem(consentKey)) {
      setTimeout(() => setShow(true), 1200)
    }
  }, [user])

  const handleAccept = () => {
    if (!user) return
  
    localStorage.setItem(
      `cookieConsent_${user.email}`,
      'accepted'
    )
  
    setShow(false)
  }

  const handleDecline = () => {
    if (!user) return
  
    localStorage.setItem(
      `cookieConsent_${user.email}`,
      'declined'
    )
  
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm
                    bg-[#2C3E50] rounded-2xl p-5 z-[999] shadow-2xl
                    animate-in slide-in-from-bottom duration-300'>
      <div className='flex items-start gap-3 mb-4'>
        <div className='w-10 h-10 rounded-xl bg-[#FFA641]/20 flex items-center
                        justify-center flex-shrink-0'>
          <Cookie className='w-5 h-5 text-[#FFA641]' />
        </div>
        <div>
          <p className='text-white font-bold text-sm mb-1'>We use cookies</p>
          <p className='text-white/60 text-xs leading-relaxed'>
            We use cookies to enhance your browsing experience, analyze site traffic,
            and personalize content. By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
      </div>
      <div className='flex gap-2'>
        <button onClick={handleDecline}
                className='flex-1 h-9 border border-white/20 text-white/70 text-xs
                           font-semibold rounded-lg hover:bg-white/10 transition-colors'>
          Decline
        </button>
        <button onClick={handleAccept}
                className='flex-1 h-9 bg-[#FFA641] text-[#2C3E50] text-xs font-bold
                           rounded-lg hover:bg-[#ffb55a] transition-colors'>
          Accept All
        </button>
      </div>
      <button onClick={() => setShow(false)}
              className='absolute top-3 right-3 text-white/30 hover:text-white text-lg
                         leading-none transition-colors'>
        ×
      </button>
    </div>
  )
}

export default CookieConsent
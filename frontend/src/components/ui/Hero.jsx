import { ArrowRight, Zap } from 'lucide-react'
import React from 'react'
import { Button } from './button'
import { useNavigate } from 'react-router-dom'
import { getData } from '@/context/userContext'
import logo from '@/assets/eventsphere_logo.png'

const Hero = () => {
    const { user } = getData()
    const navigate = useNavigate()

    return (
        <div style={{ fontFamily: "'Jost', sans-serif" }}
            className="relative w-full min-h-screen bg-[#2C3E50] overflow-hidden flex items-center">

            {/* Background globe watermark */}
            <div className='absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none'>
                <img src={logo} alt="" className='w-96 h-auto' />
            </div>

            <div className='w-full px-16 py-24 relative z-10'>
                {user && (
                    <p className='text-white/50 text-sm mb-3'>
                        Welcome back, <span className='text-[#FFA641] font-semibold'>{user.username}</span>
                    </p>
                )}
                <div className='inline-flex items-center gap-2 bg-[#FFA641]/15 border border-[#FFA641]/35
                                text-[#FFA641] px-4 py-1.5 rounded-full text-xs font-semibold
                                uppercase tracking-widest mb-6'>
                    <Zap className='w-3 h-3' /> Expo Management Platform
                </div>
                <h1 className='text-5xl md:text-6xl font-bold text-white leading-tight mb-5 tracking-tight'>
                    Connect. Exhibit.<br />
                    <span className='text-[#FFA641]'>Inspire the world.</span>
                </h1>
                <p className='text-white/60 text-lg max-w-xl mb-8 leading-relaxed font-light'>
                    The all-in-one platform for managing large-scale expos and trade shows —
                    from booth allocation to real-time attendee engagement.
                </p>
                <div className='flex gap-4 flex-wrap'>
                    <Button onClick={() => navigate('/events')}
                        className='bg-[#FFA641] text-[#2C3E50] font-bold text-base
                                       h-12 px-7 hover:bg-[#ffb55a]'>
                        Explore Expos <ArrowRight className='ml-2 w-4 h-4' />
                    </Button>
                    <Button variant='outline'
                        className='h-12 px-7 text-base font-medium text-white bg-transparent
                                       border-white/30 hover:border-white/60 hover:bg-transparent'>
                        Watch Demo
                    </Button>
                </div>

                {/* Stats bar */}
                <div className='flex gap-10 mt-10 pt-8 border-t border-white/10'>
                    {[['240+', 'Expos hosted'], ['12k', 'Exhibitors registered'], ['98%', 'Organizer satisfaction']].map(([num, lbl]) => (
                        <div key={lbl}>
                            <div className='text-[#FFA641] text-2xl font-bold'>{num}</div>
                            <div className='text-white/45 text-xs mt-0.5 tracking-wide'>{lbl}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero
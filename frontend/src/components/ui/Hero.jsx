import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { useNavigate } from 'react-router-dom'
import { getData } from '@/context/userContext'
import logo from '@/assets/eventsphere_logo.png'
const heroBanners = [
    {
        type: 'Expo',
        img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
        label: 'Trade Shows & Expos',
        path: '/events?type=expo'
    },
    {
        type: 'Concert',
        img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80',
        label: 'Live Concert Experiences',
        path: '/events?type=concert'
    },
    {
        type: 'Sports',
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80',
        label: 'Live Sports Action',
        path: '/events?type=sports'
    },
]

const Hero = () => {
    const { user } = getData()
    const navigate = useNavigate()
    const [bannerIdx, setBannerIdx] = useState(0)

    useEffect(() => {
        const t = setInterval(() => {
            setBannerIdx(i => (i + 1) % heroBanners.length)
        }, 4000)

        return () => clearInterval(t)
    }, [])

    return (
        <div
            style={{ fontFamily: "'Jost', sans-serif" }}
            className="relative w-full min-h-screen bg-[#2C3E50] overflow-hidden flex items-center"
        >
    
            {/* ── BACKGROUND SLIDER ── */}
            <div className="absolute inset-0">
                {heroBanners.map((b, i) => (
                    <div
                        key={b.type}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            i === bannerIdx ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={b.img}
                            className="w-full h-full object-cover scale-110"
                            alt={b.type}
                        />
    
                        {/* dark overlay */}
                        <div className="absolute inset-0 bg-[#2C3E50]/80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50]/90 via-[#2C3E50]/60 to-transparent" />
                    </div>
                ))}
            </div>
    
    
            {/* ── CONTENT OVERLAY (NO STACKING ANYMORE) ── */}
            <div className="relative z-10 w-full px-6 md:px-16">
    
                {user && (
                    <p className="text-white/60 text-sm mb-3">
                        Welcome back,{" "}
                        <span className="text-[#FFA641] font-semibold">
                            {user.username}
                        </span>
                    </p>
                )}
    
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-4xl">
                    Discover events that{" "}
                    <span className="text-[#FFA641]">bring people together.</span>
                </h1>
    
                <p className="text-white/60 text-sm md:text-lg max-w-2xl mt-5">
                    Manage, explore, and experience conferences, concerts, sports events,
                    expos, and community gatherings — all in one platform.
                </p>
    
                {/* buttons */}
                <div className="flex gap-3 mt-7 flex-wrap">
                    <Button
                        onClick={() => navigate('/events')}
                        className="bg-[#FFA641] text-[#2C3E50] font-bold h-11 px-6 hover:bg-[#ffb55a]"
                    >
                        Explore Events
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
    
                    <Button
                        variant="outline"
                        className="h-11 px-6 text-black border-white/30 hover:border-white/60"
                    >
                        Learn More
                    </Button>
                </div>
    
                {/* stats */}
                <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10 max-w-2xl">
                    {[
                        ['500+', 'Events hosted'],
                        ['50k+', 'Tickets booked'],
                        ['98%', 'User satisfaction']
                    ].map(([num, lbl]) => (
                        <div key={lbl}>
                            <div className="text-[#FFA641] text-2xl font-bold">
                                {num}
                            </div>
                            <div className="text-white/50 text-xs mt-1">
                                {lbl}
                            </div>
                        </div>
                    ))}
                </div>
    
            </div>
    
            {/* dots */}
            <div className="absolute bottom-5 right-5 flex gap-2 z-20">
                {heroBanners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setBannerIdx(i)}
                        className={`w-2 h-2 rounded-full ${
                            i === bannerIdx ? 'bg-[#FFA641]' : 'bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Hero
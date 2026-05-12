import { User, CalendarDays, Bookmark, Ticket, LogOut, BookOpen, MessageSquare, MessageCircleQuestion } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from './avatar'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'
import logo from '@/assets/eventsphere_logo.png'

const Navbar = () => {
    const { user, setUser } = getData()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const accessToken = localStorage.getItem("accessToken")
    const [alerts, setAlerts] = useState([])
const [showAlerts, setShowAlerts] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                setUser(null)
                toast.success(res.data.message)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

    // gets first initial of username
    const getInitial = (name) => name?.trim()[0]?.toUpperCase() || '?'

    return (
        <nav style={{ fontFamily: "'Jost', sans-serif" }}
        className="bg-[#2C3E50] px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-50 relative">


            {/* Logo */}
            <Link to='/' className='flex items-center gap-2.5 no-underline'>
                <img src={logo} alt="EventSphere" className='h-9 w-auto' />
            </Link>

            {/* Nav links */}
            <ul className='hidden md:flex gap-8 items-center text-[0.95rem] font-medium list-none'>
                <li><Link to='/events?type=expo' className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>Expos</Link></li>
                <li><Link to='/events?type=concert' className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>Concerts</Link></li>
                <li><Link to='/events?type=sports' className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>Sports</Link></li>
                <li><Link to='/blog' className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>Blog</Link></li>
                <li><Link to='/about' className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>About</Link></li>
            </ul>
       
            {/* Right side */}
            <div className='flex items-center gap-3'>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(prev => !prev)}>
                ☰
            </button>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className='cursor-pointer w-9 h-9 border-2 border-white/20'>
                                <AvatarFallback
                                    className='bg-[#FFA641] text-[#2C3E50] font-bold text-sm'>
                                    {getInitial(user.username)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='w-44'>
                            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user?.role === 'attendee' && (
                                <>
                                    <DropdownMenuItem onClick={() => navigate('/bookmarks')}>
                                        <Bookmark className='w-4 h-4 mr-2' /> Bookmarks
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/my-tickets')}>
                                        <Ticket className='w-4 h-4 mr-2' /> My Tickets
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/my-schedule')}>
                                        <CalendarDays className='w-4 h-4 mr-2' /> My Schedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/chat')}>
                                        <MessageSquare className='w-4 h-4 mr-2' /> Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/feedback')}>
                                        <MessageCircleQuestion className='w-4 h-4 mr-2' /> Feedback
                                    </DropdownMenuItem>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <DropdownMenuItem onClick={() => navigate('/admin')}>
                                    <User className='w-4 h-4 mr-2' /> Admin Dashboard
                                </DropdownMenuItem>
                            )}

                            {user.role === 'exhibitor' && (
                                <DropdownMenuItem onClick={() => navigate('/exhibitor')}>
                                    <User className='w-4 h-4 mr-2' /> Exhibitor Portal
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className='w-4 h-4 mr-2' /> Profile
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logoutHandler} className='text-red-500'>
                                <LogOut className='w-4 h-4 mr-2' />Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Link to='/login'>
                            <Button variant='outline'
                                className='border-white/30 text-white bg-transparent hover:border-[#FFA641] hover:text-[#FFA641] hover:bg-transparent'>
                                Log in
                            </Button>
                        </Link>
                        <Link to='/register'>
                            <Button className='bg-[#FFA641] text-[#2C3E50] font-bold hover:bg-[#ffb55a]'>
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </div>
            {mobileOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-[#2C3E50] border-t border-white/10 px-6 py-4 flex flex-col gap-4">

                    <Link to="/events?type=expo" className="text-white/70">Expos</Link>
                    <Link to="/events?type=concert" className="text-white/70">Concerts</Link>
                    <Link to="/events?type=sports" className="text-white/70">Sports</Link>
                    <Link to="/blog" className="text-white/70">Blog</Link>
                    <Link to="/about" className="text-white/70">About</Link>

                </div>
            )}
        </nav>
    )
}

export default Navbar
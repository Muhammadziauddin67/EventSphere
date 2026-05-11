import { User, CalendarDays, Bookmark, Ticket, LogOut, BookOpen } from 'lucide-react'
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
    const accessToken = localStorage.getItem("accessToken")

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                setUser(null)
                toast.success(res.data.message)
                localStorage.clear()
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
            className='bg-[#2C3E50] px-8 h-16 flex items-center justify-between sticky top-0 z-50'>


            {/* Logo */}
            <Link to='/' className='flex items-center gap-2.5 no-underline'>
                <img src={logo} alt="EventSphere" className='h-9 w-auto' />
            </Link>

            {/* Nav links */}
            <ul className='flex gap-8 items-center text-[0.95rem] font-medium list-none'>
                {[
                    { label: 'Expos', path: '/events?type=expo' },
                    { label: 'Concerts', path: '/events?type=concert' },
                    { label: 'Sports', path: '/events?type=sports' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'About', path: '/about' },
                ].map(({ label, path }) => (
                    <li key={label}>
                        <Link to={path} className='text-white/70 hover:text-[#FFA641] transition-colors no-underline'>
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Right side */}
            <div className='flex items-center gap-3'>
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
        </nav>
    )
}

export default Navbar
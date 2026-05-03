import { User, BookA, BookOpen, LogOut } from 'lucide-react'
import React from 'react'
import { Link, useNavigate  } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'

const Navbar = () => {
    const {user, setUser} = getData()
    const navigate = useNavigate()  
    const accessToken = localStorage.getItem("accessToken")
    console.log(user);

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                setUser(null);              // ✅ now defined
                toast.success(res.data.message);
                localStorage.clear();
                navigate('/login')          // ✅ redirect after logout
            }
            if (res.data.success) {
                setUser(null);
                toast.success(res.data.message);
                localStorage.clear();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <nav className='p-2 border-b border-gray-200 bg-transparent'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                {/* Logo section */}
                <div className='flex gap-2 items-center'>
                    <BookOpen className='h-6 w-6 text-green-800' />
                    <h1 className='font-bold text-xl'><span className='text-green-600'>Notes</span>App</h1>
                </div>
                <div className='flex gap-7 items-center'>
                    <ul className='flex gap-7 items-center text-lg font-semibold'>
                        <li>Features</li>
                        <li>Pricing</li>
                        <li>About</li>
                        {
                            user ? <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem><User />Profile</DropdownMenuItem>
                                    <DropdownMenuItem><BookA />Notes</DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={logoutHandler}><LogOut/>LogOut</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> : <Link to={'/login'}><li>login</li></Link>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
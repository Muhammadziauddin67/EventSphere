import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Users, Users2, BarChart2, Clock, MessageSquare, LogOut, Menu, X, UserCog, MessageCircleQuestion, Star } from 'lucide-react'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'
import logo from '@/assets/eventsphere_logo.png'


const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Manage Expos', path: '/admin/expos', icon: CalendarDays },
  { label: 'Manage Exhibitors', path: '/admin/exhibitors', icon: Users },
  { label: 'Profiles', path: '/admin/exhibitor-profiles', icon: Users2 },
  { label: 'Schedule', path: '/admin/schedule', icon: Clock },
  { label: 'Users', path: '/admin/users', icon: UserCog },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { label: 'Feedback Hub', path: '/admin/feedback', icon: MessageCircleQuestion },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
]

const AdminLayout = () => {
  const { user, setUser } = getData()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  

  const logoutHandler = async () => {
    try {
      const res = await axios.post('http://localhost:8000/user/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (res.data.success) {
        setUser(null)
        localStorage.clear()
        toast.success(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
  
    handleResize()
  
    window.addEventListener('resize', handleResize)
  
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    < div style = {{ fontFamily: "'Jost', sans-serif" }
} className = 'min-h-screen flex bg-[#f7f6f2]' >

  {/* Sidebar */ }
  <>
  { sidebarOpen && (
    <div
      className='fixed inset-0 bg-black/50 z-40 lg:hidden'
      onClick={() => setSidebarOpen(false)}
    />
  )}

<aside
  className={`
      fixed lg:relative z-50 lg:z-auto
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${sidebarOpen ? 'w-64' : 'w-64 lg:w-16'}
      transition-all duration-300
      bg-[#2C3E50] flex flex-col flex-shrink-0 min-h-screen
    `}
>

  {/* Logo + toggle */}
  <div className='h-16 flex items-center justify-between px-4 border-b border-white/10'>
    {sidebarOpen && (
      <Link to='/'>
        <img src={logo} alt='EventSphere' className='h-8 w-auto' />
      </Link>
    )}
    <button onClick={() => setSidebarOpen(!sidebarOpen)}
      className='text-white/50 hover:text-white transition-colors ml-auto'>
      {sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
    </button>
  </div>

  {/* Nav items */}
  <nav className='flex-1 py-6 px-2 space-y-1'>
    {navItems.map(({ label, path, icon: Icon }) => {
      const active = location.pathname === path
      return (
        <Link key={path} to={path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline
                                transition-all text-sm font-medium
                                ${active
              ? 'bg-[#FFA641] text-[#2C3E50]'
              : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
          <Icon className='w-5 h-5 flex-shrink-0' />
          {sidebarOpen && <span>{label}</span>}
        </Link>
      )
    })}
  </nav>

  {/* User + logout */}
  <div className='p-4 border-t border-white/10'>
    {sidebarOpen && (
      <div className='flex items-center gap-3 mb-3'>
        <div className='w-8 h-8 rounded-full bg-[#FFA641] flex items-center justify-center
                              text-[#2C3E50] font-bold text-sm flex-shrink-0'>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div className='overflow-hidden'>
          <p className='text-white text-sm font-semibold truncate'>{user?.username}</p>
          <p className='text-white/35 text-xs truncate'>{user?.email}</p>
        </div>
      </div>
    )}
    <button onClick={logoutHandler}
      className='flex items-center gap-3 w-full px-3 py-2 rounded-lg
                             text-white/50 hover:text-red-400 hover:bg-white/5
                             transition-colors text-sm font-medium'>
      <LogOut className='w-5 h-5 flex-shrink-0' />
      {sidebarOpen && <span>Logout</span>}
    </button>
  </div>
  </aside>
  </>

{/* Main content */ }
<main className='flex-1 overflow-auto'>
<div className='h-16 bg-white border-b border-gray-100 flex items-center px-4 md:px-8 gap-3'>
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className='lg:hidden text-[#2C3E50] hover:text-[#FFA641] transition-colors'
>
  <Menu className='w-5 h-5' />
</button>
    <h1 className='text-[#2C3E50] font-bold text-lg'>
      {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
    </h1>
  </div>
  <div className='p-4 md:p-8 w-full'>
    <Outlet />
  </div>
</main>

    </div >
  )
}

export default AdminLayout
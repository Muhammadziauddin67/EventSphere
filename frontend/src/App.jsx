import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyOTP from './pages/VerifyOTP'
import VerifyEmail from './pages/VerifyEmail'
import Navbar from './components/ui/Navbar'
import ProtectedRoute from './components/ui/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import AdminMessages from './pages/admin/AdminMessages'
import AdminRoute from './components/ui/AdminRoute'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageExpos from './pages/admin/ManageExpos'
import ManageExhibitors from './pages/admin/ManageExhibitors'
import ManageSchedule from './pages/admin/ManageSchedule'
import Analytics from './pages/admin/Analytics'
import ExhibitorLayout from './pages/exhibitor/ExhibitorLayout'
import ExhibitorDashboard from './pages/exhibitor/ExhibitorDashboard'
import ApplyForExpo from './pages/exhibitor/ApplyForExpo'
import MyBooth from './pages/exhibitor/MyBooth'
import Messages from './pages/exhibitor/Messages'
import ExhibitorProfile from './pages/exhibitor/ExhibitorProfile'
import ExhibitorRoute from './components/ui/ExhibitorRoute'
import BrowseEvents from './pages/BrowseEvents'
import EventDetail from './pages/EventDetail'
import Bookmarks from './pages/Bookmarks'
import MyTickets from './pages/MyTickets'
import MySchedule from './pages/MySchedule'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import NotFound from './pages/NotFound'
import ExhibitorDetail from './pages/ExhibitorDetail'
import FeedbackPage from './pages/FeedbackPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ChatPage from './pages/ChatPage'
import ManageExhibitorProfiles from './pages/admin/ManageExhibitorProfiles'
import FeedbackHub from './pages/admin/FeedbackHub'
import ManageUsers from './pages/admin/ManageUsers'

const router = createBrowserRouter([
  { path: '*', element: <NotFound /> },
  {
    path: '/',
    element: <ProtectedRoute><Navbar /><Home /> </ProtectedRoute>
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/verify',
    element: <VerifyEmail />
  },
  {
    path: '/verify/:token',
    element: <Verify />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify-otp/:email',
    element: <VerifyOTP />
  },
  {
    path: '/change-password/:email',
    element: <ChangePassword />
  },
  {
    path: '/events',
    element: <><Navbar /><BrowseEvents /></>
  },
  {
    path: '/event/:id',
    element: <><Navbar /><EventDetail /></>
  },
  {
    path: '/bookmarks',
    element: <ProtectedRoute><Navbar /><Bookmarks /></ProtectedRoute>
  },
  {
    path: '/my-tickets',
    element: <ProtectedRoute><Navbar /><MyTickets /></ProtectedRoute>
  },
  {
    path: '/my-schedule',
    element: <ProtectedRoute><Navbar /><MySchedule /></ProtectedRoute>
  },
  { path: '/chat', element: <ProtectedRoute><><Navbar /><ChatPage /></></ProtectedRoute> },
  { path: '/payment', element: <ProtectedRoute><><Navbar /><PaymentPage /></></ProtectedRoute> },
  { path: '/privacy', element: <><Navbar /><PrivacyPolicy /></> },
  { path: '/profile', element: <ProtectedRoute><><Navbar /><ProfilePage /></></ProtectedRoute> },
  { path: '/about', element: <><Navbar /><AboutPage /></> },
  { path: '/blog', element: <><Navbar /><BlogPage /></> },
  { path: '/feedback', element: <><Navbar /><FeedbackPage /></> },
  { path: '/exhibitor-detail/:applicationId', element: <><Navbar /><ExhibitorDetail /></> },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'expos', element: <ManageExpos /> },
      { path: 'exhibitors', element: <ManageExhibitors /> },
      { path: 'exhibitor-profiles', element: <ManageExhibitorProfiles /> },
      { path: 'schedule', element: <ManageSchedule /> },
      { path: 'feedback', element: <FeedbackHub /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'messages', element: <AdminMessages /> },
    ]
  },
  {
    path: '/exhibitor',
    element: <ExhibitorRoute><ExhibitorLayout /></ExhibitorRoute>,
    children: [
      { index: true, element: <ExhibitorDashboard /> },
      { path: 'apply', element: <ApplyForExpo /> },
      { path: 'booth', element: <MyBooth /> },
      { path: 'messages', element: <Messages /> },
      { path: 'profile', element: <ExhibitorProfile /> },
    ]
  },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
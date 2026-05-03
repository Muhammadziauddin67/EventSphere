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

const router = createBrowserRouter([
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
    element: <VerifyOTP/>
  },
  {
    path: '/change-password/:email',
    element: <ChangePassword/>
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
import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

const router = createBrowserRouter([
    {
        path: '/',
        element:<Home/>
    },
    {
        path: '/signup',
        element:<Signup/>
    },
    {
        path: '/login',
        element:<Login/>
    },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
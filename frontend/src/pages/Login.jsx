import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye,EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { getData } from '@/context/userContext';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const Login = () => {
  const {setUser} = getData()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      setIsLoading(true)
      const res = await axios.post('http://localhost:8000/user/login', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.data.success) {
        navigate('/')
        setUser(res.data.user)
        localStorage.setItem("accessToken", res.data.accessToken)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong! Please Try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (


    <div className='relative w-full h-screen md:h-[760px] bg-green-100 overflow-hidden'>
      <div className='min-h-screen flex flex-col to-muted/20'>
        <div className='flex-1 flex items-center justify-center p-4'>
          <div className='w-full max-w-md space-y-6'>
            <div className='text-ceter space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-green-600'>Login to your account</h1>
              <p className='text-gray-600'>Start organizing your thoughts and ideas today</p>
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login to your account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Link className='text-sm' to={'/forgot-password'}>Forgot your Password?</Link>
                      <div className="relative">
                        <Input id="password" 
                        name="password" 
                        placeholder= "Enter your password"
                        value={formData.password} 
                        onChange={handleChange} 
                        type={showPassword ? "text" : "password"} 
                        required 
                        />
                        <Button variant='ghost' size='sm' className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}>
                          {
                            showPassword ?
                              <EyeOff className="w=4 h-4 text-gray-600" /> : <Eye className='w-4 h-4 text-gray-600' />
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button onClick={handleSubmit} type="submit" className="w-full bg-green-600 hover:bg-green-500">
                    {
                      isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Login to your account...

                        </>
                      ) : "Login"
                    }
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
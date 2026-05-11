import { getData } from '@/context/userContext'
import { Navigate } from 'react-router-dom'

const AttendeeRoute = ({ children }) => {
  const { user } = getData()
  if (!user) return <Navigate to='/login' />
  if (user.role !== 'attendee') return <Navigate to='/' />
  return children
}

export default AttendeeRoute
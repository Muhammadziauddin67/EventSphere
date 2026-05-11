import { getData } from '@/context/userContext'
import { Navigate } from 'react-router-dom'

const ExhibitorRoute = ({ children }) => {
  const { user } = getData()
  if (!user) return <Navigate to='/login' />
  if (user.role !== 'exhibitor') return <Navigate to='/' />
  return children
}

export default ExhibitorRoute
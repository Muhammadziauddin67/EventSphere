import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash2, Shield, Search } from 'lucide-react'
import { toast } from 'sonner'

const roleColors = {
  admin:     'bg-red-50 text-red-600',
  exhibitor: 'bg-amber-50 text-amber-600',
  attendee:  'bg-blue-50 text-blue-600',
}

const ManageUsers = () => {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/users', { headers })
      setUsers(res.data.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`http://localhost:8000/admin/users/${userId}/role`, { role }, { headers })
      toast.success('Role updated')
      fetchUsers()
    } catch (e) { toast.error('Failed to update role') }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      await axios.delete(`http://localhost:8000/admin/users/${userId}`, { headers })
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u._id !== userId))
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to delete') }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.role === filter
    return matchSearch && matchFilter
  })

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div>
      <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Users</h2>
          <p className='text-gray-400 text-sm'>{users.length} total</p>
        </div>
        <div className='flex gap-3 flex-wrap'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input type='text' placeholder='Search users...' value={search}
                   onChange={e => setSearch(e.target.value)}
                   className='h-9 pl-9 pr-4 rounded-lg border border-gray-200 text-sm
                              text-[#2C3E50] outline-none focus:border-[#FFA641] w-48' />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
                  className='h-9 px-3 rounded-lg border border-gray-200 text-sm
                             text-[#2C3E50] outline-none focus:border-[#FFA641]'>
            <option value='all'>All roles</option>
            <option value='admin'>Admin</option>
            <option value='exhibitor'>Exhibitor</option>
            <option value='attendee'>Attendee</option>
          </select>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50'>
              {['User', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                <th key={h} className='text-left px-5 py-3 text-xs font-bold text-gray-400
                                       uppercase tracking-wider'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {filtered.map(user => (
              <tr key={user._id} className='hover:bg-gray-50/50 transition-colors'>
                <td className='px-5 py-3'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-8 h-8 rounded-full bg-[#2C3E50] flex items-center
                                    justify-center text-white font-bold text-xs flex-shrink-0'>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <p className='text-sm font-semibold text-[#2C3E50]'>{user.username}</p>
                  </div>
                </td>
                <td className='px-5 py-3 text-sm text-gray-500'>{user.email}</td>
                <td className='px-5 py-3'>
                  <select value={user.role}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border-0
                                      outline-none cursor-pointer ${roleColors[user.role]}`}>
                    <option value='attendee'>Attendee</option>
                    <option value='exhibitor'>Exhibitor</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>
                <td className='px-5 py-3'>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${user.isVerified ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className='px-5 py-3 text-sm text-gray-400'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className='px-5 py-3'>
                  <button onClick={() => handleDelete(user._id)}
                          className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                                     hover:text-red-500 transition-colors'>
                    <Trash2 className='w-4 h-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className='text-gray-400 text-sm text-center py-12'>No users found.</p>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash2, Shield, Search } from 'lucide-react'
import { toast } from 'sonner'

const roleColors = {
  admin: 'bg-red-50 text-red-600',
  exhibitor: 'bg-amber-50 text-amber-600',
  attendee: 'bg-blue-50 text-blue-600',
}

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const token = localStorage.getItem('accessToken')
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

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Users</h2>
          <p className='text-gray-400 text-sm'>{users.length} total users</p>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search users...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm w-full md:w-56
                         focus:border-[#FFA641] outline-none'
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className='h-10 px-3 rounded-lg border border-gray-200 text-sm
                       focus:border-[#FFA641] outline-none'
          >
            <option value='all'>All roles</option>
            <option value='admin'>Admin</option>
            <option value='exhibitor'>Exhibitor</option>
            <option value='attendee'>Attendee</option>
          </select>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className='grid grid-cols-1 gap-3 md:hidden'>
        {filtered.map(user => (
          <div key={user._id} className='bg-white border border-gray-100 rounded-xl p-4'>

            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-[#2C3E50] text-white flex items-center justify-center font-bold'>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className='font-semibold text-[#2C3E50] text-sm'>{user.username}</p>
                  <p className='text-xs text-gray-400'>{user.email}</p>
                </div>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full font-bold ${roleColors[user.role]}`}>
                {user.role}
              </span>
            </div>

            <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
              <span>{user.isVerified ? 'Verified' : 'Pending'}</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => handleDelete(user._id)}
              className='w-full h-9 bg-red-50 text-red-500 rounded-lg text-xs font-bold'
            >
              Delete User
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className='hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden'>

        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 bg-gray-50'>
              {['User', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                <th key={h} className='text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {filtered.map(user => (
              <tr key={user._id} className='hover:bg-gray-50'>

                {/* User */}
                <td className='px-5 py-3'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center font-bold text-xs'>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <span className='text-sm font-semibold text-[#2C3E50]'>
                      {user.username}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className='px-5 py-3 text-sm text-gray-500'>
                  {user.email}
                </td>

                {/* Role */}
                <td className='px-5 py-3'>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-lg font-bold border outline-none ${roleColors[user.role]}`}
                  >
                    <option value='attendee'>Attendee</option>
                    <option value='exhibitor'>Exhibitor</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>

                {/* Verified */}
                <td className='px-5 py-3'>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${user.isVerified ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>

                {/* Joined */}
                <td className='px-5 py-3 text-sm text-gray-400'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className='px-5 py-3'>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className='p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className='text-center text-gray-400 py-10 text-sm'>
            No users found
          </p>
        )}
      </div>
    </div>
  )
}
export default ManageUsers
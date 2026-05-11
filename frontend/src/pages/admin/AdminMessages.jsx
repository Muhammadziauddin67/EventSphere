import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Send, Loader2 } from 'lucide-react'
import { getData } from '@/context/userContext'

const AdminMessages = () => {
  const { user }                          = getData()
  const [conversations, setConversations] = useState([])
  const [activeUser,    setActiveUser]    = useState(null)
  const [messages,      setMessages]      = useState([])
  const [newMsg,        setNewMsg]        = useState('')
  const [sending,       setSending]       = useState(false)
  const [unread,        setUnread]        = useState({})
  const bottomRef = useRef(null)
  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/messages', { headers })
      const seen = {}
      const convos = []
      const unreadMap = {}
      res.data.data.forEach(msg => {
        const other = msg.senderId._id === user._id ? msg.receiverId : msg.senderId
        if (!seen[other._id]) {
          seen[other._id] = true
          convos.push({ user: other, lastMsg: msg.content, time: msg.createdAt })
        }
        if (!msg.isRead && msg.receiverId._id === user._id) {
          unreadMap[other._id] = (unreadMap[other._id] || 0) + 1
        }
      })
      setConversations(convos)
      setUnread(unreadMap)
    } catch (e) { console.log(e) }
  }

  useEffect(() => { fetchMessages() }, [])

  useEffect(() => {
    if (!activeUser) return
    const fetchConvo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/admin/messages/${activeUser._id}`, { headers })
        setMessages(res.data.data)
        setUnread(prev => ({ ...prev, [activeUser._id]: 0 }))
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      } catch (e) { console.log(e) }
    }
    fetchConvo()
  }, [activeUser])

  const handleSend = async () => {
    if (!newMsg.trim() || !activeUser) return
    try {
      setSending(true)
      const res = await axios.post('http://localhost:8000/admin/messages', {
        receiverId: activeUser._id, content: newMsg.trim()
      }, { headers })
      setMessages(prev => [...prev, res.data.data])
      setNewMsg('')
      fetchMessages()
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) { console.log(e) }
    finally { setSending(false) }
  }

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0)

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <div className='flex items-center gap-3 mb-6'>
        <h2 className='text-xl font-bold text-[#2C3E50]'>Messages</h2>
        {totalUnread > 0 && (
          <span className='bg-[#FFA641] text-[#2C3E50] text-xs font-bold
                           px-2 py-0.5 rounded-full'>
            {totalUnread} unread
          </span>
        )}
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden flex h-[600px]'>

        {/* Sidebar */}
        <div className='w-72 border-r border-gray-100 flex flex-col flex-shrink-0'>
          <div className='px-4 py-3 border-b border-gray-100'>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Conversations</p>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {conversations.length === 0 ? (
              <p className='text-gray-300 text-xs text-center py-8 px-4'>
                No messages yet. Exhibitors will appear here when they contact you.
              </p>
            ) : (
              conversations.map(({ user: other, lastMsg, time }) => (
                <button key={other._id}
                        onClick={() => setActiveUser(other)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50
                                    hover:bg-gray-50 transition-colors
                                    ${activeUser?._id === other._id ? 'bg-[#FFA641]/10 border-l-2 border-l-[#FFA641]' : ''}`}>
                  <div className='flex items-center gap-2.5'>
                    <div className='relative'>
                      <div className='w-9 h-9 rounded-full bg-[#2C3E50] flex items-center
                                      justify-center text-white font-bold text-xs flex-shrink-0'>
                        {other.username?.[0]?.toUpperCase()}
                      </div>
                      {unread[other._id] > 0 && (
                        <div className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FFA641]
                                        rounded-full flex items-center justify-center
                                        text-[#2C3E50] text-[9px] font-bold'>
                          {unread[other._id]}
                        </div>
                      )}
                    </div>
                    <div className='overflow-hidden flex-1'>
                      <div className='flex justify-between items-center'>
                        <p className='text-sm font-semibold text-[#2C3E50] truncate'>{other.username}</p>
                        <p className='text-[10px] text-gray-300 flex-shrink-0 ml-1'>
                          {new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <span className={`text-[10px] px-1.5 rounded-full font-semibold
                          ${other.role === 'exhibitor'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'}`}>
                          {other.role}
                        </span>
                        <p className='text-xs text-gray-400 truncate'>{lastMsg}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        {!activeUser ? (
          <div className='flex-1 flex flex-col items-center justify-center text-gray-300 gap-2'>
            <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center'>
              <Send className='w-5 h-5 text-gray-300' />
            </div>
            <p className='text-sm'>Select a conversation</p>
          </div>
        ) : (
          <div className='flex-1 flex flex-col'>
            {/* Header */}
            <div className='px-5 py-3 border-b border-gray-100 flex items-center gap-3'>
              <div className='w-9 h-9 rounded-full bg-[#2C3E50] flex items-center
                              justify-center text-white font-bold text-sm'>
                {activeUser.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-semibold text-[#2C3E50]'>{activeUser.username}</p>
                <p className='text-xs text-gray-400 capitalize'>{activeUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.length === 0 ? (
                <p className='text-center text-gray-300 text-sm mt-8'>
                  No messages yet — start the conversation
                </p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId._id === user._id || msg.senderId === user._id
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm
                        ${isMe
                          ? 'bg-[#2C3E50] text-white rounded-br-sm'
                          : 'bg-gray-100 text-[#2C3E50] rounded-bl-sm'}`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className='px-4 py-3 border-t border-gray-100 flex gap-3'>
              <input
                type='text'
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Reply to ${activeUser.username}...`}
                className='flex-1 h-10 px-4 rounded-lg border border-gray-200 text-sm
                           text-[#2C3E50] outline-none focus:border-[#FFA641] transition-all'
              />
              <button onClick={handleSend} disabled={sending || !newMsg.trim()}
                      className='w-10 h-10 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-50
                                 text-[#2C3E50] rounded-lg flex items-center justify-center
                                 transition-colors flex-shrink-0'>
                {sending
                  ? <Loader2 className='w-4 h-4 animate-spin' />
                  : <Send className='w-4 h-4' />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMessages
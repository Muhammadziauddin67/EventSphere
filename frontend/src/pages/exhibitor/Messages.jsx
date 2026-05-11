import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Send, Loader2 } from 'lucide-react'
import { getData } from '@/context/userContext'


const Messages = () => {
  const { user } = getData()
  const [conversations, setConversations] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [admins, setAdmins] = useState([])
  const [showNew, setShowNew] = useState(false)
  const bottomRef = useRef(null)
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/messages', { headers })
        // derive unique conversations
        const seen = {}
        const convos = []
        res.data.data.forEach(msg => {
          const other = msg.senderId._id === user._id ? msg.receiverId : msg.senderId
          if (!seen[other._id]) {
            seen[other._id] = true
            convos.push({ user: other, lastMsg: msg.content, isRead: msg.isRead })
          }
        })
        setConversations(convos)
      } catch (e) { console.log(e) }
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    if (!activeUser) return
    const fetchConvo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/exhibitor/messages/${activeUser._id}`, { headers })
        setMessages(res.data.data)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      } catch (e) { console.log(e) }
    }
    fetchConvo()
  }, [activeUser])

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get('http://localhost:8000/exhibitor/contacts', { headers })
        setAdmins(res.data.data)
      } catch (e) { console.log(e) }
    }
    fetchAdmins()
  }, [])

  const handleSend = async () => {
    if (!newMsg.trim() || !activeUser) return
    try {
      setSending(true)
      const res = await axios.post('http://localhost:8000/exhibitor/messages', {
        receiverId: activeUser._id, content: newMsg.trim()
      }, { headers })
      setMessages(prev => [...prev, res.data.data])
      setNewMsg('')
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (e) { console.log(e) }
    finally { setSending(false) }
  }

  return (
    <div>
      <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Exhibitor Portal</p>
      <h2 className='text-2xl font-bold text-[#2C3E50] mb-6'>Messages</h2>

      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden
                      flex h-[600px]'>
        <div className='px-4 py-3 border-b border-gray-100'>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Conversations</p>
          <button onClick={() => setShowNew(!showNew)}
            className='w-full text-xs bg-[#FFA641] text-[#2C3E50] font-bold
                     py-1.5 rounded-lg hover:bg-[#ffb55a] transition-colors'>
            + New Message
          </button>
          {showNew && (
            <div className='mt-2 border border-gray-100 rounded-lg overflow-hidden'>
              {admins.map(admin => (
                <button key={admin._id}
                  onClick={() => { setActiveUser(admin); setShowNew(false) }}
                  className='w-full text-left px-3 py-2 hover:bg-gray-50
                           text-sm text-[#2C3E50] border-b border-gray-50
                           flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-full bg-[#2C3E50] flex items-center
                          justify-center text-white text-xs font-bold flex-shrink-0'>
                    {admin.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span className='font-semibold'>{admin.username}</span>
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
              ${admin.role === 'admin'
                        ? 'bg-[#2C3E50] text-white'
                        : 'bg-amber-50 text-amber-600'}`}>
                      {admin.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className='w-64 border-r border-gray-100 flex flex-col flex-shrink-0'>
          <div className='px-4 py-3 border-b border-gray-100'>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Conversations</p>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {conversations.length === 0 ? (
              <p className='text-gray-300 text-xs text-center py-8 px-4'>No conversations yet</p>
            ) : (
              conversations.map(({ user: other, lastMsg, isRead }) => (
                <button key={other._id}
                  onClick={() => setActiveUser(other)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50
                                    hover:bg-gray-50 transition-colors
                                    ${activeUser?._id === other._id ? 'bg-[#FFA641]/10' : ''}`}>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-8 h-8 rounded-full bg-[#2C3E50] flex items-center
                                    justify-center text-white font-bold text-xs flex-shrink-0'>
                      {other.username?.[0]?.toUpperCase()}
                    </div>
                    <div className='overflow-hidden'>
                      <p className='text-sm font-semibold text-[#2C3E50] truncate'>{other.username}</p>
                      <p className='text-xs text-gray-400 truncate'>{lastMsg}</p>
                    </div>
                    {!isRead && (
                      <div className='w-2 h-2 rounded-full bg-[#FFA641] flex-shrink-0 ml-auto' />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        {!activeUser ? (
          <div className='flex-1 flex items-center justify-center text-gray-300 text-sm'>
            Select a conversation to start messaging
          </div>
        ) : (
          <div className='flex-1 flex flex-col'>
            {/* Chat header */}
            <div className='px-5 py-3 border-b border-gray-100 flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-[#2C3E50] flex items-center
                              justify-center text-white font-bold text-xs'>
                {activeUser.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-semibold text-[#2C3E50]'>{activeUser.username}</p>
                <p className='text-xs text-gray-400 capitalize'>{activeUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.map(msg => {
                const isMe = msg.senderId._id === user._id ||
                  msg.senderId === user._id
                return (
                  <div key={msg._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm
                      ${isMe
                        ? 'bg-[#2C3E50] text-white rounded-br-sm'
                        : 'bg-gray-100 text-[#2C3E50] rounded-bl-sm'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1
                        ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className='px-4 py-3 border-t border-gray-100 flex gap-3'>
              <input
                type='text'
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder='Type a message...'
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

export default Messages
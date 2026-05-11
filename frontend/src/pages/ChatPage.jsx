import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Send, Loader2, MessageSquare, ArrowLeft } from 'lucide-react'
import { getData } from '@/context/userContext'
import { toast } from 'sonner'

const ChatPage = () => {
    const { user } = getData()
    const [contacts, setContacts] = useState([])
    const [activeUser, setActiveUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMsg, setNewMsg] = useState('')
    const [sending, setSending] = useState(false)
    const [loadingMsg, setLoadingMsg] = useState(false)
    const bottomRef = useRef(null)
    const token = localStorage.getItem('accessToken')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get('http://localhost:8000/attendee/chat/contacts', { headers })
            .then(res => setContacts(res.data.data))
            .catch(console.log)
    }, [])

    useEffect(() => {
        if (!activeUser) return
        setLoadingMsg(true)
        axios.get(`http://localhost:8000/attendee/chat/${activeUser._id}`, { headers })
            .then(res => {
                setMessages(res.data.data)
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
            })
            .catch(console.log)
            .finally(() => setLoadingMsg(false))
    }, [activeUser])

    const handleSend = async () => {
        if (!newMsg.trim() || !activeUser) return
        try {
            setSending(true)
            const res = await axios.post('http://localhost:8000/attendee/chat/message', {
                receiverId: activeUser._id, content: newMsg.trim()
            }, { headers })
            setMessages(prev => [...prev, res.data.data])
            setNewMsg('')
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        } catch (e) { toast.error('Failed to send') }
        finally { setSending(false) }
    }

    return (
        <div style={{ fontFamily: "'Jost', sans-serif" }}
            className='bg-[#f7f6f2] min-h-screen px-4 md:px-16 py-12'>
            <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Attendee Portal</p>
            <h1 className='text-2xl font-bold text-[#2C3E50] mb-6'>Chat with Exhibitors</h1>

            <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[600px]'>

                {/* Contacts sidebar */}
                <div className={`w-full md:w-72 border-r border-gray-100 flex flex-col flex-shrink-0 ${activeUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className='px-4 py-3 border-b border-gray-100'>
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Exhibitors</p>
                        <p className='text-xs text-gray-300 mt-0.5'>From events you've booked</p>
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        {contacts.length === 0 ? (
                            <div className='p-4 text-center'>
                                <MessageSquare className='w-8 h-8 text-gray-200 mx-auto mb-2' />
                                <p className='text-gray-300 text-xs'>
                                    Book a ticket to chat with exhibitors.
                                </p>
                            </div>
                        ) : (
                            contacts.map(contact => (
                                <button key={contact._id}
                                    onClick={() => setActiveUser(contact)}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-50
                                    hover:bg-gray-50 transition-colors
                                    ${activeUser?._id === contact._id
                                            ? 'bg-[#FFA641]/10 border-l-2 border-l-[#FFA641]'
                                            : ''}`}>
                                    <div className='flex items-center gap-2.5'>

                                        <div className='w-9 h-9 rounded-full bg-[#2C3E50] flex items-center
                                    justify-center text-white font-bold text-xs flex-shrink-0'>
                                            {contact.username?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className='text-sm font-semibold text-[#2C3E50]'>{contact.username}</p>
                                            <p className='text-xs text-gray-400'>{contact.company}</p>
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
                        <MessageSquare className='w-10 h-10' />
                        <p className='text-sm'>Select an exhibitor to start chatting</p>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col'>
                        <div className='px-5 py-3 border-b border-gray-100 flex items-center gap-3'>
                            <button
                                className='md:hidden text-[#FFA641]'
                                onClick={() => setActiveUser(null)}
                            >
                                <ArrowLeft className='w-5 h-5' />
                            </button>
                            <div className='w-9 h-9 rounded-full bg-[#2C3E50] flex items-center
                              justify-center text-white font-bold text-sm'>
                                {activeUser.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-[#2C3E50]'>{activeUser.username}</p>
                                <p className='text-xs text-gray-400'>{activeUser.company}</p>
                                {activeUser?.booth && (
                                    <p className='text-xs text-[#FFA641] font-medium'>
                                        Booth: {activeUser.booth.name || activeUser.booth}
                                    </p>
                                )}

                                {activeUser?.event && (
                                    <p className='text-xs text-gray-400'>
                                        Event: {activeUser.event.title || activeUser.event}
                                    </p>
                                )}

                                {activeUser?.approvedBooths?.length > 0 && (
                                    <p className='text-xs text-[#FFA641] font-medium'>
                                        Booths: {activeUser.approvedBooths.map(b => b.name || b).join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                            {loadingMsg ? (
                                <div className='flex justify-center pt-8'>
                                    <div className='w-6 h-6 border-4 border-[#FFA641] border-t-transparent
                                  rounded-full animate-spin' />
                                </div>
                            ) : messages.length === 0 ? (
                                <p className='text-center text-gray-300 text-sm mt-8'>
                                    Start the conversation!
                                </p>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.senderId._id === user._id || msg.senderId === user._id
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm break-words whitespace-pre-wrap overflow-hidden
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

                        <div className='px-4 py-3 border-t border-gray-100 flex gap-3'>
                            <input type='text' value={newMsg}
                                onChange={e => setNewMsg(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={`Message ${activeUser.username}...`}
                                className='flex-1 h-10 px-4 rounded-lg border border-gray-200 text-sm
                                text-[#2C3E50] outline-none focus:border-[#FFA641] transition-all' />
                            <button onClick={handleSend} disabled={sending || !newMsg.trim()}
                                className='w-10 h-10 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-50
                                 text-[#2C3E50] rounded-lg flex items-center justify-center
                                 transition-colors flex-shrink-0'>
                                {sending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage
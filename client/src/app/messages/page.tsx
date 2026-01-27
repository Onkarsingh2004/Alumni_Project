'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Search, Send, User, MoreVertical, Phone, Video, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';

const socket = io('http://localhost:5000');

export default function Chat() {
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [currentChat, setCurrentChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Initial Setup
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            socket.emit('join_room', parsedUser._id);
        }
        fetchConversations();

        // Check for direct chat link
        const targetUserId = searchParams.get('userId');
        const targetName = searchParams.get('name');
        const targetRole = searchParams.get('role');

        if (targetUserId && targetName) {
            const newChat = {
                _id: targetUserId,
                name: targetName,
                role: targetRole || 'User'
            };
            setCurrentChat(newChat);
            fetchMessages(targetUserId);
        }
    }, [searchParams]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Socket Listeners
    useEffect(() => {
        socket.on('receive_message', (data) => {
            if (currentChat && (data.sender === currentChat._id || data.sender._id === currentChat._id)) {
                setMessages((prev) => [...prev, data]);
                // Mark as read immediately if chat is open
                markMessagesAsRead(currentChat._id);
            } else {
                // Refresh conversations to show new message preview/unread indicator
                fetchConversations();
            }
            // Emit Delivered status
            socket.emit('message_delivered', { messageId: data._id, senderId: data.sender._id || data.sender });
        });

        socket.on('messages_read', ({ readerId }) => {
            if (currentChat && currentChat._id === readerId) {
                setMessages(prev => prev.map(msg =>
                    msg.sender === user._id ? { ...msg, status: 'read' } : msg
                ));
            }
        });

        socket.on('message_status_update', ({ messageId, status }) => {
            setMessages(prev => prev.map(msg =>
                msg._id === messageId ? { ...msg, status } : msg
            ));
        });

        socket.on('user_online', (userId) => {
            setOnlineUsers(prev => new Set(prev).add(userId));
        });
        socket.on('user_offline', (userId) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });
        socket.on('online_users_list', (users) => {
            setOnlineUsers(new Set(users));
        });

        return () => {
            socket.off('receive_message');
            socket.off('messages_read');
            socket.off('message_status_update');
            socket.off('user_online');
            socket.off('user_offline');
            socket.off('online_users_list');
        };
    }, [currentChat, user]);

    const markMessagesAsRead = async (senderId: string) => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/messages/read',
                { senderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            socket.emit('read_message', { senderId, readerId: user._id });
        } catch (err) { console.error('Mark read error', err); }
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/messages/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
            markMessagesAsRead(userId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartChat = (conversation: any) => {
        setCurrentChat(conversation);
        fetchMessages(conversation._id);
        // On mobile, you might want to switch views here
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat || !user) return;

        const messageData = {
            receiverId: currentChat._id,
            content: newMessage,
            senderName: user.name
        };

        try {
            // 1. Save to DB via API
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/messages',
                messageData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. Add to local state
            const savedMessage = res.data;
            setMessages((prev) => [...prev, savedMessage]);
            setNewMessage('');

            // 3. Emit socket event
            socket.emit('send_message', {
                ...savedMessage,
                sender: user._id, // Ensure format matches
                receiver: currentChat._id
            });

            // 4. Update conversation list preview
            fetchConversations();

        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[url('/grid-bg.svg')] bg-cover flex flex-col">
            <DashboardNavbar />

            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl h-[85vh] glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">

                    {/* Sidebar */}
                    <div className={`w-full md:w-1/3 bg-dark-bg/40 border-r border-white/10 flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-text-muted h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {loading ? (
                                <div className="text-center text-text-muted mt-10">Loading chats...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="text-center text-text-muted mt-10">
                                    <p>No conversations found.</p>
                                    <p className="text-sm">Start networking with Alumni!</p>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => (
                                    <motion.div
                                        key={conv._id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleStartChat(conv)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${currentChat?._id === conv._id
                                            ? 'bg-primary/20 border border-primary/30'
                                            : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                {conv.name.charAt(0)}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-bg ${onlineUsers.has(conv._id) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                                                <span className="text-xs text-text-muted">
                                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-text-muted'}`}>{conv.lastMessage}</p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="ml-2 min-w-[20px] h-5 bg-green-500 rounded-full text-xs flex items-center justify-center text-white font-bold px-1.5 shadow-lg shadow-green-500/20">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`w-full md:w-2/3 flex flex-col bg-dark-bg/20 ${!currentChat ? 'hidden md:flex' : 'flex'}`}>
                        {currentChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark-bg/40 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setCurrentChat(null)}
                                            className="md:hidden text-text-muted hover:text-white"
                                        >
                                            Back
                                        </button>
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {currentChat.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{currentChat.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${onlineUsers.has(currentChat._id) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                                <span className="text-xs text-text-muted capitalize">{onlineUsers.has(currentChat._id) ? 'Online' : 'Offline'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-text-muted">
                                        <button className="hover:text-primary transition-colors"><Phone size={20} /></button>
                                        <button className="hover:text-primary transition-colors"><Video size={20} /></button>
                                        <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                    {messages.map((msg, index) => {
                                        const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={index}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe
                                                    ? 'bg-primary text-white rounded-br-none'
                                                    : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <p className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-text-muted'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        {isMe && (
                                                            <span>
                                                                {msg.status === 'read' ? (
                                                                    <CheckCheck size={14} className="text-cyan-300" />
                                                                ) : msg.status === 'delivered' ? (
                                                                    <CheckCheck size={14} className="text-white/70" />
                                                                ) : (
                                                                    <Check size={14} className="text-white/70" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 md:p-6 border-t border-white/10 bg-dark-bg/40 backdrop-blur-md">
                                    <form onSubmit={sendMessage} className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 bg-dark-bg/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="bg-primary hover:bg-blue-600 text-white rounded-xl p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-8 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <User size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                                <p>Choose a contact from the sidebar to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


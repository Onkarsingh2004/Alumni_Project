'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Video, Users, ExternalLink, ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() for Next.js 15+ compatibility
    const { id } = React.use(params);
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        if (id) fetchEvent(token, id);
    }, [id]);

    const fetchEvent = async (token: string | null, eventId: string) => {
        if (!token) return;
        try {
            // Note: Use the existing logic to filter from all events or create a new endpoint
            // For now, let's assume we can fetch all and find one, or update backend to support GET /:id
            // Ideally: GET /api/events/:id
            // Since we only have GET /api/events, let's fetch list and find. 
            // Better yet, let's add the endpoint if it doesn't exist.
            // Check server routes... assuming it might need adding.

            // Wait, standard practice is to have a detail endpoint. 
            // If strictly following user request with existing setup, I might scan list.
            // But let's try to fetch specific one.

            const res = await axios.get(`http://localhost:5000/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent(res.data);
        } catch (err) {
            console.error(err);
            // Fallback if individual endpoint not waiting
            fetchFromList(token, eventId);
        } finally {
            setLoading(false);
        }
    };

    const fetchFromList = async (token: string | null, eventId: string) => {
        try {
            const res = await axios.get('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const found = res.data.find((e: any) => e._id === eventId);
            setEvent(found);
        } catch (err) {
            console.error(err);
        }
    }

    const handleRegister = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`http://localhost:5000/api/events/${id}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvent({ ...event, attendees: res.data });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    };

    if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Event not found</div>;

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-5xl mx-auto p-6">
                <button onClick={() => router.back()} className="text-text-muted hover:text-white flex items-center gap-2 mb-6">
                    <ArrowLeft size={20} /> Back to Events
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    <div className="h-64 bg-linear-to-r from-blue-900 via-purple-900 to-indigo-900 relative">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-0 left-0 p-8 w-full bg-linear-to-t from-dark-bg/90 to-transparent">
                            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                {event.type}
                            </span>
                            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                            <div className="flex items-center gap-6 text-white/80">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    Hosted by {event.host?.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">About this Event</h3>
                                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Attendees ({event.attendees.length})</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.attendees.length > 0 ? (
                                        event.attendees.map((att: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                                                    {typeof att === 'object' ? att.name?.charAt(0) : 'U'}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {typeof att === 'object' ? att.name : 'Unknown'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted italic">Be the first to join!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-card bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="font-bold mb-4 text-lg">Event Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <Video size={20} className="text-primary" />
                                        <div>
                                            <p className="text-white text-sm font-medium">Platform</p>
                                            <p className="text-xs">Online (Zoom/Meet)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <Calendar size={20} className="text-primary" />
                                        <div>
                                            <p className="text-white text-sm font-medium">Date & Time</p>
                                            <p className="text-xs">{new Date(event.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted">
                                        <Users size={20} className="text-primary" />
                                        <div>
                                            <p className="text-white text-sm font-medium">Capacity</p>
                                            <p className="text-xs">Unlimited</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {event.attendees.some((att: any) => (typeof att === 'string' ? att : att._id) === user?._id) ? (
                                        <div className="w-full bg-green-500/20 text-green-500 border border-green-500/50 py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Registered
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            Register for Event
                                        </button>
                                    )}

                                    {event.link && event.attendees.some((att: any) => (typeof att === 'string' ? att : att._id) === user?._id) && (
                                        <a
                                            href={event.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 w-full block text-center text-sm text-primary hover:text-white transition-colors"
                                        >
                                            Join Meeting Link <ExternalLink size={14} className="inline ml-1" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Video, Users, ExternalLink, Plus, X } from 'lucide-react';

export default function Events() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<any>(null);

    // New Event Form
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', date: '', type: 'webinar', link: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchEvents(token);
    }, []);

    const fetchEvents = async (token: string | null) => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/events', newEvent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewEvent({ title: '', description: '', date: '', type: 'webinar', link: '' });
            fetchEvents(token);
        } catch (err) {
            alert('Failed to create event');
        }
    };

    const handleRegister = async (eventId: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`http://localhost:5000/api/events/${eventId}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.map(e => e._id === eventId ? { ...e, attendees: res.data } : e));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Events & Webinars
                        </h1>
                        <p className="text-text-muted mt-1">Learn, network, and grow with community events.</p>
                    </div>
                    {user?.role === 'alumni' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-secondary hover:bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                        >
                            <Plus size={18} /> Host Event
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? <p>Loading events...</p> : events.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all border border-white/5 flex flex-col cursor-pointer group"
                            onClick={() => window.location.href = `/events/${event._id}`}
                        >
                            <div className="h-40 bg-linear-to-br from-blue-900 to-purple-900 p-6 flex flex-col justify-between relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Calendar size={100} />
                                </div>
                                <span className="bg-black/30 w-max px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider backdrop-blur-sm relative z-10">
                                    {event.type}
                                </span>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-1">{new Date(event.date).toLocaleDateString()}</h3>
                                    <p className="text-white/70">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col bg-dark-bg/40">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="space-y-2 mb-6 text-sm text-text-muted">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} /> Hosted by {event.host?.name || 'Alumni'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Video size={16} /> Online Event
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {event.attendees && event.attendees.slice(0, 3).map((_: any, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-dark-bg flex items-center justify-center text-xs">
                                                <Users size={12} />
                                            </div>
                                        ))}
                                        {event.attendees && event.attendees.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-white/10 border border-dark-bg flex items-center justify-center text-xs">
                                                +{event.attendees.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    {event.attendees && event.attendees.includes(user?._id) ? (
                                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                                            Registered
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRegister(event._id); }}
                                            className="text-primary hover:text-white font-medium text-sm transition-colors z-20 relative"
                                        >
                                            Register Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card-bg w-full max-w-lg rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Host an Event</h3>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <input
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                placeholder="Event Title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none h-24 resize-none"
                                placeholder="Description"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="datetime-local"
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-white/70"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-white/70"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                >
                                    <option value="webinar">Webinar</option>
                                    <option value="meetup">Meetup</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                            <input
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                placeholder="Link (Zoom/Meet)"
                                value={newEvent.link}
                                onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                            />

                            <button type="submit" className="w-full bg-secondary hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors">
                                Create Event
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

        </div>
    );
}

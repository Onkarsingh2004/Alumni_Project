'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, GraduationCap, MessageCircle, X } from 'lucide-react';

export default function Mentors() {
    const router = useRouter();
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        company: '',
        domain: '',
        skills: ''
    });

    // Modal State
    const [selectedMentor, setSelectedMentor] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState('');

    useEffect(() => {
        fetchMentors();
    }, [filters]); // Re-fetch when filters change (debounce could be better)

    const fetchMentors = async () => {
        try {
            const token = localStorage.getItem('token');
            // Construct query string
            const params = new URLSearchParams();
            if (filters.company) params.append('company', filters.company);
            if (filters.domain) params.append('domain', filters.domain);
            // Simple debounce

            const res = await axios.get(`http://localhost:5000/api/profiles/alumni?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMentors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const openRequestModal = (mentor: any) => {
        setSelectedMentor(mentor);
        setMessage(`Hi ${mentor.user.name}, I would like to request mentorship from you regarding...`);
        setRequestStatus('');
    };

    const sendRequest = async () => {
        if (!message) return;
        setRequestLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/mentorship/request', {
                alumniId: selectedMentor.user._id,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequestStatus('success');
            setTimeout(() => {
                setSelectedMentor(null);
                setRequestStatus('');
            }, 1500);
        } catch (err: any) {
            setRequestStatus(err.response?.data?.message || 'Failed to send request');
        } finally {
            setRequestLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Find a Mentor
                        </h1>
                        <p className="text-text-muted mt-1">Connect with alumni who have walked your path.</p>
                    </div>

                </div>

                {/* Search Bar */}
                <div className="glass-card p-4 rounded-xl mb-8 grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-text-muted" size={18} />
                        <input
                            name="company"
                            placeholder="Search by Company (e.g. Google)"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary"
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 text-text-muted" size={18} />
                        <select
                            name="domain"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-text-muted"
                            onChange={handleSearchChange}
                        >
                            <option value="">All Domains</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Data Science">Data Science</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading mentors...</p>
                    ) : mentors.map((mentor, idx) => (
                        <motion.div
                            key={mentor._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <GraduationCap size={40} className="text-white/5 rotate-12" />
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                                    {mentor.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{mentor.user.name}</h3>
                                    <p className="text-primary text-sm">{mentor.role} @ {mentor.company}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <Briefcase size={16} />
                                    <span>{mentor.experience} Years Experience</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <MapPin size={16} />
                                    <span>{mentor.domain}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {mentor.skills.slice(0, 3).map((skill: string, i: number) => (
                                    <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-md text-text-muted border border-white/5">
                                        {skill}
                                    </span>
                                ))}
                                {mentor.skills.length > 3 && <span className="text-xs text-text-muted">+{mentor.skills.length - 3}</span>}
                            </div>

                            <button
                                onClick={() => openRequestModal(mentor)}
                                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:border-primary"
                            >
                                <MessageCircle size={18} /> Request Mentorship
                            </button>
                        </motion.div>
                    ))}

                    {!loading && mentors.length === 0 && (
                        <p className="text-text-muted col-span-3 text-center py-20">No mentors found matching your criteria.</p>
                    )}
                </div>
            </div>

            {/* Request Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card-bg w-full max-w-md rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Request Mentorship</h3>
                            <button onClick={() => setSelectedMentor(null)} className="text-text-muted hover:text-white"><X size={24} /></button>
                        </div>

                        {requestStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-green-400">Request Sent!</h4>
                                <p className="text-text-muted mt-2">The mentor will be notified.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-text-muted mb-4">
                                    Send a personalized message to <b>{selectedMentor.user.name}</b>. Be clear about what you need help with.
                                </p>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 h-32 mb-4 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Hi, I'm a 3rd year student interested in..."
                                ></textarea>

                                {requestStatus && <p className="text-red-400 text-sm mb-4">{requestStatus}</p>}

                                <div className="flex gap-3">
                                    <button onClick={() => setSelectedMentor(null)} className="flex-1 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                                    <button
                                        onClick={sendRequest}
                                        disabled={requestLoading}
                                        className="flex-1 bg-primary hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                                    >
                                        {requestLoading ? 'Sending...' : 'Send Request'}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}

        </div>
    );
}

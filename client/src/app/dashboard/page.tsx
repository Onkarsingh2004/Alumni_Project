'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardNavbar from '@/components/DashboardNavbar';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
        } else {
            setUser(JSON.parse(userData));
            fetchRequests(token);
        }
    }, [router]);

    const fetchRequests = async (token: string) => {
        try {
            const res = await axios.get('http://localhost:5000/api/mentorship/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (requestId: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/mentorship/respond', {
                requestId,
                status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI
            setRequests(requests.map(req => req._id === requestId ? { ...req, status } : req));
        } catch (err) {
            alert('Action failed');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto p-6">
                <div className="glass-card p-8 rounded-2xl mb-8 flex justify-between items-center bg-linear-to-r from-blue-900/20 to-purple-900/20">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                        <p className="text-text-muted mt-2 capitalize">Role: <span className={`text-white px-2 py-0.5 rounded text-sm ${user.role === 'alumni' ? 'bg-secondary' : 'bg-primary'}`}>{user.role}</span></p>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm text-text-muted text-right">Complete your profile to get better recommendations.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Mentorship Requests Section */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="text-primary" />
                                {user.role === 'alumni' ? 'Mentorship Requests' : 'Your Applications'}
                            </h2>

                            <div className="space-y-4">
                                {loading ? <p>Loading...</p> : requests.length === 0 ? (
                                    <div className="glass-card p-8 rounded-xl text-center text-text-muted border-dashed border border-white/10">
                                        <p>No requests found.</p>
                                        {user.role === 'student' && <button onClick={() => router.push('/mentors')} className="text-primary mt-2 hover:underline">Find a mentor</button>}
                                    </div>
                                ) : (
                                    requests.map((req) => (
                                        <motion.div
                                            key={req._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-card p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        req.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                                                            'bg-red-500/20 text-red-500'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                    <span className="text-text-muted text-xs">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-lg">
                                                    {user.role === 'alumni' ? req.student.name : req.alumni.name}
                                                </h4>
                                                <p className="text-text-muted text-sm mt-1 bg-black/20 p-3 rounded-lg border border-white/5">
                                                    "{req.message}"
                                                </p>
                                            </div>

                                            {/* Actions for Alumni */}
                                            {user.role === 'alumni' && req.status === 'pending' && (
                                                <div className="flex gap-2 self-start md:self-center">
                                                    <button
                                                        onClick={() => handleRequestAction(req._id, 'accepted')}
                                                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 p-2 rounded-lg transition-colors" title="Accept"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req._id, 'rejected')}
                                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors" title="Reject"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Actions for Student (Static for now) */}
                                            {user.role === 'student' && req.status === 'accepted' && (
                                                <div className="self-center">
                                                    <button className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm">
                                                        Go to Chat
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-xl">
                            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-lg text-center">
                                    <h4 className="text-2xl font-bold text-blue-400">{requests.filter(r => r.status === 'accepted').length}</h4>
                                    <p className="text-xs text-text-muted">Mentorships</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg text-center">
                                    <h4 className="text-2xl font-bold text-purple-400">0</h4>
                                    <p className="text-xs text-text-muted">Events</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

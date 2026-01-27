'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap, Github, Linkedin, MessageCircle, ArrowLeft, Building, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MentorDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params for Next.js 15+
    const { id } = React.use(params);
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (id) fetchProfile(token, id);
    }, [id]);

    const fetchProfile = async (token: string | null, profileId: string) => {
        if (!token) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/profiles/alumni/${profileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading...</div>;
    if (!profile) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Mentor not found</div>;

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-5xl mx-auto p-6">
                <button onClick={() => router.back()} className="text-text-muted hover:text-white flex items-center gap-2 mb-6">
                    <ArrowLeft size={20} /> Back to Mentors
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 rounded-2xl h-fit"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-purple-500/20">
                                {profile.user?.name?.charAt(0)}
                            </div>
                            <h1 className="text-2xl font-bold mb-1">{profile.user?.name}</h1>
                            <p className="text-primary font-medium mb-1">{profile.role}</p>
                            <div className="flex items-center gap-1 text-text-muted text-sm mb-6">
                                <Building size={14} /> @ {profile.company}
                            </div>

                            <div className="w-full space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-text-muted text-sm">
                                    <MapPin size={16} className="text-primary" />
                                    <span>{profile.domain}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-muted text-sm">
                                    <Briefcase size={16} className="text-primary" />
                                    <span>{profile.experience} Years Experience</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/messages?userId=${profile.user._id}&name=${encodeURIComponent(profile.user.name)}&role=${encodeURIComponent('Alumni')}`)}
                                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} /> Message Mentor
                            </button>

                            <div className="flex justify-center gap-4 mt-6">
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors">
                                        <Github size={24} />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors">
                                        <Linkedin size={24} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Detailed Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Skills */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code className="text-primary" /> Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.length > 0 ? (
                                    profile.skills.map((skill: string, i: number) => (
                                        <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium hover:border-primary/50 transition-colors">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-text-muted">No specific skills listed.</p>
                                )}
                            </div>
                        </div>

                        {/* About / Description */}
                        {/* Note: The AlumniProfile model currently doesn't have a 'bio' or 'description' field explicitly shown in step 397 (file view). 
                            It has 'role', 'domain', 'experience', 'skills'. 
                            I'll display a generic section or checking if I missed a field.
                            Checking model Step 397: `company`, `role`, `experience`, `domain`, `skills`, `isMentorshipAvailable`, `github`, `linkedin`.
                            No 'bio'. I will display these fields nicely.
                        */}

                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <GraduationCap className="text-primary" /> Mentorship Profile
                            </h3>
                            <div className="space-y-4 text-text-muted">
                                <p>
                                    As a <b>{profile.domain}</b> professional with <b>{profile.experience} years</b> of experience,
                                    I am currently working as a <b>{profile.role}</b> at <b>{profile.company}</b>.
                                </p>
                                <p>
                                    {profile.isMentorshipAvailable
                                        ? "I am currently accepting new mentorship requests. Feel free to reach out!"
                                        : "I am currently not accepting new mentorship requests."}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { Save, AlertCircle, Camera, User as UserIcon } from 'lucide-react';

export default function Profile() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Unified state for both roles
    const [formData, setFormData] = useState({
        // ... (existing fields)
        universityId: '',
        branch: '',
        year: '',
        // Alumni fields
        company: '',
        role: '',
        experience: 0,
        domain: '',
        // Common
        skills: '',
        linkedin: '',
        github: '',
        isMentorshipAvailable: true,
        avatar: '' // Add avatar field
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.avatar) setImagePreview(parsedUser.avatar);

        // Fetch existing profile
        const fetchProfile = async () => {
            // ... existing fetch logic
            // I will maintain the existing logic but just update this block
            try {
                const res = await axios.get('http://localhost:5000/api/profiles/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = res.data;
                setFormData({
                    universityId: data.universityId || '',
                    branch: data.branch || '',
                    year: data.year || '',
                    company: data.company || '',
                    role: data.role || '',
                    experience: data.experience || 0,
                    domain: data.domain || '',
                    skills: data.skills ? data.skills.join(', ') : '',
                    linkedin: data.linkedin || '',
                    github: data.github || '',
                    isMentorshipAvailable: data.isMentorshipAvailable ?? true,
                    avatar: data.user?.avatar || '' // Assuming populated
                });
                if (data.user?.avatar) setImagePreview(data.user.avatar);
            } catch (err) {
                console.log("No profile found or error fetching");
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // Here we would typically upload the file or set it to formData
                // For this demo, let's assume we might send base64 or just show preview
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ... (onChange, onSubmit)

    // Render part
    // ...


    const onChange = (e: any) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s), // Convert comma string to array
                experience: Number(formData.experience)
            };

            await axios.post('http://localhost:5000/api/profiles', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Profile updated successfully!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetching || !user) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-4xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8"
                >
                    <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Edit Profile
                    </h1>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            <AlertCircle size={18} />
                            {message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">

                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-primary transition-all shadow-xl bg-dark-bg relative">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
                                            <span className="text-4xl font-bold text-white">{user?.name?.charAt(0)}</span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <Camera size={32} className="text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-dark-bg">
                                    <Camera size={16} className="text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <p className="text-sm text-text-muted mt-3">Click to upload photo</p>
                        </div>

                        {/* Common Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={onChange}
                                    placeholder="React, Node.js, Leadership"
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-2">LinkedIn URL</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={onChange}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Role Specific Fields */}
                        {user.role === 'student' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Branch</label>
                                        <input
                                            type="text"
                                            name="branch"
                                            value={formData.branch}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-white"
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">University ID</label>
                                    <input
                                        type="text"
                                        name="universityId"
                                        value={formData.universityId}
                                        onChange={onChange}
                                        className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {user.role === 'alumni' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Current Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Job Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Domain</label>
                                        <select
                                            name="domain"
                                            value={formData.domain}
                                            onChange={onChange}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none text-white"
                                        >
                                            <option value="">Select Domain</option>
                                            <option value="Frontend">Frontend Development</option>
                                            <option value="Backend">Backend Development</option>
                                            <option value="Fullstack">Full Stack</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="AI/ML">AI / ML</option>
                                            <option value="Management">Product Management</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <input
                                        type="checkbox"
                                        name="isMentorshipAvailable"
                                        checked={formData.isMentorshipAvailable}
                                        onChange={onChange}
                                        className="w-5 h-5 accent-primary"
                                    />
                                    <label className="text-sm">Available for Mentorship? (Students can request guidance)</label>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}

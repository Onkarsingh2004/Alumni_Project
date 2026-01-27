'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { name, email, password, confirmPassword, role } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const setRole = (r: string) => setFormData({ ...formData, role: r });

    const validateForm = () => {
        if (!name || name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...dataToSend } = formData;

            // Assuming backend is running on port 5000
            const res = await axios.post('http://localhost:5000/api/auth/register', dataToSend);
            console.log(res.data);
            // Save token (in real app, use safer storage or cookies)
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            router.push('/dashboard'); // Redirect to dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/grid-bg.svg')] bg-cover relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Join the Network
                    </h2>
                    <p className="text-text-muted mt-2">Connect, mentor, and grow.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="flex bg-card-bg p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${role === 'student'
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                        >
                            <User size={16} /> Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('alumni')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${role === 'alumni'
                                ? 'bg-secondary text-white shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                        >
                            <GraduationCap size={16} /> Alumni
                        </button>
                    </div>

                    <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="Full Name"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="College Email ID"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            placeholder="Confirm Password"
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="my-6 border-b border-white/10" />

                <p className="text-center text-text-muted text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-blue-400 transition-colors font-semibold">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

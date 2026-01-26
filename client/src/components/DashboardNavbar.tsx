'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogOut, User, Users, Briefcase, Calendar, MessageCircle } from 'lucide-react';

export default function DashboardNavbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <nav className="backdrop-blur-md border-b border-white/10 bg-dark-bg/80 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/dashboard" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    <GraduationCap className="text-blue-500" />
                    AlumniPortal
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/mentors" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <Users size={18} /> <span className="hidden md:inline">Mentors</span>
                    </Link>
                    <Link href="/events" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <Calendar size={18} /> <span className="hidden md:inline">Events</span>
                    </Link>
                    <Link href="/community" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <MessageCircle size={18} /> <span className="hidden md:inline">Community</span>
                    </Link>
                    <Link href="/jobs" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <Briefcase size={18} /> <span className="hidden md:inline">Jobs</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        <User size={18} /> <span className="hidden md:inline">Profile</span>
                    </Link>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

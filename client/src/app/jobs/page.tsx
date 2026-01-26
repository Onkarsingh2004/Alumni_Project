'use client';

import DashboardNavbar from '@/components/DashboardNavbar';
import { Briefcase } from 'lucide-react';

export default function Jobs() {
    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />
            <div className="max-w-7xl mx-auto p-6 text-center py-20">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase size={40} className="text-text-muted" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Job Board Coming Soon</h1>
                <p className="text-text-muted">We are building a dedicated portal for exclusive alumni referrals and job postings.</p>
                <p className="text-text-muted mt-2">Stay tuned!</p>
            </div>
        </div>
    );
}

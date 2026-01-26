'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Briefcase, Calendar, ArrowRight, Lightbulb } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-dark-bg/80">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
        <GraduationCap className="text-blue-500" />
        AlumniPortal
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/login" className="text-text-muted hover:text-white transition-colors">Login</Link>
        <Link href="/register" className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/25">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer"
  >
    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-400 group-hover:text-blue-300" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-text-muted">{desc}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('/grid-bg.svg')] opacity-30 z-0" />
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                🚀 Constructing the Future, Together
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Connect with <br />
                <span className="text-gradient">Alumni Legends</span>
              </h1>
              <p className="text-xl text-text-muted mb-8 max-w-lg leading-relaxed">
                Bridge the gap between campus and career. Get mentorship, find jobs, and build a network that lasts a lifetime.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 flex items-center gap-2">
                  Join Now <ArrowRight size={20} />
                </Link>
                <Link href="/login" className="glass-card px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-all">
                  Explore Network
                </Link>
              </div>

              <div className="mt-12 flex gap-8">
                <div>
                  <h4 className="text-3xl font-bold text-white">5k+</h4>
                  <p className="text-text-muted text-sm">Active Alumni</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">100+</h4>
                  <p className="text-text-muted text-sm">Top Companies</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">500+</h4>
                  <p className="text-text-muted text-sm">Mentorships</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Abstract 3D-like representation */}
              <div className="relative w-full h-[500px] glass-card rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-900/40 to-transparent" />

                <div className="text-center relative z-10">
                  <div className="w-24 h-24 bg-linear-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center transform rotate-12 shadow-2xl">
                    <GraduationCap size={48} className="text-white -rotate-12" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-dark-bg/80 p-4 rounded-xl border border-white/5 w-64 mx-auto flex items-center gap-3 backdrop-blur-md animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><Briefcase size={20} /></div>
                      <div className="text-left">
                        <p className="text-xs text-text-muted">Just Now</p>
                        <p className="font-semibold text-sm">New Job Posted at Google</p>
                      </div>
                    </div>
                    <div className="bg-dark-bg/80 p-4 rounded-xl border border-white/5 w-64 mx-auto flex items-center gap-3 backdrop-blur-md" style={{ animationDelay: '1s' }}>
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><Lightbulb size={20} /></div>
                      <div className="text-left">
                        <p className="text-xs text-text-muted">2 mins ago</p>
                        <p className="font-semibold text-sm">Mentorship Request Accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Join Alumni Portal?</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Unlock improved career opportunities and professional growth through our comprehensive suite of tools.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Mentorship"
              desc="Connect with experienced seniors for 1:1 guidance across various domains like Tech, Management, and more."
              delay={0}
            />
            <FeatureCard
              icon={Briefcase}
              title="Job Board"
              desc="Exclusive job openings and internship opportunities referred directly by alumni working in top firms."
              delay={0.1}
            />
            <FeatureCard
              icon={Calendar}
              title="Events & Webinars"
              desc="Participate in workshops, hackathons, and networking sessions hosted by the community."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-text-muted">
        <p>© 2026 Alumni Portal. Built for the Future.</p>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '@/components/DashboardNavbar';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Send, Plus, X } from 'lucide-react';

export default function Community() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchPosts(token);
    }, []);

    const fetchPosts = async (token: string | null) => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/community', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Handle logout
            return null;
        }
        return token;
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = verifyToken();
        try {
            await axios.post('http://localhost:5000/api/community', {
                ...newPost,
                tags: newPost.tags.split(',').map(tag => tag.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewPost({ title: '', content: '', tags: '' });
            fetchPosts(token); // Refresh
        } catch (err) {
            alert('Failed to create post');
        }
    };

    const handleLike = async (postId: string) => {
        const token = verifyToken();
        try {
            const res = await axios.put(`http://localhost:5000/api/community/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic or real update
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <DashboardNavbar />

            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Community Forum
                        </h1>
                        <p className="text-text-muted mt-1">Discuss, ask, and share knowledge.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} /> New Post
                    </button>
                </div>

                <div className="space-y-6">
                    {loading ? <p>Loading discussions...</p> : posts.map((post) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-xl border border-white/5"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                                    <p className="text-text-muted text-sm flex gap-2 items-center">
                                        Posted by <span className="text-white font-medium">{post.author.name}</span> • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {post.tags.map((tag: string, i: number) => (
                                        <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-full text-blue-300 border border-white/10">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
                                {post.content}
                            </p>

                            <div className="flex items-center gap-6 border-t border-white/10 pt-4">
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className={`flex items-center gap-2 transition-colors ${post.likes.includes(user?._id) ? 'text-red-500' : 'text-text-muted hover:text-red-400'}`}
                                >
                                    <Heart size={20} fill={post.likes.includes(user?._id) ? "currentColor" : "none"} />
                                    <span>{post.likes.length}</span>
                                </button>
                                <button className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                                    <MessageSquare size={20} />
                                    <span>{post.comments.length} Comments</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Create Post Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card-bg w-full max-w-lg rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create Discussion</h3>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <input
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                placeholder="Title"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none h-32 resize-none"
                                placeholder="What's on your mind?"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                required
                            />
                            <input
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none"
                                placeholder="Tags (comma separated, e.g. Career, Tech)"
                                value={newPost.tags}
                                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                            />
                            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors">
                                Post
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

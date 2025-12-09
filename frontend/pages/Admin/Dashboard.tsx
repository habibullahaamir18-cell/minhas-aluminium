import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderPlus,
    Settings,
    ArrowUpRight,
    Users,
    Briefcase,
    Calendar,
    Activity
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { getApiUrl } from '../../src/config/api';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        years: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, infoRes, clientsRes] = await Promise.all([
                    axios.get(getApiUrl('api/projects')),
                    axios.get(getApiUrl('api/info')),
                    axios.get(getApiUrl('api/clients'))
                ]);

                const infoStats = infoRes.data.stats || [];
                setStats({
                    projects: projectsRes.data.length,
                    clients: clientsRes.data.length,
                    years: infoStats.find((s: any) => s.label.includes('Years'))?.value || 0
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="text-sm text-gray-500 bg-secondary px-4 py-2 rounded-full border border-white/5 w-fit">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={item} className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Briefcase size={64} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-gray-400 font-medium">Total Projects</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-white">{stats.projects}</h3>
                        <span className="text-sm text-green-400 flex items-center gap-1">
                            <ArrowUpRight size={14} /> Live
                        </span>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                            <Users size={24} />
                        </div>
                        <span className="text-gray-400 font-medium">Happy Clients</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-white">{stats.clients}+</h3>
                        <span className="text-sm text-gray-500">Satisfied</span>
                    </div>
                </motion.div>

                <motion.div variants={item} className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={64} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                            <Calendar size={24} />
                        </div>
                        <span className="text-gray-400 font-medium">Experience</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-white">{stats.years}</h3>
                        <span className="text-sm text-gray-500">Years Active</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary rounded-xl border border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-accent" /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/admin/projects" className="flex flex-col items-center justify-center p-6 bg-dark/50 rounded-lg border border-white/5 hover:border-accent hover:bg-dark transition-all group">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3 group-hover:scale-110 transition-transform">
                                <FolderPlus size={20} />
                            </div>
                            <span className="text-white font-medium">Add New Project</span>
                            <span className="text-xs text-gray-500 mt-1">Update portfolio</span>
                        </Link>
                        <Link to="/admin/info" className="flex flex-col items-center justify-center p-6 bg-dark/50 rounded-lg border border-white/5 hover:border-accent hover:bg-dark transition-all group">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                <Settings size={20} />
                            </div>
                            <span className="text-white font-medium">Update Info</span>
                            <span className="text-xs text-gray-500 mt-1">Edit contact details</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-secondary rounded-xl border border-white/5 p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-600 rounded-full flex items-center justify-center text-dark mb-4 shadow-lg shadow-accent/20">
                        <LayoutDashboard size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">System Status</h3>
                    <p className="text-gray-400 mb-4">All systems are running smoothly.</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Database Connected
                        </div>
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> API Online
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

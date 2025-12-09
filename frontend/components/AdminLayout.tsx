import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard,
    FolderPlus,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Layers,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from './ui/CustomCursor';
import { getApiUrl } from '../src/config/api';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [ceoImage, setCeoImage] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await axios.get(getApiUrl('api/info'));
                if (res.data?.about?.ceoImage) {
                    setCeoImage(res.data.about.ceoImage);
                }
            } catch (err) {
                console.error("Failed to fetch CEO info", err);
            }
        };
        fetchInfo();
    }, []);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [location, isMobile]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/admin/projects', icon: FolderPlus },
        { name: 'Services', path: '/admin/services', icon: Layers },
        { name: 'Clients', path: '/admin/clients', icon: Users },
        { name: 'Manage About', path: '/admin/about', icon: User },
        { name: 'Business Info', path: '/admin/info', icon: Settings },
    ];

    const sidebarVariants = {
        open: { width: 280, x: 0 },
        closed: { width: 0, x: isMobile ? -280 : 0 }
    };

    return (
        <div className="min-h-screen bg-dark text-gray-100 flex font-sans selection:bg-accent selection:text-dark">
            <CustomCursor />

            {/* Mobile Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={isMobile ? "closed" : "open"}
                animate={isSidebarOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className={`bg-secondary border-r border-white/5 flex flex-col fixed h-full z-30 transition-all duration-300 overflow-hidden ${isMobile ? 'shadow-2xl' : ''}`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 min-w-[280px]">
                    <span className="text-xl font-display font-bold text-white tracking-wider">
                        Minhas<span className="text-accent">.</span>
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-8 px-4 space-y-2 min-w-[280px]">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-accent text-dark font-bold shadow-lg shadow-accent/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-dark' : 'text-gray-400 group-hover:text-accent transition-colors'} />
                                <span className="whitespace-nowrap">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/5 min-w-[280px]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${!isMobile && isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
                {/* Top Header */}
                <header className="h-20 bg-dark/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="hidden md:inline">Admin</span>
                            <ChevronRight size={14} className="hidden md:block" />
                            <span className="text-white font-medium">
                                {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-accent overflow-hidden">
                            {ceoImage ? (
                                <img src={ceoImage} alt="CEO" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

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
    const location = useLocation();
    const navigate = useNavigate();

    const [ceoImage, setCeoImage] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen bg-dark text-gray-100 flex font-sans selection:bg-accent selection:text-dark">
            <CustomCursor />
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-secondary border-r border-white/5 flex flex-col fixed h-full z-20 transition-all duration-300"
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                    {isSidebarOpen ? (
                        <span className="text-xl font-display font-bold text-white tracking-wider">
                            Minhas<span className="text-accent">.</span>
                        </span>
                    ) : (
                        <span className="text-xl font-display font-bold text-accent mx-auto">M.</span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-8 px-4 space-y-2">
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
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {!isSidebarOpen && isActive && (
                                    <div className="absolute left-full ml-4 bg-accent text-dark px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
                {/* Top Header */}
                <header className="h-20 bg-dark/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Admin</span>
                        <ChevronRight size={14} />
                        <span className="text-white font-medium">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </span>
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
                <main className="flex-1 p-8 overflow-x-hidden">
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

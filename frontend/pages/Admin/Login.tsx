import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomCursor from '../../components/ui/CustomCursor';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden selection:bg-accent selection:text-dark">
            <CustomCursor />

            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-secondary/40 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10 group hover:border-accent/20 transition-all duration-500"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-dark shadow-lg shadow-accent/20"
                    >
                        <ShieldCheck size={32} strokeWidth={2.5} />
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-400">Enter your credentials to access the admin panel.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3"
                    >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-accent transition-colors duration-300" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-dark/40 border border-white/5 rounded-xl px-5 py-3.5 pl-12 text-white focus:outline-none focus:border-accent/50 focus:bg-dark/60 focus:ring-4 focus:ring-accent/10 transition-all duration-300 placeholder:text-gray-600"
                                placeholder="admin"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-accent transition-colors duration-300" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark/40 border border-white/5 rounded-xl px-5 py-3.5 pl-12 text-white focus:outline-none focus:border-accent/50 focus:bg-dark/60 focus:ring-4 focus:ring-accent/10 transition-all duration-300 placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent text-dark font-bold py-4 rounded-xl shadow-lg shadow-accent/20 hover:bg-white hover:shadow-xl hover:shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>

            <div className="absolute bottom-8 text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Minhas Aluminium & Glass Corp.
            </div>
        </div>
    );
};

export default Login;

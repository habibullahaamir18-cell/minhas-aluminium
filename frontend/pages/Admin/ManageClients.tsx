import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload, Search, Users, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl, getImageUrl } from '../../src/config/api';

interface Client {
    _id?: string;
    name: string;
    role: string;
    feedback: string;
    image?: string;
    rating: number;
}

const ManageClients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClient, setCurrentClient] = useState<Partial<Client>>({
        name: '', role: '', feedback: '', image: '', rating: 5
    });
    const [uploading, setUploading] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchClients = async () => {
        try {
            const res = await axios.get(getApiUrl('api/clients'));
            setClients(res.data);
        } catch (err) {
            console.error("Failed to fetch clients", err);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(getApiUrl('api/upload'), formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setCurrentClient(prev => ({ ...prev, image: getImageUrl(res.data.filePath) }));
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    const addImageFromUrl = () => {
        if (imageUrlInput.trim()) {
            setCurrentClient(prev => ({ ...prev, image: imageUrlInput.trim() }));
            setImageUrlInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (currentClient._id) {
                await axios.put(getApiUrl(`api/clients/${currentClient._id}`), currentClient, { headers });
            } else {
                await axios.post(getApiUrl('api/clients'), currentClient, { headers });
            }
            setIsEditing(false);
            setCurrentClient({ name: '', role: '', feedback: '', image: '', rating: 5 });
            fetchClients();
            setMessage({ text: 'Client saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Save failed', err);
            setMessage({ text: 'Failed to save client', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(getApiUrl(`api/clients/${id}`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchClients();
            setMessage({ text: 'Client deleted successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Delete failed', err);
            setMessage({ text: 'Failed to delete client', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Manage Clients</h1>
                    <p className="text-gray-400">Manage client testimonials and feedback.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentClient({ name: '', role: '', feedback: '', image: '', rating: 5 });
                        setIsEditing(true);
                    }}
                    className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                    <Plus size={20} /> Add New Client
                </button>
            </div>

            {/* Success/Error Message */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {clients.map((client) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={client._id}
                            className="bg-secondary rounded-xl overflow-hidden border border-white/5 group hover:border-accent/50 transition-all duration-300 flex flex-col"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
                                            {client.image ? (
                                                <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-dark flex items-center justify-center text-gray-500">
                                                    <Users size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white leading-tight">{client.name}</h3>
                                            <p className="text-xs text-accent">{client.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setCurrentClient(client); setIsEditing(true); }}
                                            className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client._id!)}
                                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < client.rating ? "fill-accent text-accent" : "text-gray-600"} />
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm italic">"{client.feedback}"</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-secondary w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark/50">
                                <h2 className="text-2xl font-bold text-white">{currentClient._id ? 'Edit Client' : 'New Client'}</h2>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Client Name</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. John Doe"
                                                value={currentClient.name}
                                                onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Role / Designation</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. CEO, Homeowner"
                                                value={currentClient.role}
                                                onChange={e => setCurrentClient({ ...currentClient, role: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Feedback / Testimonial</label>
                                            <textarea
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors h-24 resize-none"
                                                placeholder="What did the client say about us?"
                                                value={currentClient.feedback}
                                                onChange={e => setCurrentClient({ ...currentClient, feedback: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Rating (1-5)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                value={currentClient.rating}
                                                onChange={e => setCurrentClient({ ...currentClient, rating: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400">Client Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-700 bg-dark flex items-center justify-center">
                                                {currentClient.image ? (
                                                    <img src={currentClient.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={24} className="text-gray-500" />
                                                )}
                                            </div>
                                            <label className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium text-white">
                                                {uploading ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                Upload Photo
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                                            </label>
                                        </div>
                                        <div className="flex gap-2 items-center mt-3">
                                            <input
                                                type="text"
                                                className="flex-grow bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                placeholder="Or paste image URL here..."
                                                value={imageUrlInput}
                                                onChange={e => setImageUrlInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageFromUrl())}
                                            />
                                            <button
                                                type="button"
                                                onClick={addImageFromUrl}
                                                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                Add URL
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-dark/50 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-2 rounded-lg bg-accent text-dark font-bold hover:bg-white transition-colors shadow-lg shadow-accent/20"
                                >
                                    Save Client
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageClients;

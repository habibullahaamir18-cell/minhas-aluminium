import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';
import { Service } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../../components/ui/IconHelper';
import { getApiUrl, getImageUrl } from '../../src/config/api';

const ManageServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({
        title: '', description: '', icon: 'layers', details: '', features: [], qualitySpecs: '', images: []
    });
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [featureInput, setFeatureInput] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchServices = async () => {
        try {
            const res = await axios.get(getApiUrl('api/services'));
            setServices(res.data);
        } catch (err) {
            console.error("Failed to fetch services", err);
        }
    };

    useEffect(() => {
        fetchServices();
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
            setCurrentService(prev => ({ ...prev, images: [...(prev.images || []), getImageUrl(res.data.filePath)] }));
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setCurrentService(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setCurrentService(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setCurrentService(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    const addImageFromUrl = () => {
        if (imageUrlInput.trim()) {
            setCurrentService(prev => ({ ...prev, images: [...(prev.images || []), imageUrlInput.trim()] }));
            setImageUrlInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/admin/login';
            return;
        }

        // Validation
        if (!currentService.title?.trim()) {
            setMessage({ text: 'Service Title is required', type: 'error' });
            document.getElementById('service-title')?.focus();
            return;
        }
        if (!currentService.icon?.trim()) {
            setMessage({ text: 'Icon Name is required', type: 'error' });
            document.getElementById('service-icon')?.focus();
            return;
        }
        if (!currentService.description?.trim()) {
            setMessage({ text: 'Short Description is required', type: 'error' });
            document.getElementById('service-desc')?.focus();
            return;
        }
        if (!currentService.details?.trim()) {
            setMessage({ text: 'Detailed Content is required', type: 'error' });
            document.getElementById('service-details')?.focus();
            return;
        }

        setIsSaving(true);
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (currentService._id) {
                await axios.put(getApiUrl(`api/services/${currentService._id}`), currentService, { headers });
            } else {
                await axios.post(getApiUrl('api/services'), currentService, { headers });
            }

            await fetchServices();
            setIsEditing(false);
            setCurrentService({ title: '', description: '', icon: 'layers', details: '', features: [], qualitySpecs: '', images: [] });
            setMessage({ text: 'Service saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err: any) {
            console.error('Save failed', err);
            const errorMsg = err.response?.data?.message || 'Failed to save service. Please check your connection and try again.';
            setMessage({ text: errorMsg, type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(getApiUrl(`api/services/${id}`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchServices();
            setMessage({ text: 'Service deleted successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Delete failed', err);
            setMessage({ text: 'Failed to delete service', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Manage Services</h1>
                    <p className="text-gray-400">Define your service offerings.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentService({ title: '', description: '', icon: 'layers', details: '', features: [], qualitySpecs: '', images: [] });
                        setIsEditing(true);
                    }}
                    className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                    <Plus size={20} /> Add New Service
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

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {services.map((service) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={service._id}
                            className="bg-secondary rounded-xl overflow-hidden border border-white/5 group hover:border-accent/50 transition-all duration-300 flex flex-col"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                                        {getIcon(service.icon)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setCurrentService(service); setIsEditing(true); }}
                                            className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id!)}
                                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-white mb-2">{service.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3">{service.description}</p>
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
                            className="bg-secondary w-full max-w-4xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark/50">
                                <h2 className="text-2xl font-bold text-white">{currentService._id ? 'Edit Service' : 'New Service'}</h2>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Service Title</label>
                                            <input
                                                id="service-title"
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. Aluminium Windows & Doors"
                                                value={currentService.title}
                                                onChange={e => setCurrentService({ ...currentService, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Icon Name (Lucide)</label>
                                            <input
                                                id="service-icon"
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. layers, maximize, shield"
                                                value={currentService.icon}
                                                onChange={e => setCurrentService({ ...currentService, icon: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Short Description</label>
                                            <textarea
                                                id="service-desc"
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors h-24 resize-none"
                                                placeholder="Brief summary shown on the home page cards..."
                                                value={currentService.description}
                                                onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Detailed Content</label>
                                            <textarea
                                                id="service-details"
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors h-32 resize-none"
                                                placeholder="Full service details, benefits, and specifications..."
                                                value={currentService.details}
                                                onChange={e => setCurrentService({ ...currentService, details: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Quality Specs</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. ISO 9001 Certified, 10-Year Warranty"
                                                value={currentService.qualitySpecs}
                                                onChange={e => setCurrentService({ ...currentService, qualitySpecs: e.target.value })}
                                            />
                                        </div>

                                        {/* Features Input */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Features</label>
                                            <div className="flex gap-2">
                                                <input
                                                    className="flex-grow bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                    value={featureInput}
                                                    onChange={e => setFeatureInput(e.target.value)}
                                                    placeholder="e.g. Weather-resistant coating, Energy efficient"
                                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                                />
                                                <button type="button" onClick={addFeature} className="bg-white/10 text-white px-4 rounded-lg hover:bg-white/20">Add</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {currentService.features?.map((feature, i) => (
                                                    <span key={i} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                        {feature}
                                                        <button type="button" onClick={() => removeFeature(i)} className="hover:text-white"><X size={14} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400">Service Images</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {currentService.images?.map((img, i) => (
                                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700">
                                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-700 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-accent">
                                                {uploading ? (
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                                                ) : (
                                                    <>
                                                        <Upload size={24} className="mb-2" />
                                                        <span className="text-xs font-bold">Upload Image</span>
                                                    </>
                                                )}
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                                            </label>
                                        </div>
                                        <div className="flex gap-2 items-center">
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

                                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className={`px-8 py-2 rounded-lg bg-accent text-dark font-bold hover:bg-white transition-colors shadow-lg shadow-accent/20 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Service'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageServices;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl, getImageUrl } from '../../src/config/api';

const ManageProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({
        title: '', category: '', location: '', description: '', images: []
    });
    const [uploading, setUploading] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchProjects = async () => {
        try {
            const res = await axios.get(getApiUrl('api/projects'));
            setProjects(res.data);
            setFilteredProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        let result = projects;
        if (searchTerm) {
            result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }
        setFilteredProjects(result);
    }, [searchTerm, selectedCategory, projects]);

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
            setCurrentProject(prev => ({ ...prev, images: [...(prev.images || []), getImageUrl(res.data.filePath)] }));
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setCurrentProject(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const addImageFromUrl = () => {
        if (imageUrlInput.trim()) {
            setCurrentProject(prev => ({ ...prev, images: [...(prev.images || []), imageUrlInput.trim()] }));
            setImageUrlInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (currentProject._id) {
                await axios.put(getApiUrl(`api/projects/${currentProject._id}`), currentProject, { headers });
            } else {
                await axios.post(getApiUrl('api/projects'), currentProject, { headers });
            }
            setIsEditing(false);
            setCurrentProject({ title: '', category: '', location: '', description: '', images: [] });
            fetchProjects();
            setMessage({ text: 'Project saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Save failed', err);
            setMessage({ text: 'Failed to save project', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(getApiUrl(`api/projects/${id}`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchProjects();
            setMessage({ text: 'Project deleted successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Delete failed', err);
            setMessage({ text: 'Failed to delete project', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Manage Projects</h1>
                    <p className="text-gray-400">Organize and showcase your best work.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentProject({ title: '', category: '', location: '', description: '', images: [] });
                        setIsEditing(true);
                    }}
                    className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                    <Plus size={20} /> Add New Project
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

            {/* Filters */}
            <div className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Filter size={20} className="text-gray-500" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat
                                ? 'bg-accent text-dark font-bold'
                                : 'bg-dark text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={project._id}
                            className="bg-secondary rounded-xl overflow-hidden border border-white/5 group hover:border-accent/50 transition-all duration-300"
                        >
                            <div className="h-56 overflow-hidden relative">
                                {project.images && project.images.length > 0 ? (
                                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-dark flex items-center justify-center text-gray-600">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => { setCurrentProject(project); setIsEditing(true); }}
                                        className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-500 hover:scale-110 transition-all"
                                        title="Edit"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id!)}
                                        className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500 hover:scale-110 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                    {project.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-white mb-1">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                    {project.location}
                                </p>
                                <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
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
                                <h2 className="text-2xl font-bold text-white">{currentProject._id ? 'Edit Project' : 'New Project'}</h2>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Project Title</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. Luxury Villa Glazing"
                                                value={currentProject.title}
                                                onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Category</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. Residential"
                                                value={currentProject.category}
                                                onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Location</label>
                                            <input
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors"
                                                placeholder="e.g. DHA Phase 6, Lahore"
                                                value={currentProject.location}
                                                onChange={e => setCurrentProject({ ...currentProject, location: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Description</label>
                                            <textarea
                                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors h-32 resize-none"
                                                placeholder="Describe the project details..."
                                                value={currentProject.description}
                                                onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400">Project Images</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                                            {currentProject.images?.map((img, i) => (
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
                                    Save Project
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProjects;

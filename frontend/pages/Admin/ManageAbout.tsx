import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, Upload, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl, getImageUrl } from '../../src/config/api';

const ManageAbout: React.FC = () => {
    const [aboutData, setAboutData] = useState<any>({
        ceoName: '',
        ceoImage: '',
        yearsExperience: 0,
        storyTitle: 'Our Story',
        storySubtitle: '',
        storyImage: '',
        storyParagraph1: '',
        storyParagraph2: '',
        values: [],
        timeline: [],
        shopImages: []
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await axios.get(getApiUrl('api/info'));
            if (res.data?.about) {
                setAboutData({
                    ceoName: res.data.about.ceoName || '',
                    ceoImage: res.data.about.ceoImage || '',
                    yearsExperience: res.data.about.yearsExperience || 0,
                    storyTitle: res.data.about.storyTitle || 'Our Story',
                    storySubtitle: res.data.about.storySubtitle || '',
                    storyImage: res.data.about.storyImage || '',
                    storyParagraph1: res.data.about.storyParagraph1 || '',
                    storyParagraph2: res.data.about.storyParagraph2 || '',
                    values: res.data.about.values || [],
                    timeline: res.data.about.timeline || [],
                    shopImages: res.data.about.shopImages || []
                });
            }
        } catch (err) {
            console.error('Failed to fetch about data', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
            const imageUrl = res.data.filePath; // Cloudinary returns full URL

            if (field === 'storyImage') {
                setAboutData({ ...aboutData, storyImage: imageUrl });
            } else if (field === 'ceoImage') {
                setAboutData({ ...aboutData, ceoImage: imageUrl });
            } else if (field === 'shopImages') {
                setAboutData({ ...aboutData, shopImages: [...aboutData.shopImages, imageUrl] });
            }
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    const addImageFromUrl = (field: string) => {
        if (!imageUrlInput.trim()) return;

        if (field === 'storyImage') {
            setAboutData({ ...aboutData, storyImage: imageUrlInput.trim() });
        } else if (field === 'ceoImage') {
            setAboutData({ ...aboutData, ceoImage: imageUrlInput.trim() });
        } else if (field === 'shopImages') {
            setAboutData({ ...aboutData, shopImages: [...aboutData.shopImages, imageUrlInput.trim()] });
        }
        setImageUrlInput('');
    };

    const removeShopImage = (index: number) => {
        setAboutData({
            ...aboutData,
            shopImages: aboutData.shopImages.filter((_: any, i: number) => i !== index)
        });
    };

    const addValue = () => {
        setAboutData({
            ...aboutData,
            values: [...aboutData.values, { icon: 'award', label: '' }]
        });
    };

    const updateValue = (index: number, field: string, value: string) => {
        const newValues = [...aboutData.values];
        newValues[index][field] = value;
        setAboutData({ ...aboutData, values: newValues });
    };

    const removeValue = (index: number) => {
        setAboutData({
            ...aboutData,
            values: aboutData.values.filter((_: any, i: number) => i !== index)
        });
    };

    const addTimelineItem = () => {
        setAboutData({
            ...aboutData,
            timeline: [...aboutData.timeline, { year: '', title: '', description: '' }]
        });
    };

    const updateTimelineItem = (index: number, field: string, value: string) => {
        const newTimeline = [...aboutData.timeline];
        newTimeline[index][field] = value;
        setAboutData({ ...aboutData, timeline: newTimeline });
    };

    const removeTimelineItem = (index: number) => {
        setAboutData({
            ...aboutData,
            timeline: aboutData.timeline.filter((_: any, i: number) => i !== index)
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/admin/login';
            return;
        }

        try {
            await axios.post(getApiUrl('api/info'),
                { about: aboutData },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage({ text: 'About page updated successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            console.error('Save failed', err);
            setMessage({ text: 'Failed to save changes', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Manage About Page</h1>
                    <p className="text-gray-400">Update your company story, timeline, and values.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-all duration-300 flex items-center gap-2"
                >
                    <Save size={20} /> Save Changes
                </button>
            </div>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* CEO Information Section */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">CEO Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">CEO Name</label>
                        <input
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                            value={aboutData.ceoName}
                            onChange={e => setAboutData({ ...aboutData, ceoName: e.target.value })}
                            placeholder="e.g., Ahmed Minhas"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Years of Experience</label>
                        <input
                            type="number"
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                            value={aboutData.yearsExperience}
                            onChange={e => setAboutData({ ...aboutData, yearsExperience: parseInt(e.target.value) || 0 })}
                            placeholder="e.g., 16"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">CEO Photo</label>
                        {aboutData.ceoImage && (
                            <div className="mb-4">
                                <img src={aboutData.ceoImage} alt="CEO" className="w-32 h-32 object-cover rounded-full border-2 border-accent" />
                            </div>
                        )}
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                                <div className="bg-dark border border-gray-700 rounded-lg px-4 py-3 text-center hover:border-accent transition-colors">
                                    {uploading ? 'Uploading...' : 'Upload CEO Photo'}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'ceoImage')} accept="image/*" disabled={uploading} />
                            </label>
                            <input
                                type="text"
                                className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                placeholder="Or paste image URL..."
                                value={imageUrlInput}
                                onChange={e => setImageUrlInput(e.target.value)}
                            />
                            <button
                                onClick={() => addImageFromUrl('ceoImage')}
                                className="bg-white/10 text-white px-4 rounded-lg hover:bg-white/20"
                            >
                                Add URL
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Story Section</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Story Title</label>
                        <input
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                            value={aboutData.storyTitle}
                            onChange={e => setAboutData({ ...aboutData, storyTitle: e.target.value })}
                            placeholder="e.g., Our Story"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Story Subtitle</label>
                        <input
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                            value={aboutData.storySubtitle}
                            onChange={e => setAboutData({ ...aboutData, storySubtitle: e.target.value })}
                            placeholder="e.g., From a small workshop to nationwide leader"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Story Image</label>
                        {aboutData.storyImage && (
                            <div className="mb-4">
                                <img src={aboutData.storyImage} alt="Story" className="w-full h-48 object-cover rounded-lg" />
                            </div>
                        )}
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                                <div className="bg-dark border border-gray-700 rounded-lg px-4 py-3 text-center hover:border-accent transition-colors">
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'storyImage')} accept="image/*" disabled={uploading} />
                            </label>
                            <input
                                type="text"
                                className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                placeholder="Or paste image URL..."
                                value={imageUrlInput}
                                onChange={e => setImageUrlInput(e.target.value)}
                            />
                            <button
                                onClick={() => addImageFromUrl('storyImage')}
                                className="bg-white/10 text-white px-4 rounded-lg hover:bg-white/20"
                            >
                                Add URL
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Paragraph 1</label>
                        <textarea
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none h-24 resize-none"
                            value={aboutData.storyParagraph1}
                            onChange={e => setAboutData({ ...aboutData, storyParagraph1: e.target.value })}
                            placeholder="First paragraph of your story..."
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Paragraph 2</label>
                        <textarea
                            className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none h-24 resize-none"
                            value={aboutData.storyParagraph2}
                            onChange={e => setAboutData({ ...aboutData, storyParagraph2: e.target.value })}
                            placeholder="Second paragraph of your story..."
                        />
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Company Values</h2>
                    <button
                        onClick={addValue}
                        className="bg-accent/20 text-accent px-4 py-2 rounded-lg hover:bg-accent/30 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Value
                    </button>
                </div>

                <div className="space-y-4">
                    {aboutData.values.map((value: any, index: number) => (
                        <div key={index} className="flex gap-4 items-start bg-dark/50 p-4 rounded-lg">
                            <input
                                className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                value={value.icon}
                                onChange={e => updateValue(index, 'icon', e.target.value)}
                                placeholder="Icon name (e.g., award, users)"
                            />
                            <input
                                className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                value={value.label}
                                onChange={e => updateValue(index, 'label', e.target.value)}
                                placeholder="Label (e.g., Quality Certified)"
                            />
                            <button
                                onClick={() => removeValue(index)}
                                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Company Timeline</h2>
                    <button
                        onClick={addTimelineItem}
                        className="bg-accent/20 text-accent px-4 py-2 rounded-lg hover:bg-accent/30 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Timeline Item
                    </button>
                </div>

                <div className="space-y-4">
                    {aboutData.timeline.map((item: any, index: number) => (
                        <div key={index} className="bg-dark/50 p-4 rounded-lg space-y-3">
                            <div className="flex gap-4">
                                <input
                                    className="w-32 bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                    value={item.year}
                                    onChange={e => updateTimelineItem(index, 'year', e.target.value)}
                                    placeholder="Year"
                                />
                                <input
                                    className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                    value={item.title}
                                    onChange={e => updateTimelineItem(index, 'title', e.target.value)}
                                    placeholder="Title"
                                />
                                <button
                                    onClick={() => removeTimelineItem(index)}
                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <textarea
                                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none h-20 resize-none"
                                value={item.description}
                                onChange={e => updateTimelineItem(index, 'description', e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Shop Images Section */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Shop/Workshop Images</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {aboutData.shopImages.map((img: string, index: number) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700">
                            <img src={img} alt={`Shop ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeShopImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                                <span className="text-xs font-bold">Upload</span>
                            </>
                        )}
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'shopImages')} accept="image/*" disabled={uploading} />
                    </label>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                        placeholder="Or paste image URL..."
                        value={imageUrlInput}
                        onChange={e => setImageUrlInput(e.target.value)}
                    />
                    <button
                        onClick={() => addImageFromUrl('shopImages')}
                        className="bg-white/10 text-white px-4 rounded-lg hover:bg-white/20"
                    >
                        Add URL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAbout;

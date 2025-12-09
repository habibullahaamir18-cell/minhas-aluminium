import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Phone, Mail, MapPin, Globe, User, Briefcase, Award, Clock, Check, X as XIcon, Copy, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl, getImageUrl } from '../../src/config/api';

const ManageInfo: React.FC = () => {
    const [info, setInfo] = useState<any>({
        stats: [],
        contact: {},
        about: {},
        workingHours: []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'stats' | 'contact' | 'about' | 'hours'>('stats');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await axios.get(getApiUrl('api/info'));
                if (res.data && Object.keys(res.data).length > 0) {
                    let data = res.data;

                    // Ensure all days are present by merging with defaults
                    const existingHours = Array.isArray(data.workingHours) ? data.workingHours : [];
                    const mergedHours = daysOfWeek.map(day => {
                        const existing = existingHours.find((h: any) => h.day === day);
                        return existing || {
                            day,
                            isOpen: day !== 'Sunday',
                            time: '9:00 AM - 6:00 PM'
                        };
                    });

                    data.workingHours = mergedHours;
                    setInfo(data);
                } else {
                    setInfo({
                        stats: [
                            { label: "Projects Completed", value: 0, suffix: "+" },
                            { label: "Happy Clients", value: 0, suffix: "" },
                            { label: "Years of Service", value: 0, suffix: "+" },
                            { label: "Skilled Staff", value: 0, suffix: "" },
                        ],
                        contact: { phone: '', email: '', address: '', whatsapp: '', socials: { facebook: '', instagram: '', tiktok: '', mapLocation: '' } },
                        workingHours: daysOfWeek.map(day => ({ day, isOpen: day !== 'Sunday', time: '9:00 AM - 6:00 PM' })),
                        about: { ceoName: 'Aamir Iqbal Minhas', yearsExperience: 29 }
                    });
                }
            } catch (err) {
                console.error("Failed to fetch info", err);
            }
        };
        fetchInfo();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(getApiUrl('api/info'), info, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Save failed', err);
            setMessage('Failed to save.');
        } finally {
            setLoading(false);
        }
    };

    const updateStat = (index: number, field: string, value: any) => {
        const newStats = [...info.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setInfo({ ...info, stats: newStats });
    };

    const updateWorkingHour = (index: number, field: string, value: any) => {
        const newHours = [...info.workingHours];
        newHours[index] = { ...newHours[index], [field]: value };
        setInfo({ ...info, workingHours: newHours });
    };

    const applyToWeekdays = (time: string, isOpen: boolean) => {
        const newHours = info.workingHours.map((h: any) => {
            if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(h.day)) {
                return { ...h, time, isOpen };
            }
            return h;
        });
        setInfo({ ...info, workingHours: newHours });
        setMessage('Applied to all weekdays!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.post(getApiUrl('api/upload'), formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (nestedField) {
                // @ts-ignore
                setInfo(prev => ({
                    ...prev,
                    // @ts-ignore
                    [field]: { ...prev[field], [nestedField]: res.data.filePath }
                }));
            } else {
                // @ts-ignore
                setInfo(prev => ({ ...prev, [field]: res.data.filePath }));
            }
            setMessage('Image uploaded successfully!');
        } catch (err) {
            console.error('Upload failed', err);
            setMessage('Failed to upload image.');
        } finally {
            setLoading(false);
        }
    };

    const updateAbout = (field: string, value: any) => {
        setInfo({ ...info, about: { ...info.about, [field]: value } });
    };

    const updateAboutArray = (arrayName: 'values' | 'timeline', index: number, field: string, value: any) => {
        const newArray = [...(info.about[arrayName] || [])];
        newArray[index] = { ...newArray[index], [field]: value };
        setInfo({ ...info, about: { ...info.about, [arrayName]: newArray } });
    };

    const addToAboutArray = (arrayName: 'values' | 'timeline') => {
        const item = arrayName === 'values' ? { icon: 'award', label: 'New Value' } : { year: '2024', title: 'New Event', description: 'Description' };
        setInfo({ ...info, about: { ...info.about, [arrayName]: [...(info.about[arrayName] || []), item] } });
    };

    const removeFromAboutArray = (arrayName: 'values' | 'timeline', index: number) => {
        const newArray = [...(info.about[arrayName] || [])];
        newArray.splice(index, 1);
        setInfo({ ...info, about: { ...info.about, [arrayName]: newArray } });
    };

    const tabs = [
        { id: 'stats', label: 'Statistics', icon: Award },
        { id: 'contact', label: 'Contact Details', icon: Phone },
        { id: 'hours', label: 'Working Hours', icon: Clock },
        { id: 'about', label: 'About Data', icon: User },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Business Information</h1>
                    <p className="text-gray-400">Manage your company details and vital statistics.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${message.includes('Failed') ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}
                >
                    {message}
                </motion.div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-accent bg-white/5'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-secondary p-4 md:p-8 rounded-b-xl rounded-tr-xl border border-white/5 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'stats' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {info.stats?.map((stat: any, i: number) => (
                                <div key={i} className="bg-dark p-4 md:p-6 rounded-xl border border-white/5 hover:border-accent/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4 text-accent">
                                        <Award size={20} />
                                        <span className="font-bold">Stat #{i + 1}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Label</label>
                                            <input
                                                className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                value={stat.label}
                                                onChange={(e) => updateStat(i, 'label', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Value</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                    value={stat.value}
                                                    onChange={(e) => updateStat(i, 'value', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-full sm:w-24">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Suffix</label>
                                                <input
                                                    className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                    value={stat.suffix}
                                                    onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.phone || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, phone: e.target.value } })}
                                    placeholder="+92 300 123 4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Globe size={16} /> WhatsApp
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.whatsapp || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, whatsapp: e.target.value } })}
                                    placeholder="https://wa.me/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.email || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, email: e.target.value } })}
                                    placeholder="info@minhascorp.pk"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <MapPin size={16} /> Physical Address
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.address || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, address: e.target.value } })}
                                    placeholder="Office #12, Industrial Estate, Rawalpindi"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Globe size={16} /> Facebook Link
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.socials?.facebook || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, socials: { ...info.contact.socials, facebook: e.target.value } } })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Globe size={16} /> Instagram Link
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.socials?.instagram || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, socials: { ...info.contact.socials, instagram: e.target.value } } })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <Globe size={16} /> TikTok Link
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.socials?.tiktok || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, socials: { ...info.contact.socials, tiktok: e.target.value } } })}
                                    placeholder="https://tiktok.com/..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                    <MapPin size={16} /> Map Location Link
                                </label>
                                <input
                                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                                    value={info.contact?.socials?.mapLocation || ''}
                                    onChange={(e) => setInfo({ ...info, contact: { ...info.contact, socials: { ...info.contact.socials, mapLocation: e.target.value } } })}
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'hours' && (
                        <motion.div
                            key="hours"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">
                                <div className="col-span-3">Day</div>
                                <div className="col-span-3 text-center">Status</div>
                                <div className="col-span-6">Hours</div>
                            </div>
                            {info.workingHours?.map((dayInfo: any, i: number) => (
                                <div key={i} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-dark p-4 rounded-lg border border-white/5 hover:border-accent/30 transition-colors">
                                    <div className="w-full sm:w-auto sm:col-span-3 flex justify-between sm:block">
                                        <span className="font-medium text-white">{dayInfo.day}</span>
                                        <div className="sm:hidden">
                                            <button
                                                onClick={() => updateWorkingHour(i, 'isOpen', !dayInfo.isOpen)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${dayInfo.isOpen
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                    }`}
                                            >
                                                {dayInfo.isOpen ? 'Open' : 'Closed'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex sm:col-span-3 justify-center">
                                        <button
                                            onClick={() => updateWorkingHour(i, 'isOpen', !dayInfo.isOpen)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${dayInfo.isOpen
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                }`}
                                        >
                                            {dayInfo.isOpen ? 'Open' : 'Closed'}
                                        </button>
                                    </div>
                                    <div className="w-full sm:col-span-6">
                                        <div className="relative flex items-center gap-2">
                                            <input
                                                className={`w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none transition-opacity ${!dayInfo.isOpen && 'opacity-50 cursor-not-allowed'}`}
                                                value={dayInfo.time}
                                                onChange={(e) => updateWorkingHour(i, 'time', e.target.value)}
                                                disabled={!dayInfo.isOpen}
                                                placeholder="e.g. 9:00 AM - 6:00 PM"
                                            />
                                            <button
                                                onClick={() => applyToWeekdays(dayInfo.time, dayInfo.isOpen)}
                                                className="p-2 text-gray-400 hover:text-accent transition-colors bg-white/5 rounded-lg hover:bg-white/10"
                                                title="Apply this time to all weekdays (Mon-Fri)"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* CEO Section */}
                            <div className="bg-dark p-4 md:p-6 rounded-xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-2">CEO & Basics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">CEO Name</label>
                                        <input
                                            className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                            value={info.about?.ceoName || ''}
                                            onChange={(e) => updateAbout('ceoName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Years Experience</label>
                                        <input
                                            type="number"
                                            className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                            value={info.about?.yearsExperience || 0}
                                            onChange={(e) => updateAbout('yearsExperience', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-400">CEO Image</label>
                                        <div className="flex items-center gap-4">
                                            {info.about?.ceoImage && (
                                                <img src={info.about.ceoImage} alt="CEO" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                                            )}
                                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                <Upload size={16} /> Upload Image
                                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'about', 'ceoImage')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Story Section */}
                            <div className="bg-dark p-4 md:p-6 rounded-xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-2">Our Story</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Title</label>
                                            <input
                                                className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                value={info.about?.storyTitle || ''}
                                                onChange={(e) => updateAbout('storyTitle', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Subtitle</label>
                                            <input
                                                className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                                value={info.about?.storySubtitle || ''}
                                                onChange={(e) => updateAbout('storySubtitle', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Main Story Image</label>
                                        <div className="flex items-center gap-4">
                                            {info.about?.storyImage && (
                                                <img src={info.about.storyImage} alt="Story" className="w-24 h-16 rounded object-cover border border-white/10" />
                                            )}
                                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                <Upload size={16} /> Upload Image
                                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'about', 'storyImage')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Paragraph 1</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                            value={info.about?.storyParagraph1 || ''}
                                            onChange={(e) => updateAbout('storyParagraph1', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Paragraph 2</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
                                            value={info.about?.storyParagraph2 || ''}
                                            onChange={(e) => updateAbout('storyParagraph2', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Values Section */}
                            <div className="bg-dark p-4 md:p-6 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <h3 className="text-xl font-bold text-white">Core Values</h3>
                                    <button onClick={() => addToAboutArray('values')} className="text-accent text-sm hover:underline flex items-center gap-1"><Check size={14} /> Add Value</button>
                                </div>
                                <div className="space-y-4">
                                    {info.about?.values?.map((val: any, i: number) => (
                                        <div key={i} className="flex flex-col sm:flex-row gap-4 items-start bg-secondary/50 p-3 rounded-lg">
                                            <div className="w-full sm:w-1/3">
                                                <label className="block text-xs text-gray-500 mb-1">Icon (lucide)</label>
                                                <input
                                                    className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                    value={val.icon || ''}
                                                    onChange={(e) => updateAboutArray('values', i, 'icon', e.target.value)}
                                                    placeholder="award, users..."
                                                />
                                            </div>
                                            <div className="w-full sm:flex-1">
                                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                                <input
                                                    className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                    value={val.label || ''}
                                                    onChange={(e) => updateAboutArray('values', i, 'label', e.target.value)}
                                                />
                                            </div>
                                            <button onClick={() => removeFromAboutArray('values', i)} className="w-full sm:w-auto flex justify-center text-red-400 hover:text-red-300 p-2"><XIcon size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="bg-dark p-4 md:p-6 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                                    <h3 className="text-xl font-bold text-white">Timeline</h3>
                                    <button onClick={() => addToAboutArray('timeline')} className="text-accent text-sm hover:underline flex items-center gap-1"><Check size={14} /> Add Event</button>
                                </div>
                                <div className="space-y-4">
                                    {info.about?.timeline?.map((item: any, i: number) => (
                                        <div key={i} className="bg-secondary/50 p-4 rounded-lg space-y-3 relative group">
                                            <button onClick={() => removeFromAboutArray('timeline', i)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><XIcon size={16} /></button>
                                            <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4 mt-6 sm:mt-0">
                                                <div className="w-full sm:col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                                                    <input
                                                        className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                        value={item.year || ''}
                                                        onChange={(e) => updateAboutArray('timeline', i, 'year', e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-full sm:col-span-3">
                                                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                                                    <input
                                                        className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                        value={item.title || ''}
                                                        onChange={(e) => updateAboutArray('timeline', i, 'title', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full bg-secondary border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                    value={item.description || ''}
                                                    onChange={(e) => updateAboutArray('timeline', i, 'description', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}


                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageInfo;

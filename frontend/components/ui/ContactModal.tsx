import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber: string;
    whatsappNumber?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, phoneNumber, whatsappNumber }) => {
    const handleCall = () => {
        window.location.href = `tel:${phoneNumber}`;
        onClose();
    };

    const handleWhatsApp = () => {
        const target = whatsappNumber || phoneNumber;
        // Clean number for URL
        const cleanNum = target.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNum}`, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold text-white mb-2">Contact Us</h3>
                            <p className="text-gray-400 text-sm mb-6">Choose how you'd like to connect with us.</p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleCall}
                                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 text-white py-4 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <span className="font-medium">Call Now</span>
                                </button>

                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 text-white py-4 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <MessageCircle size={20} />
                                    </div>
                                    <span className="font-medium">WhatsApp</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Facebook, Instagram, ArrowRight, ExternalLink } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import ContactModal from '../components/ui/ContactModal';
import { MAP_EMBED_SRC } from '../constants';
import { TikTokIcon } from '../components/ui/IconHelper';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [info, setInfo] = useState<any>({
    contact: {
      phone: '',
      email: '',
      address: '',
      whatsapp: '',
      socials: { facebook: '', instagram: '', tiktok: '', mapLocation: '' }
    }
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/info');
        if (res.data) {
          setInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch info", err);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="bg-dark min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-5xl font-display font-bold text-white mb-6">Get In Touch</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ready to start your project? Reach out to us directly or connect with us on social media to see our latest work.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Contact Details Column */}
          <div className="space-y-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-accent pl-4">Contact Information</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-colors group cursor-pointer" onClick={() => setIsContactModalOpen(true)}>
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Phone & WhatsApp</h3>
                  <p className="text-gray-400 mb-3">Available Mon-Sat, 9am - 6pm</p>
                  <div className="flex flex-col gap-2">
                    <span className="text-xl text-white font-medium">{info.contact.phone || 'Loading...'}</span>
                    {info.contact.whatsapp && (
                      <span className="text-accent text-sm font-bold flex items-center gap-2 hover:underline">
                        Chat on WhatsApp <ArrowRight size={16} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-colors group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Email Us</h3>
                  <p className="text-gray-400 mb-3">For project inquiries and quotes</p>
                  <a href={`mailto:${info.contact.email}?subject=Inquiry for Minhas Corp`} className="text-xl text-white font-medium hover:text-accent transition-colors">
                    {info.contact.email || 'Loading...'}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex items-start gap-6 p-6 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-colors group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Visit Our Workshop</h3>
                  <p className="text-gray-400 mb-2 whitespace-pre-line">
                    {info.contact.address || 'Loading...'}
                  </p>
                  {info.contact.socials?.mapLocation && (
                    <a
                      href={info.contact.socials.mapLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm font-bold flex items-center gap-2 hover:underline"
                    >
                      Get Directions <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Social Connect Column */}
          <div>
            <Reveal delay={0.2}>
              <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-accent pl-4">Connect Socially</h2>
              <p className="text-gray-400 mb-10">
                Follow us for behind-the-scenes footage, latest project reveals, and design inspiration.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 gap-4">
              {/* Instagram */}
              {info.contact.socials?.instagram && (
                <Reveal delay={0.3}>
                  <a
                    href={info.contact.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white">
                        <Instagram size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Instagram</h3>
                        <p className="text-gray-400 text-sm">@minhas_aluminium</p>
                      </div>
                    </div>
                    <ExternalLink className="text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                </Reveal>
              )}

              {/* Facebook */}
              {info.contact.socials?.facebook && (
                <Reveal delay={0.4}>
                  <a
                    href={info.contact.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                        <Facebook size={24} fill="white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Facebook</h3>
                        <p className="text-gray-400 text-sm">/minhasaluminium</p>
                      </div>
                    </div>
                    <ExternalLink className="text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                </Reveal>
              )}

              {/* TikTok */}
              {info.contact.socials?.tiktok && (
                <Reveal delay={0.5}>
                  <a
                    href={info.contact.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-800 to-black border border-white/10 hover:border-accent/50 transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black border border-gray-700 flex items-center justify-center text-white shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                        <TikTokIcon size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">TikTok</h3>
                        <p className="text-gray-400 text-sm">@minhas_aluminium</p>
                      </div>
                    </div>
                    <ExternalLink className="text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                </Reveal>
              )}
            </div>
          </div>

        </div>

        {/* Map Iframe */}
        <Reveal delay={0.6} className="w-full mt-24">
          <div className="w-full h-96 bg-white/5 rounded-2xl overflow-hidden relative group border border-white/10">
            <iframe
              src={MAP_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              title="Minhas Aluminium Location"
            ></iframe>

            {/* Overlay for interaction hint */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-dark/80 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
                Hover to interact
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={info.contact.phone}
        whatsappNumber={info.contact.whatsapp}
      />
    </div>
  );
};

export default Contact;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, PhoneCall } from 'lucide-react';
import { COMPANY_NAME } from '../constants';
import CustomCursor from './ui/CustomCursor';
import ContactModal from './ui/ContactModal';
import { TikTokIcon, WhatsAppIcon } from './ui/IconHelper';
import { getApiUrl } from '../src/config/api';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [info, setInfo] = useState<any>({
    contact: {
      phone: '',
      email: '',
      address: '',
      whatsapp: '',
      socials: { facebook: '', instagram: '', tiktok: '', mapLocation: '' }
    },
    workingHours: []
  });
  const location = useLocation();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(getApiUrl('api/info'));
        if (res.data) {
          setInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch info", err);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-dark text-gray-100 selection:bg-accent selection:text-dark relative">
      <CustomCursor />

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/90 backdrop-blur-md py-4 shadow-lg border-b border-white/5' : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo-final.png" alt="Minhas Corp" className="h-12 w-auto" />
            <span className="hidden lg:block text-x0.8 font-display font-bold text-white tracking-wide group-hover:text-accent transition-colors">
              Minhas Aluminium & Glass Corporation
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-wide hover:text-accent transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${location.pathname === link.path ? 'text-accent after:w-full' : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={`https://wa.me/${info.contact?.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to request a quotation for...`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-dark px-5 py-2 rounded-full font-bold text-sm hover:bg-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors hover:text-accent ${location.pathname === link.path ? 'text-accent' : 'text-gray-200'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={`https://wa.me/${info.contact?.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to request a quotation for...`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-accent text-dark p-3 rounded text-center font-bold mt-4 hover:bg-white transition-colors"
            >
              Get Quote
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo-final.png" alt="Minhas Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
              <span className="text-2xl font-display font-bold text-white tracking-wider group-hover:text-accent transition-colors">
                Minhas<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Crafting Pakistan’s finest aluminium and glass solutions. Precision engineering for modern architecture.
            </p>
            <div className="flex space-x-3 pt-2">
              {info.contact?.socials?.facebook && (
                <a href={info.contact.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                  <Facebook size={18} />
                </a>
              )}
              {info.contact?.socials?.instagram && (
                <a href={info.contact.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all duration-300">
                  <Instagram size={18} />
                </a>
              )}
              {info.contact?.socials?.tiktok && (
                <a href={info.contact.socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:text-white transition-all duration-300">
                  <TikTokIcon size={18} />
                </a>
              )}
              {info.contact?.whatsapp && (
                <a href={info.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300">
                  <WhatsAppIcon size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link to="/projects" className="hover:text-accent transition-colors">Project Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-1" />
                <a href={info.contact?.socials?.mapLocation || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  <span className="whitespace-pre-line">{info.contact?.address || 'Address not available'}</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <button onClick={() => setIsContactModalOpen(true)} className="hover:text-accent transition-colors text-left">
                  {info.contact?.phone || 'Phone not available'}
                </button>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href={`mailto:${info.contact?.email}?subject=Inquiry for Minhas Corp`} className="hover:text-accent transition-colors">
                  {info.contact?.email || 'Email not available'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Working Hours</h4>
            <ul className="space-y-2 text-sm">
              {Array.isArray(info.workingHours) && info.workingHours.length > 0 ? (
                info.workingHours.map((wh: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{wh.day.slice(0, 3)}</span>
                    <span className={wh.isOpen ? "text-white" : "text-red-400"}>
                      {wh.isOpen ? wh.time : 'Closed'}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading hours...</li>
              )}
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Developed with precision.</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      {info.contact?.whatsapp && (
        <a
          href={`https://wa.me/${info.contact?.whatsapp?.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce"
          aria-label="Chat on WhatsApp"
        >
          <PhoneCall size={28} />
        </a>
      )}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={info.contact?.phone}
        whatsappNumber={info.contact?.whatsapp}
      />
    </div>
  );
};

export default Layout;
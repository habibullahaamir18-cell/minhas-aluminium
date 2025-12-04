import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import { SERVICES } from '../constants';
import { Service, Project, Stat } from '../types';
import { Reveal } from '../components/ui/Reveal';
import { Counter } from '../components/ui/Counter';
import { ServiceModal } from '../components/ui/ServiceModal';
import { getIcon } from '../components/ui/IconHelper';
import ContactModal from '../components/ui/ContactModal';
import { getApiUrl } from '../src/config/api';

const Home: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [info, setInfo] = useState<any>({
    contact: { phone: '', email: '', whatsapp: '' }
  });
  const [showLogoAnimation, setShowLogoAnimation] = useState(true);
  const [loading, setLoading] = useState(true);

  const [yearsExperience, setYearsExperience] = useState(29);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, infoRes, servicesRes, clientsRes] = await Promise.all([
          axios.get(getApiUrl('api/projects')),
          axios.get(getApiUrl('api/info')),
          axios.get(getApiUrl('api/services')),
          axios.get(getApiUrl('api/clients'))
        ]);
        setProjects(projectsRes.data);
        setServices(servicesRes.data);
        setClients(clientsRes.data);
        if (infoRes.data.stats) {
          setStats(infoRes.data.stats);
        }
        if (infoRes.data) {
          setInfo(infoRes.data);
        }
        if (infoRes.data.about?.yearsExperience) {
          setYearsExperience(infoRes.data.about.yearsExperience);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Logo Animation Timer - Extended for better impact
    const timer = setTimeout(() => {
      setShowLogoAnimation(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Logo Intro Animation - Full Screen Overlay */}
        <AnimatePresence>
          {showLogoAnimation && (
            <motion.div
              key="logo-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="fixed inset-0 bg-gradient-to-br from-dark via-primary/20 to-dark flex items-center justify-center z-[9999]"
            >
              {/* Animated Background Particles */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                />
              </div>

              {/* Logo with Enhanced Animation */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotateY: 180 }}
                transition={{
                  duration: 1.8,
                  ease: [0.6, 0.05, 0.01, 0.9],
                  opacity: { duration: 0.8 }
                }}
                className="relative z-10"
              >
                <motion.img
                  animate={{
                    filter: [
                      'drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                      'drop-shadow(0 0 40px rgba(255,215,0,0.5))',
                      'drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  src="/logo-final.png"
                  alt="Minhas Logo"
                  className="w-80 md:w-[500px] object-contain"
                />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Hero Content - Only shows after logo animation */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode='wait'>
            {!showLogoAnimation && (
              <motion.div
                key="hero-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-primary/40 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                  alt="Modern Facade"
                  className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 relative z-20 pt-10">
          {!showLogoAnimation && (
            <div className="max-w-4xl">
              <Reveal delay={0.2}>
                <div className="inline-block px-4 py-1 mb-6 border border-accent/30 rounded-full bg-accent/10 backdrop-blur-sm">
                  <span className="text-accent text-sm font-semibold tracking-wider uppercase">Excellence Since {new Date().getFullYear() - yearsExperience}</span>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
                >
                  Transforming skylines and living spaces with precision engineering.
                  The trusted choice for Pakistan's most ambitious projects.
                </motion.p>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/projects" className="px-8 py-4 bg-accent text-dark font-bold rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg shadow-accent/20 flex items-center gap-2 group">
                    View Our Work <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button onClick={() => setIsContactModalOpen(true)} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    Contact Us
                  </button>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section >

      {/* Stats Section */}
      < section className="py-20 bg-dark relative border-b border-white/5" >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
                <h3 className="text-5xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Services Section */}
      < section className="py-24 bg-dark relative" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-accent font-bold tracking-wider uppercase mb-2 block">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Precision Engineering</h2>
            </div>
            <Link to="/services" className="text-white border-b border-accent hover:text-accent transition-colors pb-1 mt-4 md:mt-0">View All Services</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service, index) => (
              <Reveal key={service.id} delay={index * 0.1} className="h-full">
                <div
                  className="bg-white/5 border border-white/10 p-8 rounded-xl h-full hover:bg-white/10 hover:border-accent/30 transition-all duration-500 group cursor-pointer flex flex-col"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{service.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`https://wa.me/${info.contact?.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to request a quotation for...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white flex items-center gap-2 mt-auto group"
                    >
                      Request a Quote
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section >

      {/* Featured Project Parallax */}
      < section className="py-24 bg-zinc-900 overflow-hidden" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-wider uppercase mb-2 block">Featured Work</span>
            <h2 className="text-4xl font-display font-bold text-white">Recent Masterpieces</h2>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project, idx) => (
                <Reveal key={project._id || idx} delay={idx * 0.2}>
                  <div className="group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-accent text-sm font-bold uppercase tracking-wider mb-2 block">{project.category}</span>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{project.location}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">Loading projects...</div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-white text-white font-bold rounded hover:bg-white hover:text-dark transition-all duration-300">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section >

      {/* Testimonials */}
      < section className="py-24 relative bg-dark border-t border-white/5" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Trusted by Pakistan's Best</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clients.length > 0 ? (
              clients.slice(0, 3).map((client, i) => (
                <Reveal key={client._id} delay={i * 0.1}>
                  <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-white/5 relative hover:border-accent/30 transition-colors">
                    <div className="text-accent mb-4 flex gap-1">
                      {[...Array(client.rating || 5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-gray-300 italic mb-6">"{client.feedback}"</p>
                    <div className="flex items-center gap-4">
                      {client.image ? (
                        <img src={client.image} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                          {client.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-bold text-sm">{client.name}</h4>
                        <p className="text-gray-500 text-xs">{client.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">Loading testimonials...</div>
            )}
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-20 bg-primary relative overflow-hidden" >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Ready to Transform Your Space?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Let's discuss your project requirements and bring your vision to life with our premium aluminium and glass solutions.
            </p>
            <a
              href={`https://wa.me/${info.contact?.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to request a quotation for...`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-accent text-dark font-bold text-lg rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-xl shadow-accent/20 inline-block"
            >
              Get a Free Quote
            </a>
          </Reveal>
        </div></section >

      {/* Service Modal */}
      <AnimatePresence>
        {
          selectedService && (
            <ServiceModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )
        }
      </AnimatePresence >
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={info.contact?.phone}
        whatsappNumber={info.contact?.whatsapp}
      />
    </>
  );
};

export default Home;
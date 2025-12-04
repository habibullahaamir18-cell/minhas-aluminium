import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Service } from '../types';
import { Reveal } from '../components/ui/Reveal';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getIcon } from '../components/ui/IconHelper';
import { ServiceModal } from '../components/ui/ServiceModal';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="bg-dark min-h-screen pt-24 pb-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-display font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-400">
            We provide comprehensive aluminium and glass fabrication solutions for residential and commercial needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Reveal key={service.id} delay={idx * 0.1}>
              <div
                className="bg-glass-panel border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col group cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                    {getIcon(service.icon)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors">{service.title}</h3>
                <p className="text-gray-400 mb-8 flex-grow line-clamp-3">{service.description}</p>
                <div className="mt-auto">
                  <button
                    className="text-sm font-bold text-white flex items-center gap-2 hover:text-accent transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                    }}
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-32 border-t border-white/5 pt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { step: "01", title: "Consultation", desc: "We discuss your needs and measure your space." },
              { step: "02", title: "Design", desc: "CAD drawings and material selection." },
              { step: "03", title: "Fabrication", desc: "Precision cutting and assembly in our factory." },
              { step: "04", title: "Installation", desc: "Clean, efficient installation by expert fitters." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <span className="text-6xl font-display font-bold text-white/5 block mb-4">{item.step}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../../types';
import { getIcon } from './IconHelper';
import { getImageUrl } from '../../src/config/api';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-dark border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-accent hover:text-dark rounded-full flex items-center justify-center text-white transition-all"
        >
          <X size={24} />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 md:h-80 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10"></div>
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 md:left-10 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-dark font-bold text-xs mb-3 uppercase tracking-wider">
              {getIcon(service.icon, 20)}
              Premium Service
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">{service.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {service.details}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-accent" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Material & Quality Specs</h3>
              <div className="bg-white/5 border-l-4 border-accent p-5 rounded-r-lg">
                <p className="text-gray-300 italic">{service.qualitySpecs}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {service.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(img)}
                    alt={`${service.title} ${idx + 1}`}
                    className="rounded-lg object-cover aspect-square hover:scale-105 transition-transform duration-500 cursor-pointer border border-white/10"
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">Interested in this service?</p>
              <Link
                to="/contact"
                className="w-full py-3 bg-accent text-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                Get a Quote
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
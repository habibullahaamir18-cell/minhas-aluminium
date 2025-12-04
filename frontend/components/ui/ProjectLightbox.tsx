import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../../types';

interface ProjectLightboxProps {
  project: Project;
  onClose: () => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 z-[110] text-white hover:text-accent transition-colors p-2 bg-black/20 rounded-full"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <div 
        className="relative w-full max-w-6xl flex items-center justify-center h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Buttons */}
        {project.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent transition-all z-[105] bg-black/30 hover:bg-black/50 rounded-full"
            >
              <ChevronLeft size={40} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent transition-all z-[105] bg-black/30 hover:bg-black/50 rounded-full"
            >
              <ChevronRight size={40} />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className="relative w-full h-[85vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                src={project.images[currentIndex]} 
                alt={`${project.title} - View ${currentIndex + 1}`} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </AnimatePresence>
            
            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
                <h3 className="text-white text-2xl font-bold">{project.title}</h3>
                <p className="text-accent">{project.category} — {project.location}</p>
                {project.images.length > 1 && (
                  <p className="text-gray-400 text-xs mt-2">{currentIndex + 1} / {project.images.length}</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
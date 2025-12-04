import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Reveal } from '../components/ui/Reveal';
import { Award, Users, TrendingUp, Clock } from 'lucide-react';

const About: React.FC = () => {
  const [about, setAbout] = useState({
    ceoName: 'Ahmed Minhas',
    yearsExperience: 16
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/info');
        if (res.data?.about) {
          setAbout(res.data.about);
        }
      } catch (err) {
        console.error("Failed to fetch info", err);
      }
    };
    fetchInfo();
  }, []);

  const startYear = new Date().getFullYear() - about.yearsExperience;

  return (
    <div className="bg-dark min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-dark py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">Our Story</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">From a small workshop in Rawalpindi to a nationwide leader in fabrication.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1581094794329-cd1361ddee2e?q=80&w=2127&auto=format&fit=crop"
              alt="Factory Workshop"
              className="rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="text-3xl font-bold text-white mb-6">{about.yearsExperience} Years of Excellence</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Founded in {startYear}, Minhas Aluminium and Glass Corporation began with a single goal: bring unmatched quality and reliability to Pakistan’s construction and renovation projects.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              Over the last decade, we’ve grown into a trusted name—delivering commercial facades, residential windows, shopfronts, stair railings and custom glass solutions across Punjab and beyond. Our team combines traditional craftsmanship with modern fabrication techniques, ensuring every project meets exacting standards.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded text-accent"><Award /></div>
                <span className="text-white font-medium">Quality Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded text-accent"><Users /></div>
                <span className="text-white font-medium">Expert Team</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded text-accent"><TrendingUp /></div>
                <span className="text-white font-medium">Modern Tech</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded text-accent"><Clock /></div>
                <span className="text-white font-medium">On-time Delivery</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Our Journey</h2>
          <div className="relative border-l border-white/10 ml-6 md:ml-0 md:pl-0 space-y-12">
            {[
              { year: '2009', title: 'Foundation', desc: 'Started as a small workshop in Rawalpindi with 3 employees.' },
              { year: '2014', title: 'Commercial Expansion', desc: 'Completed first major plaza facade in Blue Area, Islamabad.' },
              { year: '2019', title: 'Modernization', desc: 'Imported state-of-the-art cutting machinery to increase precision.' },
              { year: '2023', title: 'Nationwide Reach', desc: 'Expanded operations to Lahore and Karachi for corporate clients.' }
            ].map((item, idx) => (
              <Reveal key={idx} width="100%">
                <div className="md:flex items-center group">
                  <div className="hidden md:block w-1/2 text-right pr-12">
                    <span className="text-5xl font-display font-bold text-white/5 group-hover:text-accent/20 transition-colors">{item.year}</span>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-dark border-2 border-accent rounded-full -translate-x-[9px] md:-translate-x-2 mt-2 md:mt-0"></div>
                  <div className="pl-12 md:w-1/2 md:pl-12">
                    <span className="md:hidden text-2xl font-bold text-accent mb-2 block">{item.year}</span>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Leadership</h2>
          <div className="max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-colors">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" alt="CEO" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-accent" />
            <h3 className="text-xl font-bold text-white">{about.ceoName}</h3>
            <p className="text-accent text-sm uppercase tracking-widest mt-1">CEO & Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
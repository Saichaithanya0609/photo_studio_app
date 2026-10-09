import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { STUDIO_SERVICES, type StudioService } from '../../data/studioData';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

interface StudioServicesProps {
  onSelectServiceToBook: (serviceTitle: string) => void;
}

const ServiceCard: React.FC<{
  service: StudioService;
  index: number;
  onBook: () => void;
}> = ({ service, index, onBook }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-[#0e0e14] flex flex-col h-full shadow-2xl transition-shadow duration-300 hover:shadow-amber-500/10 hover:border-amber-500/40"
      >
        {/* Card Glare effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(212,175,55,${glarePos.opacity}), transparent 60%)`,
          }}
        />

        {/* Card Image */}
        <div className="relative h-60 sm:h-64 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-[#0e0e14]/40 to-transparent" />

          {/* Pricing Tag */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-lg">
            {service.startingPrice}
          </div>

          {/* Index Counter Badge */}
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800">
            0{index + 1}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif text-white group-hover:text-amber-200 transition-colors flex items-center justify-between">
              <span>{service.title}</span>
              <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>

            <p className="text-xs text-amber-400/90 font-mono mt-1 tracking-wide">
              {service.tagline}
            </p>

            <p className="text-zinc-400 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
              {service.description}
            </p>

            {/* Deliverables Checklist */}
            <div className="mt-5 space-y-2 pt-4 border-t border-zinc-800/80">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Action */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60">
            <button
              onClick={onBook}
              className="w-full py-2.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 group/btn"
            >
              <span>Commission Service</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover/btn:text-zinc-950 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const StudioServices: React.FC<StudioServicesProps> = ({ onSelectServiceToBook }) => {
  return (
    <section id="services" className="relative py-28 bg-[#08080a] text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
                Bespoke Disciplines
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
              Crafted for Life’s Most <br />
              <span className="text-zinc-400 italic">Precious & Demanding Moments.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md font-light leading-relaxed">
            Every discipline is approached with cinematic medium-format optics, dedicated art
            direction, and bespoke museum-grade color correction.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STUDIO_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onBook={() => onSelectServiceToBook(service.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

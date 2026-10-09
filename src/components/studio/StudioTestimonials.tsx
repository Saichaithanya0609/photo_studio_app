import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../../data/studioData';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const StudioTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="relative py-28 bg-[#0a0a0e] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              Praise & Endorsements
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            Words From Those Who <br />
            <span className="text-zinc-400 italic">Entrusted Us With Their Stories.</span>
          </h2>

          {/* Clearly marked placeholder review indicator as required */}
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            ✦ Curated Editorial Showcase • Demo Client Feedback
          </div>
        </div>

        {/* Testimonial Carousel Card */}
        <div className="relative max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#121218] to-[#0a0a0e] p-8 sm:p-12 shadow-2xl">
          <Quote className="w-12 h-12 text-amber-400/20 absolute top-8 left-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-2xl font-serif text-zinc-200 leading-relaxed max-w-2xl italic font-light mb-8">
                "{current.quote}"
              </blockquote>

              {/* Client Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md"
                />
                <div className="text-left">
                  <h4 className="text-base font-serif font-medium text-white">
                    {current.clientName}
                  </h4>
                  <p className="text-xs text-amber-300/80 font-mono mt-0.5">
                    {current.occasion}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
                    {current.location}
                  </p>
                </div>
              </div>

              {/* Distinctive demo identifier pill */}
              <div className="mt-6 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                {current.verifiedLabel}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/80 w-full">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

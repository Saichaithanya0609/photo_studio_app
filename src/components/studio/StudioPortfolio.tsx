import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PORTFOLIO_ITEMS } from '../../data/studioData';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  MapPin,
  Calendar,
} from 'lucide-react';

export const StudioPortfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const categories = ['All', 'Weddings', 'Portraits', 'Events', 'Products'];

  const filteredItems =
    activeCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  // Lightbox Navigation
  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null
    );
  }, [selectedPhotoIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null
    );
  }, [selectedPhotoIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, handleCloseLightbox, handlePrev, handleNext]);

  const activePhoto =
    selectedPhotoIndex !== null ? filteredItems[selectedPhotoIndex] : null;

  return (
    <section id="portfolio" className="relative py-28 bg-[#0a0a0e] text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
                Curated Gallery
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
              Masterpieces in <span className="text-zinc-400 italic">Light & Emotion.</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedPhotoIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Varied Asymmetric Masonry Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              // Set varied aspect ratios in the grid
              const spanClass =
                item.aspect === 'tall'
                  ? 'sm:row-span-2'
                  : item.aspect === 'wide'
                  ? 'sm:col-span-2'
                  : 'sm:row-span-1';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => handleOpenLightbox(index)}
                  className={`group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer shadow-xl ${spanClass}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Dark Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Corner Accent Border */}
                  <div className="absolute inset-3 border border-amber-400/0 group-hover:border-amber-400/30 rounded-xl transition-all duration-300 pointer-events-none" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-wider text-amber-300 border border-zinc-800">
                    {item.category}
                  </div>

                  {/* Maximize Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-serif text-white group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {item.location}
                      </span>
                      <span>•</span>
                      <span>{item.year}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
          >
            {/* Top Lightbox Toolbar */}
            <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/20">
                  {activePhoto.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {selectedPhotoIndex + 1} / {filteredItems.length}
                </span>
              </div>

              <button
                onClick={handleCloseLightbox}
                className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center Image Container with Previous & Next controls */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all shadow-xl"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Active Image */}
              <motion.img
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] max-w-[90vw] sm:max-w-[80vw] object-contain rounded-lg shadow-2xl border border-zinc-800/80"
              />

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all shadow-xl"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Metadata Bar */}
            <div className="w-full max-w-4xl mx-auto bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
              <div>
                <h4 className="text-lg sm:text-xl font-serif text-white">{activePhoto.title}</h4>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {activePhoto.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {activePhoto.year}
                  </span>
                </div>
              </div>

              {/* Optical Metadata */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePhoto.gear}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Hero3DCanvas } from './3d/Hero3DCanvas';
import { STUDIO_INFO } from '../../data/studioData';

interface StudioHeroProps {
  onExploreWork: () => void;
  onBookSession: () => void;
  onOpenPhotoLab: () => void;
}

export const StudioHero: React.FC<StudioHeroProps> = ({
  onExploreWork,
  onBookSession,
  onOpenPhotoLab,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#08080a] pt-24 pb-16 lg:py-0"
    >
      {/* Background Cinematic Atmosphere & Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial-[circle_at_center_top] from-amber-500/10 via-transparent to-transparent opacity-60" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 -right-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        {/* Subtle Fine-Art Grain Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Deep Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-100px)]">
        {/* Left Column: Cinematic Headline & Story */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col justify-center text-left"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 backdrop-blur-sm self-start mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              Bespoke Photography & Cinema
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif text-white tracking-tight leading-[1.08] mb-6">
            Every Frame <br />
            <span className="italic font-light text-zinc-300">Tells a </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-serif font-normal">
              Story.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-xl mb-10">
            {STUDIO_INFO.subheadline}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreWork}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 text-xs font-semibold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/20 group"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBookSession}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-700 hover:border-amber-400/50 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium tracking-widest uppercase transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book a Session</span>
            </button>

            {/* Launch Lab link */}
            <button
              onClick={onOpenPhotoLab}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Studio DIP Lab</span>
            </button>
          </div>

          {/* Sub-features / Proof points */}
          <div className="mt-12 pt-8 border-t border-zinc-800/60 grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-serif text-amber-300">12+</div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">
                Years of Mastery
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif text-amber-300">450+</div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">
                Weddings Documented
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif text-amber-300">28</div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">
                Global Awards
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Camera Model & Floating Frames */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative flex items-center justify-center h-[420px] sm:h-[480px] lg:h-[620px]"
        >
          {/* Subtle Halo Spotlight Behind Camera */}
          <div className="absolute w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />

          {/* Interactive Three.js 3D Camera Scene */}
          <Hero3DCanvas className="w-full h-full" />

          {/* Subtle Technical Lens Stamp Overlay */}
          <div className="absolute bottom-4 right-4 hidden sm:flex flex-col items-end text-right pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-amber-300/60 uppercase">
              OPTICS • 50MM F/1.2 NOCT
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ROTATION PARALLAX READY
            </span>
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-auto">
        <button
          onClick={onExploreWork}
          className="flex flex-col items-center text-zinc-500 hover:text-amber-300 transition-colors group focus:outline-none"
          aria-label="Scroll to discover our work"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-zinc-500 group-hover:text-amber-300 transition-colors">
            Scroll to Explore
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-400 mt-1" />
        </button>
      </div>
    </section>
  );
};

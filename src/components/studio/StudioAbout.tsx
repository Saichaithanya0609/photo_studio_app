import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, ShieldCheck } from 'lucide-react';
import { STUDIO_STATS } from '../../data/studioData';

export const StudioAbout: React.FC = () => {
  const pillars = [
    {
      icon: <Eye className="w-5 h-5 text-amber-300" />,
      title: 'The Observational Gaze',
      description:
        'We believe the most profound frames cannot be posed. We practice patient anticipation, capturing authentic chemistry and spontaneous joy in their purest truth.',
    },
    {
      icon: <Compass className="w-5 h-5 text-amber-300" />,
      title: 'Optical Artistry',
      description:
        'Equipped with medium format digital backs and vintage prime glass, we render skin tones with painterly luminance and unrivaled three-dimensional depth.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-300" />,
      title: 'Archival Heirlooms',
      description:
        'Every final image undergoes rigorous color-grading and tone-mapping before being printed on archival museum cotton paper designed to endure a century.',
    },
  ];

  return (
    <section id="about" className="relative py-28 bg-[#0a0a0e] text-white overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="max-w-7xl mx-auto h-full border-x border-zinc-800" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              The Creative Philosophy
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            Light is not merely our medium; <br />
            <span className="text-zinc-400 italic">it is the author of human memory.</span>
          </h2>
        </div>

        {/* Asymmetric Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          {/* Asymmetric Imagery Left */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
                alt="Studio Fine Art Wedding"
                className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                  AMALFI COAST • 2025
                </span>
                <p className="text-sm font-serif text-white mt-1">
                  "Capturing love as a fine-art cinematic tapestry."
                </p>
              </div>
            </div>

            {/* Overlapping Floating Secondary Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-10 -right-4 sm:-right-8 w-48 sm:w-64 rounded-xl overflow-hidden border-2 border-amber-400/40 shadow-2xl hidden sm:block z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
                alt="Portrait Lighting Study"
                className="w-full h-56 sm:h-72 object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300">
                HAUTE PORTRAITURE
              </div>
            </motion.div>

            {/* Decorative Gold Frame Geometry Accent */}
            <div className="absolute -top-4 -left-4 w-28 h-28 border-t-2 border-l-2 border-amber-400/30 rounded-tl-xl pointer-events-none" />
          </div>

          {/* Philosophy & Pillars Right */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-6">
              Founded on the belief that genuine emotion outlives every fleeting trend.
            </h3>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Since 2013, Lumina Fine Art Studios has operated at the intersection of European
              cinematic storytelling and classical chiaroscuro portraiture. Rather than forcing you
              into rigid poses, our artists cultivate an unhurried, collaborative atmosphere where
              your true chemistry unfolds organically.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 font-light">
              Whether documenting high-society weddings in Lake Como or creating signature commercial
              imagery for Swiss horology ateliers, we approach every commission with unwavering
              reverence for natural light, composition, and emotional resonance.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 gap-6">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-amber-400/30 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-zinc-800 text-amber-300 shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white tracking-wide">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Statistics Banner (with clearly identified demo/placeholder notes) */}
        <div className="mt-8 pt-12 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              STUDIO BENCHMARKS & EXPERTISE
            </span>
            <span className="text-[10px] font-mono text-amber-400/70 uppercase">
              [CURATED DEMO METRICS]
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STUDIO_STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-black/60 relative group hover:border-amber-400/40 transition-colors"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif text-amber-300 mb-2 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white tracking-wide">
                  {stat.label}
                </div>
                <div className="text-xs text-zinc-500 mt-1 font-mono">
                  {stat.note}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

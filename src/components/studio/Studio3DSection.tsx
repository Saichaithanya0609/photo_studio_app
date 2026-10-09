import React from 'react';
import { Lens3DExperience } from './3d/Lens3DExperience';
import { Eye, Layers, Compass, Sparkles } from 'lucide-react';

export const Studio3DSection: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative py-28 bg-[#08080a] text-white overflow-hidden border-y border-zinc-800/60"
    >
      {/* Background Cinematic Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              Interactive 3D Optical Experience
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            The Anatomy of Light. <br />
            <span className="text-zinc-400 italic">Precision Optics in Real-Time 3D.</span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base mt-4 font-light leading-relaxed">
            Every Lumina masterwork begins with custom-calibrated prime glass. Interact with our 3D
            optical barrel below—rotate the chassis in 360°, actuate the physical aperture iris, and
            experience the engineering behind our signature depth of field.
          </p>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10 text-center">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
            <Layers className="w-4 h-4 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">
              Fluorite Glass Elements
            </h4>
            <p className="text-[11px] text-zinc-400 mt-1">
              Refraction-calibrated anti-reflective optical coatings.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
            <Eye className="w-4 h-4 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">
              9-Blade Aperture Iris
            </h4>
            <p className="text-[11px] text-zinc-400 mt-1">
              Harmonic circular bokeh from ultra-fast ƒ/1.2 to ƒ/16.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
            <Compass className="w-4 h-4 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">
              Tactile Gyro Drag
            </h4>
            <p className="text-[11px] text-zinc-400 mt-1">
              Full 360° mouse drag, scroll rotation & touch support.
            </p>
          </div>
        </div>

        {/* 3D WebGL Scene Container */}
        <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950/80 to-[#08080a] shadow-2xl overflow-hidden p-2 sm:p-4">
          <Lens3DExperience />
        </div>
      </div>
    </section>
  );
};

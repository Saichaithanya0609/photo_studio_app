import React from 'react';
import { STUDIO_INFO } from '../../data/studioData';
import {
  MapPin,
  Phone,
  Clock,
  Compass,
  Video,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const StudioContact: React.FC = () => {
  return (
    <section id="contact" className="relative py-28 bg-[#0a0a0e] text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              Location & Atelier
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            Visit Our <span className="text-zinc-400 italic">Sanctuary of Light.</span>
          </h2>

          <p className="text-zinc-400 text-sm mt-3 font-light">
            We welcome clients to our daylight studio loft by appointment for private consultations,
            bespoke print proofs, and fine-art portrait sessions.
          </p>
        </div>

        {/* Contact Info + Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Contact Details Left */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Studio Address */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0e0e14] hover:border-amber-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                      Studio Headquarters
                    </span>
                    <h3 className="text-sm font-medium text-white mt-1">
                      {STUDIO_INFO.address}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Mercer Street Arts District • Freight Elevator Access
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Communications */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0e0e14] hover:border-amber-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                      Private Telephone & Concierge
                    </span>
                    <div className="text-sm font-medium text-white mt-1">
                      <a
                        href={`tel:${STUDIO_INFO.phone}`}
                        className="hover:text-amber-300 transition-colors font-mono"
                      >
                        {STUDIO_INFO.phone}
                      </a>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      <a
                        href={`mailto:${STUDIO_INFO.email}`}
                        className="hover:text-amber-300 transition-colors font-mono"
                      >
                        {STUDIO_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0e0e14] hover:border-amber-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                      Atelier Hours
                    </span>
                    <p className="text-sm font-medium text-white mt-1">
                      {STUDIO_INFO.hours}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Evenings & weekends reserved for shooting on location.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-zinc-800">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                Follow The Narrative
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={STUDIO_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href={STUDIO_INFO.socials.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                  aria-label="Pinterest"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href={STUDIO_INFO.socials.vimeo}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                  aria-label="Vimeo Cinema"
                >
                  <Video className="w-4 h-4" />
                </a>
                <a
                  href={STUDIO_INFO.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                  aria-label="YouTube Channel"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Stylized Map Placeholder Right */}
          <div className="lg:col-span-7 rounded-3xl border border-zinc-800 bg-[#0e0e14] overflow-hidden relative min-h-[420px] flex flex-col justify-between p-6 shadow-2xl">
            {/* Map Canvas Background Grid */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `radial-gradient(rgba(212,175,55,0.4) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Stylized Manhattan Streets Overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="10%" y1="0%" x2="40%" y2="100%" stroke="#d4af37" strokeWidth="2" />
              <line x1="30%" y1="0%" x2="60%" y2="100%" stroke="#d4af37" strokeWidth="1.5" />
              <line x1="50%" y1="0%" x2="80%" y2="100%" stroke="#d4af37" strokeWidth="1" />
              <line x1="0%" y1="35%" x2="100%" y2="20%" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="0%" y1="65%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1" />
              <line x1="0%" y1="85%" x2="100%" y2="70%" stroke="#ffffff" strokeWidth="1" />
            </svg>

            {/* Top Map HUD */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Atelier Open Today</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 bg-black/70 px-3 py-1 rounded-md border border-zinc-800">
                40.7233° N, 73.9984° W
              </div>
            </div>

            {/* Center Pin Target */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 animate-ping absolute -inset-2" />
                <div className="w-12 h-12 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-xl shadow-amber-400/40 relative z-10">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
              </div>

              <div className="mt-4 text-center bg-black/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-500/30 shadow-2xl">
                <div className="font-serif text-white font-medium text-sm">
                  Lumina Fine Art Atelier
                </div>
                <div className="text-[11px] font-mono text-amber-300/80 mt-0.5">
                  120 Mercer St, SoHo Loft 402, New York
                </div>
              </div>
            </div>

            {/* Bottom Map Note */}
            <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400 font-mono pt-4 border-t border-zinc-800/80">
              <span>✦ High-Ceiling Natural Daylight Studio</span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

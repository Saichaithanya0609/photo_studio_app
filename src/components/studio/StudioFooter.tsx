import React from 'react';
import { Camera, ArrowUp, Sparkles } from 'lucide-react';
import { STUDIO_INFO } from '../../data/studioData';

interface StudioFooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onOpenPhotoLab: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  onNavigateToSection,
  onOpenPhotoLab,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060608] border-t border-zinc-800 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full border border-amber-400/40 bg-zinc-900 flex items-center justify-center text-amber-300 shadow-md">
                <Camera className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-base font-medium text-white">
                  LUMINA
                </span>
                <span className="text-[9px] tracking-[0.35em] text-amber-400/80 uppercase font-sans -mt-1 font-semibold">
                  Fine Art Studios
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm mb-6">
              Bespoke fine-art photography, soulful wedding heirlooms, editorial portraiture, and
              cinematic visual craft for clients who cherish timeless elegance.
            </p>

            <button
              onClick={onOpenPhotoLab}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 hover:border-amber-400/60 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono tracking-wider transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Studio Photo Lab & DIP Suite</span>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigateToSection('hero')}
                  className="hover:text-white transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('about')}
                  className="hover:text-white transition-colors"
                >
                  Creative Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Bespoke Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('portfolio')}
                  className="hover:text-white transition-colors"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('experience')}
                  className="hover:text-white transition-colors"
                >
                  3D Optics Experience
                </button>
              </li>
            </ul>
          </div>

          {/* Disciplines */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Wedding Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Haute Portraiture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Destination Pre-Weddings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Commercial Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('services')}
                  className="hover:text-white transition-colors"
                >
                  Cinematic Videography
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">
              Atelier
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400 font-mono">
              <p>{STUDIO_INFO.address}</p>
              <p className="text-amber-300/80">{STUDIO_INFO.phone}</p>
              <p className="text-zinc-300">{STUDIO_INFO.email}</p>
              <p className="text-zinc-500 text-[11px] mt-2">{STUDIO_INFO.hours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} {STUDIO_INFO.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Handcrafted with precision optics & React</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

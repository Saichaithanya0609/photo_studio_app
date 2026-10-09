import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface StudioNavbarProps {
  onOpenPhotoLab: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const StudioNavbar: React.FC<StudioNavbarProps> = ({
  onOpenPhotoLab,
  onNavigateToSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: '3D Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#09090c]/90 backdrop-blur-md border-b border-amber-500/15 py-3 shadow-2xl shadow-black/60'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Studio Brand Logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-zinc-900/80 flex items-center justify-center text-amber-300 group-hover:border-amber-400 transition-colors shadow-lg">
            <Camera className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.25em] text-base sm:text-lg font-medium text-white group-hover:text-amber-200 transition-colors">
              LUMINA
            </span>
            <span className="text-[9px] tracking-[0.35em] text-amber-400/80 uppercase font-sans -mt-1 font-semibold">
              Fine Art Studios
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-300 hover:text-amber-300 transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Studio Photo Lab Launch Button */}
          <button
            onClick={onOpenPhotoLab}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-zinc-700 hover:border-amber-400/60 bg-zinc-900/80 text-zinc-300 hover:text-white text-xs font-mono tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10"
            title="Launch Interactive DIP Photo Editor & Collage Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Photo Lab</span>
          </button>

          {/* Book a Session CTA */}
          <button
            onClick={() => handleLinkClick('booking')}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 text-xs font-semibold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-950" />
            <span>Book Session</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenPhotoLab}
            className="sm:hidden flex items-center justify-center p-2 rounded-full bg-zinc-900 border border-zinc-700 text-amber-300"
            title="Studio Photo Lab"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0e]/98 border-b border-amber-500/20 backdrop-blur-xl px-6 py-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="flex items-center justify-between text-left text-sm uppercase tracking-[0.2em] font-medium text-zinc-300 hover:text-amber-300 py-2 border-b border-zinc-800/60"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenPhotoLab();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-mono tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch Studio Photo Lab</span>
              </button>

              <button
                onClick={() => handleLinkClick('booking')}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 text-xs font-semibold tracking-widest uppercase shadow-lg shadow-amber-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

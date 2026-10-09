import React, { useState } from 'react';
import { StudioNavbar } from './StudioNavbar';
import { StudioHero } from './StudioHero';
import { StudioAbout } from './StudioAbout';
import { StudioServices } from './StudioServices';
import { StudioPortfolio } from './StudioPortfolio';
import { Studio3DSection } from './Studio3DSection';
import { StudioTestimonials } from './StudioTestimonials';
import { StudioBooking } from './StudioBooking';
import { StudioContact } from './StudioContact';
import { StudioFooter } from './StudioFooter';

interface StudioHomeProps {
  onOpenPhotoLab: () => void;
}

export const StudioHome: React.FC<StudioHomeProps> = ({ onOpenPhotoLab }) => {
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('Wedding Photography');

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceToBook = (serviceTitle: string) => {
    setSelectedServiceForBooking(serviceTitle);
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 selection:bg-amber-400 selection:text-zinc-950 font-sans">
      {/* 1. Navigation */}
      <StudioNavbar
        onOpenPhotoLab={onOpenPhotoLab}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* 2. Hero Section with 3D Camera & Parallax */}
      <StudioHero
        onExploreWork={() => handleNavigateToSection('portfolio')}
        onBookSession={() => handleNavigateToSection('booking')}
        onOpenPhotoLab={onOpenPhotoLab}
      />

      {/* 3. About the Studio & Philosophy */}
      <StudioAbout />

      {/* 4. Services with 3D Card Hover Tilts */}
      <StudioServices onSelectServiceToBook={handleSelectServiceToBook} />

      {/* 5. Portfolio Gallery with Masonry & Lightbox */}
      <StudioPortfolio />

      {/* 6. Immersive 3D Experience (Interactive 3D Lens & Aperture Iris) */}
      <Studio3DSection />

      {/* 7. Client Testimonials Carousel */}
      <StudioTestimonials />

      {/* 8. Booking Form with Accessible Validation */}
      <StudioBooking initialService={selectedServiceForBooking} />

      {/* 9. Contact Section with Atelier Info & Stylized Map */}
      <StudioContact />

      {/* 10. Footer */}
      <StudioFooter
        onNavigateToSection={handleNavigateToSection}
        onOpenPhotoLab={onOpenPhotoLab}
      />
    </div>
  );
};

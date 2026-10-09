export interface StudioService {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  deliverables: string[];
  startingPrice: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Portraits' | 'Events' | 'Products';
  imageUrl: string;
  aspect: 'tall' | 'wide' | 'square';
  location: string;
  gear: string;
  year: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  occasion: string;
  location: string;
  rating: number;
  quote: string;
  avatar: string;
  verifiedLabel: string;
}

export interface StudioInfo {
  name: string;
  shortName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  socials: {
    instagram: string;
    pinterest: string;
    vimeo: string;
    youtube: string;
  };
}

export const STUDIO_INFO: StudioInfo = {
  name: 'LUMINA FINE ART STUDIOS',
  shortName: 'LUMINA',
  tagline: 'Every Frame Tells a Story.',
  headline: 'Every Frame Tells a Story.',
  subheadline:
    'Bespoke fine-art photography, soulful wedding heirlooms, editorial portraiture, and cinematic storytelling crafted for discerning clients worldwide.',
  address: 'Studio 402, Lumina Arts District, 120 Mercer St, New York, NY 10012',
  phone: '+1 (800) 456-7890',
  email: 'concierge@luminastudios.art',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM | Sun: Private Appointments',
  socials: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    vimeo: 'https://vimeo.com',
    youtube: 'https://youtube.com',
  },
};

export const STUDIO_STATS = [
  { value: '12+', label: 'Years of Mastery', note: 'Global Fine-Art Craft' },
  { value: '450+', label: 'Bespoke Celebrations', note: 'Weddings & Private Galas' },
  { value: '28', label: 'International Trophies', note: 'WPP & Editorial Accolades' },
  { value: '100%', label: 'Dedicated Focus', note: 'Handcrafted Artistry' },
];

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'weddings',
    title: 'Wedding Photography',
    tagline: 'Timeless romance captured with editorial finesse.',
    description:
      'Unobtrusive photojournalism paired with breathtaking editorial portraits. We preserve every tear, whisper, and joyous embrace into heirloom albums designed to endure generations.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      'Full Day Coverage (10-12 hrs)',
      'Two Master Photographers',
      'Hand-retouched High-Res Gallery',
      'Leather Bound Italian Heirloom Album',
    ],
    startingPrice: 'From $4,800',
  },
  {
    id: 'portraits',
    title: 'Portrait Photography',
    tagline: 'Soulful chiaroscuro and haute couture aesthetics.',
    description:
      'From executive presence to creative personality studies, our studio sessions utilize sculpted lighting, analog sensibilities, and thoughtful art direction to reveal your truest aura.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      'In-Studio or Location Session',
      'Bespoke Lighting & Creative Direction',
      'Hair & Makeup Consultation',
      'Archival Fine-Art Canvas Prints',
    ],
    startingPrice: 'From $1,200',
  },
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding Photography',
    tagline: 'Cinematic destination romance before the vows.',
    description:
      'We embark with you to breathtaking destinations—from misty Scottish highlands to historic Parisian avenues—capturing your intimacy in grand, cinematic landscapes.',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      'Multi-Location Destination Shoot',
      'Styling & Wardrobe Coordination',
      'Cinematic Highlight Trailer (4K)',
      'Luxury Gallery Showcase',
    ],
    startingPrice: 'From $3,400',
  },
  {
    id: 'products',
    title: 'Product Photography',
    tagline: 'Precision commercial aesthetics for luxury brands.',
    description:
      'Showcase your horology, haute parfumerie, and architectural products with razor-sharp macro optics, focus stacking, and calibrated color accuracy that drives desire.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      'Focus-Stacked Macro Imaging',
      'Commercial Licensing Rights',
      'Pure White & Stylized Editorial Sets',
      'Sub-pixel Digital Retouching',
    ],
    startingPrice: 'From $1,800',
  },
  {
    id: 'events',
    title: 'Event Photography',
    tagline: 'The vibrant pulse of premier soirees and summits.',
    description:
      'Discreet and dynamic coverage of cultural galas, fashion weeks, private charity balls, and milestone gatherings, documented with journalistic vibrancy and elegance.',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      'Real-Time Live Social Feed Delivery',
      'Candid & Red-Carpet Step & Repeat',
      'Multi-Angle Photo Team',
      'Full Resolution Online Archive',
    ],
    startingPrice: 'From $2,600',
  },
  {
    id: 'videography',
    title: 'Cinematic Videography',
    tagline: 'Moving imagery that speaks like a feature film.',
    description:
      'Anamorphic cinema lenses, authentic orchestral sound design, and color grading tuned to Kodak 35mm film stock. Your love story or brand campaign rendered in true motion art.',
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    deliverables: [
      '4K 10-bit Anamorphic Capture',
      'Licensed Film Score & Audio Mastering',
      'Cinematic Feature (8-12 Mins)',
      'Social Cut Teaser Reels',
    ],
    startingPrice: 'From $5,200',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Aura of Serenity',
    category: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    aspect: 'tall',
    location: 'Tribeca Studio, NY',
    gear: 'Hasselblad X2D 100C • XCD 80mm f/1.9',
    year: '2025',
  },
  {
    id: 'port-2',
    title: 'Tuscan Sunset Vows',
    category: 'Weddings',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    aspect: 'wide',
    location: 'Val d’Orcia, Tuscany',
    gear: 'Leica SL3 • Summilux 50mm f/1.4',
    year: '2025',
  },
  {
    id: 'port-3',
    title: 'Chronograph No. 08',
    category: 'Products',
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    aspect: 'square',
    location: 'Lumina Commercial Lab',
    gear: 'Sony A7R V • 90mm Macro f/2.8 G',
    year: '2024',
  },
  {
    id: 'port-4',
    title: 'The Golden Ballroom Soiree',
    category: 'Events',
    imageUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    aspect: 'tall',
    location: 'Grand Plaza, Paris',
    gear: 'Canon EOS R5 II • RF 28-70mm f/2L',
    year: '2025',
  },
  {
    id: 'port-5',
    title: 'Whispering Veil',
    category: 'Weddings',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    aspect: 'square',
    location: 'Lake Como, Villa Balbianello',
    gear: 'Leica M11 • Noctilux-M 50mm f/0.95',
    year: '2025',
  },
  {
    id: 'port-6',
    title: 'The Alabaster Silhouette',
    category: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
    aspect: 'tall',
    location: 'SoHo Rooftop, NY',
    gear: 'Hasselblad H6D-100c • HC 100mm f/2.2',
    year: '2024',
  },
  {
    id: 'port-7',
    title: 'Opal & Obsidian Essence',
    category: 'Products',
    imageUrl:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    aspect: 'wide',
    location: 'Milan Exhibition Lab',
    gear: 'Fujifilm GFX 100 II • GF 110mm f/2',
    year: '2025',
  },
  {
    id: 'port-8',
    title: 'Midnight Symphony Gala',
    category: 'Events',
    imageUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    aspect: 'wide',
    location: 'Lincoln Center, NY',
    gear: 'Sony FX3 Cinema • 35mm T1.5 Anamorphic',
    year: '2025',
  },
  {
    id: 'port-9',
    title: 'Elysian Vows in Amalfi',
    category: 'Weddings',
    imageUrl:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    aspect: 'tall',
    location: 'Ravello Cliffside, Italy',
    gear: 'Sony A1 • FE 50mm f/1.2 GM',
    year: '2024',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Elena & Alexander Vance',
    occasion: 'Destination Wedding in Lake Como',
    location: 'Villa Pizzo, Italy',
    rating: 5,
    quote:
      'Lumina did not merely photograph our wedding—they immortalized our hearts. Looking through our gallery feels like experiencing a high-art foreign romance film where every glance is poetry.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verifiedLabel: 'Verified Wedding Commission [Editorial Placeholder]',
  },
  {
    id: 'test-2',
    clientName: 'Julian Sterling',
    occasion: 'Executive Editorial & Personal Brand',
    location: 'Manhattan, New York',
    rating: 5,
    quote:
      'The lighting setup in their Tribeca loft is museum grade. The master photographer captured nuances in my expression that no one else ever noticed. A transformative experience.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verifiedLabel: 'Verified Studio Portrait Client [Editorial Placeholder]',
  },
  {
    id: 'test-3',
    clientName: 'Celine Moreau',
    occasion: 'Haute Parfumerie Global Campaign',
    location: 'Paris, France',
    rating: 5,
    quote:
      'Flawless precision. Lumina delivered macro focus-stacked glass bottles with refraction physics so pristine our Paris creative director approved every frame on the first pass.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verifiedLabel: 'Verified Luxury Brand Commission [Editorial Placeholder]',
  },
  {
    id: 'test-4',
    clientName: 'Marcus & Sophia Lindqvist',
    occasion: 'Pre-Wedding in the Swiss Alps',
    location: 'Zermatt, Switzerland',
    rating: 5,
    quote:
      'Hiking through sub-zero glacial peaks at dawn with the Lumina team was exhilarating. The resulting photographs belong in Vogue. Truly the pinnacle of photographic craftsmanship.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verifiedLabel: 'Verified Pre-Wedding Commission [Editorial Placeholder]',
  },
];

export interface SampleImage {
  id: string;
  name: string;
  category: string;
  url: string;
  thumb: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'portrait-1',
    name: 'Neon Portrait',
    category: 'Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'nature-1',
    name: 'Alpine Mountain Peak',
    category: 'Landscape',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'urban-1',
    name: 'Cyberpunk Tokyo Night',
    category: 'Urban',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'architecture-1',
    name: 'Minimal Architecture',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'wildlife-1',
    name: 'Golden Eagle',
    category: 'Wildlife',
    url: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=300&q=70',
  }
];

/**
 * Generates an aesthetic geometric abstract pattern on an HTML canvas as an offline fallback.
 */
export function generateFallbackImage(width: number = 800, height: number = 600): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Vivid gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(0.5, '#8b5cf6');
  grad.addColorStop(1, '#ec4899');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Geometric shapes for edge and contrast testing
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.arc(width * 0.35, height * 0.45, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.roundRect(width * 0.45, height * 0.3, 280, 220, [30]);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(width * 0.65, height * 0.6, 90, 0, Math.PI * 2);
  ctx.stroke();

  // Test lines for edge detection
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(80, 100 + i * 40);
    ctx.lineTo(260, 100 + i * 40);
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('LuminaArt Studio', width * 0.35, height * 0.78);
  ctx.font = '18px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('Digital Image Processing Test Pattern', width * 0.35, height * 0.84);

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Digital Image Processing - Background Removal & Replacement Engine
 * Supports:
 * 1. Automatic border/corner sampling background segmentation.
 * 2. Magic Wand interactive target color removal with tolerance & feathering.
 * 3. Composite replacement with Solid Color, Linear Gradient, Custom Image, or Portrait Blur.
 */

import type { BackgroundSettings } from '../../types/editor';
import { applyGaussianBlur } from './blurFilters';

/**
 * Computes color distance in Euclidean RGB space.
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
}

/**
 * Automatically estimates background color by sampling the 4 image corners and perimeter.
 */
export function estimateBackgroundColor(srcData: ImageData): { r: number; g: number; b: number } {
  const width = srcData.width;
  const height = srcData.height;
  const data = srcData.data;

  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];

  let rSum = 0, gSum = 0, bSum = 0;
  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * 4;
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
  }

  const count = samplePoints.length;
  return {
    r: Math.round(rSum / count),
    g: Math.round(gSum / count),
    b: Math.round(bSum / count),
  };
}

/**
 * Generates an alpha mask (0 for background, 255 for foreground) based on target color and tolerance.
 */
export function generateAlphaMask(
  srcData: ImageData,
  targetColor: { r: number; g: number; b: number },
  tolerance: number,
  feather: number
): Float32Array {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const mask = new Float32Array(total);

  const featherRange = Math.max(feather, 1);

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r = src[idx];
    const g = src[idx + 1];
    const b = src[idx + 2];

    const dist = colorDistance(r, g, b, targetColor.r, targetColor.g, targetColor.b);

    if (dist < tolerance) {
      // Definite background
      mask[i] = 0;
    } else if (dist < tolerance + featherRange) {
      // Feathered transition
      mask[i] = (dist - tolerance) / featherRange;
    } else {
      // Foreground
      mask[i] = 1;
    }
  }

  return mask;
}

/**
 * Applies background removal or replacement.
 */
export async function applyBackgroundProcessing(
  srcData: ImageData,
  settings: BackgroundSettings,
  customBgImage?: HTMLImageElement | null
): Promise<ImageData> {
  if (settings.mode === 'original') {
    return srcData;
  }

  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;

  // Determine target background color
  const target = settings.targetColor || estimateBackgroundColor(srcData);

  // Generate alpha mask
  const mask = generateAlphaMask(srcData, target, settings.tolerance, settings.feather);

  const output = new ImageData(width, height);
  const dst = output.data;

  if (settings.mode === 'transparent') {
    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      const alpha = mask[i];
      dst[idx] = src[idx];
      dst[idx + 1] = src[idx + 1];
      dst[idx + 2] = src[idx + 2];
      dst[idx + 3] = Math.round(src[idx + 3] * alpha);
    }
    return output;
  }

  if (settings.mode === 'blur') {
    // Blur entire original image for background
    const blurred = applyGaussianBlur(srcData, settings.blurAmount || 15);
    const bData = blurred.data;

    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      const fgAlpha = mask[i];
      const bgAlpha = 1 - fgAlpha;

      dst[idx] = Math.round(src[idx] * fgAlpha + bData[idx] * bgAlpha);
      dst[idx + 1] = Math.round(src[idx + 1] * fgAlpha + bData[idx + 1] * bgAlpha);
      dst[idx + 2] = Math.round(src[idx + 2] * fgAlpha + bData[idx + 2] * bgAlpha);
      dst[idx + 3] = 255;
    }
    return output;
  }

  if (settings.mode === 'solid') {
    // Parse hex color
    const hex = settings.solidColor.replace('#', '');
    const bgR = parseInt(hex.substring(0, 2), 16) || 0;
    const bgG = parseInt(hex.substring(2, 4), 16) || 0;
    const bgB = parseInt(hex.substring(4, 6), 16) || 0;

    for (let i = 0; i < total; i++) {
      const idx = i * 4;
      const fgAlpha = mask[i];
      const bgAlpha = 1 - fgAlpha;

      dst[idx] = Math.round(src[idx] * fgAlpha + bgR * bgAlpha);
      dst[idx + 1] = Math.round(src[idx + 1] * fgAlpha + bgG * bgAlpha);
      dst[idx + 2] = Math.round(src[idx + 2] * fgAlpha + bgB * bgAlpha);
      dst[idx + 3] = 255;
    }
    return output;
  }

  if (settings.mode === 'gradient') {
    const hex1 = settings.gradient.color1.replace('#', '');
    const r1 = parseInt(hex1.substring(0, 2), 16) || 0;
    const g1 = parseInt(hex1.substring(2, 4), 16) || 0;
    const b1 = parseInt(hex1.substring(4, 6), 16) || 0;

    const hex2 = settings.gradient.color2.replace('#', '');
    const r2 = parseInt(hex2.substring(0, 2), 16) || 0;
    const g2 = parseInt(hex2.substring(2, 4), 16) || 0;
    const b2 = parseInt(hex2.substring(4, 6), 16) || 0;

    for (let y = 0; y < height; y++) {
      const t = y / height;
      const bgR = r1 * (1 - t) + r2 * t;
      const bgG = g1 * (1 - t) + g2 * t;
      const bgB = b1 * (1 - t) + b2 * t;

      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const idx = i * 4;
        const fgAlpha = mask[i];
        const bgAlpha = 1 - fgAlpha;

        dst[idx] = Math.round(src[idx] * fgAlpha + bgR * bgAlpha);
        dst[idx + 1] = Math.round(src[idx + 1] * fgAlpha + bgG * bgAlpha);
        dst[idx + 2] = Math.round(src[idx + 2] * fgAlpha + bgB * bgAlpha);
        dst[idx + 3] = 255;
      }
    }
    return output;
  }

  if (settings.mode === 'image' && customBgImage) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(customBgImage, 0, 0, width, height);
      const bgImgData = ctx.getImageData(0, 0, width, height);
      const bData = bgImgData.data;

      for (let i = 0; i < total; i++) {
        const idx = i * 4;
        const fgAlpha = mask[i];
        const bgAlpha = 1 - fgAlpha;

        dst[idx] = Math.round(src[idx] * fgAlpha + bData[idx] * bgAlpha);
        dst[idx + 1] = Math.round(src[idx + 1] * fgAlpha + bData[idx + 1] * bgAlpha);
        dst[idx + 2] = Math.round(src[idx + 2] * fgAlpha + bData[idx + 2] * bgAlpha);
        dst[idx + 3] = 255;
      }
      return output;
    }
  }

  return srcData;
}

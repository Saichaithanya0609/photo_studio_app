/**
 * Digital Image Processing - Histogram Calculation & Equalization
 * Implements Probability Mass Function (PMF), Cumulative Distribution Function (CDF),
 * and Luminance-preserving / RGB Global Histogram Equalization.
 */

import type { HistogramData } from '../../types/editor';

/**
 * Computes 256-bin histograms for R, G, B channels and Luminance.
 */
export function computeHistogram(imageData: ImageData): HistogramData {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const lum = new Array(256).fill(0);

  const data = imageData.data;
  const totalPixels = imageData.width * imageData.height;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const red = data[idx];
    const green = data[idx + 1];
    const blue = data[idx + 2];
    const l = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);

    r[red]++;
    g[green]++;
    b[blue]++;
    lum[l]++;
  }

  return { r, g, b, lum };
}

/**
 * Computes the Cumulative Distribution Function (CDF) and generates the
 * Histogram Equalization transformation lookup table (LUT):
 * s_k = round((L - 1) * (CDF(k) - CDF_min) / (TotalPixels - CDF_min))
 */
export function computeEqualizationLut(histogram: number[], totalPixels: number): Uint8Array {
  const cdf = new Array(256).fill(0);
  let cumulative = 0;
  let cdfMin = -1;

  for (let i = 0; i < 256; i++) {
    cumulative += histogram[i];
    cdf[i] = cumulative;
    if (cdfMin === -1 && histogram[i] > 0) {
      cdfMin = cumulative;
    }
  }

  const lut = new Uint8Array(256);
  const denominator = totalPixels - cdfMin;

  if (denominator <= 0) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  for (let i = 0; i < 256; i++) {
    lut[i] = Math.min(255, Math.max(0, Math.round(((cdf[i] - cdfMin) / denominator) * 255)));
  }

  return lut;
}

/**
 * Applies Histogram Equalization.
 * In 'luminance' mode (Recommended):
 * - Converts RGB to HSL (Hue, Saturation, Lightness).
 * - Equalizes only the Lightness (L) channel using its CDF.
 * - Converts back to RGB.
 * This enhances dynamic range and contrast without altering colors or inducing color artifacts!
 * 
 * In 'rgb' mode:
 * - Equalizes R, G, and B independently.
 */
export function applyHistogramEqualization(
  srcData: ImageData,
  channel: 'luminance' | 'rgb' = 'luminance'
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const totalPixels = width * height;
  const src = srcData.data;

  const output = new ImageData(width, height);
  const dst = output.data;

  const { r: histR, g: histG, b: histB, lum: histLum } = computeHistogram(srcData);

  if (channel === 'luminance') {
    const lumLut = computeEqualizationLut(histLum, totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = src[idx] / 255;
      const g = src[idx + 1] / 255;
      const b = src[idx + 2] / 255;

      // RGB to HSL
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      // Equalize Lightness
      const currentLumByte = Math.round(l * 255);
      const newL = lumLut[currentLumByte] / 255;

      // HSL to RGB
      const [newR, newG, newB] = hslToRgb(h, s, newL);

      dst[idx] = Math.round(newR * 255);
      dst[idx + 1] = Math.round(newG * 255);
      dst[idx + 2] = Math.round(newB * 255);
      dst[idx + 3] = src[idx + 3];
    }
  } else {
    // RGB Independent Equalization
    const lutR = computeEqualizationLut(histR, totalPixels);
    const lutG = computeEqualizationLut(histG, totalPixels);
    const lutB = computeEqualizationLut(histB, totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      dst[idx] = lutR[src[idx]];
      dst[idx + 1] = lutG[src[idx + 1]];
      dst[idx + 2] = lutB[src[idx + 2]];
      dst[idx + 3] = src[idx + 3];
    }
  }

  return output;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    return [l, l, l];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hueToRgb(p, q, h + 1 / 3);
  const g = hueToRgb(p, q, h);
  const b = hueToRgb(p, q, h - 1 / 3);
  return [r, g, b];
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

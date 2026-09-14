/**
 * Digital Image Processing - Color Transformations, Tone Adjustments & Thresholding
 */

import type { ImageAdjustments } from '../../types/editor';

/**
 * Calculates Otsu's optimal global threshold value by maximizing inter-class variance between
 * background and foreground pixel clusters.
 */
export function calculateOtsuThreshold(srcData: ImageData): number {
  const data = srcData.data;
  const total = srcData.width * srcData.height;
  const hist = new Array(256).fill(0);

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    hist[lum]++;
  }

  let sum = 0;
  for (let t = 0; t < 256; t++) {
    sum += t * hist[t];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    // Between class variance
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }

  return threshold;
}

/**
 * Applies Binarization / Thresholding.
 */
export function applyThreshold(srcData: ImageData, threshold: number): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
    const val = lum >= threshold ? 255 : 0;
    dst[idx] = val;
    dst[idx + 1] = val;
    dst[idx + 2] = val;
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Grayscale transformations (BT.601, BT.709, Average, Desaturate).
 */
export function applyGrayscale(
  srcData: ImageData,
  standard: 'bt601' | 'bt709' | 'avg' | 'desaturate' = 'bt601'
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r = src[idx];
    const g = src[idx + 1];
    const b = src[idx + 2];

    let gray = 0;
    if (standard === 'bt601') {
      gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    } else if (standard === 'bt709') {
      gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    } else if (standard === 'avg') {
      gray = Math.round((r + g + b) / 3);
    } else if (standard === 'desaturate') {
      gray = Math.round((Math.max(r, g, b) + Math.min(r, g, b)) / 2);
    }

    dst[idx] = gray;
    dst[idx + 1] = gray;
    dst[idx + 2] = gray;
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Sepia Tone transformation matrix
 */
export function applySepia(srcData: ImageData): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r = src[idx];
    const g = src[idx + 1];
    const b = src[idx + 2];

    const tr = 0.393 * r + 0.769 * g + 0.189 * b;
    const tg = 0.349 * r + 0.686 * g + 0.168 * b;
    const tb = 0.272 * r + 0.534 * g + 0.131 * b;

    dst[idx] = Math.min(255, Math.round(tr));
    dst[idx + 1] = Math.min(255, Math.round(tg));
    dst[idx + 2] = Math.min(255, Math.round(tb));
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Invert / Negative
 */
export function applyInvert(srcData: ImageData): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    dst[idx] = 255 - src[idx];
    dst[idx + 1] = 255 - src[idx + 1];
    dst[idx + 2] = 255 - src[idx + 2];
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Posterize (quantizes color space into discrete step levels)
 */
export function applyPosterize(srcData: ImageData, levels: number = 4): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  const step = 255 / (levels - 1);

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    dst[idx] = Math.round(Math.round(src[idx] / step) * step);
    dst[idx + 1] = Math.round(Math.round(src[idx + 1] / step) * step);
    dst[idx + 2] = Math.round(Math.round(src[idx + 2] / step) * step);
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Solarize filter
 */
export function applySolarize(srcData: ImageData, threshold: number = 128): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    dst[idx] = src[idx] > threshold ? 255 - src[idx] : src[idx];
    dst[idx + 1] = src[idx + 1] > threshold ? 255 - src[idx + 1] : src[idx + 1];
    dst[idx + 2] = src[idx + 2] > threshold ? 255 - src[idx + 2] : src[idx + 2];
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

/**
 * Vignette effect
 */
export function applyVignette(srcData: ImageData, radius: number = 0.8): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY) * radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const factor = Math.cos(Math.min(Math.PI / 2, (dist / maxDist) * (Math.PI / 2)));

      dst[idx] = Math.round(src[idx] * factor);
      dst[idx + 1] = Math.round(src[idx + 1] * factor);
      dst[idx + 2] = Math.round(src[idx + 2] * factor);
      dst[idx + 3] = src[idx + 3];
    }
  }

  return output;
}

/**
 * Comprehensive color adjustments:
 * Brightness, Contrast, Saturation, Exposure, Temperature, Highlights, Shadows
 */
export function applyAdjustments(
  srcData: ImageData,
  adj: ImageAdjustments
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  // Precompute constants
  const brightnessOffset = adj.brightness * 2.55; // -255 to 255
  const contrastFactor = (259 * (adj.contrast + 100)) / (100 * (259 - adj.contrast));
  const exposureMult = Math.pow(2, adj.exposure / 50); // -2 to +2 stops
  const saturationMult = (adj.saturation + 100) / 100;

  // Temperature / Tint
  const tempOffset = adj.temperature; // > 0 warm (more red, less blue), < 0 cool
  const rTemp = tempOffset > 0 ? tempOffset * 0.8 : tempOffset * 0.4;
  const bTemp = tempOffset > 0 ? -tempOffset * 0.8 : -tempOffset * 0.4;

  const highlightsFactor = adj.highlights / 100;
  const shadowsFactor = adj.shadows / 100;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    let r = src[idx];
    let g = src[idx + 1];
    let b = src[idx + 2];

    // Exposure
    r *= exposureMult;
    g *= exposureMult;
    b *= exposureMult;

    // Brightness
    r += brightnessOffset;
    g += brightnessOffset;
    b += brightnessOffset;

    // Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Temperature
    r += rTemp;
    b += bTemp;

    // Highlights & Shadows
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 128) {
      const hWeight = (lum - 128) / 128;
      const boost = 50 * highlightsFactor * hWeight;
      r += boost;
      g += boost;
      b += boost;
    } else {
      const sWeight = (128 - lum) / 128;
      const boost = 50 * shadowsFactor * sWeight;
      r += boost;
      g += boost;
      b += boost;
    }

    // Saturation
    if (saturationMult !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + saturationMult * (r - gray);
      g = gray + saturationMult * (g - gray);
      b = gray + saturationMult * (b - gray);
    }

    dst[idx] = Math.min(255, Math.max(0, Math.round(r)));
    dst[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
    dst[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

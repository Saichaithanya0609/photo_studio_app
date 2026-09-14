/**
 * Digital Image Processing - Super Resolution / Image Upscaler
 * Uses 2D Bicubic / Lanczos-style interpolation kernel with unsharp detail restoration.
 */

import { applySharpenKernel } from './convolution';

/**
 * Bicubic weight function: Catmull-Rom spline (a = -0.5)
 */
function bicubicWeight(x: number): number {
  x = Math.abs(x);
  const a = -0.5;
  if (x <= 1) {
    return (a + 2) * x * x * x - (a + 3) * x * x + 1;
  } else if (x < 2) {
    return a * x * x * x - 5 * a * x * x + 8 * a * x - 4 * a;
  }
  return 0;
}

/**
 * Upscales ImageData by a given scale factor (e.g. 2x, 4x) using bicubic interpolation.
 */
export function upscaleImageData(srcData: ImageData, scale: 2 | 4 = 2): ImageData {
  const srcWidth = srcData.width;
  const srcHeight = srcData.height;
  const dstWidth = Math.round(srcWidth * scale);
  const dstHeight = Math.round(srcHeight * scale);

  const src = srcData.data;
  const output = new ImageData(dstWidth, dstHeight);
  const dst = output.data;

  for (let dy = 0; dy < dstHeight; dy++) {
    const sy = dy / scale;
    const yInt = Math.floor(sy);
    const yFrac = sy - yInt;

    for (let dx = 0; dx < dstWidth; dx++) {
      const sx = dx / scale;
      const xInt = Math.floor(sx);
      const xFrac = sx - xInt;

      let r = 0, g = 0, b = 0, a = 0;
      let weightSum = 0;

      for (let m = -1; m <= 2; m++) {
        const py = Math.min(Math.max(yInt + m, 0), srcHeight - 1);
        const wy = bicubicWeight(m - yFrac);

        for (let n = -1; n <= 2; n++) {
          const px = Math.min(Math.max(xInt + n, 0), srcWidth - 1);
          const wx = bicubicWeight(n - xFrac);
          const weight = wx * wy;

          const idx = (py * srcWidth + px) * 4;
          r += src[idx] * weight;
          g += src[idx + 1] * weight;
          b += src[idx + 2] * weight;
          a += src[idx + 3] * weight;
          weightSum += weight;
        }
      }

      const dstIdx = (dy * dstWidth + dx) * 4;
      dst[dstIdx] = Math.min(255, Math.max(0, Math.round(r / weightSum)));
      dst[dstIdx + 1] = Math.min(255, Math.max(0, Math.round(g / weightSum)));
      dst[dstIdx + 2] = Math.min(255, Math.max(0, Math.round(b / weightSum)));
      dst[dstIdx + 3] = Math.min(255, Math.max(0, Math.round(a / weightSum)));
    }
  }

  // Apply subtle edge sharpening pass to eliminate interpolation softness
  return applySharpenKernel(output, 0.4);
}

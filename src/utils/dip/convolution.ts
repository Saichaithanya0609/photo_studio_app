/**
 * Digital Image Processing - Spatial 2D Convolution & Edge Detection Kernels
 * Includes Sobel, Roberts Cross, Prewitt, Laplacian, Sharpen, and Emboss operators.
 */

export type Kernel = number[][];

/**
 * Applies a general 2D convolution kernel to an ImageData buffer with edge clamping.
 */
export function applyConvolution(
  srcData: ImageData,
  kernel: Kernel,
  divisor: number = 1,
  offset: number = 0,
  grayscaleOutput: boolean = false
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  const kRows = kernel.length;
  const kCols = kernel[0].length;
  const kHalfY = Math.floor(kRows / 2);
  const kHalfX = Math.floor(kCols / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = 0; ky < kRows; ky++) {
        const py = Math.min(Math.max(y + ky - kHalfY, 0), height - 1);
        for (let kx = 0; kx < kCols; kx++) {
          const px = Math.min(Math.max(x + kx - kHalfX, 0), width - 1);
          const weight = kernel[ky][kx];
          const srcIdx = (py * width + px) * 4;

          r += src[srcIdx] * weight;
          g += src[srcIdx + 1] * weight;
          b += src[srcIdx + 2] * weight;
        }
      }

      const dstIdx = (y * width + x) * 4;
      const finalR = Math.min(255, Math.max(0, Math.round(r / divisor + offset)));
      const finalG = Math.min(255, Math.max(0, Math.round(g / divisor + offset)));
      const finalB = Math.min(255, Math.max(0, Math.round(b / divisor + offset)));

      if (grayscaleOutput) {
        const lum = Math.round(0.299 * finalR + 0.587 * finalG + 0.114 * finalB);
        dst[dstIdx] = lum;
        dst[dstIdx + 1] = lum;
        dst[dstIdx + 2] = lum;
      } else {
        dst[dstIdx] = finalR;
        dst[dstIdx + 1] = finalG;
        dst[dstIdx + 2] = finalB;
      }
      dst[dstIdx + 3] = src[dstIdx + 3]; // Preserve alpha
    }
  }

  return output;
}

/**
 * Sobel Edge Detection
 * Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
 * Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
 * G = sqrt(Gx^2 + Gy^2)
 */
export function applySobel(
  srcData: ImageData,
  mode: 'all' | 'horizontal' | 'vertical' = 'all',
  threshold: number = 0
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  // Convert to grayscale luminance cache for speed
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p00 = gray[(y - 1) * width + (x - 1)];
      const p01 = gray[(y - 1) * width + x];
      const p02 = gray[(y - 1) * width + (x + 1)];

      const p10 = gray[y * width + (x - 1)];
      const p12 = gray[y * width + (x + 1)];

      const p20 = gray[(y + 1) * width + (x - 1)];
      const p21 = gray[(y + 1) * width + x];
      const p22 = gray[(y + 1) * width + (x + 1)];

      // Gx (Vertical edges)
      const gx = (-1 * p00 + 1 * p02) + (-2 * p10 + 2 * p12) + (-1 * p20 + 1 * p22);
      // Gy (Horizontal edges)
      const gy = (-1 * p00 - 2 * p01 - 1 * p02) + (1 * p20 + 2 * p21 + 1 * p22);

      let mag = 0;
      if (mode === 'all') {
        mag = Math.sqrt(gx * gx + gy * gy);
      } else if (mode === 'horizontal') {
        mag = Math.abs(gy);
      } else {
        mag = Math.abs(gx);
      }

      // Thresholding
      let val = Math.min(255, Math.max(0, Math.round(mag)));
      if (threshold > 0) {
        val = val >= threshold ? 255 : 0;
      }

      const idx = (y * width + x) * 4;
      dst[idx] = val;
      dst[idx + 1] = val;
      dst[idx + 2] = val;
      dst[idx + 3] = 255;
    }
  }

  return output;
}

/**
 * Roberts Cross Edge Detection
 * 2x2 neighborhood gradient:
 * Gx = [[ 1,  0], [ 0, -1]] -> I(x,y) - I(x+1, y+1)
 * Gy = [[ 0,  1], [-1,  0]] -> I(x+1, y) - I(x, y+1)
 * G = sqrt(Gx^2 + Gy^2)
 */
export function applyRoberts(
  srcData: ImageData,
  threshold: number = 0
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  // Grayscale buffer
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
  }

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const p00 = gray[y * width + x];
      const p01 = gray[y * width + (x + 1)];
      const p10 = gray[(y + 1) * width + x];
      const p11 = gray[(y + 1) * width + (x + 1)];

      const gx = p00 - p11;
      const gy = p01 - p10;

      let mag = Math.sqrt(gx * gx + gy * gy);
      let val = Math.min(255, Math.max(0, Math.round(mag)));

      if (threshold > 0) {
        val = val >= threshold ? 255 : 0;
      }

      const idx = (y * width + x) * 4;
      dst[idx] = val;
      dst[idx + 1] = val;
      dst[idx + 2] = val;
      dst[idx + 3] = 255;
    }
  }

  return output;
}

/**
 * Prewitt Edge Detection
 * Gx = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]
 * Gy = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]
 * G = sqrt(Gx^2 + Gy^2)
 */
export function applyPrewitt(
  srcData: ImageData,
  threshold: number = 0
): ImageData {
  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p00 = gray[(y - 1) * width + (x - 1)];
      const p01 = gray[(y - 1) * width + x];
      const p02 = gray[(y - 1) * width + (x + 1)];

      const p10 = gray[y * width + (x - 1)];
      const p12 = gray[y * width + (x + 1)];

      const p20 = gray[(y + 1) * width + (x - 1)];
      const p21 = gray[(y + 1) * width + x];
      const p22 = gray[(y + 1) * width + (x + 1)];

      const gx = (-p00 + p02) + (-p10 + p12) + (-p20 + p22);
      const gy = (-p00 - p01 - p02) + (p20 + p21 + p22);

      let mag = Math.sqrt(gx * gx + gy * gy);
      let val = Math.min(255, Math.max(0, Math.round(mag)));

      if (threshold > 0) {
        val = val >= threshold ? 255 : 0;
      }

      const idx = (y * width + x) * 4;
      dst[idx] = val;
      dst[idx + 1] = val;
      dst[idx + 2] = val;
      dst[idx + 3] = 255;
    }
  }

  return output;
}

/**
 * Laplacian Operator (2nd Order Derivative / Zero-crossing detection)
 * 4-connectivity: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]
 * 8-connectivity: [[1, 1, 1], [1, -8, 1], [1, 1, 1]]
 */
export function applyLaplacian(
  srcData: ImageData,
  connectivity: 4 | 8 = 8,
  intensity: number = 1
): ImageData {
  const kernel = connectivity === 4
    ? [
        [0, 1 * intensity, 0],
        [1 * intensity, -4 * intensity, 1 * intensity],
        [0, 1 * intensity, 0],
      ]
    : [
        [1 * intensity, 1 * intensity, 1 * intensity],
        [1 * intensity, -8 * intensity, 1 * intensity],
        [1 * intensity, 1 * intensity, 1 * intensity],
      ];

  return applyConvolution(srcData, kernel, 1, 128, true);
}

/**
 * Spatial Sharpening Kernel
 * High-boost sharpening matrix:
 * [[ 0, -1,  0],
 *  [-1, 5+s, -1],
 *  [ 0, -1,  0]]
 */
export function applySharpenKernel(
  srcData: ImageData,
  strength: number = 1
): ImageData {
  const center = 1 + 4 * strength;
  const edge = -strength;
  const kernel = [
    [0, edge, 0],
    [edge, center, edge],
    [0, edge, 0]
  ];
  return applyConvolution(srcData, kernel, 1, 0, false);
}

/**
 * Emboss filter (creates 3D relief illusion)
 */
export function applyEmboss(srcData: ImageData): ImageData {
  const kernel = [
    [-2, -1, 0],
    [-1,  1, 1],
    [ 0,  1, 2]
  ];
  return applyConvolution(srcData, kernel, 1, 128, true);
}

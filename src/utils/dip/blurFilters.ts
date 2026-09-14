/**
 * Digital Image Processing - Gaussian Blur, Box Blur & Unblur (Deblurring via High-boost Unsharp Masking)
 */

/**
 * Generates a 1D Gaussian kernel for given radius and sigma.
 */
function createGaussian1DKernel(radius: number): Float32Array {
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size);
  const sigma = Math.max(radius / 2, 0.5);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    const g = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel[i] = g;
    sum += g;
  }

  // Normalize
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

/**
 * Fast Separable Gaussian Blur (O(K * N) horizontal + vertical 1D passes)
 */
export function applyGaussianBlur(srcData: ImageData, radius: number): ImageData {
  if (radius <= 0) return srcData;

  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;

  const r = Math.min(Math.round(radius), 30);
  const kernel = createGaussian1DKernel(r);
  const kSize = kernel.length;

  // Intermediate buffer for horizontal pass
  const temp = new Float32Array(width * height * 4);

  // Horizontal Pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0, green = 0, blue = 0, alpha = 0;

      for (let k = 0; k < kSize; k++) {
        const px = Math.min(Math.max(x + k - r, 0), width - 1);
        const idx = (y * width + px) * 4;
        const weight = kernel[k];

        red += src[idx] * weight;
        green += src[idx + 1] * weight;
        blue += src[idx + 2] * weight;
        alpha += src[idx + 3] * weight;
      }

      const outIdx = (y * width + x) * 4;
      temp[outIdx] = red;
      temp[outIdx + 1] = green;
      temp[outIdx + 2] = blue;
      temp[outIdx + 3] = alpha;
    }
  }

  // Vertical Pass
  const output = new ImageData(width, height);
  const dst = output.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0, green = 0, blue = 0, alpha = 0;

      for (let k = 0; k < kSize; k++) {
        const py = Math.min(Math.max(y + k - r, 0), height - 1);
        const idx = (py * width + x) * 4;
        const weight = kernel[k];

        red += temp[idx] * weight;
        green += temp[idx + 1] * weight;
        blue += temp[idx + 2] * weight;
        alpha += temp[idx + 3] * weight;
      }

      const outIdx = (y * width + x) * 4;
      dst[outIdx] = Math.min(255, Math.max(0, Math.round(red)));
      dst[outIdx + 1] = Math.min(255, Math.max(0, Math.round(green)));
      dst[outIdx + 2] = Math.min(255, Math.max(0, Math.round(blue)));
      dst[outIdx + 3] = Math.min(255, Math.max(0, Math.round(alpha)));
    }
  }

  return output;
}

/**
 * Fast Box Blur using moving window
 */
export function applyBoxBlur(srcData: ImageData, radius: number): ImageData {
  if (radius <= 0) return srcData;

  const width = srcData.width;
  const height = srcData.height;
  const src = srcData.data;
  const r = Math.min(Math.round(radius), 25);
  const boxSize = 2 * r + 1;

  const temp = new Float32Array(width * height * 4);

  // Horizontal box pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0, green = 0, blue = 0;
      for (let k = -r; k <= r; k++) {
        const px = Math.min(Math.max(x + k, 0), width - 1);
        const idx = (y * width + px) * 4;
        red += src[idx];
        green += src[idx + 1];
        blue += src[idx + 2];
      }
      const outIdx = (y * width + x) * 4;
      temp[outIdx] = red / boxSize;
      temp[outIdx + 1] = green / boxSize;
      temp[outIdx + 2] = blue / boxSize;
      temp[outIdx + 3] = src[outIdx + 3];
    }
  }

  const output = new ImageData(width, height);
  const dst = output.data;

  // Vertical box pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let red = 0, green = 0, blue = 0;
      for (let k = -r; k <= r; k++) {
        const py = Math.min(Math.max(y + k, 0), height - 1);
        const idx = (py * width + x) * 4;
        red += temp[idx];
        green += temp[idx + 1];
        blue += temp[idx + 2];
      }
      const outIdx = (y * width + x) * 4;
      dst[outIdx] = Math.min(255, Math.max(0, Math.round(red / boxSize)));
      dst[outIdx + 1] = Math.min(255, Math.max(0, Math.round(green / boxSize)));
      dst[outIdx + 2] = Math.min(255, Math.max(0, Math.round(blue / boxSize)));
      dst[outIdx + 3] = Math.round(temp[outIdx + 3]);
    }
  }

  return output;
}

/**
 * Digital Image Processing - Unblur / Deblur via High-Boost Filtering & Unsharp Masking
 * Formula: I_restored = I + lambda * (I - GaussianBlur(I, sigma))
 * Extracts high-frequency edge gradients lost due to optical blur or motion blur,
 * then amplifies them back into the image while suppressing thresholded noise.
 */
export function applyUnblur(
  srcData: ImageData,
  strength: number = 50, // 0 to 100
  radius: number = 2
): ImageData {
  if (strength <= 0) return srcData;

  const width = srcData.width;
  const height = srcData.height;
  const total = width * height;
  const src = srcData.data;

  // Step 1: Compute low-frequency blurred base using small Gaussian radius
  const blurred = applyGaussianBlur(srcData, radius);
  const blurData = blurred.data;

  // Step 2: High-boost subtraction and detail amplification
  const output = new ImageData(width, height);
  const dst = output.data;

  const lambda = (strength / 100) * 2.5; // Gain factor (up to 2.5x high frequency boost)
  const threshold = 3; // Coring threshold to prevent noise speckle amplification

  for (let i = 0; i < total; i++) {
    const idx = i * 4;

    for (let c = 0; c < 3; c++) {
      const orig = src[idx + c];
      const blurVal = blurData[idx + c];
      const highFreq = orig - blurVal;

      let boost = 0;
      if (Math.abs(highFreq) > threshold) {
        boost = highFreq * lambda;
      }

      dst[idx + c] = Math.min(255, Math.max(0, Math.round(orig + boost)));
    }

    dst[idx + 3] = src[idx + 3];
  }

  return output;
}

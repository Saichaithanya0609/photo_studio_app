export type FilterType = 
  | 'none'
  | 'grayscale_bt601'
  | 'grayscale_bt709'
  | 'grayscale_avg'
  | 'histogram_equalization'
  | 'sobel'
  | 'roberts'
  | 'prewitt'
  | 'laplacian'
  | 'sharpen'
  | 'unblur'
  | 'gaussian_blur'
  | 'box_blur'
  | 'sepia'
  | 'invert'
  | 'threshold'
  | 'emboss'
  | 'solarize'
  | 'posterize'
  | 'vignette';

export interface ImageAdjustments {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  saturation: number; // -100 to 100
  exposure: number;   // -100 to 100
  temperature: number;// -100 to 100 (warm / cool)
  highlights: number; // -100 to 100
  shadows: number;    // -100 to 100
  sharpness: number;  // 0 to 100
  blur: number;       // 0 to 50
  unblur: number;     // 0 to 100
}

export interface DIPSettings {
  filter: FilterType;
  sobelThreshold: number;       // 0 to 255
  sobelMode: 'all' | 'horizontal' | 'vertical';
  thresholdLevel: number;       // 0 to 255 (or Otsu)
  isOtsuThreshold: boolean;
  laplacianIntensity: number;   // 1 to 5
  equalizationChannel: 'luminance' | 'rgb';
  sharpenAmount: number;        // 0 to 5
  unblurStrength: number;       // 0 to 100
  posterizeLevels: number;      // 2 to 16
  vignetteRadius: number;       // 0.2 to 1.5
}

export interface TransformSettings {
  rotation: number; // in degrees
  flipH: boolean;
  flipV: boolean;
  cropRect: { x: number; y: number; width: number; height: number } | null;
  cropAspectRatio: number | null; // e.g. 1 (1:1), 16/9, 4/3, null for free
}

export interface BackgroundSettings {
  mode: 'original' | 'transparent' | 'solid' | 'gradient' | 'image' | 'blur';
  solidColor: string;
  gradient: {
    color1: string;
    color2: string;
    angle: number;
  };
  customBgUrl: string | null;
  blurAmount: number;
  tolerance: number; // 5 to 100
  feather: number;   // 0 to 20
  targetColor: { r: number; g: number; b: number } | null; // color clicked to remove
  autoDetect: boolean;
}

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  lum: number[];
}

export interface EphemeralPost {
  id: string;
  imageUrl: string;
  caption: string;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms (createdAt + 24 hours)
  likes: number;
  isLiked?: boolean;
  isPublic: boolean;
  comments: PostComment[];
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: number;
}

export type CollageTemplateId = 
  | 'grid-2-v'
  | 'grid-2-h'
  | 'grid-3-split'
  | 'grid-3-v'
  | 'grid-4-quad'
  | 'grid-4-uneven'
  | 'grid-5-focus'
  | 'grid-6-grid'
  | 'grid-9-grid'
  | 'polaroid';

export interface CollageSlot {
  id: string;
  imageUrl: string | null;
  zoom: number;
  panX: number;
  panY: number;
  rotation?: number;
}

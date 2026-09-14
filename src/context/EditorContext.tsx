import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type {
  ImageAdjustments,
  DIPSettings,
  TransformSettings,
  BackgroundSettings,
  HistogramData,
} from '../types/editor';
import { applySobel, applyRoberts, applyPrewitt, applyLaplacian, applySharpenKernel, applyEmboss } from '../utils/dip/convolution';
import { computeHistogram, applyHistogramEqualization } from '../utils/dip/histogram';
import {
  applyAdjustments,
  applyGrayscale,
  applyThreshold,
  calculateOtsuThreshold,
  applySepia,
  applyInvert,
  applyPosterize,
  applySolarize,
  applyVignette
} from '../utils/dip/colorAdjustments';
import { applyGaussianBlur, applyBoxBlur, applyUnblur } from '../utils/dip/blurFilters';
import { applyBackgroundProcessing } from '../utils/dip/backgroundRemover';
import { SAMPLE_IMAGES, generateFallbackImage } from '../data/sampleImages';

export type ToolTab = 'adjust' | 'dip' | 'sharpen_blur' | 'crop_rotate' | 'background' | 'upscale' | 'collage' | 'feed';

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0,
  unblur: 0,
};

export const DEFAULT_DIP_SETTINGS: DIPSettings = {
  filter: 'none',
  sobelThreshold: 0,
  sobelMode: 'all',
  thresholdLevel: 128,
  isOtsuThreshold: false,
  laplacianIntensity: 1,
  equalizationChannel: 'luminance',
  sharpenAmount: 1,
  unblurStrength: 50,
  posterizeLevels: 4,
  vignetteRadius: 0.8,
};

export const DEFAULT_TRANSFORM: TransformSettings = {
  rotation: 0,
  flipH: false,
  flipV: false,
  cropRect: null,
  cropAspectRatio: null,
};

export const DEFAULT_BACKGROUND: BackgroundSettings = {
  mode: 'original',
  solidColor: '#ffffff',
  gradient: {
    color1: '#6366f1',
    color2: '#ec4899',
    angle: 45,
  },
  customBgUrl: null,
  blurAmount: 16,
  tolerance: 25,
  feather: 4,
  targetColor: null,
  autoDetect: true,
};

interface HistorySnapshot {
  adjustments: ImageAdjustments;
  dipSettings: DIPSettings;
  transform: TransformSettings;
  background: BackgroundSettings;
}

interface EditorContextType {
  activeTab: ToolTab;
  setActiveTab: (tab: ToolTab) => void;
  originalImage: HTMLImageElement | null;
  originalImageUrl: string;
  loadImageFromUrl: (url: string) => void;
  loadImageFromFile: (file: File) => void;
  loadSampleImage: (id: string) => void;

  adjustments: ImageAdjustments;
  setAdjustments: React.Dispatch<React.SetStateAction<ImageAdjustments>>;
  updateAdjustment: (key: keyof ImageAdjustments, value: number) => void;
  resetAdjustments: () => void;

  dipSettings: DIPSettings;
  setDIPSettings: React.Dispatch<React.SetStateAction<DIPSettings>>;
  updateDIPSetting: <K extends keyof DIPSettings>(key: K, value: DIPSettings[K]) => void;
  resetDIPSettings: () => void;

  transform: TransformSettings;
  setTransform: React.Dispatch<React.SetStateAction<TransformSettings>>;
  updateTransform: <K extends keyof TransformSettings>(key: K, value: TransformSettings[K]) => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  toggleFlipH: () => void;
  toggleFlipV: () => void;
  resetTransform: () => void;

  background: BackgroundSettings;
  setBackground: React.Dispatch<React.SetStateAction<BackgroundSettings>>;
  updateBackground: <K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) => void;

  histogram: HistogramData | null;
  isProcessing: boolean;

  // Viewport Controls
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  resetZoom: () => void;
  compareSplit: number; // 0 to 100
  setCompareSplit: React.Dispatch<React.SetStateAction<number>>;
  showCompare: boolean;
  setShowCompare: React.Dispatch<React.SetStateAction<boolean>>;

  // Undo / Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveHistorySnapshot: () => void;

  // Canvas refs and processed image data for export
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  getProcessedCanvas: () => HTMLCanvasElement | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ToolTab>('adjust');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');

  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [dipSettings, setDIPSettings] = useState<DIPSettings>(DEFAULT_DIP_SETTINGS);
  const [transform, setTransform] = useState<TransformSettings>(DEFAULT_TRANSFORM);
  const [background, setBackground] = useState<BackgroundSettings>(DEFAULT_BACKGROUND);

  const [histogram, setHistogram] = useState<HistogramData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Viewport
  const [zoom, setZoom] = useState<number>(1);
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [showCompare, setShowCompare] = useState<boolean>(false);

  // History Stack
  const [history, setHistory] = useState<HistorySnapshot[]>([
    {
      adjustments: DEFAULT_ADJUSTMENTS,
      dipSettings: DEFAULT_DIP_SETTINGS,
      transform: DEFAULT_TRANSFORM,
      background: DEFAULT_BACKGROUND,
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const customBgImgRef = useRef<HTMLImageElement | null>(null);

  // Load custom bg image if specified
  useEffect(() => {
    if (background.customBgUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        customBgImgRef.current = img;
      };
      img.src = background.customBgUrl;
    } else {
      customBgImgRef.current = null;
    }
  }, [background.customBgUrl]);

  // Load initial image on startup
  useEffect(() => {
    loadImageFromUrl(SAMPLE_IMAGES[0].url);
  }, []);

  const loadImageFromUrl = (url: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOriginalImage(img);
      setOriginalImageUrl(url);
      resetAllEdits();
      setIsProcessing(false);
    };
    img.onerror = () => {
      // Offline fallback
      const fallbackUrl = generateFallbackImage();
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setOriginalImage(fallbackImg);
        setOriginalImageUrl(fallbackUrl);
        resetAllEdits();
        setIsProcessing(false);
      };
      fallbackImg.src = fallbackUrl;
    };
    img.src = url;
  };

  const loadImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        loadImageFromUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleImage = (id: string) => {
    const found = SAMPLE_IMAGES.find(s => s.id === id);
    if (found) {
      loadImageFromUrl(found.url);
    }
  };

  const resetAllEdits = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setDIPSettings(DEFAULT_DIP_SETTINGS);
    setTransform(DEFAULT_TRANSFORM);
    setBackground(DEFAULT_BACKGROUND);
    setZoom(1);
    setShowCompare(false);
    setHistory([
      {
        adjustments: DEFAULT_ADJUSTMENTS,
        dipSettings: DEFAULT_DIP_SETTINGS,
        transform: DEFAULT_TRANSFORM,
        background: DEFAULT_BACKGROUND,
      }
    ]);
    setHistoryIndex(0);
  };

  const saveHistorySnapshot = useCallback(() => {
    const snapshot: HistorySnapshot = {
      adjustments: { ...adjustments },
      dipSettings: { ...dipSettings },
      transform: { ...transform },
      background: { ...background },
    };

    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(snapshot);
      if (next.length > 25) next.shift(); // Limit to 25 undo steps
      return next;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 24));
  }, [adjustments, dipSettings, transform, background, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (!canUndo) return;
    const newIdx = historyIndex - 1;
    const snapshot = history[newIdx];
    setAdjustments(snapshot.adjustments);
    setDIPSettings(snapshot.dipSettings);
    setTransform(snapshot.transform);
    setBackground(snapshot.background);
    setHistoryIndex(newIdx);
  };

  const redo = () => {
    if (!canRedo) return;
    const newIdx = historyIndex + 1;
    const snapshot = history[newIdx];
    setAdjustments(snapshot.adjustments);
    setDIPSettings(snapshot.dipSettings);
    setTransform(snapshot.transform);
    setBackground(snapshot.background);
    setHistoryIndex(newIdx);
  };

  const updateAdjustment = (key: keyof ImageAdjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const resetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    saveHistorySnapshot();
  };

  const updateDIPSetting = <K extends keyof DIPSettings>(key: K, value: DIPSettings[K]) => {
    setDIPSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetDIPSettings = () => {
    setDIPSettings(DEFAULT_DIP_SETTINGS);
    saveHistorySnapshot();
  };

  const updateTransform = <K extends keyof TransformSettings>(key: K, value: TransformSettings[K]) => {
    setTransform(prev => ({ ...prev, [key]: value }));
  };

  const rotateClockwise = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
    saveHistorySnapshot();
  };

  const rotateCounterClockwise = () => {
    setTransform(prev => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }));
    saveHistorySnapshot();
  };

  const toggleFlipH = () => {
    setTransform(prev => ({ ...prev, flipH: !prev.flipH }));
    saveHistorySnapshot();
  };

  const toggleFlipV = () => {
    setTransform(prev => ({ ...prev, flipV: !prev.flipV }));
    saveHistorySnapshot();
  };

  const resetTransform = () => {
    setTransform(DEFAULT_TRANSFORM);
    saveHistorySnapshot();
  };

  const updateBackground = <K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) => {
    setBackground(prev => ({ ...prev, [key]: value }));
  };

  const resetZoom = () => setZoom(1);

  // Executes the complete DIP and adjustment pipeline on canvas
  const processImagePipeline = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const origW = originalImage.naturalWidth || originalImage.width;
    const origH = originalImage.naturalHeight || originalImage.height;

    // Handle Crop or Full Image
    const crop = transform.cropRect;
    const srcX = crop ? crop.x : 0;
    const srcY = crop ? crop.y : 0;
    const srcW = crop ? crop.width : origW;
    const srcH = crop ? crop.height : origH;

    // Handle Rotation bounds
    const isSideways = Math.abs(transform.rotation) === 90 || Math.abs(transform.rotation) === 270;
    const canvasW = isSideways ? srcH : srcW;
    const canvasH = isSideways ? srcW : srcH;

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.save();
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);

    ctx.drawImage(
      originalImage,
      srcX, srcY, srcW, srcH,
      -srcW / 2, -srcH / 2, srcW, srcH
    );
    ctx.restore();

    // Extract raw ImageData for DIP processing
    let currentData = ctx.getImageData(0, 0, canvasW, canvasH);

    // 1. Color and Tone Adjustments
    currentData = applyAdjustments(currentData, adjustments);

    // 2. Sharpen / Blur sliders
    if (adjustments.sharpness > 0) {
      currentData = applySharpenKernel(currentData, adjustments.sharpness / 50);
    }
    if (adjustments.blur > 0) {
      currentData = applyGaussianBlur(currentData, adjustments.blur / 3);
    }
    if (adjustments.unblur > 0) {
      currentData = applyUnblur(currentData, adjustments.unblur, 2);
    }

    // 3. Digital Image Processing (DIP) Filter selection
    switch (dipSettings.filter) {
      case 'grayscale_bt601':
        currentData = applyGrayscale(currentData, 'bt601');
        break;
      case 'grayscale_bt709':
        currentData = applyGrayscale(currentData, 'bt709');
        break;
      case 'grayscale_avg':
        currentData = applyGrayscale(currentData, 'avg');
        break;
      case 'histogram_equalization':
        currentData = applyHistogramEqualization(currentData, dipSettings.equalizationChannel);
        break;
      case 'sobel':
        currentData = applySobel(currentData, dipSettings.sobelMode, dipSettings.sobelThreshold);
        break;
      case 'roberts':
        currentData = applyRoberts(currentData, dipSettings.sobelThreshold);
        break;
      case 'prewitt':
        currentData = applyPrewitt(currentData, dipSettings.sobelThreshold);
        break;
      case 'laplacian':
        currentData = applyLaplacian(currentData, 8, dipSettings.laplacianIntensity);
        break;
      case 'sharpen':
        currentData = applySharpenKernel(currentData, dipSettings.sharpenAmount);
        break;
      case 'unblur':
        currentData = applyUnblur(currentData, dipSettings.unblurStrength, 2);
        break;
      case 'gaussian_blur':
        currentData = applyGaussianBlur(currentData, 6);
        break;
      case 'box_blur':
        currentData = applyBoxBlur(currentData, 6);
        break;
      case 'threshold': {
        const thresh = dipSettings.isOtsuThreshold 
          ? calculateOtsuThreshold(currentData) 
          : dipSettings.thresholdLevel;
        currentData = applyThreshold(currentData, thresh);
        break;
      }
      case 'sepia':
        currentData = applySepia(currentData);
        break;
      case 'invert':
        currentData = applyInvert(currentData);
        break;
      case 'emboss':
        currentData = applyEmboss(currentData);
        break;
      case 'posterize':
        currentData = applyPosterize(currentData, dipSettings.posterizeLevels);
        break;
      case 'solarize':
        currentData = applySolarize(currentData, 128);
        break;
      case 'vignette':
        currentData = applyVignette(currentData, dipSettings.vignetteRadius);
        break;
      default:
        break;
    }

    // 4. Background Processing (if active)
    if (background.mode !== 'original') {
      currentData = await applyBackgroundProcessing(currentData, background, customBgImgRef.current);
    }

    // Put final processed pixels back to canvas
    ctx.putImageData(currentData, 0, 0);

    // Compute live histogram
    const hist = computeHistogram(currentData);
    setHistogram(hist);
  }, [originalImage, adjustments, dipSettings, transform, background]);

  // Debounced pipeline execution to keep UI at 60 FPS
  useEffect(() => {
    const timer = setTimeout(() => {
      processImagePipeline();
    }, 40);

    return () => clearTimeout(timer);
  }, [processImagePipeline]);

  const getProcessedCanvas = () => canvasRef.current;

  return (
    <EditorContext.Provider
      value={{
        activeTab,
        setActiveTab,
        originalImage,
        originalImageUrl,
        loadImageFromUrl,
        loadImageFromFile,
        loadSampleImage,

        adjustments,
        setAdjustments,
        updateAdjustment,
        resetAdjustments,

        dipSettings,
        setDIPSettings,
        updateDIPSetting,
        resetDIPSettings,

        transform,
        setTransform,
        updateTransform,
        rotateClockwise,
        rotateCounterClockwise,
        toggleFlipH,
        toggleFlipV,
        resetTransform,

        background,
        setBackground,
        updateBackground,

        histogram,
        isProcessing,

        zoom,
        setZoom,
        resetZoom,
        compareSplit,
        setCompareSplit,
        showCompare,
        setShowCompare,

        canUndo,
        canRedo,
        undo,
        redo,
        saveHistorySnapshot,

        canvasRef,
        getProcessedCanvas,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

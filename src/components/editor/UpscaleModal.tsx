import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { upscaleImageData } from '../../utils/dip/upscaler';
import { X, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface UpscaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpscaleModal: React.FC<UpscaleModalProps> = ({ isOpen, onClose }) => {
  const { canvasRef, loadImageFromUrl } = useEditor();
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [isUpscaling, setIsUpscaling] = useState(false);

  if (!isOpen) return null;

  const currentW = canvasRef.current?.width || 0;
  const currentH = canvasRef.current?.height || 0;
  const targetW = currentW * scaleFactor;
  const targetH = currentH * scaleFactor;

  const handleApplyUpscale = () => {
    if (!canvasRef.current) return;
    setIsUpscaling(true);

    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const upscaledData = upscaleImageData(srcData, scaleFactor);

        // Render to offscreen canvas to get data URL
        const offCanvas = document.createElement('canvas');
        offCanvas.width = upscaledData.width;
        offCanvas.height = upscaledData.height;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.putImageData(upscaledData, 0, 0);
          const dataUrl = offCanvas.toDataURL('image/png');
          loadImageFromUrl(dataUrl);
        }
        setIsUpscaling(false);
        onClose();
      } catch (err) {
        console.error('Upscaling failed:', err);
        setIsUpscaling(false);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Bicubic Image Upscaler
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI & mathematical subpixel interpolation with edge restoration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Resolution comparison box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-center">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Current</span>
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                {currentW} × {currentH}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-500 animate-pulse" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold block mb-0.5">Upscaled ({scaleFactor}x)</span>
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {targetW} × {targetH}
              </span>
            </div>
          </div>

          {/* Scale factor selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Upscale Factor</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScaleFactor(2)}
                className={`p-3 rounded-xl border text-center transition ${
                  scaleFactor === 2
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-extrabold text-lg">2x Scale</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">4x total pixel count</div>
              </button>

              <button
                onClick={() => setScaleFactor(4)}
                className={`p-3 rounded-xl border text-center transition ${
                  scaleFactor === 4
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-extrabold text-lg">4x Scale</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">16x total pixel count</div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            ⚡ Uses Catmull-Rom bicubic spline convolution to compute continuous subpixel luminance and sharpens fine details.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyUpscale}
            disabled={isUpscaling}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            {isUpscaling ? (
              <span>Upscaling pixels...</span>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Apply {scaleFactor}x Upscale</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

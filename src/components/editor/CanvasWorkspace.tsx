import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Columns, Scissors, Check, X } from 'lucide-react';

export const CanvasWorkspace: React.FC = () => {
  const {
    originalImage,
    canvasRef,
    zoom,
    showCompare,
    compareSplit,
    setCompareSplit,
    activeTab,
    updateTransform,
    saveHistorySnapshot,
    updateBackground,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Interactive Crop state
  const isCropping = activeTab === 'crop_rotate';
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const cropStartRef = useRef({ x: 0, y: 0, startBox: { x: 0, y: 0, w: 0, h: 0 } });

  // Initialize crop box to current canvas size when entering crop mode
  useEffect(() => {
    if (isCropping && canvasRef.current && !cropBox) {
      const cw = canvasRef.current.width;
      const ch = canvasRef.current.height;
      setCropBox({
        x: Math.round(cw * 0.1),
        y: Math.round(ch * 0.1),
        w: Math.round(cw * 0.8),
        h: Math.round(ch * 0.8),
      });
    }
  }, [isCropping, canvasRef.current]);

  // Handle Crop Dragging
  const handleCropMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingCrop || !canvasRef.current) return;
    const dx = (e.clientX - cropStartRef.current.x) / zoom;
    const dy = (e.clientY - cropStartRef.current.y) / zoom;
    const { startBox } = cropStartRef.current;
    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;

    const newX = Math.min(Math.max(0, Math.round(startBox.x + dx)), cw - startBox.w);
    const newY = Math.min(Math.max(0, Math.round(startBox.y + dy)), ch - startBox.h);

    setCropBox(prev => prev ? { ...prev, x: newX, y: newY } : null);
  }, [isDraggingCrop, zoom]);

  const handleCropMouseUp = useCallback(() => {
    setIsDraggingCrop(false);
  }, []);

  useEffect(() => {
    if (isDraggingCrop) {
      window.addEventListener('mousemove', handleCropMouseMove);
      window.addEventListener('mouseup', handleCropMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleCropMouseMove);
        window.removeEventListener('mouseup', handleCropMouseUp);
      };
    }
  }, [isDraggingCrop, handleCropMouseMove, handleCropMouseUp]);

  // Handle Split Dragging
  const handleSplitMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingSplit || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setCompareSplit(pct);
  }, [isDraggingSplit, setCompareSplit]);

  const handleSplitMouseUp = useCallback(() => {
    setIsDraggingSplit(false);
  }, []);

  useEffect(() => {
    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleSplitMouseMove);
      window.addEventListener('mouseup', handleSplitMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleSplitMouseMove);
        window.removeEventListener('mouseup', handleSplitMouseUp);
      };
    }
  }, [isDraggingSplit, handleSplitMouseMove, handleSplitMouseUp]);

  // Handle Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if spacebar is held or middle click or background click
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    // If Background tool is active and clicked canvas, pick target color for magic wand!
    if (activeTab === 'background' && canvasRef.current && e.button === 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) * (canvasRef.current.width / rect.width));
      const y = Math.floor((e.clientY - rect.top) * (canvasRef.current.height / rect.height));
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && x >= 0 && x < canvasRef.current.width && y >= 0 && y < canvasRef.current.height) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        updateBackground('targetColor', { r: pixel[0], g: pixel[1], b: pixel[2] });
        updateBackground('autoDetect', false);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Apply Crop
  const applyCrop = () => {
    if (!cropBox || !canvasRef.current) return;
    updateTransform('cropRect', {
      x: cropBox.x,
      y: cropBox.y,
      width: cropBox.w,
      height: cropBox.h,
    });
    setCropBox(null);
    saveHistorySnapshot();
  };

  const cancelCrop = () => {
    setCropBox(null);
    updateTransform('cropRect', null);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative flex-1 min-h-[36vh] md:min-h-0 h-full overflow-hidden flex items-center justify-center select-none bg-slate-200/50 dark:bg-slate-950/80 checkerboard-pattern ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Zoom / Pan Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.08s ease-out',
        }}
        className="relative inline-block shadow-2xl rounded-sm overflow-hidden"
      >
        {/* Main Canvas (Rendered with active DIP/Adjustments pipeline) */}
        <canvas
          ref={canvasRef}
          className="max-h-[40vh] md:max-h-[75vh] max-w-[94vw] md:max-w-[70vw] block mx-auto object-contain pointer-events-auto"
        />

        {/* Before / After Split Comparison Overlay */}
        {showCompare && originalImage && canvasRef.current && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Left side: Original Image */}
            <div
              style={{ width: `${compareSplit}%` }}
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-xl"
            >
              <img
                src={originalImage.src}
                alt="Original"
                className="max-h-[40vh] md:max-h-[75vh] max-w-[94vw] md:max-w-[70vw] object-contain block"
                style={{
                  width: canvasRef.current.offsetWidth || 'auto',
                  height: canvasRef.current.offsetHeight || 'auto',
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-bold text-[10px] tracking-wider uppercase">
                Original
              </span>
            </div>

            {/* Split Handle */}
            <div
              style={{ left: `${compareSplit}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSplit(true);
              }}
              className="absolute inset-y-0 -ml-3 w-6 flex items-center justify-center pointer-events-auto cursor-ew-resize group"
            >
              <div className="w-6 h-6 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Columns className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Right side label */}
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-purple-600/90 text-white font-bold text-[10px] tracking-wider uppercase pointer-events-none">
              Edited
            </span>
          </div>
        )}

        {/* Crop Bounding Box Overlay */}
        {isCropping && cropBox && canvasRef.current && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Dimmed outer region */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="crop-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={cropBox.x}
                    y={cropBox.y}
                    width={cropBox.w}
                    height={cropBox.h}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#crop-mask)" />
            </svg>

            {/* Crop Boundary rectangle with grid lines */}
            <div
              style={{
                left: `${cropBox.x}px`,
                top: `${cropBox.y}px`,
                width: `${cropBox.w}px`,
                height: `${cropBox.h}px`,
              }}
              className="absolute border-2 border-white shadow-2xl pointer-events-auto cursor-move"
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingCrop(true);
                cropStartRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  startBox: { ...cropBox },
                };
              }}
            >
              {/* Rule of Thirds grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-white/40" />
                <div className="border-r border-white/40" />
                <div />
              </div>

              {/* Dimensions badge */}
              <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono select-none">
                {cropBox.w} × {cropBox.h} px
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Crop Confirmation Action Bar */}
      {isCropping && cropBox && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-2xl text-white">
          <Scissors className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold mr-2">Confirm Crop?</span>
          <button
            onClick={applyCrop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Apply
          </button>
          <button
            onClick={cancelCrop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      )}

      {/* Bottom Hint for Pan and Magic Wand */}
      <div className="absolute bottom-3 right-4 hidden md:flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 pointer-events-none">
        {activeTab === 'background' ? (
          <span>🎯 Click image to select background color to remove</span>
        ) : (
          <span>💡 Hold Alt + Drag to Pan | Scroll wheel to Zoom</span>
        )}
      </div>
    </div>
  );
};

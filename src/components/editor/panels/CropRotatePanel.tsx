import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Maximize,
  RotateCcw as ResetIcon,
  Smartphone,
  Tv,
  Square
} from 'lucide-react';

export const CropRotatePanel: React.FC = () => {
  const {
    transform,
    updateTransform,
    rotateClockwise,
    rotateCounterClockwise,
    toggleFlipH,
    toggleFlipV,
    resetTransform,
    saveHistorySnapshot,
    canvasRef,
  } = useEditor();

  const aspectPresets: { label: string; ratio: number | null; icon: React.ReactNode }[] = [
    { label: 'Free', ratio: null, icon: <Maximize className="w-3.5 h-3.5" /> },
    { label: '1:1 Square', ratio: 1, icon: <Square className="w-3.5 h-3.5" /> },
    { label: '4:3 Standard', ratio: 4 / 3, icon: <Tv className="w-3.5 h-3.5" /> },
    { label: '16:9 Landscape', ratio: 16 / 9, icon: <Tv className="w-3.5 h-3.5" /> },
    { label: '9:16 Story', ratio: 9 / 16, icon: <Smartphone className="w-3.5 h-3.5" /> },
    { label: '3:2 Classic', ratio: 3 / 2, icon: <Crop className="w-3.5 h-3.5" /> },
  ];

  const currentW = canvasRef.current?.width || 0;
  const currentH = canvasRef.current?.height || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Transform & Geometry
        </h3>
        <button
          onClick={resetTransform}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <ResetIcon className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Current Resolution badge */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Canvas Resolution:</span>
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {currentW} × {currentH} px
        </span>
      </div>

      {/* 1. Aspect Ratio Presets for Crop */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Crop className="w-3.5 h-3.5 text-purple-500" />
          Crop Aspect Presets
        </span>
        <div className="grid grid-cols-2 gap-2">
          {aspectPresets.map((p) => {
            const isSelected = transform.cropAspectRatio === p.ratio;
            return (
              <button
                key={p.label}
                onClick={() => {
                  updateTransform('cropAspectRatio', p.ratio);
                  // Adjust crop box to ratio if canvas exists
                  if (canvasRef.current) {
                    const cw = canvasRef.current.width;
                    const ch = canvasRef.current.height;
                    let targetW = Math.round(cw * 0.8);
                    let targetH = Math.round(ch * 0.8);

                    if (p.ratio) {
                      if (targetW / targetH > p.ratio) {
                        targetW = Math.round(targetH * p.ratio);
                      } else {
                        targetH = Math.round(targetW / p.ratio);
                      }
                    }

                    const targetX = Math.round((cw - targetW) / 2);
                    const targetY = Math.round((ch - targetH) / 2);

                    updateTransform('cropRect', {
                      x: targetX,
                      y: targetY,
                      width: targetW,
                      height: targetH,
                    });
                  }
                  saveHistorySnapshot();
                }}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
          * Drag on the canvas overlay to position the crop frame, then click Apply.
        </p>
      </div>

      {/* 2. Rotate & Flip Quick Actions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rotate & Flip</span>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={rotateCounterClockwise}
            title="Rotate Left 90°"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col items-center justify-center gap-1 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition"
          >
            <RotateCcw className="w-4 h-4 text-purple-500" />
            -90°
          </button>
          <button
            onClick={rotateClockwise}
            title="Rotate Right 90°"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col items-center justify-center gap-1 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition"
          >
            <RotateCw className="w-4 h-4 text-purple-500" />
            +90°
          </button>
          <button
            onClick={toggleFlipH}
            title="Flip Horizontal"
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
              transform.flipH
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
            Flip H
          </button>
          <button
            onClick={toggleFlipV}
            title="Flip Vertical"
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
              transform.flipV
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FlipVertical className="w-4 h-4" />
            Flip V
          </button>
        </div>
      </div>

      {/* 3. Free Angle Rotation Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Fine Angle:</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
            {transform.rotation}°
          </span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={transform.rotation}
          onChange={(e) => updateTransform('rotation', Number(e.target.value))}
          onMouseUp={saveHistorySnapshot}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>
    </div>
  );
};

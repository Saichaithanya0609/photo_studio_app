import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { Zap, Wind, Sparkles, RotateCcw } from 'lucide-react';

export const SharpenBlurPanel: React.FC = () => {
  const {
    adjustments,
    updateAdjustment,
    saveHistorySnapshot,
  } = useEditor();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Clarity & Blur Suite
        </h3>
        <button
          onClick={() => {
            updateAdjustment('sharpness', 0);
            updateAdjustment('unblur', 0);
            updateAdjustment('blur', 0);
            saveHistorySnapshot();
          }}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* 1. Sharpen Image */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Sharpen Image</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Laplacian high-boost convolution</p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-amber-500">{adjustments.sharpness}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={adjustments.sharpness}
          onChange={(e) => updateAdjustment('sharpness', Number(e.target.value))}
          onMouseUp={saveHistorySnapshot}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* 2. Unblur & Detail Restoration */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Unblur / Deblur</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Frequency high-pass deconvolution</p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-pink-500">{adjustments.unblur}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={adjustments.unblur}
          onChange={(e) => updateAdjustment('unblur', Number(e.target.value))}
          onMouseUp={saveHistorySnapshot}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
        />
        <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
          * Amplifies edge frequencies attenuated by out-of-focus optics or motion blur.
        </div>
      </div>

      {/* 3. Blur Effects */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Gaussian Blur</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Smooth 1D separable Gaussian kernel</p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-500">{adjustments.blur}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          value={adjustments.blur}
          onChange={(e) => updateAdjustment('blur', Number(e.target.value))}
          onMouseUp={saveHistorySnapshot}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Quick Presets:</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              updateAdjustment('sharpness', 60);
              updateAdjustment('unblur', 40);
              updateAdjustment('blur', 0);
              saveHistorySnapshot();
            }}
            className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition"
          >
            Crisp Detail
          </button>
          <button
            onClick={() => {
              updateAdjustment('unblur', 80);
              updateAdjustment('sharpness', 30);
              updateAdjustment('blur', 0);
              saveHistorySnapshot();
            }}
            className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition"
          >
            Fix Motion Blur
          </button>
          <button
            onClick={() => {
              updateAdjustment('blur', 6);
              updateAdjustment('sharpness', 0);
              updateAdjustment('unblur', 0);
              saveHistorySnapshot();
            }}
            className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition"
          >
            Soft Focus
          </button>
          <button
            onClick={() => {
              updateAdjustment('blur', 18);
              updateAdjustment('sharpness', 0);
              updateAdjustment('unblur', 0);
              saveHistorySnapshot();
            }}
            className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500 transition"
          >
            Dreamy Bokeh
          </button>
        </div>
      </div>
    </div>
  );
};

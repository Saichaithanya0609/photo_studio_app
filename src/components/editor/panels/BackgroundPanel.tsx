import React, { useRef } from 'react';
import { useEditor } from '../../../context/EditorContext';
import {
  Scissors,
  Palette,
  Image as ImageIcon,
  Wind,
  Pipette,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const BackgroundPanel: React.FC = () => {
  const {
    background,
    updateBackground,
    saveHistorySnapshot,
  } = useEditor();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const solidPalette = [
    '#ffffff', '#000000', '#f43f5e', '#8b5cf6',
    '#3b82f6', '#10b981', '#f59e0b', '#64748b'
  ];

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateBackground('customBgUrl', ev.target.result as string);
        updateBackground('mode', 'image');
        saveHistorySnapshot();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Background Engine
        </h3>
        <button
          onClick={() => {
            updateBackground('mode', 'original');
            updateBackground('targetColor', null);
            updateBackground('autoDetect', true);
            saveHistorySnapshot();
          }}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Original
        </button>
      </div>

      {/* Target Color & Magic Wand Info */}
      <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-200">
            <Pipette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Keying Color:</span>
          </div>
          {background.targetColor ? (
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                style={{
                  backgroundColor: `rgb(${background.targetColor.r}, ${background.targetColor.g}, ${background.targetColor.b})`,
                }}
              />
              <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300">
                RGB({background.targetColor.r},{background.targetColor.g},{background.targetColor.b})
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-200/60 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
              Auto-Corner Detection
            </span>
          )}
        </div>
        <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 leading-relaxed">
          💡 Click directly on any area of the photo in the canvas to sample the background you want to remove!
        </p>
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Replacement</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              updateBackground('mode', 'transparent');
              saveHistorySnapshot();
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
              background.mode === 'transparent'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 ring-2 ring-purple-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Scissors className="w-4 h-4 text-pink-500" />
            <span>Transparent PNG</span>
          </button>

          <button
            onClick={() => {
              updateBackground('mode', 'blur');
              saveHistorySnapshot();
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
              background.mode === 'blur'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 ring-2 ring-purple-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Wind className="w-4 h-4 text-indigo-500" />
            <span>Portrait Blur</span>
          </button>

          <button
            onClick={() => {
              updateBackground('mode', 'solid');
              saveHistorySnapshot();
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
              background.mode === 'solid'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 ring-2 ring-purple-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>Solid Color</span>
          </button>

          <button
            onClick={() => {
              updateBackground('mode', 'gradient');
              saveHistorySnapshot();
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl border font-semibold transition ${
              background.mode === 'gradient'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 ring-2 ring-purple-600/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gradient</span>
          </button>
        </div>

        {/* Custom Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold transition ${
            background.mode === 'image'
              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
              : 'border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-cyan-500" />
          <span>{background.mode === 'image' ? 'Custom Background Active' : 'Upload Custom Background Image'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCustomImageUpload}
        />
      </div>

      {/* Contextual Settings for Solid Color */}
      {background.mode === 'solid' && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Choose Color</span>
            <input
              type="color"
              value={background.solidColor}
              onChange={(e) => {
                updateBackground('solidColor', e.target.value);
                saveHistorySnapshot();
              }}
              className="w-7 h-7 rounded border-none cursor-pointer"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {solidPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  updateBackground('solidColor', color);
                  saveHistorySnapshot();
                }}
                className="w-6 h-6 rounded-full border border-slate-300 shadow-sm transition hover:scale-110"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tolerance and Feathering Sliders */}
      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">Tolerance Sensitivity</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{background.tolerance}</span>
          </div>
          <input
            type="range"
            min={5}
            max={90}
            value={background.tolerance}
            onChange={(e) => updateBackground('tolerance', Number(e.target.value))}
            onMouseUp={saveHistorySnapshot}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">Edge Feathering / Softness</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{background.feather}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            value={background.feather}
            onChange={(e) => updateBackground('feather', Number(e.target.value))}
            onMouseUp={saveHistorySnapshot}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

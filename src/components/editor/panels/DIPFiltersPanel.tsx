import React, { useState } from 'react';
import { useEditor } from '../../../context/EditorContext';
import { HistogramChart } from '../HistogramChart';
import { DIPFormulaModal } from '../DIPFormulaModal';
import type { FilterType } from '../../../types/editor';
import { BookOpen, RotateCcw, Cpu } from 'lucide-react';

export const DIPFiltersPanel: React.FC = () => {
  const {
    dipSettings,
    updateDIPSetting,
    resetDIPSettings,
    saveHistorySnapshot,
    histogram,
  } = useEditor();

  const [activeCategory, setActiveCategory] = useState<'edges' | 'histogram' | 'artistic'>('edges');
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);

  const edgeFilters: { id: FilterType; name: string; desc: string; math: string }[] = [
    {
      id: 'sobel',
      name: 'Sobel Operator',
      desc: '1st order gradient with Gaussian smoothing',
      math: 'G = √(Gx² + Gy²)',
    },
    {
      id: 'roberts',
      name: 'Roberts Cross',
      desc: '2x2 finite diagonal difference operator',
      math: 'Δ₁ = I(x,y)-I(x+1,y+1)',
    },
    {
      id: 'prewitt',
      name: 'Prewitt Operator',
      desc: 'Uniform gradient edge detection',
      math: '3x3 differential',
    },
    {
      id: 'laplacian',
      name: 'Laplacian Operator',
      desc: '2nd order derivative zero-crossing edge detector',
      math: '∇²f = ∂²f/∂x² + ∂²f/∂y²',
    },
  ];

  const artisticFilters: { id: FilterType; name: string; desc: string }[] = [
    { id: 'grayscale_bt601', name: 'Grayscale (BT.601)', desc: '0.299R + 0.587G + 0.114B' },
    { id: 'grayscale_bt709', name: 'Grayscale (BT.709)', desc: '0.2126R + 0.7152G + 0.0722B' },
    { id: 'grayscale_avg', name: 'Grayscale (Avg)', desc: '(R + G + B) / 3' },
    { id: 'threshold', name: 'Binarization / Threshold', desc: 'Binary segmentation' },
    { id: 'sepia', name: 'Sepia Tone', desc: 'Warm vintage silver-gelatin look' },
    { id: 'invert', name: 'Negative / Invert', desc: '255 - pixel value' },
    { id: 'emboss', name: '3D Emboss', desc: 'Directional relief illumination' },
    { id: 'posterize', name: 'Posterize', desc: 'Quantized color steps' },
    { id: 'solarize', name: 'Solarize', desc: 'Partial tone inversion' },
    { id: 'vignette', name: 'Vignette', desc: 'Cos-radial edge falloff' },
  ];

  const selectFilter = (f: FilterType) => {
    updateDIPSetting('filter', f);
    saveHistorySnapshot();
  };

  return (
    <div className="space-y-4">
      {/* Header & Math trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            DIP Algorithms
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFormulaOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800"
          >
            <BookOpen className="w-3 h-3" />
            Equations
          </button>
          <button
            onClick={resetDIPSettings}
            title="Reset DIP Filter to None"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-[11px] font-semibold">
        <button
          onClick={() => setActiveCategory('edges')}
          className={`flex-1 py-1 rounded-md transition ${
            activeCategory === 'edges'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Edge Operators
        </button>
        <button
          onClick={() => setActiveCategory('histogram')}
          className={`flex-1 py-1 rounded-md transition ${
            activeCategory === 'histogram'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Histogram / CDF
        </button>
        <button
          onClick={() => setActiveCategory('artistic')}
          className={`flex-1 py-1 rounded-md transition ${
            activeCategory === 'artistic'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Filters & Gray
        </button>
      </div>

      {/* 1. EDGE OPERATORS TAB */}
      {activeCategory === 'edges' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {edgeFilters.map((f) => {
              const isSelected = dipSettings.filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => selectFilter(f.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-600/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="font-bold text-xs">{f.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{f.desc}</div>
                  <div className="text-[9px] font-mono text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                    {f.math}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Contextual edge settings when Sobel is selected */}
          {dipSettings.filter === 'sobel' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Sobel Directional Mode</div>
              <div className="flex gap-1.5 text-xs">
                {(['all', 'horizontal', 'vertical'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      updateDIPSetting('sobelMode', m);
                      saveHistorySnapshot();
                    }}
                    className={`flex-1 py-1 rounded capitalize font-medium text-[11px] ${
                      dipSettings.sobelMode === m
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Edge Binarization Cutoff:</span>
                  <span className="font-mono font-bold">{dipSettings.sobelThreshold}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={dipSettings.sobelThreshold}
                  onChange={(e) => updateDIPSetting('sobelThreshold', Number(e.target.value))}
                  onMouseUp={saveHistorySnapshot}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          )}

          {/* Reset Filter to none */}
          {dipSettings.filter !== 'none' && (
            <button
              onClick={() => selectFilter('none')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700"
            >
              Clear Edge Filter
            </button>
          )}
        </div>
      )}

      {/* 2. HISTOGRAM & EQUALIZATION TAB */}
      {activeCategory === 'histogram' && (
        <div className="space-y-3">
          {/* Live Histogram Visualizer */}
          <HistogramChart histogram={histogram} onOpenDIPFormula={() => setIsFormulaOpen(true)} />

          {/* Histogram Equalization Button */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">Histogram Equalization</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Expand dynamic range via CDF</div>
              </div>
              <button
                onClick={() => selectFilter('histogram_equalization')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  dipSettings.filter === 'histogram_equalization'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
              >
                {dipSettings.filter === 'histogram_equalization' ? 'Active' : 'Apply HE'}
              </button>
            </div>

            {dipSettings.filter === 'histogram_equalization' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Processing Channel:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateDIPSetting('equalizationChannel', 'luminance');
                      saveHistorySnapshot();
                    }}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold ${
                      dipSettings.equalizationChannel === 'luminance'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    HSL Luminance (Best)
                  </button>
                  <button
                    onClick={() => {
                      updateDIPSetting('equalizationChannel', 'rgb');
                      saveHistorySnapshot();
                    }}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold ${
                      dipSettings.equalizationChannel === 'rgb'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    RGB Channels
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ARTISTIC & BINARIZATION TAB */}
      {activeCategory === 'artistic' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {artisticFilters.map((f) => {
              const isSelected = dipSettings.filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => selectFilter(f.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-600/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="font-bold text-xs">{f.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{f.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Contextual Thresholding Settings */}
          {dipSettings.filter === 'threshold' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Threshold Mode</span>
                <button
                  onClick={() => {
                    updateDIPSetting('isOtsuThreshold', !dipSettings.isOtsuThreshold);
                    saveHistorySnapshot();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    dipSettings.isOtsuThreshold
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {dipSettings.isOtsuThreshold ? 'Otsu (Auto)' : 'Manual'}
                </button>
              </div>

              {!dipSettings.isOtsuThreshold && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Cutoff:</span>
                    <span className="font-mono font-bold">{dipSettings.thresholdLevel}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={dipSettings.thresholdLevel}
                    onChange={(e) => updateDIPSetting('thresholdLevel', Number(e.target.value))}
                    onMouseUp={saveHistorySnapshot}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              )}
            </div>
          )}

          {dipSettings.filter !== 'none' && (
            <button
              onClick={() => selectFilter('none')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Formula Modal */}
      <DIPFormulaModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />
    </div>
  );
};

import React from 'react';
import { useEditor } from '../../../context/EditorContext';
import { Sun, Contrast, Droplets, Gauge, Flame, SunDim, Moon, RotateCcw } from 'lucide-react';

export const AdjustPanel: React.FC = () => {
  const { adjustments, updateAdjustment, resetAdjustments, saveHistorySnapshot } = useEditor();

  const sliders = [
    {
      key: 'brightness' as const,
      label: 'Brightness',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      min: -100,
      max: 100,
      val: adjustments.brightness,
    },
    {
      key: 'contrast' as const,
      label: 'Contrast',
      icon: <Contrast className="w-4 h-4 text-indigo-500" />,
      min: -100,
      max: 100,
      val: adjustments.contrast,
    },
    {
      key: 'saturation' as const,
      label: 'Saturation',
      icon: <Droplets className="w-4 h-4 text-pink-500" />,
      min: -100,
      max: 100,
      val: adjustments.saturation,
    },
    {
      key: 'exposure' as const,
      label: 'Exposure',
      icon: <Gauge className="w-4 h-4 text-cyan-500" />,
      min: -100,
      max: 100,
      val: adjustments.exposure,
    },
    {
      key: 'temperature' as const,
      label: 'Temperature (Warm/Cool)',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      min: -100,
      max: 100,
      val: adjustments.temperature,
    },
    {
      key: 'highlights' as const,
      label: 'Highlights',
      icon: <SunDim className="w-4 h-4 text-yellow-500" />,
      min: -100,
      max: 100,
      val: adjustments.highlights,
    },
    {
      key: 'shadows' as const,
      label: 'Shadows',
      icon: <Moon className="w-4 h-4 text-purple-500" />,
      min: -100,
      max: 100,
      val: adjustments.shadows,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Light & Color Balance
        </h3>
        <button
          onClick={resetAdjustments}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      <div className="space-y-3.5">
        {sliders.map((s) => (
          <div key={s.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                {s.icon}
                {s.label}
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 min-w-[28px] text-right">
                {s.val > 0 ? `+${s.val}` : s.val}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={s.val}
                onChange={(e) => updateAdjustment(s.key, Number(e.target.value))}
                onMouseUp={saveHistorySnapshot}
                onTouchEnd={saveHistorySnapshot}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-500"
              />
              {s.val !== 0 && (
                <button
                  onClick={() => {
                    updateAdjustment(s.key, 0);
                    saveHistorySnapshot();
                  }}
                  title="Reset slider to 0"
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import type { HistogramData } from '../../types/editor';
import { BarChart3, Info } from 'lucide-react';

interface HistogramChartProps {
  histogram: HistogramData | null;
  onOpenDIPFormula?: () => void;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ histogram, onOpenDIPFormula }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'lum' | 'r' | 'g' | 'b'>('all');

  useEffect(() => {
    if (!histogram || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Find max value across bins for normalization
    let maxVal = 1;
    for (let i = 0; i < 256; i++) {
      if (selectedChannel === 'all' || selectedChannel === 'lum') {
        maxVal = Math.max(maxVal, histogram.lum[i]);
      }
      if (selectedChannel === 'all' || selectedChannel === 'r') {
        maxVal = Math.max(maxVal, histogram.r[i]);
      }
      if (selectedChannel === 'all' || selectedChannel === 'g') {
        maxVal = Math.max(maxVal, histogram.g[i]);
      }
      if (selectedChannel === 'all' || selectedChannel === 'b') {
        maxVal = Math.max(maxVal, histogram.b[i]);
      }
    }

    const drawChannel = (data: number[], color: string, alpha: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;

      const barWidth = width / 256;
      for (let i = 0; i < 256; i++) {
        const barHeight = (data[i] / maxVal) * (height - 4);
        ctx.fillRect(i * barWidth, height - barHeight, barWidth + 0.5, barHeight);
      }
    };

    if (selectedChannel === 'all') {
      drawChannel(histogram.r, '#ef4444', 0.45);
      drawChannel(histogram.g, '#22c55e', 0.45);
      drawChannel(histogram.b, '#3b82f6', 0.45);
      drawChannel(histogram.lum, '#f8fafc', 0.35);
    } else if (selectedChannel === 'lum') {
      drawChannel(histogram.lum, '#a855f7', 0.85);
    } else if (selectedChannel === 'r') {
      drawChannel(histogram.r, '#ef4444', 0.85);
    } else if (selectedChannel === 'g') {
      drawChannel(histogram.g, '#22c55e', 0.85);
    } else if (selectedChannel === 'b') {
      drawChannel(histogram.b, '#3b82f6', 0.85);
    }

    ctx.globalAlpha = 1.0;
  }, [histogram, selectedChannel]);

  if (!histogram) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
          <span>Luminance & RGB Histogram</span>
        </div>
        {onOpenDIPFormula && (
          <button
            onClick={onOpenDIPFormula}
            title="DIP Mathematical Formulation"
            className="text-[11px] flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            <Info className="w-3 h-3" />
            <span>Math / Theory</span>
          </button>
        )}
      </div>

      <div className="h-20 w-full bg-slate-950/80 rounded-lg overflow-hidden border border-slate-700/50 relative shadow-inner">
        <canvas ref={canvasRef} width={256} height={80} className="w-full h-full block" />
        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400 select-none">0 (Dark)</div>
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 select-none">255 (Bright)</div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Channel:</span>
        <div className="flex gap-1 font-semibold">
          <button
            onClick={() => setSelectedChannel('all')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              selectedChannel === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            RGB+L
          </button>
          <button
            onClick={() => setSelectedChannel('lum')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              selectedChannel === 'lum'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Lum
          </button>
          <button
            onClick={() => setSelectedChannel('r')}
            className={`px-1.5 py-0.5 rounded text-[10px] text-red-500 ${
              selectedChannel === 'r' ? 'bg-red-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            R
          </button>
          <button
            onClick={() => setSelectedChannel('g')}
            className={`px-1.5 py-0.5 rounded text-[10px] text-green-500 ${
              selectedChannel === 'g' ? 'bg-green-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            G
          </button>
          <button
            onClick={() => setSelectedChannel('b')}
            className={`px-1.5 py-0.5 rounded text-[10px] text-blue-500 ${
              selectedChannel === 'b' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            B
          </button>
        </div>
      </div>
    </div>
  );
};

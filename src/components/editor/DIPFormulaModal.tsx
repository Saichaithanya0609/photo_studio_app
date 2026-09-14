import React from 'react';
import { X, BookOpen, Layers, Sigma } from 'lucide-react';

interface DIPFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DIPFormulaModal: React.FC<DIPFormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Digital Image Processing (DIP) Mathematical Formulations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exact mathematical models, kernels, and algorithms implemented in LuminaArt
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

        {/* Modal Body with Formula Cards */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-sm">
          
          {/* 1. Histogram Equalization */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sigma className="w-4 h-4 text-purple-500" />
                1. Histogram Equalization (HE)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                Contrast Enhancement
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Spreads the most frequent intensity values to expand the dynamic range across the full [0, 255] spectrum.
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1.5 border border-slate-800">
              <div>• Probability Mass Function: <span className="text-pink-400">p(r_k) = n_k / (M × N)</span></div>
              <div>• Cumulative Distribution Function (CDF): <span className="text-indigo-400">CDF(k) = Σ(j=0 to k) p(r_j)</span></div>
              <div>• Intensity Transformation Mapping: <span className="text-emerald-400">s_k = round[ (L - 1) × (CDF(k) - CDF_min) / (Total - CDF_min) ]</span></div>
              <div className="text-[11px] text-slate-400 pt-1">
                * Note: In LuminaArt, equalization is computed in <strong>HSL/Luminance</strong> space to eliminate color tint shifting!
              </div>
            </div>
          </div>

          {/* 2. Sobel Edge Detection */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-500" />
                2. Sobel Operator (1st Order Gradient)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                Edge Detection
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Combines Gaussian smoothing with spatial differentiation to compute gradients robust to noise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-pink-400 font-bold mb-1">G_x (Vertical Edges):</div>
                <div>[-1  0  +1]</div>
                <div>[-2  0  +2]</div>
                <div>[-1  0  +1]</div>
              </div>
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-pink-400 font-bold mb-1">G_y (Horizontal Edges):</div>
                <div>[-1  -2  -1]</div>
                <div>[ 0   0   0]</div>
                <div>[+1  +2  +1]</div>
              </div>
            </div>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
              <div>Gradient Magnitude: <span className="text-emerald-400">|G| = √(G_x² + G_y²)</span></div>
              <div>Gradient Direction: <span className="text-indigo-400">θ = arctan(G_y / G_x)</span></div>
            </div>
          </div>

          {/* 3. Roberts Cross Operator */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                3. Roberts Cross Operator
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                Diagonal Gradients
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Fast 2×2 differential operator calculating diagonal finite differences:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-indigo-400 font-bold mb-1">G_x: [ +1   0 ]</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[  0  -1 ]</div>
                <div className="text-slate-400 text-[11px] mt-1">Δ₁ = I(x, y) - I(x+1, y+1)</div>
              </div>
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-indigo-400 font-bold mb-1">G_y: [  0  +1 ]</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ -1   0 ]</div>
                <div className="text-slate-400 text-[11px] mt-1">Δ₂ = I(x+1, y) - I(x, y+1)</div>
              </div>
            </div>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
              <div>Total Edge Magnitude: <span className="text-emerald-400">|G| = √(Δ₁² + Δ₂²)</span></div>
            </div>
          </div>

          {/* 4. Laplacian & Sharpening */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              4. Laplacian & High-Boost Unsharp Masking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">Laplacian 8-Neighbor:</div>
                <div>[ 1   1   1 ]</div>
                <div>[ 1  -8   1 ]</div>
                <div>[ 1   1   1 ]</div>
              </div>
              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">Sharpening Kernel:</div>
                <div>[  0  -1   0 ]</div>
                <div>[ -1   5  -1 ]</div>
                <div>[  0  -1   0 ]</div>
              </div>
            </div>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-xs border border-slate-800">
              <div>Deblur / Unsharp Equation: <span className="text-emerald-400">I_restored(x,y) = I(x,y) + λ · [I(x,y) - G_blur(x,y)]</span></div>
            </div>
          </div>

          {/* 5. Otsu Thresholding & Grayscale */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              5. Grayscale & Otsu Optimal Binarization
            </h3>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1.5 border border-slate-800">
              <div>• ITU-R BT.601: <span className="text-cyan-400">Y = 0.299·R + 0.587·G + 0.114·B</span></div>
              <div>• ITU-R BT.709 (HDTV): <span className="text-cyan-400">Y = 0.2126·R + 0.7152·G + 0.0722·B</span></div>
              <div>• Otsu's Criterion: <span className="text-pink-400">max_t [ σ_B²(t) = ω₀(t)·ω₁(t) · (μ₀(t) - μ₁(t))² ]</span></div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
          >
            Got it, close inspector
          </button>
        </div>
      </div>
    </div>
  );
};

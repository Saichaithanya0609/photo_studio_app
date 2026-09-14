import React, { useState, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { type ExportFormat, getCompressedPreview, downloadImageOrPdf } from '../../utils/dip/compressor';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { canvasRef } = useEditor();

  const [format, setFormat] = useState<ExportFormat>('jpeg');
  const [quality, setQuality] = useState<number>(0.85);
  const [scale, setScale] = useState<number>(1);
  const [filename, setFilename] = useState<string>('lumina-edited');
  const [estimatedSize, setEstimatedSize] = useState<string>('Calculating...');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Calculate live preview size whenever canvas, format, quality, or scale changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    let isMounted = true;
    const compute = async () => {
      const srcCanvas = canvasRef.current;
      if (!srcCanvas) return;

      let targetCanvas = srcCanvas;
      if (scale !== 1) {
        const temp = document.createElement('canvas');
        temp.width = Math.round(srcCanvas.width * scale);
        temp.height = Math.round(srcCanvas.height * scale);
        const ctx = temp.getContext('2d');
        if (ctx) {
          ctx.drawImage(srcCanvas, 0, 0, temp.width, temp.height);
          targetCanvas = temp;
        }
      }

      const res = await getCompressedPreview(targetCanvas, format, quality);
      if (isMounted) {
        setEstimatedSize(res.sizeFormatted);
      }
    };

    compute();
    return () => {
      isMounted = false;
    };
  }, [isOpen, canvasRef.current, format, quality, scale]);

  if (!isOpen) return null;

  const currentW = canvasRef.current?.width || 0;
  const currentH = canvasRef.current?.height || 0;
  const targetW = Math.round(currentW * scale);
  const targetH = Math.round(currentH * scale);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const srcCanvas = canvasRef.current;
      let exportCanvas = srcCanvas;

      if (scale !== 1) {
        const temp = document.createElement('canvas');
        temp.width = targetW;
        temp.height = targetH;
        const ctx = temp.getContext('2d');
        if (ctx) {
          ctx.drawImage(srcCanvas, 0, 0, targetW, targetH);
          exportCanvas = temp;
        }
      }

      await downloadImageOrPdf(exportCanvas, format, quality, filename.trim() || 'lumina-edited');
      setIsExporting(false);
      onClose();
    } catch (err) {
      console.error('Download error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Export & Compress
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download in high fidelity or compressed file size
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

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">File Format</label>
            <div className="grid grid-cols-4 gap-2">
              {(['jpeg', 'png', 'webp', 'pdf'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold uppercase transition flex flex-col items-center gap-1 ${
                    format === fmt
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {fmt === 'pdf' ? <FileText className="w-4 h-4 text-red-500" /> : <ImageIcon className="w-4 h-4 text-purple-500" />}
                  <span>{fmt === 'jpeg' ? 'JPG' : fmt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG, WEBP, PDF) */}
          {format !== 'png' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Compression Quality</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Smallest File</span>
                <span>Maximum Quality</span>
              </div>
            </div>
          )}

          {/* Dimension Scaling */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Resolution</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              {[
                { label: 'Original (100%)', val: 1 },
                { label: 'Medium (75%)', val: 0.75 },
                { label: 'Compact (50%)', val: 0.5 },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setScale(s.val)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition ${
                    scale === s.val
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-right">
              {targetW} × {targetH} px
            </div>
          </div>

          {/* Filename Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">File Name</label>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1.5">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-white outline-none"
                placeholder="Filename"
              />
              <span className="text-xs font-mono text-slate-400">
                .{format === 'jpeg' ? 'jpg' : format}
              </span>
            </div>
          </div>

          {/* Real-time File Size Badge */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">
              Estimated File Size:
            </span>
            <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
              {estimatedSize}
            </span>
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
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition shadow-md shadow-purple-500/25 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download File'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

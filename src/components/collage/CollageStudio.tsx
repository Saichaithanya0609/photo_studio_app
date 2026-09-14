import React, { useState, useRef } from 'react';
import { SAMPLE_IMAGES } from '../../data/sampleImages';
import {
  Layers,
  Upload,
  Download,
  Share2,
  Sparkles,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { downloadImageOrPdf, type ExportFormat } from '../../utils/dip/compressor';

export type TemplateId =
  | '2-vert'
  | '2-horiz'
  | '3-featured'
  | '3-columns'
  | '4-grid'
  | '4-featured'
  | '5-focus'
  | '6-grid'
  | '9-grid'
  | 'polaroid';

interface CollageStudioProps {
  onSendToEditor: (dataUrl: string) => void;
  onPublishToFeed: (dataUrl: string) => void;
}

export const CollageStudio: React.FC<CollageStudioProps> = ({
  onSendToEditor,
  onPublishToFeed,
}) => {
  const [template, setTemplate] = useState<TemplateId>('4-grid');
  const [spacing, setSpacing] = useState<number>(10);
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [padding, setPadding] = useState<number>(16);

  // Slots mapped by index
  const [slotImages, setSlotImages] = useState<{ [key: number]: string }>({
    0: SAMPLE_IMAGES[0].url,
    1: SAMPLE_IMAGES[1].url,
    2: SAMPLE_IMAGES[2].url,
    3: SAMPLE_IMAGES[3].url,
  });

  const [activeSlotForUpload, setActiveSlotForUpload] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Template metadata
  const templateConfigs: { id: TemplateId; name: string; slotCount: number; desc: string }[] = [
    { id: '2-vert', name: '2 Photos (Vertical)', slotCount: 2, desc: 'Split 1:1 vertical' },
    { id: '2-horiz', name: '2 Photos (Horizontal)', slotCount: 2, desc: 'Split 1:1 horizontal' },
    { id: '3-featured', name: '3 Photos (1 Large + 2 Stacked)', slotCount: 3, desc: 'Featured hero + 2 side' },
    { id: '3-columns', name: '3 Photos (Columns)', slotCount: 3, desc: '3 vertical panels' },
    { id: '4-grid', name: '4 Photos (2×2 Grid)', slotCount: 4, desc: 'Even balanced quadrant' },
    { id: '4-featured', name: '4 Photos (Hero + 3 Strip)', slotCount: 4, desc: 'Hero top + 3 below' },
    { id: '5-focus', name: '5 Photos (Center Focus)', slotCount: 5, desc: 'Hero left + 4 grid right' },
    { id: '6-grid', name: '6 Photos (3×2 Grid)', slotCount: 6, desc: 'Story board layout' },
    { id: '9-grid', name: '9 Photos (3×3 Grid)', slotCount: 9, desc: 'Instagram photo wall' },
    { id: 'polaroid', name: 'Polaroid Style', slotCount: 4, desc: 'Scrapbook tilt & borders' },
  ];

  const currentConfig = templateConfigs.find((t) => t.id === template) || templateConfigs[4];

  const handleSlotClick = (slotIdx: number) => {
    setActiveSlotForUpload(slotIdx);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlotForUpload === null) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setSlotImages((prev) => ({
          ...prev,
          [activeSlotForUpload]: ev.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const fillWithSamples = () => {
    const newSlots: { [key: number]: string } = {};
    for (let i = 0; i < currentConfig.slotCount; i++) {
      newSlots[i] = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length].url;
    }
    setSlotImages(newSlots);
  };

  const clearAllSlots = () => {
    setSlotImages({});
  };

  // Render collage to offscreen or hidden canvas for export or editor transfer
  const renderCollageToCanvas = async (outputWidth: number = 1600): Promise<string> => {
    const canvas = document.createElement('canvas');
    const aspectRatio = template === '2-vert' || template === '3-columns' ? 3 / 2 : 1;
    const outputHeight = Math.round(outputWidth / aspectRatio);

    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Scale padding and gap
    const scale = outputWidth / 800;
    const pad = padding * scale;
    const gap = spacing * scale;
    const rad = borderRadius * scale;

    const innerW = outputWidth - pad * 2;
    const innerH = outputHeight - pad * 2;

    // Helper to draw image clipped with border radius
    const drawClippedImage = async (
      imgUrl: string | undefined,
      x: number,
      y: number,
      w: number,
      h: number,
      tiltDeg: number = 0
    ) => {
      ctx.save();
      if (tiltDeg !== 0) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((tiltDeg * Math.PI) / 180);
        ctx.translate(-(x + w / 2), -(y + h / 2));
      }

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, [rad]);
      ctx.clip();

      if (imgUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = imgUrl;
        });

        if (img.width > 0) {
          // Cover fit
          const imgAspect = img.width / img.height;
          const boxAspect = w / h;
          let drawW = w;
          let drawH = h;
          let drawX = x;
          let drawY = y;

          if (imgAspect > boxAspect) {
            drawW = h * imgAspect;
            drawX = x - (drawW - w) / 2;
          } else {
            drawH = w / imgAspect;
            drawY = y - (drawH - h) / 2;
          }
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(x, y, w, h);
        }
      } else {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(x, y, w, h);
      }
      ctx.restore();
    };

    // Calculate slots coordinates based on template
    if (template === '2-vert') {
      const colW = (innerW - gap) / 2;
      await drawClippedImage(slotImages[0], pad, pad, colW, innerH);
      await drawClippedImage(slotImages[1], pad + colW + gap, pad, colW, innerH);
    } else if (template === '2-horiz') {
      const rowH = (innerH - gap) / 2;
      await drawClippedImage(slotImages[0], pad, pad, innerW, rowH);
      await drawClippedImage(slotImages[1], pad, pad + rowH + gap, innerW, rowH);
    } else if (template === '3-featured') {
      const leftW = (innerW - gap) * 0.6;
      const rightW = innerW - gap - leftW;
      const rightH = (innerH - gap) / 2;
      await drawClippedImage(slotImages[0], pad, pad, leftW, innerH);
      await drawClippedImage(slotImages[1], pad + leftW + gap, pad, rightW, rightH);
      await drawClippedImage(slotImages[2], pad + leftW + gap, pad + rightH + gap, rightW, rightH);
    } else if (template === '3-columns') {
      const colW = (innerW - gap * 2) / 3;
      for (let i = 0; i < 3; i++) {
        await drawClippedImage(slotImages[i], pad + i * (colW + gap), pad, colW, innerH);
      }
    } else if (template === '4-grid') {
      const cellW = (innerW - gap) / 2;
      const cellH = (innerH - gap) / 2;
      await drawClippedImage(slotImages[0], pad, pad, cellW, cellH);
      await drawClippedImage(slotImages[1], pad + cellW + gap, pad, cellW, cellH);
      await drawClippedImage(slotImages[2], pad, pad + cellH + gap, cellW, cellH);
      await drawClippedImage(slotImages[3], pad + cellW + gap, pad + cellH + gap, cellW, cellH);
    } else if (template === '4-featured') {
      const topH = (innerH - gap) * 0.6;
      const botH = innerH - gap - topH;
      const botW = (innerW - gap * 2) / 3;
      await drawClippedImage(slotImages[0], pad, pad, innerW, topH);
      for (let i = 0; i < 3; i++) {
        await drawClippedImage(slotImages[i + 1], pad + i * (botW + gap), pad + topH + gap, botW, botH);
      }
    } else if (template === '5-focus') {
      const leftW = (innerW - gap) * 0.55;
      const rightW = innerW - gap - leftW;
      const subW = (rightW - gap) / 2;
      const subH = (innerH - gap) / 2;
      await drawClippedImage(slotImages[0], pad, pad, leftW, innerH);
      await drawClippedImage(slotImages[1], pad + leftW + gap, pad, subW, subH);
      await drawClippedImage(slotImages[2], pad + leftW + gap + subW + gap, pad, subW, subH);
      await drawClippedImage(slotImages[3], pad + leftW + gap, pad + subH + gap, subW, subH);
      await drawClippedImage(slotImages[4], pad + leftW + gap + subW + gap, pad + subH + gap, subW, subH);
    } else if (template === '6-grid') {
      const cellW = (innerW - gap * 2) / 3;
      const cellH = (innerH - gap) / 2;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col;
          await drawClippedImage(slotImages[idx], pad + col * (cellW + gap), pad + row * (cellH + gap), cellW, cellH);
        }
      }
    } else if (template === '9-grid') {
      const cellW = (innerW - gap * 2) / 3;
      const cellH = (innerH - gap * 2) / 3;
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col;
          await drawClippedImage(slotImages[idx], pad + col * (cellW + gap), pad + row * (cellH + gap), cellW, cellH);
        }
      }
    } else if (template === 'polaroid') {
      const cellW = (innerW - gap) / 2;
      const cellH = (innerH - gap) / 2;
      const tilts = [-3, 2.5, 3.5, -2];
      await drawClippedImage(slotImages[0], pad, pad, cellW, cellH, tilts[0]);
      await drawClippedImage(slotImages[1], pad + cellW + gap, pad, cellW, cellH, tilts[1]);
      await drawClippedImage(slotImages[2], pad, pad + cellH + gap, cellW, cellH, tilts[2]);
      await drawClippedImage(slotImages[3], pad + cellW + gap, pad + cellH + gap, cellW, cellH, tilts[3]);
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const handleExport = async (format: ExportFormat) => {
    const dataUrl = await renderCollageToCanvas(1800);
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        downloadImageOrPdf(canvas, format, 0.9, 'lumina-collage');
      }
    };
    img.src = dataUrl;
  };

  const handleSendToEditor = async () => {
    const dataUrl = await renderCollageToCanvas(1800);
    onSendToEditor(dataUrl);
  };

  const handlePublish = async () => {
    const dataUrl = await renderCollageToCanvas(1600);
    onPublishToFeed(dataUrl);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Left Control Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 space-y-5 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Collage Studio</h2>
          </div>
          <button
            onClick={clearAllSlots}
            className="text-[11px] flex items-center gap-1 font-semibold text-slate-500 hover:text-red-500 transition"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Quick Fill Button */}
        <button
          onClick={fillWithSamples}
          className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Fill with Sample Photos</span>
        </button>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layout Templates</label>
          <div className="grid grid-cols-2 gap-2">
            {templateConfigs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  template === t.id
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Spacing, Corner Radius, Outer Padding */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Inner Spacing / Gap</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{spacing}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Corner Rounding</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{borderRadius}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Outer Border Padding</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{padding}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Background Color */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Collage Background</span>
            <div className="flex items-center gap-2">
              {['#ffffff', '#000000', '#f3e8ff', '#fce7f3', '#e0f2fe'].map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`w-5 h-5 rounded-full border shadow-sm ${
                    bgColor === c ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6 rounded border-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleSendToEditor}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition shadow-md shadow-purple-500/20"
          >
            <span>Open in Photo Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport('jpeg')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
            >
              <Download className="w-3.5 h-3.5 text-pink-500" />
              <span>Save JPG</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
            >
              <Download className="w-3.5 h-3.5 text-red-500" />
              <span>Save PDF</span>
            </button>
          </div>

          <button
            onClick={handlePublish}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-500" />
            <span>Publish to 24h Community</span>
          </button>
        </div>
      </div>

      {/* Center Interactive Collage Preview Board */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto checkerboard-pattern">
        <div
          style={{
            backgroundColor: bgColor,
            padding: `${padding}px`,
            gap: `${spacing}px`,
          }}
          className="relative max-w-2xl w-full aspect-square shadow-2xl rounded-2xl overflow-hidden transition-all flex flex-col"
        >
          {/* 2 Photos Vertical */}
          {template === '2-vert' && (
            <div className="flex-1 flex" style={{ gap: `${spacing}px` }}>
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="flex-1 h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">Click to Add Photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 2 Photos Horizontal */}
          {template === '2-horiz' && (
            <div className="flex-1 flex flex-col" style={{ gap: `${spacing}px` }}>
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="flex-1 w-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">Click to Add Photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3 Photos Featured (1 Large + 2 Stacked) */}
          {template === '3-featured' && (
            <div className="flex-1 flex" style={{ gap: `${spacing}px` }}>
              <div
                onClick={() => handleSlotClick(0)}
                style={{ borderRadius: `${borderRadius}px` }}
                className="w-3/5 h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
              >
                {slotImages[0] ? (
                  <img src={slotImages[0]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-xs">Add Main Photo</span>
                  </div>
                )}
              </div>
              <div className="w-2/5 h-full flex flex-col" style={{ gap: `${spacing}px` }}>
                {[1, 2].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    style={{ borderRadius: `${borderRadius}px` }}
                    className="flex-1 w-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                  >
                    {slotImages[idx] ? (
                      <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                        <Upload className="w-5 h-5" />
                        <span className="text-[10px]">Add Photo</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3 Columns */}
          {template === '3-columns' && (
            <div className="flex-1 flex" style={{ gap: `${spacing}px` }}>
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="flex-1 h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                      <Upload className="w-5 h-5" />
                      <span className="text-[10px]">Add Photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4 Photos Grid (2x2) */}
          {template === '4-grid' && (
            <div className="flex-1 grid grid-cols-2 grid-rows-2" style={{ gap: `${spacing}px` }}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="w-full h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Add Photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4 Photos (Hero Top + 3 Bottom) */}
          {template === '4-featured' && (
            <div className="flex-1 flex flex-col" style={{ gap: `${spacing}px` }}>
              <div
                onClick={() => handleSlotClick(0)}
                style={{ borderRadius: `${borderRadius}px` }}
                className="h-3/5 w-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
              >
                {slotImages[0] ? (
                  <img src={slotImages[0]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-xs">Add Hero Photo</span>
                  </div>
                )}
              </div>
              <div className="h-2/5 flex" style={{ gap: `${spacing}px` }}>
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    style={{ borderRadius: `${borderRadius}px` }}
                    className="flex-1 h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                  >
                    {slotImages[idx] ? (
                      <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                        <Upload className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5 Photos Focus */}
          {template === '5-focus' && (
            <div className="flex-1 flex" style={{ gap: `${spacing}px` }}>
              <div
                onClick={() => handleSlotClick(0)}
                style={{ borderRadius: `${borderRadius}px` }}
                className="w-1/2 h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
              >
                {slotImages[0] ? (
                  <img src={slotImages[0]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400">
                    <Upload className="w-6 h-6" />
                    <span className="text-xs">Add Centerpiece</span>
                  </div>
                )}
              </div>
              <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2" style={{ gap: `${spacing}px` }}>
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    style={{ borderRadius: `${borderRadius}px` }}
                    className="w-full h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                  >
                    {slotImages[idx] ? (
                      <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Upload className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6 Photos Grid */}
          {template === '6-grid' && (
            <div className="flex-1 grid grid-cols-3 grid-rows-2" style={{ gap: `${spacing}px` }}>
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="w-full h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 9 Photos Grid */}
          {template === '9-grid' && (
            <div className="flex-1 grid grid-cols-3 grid-rows-3" style={{ gap: `${spacing}px` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  style={{ borderRadius: `${borderRadius}px` }}
                  className="w-full h-full overflow-hidden relative cursor-pointer group bg-slate-200 dark:bg-slate-800 border border-slate-300/40"
                >
                  {slotImages[idx] ? (
                    <img src={slotImages[idx]} alt="slot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Polaroid Style */}
          {template === 'polaroid' && (
            <div className="flex-1 grid grid-cols-2 grid-rows-2 p-3" style={{ gap: `${spacing}px` }}>
              {[
                { idx: 0, tilt: '-rotate-2' },
                { idx: 1, tilt: 'rotate-3' },
                { idx: 2, tilt: 'rotate-2' },
                { idx: 3, tilt: '-rotate-3' },
              ].map(({ idx, tilt }) => (
                <div
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className={`w-full h-full bg-white p-2 pb-6 shadow-xl rounded-sm cursor-pointer transition-transform hover:scale-105 hover:z-10 ${tilt}`}
                >
                  <div className="w-full h-full overflow-hidden bg-slate-100">
                    {slotImages[idx] ? (
                      <img src={slotImages[idx]} alt="polaroid" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

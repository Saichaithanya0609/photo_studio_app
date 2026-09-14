import React, { useRef, useState } from 'react';
import { useEditor, type ToolTab } from '../../context/EditorContext';
import { AdjustPanel } from './panels/AdjustPanel';
import { DIPFiltersPanel } from './panels/DIPFiltersPanel';
import { SharpenBlurPanel } from './panels/SharpenBlurPanel';
import { CropRotatePanel } from './panels/CropRotatePanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { SAMPLE_IMAGES } from '../../data/sampleImages';
import {
  Sliders,
  Cpu,
  Zap,
  Crop,
  Scissors,
  Sparkles,
  Upload,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface EditorSidebarProps {
  onOpenUpscale: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ onOpenUpscale }) => {
  const {
    activeTab,
    setActiveTab,
    loadImageFromFile,
    loadSampleImage,
    originalImageUrl,
  } = useEditor();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);

  const navItems: { tab: ToolTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'adjust', label: 'Adjust', icon: <Sliders className="w-4 h-4" /> },
    { tab: 'dip', label: 'DIP Filters', icon: <Cpu className="w-4 h-4" /> },
    { tab: 'sharpen_blur', label: 'Clarity & Blur', icon: <Zap className="w-4 h-4" /> },
    { tab: 'crop_rotate', label: 'Crop & Rotate', icon: <Crop className="w-4 h-4" /> },
    { tab: 'background', label: 'AI & Bg Remover', icon: <Scissors className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col shrink-0 z-20 transition-all duration-300 ${
        isMobileCollapsed
          ? 'h-14 md:h-full overflow-hidden'
          : 'h-[46vh] max-h-[50vh] md:h-full md:max-h-none'
      }`}
    >
      {/* Mobile Drawer Toggle Handle (visible on screens < 768px) */}
      <div
        onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
        className="md:hidden flex items-center justify-between px-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 cursor-pointer select-none text-xs font-semibold text-slate-600 dark:text-slate-300"
      >
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          🛠️ Editing Tools & Panels
        </span>
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <span>{isMobileCollapsed ? 'Expand Tools' : 'Minimize to View Photo'}</span>
          {isMobileCollapsed ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Tool Categories Navigation Tabs */}
      <div className="grid grid-cols-5 p-1 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 text-center shrink-0">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              if (isMobileCollapsed) setIsMobileCollapsed(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 transition text-[10px] font-semibold gap-1 rounded-lg ${
              activeTab === item.tab
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="truncate max-w-full">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Top Upload & Sample Switcher Strip */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) loadImageFromFile(e.target.files[0]);
            }}
          />

          <button
            onClick={onOpenUpscale}
            title="AI Super Resolution Upscaler"
            className="flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Upscale</span>
          </button>
        </div>

        {/* Quick Sample Photos Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0">
            Presets:
          </span>
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSampleImage(sample.id)}
              title={sample.name}
              className={`relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                originalImageUrl === sample.url
                  ? 'border-purple-600 ring-2 ring-purple-600/30'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <img src={sample.thumb} alt={sample.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Active Panel Content Body (scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'adjust' && <AdjustPanel />}
        {activeTab === 'dip' && <DIPFiltersPanel />}
        {activeTab === 'sharpen_blur' && <SharpenBlurPanel />}
        {activeTab === 'crop_rotate' && <CropRotatePanel />}
        {activeTab === 'background' && <BackgroundPanel />}
      </div>
    </div>
  );
};

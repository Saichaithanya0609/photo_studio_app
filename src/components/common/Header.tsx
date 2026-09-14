import React from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sun,
  Moon,
  Download,
  Share2,
  Columns,
  Layers,
  Clock,
  Palette
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useEditor } from '../../context/EditorContext';
import { useFeed } from '../../context/FeedContext';

interface HeaderProps {
  currentView: 'editor' | 'collage' | 'feed';
  setCurrentView: (view: 'editor' | 'collage' | 'feed') => void;
  onOpenExport: () => void;
  onOpenPublish: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenExport,
  onOpenPublish,
}) => {
  const { theme, toggleTheme } = useTheme();
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    zoom,
    setZoom,
    resetZoom,
    showCompare,
    setShowCompare,
  } = useEditor();

  const { posts } = useFeed();
  const activePostCount = posts.length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between transition-colors">
      {/* Brand & Main Navigation */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setCurrentView('editor')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-black text-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-none">
              LuminaArt
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Photo & DIP Studio
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setCurrentView('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'editor'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Photo Editor
          </button>
          <button
            onClick={() => setCurrentView('collage')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'collage'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Collage Maker
          </button>
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              currentView === 'feed'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            24h Community
            {activePostCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-pink-500 text-white animate-pulse">
                {activePostCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Center Tools (Contextual to Editor) */}
      {currentView === 'editor' && (
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Zoom Controls */}
          <button
            onClick={() => setZoom(prev => Math.max(0.25, prev - 0.15))}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[44px] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(4, prev + 0.15))}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            title="Fit to Screen (100%)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Compare Before / After Split Slider Toggle */}
          <button
            onClick={() => setShowCompare(prev => !prev)}
            title="Compare Before & After"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              showCompare
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Before / After</span>
          </button>
        </div>
      )}

      {/* Right Controls: Theme Toggle & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Publish 24h Story / Post */}
        <button
          onClick={onOpenPublish}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-3.5 h-3.5 text-pink-500" />
          <span className="hidden sm:inline">Post 24h</span>
        </button>

        {/* Export / Download */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition shadow-md shadow-purple-500/25 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

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
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 flex items-center justify-between transition-colors">
      {/* Brand & Main Navigation */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setCurrentView('editor')}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20 text-white font-black text-lg sm:text-xl shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="hidden xs:block">
            <div className="font-extrabold text-base sm:text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-none">
              LuminaArt
            </div>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Photo & DIP Studio
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
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

        {/* Mobile Navigation Tabs (Screens < 768px) */}
        <nav className="flex md:hidden items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setCurrentView('editor')}
            title="Photo Editor"
            className={`p-1.5 rounded-md text-xs font-semibold transition ${
              currentView === 'editor'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('collage')}
            title="Collage Maker"
            className={`p-1.5 rounded-md text-xs font-semibold transition ${
              currentView === 'collage'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('feed')}
            title="24h Community Feed"
            className={`p-1.5 rounded-md text-xs font-semibold transition relative ${
              currentView === 'feed'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            {activePostCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </button>
        </nav>
      </div>

      {/* Center Tools (Contextual to Editor) */}
      {currentView === 'editor' && (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 px-1.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="hidden lg:block w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Zoom Controls (Desktop only) */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setZoom(prev => Math.max(0.25, prev - 0.15))}
              title="Zoom Out"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[38px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(4, prev + 0.15))}
              title="Zoom In"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              title="Fit to Screen"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition ml-0.5"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />

          {/* Compare Before / After Split Slider Toggle */}
          <button
            onClick={() => setShowCompare(prev => !prev)}
            title="Compare Before & After"
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium transition ${
              showCompare
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Compare</span>
          </button>
        </div>
      )}

      {/* Right Controls: Theme Toggle & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
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
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-3.5 h-3.5 text-pink-500" />
          <span className="hidden sm:inline">Post 24h</span>
        </button>

        {/* Export / Download */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition shadow-md shadow-purple-500/25 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

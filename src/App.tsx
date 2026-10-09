import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { EditorProvider, useEditor } from './context/EditorContext';
import { FeedProvider } from './context/FeedContext';
import { StudioHome } from './components/studio/StudioHome';
import { Header } from './components/common/Header';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { CanvasWorkspace } from './components/editor/CanvasWorkspace';
import { ExportModal } from './components/editor/ExportModal';
import { PublishModal } from './components/editor/PublishModal';
import { UpscaleModal } from './components/editor/UpscaleModal';
import { CollageStudio } from './components/collage/CollageStudio';
import { CommunityFeed } from './components/feed/CommunityFeed';
import { ArrowLeft } from 'lucide-react';

const MainApp: React.FC = () => {
  // App Mode: 'studio' (Cinematic Photo Studio Showcase Website) or 'lab' (Interactive DIP Photo Editor, Collage & Feed)
  const [appMode, setAppMode] = useState<'studio' | 'lab'>('studio');

  // Studio Photo Lab sub-view states
  const [currentView, setCurrentView] = useState<'editor' | 'collage' | 'feed'>('editor');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isUpscaleOpen, setIsUpscaleOpen] = useState(false);
  const [collageImageUrlForPublish, setCollageImageUrlForPublish] = useState<string | undefined>(undefined);

  const { loadImageFromUrl } = useEditor();

  const handleSendCollageToEditor = (dataUrl: string) => {
    loadImageFromUrl(dataUrl);
    setCurrentView('editor');
  };

  const handlePublishCollageToFeed = (dataUrl: string) => {
    setCollageImageUrlForPublish(dataUrl);
    setIsPublishOpen(true);
  };

  // 1. Flagship Cinematic Photo Studio Website
  if (appMode === 'studio') {
    return <StudioHome onOpenPhotoLab={() => setAppMode('lab')} />;
  }

  // 2. Interactive Studio Photo Lab (DIP Photo Editor, Collage Maker, 24h Community Feed)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors">
      {/* Return to Studio Website Banner */}
      <div className="bg-[#09090c] text-white text-xs py-2 px-4 flex justify-between items-center border-b border-amber-500/20 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-amber-300/90 font-semibold tracking-wider">
            LUMINA PHOTO LAB • DIGITAL IMAGE PROCESSING SUITE
          </span>
        </div>
        <button
          onClick={() => setAppMode('studio')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-950 hover:brightness-110 transition font-mono font-bold text-[11px] shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio Website</span>
        </button>
      </div>

      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPublish={() => {
          setCollageImageUrlForPublish(undefined);
          setIsPublishOpen(true);
        }}
        onReturnToStudio={() => setAppMode('studio')}
      />

      <main className="flex-1 flex overflow-hidden">
        {currentView === 'editor' && (
          <div className="flex-1 flex flex-col-reverse md:flex-row h-[calc(100vh-100px)] overflow-hidden">
            <EditorSidebar onOpenUpscale={() => setIsUpscaleOpen(true)} />
            <CanvasWorkspace />
          </div>
        )}

        {currentView === 'collage' && (
          <CollageStudio
            onSendToEditor={handleSendCollageToEditor}
            onPublishToFeed={handlePublishCollageToFeed}
          />
        )}

        {currentView === 'feed' && (
          <CommunityFeed
            onOpenPublish={() => {
              setCollageImageUrlForPublish(undefined);
              setIsPublishOpen(true);
            }}
          />
        )}
      </main>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <PublishModal
        isOpen={isPublishOpen}
        customImageUrl={collageImageUrlForPublish}
        onClose={() => setIsPublishOpen(false)}
        onPublished={() => {
          setIsPublishOpen(false);
          setCurrentView('feed');
        }}
      />
      <UpscaleModal isOpen={isUpscaleOpen} onClose={() => setIsUpscaleOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <FeedProvider>
        <EditorProvider>
          <MainApp />
        </EditorProvider>
      </FeedProvider>
    </ThemeProvider>
  );
}

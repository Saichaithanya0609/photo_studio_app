import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { EditorProvider, useEditor } from './context/EditorContext';
import { FeedProvider } from './context/FeedContext';
import { Header } from './components/common/Header';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { CanvasWorkspace } from './components/editor/CanvasWorkspace';
import { ExportModal } from './components/editor/ExportModal';
import { PublishModal } from './components/editor/PublishModal';
import { UpscaleModal } from './components/editor/UpscaleModal';
import { CollageStudio } from './components/collage/CollageStudio';
import { CommunityFeed } from './components/feed/CommunityFeed';

const MainApp: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPublish={() => {
          setCollageImageUrlForPublish(undefined);
          setIsPublishOpen(true);
        }}
      />

      {/* Main Workspace based on current tab */}
      <main className="flex-1 flex overflow-hidden">
        {currentView === 'editor' && (
          <div className="flex-1 flex flex-col-reverse md:flex-row h-[calc(100vh-64px)] overflow-hidden">
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

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <PublishModal
        isOpen={isPublishOpen}
        customImageUrl={collageImageUrlForPublish}
        onClose={() => setIsPublishOpen(false)}
        onPublished={() => {
          setIsPublishOpen(false);
          setCurrentView('feed');
        }}
      />

      <UpscaleModal
        isOpen={isUpscaleOpen}
        onClose={() => setIsUpscaleOpen(false)}
      />
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

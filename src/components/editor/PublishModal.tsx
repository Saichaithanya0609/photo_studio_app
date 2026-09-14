import React, { useState } from 'react';
import { useFeed } from '../../context/FeedContext';
import { useEditor } from '../../context/EditorContext';
import confetti from 'canvas-confetti';
import { X, Clock, Globe, Lock, Share2, Sparkles, Hash } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: () => void;
  customImageUrl?: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublished,
  customImageUrl,
}) => {
  const { addPost } = useFeed();
  const { canvasRef } = useEditor();

  const [caption, setCaption] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['LuminaArt', 'DIP']);
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  // Resolve image data URL
  const previewUrl = customImageUrl || (canvasRef.current ? canvasRef.current.toDataURL('image/jpeg', 0.9) : '');

  const suggestedTags = ['SobelEdge', 'HistEqualization', 'Portrait', 'Collage', 'Unblur', 'Neon', 'Aesthetic'];

  const handleAddTag = (tag: string) => {
    const clean = tag.replace('#', '').trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = () => {
    if (!previewUrl) return;

    addPost(
      previewUrl,
      caption.trim() || 'Created with LuminaArt Studio ✨',
      tags,
      isPublic
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onClose();
    if (onPublished) onPublished();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Post to 24h Feed
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ephemeral post — automatically disappears after 24 hours
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
          {/* Image Thumbnail Preview & Expiration Notice */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Post Preview"
                className="w-16 h-16 rounded-lg object-cover shadow-md border border-slate-300 dark:border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400">
                <Clock className="w-3.5 h-3.5" />
                <span>24-Hour Lifespan</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Your post will be live for exactly 24 hours. Others can like, comment, and share before it expires!
              </p>
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caption</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What techniques or filters did you use? Share your thoughts..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-purple-500" />
              Tags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  #{t}
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500 ml-0.5 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested quick tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Suggestions:</span>
              {suggestedTags.map((st) => (
                <button
                  key={st}
                  onClick={() => handleAddTag(st)}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                >
                  +{st}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Toggle: Public vs Private */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition ${
                  isPublic
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Public Post</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition ${
                  !isPublic
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Private (Only Me)</span>
              </button>
            </div>
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
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition shadow-md shadow-purple-500/25 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Publish 24h Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

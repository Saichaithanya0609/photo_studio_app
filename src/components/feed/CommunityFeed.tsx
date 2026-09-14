import React, { useState, useEffect } from 'react';
import { useFeed } from '../../context/FeedContext';
import type { EphemeralPost } from '../../types/editor';
import {
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Lock,
  Trash2,
  Send,
  Download,
  Check,
  Flame,
  Search,
  Plus
} from 'lucide-react';

interface CommunityFeedProps {
  onOpenPublish: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onOpenPublish }) => {
  const { posts, toggleLike, addComment, deletePost, getTimeRemaining } = useFeed();

  const [activeFilter, setActiveFilter] = useState<'public' | 'my_posts' | 'expiring_soon'>('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Force re-render every 30 seconds to update live timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async (post: EphemeralPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LuminaArt 24h Post by ${post.author.name}`,
          text: post.caption,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleDownloadPostImage = (imageUrl: string, authorName: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `lumina-story-${authorName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const rem = getTimeRemaining(post.expiresAt);
    if (rem.isExpired) return false;

    // Filter type
    if (activeFilter === 'public' && !post.isPublic) return false;
    if (activeFilter === 'my_posts' && post.author.username !== 'alex_r') return false;
    if (activeFilter === 'expiring_soon' && rem.hours >= 4) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = post.caption.toLowerCase().includes(q);
      const matchAuthor = post.author.name.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      return matchCaption || matchAuthor || matchTags;
    }

    return true;
  });

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-6 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top 24h Ephemeral Stories / Highlights Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Active 24h Moments
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Disappears strictly after 24 hrs
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Create Story trigger */}
            <div
              onClick={onOpenPublish}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-purple-500 flex items-center justify-center bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Your Story</span>
            </div>

            {/* Posts as Story rings */}
            {posts.slice(0, 8).map((post) => {
              const rem = getTimeRemaining(post.expiresAt);
              if (rem.isExpired) return null;
              const isUrgent = rem.hours < 4;

              return (
                <div
                  key={post.id}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-full p-0.5 border-2 transition-transform group-hover:scale-105 shadow-sm ${
                      isUrgent
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-gradient bg-gradient-to-tr from-pink-500 to-purple-500'
                    }`}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.author.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[64px] text-center">
                    {post.author.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold w-full sm:w-auto shadow-sm">
            <button
              onClick={() => setActiveFilter('public')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'public'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Public Feed
            </button>
            <button
              onClick={() => setActiveFilter('my_posts')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'my_posts'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              My Creations
            </button>
            <button
              onClick={() => setActiveFilter('expiring_soon')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                activeFilter === 'expiring_soon'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Expiring Soon</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-56 shadow-sm">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tag, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none w-full"
            />
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No active posts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Posts in this feed disappear automatically after 24 hours. Be the first to publish an edit or collage!
            </p>
            <button
              onClick={onOpenPublish}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition shadow-md shadow-purple-500/20"
            >
              Create New 24h Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const rem = getTimeRemaining(post.expiresAt);
              const isUrgent = rem.hours < 4;
              const isAuthor = post.author.username === 'alex_r';
              const isCommentsOpen = openCommentsPostId === post.id;

              return (
                <article
                  key={post.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* Card Header: Author info & Expiration Badge */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {post.author.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            @{post.author.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {post.isPublic ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Globe className="w-3 h-3" />
                              Public
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              <Lock className="w-3 h-3" />
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expiration Timer Badge */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm ${
                          isUrgent
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse'
                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {rem.hours}h {rem.minutes}m left
                        </span>
                      </div>

                      {isAuthor && (
                        <button
                          onClick={() => deletePost(post.id)}
                          title="Delete Post"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 24-Hour Expiration Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isUrgent ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${100 - rem.progressPercent}%` }}
                    />
                  </div>

                  {/* Image Display */}
                  <div className="relative bg-slate-950/90 flex items-center justify-center max-h-[540px] overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-auto max-h-[540px] object-contain block mx-auto select-none"
                    />
                  </div>

                  {/* Actions Row: Like, Comment, Share */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1.5 text-xs font-bold transition group"
                        >
                          <Heart
                            className={`w-5 h-5 transition-transform group-active:scale-125 ${
                              post.isLiked
                                ? 'fill-pink-500 text-pink-500'
                                : 'text-slate-600 dark:text-slate-400 hover:text-pink-500'
                            }`}
                          />
                          <span
                            className={
                              post.isLiked
                                ? 'text-pink-500'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {post.likes}
                          </span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() =>
                            setOpenCommentsPostId(isCommentsOpen ? null : post.id)
                          }
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 transition"
                        >
                          <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <span>{post.comments.length}</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 transition"
                        >
                          {copiedPostId === post.id ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          )}
                          <span>{copiedPostId === post.id ? 'Copied!' : 'Share'}</span>
                        </button>
                      </div>

                      {/* Download Image Button */}
                      <button
                        onClick={() => handleDownloadPostImage(post.imageUrl, post.author.name)}
                        title="Download photo"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Caption & Tags */}
                    <div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                        <span className="font-bold mr-1.5">{post.author.name}</span>
                        {post.caption}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comments Thread Section */}
                    {isCommentsOpen && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3 animate-in fade-in">
                        {/* List of comments */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {post.comments.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No comments yet. Be the first!</p>
                          ) : (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2 text-xs">
                                <img
                                  src={comment.avatar}
                                  alt={comment.author}
                                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl flex-1 border border-slate-200/60 dark:border-slate-700/60">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                      {comment.author}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(comment.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommentSubmit(post.id);
                            }}
                            className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

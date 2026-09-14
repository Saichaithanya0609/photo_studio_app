import React, { createContext, useContext, useEffect, useState } from 'react';
import type { EphemeralPost, PostComment } from '../types/editor';

interface FeedContextType {
  posts: EphemeralPost[];
  addPost: (imageUrl: string, caption: string, tags: string[], isPublic: boolean) => EphemeralPost;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deletePost: (postId: string) => void;
  getTimeRemaining: (expiresAt: number) => { hours: number; minutes: number; seconds: number; isExpired: boolean; progressPercent: number };
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const CURRENT_USER = {
  name: 'Alex Rivera',
  username: 'alex_r',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

// Initial simulated 24-hour ephemeral posts
const INITIAL_POSTS: EphemeralPost[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    caption: 'Processed with Sobel Edge & Histogram Equalization! The luminance contrast turned out surreal ✨',
    tags: ['DIP', 'Sobel', 'LuminaArt', 'Portrait'],
    author: {
      name: 'Maya Lin',
      username: 'mayacodes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    createdAt: Date.now() - 3 * 3600 * 1000, // 3 hours ago
    expiresAt: Date.now() + 21 * 3600 * 1000, // 21 hours left
    likes: 42,
    isLiked: false,
    isPublic: true,
    comments: [
      {
        id: 'c-1',
        author: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        text: 'The edge gradients on the silhouette look incredibly crisp!',
        createdAt: Date.now() - 2 * 3600 * 1000,
      },
      {
        id: 'c-2',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        text: 'Love the color palette! Did you use HSL equalization?',
        createdAt: Date.now() - 1 * 3600 * 1000,
      }
    ],
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    caption: 'Cyberpunk Tokyo street unblurred and sharpened with high-boost frequency deconvolution 🌃',
    tags: ['Tokyo', 'Unblur', 'Deblur', 'NightPhotography'],
    author: {
      name: 'Kenji Sato',
      username: 'kenji_tokyo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    createdAt: Date.now() - 19 * 3600 * 1000, // 19 hours ago
    expiresAt: Date.now() + 5 * 3600 * 1000, // 5 hours left (Expiring soon!)
    likes: 89,
    isLiked: true,
    isPublic: true,
    comments: [
      {
        id: 'c-3',
        author: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Expiring soon, glad I caught this! Beautiful neon reflection.',
        createdAt: Date.now() - 4 * 3600 * 1000,
      }
    ],
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    caption: 'Mountain range collage created with LuminaArt 2x2 grid layout 🏔️',
    tags: ['Collage', 'Nature', 'Mountains'],
    author: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: CURRENT_USER.avatar,
    },
    createdAt: Date.now() - 1 * 3600 * 1000,
    expiresAt: Date.now() + 23 * 3600 * 1000,
    likes: 15,
    isLiked: false,
    isPublic: true,
    comments: [],
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
    caption: 'Private work-in-progress: Golden eagle background replacement test 🦅',
    tags: ['WIP', 'Private', 'BackgroundRemover'],
    author: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: CURRENT_USER.avatar,
    },
    createdAt: Date.now() - 30 * 60 * 1000,
    expiresAt: Date.now() + 23.5 * 3600 * 1000,
    likes: 3,
    isLiked: false,
    isPublic: false, // Private post
    comments: [],
  }
];

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<EphemeralPost[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_feed_posts');
      if (saved) {
        const parsed: EphemeralPost[] = JSON.parse(saved);
        // Filter out expired posts immediately upon initialization
        const now = Date.now();
        const active = parsed.filter(p => p.expiresAt > now);
        return active.length > 0 ? active : INITIAL_POSTS;
      }
    } catch {
      // ignore
    }
    return INITIAL_POSTS;
  });

  // Periodically check and clean up expired posts (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPosts(prev => {
        const filtered = prev.filter(p => p.expiresAt > now);
        if (filtered.length !== prev.length) {
          localStorage.setItem('lumina_feed_posts', JSON.stringify(filtered));
        }
        return filtered;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lumina_feed_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (imageUrl: string, caption: string, tags: string[], isPublic: boolean): EphemeralPost => {
    const now = Date.now();
    const newPost: EphemeralPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl,
      caption,
      tags: tags.length > 0 ? tags : ['LuminaArt'],
      author: CURRENT_USER,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours exact lifespan
      likes: 0,
      isLiked: false,
      isPublic,
      comments: [],
    };

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const willLike = !p.isLiked;
        return {
          ...p,
          isLiked: willLike,
          likes: willLike ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: PostComment = {
      id: `c-${Date.now()}`,
      author: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      text: text.trim(),
      createdAt: Date.now(),
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const getTimeRemaining = (expiresAt: number) => {
    const totalMs = expiresAt - Date.now();
    if (totalMs <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true, progressPercent: 100 };
    }

    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 24 hours total = 86400 seconds
    const elapsedSeconds = 86400 - totalSeconds;
    const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / 86400) * 100));

    return { hours, minutes, seconds, isExpired: false, progressPercent };
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        addPost,
        toggleLike,
        addComment,
        deletePost,
        getTimeRemaining,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

'use client';

import React, { useEffect } from 'react';
import { X, Play, Image as ImageIcon } from 'lucide-react';
import type { CharityGalleryItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';

interface LightboxProps {
  item: CharityGalleryItem | null;
  onClose: () => void;
}

export default function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isVideo = item.mediaType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
        aria-label="Close Preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
        <div className="w-full flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {isVideo ? (
            item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be') ? (
              <div className="w-full aspect-video">
                <iframe
                  src={item.mediaUrl.replace('watch?v=', 'embed/')}
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={getFileUrl(item.mediaUrl)}
                controls
                autoPlay
                className="max-h-[75vh] w-auto max-w-full rounded-lg"
              />
            )
          ) : (
            <img
              src={getFileUrl(item.mediaUrl)}
              alt={item.title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
            />
          )}
        </div>

        {/* Caption bar */}
        <div className="w-full mt-4 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-2">
            {isVideo ? <Play className="w-3 h-3 fill-emerald-300" /> : <ImageIcon className="w-3 h-3" />}
            <span>{item.category || 'General'}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
          {item.caption && (
            <p className="text-sm text-slate-300 mt-1 max-w-2xl mx-auto">{item.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}

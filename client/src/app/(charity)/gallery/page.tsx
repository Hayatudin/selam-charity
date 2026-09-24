'use client';

import React, { useState, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Play, 
  Filter, 
  Sparkles, 
  Search,
  Maximize2
} from 'lucide-react';
import { useCharityGallery } from '@/hooks/charity';
import Lightbox from '@/components/charity/public/Lightbox';
import type { CharityGalleryItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';

const CATEGORIES = [
  'All',
  'Campus Life',
  'Academic',
  'Events',
  'Community',
  'Sports',
];

export default function CharityGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [activeMedia, setActiveMedia] = useState<CharityGalleryItem | null>(null);

  const { data: galleryItems = [], isLoading } = useCharityGallery({
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    mediaType: selectedType !== 'all' ? selectedType : undefined,
  });

  // Only actual items published from admin CMS
  const displayItems = galleryItems;

  return (
    <div className="flex flex-col w-full">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Showcase</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Photo &amp; Video Gallery
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Witness our campus life, educational milestones, and community impact in action.
          </p>
        </div>
      </section>

      {/* ── FILTER CONTROLS ─────────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Media Type Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
            {[
              { key: 'all', label: 'All Media' },
              { key: 'image', label: 'Photos' },
              { key: 'video', label: 'Videos' },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key as any)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  selectedType === type.key
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── GALLERY GRID ─────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {displayItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-sm">No media items found for the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item: CharityGalleryItem) => {
                const isVideo = item.mediaType === 'video';

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveMedia(item)}
                    className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                  >
                    <img
                      src={getFileUrl(item.thumbnailUrl || item.mediaUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Top tags */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/70 text-white backdrop-blur-md">
                        {item.category || 'General'}
                      </span>

                      {isVideo ? (
                        <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Bottom caption */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-base font-bold group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.caption && (
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox item={activeMedia} onClose={() => setActiveMedia(null)} />

    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Search, 
  ArrowRight, 
  Eye, 
  Tag, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useCharityNewsList } from '@/hooks/charity';
import type { CharityNewsItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';

const CATEGORIES = ['All', 'Education', 'Events', 'Community', 'Announcements'];

export default function CharityNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: newsItems = [], isLoading } = useCharityNewsList({
    status: 'published',
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    search: searchTerm.trim() || undefined,
  });

  // Only actual published news from admin CMS
  const articles: CharityNewsItem[] = newsItems;

  const isDefaultView = !searchTerm && selectedCategory === 'All';
  const featuredArticle = isDefaultView && articles.length > 0 ? articles[0] : null;
  const remainingArticles = isDefaultView ? articles.slice(1) : articles;

  return (
    <div className="flex flex-col w-full">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Updates &amp; Stories</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            News &amp; Organization Updates
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Stay informed on our educational initiatives, student achievements, and community development projects.
          </p>
        </div>
      </section>

      {/* ── SEARCH & CATEGORY BAR ───────────────────────────────── */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

        </div>
      </section>

      {/* ── NEWS CONTENT ─────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 1. FEATURED ARTICLE SPOTLIGHT */}
          {featuredArticle && !searchTerm && selectedCategory === 'All' && (
            <div className="mb-16">
              <div className="rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md grid lg:grid-cols-12 group hover:border-emerald-300 transition-all">
                <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden bg-slate-100">
                  <img
                    src={featuredArticle.featuredImageUrl ? getFileUrl(featuredArticle.featuredImageUrl) : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                      Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Tag className="w-3 h-3" />
                        {featuredArticle.category || 'General'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredArticle.publishedAt ? new Date(featuredArticle.publishedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      <Link href={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {featuredArticle.excerpt || featuredArticle.content.slice(0, 180) + '...'}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/news/${featuredArticle.slug || featuredArticle.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ARTICLES GRID */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Stories'}
            </h3>

            {articles.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-white border border-slate-200">
                <p className="text-slate-500 text-sm">No articles matched your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchTerm || selectedCategory !== 'All' ? articles : remainingArticles).map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={article.featuredImageUrl ? getFileUrl(article.featuredImageUrl) : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-md">
                          {article.category || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {article.viewCount || 0} views
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                          <Link href={`/news/${article.slug || article.id}`}>
                            {article.title}
                          </Link>
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {article.excerpt || article.content.slice(0, 140) + '...'}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t border-slate-100">
                        <Link
                          href={`/news/${article.slug || article.id}`}
                          className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

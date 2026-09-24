'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Calendar, 
  Eye, 
  ArrowLeft, 
  Share2, 
  Check, 
  Send, 
  Tag, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Loader2,
  User
} from 'lucide-react';

import { useCharityNewsItem, useCharityNewsList } from '@/hooks/charity';
import { getFileUrl } from '@/lib/utils';

export default function CharityNewsDetailsPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [copied, setCopied] = useState(false);

  const { data: article, isLoading, isError } = useCharityNewsItem(slug);
  const { data: allNews = [] } = useCharityNewsList({ status: 'published' });

  // Related news (exclude current article)
  const relatedNews = allNews
    .filter((n) => n.id !== article?.id && n.slug !== slug)
    .slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-36 pb-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-medium text-sm">Loading article...</p>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-36 pb-20 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          The news story you are looking for might have been moved, removed, or is currently unpublished.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All News</span>
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Read "${article.title}" on Selam Charity & School`;

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* ── BREADCRUMB & HEADER (With generous top clearance for floating navbar) ── */}
      <div className="bg-white border-b border-slate-200/80 pt-36 sm:pt-40 pb-10 sm:pb-12 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors mb-6 group"
          >
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span>Back to All News</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-5 font-medium">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {article.category || 'General'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'Recent'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.authorName || article.authorId || 'Selam Team'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.viewCount || 0} views</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium border-l-4 border-emerald-500 pl-4 py-1">
              {article.excerpt}
            </p>
          )}

        </div>
      </div>

      {/* ── FEATURED IMAGE & BODY ───────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Featured Image */}
        {article.featuredImageUrl && (
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 max-h-[500px]">
            <img
              src={getFileUrl(article.featuredImageUrl)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          {/* Social Share Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Share this story
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Share on X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>


              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Share on Telegram"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ── RELATED NEWS ────────────────────────────────────────── */}
        {relatedNews.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Related News &amp; Stories
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between p-5"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category || 'General'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-3 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      <Link href={`/news/${item.slug || item.id}`}>
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

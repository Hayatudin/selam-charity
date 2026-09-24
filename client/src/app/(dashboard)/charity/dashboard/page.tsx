'use client';

import React from 'react';
import Link from 'next/link';
import { useCharityDashboard } from '@/hooks/charity';
import { getFileUrl } from '@/lib/utils';
import {
  Newspaper,
  Images,
  FolderArchive,
  GraduationCap,
  Globe,
  ArrowRight,
  Plus,
  Loader2,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Landmark,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CharityDashboardPage() {
  const { data, isLoading } = useCharityDashboard();

  const stats = data?.stats;
  const recentNews = data?.recentNews || [];
  const recentUploads = data?.recentUploads || [];
  const recentDonations = data?.recentDonations || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles size={14} /> Selam Charity Administration Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              SELAM Charity Management Dashboard
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Verify donor receipts, publish news announcements, curate visual media galleries, organize school programs, and update core organizational content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {/* Current Charity Public Site Launcher */}
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/30 gap-2 font-semibold text-sm backdrop-blur-xs">
                <Globe size={16} className="text-emerald-300" /> Current Charity <ExternalLink size={14} />
              </Button>
            </Link>
            <Link href="/charity/donations">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-500/20 font-semibold text-sm">
                <Landmark size={16} /> Manage Donations
              </Button>
            </Link>
            <Link href="/charity/news">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 text-sm font-medium">
                <Plus size={16} /> New Article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Donations */}
        <Link href="/charity/donations" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Landmark size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {stats?.donations?.pending || 0} Pending
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Donations</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5 truncate">
            {stats?.donations?.totalAmountETB ? `${stats.donations.totalAmountETB.toLocaleString()} ETB` : '0 ETB'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            {stats?.donations?.total || 0} donations registered
          </p>
        </Link>

        {/* Card 2: News */}
        <Link href="/charity/news" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Newspaper size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {stats?.news.published || 0} Live
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">News Articles</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{stats?.news.total || 0}</h3>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-blue-500" />
            {((stats?.news.total || 0) - (stats?.news.published || 0))} drafts in review
          </p>
        </Link>

        {/* Card 3: Gallery */}
        <Link href="/charity/gallery" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Images size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {stats?.gallery.videos || 0} Videos
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gallery Media</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{stats?.gallery.total || 0}</h3>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {stats?.gallery.images || 0} photos in albums
          </p>
        </Link>

        {/* Card 4: Media Library */}
        <Link href="/charity/media" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderArchive size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
              Storage
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Media Library</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">{stats?.media.total || 0}</h3>
          <p className="text-[11px] text-slate-500 mt-1.5 truncate">
            {stats?.media.images || 0} images, {stats?.media.documents || 0} docs
          </p>
        </Link>

        {/* Card 5: School CMS */}
        <Link href="/charity/school" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-300 transition-all group block">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
              4 Modules
            </span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">School CMS</p>
          <h3 className="text-2xl font-black text-slate-800 mt-0.5">Active</h3>
          <p className="text-[11px] text-slate-500 mt-1.5 truncate">
            Programs, campus, facilities
          </p>
        </Link>
      </div>

      {/* Recent Donations & Bank Receipts Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Landmark size={18} className="text-emerald-600" /> Recent Donations & Receipts
            </h2>
            <p className="text-xs text-slate-500">Incoming community donations and bank deposit slip submissions</p>
          </div>
          <Link href="/charity/donations" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All Receipts <ArrowRight size={14} />
          </Link>
        </div>

        {recentDonations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p>No donations recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1">Donors can submit contributions via the public Donate page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-1 font-semibold">Donor</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Bank / Method</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right pr-1 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDonations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pl-1">
                      <p className="font-bold text-slate-800">{d.donorName}</p>
                      <p className="text-xs text-slate-400">{d.donorPhone || d.donorEmail || 'Direct'}</p>
                    </td>
                    <td className="py-3 font-bold text-slate-800">
                      {parseFloat(d.amount).toLocaleString()} {d.currency || 'ETB'}
                    </td>
                    <td className="py-3 text-xs text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                        {d.bankName || d.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status === 'verified' && <CheckCircle2 size={11} />}
                        {d.status === 'pending' && <Clock size={11} />}
                        {d.status === 'rejected' && <AlertCircle size={11} />}
                        {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-1">
                      <Link href="/charity/donations">
                        <Button variant="outline" className="text-xs h-7 px-2.5 border-slate-200 hover:bg-white text-slate-700">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Layout: Recent News & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent News (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent News & Announcements</h2>
              <p className="text-xs text-slate-500">Latest updates published or drafted for the website</p>
            </div>
            <Link href="/charity/news" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentNews.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No news articles created yet. Click 'New Article' to begin.
              </div>
            ) : (
              recentNews.map((article) => {
                const isPub = article.status === 'published';
                return (
                  <div
                    key={article.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {article.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isPub ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isPub ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {isPub ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate">{article.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <Link href={`/charity/news?edit=${article.id}`}>
                      <Button variant="outline" className="text-xs h-8 px-3 border-slate-200 hover:bg-white text-slate-700 shrink-0">
                        Edit
                      </Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Recent Media Uploads (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Media Uploads</h2>
              <p className="text-xs text-slate-500">Assets available in the central library</p>
            </div>
            <Link href="/charity/media" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Library <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
            {recentUploads.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-400 text-sm">
                No uploads in library yet.
              </div>
            ) : (
              recentUploads.map((item) => {
                const resolvedUrl = getFileUrl(item.url);
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-slate-100 overflow-hidden bg-slate-50 aspect-square flex flex-col shadow-2xs hover:shadow-xs"
                  >
                    {item.fileType === 'image' ? (
                      <img
                        src={resolvedUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-500">
                        <FolderArchive size={22} className="text-slate-400 mb-1" />
                        <span className="text-[10px] font-medium text-slate-600 truncate max-w-full text-center">{item.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/charity/gallery" className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Images size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
              Curate Gallery <ArrowUpRight size={14} />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Upload high-res photos and embed YouTube/social videos for the public gallery.</p>
          </div>
        </Link>

        <Link href="/charity/school" className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
              Manage School Content <ArrowUpRight size={14} />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Update Selam School programs, facilities, introduction text, and campus media.</p>
          </div>
        </Link>

        <Link href="/charity/pages" className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Globe size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
              Edit Static Pages <ArrowUpRight size={14} />
            </h4>
            <p className="text-xs text-slate-500 mt-1">Directly edit About Us, Mission & Vision, Contact addresses, and key organizational values.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

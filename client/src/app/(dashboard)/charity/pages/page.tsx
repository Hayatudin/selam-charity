'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePagesContent, useUpdatePageContent, useUploadMediaFile } from '@/hooks/charity';
import type { PageContentKey, PageContentData } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  Globe, 
  Compass, 
  Mail, 
  Building, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Loader2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import MediaPickerModal from '@/components/charity/MediaPickerModal';

const PAGES: { key: PageContentKey; label: string; icon: any; desc: string }[] = [
  { key: 'about', label: 'About Us', icon: Globe, desc: 'Organization background, founding history, and core identity' },
  { key: 'mission', label: 'Mission & Vision', icon: Compass, desc: 'Mission statement, long-term vision, and strategic focus pillars' },
  { key: 'contact', label: 'Contact Information', icon: Mail, desc: 'Official phone, email, physical headquarters, and social media' },
  { key: 'general', label: 'Organization Overview', icon: Building, desc: 'Legal registration, governance structure, and compliance information' },
];

export default function CharityPagesCMSPage() {
  const [activeTab, setActiveTab] = useState<PageContentKey>('about');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [metadata, setMetadata] = useState<any>({});

  const { data: allPages, isLoading } = usePagesContent();
  const updateMutation = useUpdatePageContent();
  const uploadMutation = useUploadMediaFile();

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const uploaded = await uploadMutation.mutateAsync(formData);
      if (uploaded && uploaded.url) {
        setBannerImageUrl(uploaded.url);
      }
    } catch (err: any) {
      alert('Failed to upload banner image: ' + err.message);
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (allPages && allPages[activeTab]) {
      const page = allPages[activeTab];
      setTitle(page.title || '');
      setSubtitle(page.subtitle || '');
      setContent(page.content || '');
      setBannerImageUrl(page.bannerImageUrl || '');
      setMetadata(page.metadata || {});
      setSavedSuccess(false);
    }
  }, [allPages, activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      await updateMutation.mutateAsync({
        pageKey: activeTab,
        data: {
          title,
          subtitle,
          content,
          bannerImageUrl,
          metadata,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save page: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Globe size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Static Pages CMS</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Update foundational organizational copy for About, Mission, Contact, and General Information.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/60 animate-fade-in">
            <CheckCircle2 size={14} /> Page changes saved!
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = activeTab === page.key;

            return (
              <button
                key={page.key}
                onClick={() => setActiveTab(page.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isActive
                    ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold ${isActive ? 'text-blue-950' : 'text-slate-800'}`}>
                    {page.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{page.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Main Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Page Heading *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Slogan</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-600"
                  />
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Header Banner Image</label>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {bannerImageUrl ? (
                        <img src={getFileUrl(bannerImageUrl)} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={18} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={uploadingBanner}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 gap-1.5 font-semibold"
                      >
                        {uploadingBanner ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploadingBanner ? 'Uploading...' : 'Upload from Device'}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMediaPickerOpen(true)}
                        className="text-xs h-8 px-3 border-slate-300"
                      >
                        Browse Library
                      </Button>
                      {bannerImageUrl && (
                        <button
                          type="button"
                          onClick={() => setBannerImageUrl('')}
                          className="text-[11px] text-red-500 hover:underline ml-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Narrative / Body</label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* Contact Specific Structured Fields */}
              {activeTab === 'contact' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Email</label>
                      <input
                        type="email"
                        value={metadata.email || ''}
                        onChange={(e) => setMetadata({ ...metadata, email: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Phone</label>
                      <input
                        type="text"
                        value={metadata.phone || ''}
                        onChange={(e) => setMetadata({ ...metadata, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Alternate Phone</label>
                      <input
                        type="text"
                        value={metadata.alternatePhone || ''}
                        onChange={(e) => setMetadata({ ...metadata, alternatePhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Office Working Hours</label>
                      <input
                        type="text"
                        value={metadata.officeHours || ''}
                        onChange={(e) => setMetadata({ ...metadata, officeHours: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={metadata.address || ''}
                        onChange={(e) => setMetadata({ ...metadata, address: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mission Specific Structured Fields */}
              {activeTab === 'mission' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Strategic Statements</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Mission Statement</label>
                      <textarea
                        rows={2}
                        value={metadata.missionStatement || ''}
                        onChange={(e) => setMetadata({ ...metadata, missionStatement: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Vision Statement</label>
                      <textarea
                        rows={2}
                        value={metadata.visionStatement || ''}
                        onChange={(e) => setMetadata({ ...metadata, visionStatement: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* About Specific Structured Fields */}
              {activeTab === 'about' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Organization Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Founded Year</label>
                      <input
                        type="number"
                        value={metadata.foundedYear || ''}
                        onChange={(e) => setMetadata({ ...metadata, foundedYear: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Headquarters</label>
                      <input
                        type="text"
                        value={metadata.headquarters || ''}
                        onChange={(e) => setMetadata({ ...metadata, headquarters: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold text-xs h-9 px-4"
                >
                  {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Page Content
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setBannerImageUrl(url)}
        fileTypeFilter="image"
        title="Select Page Banner Image"
      />
    </div>
  );
}

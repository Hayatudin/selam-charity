'use client';

import React, { useState, useRef } from 'react';
import { 
  useCharityMediaList, 
  useUploadMediaFile, 
  useUpdateMediaMetadata, 
  useDeleteCharityMedia 
} from '@/hooks/charity';
import type { CharityMediaItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  FolderArchive, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  X, 
  Loader2,
  Filter
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CharityMediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeType, setActiveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Detail Drawer / Modal
  const [selectedFile, setSelectedFile] = useState<CharityMediaItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCaption, setEditCaption] = useState('');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: mediaList, isLoading } = useCharityMediaList({
    fileType: activeType === 'all' ? undefined : activeType,
    search: searchTerm,
  });

  const uploadMutation = useUploadMediaFile();
  const updateMetadataMutation = useUpdateMediaMetadata();
  const deleteMutation = useDeleteCharityMedia();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        await uploadMutation.mutateAsync(formData);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload one or more files');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyLink = (item: CharityMediaItem) => {
    const fullUrl = getFileUrl(item.url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDetail = (item: CharityMediaItem) => {
    setSelectedFile(item);
    setEditName(item.name);
    setEditCaption(item.caption || '');
  };

  const handleSaveMetadata = async () => {
    if (!selectedFile) return;
    try {
      await updateMetadataMutation.mutateAsync({
        id: selectedFile.id,
        data: { name: editName, caption: editCaption },
      });
      setSelectedFile(null);
    } catch (err: any) {
      alert('Failed to update metadata: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file permanently?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FolderArchive size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Media & File Library</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store, preview, organize, and reuse assets across News, School, and Pages.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm font-semibold text-sm"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Toolbar: Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'image', label: 'Images' },
            { id: 'video', label: 'Videos' },
            { id: 'document', label: 'Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeType === tab.id
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by file name or caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Files Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[350px]">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : !mediaList || mediaList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <FolderArchive size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No media files found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Drag and drop images, documents, or videos above to populate your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const resolvedUrl = getFileUrl(item.url);
            const isImage = item.fileType === 'image';
            const isVideo = item.fileType === 'video';

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all flex flex-col aspect-square"
              >
                {/* Preview Thumbnail */}
                <div
                  onClick={() => handleOpenDetail(item)}
                  className="flex-1 relative cursor-pointer overflow-hidden bg-slate-100 flex items-center justify-center"
                >
                  {isImage ? (
                    <img
                      src={resolvedUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-2">
                      <Film size={32} className="text-slate-400 mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 uppercase">Video</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-2">
                      <FileText size={32} className="text-slate-400 mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 uppercase">Document</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 backdrop-blur-xs text-white uppercase">
                      {item.fileType}
                    </span>
                  </div>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition-colors shadow-sm"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                    title="Delete File"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Card Title Bottom */}
                <div
                  onClick={() => handleOpenDetail(item)}
                  className="p-2.5 bg-white border-t border-slate-100 cursor-pointer"
                >
                  <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>{formatFileSize(item.sizeBytes)}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* File Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Media File Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Media Preview Box */}
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center relative">
                {selectedFile.fileType === 'image' ? (
                  <img
                    src={getFileUrl(selectedFile.url)}
                    alt={selectedFile.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : selectedFile.fileType === 'video' ? (
                  <video src={getFileUrl(selectedFile.url)} controls className="max-h-full max-w-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <FileText size={48} className="text-slate-400 mb-2" />
                    <p className="text-xs font-semibold">{selectedFile.name}</p>
                  </div>
                )}
              </div>

              {/* Editable Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Editable Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Alt Text</label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Describe this asset..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Metadata Info Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">File Type:</span>
                  <span className="font-semibold uppercase">{selectedFile.fileType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size:</span>
                  <span className="font-semibold">{formatFileSize(selectedFile.sizeBytes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Name:</span>
                  <span className="font-semibold truncate max-w-xs">{selectedFile.originalName}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Resource URL:</span>
                  <button
                    onClick={() => handleCopyLink(selectedFile)}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === selectedFile.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === selectedFile.id ? 'Copied Link!' : 'Copy Direct URL'}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedFile.id)}
                className="text-red-600 hover:bg-red-50 border-red-200 text-xs"
              >
                <Trash2 size={14} className="mr-1" /> Delete Asset
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  Close
                </Button>
                <Button
                  onClick={handleSaveMetadata}
                  disabled={updateMetadataMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {updateMetadataMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

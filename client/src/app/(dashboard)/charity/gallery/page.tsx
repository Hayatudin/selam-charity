'use client';

import React, { useState, useRef } from 'react';
import { 
  useCharityGalleryList, 
  useCreateGalleryItem, 
  useBatchCreateGalleryItems,
  useUpdateGalleryItem, 
  useDeleteGalleryItem,
  useUploadMediaFile
} from '@/hooks/charity';
import type { CharityGalleryItem, GalleryMediaType } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  Images, 
  Plus, 
  Trash2, 
  Edit3, 
  Film, 
  Image as ImageIcon, 
  Play, 
  X, 
  Loader2, 
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import MediaPickerModal from '@/components/charity/MediaPickerModal';

const CATEGORIES = ['All', 'General', 'School Life', 'Community Relief', 'Health Outreach', 'Ceremonies'];

export default function CharityGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMediaType, setSelectedMediaType] = useState('all');

  // Multi-upload state
  const directMultiInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const singleThumbInputRef = useRef<HTMLInputElement>(null);

  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [singleUploading, setSingleUploading] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CharityGalleryItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formMediaType, setFormMediaType] = useState<GalleryMediaType>('image');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formOrderIndex, setFormOrderIndex] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Media Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'media' | 'thumbnail'>('media');

  // Lightbox Preview State
  const [previewItem, setPreviewItem] = useState<CharityGalleryItem | null>(null);

  const { data: galleryItems, isLoading } = useCharityGalleryList({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    mediaType: selectedMediaType,
  });

  const createMutation = useCreateGalleryItem();
  const batchCreateMutation = useBatchCreateGalleryItems();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const uploadMutation = useUploadMediaFile();

  // Direct multi-file upload from device
  const handleDirectMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsBatchUploading(true);
    setBatchProgress({ current: 0, total: fileList.length });
    setBatchSuccessMessage(null);

    const itemsToCreate: Partial<CharityGalleryItem>[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setBatchProgress({ current: i + 1, total: fileList.length });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        const uploaded = await uploadMutation.mutateAsync(formData);
        if (uploaded && uploaded.url) {
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          itemsToCreate.push({
            title: cleanTitle || 'Gallery Photo',
            caption: '',
            mediaType: 'image',
            mediaUrl: uploaded.url,
            category: selectedCategory === 'All' ? 'General' : selectedCategory,
            orderIndex: 0,
          });
        }
      }

      if (itemsToCreate.length > 0) {
        await batchCreateMutation.mutateAsync(itemsToCreate);
        setBatchSuccessMessage(`Successfully uploaded ${itemsToCreate.length} image${itemsToCreate.length > 1 ? 's' : ''} to gallery!`);
        setTimeout(() => setBatchSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error uploading files'));
    } finally {
      setIsBatchUploading(false);
      if (directMultiInputRef.current) directMultiInputRef.current.value = '';
    }
  };

  // Direct single file upload inside modal
  const handleModalSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSingleUploading(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const uploaded = await uploadMutation.mutateAsync(formData);
      if (uploaded && uploaded.url) {
        setFormMediaUrl(uploaded.url);
        if (!formTitle) {
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setFormTitle(cleanTitle);
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload image file');
    } finally {
      setSingleUploading(false);
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
    }
  };

  // Direct thumb upload inside modal
  const handleModalThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const uploaded = await uploadMutation.mutateAsync(formData);
      if (uploaded && uploaded.url) {
        setFormThumbnailUrl(uploaded.url);
      }
    } catch (err: any) {
      alert('Thumbnail upload failed: ' + err.message);
    } finally {
      if (singleThumbInputRef.current) singleThumbInputRef.current.value = '';
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCaption('');
    setFormCategory('General');
    setFormMediaType('image');
    setFormMediaUrl('');
    setFormThumbnailUrl('');
    setFormOrderIndex(0);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CharityGalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCaption(item.caption || '');
    setFormCategory(item.category);
    setFormMediaType(item.mediaType);
    setFormMediaUrl(item.mediaUrl);
    setFormThumbnailUrl(item.thumbnailUrl || '');
    setFormOrderIndex(item.orderIndex);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formMediaUrl.trim()) {
      setFormError('Media URL or image file is required');
      return;
    }

    const payload = {
      title: formTitle,
      caption: formCaption,
      category: formCategory,
      mediaType: formMediaType,
      mediaUrl: formMediaUrl,
      thumbnailUrl: formThumbnailUrl || undefined,
      orderIndex: formOrderIndex,
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save item');
    }
  };

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<CharityGalleryItem | null>(null);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      setItemToDelete(null);
    } catch (err: any) {
      alert('Failed to delete item: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hidden file inputs for direct device selection */}
      <input
        ref={directMultiInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleDirectMultiUpload}
        className="hidden"
      />
      <input
        ref={singleFileInputRef}
        type="file"
        accept={formMediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleModalSingleUpload}
        className="hidden"
      />
      <input
        ref={singleThumbInputRef}
        type="file"
        accept="image/*"
        onChange={handleModalThumbUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Images size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Media Gallery</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize photographic collections and video showcases for public visitors.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Direct Multi-Upload from Device */}
          <Button
            type="button"
            onClick={() => directMultiInputRef.current?.click()}
            disabled={isBatchUploading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm font-semibold text-sm"
          >
            {isBatchUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading {batchProgress.current} of {batchProgress.total}...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Upload Images</span>
              </>
            )}
          </Button>

          {/* Add Item with manual details/video */}
          <Button
            onClick={handleOpenCreate}
            variant="outline"
            className="border-slate-300 hover:bg-slate-50 text-slate-700 gap-1.5 font-semibold text-sm"
          >
            <Plus size={16} /> Add Video / Custom
          </Button>
        </div>
      </div>

      {/* Upload Notification Banner */}
      {batchSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{batchSuccessMessage}</span>
          </div>
          <button onClick={() => setBatchSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Media</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-4/3 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : !galleryItems || galleryItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Images size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No media items in this category</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">
            Upload photos from your computer or phone to showcase your organization's impactful work.
          </p>
          <Button
            type="button"
            onClick={() => directMultiInputRef.current?.click()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-semibold"
          >
            <Upload size={14} /> Upload Images Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => {
            const isVideo = item.mediaType === 'video';
            const resolvedMediaUrl = getFileUrl(item.mediaUrl);
            const resolvedThumb = item.thumbnailUrl ? getFileUrl(item.thumbnailUrl) : resolvedMediaUrl;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Media Container */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="aspect-4/3 relative bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {!isVideo ? (
                    <img
                      src={resolvedMediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : item.thumbnailUrl ? (
                    <img
                      src={resolvedThumb}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                      <Film size={36} />
                    </div>
                  )}

                  {/* Video Icon Badge */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={18} className="translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Category Chip */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white border border-white/20">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.title}</h4>
                    {item.caption && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.caption}</p>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-medium text-slate-400">
                      Order: #{item.orderIndex}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {editingItem ? 'Edit Gallery Item' : 'Add Media to Gallery'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramadan Food Distribution"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Media Type & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Media Type</label>
                  <select
                    value={formMediaType}
                    onChange={(e) => setFormMediaType(e.target.value as GalleryMediaType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media URL Input & Direct File Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {formMediaType === 'image' ? 'Image File / URL *' : 'Video File or YouTube URL *'}
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder={formMediaType === 'image' ? '/uploads/charity/images/... or URL' : 'https://youtube.com/watch?v=... or file URL'}
                      value={formMediaUrl}
                      onChange={(e) => setFormMediaUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                    />
                    
                    {/* Direct Device Chooser Button */}
                    <Button
                      type="button"
                      onClick={() => singleFileInputRef.current?.click()}
                      disabled={singleUploading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-3 shrink-0 gap-1.5 font-semibold"
                    >
                      {singleUploading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>{singleUploading ? 'Uploading...' : 'Choose File'}</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Directly select from your phone or computer</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPickerTarget('media');
                        setIsPickerOpen(true);
                      }}
                      className="text-amber-600 hover:text-amber-700 hover:underline font-medium"
                    >
                      Or browse media library
                    </button>
                  </div>

                  {/* Preview of selected image */}
                  {formMediaUrl && formMediaType === 'image' && (
                    <div className="mt-2 w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                      <img src={getFileUrl(formMediaUrl)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Thumbnail for Video */}
              {formMediaType === 'video' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Video Thumbnail Poster (optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Image URL for video cover..."
                      value={formThumbnailUrl}
                      onChange={(e) => setFormThumbnailUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-xs"
                    />
                    <Button
                      type="button"
                      onClick={() => singleThumbInputRef.current?.click()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs h-9 px-3 shrink-0 gap-1.5"
                    >
                      <Upload size={14} /> Choose Poster
                    </Button>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional brief description of what is shown..."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sort Order (Lower appears first)</label>
                <input
                  type="number"
                  value={formOrderIndex}
                  onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                  className="w-32 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || singleUploading}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Save Item'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="relative aspect-video flex items-center justify-center bg-black">
              {previewItem.mediaType === 'image' ? (
                <img
                  src={getFileUrl(previewItem.mediaUrl)}
                  alt={previewItem.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : previewItem.mediaUrl.includes('youtube.com') || previewItem.mediaUrl.includes('youtu.be') ? (
                <iframe
                  src={previewItem.mediaUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={getFileUrl(previewItem.mediaUrl)} controls className="max-h-full max-w-full" />
              )}
            </div>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{previewItem.title}</h3>
                {previewItem.caption && <p className="text-xs text-slate-400">{previewItem.caption}</p>}
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Media Item</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-900">&quot;{itemToDelete.title}&quot;</strong> from the gallery?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setItemToDelete(null)}
                disabled={deleteMutation.isPending}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          if (pickerTarget === 'media') {
            setFormMediaUrl(url);
          } else {
            setFormThumbnailUrl(url);
          }
        }}
        fileTypeFilter={pickerTarget === 'thumbnail' ? 'image' : formMediaType}
        title={pickerTarget === 'thumbnail' ? 'Choose Video Thumbnail' : 'Choose Media File'}
      />
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { useCharityMediaList, useUploadMediaFile } from '@/hooks/charity';
import type { CharityMediaItem, CharityFileType } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  X, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Check, 
  Loader2 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: CharityMediaItem) => void;
  fileTypeFilter?: CharityFileType;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  fileTypeFilter,
  title = 'Select Media File',
}: MediaPickerModalProps) {
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [filterType, setFilterType] = useState<string>(fileTypeFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<CharityMediaItem | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: mediaItems, isLoading } = useCharityMediaList({
    fileType: filterType === 'all' ? undefined : filterType,
    search: searchTerm,
  });

  const uploadMutation = useUploadMediaFile();

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    try {
      const uploaded = await uploadMutation.mutateAsync(formData);
      if (uploaded && uploaded.url) {
        onSelect(uploaded.url, uploaded);
        onClose();
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.url, selectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">Pick from existing media or upload new files</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Media Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload New
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {!fileTypeFilter && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[340px]">
          {activeTab === 'upload' ? (
            <div className="flex flex-col items-center justify-center h-full p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Upload size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">Click or drag file to upload</h4>
              <p className="text-xs text-slate-400 mb-5">Supported formats: JPG, PNG, WEBP, MP4, PDF, DOCX (Up to 100MB)</p>

              {uploadError && (
                <div className="mb-4 px-3 py-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {uploadError}
                </div>
              )}

              <input
                ref={modalFileInputRef}
                type="file"
                accept={fileTypeFilter === 'image' ? 'image/*' : fileTypeFilter === 'video' ? 'video/*' : undefined}
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                disabled={uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-sm"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Select File from Computer or Phone'}
              </Button>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 size={32} className="animate-spin text-emerald-600" />
                </div>
              ) : !mediaItems || mediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">No media found</p>
                  <p className="text-xs text-slate-400 mt-1">Upload files using the 'Upload New' tab above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const resolvedUrl = getFileUrl(item.url);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all aspect-video flex flex-col bg-slate-900/5 ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        {item.fileType === 'image' ? (
                          <img
                            src={resolvedUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : item.fileType === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2">
                            <Film size={28} className="text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-300 truncate max-w-full">{item.name}</span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-600 p-2">
                            <FileText size={28} className="text-slate-400 mb-1" />
                            <span className="text-[10px] font-medium text-slate-600 truncate max-w-full">{item.name}</span>
                          </div>
                        )}

                        {/* Selection Checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                            <Check size={14} />
                          </div>
                        )}

                        {/* Overlay Label */}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-[10px] font-medium text-white truncate drop-shadow-sm">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500 truncate max-w-sm">
            {selectedItem ? (
              <span className="font-semibold text-slate-700">Selected: {selectedItem.name}</span>
            ) : (
              'Click an item from the library to choose it'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

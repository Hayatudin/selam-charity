'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  useCharityNewsList, 
  useCreateCharityNews, 
  useUpdateCharityNews, 
  useTogglePublishNews, 
  useDeleteCharityNews,
  useUploadMediaFile
} from '@/hooks/charity';
import type { CharityNewsItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon, 
  Upload,
  X, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import MediaPickerModal from '@/components/charity/MediaPickerModal';

const CATEGORIES = [
  'All', 
  'Education', 
  'Community', 
  'Healthcare', 
  'Events', 
  'Culture', 
  'Science', 
  'Entertainment',
  'Stories',
  'Lifestyle',
  'General'
];

export default function CharityNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CharityNewsItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Education');
  const [formAuthorName, setFormAuthorName] = useState('Selam Team');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFeaturedImage, setFormFeaturedImage] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('published');
  const [formError, setFormError] = useState<string | null>(null);

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

  // Delete confirm state
  const [articleToDelete, setArticleToDelete] = useState<CharityNewsItem | null>(null);

  const { data: newsList, isLoading } = useCharityNewsList({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    status: selectedStatus,
    search: searchTerm,
  });

  const createMutation = useCreateCharityNews();
  const updateMutation = useUpdateCharityNews();
  const togglePublishMutation = useTogglePublishNews();
  const deleteMutation = useDeleteCharityNews();
  const uploadMutation = useUploadMediaFile();

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFeaturedImage(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const uploaded = await uploadMutation.mutateAsync(formData);
      if (uploaded && uploaded.url) {
        setFormFeaturedImage(uploaded.url);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload featured image');
    } finally {
      setUploadingFeaturedImage(false);
      if (featuredImageInputRef.current) featuredImageInputRef.current.value = '';
    }
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Education');
    setFormAuthorName('Selam Team');
    setFormExcerpt('');
    setFormContent('');
    setFormFeaturedImage('');
    setFormStatus('published');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: CharityNewsItem) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormSlug(article.slug);
    setFormCategory(article.category);
    setFormAuthorName(article.authorName || article.authorId || 'Selam Team');
    setFormExcerpt(article.excerpt || '');
    setFormContent(article.content);
    setFormFeaturedImage(article.featuredImageUrl || '');
    setFormStatus(article.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Article title is required');
      return;
    }
    if (!formContent.trim()) {
      setFormError('Article content is required');
      return;
    }

    setFormError(null);

    const payload = {
      title: formTitle,
      slug: formSlug,
      category: formCategory,
      authorName: formAuthorName.trim() || 'Selam Team',
      authorId: formAuthorName.trim() || 'Selam Team',
      excerpt: formExcerpt,
      content: formContent,
      featuredImageUrl: formFeaturedImage,
      status: formStatus,
    };

    try {
      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save article');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await togglePublishMutation.mutateAsync(id);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      await deleteMutation.mutateAsync(articleToDelete.id);
      setArticleToDelete(null);
    } catch (err: any) {
      alert('Failed to delete article: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Newspaper size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-800">News & Announcements</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, curate, and publish stories and community press releases.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm font-semibold text-sm"
        >
          <Plus size={16} /> Create Article
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* News Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : !newsList || newsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Newspaper size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No articles found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search terms or category filter.'
                : 'Click the "Create Article" button to publish your first charity story.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {newsList.map((article) => {
                  const isPub = article.status === 'published';
                  const imgUrl = article.featuredImageUrl ? getFileUrl(article.featuredImageUrl) : null;

                  return (
                    <tr key={article.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Title & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                            {imgUrl ? (
                              <img src={imgUrl} alt={article.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                              {article.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">/{article.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                          {article.category}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(article.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {isPub ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {isPub ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Eye size={12} />
                          <span>{article.viewCount}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(article)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit article"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(article)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {editingArticle ? 'Edit News Article' : 'Create New Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
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
                  placeholder="e.g. Annual School Scholarship Program Launched"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sister Fatima or Selam Team"
                  value={formAuthorName}
                  onChange={(e) => setFormAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder="auto-generated-from-title"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Featured Image Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Featured Image</label>
                <input
                  ref={featuredImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {formFeaturedImage ? (
                      <img
                        src={getFileUrl(formFeaturedImage)}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => featuredImageInputRef.current?.click()}
                        disabled={uploadingFeaturedImage}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 gap-1.5 font-semibold"
                      >
                        {uploadingFeaturedImage ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploadingFeaturedImage ? 'Uploading...' : 'Upload from Device'}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="text-xs h-8 px-3 text-slate-700 border-slate-300"
                      >
                        Browse Library
                      </Button>
                    </div>
                    {formFeaturedImage && (
                      <button
                        type="button"
                        onClick={() => setFormFeaturedImage('')}
                        className="block text-[11px] text-red-500 hover:underline"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Excerpt / Summary (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short brief of this story for article previews..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Main Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Content *</label>
                <textarea
                  rows={7}
                  required
                  placeholder="Write the full story details, quotes, and impact..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-slate-700"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingArticle ? (
                    'Save Changes'
                  ) : (
                    'Publish Article'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Article</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-900">&quot;{articleToDelete.title}&quot;</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setArticleToDelete(null)}
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

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormFeaturedImage(url)}
        fileTypeFilter="image"
        title="Select Featured Article Image"
      />
    </div>
  );
}

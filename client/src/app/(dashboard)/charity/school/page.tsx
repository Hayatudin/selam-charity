'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSchoolSections, useUpdateSchoolSection, useUploadMediaFile } from '@/hooks/charity';
import type { SchoolSectionKey, SchoolSectionData } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';
import { 
  GraduationCap, 
  BookOpen, 
  Activity, 
  Building2, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  X, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import MediaPickerModal from '@/components/charity/MediaPickerModal';

const SECTIONS: { key: SchoolSectionKey; label: string; icon: any; desc: string }[] = [
  { key: 'intro', label: 'School Introduction', icon: GraduationCap, desc: 'Overview, welcome statement, and foundational school statistics' },
  { key: 'programs', label: 'Academic Programs', icon: BookOpen, desc: 'Curriculum tiers, levels (KG to Grade 8), and tutoring options' },
  { key: 'activities', label: 'Activities & Clubs', icon: Activity, desc: 'Sports, debate, arts, leadership clubs, and cultural schedules' },
  { key: 'facilities', label: 'Campus Facilities', icon: Building2, desc: 'Classrooms, laboratory, library, playground, and dining hall' },
];

export default function CharitySchoolCMSPage() {
  const [activeTab, setActiveTab] = useState<SchoolSectionKey>('intro');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const schoolMediaInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSchoolMedia, setUploadingSchoolMedia] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>({});

  const { data: allSections, isLoading } = useSchoolSections();
  const updateMutation = useUpdateSchoolSection();
  const uploadMutation = useUploadMediaFile();

  const handleSchoolMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingSchoolMedia(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        const uploaded = await uploadMutation.mutateAsync(formData);
        if (uploaded && uploaded.url) {
          newUrls.push(uploaded.url);
        }
      }
      if (newUrls.length > 0) {
        setMediaUrls((prev) => [...prev, ...newUrls]);
      }
    } catch (err: any) {
      alert('Failed to upload images: ' + err.message);
    } finally {
      setUploadingSchoolMedia(false);
      if (schoolMediaInputRef.current) schoolMediaInputRef.current.value = '';
    }
  };

  // Populate form when tab changes or data loads
  useEffect(() => {
    if (allSections && allSections[activeTab]) {
      const sec = allSections[activeTab];
      setTitle(sec.title || '');
      setSubtitle(sec.subtitle || '');
      setContent(sec.content || '');
      setMediaUrls(sec.mediaUrls || []);
      setMetadata(sec.metadata || {});
      setSavedSuccess(false);
    }
  }, [allSections, activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      await updateMutation.mutateAsync({
        sectionKey: activeTab,
        data: {
          title,
          subtitle,
          content,
          mediaUrls,
          metadata,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save section: ' + err.message);
    }
  };

  const handleAddMedia = (url: string) => {
    if (!mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  // Structured Metadata Handlers
  const handleAddProgram = () => {
    const list = metadata.programsList || [];
    setMetadata({
      ...metadata,
      programsList: [...list, { name: 'New Program', description: 'Program description...' }],
    });
  };

  const handleUpdateProgram = (index: number, field: string, val: string) => {
    const list = [...(metadata.programsList || [])];
    list[index] = { ...list[index], [field]: val };
    setMetadata({ ...metadata, programsList: list });
  };

  const handleRemoveProgram = (index: number) => {
    const list = (metadata.programsList || []).filter((_: any, i: number) => i !== index);
    setMetadata({ ...metadata, programsList: list });
  };

  const handleAddActivity = () => {
    const list = metadata.activitiesList || [];
    setMetadata({
      ...metadata,
      activitiesList: [...list, { name: 'New Activity', schedule: 'Weekly' }],
    });
  };

  const handleUpdateActivity = (index: number, field: string, val: string) => {
    const list = [...(metadata.activitiesList || [])];
    list[index] = { ...list[index], [field]: val };
    setMetadata({ ...metadata, activitiesList: list });
  };

  const handleRemoveActivity = (index: number) => {
    const list = (metadata.activitiesList || []).filter((_: any, i: number) => i !== index);
    setMetadata({ ...metadata, activitiesList: list });
  };

  const handleAddFacility = () => {
    const list = metadata.facilitiesList || [];
    setMetadata({
      ...metadata,
      facilitiesList: [...list, { name: 'New Facility', description: 'Facility details...' }],
    });
  };

  const handleUpdateFacility = (index: number, field: string, val: string) => {
    const list = [...(metadata.facilitiesList || [])];
    list[index] = { ...list[index], [field]: val };
    setMetadata({ ...metadata, facilitiesList: list });
  };

  const handleRemoveFacility = (index: number) => {
    const list = (metadata.facilitiesList || []).filter((_: any, i: number) => i !== index);
    setMetadata({ ...metadata, facilitiesList: list });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-100 text-violet-700">
              <GraduationCap size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-800">School Content CMS</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage public website content for Selam School programs, campus facilities, and activities.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/60 animate-fade-in">
            <CheckCircle2 size={14} /> Section saved successfully!
          </div>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Tabs Column (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.key;

            return (
              <button
                key={sec.key}
                onClick={() => setActiveTab(sec.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isActive
                    ? 'bg-white border-violet-500 ring-2 ring-violet-500/20 shadow-sm'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isActive ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold ${isActive ? 'text-violet-900' : 'text-slate-800'}`}>
                    {sec.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{sec.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Editor Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Narrative Content</label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-slate-700 font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* Media Gallery Attachments */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <input
                  ref={schoolMediaInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSchoolMediaUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Attached Images & Media</label>
                    <p className="text-[11px] text-slate-400">Photos displayed alongside this school section</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => schoolMediaInputRef.current?.click()}
                      disabled={uploadingSchoolMedia}
                      className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 px-3 gap-1.5 font-semibold"
                    >
                      {uploadingSchoolMedia ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>{uploadingSchoolMedia ? 'Uploading...' : 'Upload from Device'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMediaPickerOpen(true)}
                      className="text-xs h-8 px-3 border-slate-300"
                    >
                      Browse Library
                    </Button>
                  </div>
                </div>

                {mediaUrls.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-xs text-slate-400">
                    No images attached. Click 'Add Image' to select photos from the library.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {mediaUrls.map((url, i) => (
                      <div key={i} className="relative rounded-xl border border-slate-200 overflow-hidden aspect-video group">
                        <img src={getFileUrl(url)} alt="Attached" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(i)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tab-Specific Structured Lists */}
              {activeTab === 'programs' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">Curriculum & Programs List</label>
                      <p className="text-[11px] text-slate-400">Structured grade and educational programs</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleAddProgram} className="text-xs h-8 px-2.5">
                      <Plus size={14} className="mr-1" /> Add Program
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {(metadata.programsList || []).map((prog: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Program Name"
                            value={prog.name}
                            onChange={(e) => handleUpdateProgram(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Brief Description"
                            value={prog.description}
                            onChange={(e) => handleUpdateProgram(idx, 'description', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProgram(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">Student Clubs & Activities</label>
                      <p className="text-[11px] text-slate-400">Co-curricular groups and schedules</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleAddActivity} className="text-xs h-8 px-2.5">
                      <Plus size={14} className="mr-1" /> Add Club
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {(metadata.activitiesList || []).map((act: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Activity / Club Name"
                            value={act.name}
                            onChange={(e) => handleUpdateActivity(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Schedule (e.g. Tuesdays & Fridays)"
                            value={act.schedule}
                            onChange={(e) => handleUpdateActivity(idx, 'schedule', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">Campus Facilities</label>
                      <p className="text-[11px] text-slate-400">Key spaces, labs, and amenities</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleAddFacility} className="text-xs h-8 px-2.5">
                      <Plus size={14} className="mr-1" /> Add Facility
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {(metadata.facilitiesList || []).map((fac: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Facility Name (e.g. ICT Lab)"
                            value={fac.name}
                            onChange={(e) => handleUpdateFacility(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Features and description..."
                            value={fac.description}
                            onChange={(e) => handleUpdateFacility(idx, 'description', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'intro' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Student Capacity</label>
                    <input
                      type="number"
                      value={metadata.studentCapacity || ''}
                      onChange={(e) => setMetadata({ ...metadata, studentCapacity: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Teacher Count</label>
                    <input
                      type="number"
                      value={metadata.teacherCount || ''}
                      onChange={(e) => setMetadata({ ...metadata, teacherCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Est. Year</label>
                    <input
                      type="number"
                      value={metadata.establishedYear || ''}
                      onChange={(e) => setMetadata({ ...metadata, establishedYear: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Grades Covered</label>
                    <input
                      type="text"
                      value={metadata.gradesCovered || ''}
                      onChange={(e) => setMetadata({ ...metadata, gradesCovered: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-2 font-semibold text-xs h-9 px-4"
                >
                  {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Section Content
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
        onSelect={(url) => handleAddMedia(url)}
        fileTypeFilter="image"
        title="Add Image to School Section"
      />
    </div>
  );
}

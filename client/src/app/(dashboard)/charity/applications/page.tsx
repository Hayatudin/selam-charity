'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Download, 
  Trash2, 
  ExternalLink, 
  GraduationCap, 
  Building2, 
  User, 
  Calendar, 
  Briefcase, 
  Award, 
  X, 
  Loader2, 
  AlertCircle,
  Save
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface ScholarshipAppRow {
  id: string;
  applicationNumber: string;
  fullName: string;
  gender: string;
  placeOfBirth?: string | null;
  dateOfBirth: string;
  contactAddress: string;
  phoneNumber: string;
  email?: string | null;
  nationalIdNumber?: string | null;
  employer: string;
  jobTitle: string;
  department?: string | null;
  employmentType?: string | null;
  workLocation: string;
  yearsOfService: string;
  highestEducation: string;
  undergraduateUniversity: string;
  undergraduateField: string;
  undergraduateCgpa: string;
  graduationYear: string;
  targetDegree: string;
  targetUniversity: string;
  targetField: string;
  enrollmentStatus?: string | null;
  programDuration?: string | null;
  academicYear?: string | null;
  scholarshipType?: string | null;
  requestedAmount?: string | null;
  motivationStatement?: string | null;
  communityImpact?: string | null;
  hasCostSharing: boolean;
  costSharingDocRef?: string | null;
  documentUrl?: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export default function ScholarshipApplicationsAdminPage() {
  const { t, isRTL } = useLanguage();
  const [applications, setApplications] = useState<ScholarshipAppRow[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedApp, setSelectedApp] = useState<ScholarshipAppRow | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedStatus !== 'all') queryParams.append('status', selectedStatus);
      if (selectedDegree !== 'all') queryParams.append('degree', selectedDegree);
      if (search.trim()) queryParams.append('search', search.trim());

      const res = await api(`/api/charity/applications?${queryParams.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApplications(data.applications || []);
      if (data.stats) setStats(data.stats);
    } catch {
      showToast('Failed to load scholarship applications', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedDegree, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenReview = (app: ScholarshipAppRow) => {
    setSelectedApp(app);
    setReviewStatus(app.status);
    setReviewNotes(app.adminNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setIsUpdating(true);
    try {
      const res = await api(`/api/charity/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewStatus,
          adminNotes: reviewNotes,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      showToast(t('Application review updated', 'تم تحديث مراجعة الطلب بنجاح'));
      setSelectedApp(prev => (prev ? { ...prev, status: reviewStatus as any, adminNotes: reviewNotes } : null));
      fetchApplications();
    } catch {
      showToast(t('Failed to update status', 'فشل تحديث الحالة'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('Are you sure you want to delete this scholarship application?', 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟'))) return;
    try {
      const res = await api(`/api/charity/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast(t('Application deleted', 'تم حذف الطلب'));
      if (selectedApp?.id === id) setSelectedApp(null);
      fetchApplications();
    } catch {
      showToast(t('Failed to delete application', 'فشل حذف الطلب'), 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} />{t('Approved', 'تمت الموافقة')}</span>;
      case 'under_review':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200"><Clock size={12} />{t('Under Review', 'قيد المراجعة')}</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200"><XCircle size={12} />{t('Rejected', 'مرفوض')}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} />{t('Pending', 'قيد الانتظار')}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1964d2]">
              <FileText size={22} />
            </div>
            {t('Scholarship Applications', 'طلبات المنح الدراسية')}
          </h1>
          <p className="text-slate-500 mt-1 ml-12 rtl:ml-0 rtl:mr-12 text-sm">
            {t('Review and manage postgraduate scholarship applications from civil servants and government employees.', 'مراجعة وإدارة طلبات المنح الدراسية للدراسات العليا المقدمة من موظفي القطاع الحكومي.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer"
            title={t('Refresh', 'تحديث')}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t('Total Applications', 'إجمالي الطلبات')}</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.total || 0}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">{t('Pending Review', 'قيد الانتظار')}</span>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pending || 0}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">{t('Under Review', 'قيد المراجعة')}</span>
          <h3 className="text-2xl font-black text-blue-600 mt-1">{stats.under_review || 0}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">{t('Approved', 'المقبولة')}</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.approved || 0}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">{t('Rejected', 'المرفوضة')}</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.rejected || 0}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('Search by name, phone, or application #…', 'البحث بالاسم، الهاتف، أو رقم الطلب...')}
            className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">{t('All Statuses', 'جميع الحالات')}</option>
            <option value="pending">{t('Pending', 'قيد الانتظار')}</option>
            <option value="under_review">{t('Under Review', 'قيد المراجعة')}</option>
            <option value="approved">{t('Approved', 'مقبول')}</option>
            <option value="rejected">{t('Rejected', 'مرفوض')}</option>
          </select>

          {/* Degree Filter */}
          <select
            value={selectedDegree}
            onChange={e => setSelectedDegree(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">{t('All Degrees', 'كافة الدرجات')}</option>
            <option value="master">{t("Master's Programs", 'برامج الماجستير')}</option>
            <option value="phd">{t('PhD Programs', 'برامج الدكتوراه')}</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                <th className="px-6 py-4 font-semibold">{t('Applicant', 'المتقدم')}</th>
                <th className="px-6 py-4 font-semibold">{t('Target Program', 'البرنامج والجامعة')}</th>
                <th className="px-6 py-4 font-semibold">{t('Employer / Service', 'جهة العمل والخدمة')}</th>
                <th className="px-6 py-4 font-semibold">{t('CGPA', 'المعدل')}</th>
                <th className="px-6 py-4 font-semibold">{t('Status', 'الحالة')}</th>
                <th className="px-6 py-4 font-semibold hidden lg:table-cell">{t('Submitted', 'تاريخ التقديم')}</th>
                <th className="px-6 py-4 text-right rtl:text-left pr-6 rtl:pr-0 rtl:pl-6 font-semibold">{t('Actions', 'الإجراءات')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={30} className="text-[#1964d2] animate-spin" />
                      <p className="text-xs font-medium text-slate-400">{t('Loading applications...', 'جاري تحميل الطلبات...')}</p>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    {t('No scholarship applications found matching criteria.', 'لم يتم العثور على أي طلبات منحة تطابق البحث.')}
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Applicant */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1964d2] font-bold text-sm flex items-center justify-center shrink-0">
                          {app.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{app.fullName}</p>
                          <p className="text-xs text-slate-400 font-mono">{app.applicationNumber}</p>
                          <p className="text-xs text-slate-500">{app.phoneNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Program */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 text-sm">{app.targetDegree}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{app.targetField}</p>
                      <p className="text-[11px] text-blue-600 font-medium">{app.targetUniversity}</p>
                    </td>

                    {/* Employer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800 text-xs">{app.employer}</p>
                      <p className="text-xs text-slate-400">{app.jobTitle}</p>
                      <p className="text-[11px] text-slate-500">{app.yearsOfService} {t('service', 'خدمة')}</p>
                    </td>

                    {/* CGPA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs">
                        {app.undergraduateCgpa}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{app.graduationYear}</p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 hidden lg:table-cell">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left pr-6 rtl:pr-0 rtl:pl-6">
                      <div className="flex items-center justify-end gap-2">
                        {app.documentUrl && (
                          <a
                            href={app.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title={t('Download Combined PDF', 'تحميل المستندات')}
                          >
                            <Download size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenReview(app)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1964d2] hover:bg-blue-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>{t('Review', 'مراجعة')}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title={t('Delete Application', 'حذف الطلب')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
          <span>{t('Total Applications:', 'إجمالي الطلبات:')} {applications.length}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DETAILED REVIEW SLIDE-OVER / MODAL
          ══════════════════════════════════════════════════════════════ */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedApp(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1964d2] flex items-center justify-center font-bold">
                  {selectedApp.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedApp.fullName}</h2>
                  <p className="text-xs text-slate-500 font-mono">{selectedApp.applicationNumber} • {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              
              {/* Review Status & Actions Bar */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-bold uppercase text-slate-500">{t('Decision Status:', 'قرار اللجنة:')}</span>
                  <select
                    value={reviewStatus}
                    onChange={e => setReviewStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="pending">{t('Pending Review', 'قيد الانتظار')}</option>
                    <option value="under_review">{t('Under Review', 'قيد المراجعة والتدقيق')}</option>
                    <option value="approved">{t('Approved', 'موافقة على المنحة')}</option>
                    <option value="rejected">{t('Rejected', 'رفض الطلب')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {selectedApp.documentUrl && (
                    <a
                      href={selectedApp.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download size={14} />
                      <span>{t('View Merged PDF', 'عرض ملف PDF')}</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  )}

                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl bg-[#185a3a] text-white text-xs font-bold hover:bg-[#12422a] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{t('Save Review', 'حفظ القرار')}</span>
                  </button>
                </div>
              </div>

              {/* Committee Notes Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('Committee / Admin Notes', 'ملاحظات وتوصيات اللجنة')}
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder={t('Add internal notes regarding document verification, eligibility checks, or interview results...', 'أضف ملاحظات داخلية حول مراجعة الأوراق، التحقق من الأهلية...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 6 Sections Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Personal Details */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] flex items-center gap-1.5 mb-2">
                    <User size={15} /> {t('1. Personal Details', '1. البيانات الشخصية')}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 font-medium">{t('Gender:', 'الجنس:')}</span> <span className="font-bold text-slate-800">{selectedApp.gender}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Date of Birth:', 'تاريخ الميلاد:')}</span> <span className="font-bold text-slate-800">{selectedApp.dateOfBirth}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Place of Birth:', 'مكان الميلاد:')}</span> <span className="text-slate-800">{selectedApp.placeOfBirth || '—'}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Contact Address:', 'العنوان:')}</span> <span className="text-slate-800">{selectedApp.contactAddress}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Phone:', 'الهاتف:')}</span> <span className="font-bold text-slate-800">{selectedApp.phoneNumber}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Email:', 'البريد:')}</span> <span className="text-slate-800">{selectedApp.email || '—'}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('National ID:', 'رقم الهوية:')}</span> <span className="font-mono text-slate-800">{selectedApp.nationalIdNumber || '—'}</span></p>
                  </div>
                </div>

                {/* 2. Employment Details */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] flex items-center gap-1.5 mb-2">
                    <Briefcase size={15} /> {t('2. Employment Details', '2. بيانات العمل')}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 font-medium">{t('Employer:', 'جهة العمل:')}</span> <span className="font-bold text-slate-800">{selectedApp.employer}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Job Title:', 'المسمى:')}</span> <span className="font-bold text-slate-800">{selectedApp.jobTitle}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Department:', 'القسم:')}</span> <span className="text-slate-800">{selectedApp.department || '—'}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Employment Type:', 'نوع التوظيف:')}</span> <span className="text-slate-800">{selectedApp.employmentType}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Work City:', 'المدينة:')}</span> <span className="text-slate-800">{selectedApp.workLocation}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Years of Service:', 'سنوات الخدمة:')}</span> <span className="font-bold text-slate-800">{selectedApp.yearsOfService}</span></p>
                  </div>
                </div>

                {/* 3. Educational Background */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] flex items-center gap-1.5 mb-2">
                    <GraduationCap size={15} /> {t('3. Educational Background', '3. المؤهل السابق')}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 font-medium">{t('Highest Education:', 'أعلى مؤهل:')}</span> <span className="font-bold text-slate-800">{selectedApp.highestEducation}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Undergraduate University:', 'الجامعة:')}</span> <span className="font-bold text-slate-800">{selectedApp.undergraduateUniversity}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Field of Study:', 'التخصص:')}</span> <span className="text-slate-800">{selectedApp.undergraduateField}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Cumulative CGPA:', 'المعدل:')}</span> <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{selectedApp.undergraduateCgpa}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Graduation Year:', 'سنة التخرج:')}</span> <span className="text-slate-800">{selectedApp.graduationYear}</span></p>
                  </div>
                </div>

                {/* 4. Target Study Program */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] flex items-center gap-1.5 mb-2">
                    <Building2 size={15} /> {t('4. Target Study Program', '4. البرنامج المطلوب')}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 font-medium">{t('Target Degree:', 'الدرجة:')}</span> <span className="font-bold text-slate-800">{selectedApp.targetDegree}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('University:', 'الجامعة الحكومية:')}</span> <span className="font-bold text-slate-800">{selectedApp.targetUniversity}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Specialization:', 'التخصص:')}</span> <span className="text-slate-800">{selectedApp.targetField}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Enrollment Status:', 'حالة القبول:')}</span> <span className="text-slate-800">{selectedApp.enrollmentStatus}</span></p>
                    <p><span className="text-slate-400 font-medium">{t('Duration / Year:', 'المدة / العام:')}</span> <span className="text-slate-800">{selectedApp.programDuration} • {selectedApp.academicYear}</span></p>
                  </div>
                </div>

              </div>

              {/* 5. Motivation & Impact Statement */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] flex items-center gap-1.5">
                  <Award size={15} /> {t('5. Scholarship Request & Motivation', '5. دوافع التقديم والأثر المجتمعي')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">{t('Personal Motivation Statement:', 'خطاب الدوافع الشخصية:')}</span>
                    <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {selectedApp.motivationStatement || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">{t('Community Impact & Service Plan:', 'خطة الأثر المجتمعي:')}</span>
                    <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {selectedApp.communityImpact || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6. Cost Sharing & Documents */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1964d2] mb-1">
                    {t('6. Cost Sharing & Uploaded PDF', '6. تقاسم التكاليف والمستندات')}
                  </h3>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-400">{t('Cost Sharing Obligation:', 'تقاسم التكاليف:')}</span>{' '}
                    <span className="font-bold">{selectedApp.hasCostSharing ? t('Yes', 'نعم') : t('No', 'لا')}</span>
                    {selectedApp.costSharingDocRef && ` (${selectedApp.costSharingDocRef})`}
                  </p>
                </div>
                {selectedApp.documentUrl && (
                  <a
                    href={selectedApp.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#1964d2] text-white font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1553b0] transition-colors"
                  >
                    <Download size={14} />
                    <span>{t('Open Application PDF', 'فتح ملف الـ PDF')}</span>
                  </a>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60 text-xs">
              <span className="text-slate-400">
                {selectedApp.reviewedBy && `${t('Last reviewed by:', 'آخر مراجعة:')} ${selectedApp.reviewedBy}`}
              </span>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {t('Close', 'إغلاق')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50">
          <div className={cn(
            'flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-sm',
            toast.type === 'success' ? 'bg-slate-900' : 'bg-red-600'
          )}>
            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

    </div>
  );
}

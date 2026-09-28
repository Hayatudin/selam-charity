'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  HelpCircle,
  Home,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

const STEPS = [
  { id: 1, name: 'Personal', label: 'Personal Detail', labelAr: 'البيانات الشخصية' },
  { id: 2, name: 'Employment', label: 'Employment Details', labelAr: 'بيانات العمل والوظيفة' },
  { id: 3, name: 'Education', label: 'Educational Background', labelAr: 'المؤهل التعليمي' },
  { id: 4, name: 'Program', label: 'Study Program', labelAr: 'البرنامج الدراسي' },
  { id: 5, name: 'Scholarship', label: 'Scholarship Request', labelAr: 'طلب المنحة' },
  { id: 6, name: 'Cost Sharing', label: 'Cost Sharing & Documents', labelAr: 'المستندات وتقاسم التكاليف' },
];

export default function ScholarshipApplicationFormPage() {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<{ applicationNumber: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    gender: '',
    placeOfBirth: '',
    dateOfBirth: '',
    contactAddress: 'Addis Ababa, Ethiopia',
    phoneNumber: '',
    email: '',
    nationalIdNumber: '',

    // Step 2: Employment
    employer: '',
    jobTitle: '',
    department: '',
    employmentType: 'Full-time Permanent',
    workLocation: '',
    yearsOfService: '',

    // Step 3: Education
    highestEducation: "Bachelor's Degree",
    undergraduateUniversity: '',
    undergraduateField: '',
    undergraduateCgpa: '',
    graduationYear: '',

    // Step 4: Program
    targetDegree: "Master's Degree",
    targetUniversity: '',
    targetField: '',
    enrollmentStatus: 'Admitted / Accepted',
    programDuration: '2 Years',
    academicYear: '2026/2027',

    // Step 5: Scholarship
    scholarshipType: 'Full Tuition Support',
    requestedAmount: '',
    motivationStatement: '',
    communityImpact: '',

    // Step 6: Cost Sharing & Documents
    hasCostSharing: false,
    costSharingDocRef: '',
    documentFile: null as File | null,
    declarationAgreed: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg('');

    if (step === 1) {
      if (!formData.fullName.trim()) { setErrorMsg(t('Full Name is required', 'الاسم الكامل مطلوب')); return false; }
      if (!formData.gender) { setErrorMsg(t('Gender is required', 'يرجى اختيار الجنس')); return false; }
      if (!formData.dateOfBirth) { setErrorMsg(t('Date of Birth is required', 'تاريخ الميلاد مطلوب')); return false; }
      if (!formData.contactAddress.trim()) { setErrorMsg(t('Contact Address is required', 'عنوان التواصل مطلوب')); return false; }
      if (!formData.phoneNumber.trim()) { setErrorMsg(t('Phone Number is required', 'رقم الهاتف مطلوب')); return false; }
    }

    if (step === 2) {
      if (!formData.employer.trim()) { setErrorMsg(t('Current Employer / Organization is required', 'اسم جهة العمل الحالية مطلوب')); return false; }
      if (!formData.jobTitle.trim()) { setErrorMsg(t('Job Title / Position is required', 'المسمى الوظيفي مطلوب')); return false; }
      if (!formData.workLocation.trim()) { setErrorMsg(t('Work City / Region is required', 'مدينة أو منطقة العمل مطلوبة')); return false; }
      if (!formData.yearsOfService.trim()) { setErrorMsg(t('Years of Service is required', 'عدد سنوات الخدمة مطلوب')); return false; }
    }

    if (step === 3) {
      if (!formData.undergraduateUniversity.trim()) { setErrorMsg(t('Undergraduate University is required', 'اسم الجامعة السابقة مطلوب')); return false; }
      if (!formData.undergraduateField.trim()) { setErrorMsg(t('Field of Study is required', 'مجال الدراسة مطلوب')); return false; }
      if (!formData.undergraduateCgpa.trim()) { setErrorMsg(t('CGPA is required', 'المعدل التراكمي مطلوب')); return false; }
      const cgpa = parseFloat(formData.undergraduateCgpa);
      if (isNaN(cgpa) || cgpa < 3.0) {
        setErrorMsg(t('Minimum CGPA of 3.0 is required for scholarship eligibility', 'الحد الأدنى للمعدل التراكمي للأهلية هو 3.0'));
        return false;
      }
      if (!formData.graduationYear.trim()) { setErrorMsg(t('Graduation Year is required', 'سنة التخرج مطلوبة')); return false; }
    }

    if (step === 4) {
      if (!formData.targetUniversity.trim()) { setErrorMsg(t('Target Government University is required', 'اسم الجامعة الحكومية المستهدفة مطلوب')); return false; }
      if (!formData.targetField.trim()) { setErrorMsg(t('Field of Study is required', 'مجال الدراسة مطلوب')); return false; }
    }

    if (step === 5) {
      if (!formData.motivationStatement.trim()) { setErrorMsg(t('Personal motivation statement is required', 'خطاب الدوافع الشخصية مطلوب')); return false; }
      if (!formData.communityImpact.trim()) { setErrorMsg(t('Community impact plan is required', 'خطة الأثر المجتمعي مطلوبة')); return false; }
    }

    if (step === 6) {
      if (!formData.documentFile) {
        setErrorMsg(t('Please attach your combined single PDF document file', 'يرجى إرفاق ملف الـ PDF المدمج الذي يحتوي على كافة المستندات'));
        return false;
      }
      if (!formData.declarationAgreed) {
        setErrorMsg(t('You must agree to the declaration statement', 'يجب الموافقة على الإقرار والتعهد بصحة البيانات'));
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const submitPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'documentFile' && value) {
          submitPayload.append('document', value as File);
        } else if (key === 'hasCostSharing' || key === 'declarationAgreed') {
          submitPayload.append(key, String(value));
        } else if (value !== null && value !== undefined) {
          submitPayload.append(key, String(value));
        }
      });

      const res = await api('/api/charity/applications/submit', {
        method: 'POST',
        body: submitPayload,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmittedData({
        applicationNumber: data.applicationNumber || `SELAM-${Date.now().toString().slice(-6)}`,
      });
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || t('Failed to submit application. Please check your connection and try again.', 'فشل إرسال الطلب. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAppNumber = () => {
    if (!submittedData) return;
    navigator.clipboard.writeText(submittedData.applicationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedData) {
    return (
      <div className="min-h-screen bg-slate-50/60 pt-28 sm:pt-36 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {t('Application Submitted Successfully!', 'تم إرسال الطلب بنجاح!')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-8">
              {t('Your scholarship application has been registered with Selam Charity and is queued for committee review.', 'تم تسجيل طلب المنحة الخاص بك لدى جمعية سلام الخيرية، وهو قيد المراجعة والتدقيق من قبل اللجنة.')}
            </p>

            {/* Reference Number Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t('Application Reference Number', 'رقم مرجع الطلب')}
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-black text-[#1964d2] tracking-wider font-mono">
                  {submittedData.applicationNumber}
                </span>
                <button
                  onClick={copyAppNumber}
                  className="p-2 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors"
                  title={t('Copy Reference Number', 'نسخ رقم المرجع')}
                >
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {t('Please save or screenshot this number for all future inquiries.', 'يرجى حفظ هذا الرقم أو أخذ لقطة شاشة له لمتابعة حالة الطلب لاحقاً.')}
              </p>
            </div>

            {/* Return Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/application"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('Back to Information', 'العودة لمعلومات التقديم')}
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#185a3a] text-white text-sm font-semibold hover:bg-[#12422a] shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                <span>{t('Return to Homepage', 'العودة للصفحة الرئيسية')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pt-28 sm:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator Header (Matching Screenshot 2) */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
            
            {/* Connecting Bar */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
            <div 
              className="absolute top-4 left-6 h-0.5 bg-[#1964d2] transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 95}%` }}
            />

            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                    }}
                    disabled={step.id > currentStep}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1964d2] text-white shadow-md ring-4 ring-blue-100'
                        : isPast
                        ? 'bg-[#1964d2] text-white cursor-pointer'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check size={14} /> : step.id}
                  </button>
                  <span className={`text-[11px] sm:text-xs mt-2 font-medium tracking-tight whitespace-nowrap hidden sm:block ${
                    isActive ? 'text-[#1964d2] font-bold' : isPast ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {isRTL ? step.labelAr : step.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="sm:hidden text-center mt-4">
            <span className="text-xs font-semibold text-[#1964d2]">
              {t('Step', 'الخطوة')} {currentStep} {t('of', 'من')} {STEPS.length}: {isRTL ? STEPS[currentStep - 1].labelAr : STEPS[currentStep - 1].label}
            </span>
          </div>
        </div>

        {/* Form Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 lg:p-12">
          
          {/* Step Header */}
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isRTL ? STEPS[currentStep - 1].labelAr : STEPS[currentStep - 1].label}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentStep === 1 && t('Please provide your legal personal information as shown on your official identification.', 'يرجى تقديم بياناتك الشخصية القانونية كما هي مدونة في هويتك الرسمية.')}
              {currentStep === 2 && t('Provide details of your current government employment and public sector service.', 'قدم تفاصيل وظيفتك الحكومية الحالية وخدمتك في القطاع العام.')}
              {currentStep === 3 && t('Provide details of your completed undergraduate education and academic records.', 'أدخل تفاصيل مؤهلك الجامعي وسجلك الأكاديمي السابق.')}
              {currentStep === 4 && t('Specify your intended Master’s or PhD program at a recognized government university.', 'حدد برنامج الماجستير أو الدكتوراه المستهدف في إحدى الجامعات الحكومية.')}
              {currentStep === 5 && t('Tell the committee why you need this scholarship and how you will impact the community.', 'وضح للجنة أسباب حاجتك لهذه المنحة وكيف ستفيد المجتمع من خلال دراستك.')}
              {currentStep === 6 && t('Verify cost-sharing, upload your single combined PDF, and sign the declaration.', 'تحقق من حالة تقاسم التكاليف، أرفق ملف الـ PDF المدمج، ووقع الإقرار.')}
            </p>
          </div>

          {/* Validation Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ══════════════════════════════════════════════════════════════
                STEP 1: PERSONAL DETAIL (Matches Screenshot 2)
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Full Name', 'الاسم الكامل')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => updateField('fullName', e.target.value)}
                      placeholder="e.g. Abebe Bikila"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Gender', 'الجنس')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={e => updateField('gender', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white cursor-pointer"
                    >
                      <option value="">{t('Select Gender', 'اختر الجنس')}</option>
                      <option value="Male">{t('Male', 'ذكر')}</option>
                      <option value="Female">{t('Female', 'أنثى')}</option>
                    </select>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Place of Birth', 'مكان الميلاد')}
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={e => updateField('placeOfBirth', e.target.value)}
                      placeholder="e.g. Addis Ababa"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Date of Birth', 'تاريخ الميلاد')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={e => updateField('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    />
                  </div>

                  {/* Contact Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Contact Address', 'عنوان التواصل الإقامي')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactAddress}
                      onChange={e => updateField('contactAddress', e.target.value)}
                      placeholder="Addis Ababa, Ethiopia"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Phone Number', 'رقم الهاتف')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={e => updateField('phoneNumber', e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Email', 'البريد الإلكتروني')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="applicant@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  {/* National ID Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('National ID Number', 'رقم الهوية الوطنية / كيبيل')}
                    </label>
                    <input
                      type="text"
                      value={formData.nationalIdNumber}
                      onChange={e => updateField('nationalIdNumber', e.target.value)}
                      placeholder="ID-XXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 2: EMPLOYMENT DETAILS
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Current Employer / Government Organization', 'المؤسسة أو الوزارة الحكومية الحالية')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employer}
                      onChange={e => updateField('employer', e.target.value)}
                      placeholder="e.g. Ministry of Education"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Job Title / Position', 'المسمى الوظيفي')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={e => updateField('jobTitle', e.target.value)}
                      placeholder="e.g. Senior Curriculum Specialist"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Department / Directorate', 'القسم / الإدارة')}
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={e => updateField('department', e.target.value)}
                      placeholder="e.g. Educational Planning Directorate"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Employment Type', 'نوع التوظيف')}
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={e => updateField('employmentType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    >
                      <option value="Full-time Permanent">{t('Full-time Permanent', 'دوام كامل دائم')}</option>
                      <option value="Civil Service Regular">{t('Civil Service Regular', 'خدمة مدنية رسمية')}</option>
                      <option value="Contract">{t('Contract / Project', 'عقد رسمي')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Work City / Region', 'مدينة / منطقة العمل')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.workLocation}
                      onChange={e => updateField('workLocation', e.target.value)}
                      placeholder="e.g. Addis Ababa"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Years of Public Service', 'سنوات الخدمة في القطاع العام')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.yearsOfService}
                      onChange={e => updateField('yearsOfService', e.target.value)}
                      placeholder="e.g. 4 Years"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 3: EDUCATIONAL BACKGROUND
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Highest Completed Qualification', 'أعلى مؤهل تعليمي مكتمل')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.highestEducation}
                      onChange={e => updateField('highestEducation', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    >
                      <option value="Bachelor's Degree">{t("Bachelor's Degree", 'درجة البكالوريوس')}</option>
                      <option value="Master's Degree">{t("Master's Degree", 'درجة الماجستير')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Undergraduate University / College', 'الجامعة / الكلية المتخرج منها')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.undergraduateUniversity}
                      onChange={e => updateField('undergraduateUniversity', e.target.value)}
                      placeholder="e.g. Addis Ababa University"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Field of Study / Major', 'التخصص الجامعي')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.undergraduateField}
                      onChange={e => updateField('undergraduateField', e.target.value)}
                      placeholder="e.g. Educational Planning and Management"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Cumulative CGPA (Min. 3.0 required)', 'المعدل التراكمي (الحد الأدنى 3.0)')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="3.0"
                      max="4.0"
                      required
                      value={formData.undergraduateCgpa}
                      onChange={e => updateField('undergraduateCgpa', e.target.value)}
                      placeholder="e.g. 3.48"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Graduation Year (GC)', 'سنة التخرج (الميلادية)')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.graduationYear}
                      onChange={e => updateField('graduationYear', e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 4: STUDY PROGRAM
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Target Degree Level', 'الدرجة المستهدفة')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.targetDegree}
                      onChange={e => updateField('targetDegree', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    >
                      <option value="Master's Degree">{t("Master's Degree (MSc / MA / Med / LLM)", 'درجة الماجستير')}</option>
                      <option value="PhD Program">{t('Doctor of Philosophy (PhD)', 'درجة الدكتوراه')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Target Public University', 'الجامعة الحكومية')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetUniversity}
                      onChange={e => updateField('targetUniversity', e.target.value)}
                      placeholder="e.g. Addis Ababa University"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Target Field of Specialization', 'التخصص الدقيق')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.targetField}
                      onChange={e => updateField('targetField', e.target.value)}
                      placeholder="e.g. Public Administration and Policy"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Admission / Enrollment Status', 'حالة القبول أو التسجيل')}
                    </label>
                    <select
                      value={formData.enrollmentStatus}
                      onChange={e => updateField('enrollmentStatus', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    >
                      <option value="Admitted / Accepted">{t('Admitted / Acceptance Letter Received', 'تم القبول / خطاب القبول متوفر')}</option>
                      <option value="Currently Enrolled">{t('Currently Enrolled Student', 'طالب مسجل حالياً')}</option>
                      <option value="Application in Progress">{t('Application in Progress at University', 'إجراءات التقديم جارية في الجامعة')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Expected Program Duration', 'مدة البرنامج المتوقعة')}
                    </label>
                    <input
                      type="text"
                      value={formData.programDuration}
                      onChange={e => updateField('programDuration', e.target.value)}
                      placeholder="e.g. 2 Years"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Academic Year', 'العام الدراسي')}
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={e => updateField('academicYear', e.target.value)}
                      placeholder="2026/2027"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 5: SCHOLARSHIP REQUEST
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Requested Scholarship Coverage', 'نوع الدعم المطلوب')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.scholarshipType}
                      onChange={e => updateField('scholarshipType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                    >
                      <option value="Full Tuition Support">{t('Full Tuition Fee Coverage', 'تغطية الرسوم الدراسية بالكامل')}</option>
                      <option value="Partial Tuition">{t('Partial Tuition Fee Support', 'تغطية جزئية للرسوم الدراسية')}</option>
                      <option value="Research & Thesis Support">{t('Research, Fieldwork & Thesis Grant', 'منحة دعم البحث العلمي والأطروحة')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Estimated Total Course Cost (ETB)', 'التكلفة الإجمالية التقديرية (بالبر الإثيوبي)')}
                    </label>
                    <input
                      type="number"
                      value={formData.requestedAmount}
                      onChange={e => updateField('requestedAmount', e.target.value)}
                      placeholder="e.g. 80000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('Personal Statement & Motivation', 'خطاب الدوافع الشخصية والهدف الأكاديمي')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.motivationStatement}
                    onChange={e => updateField('motivationStatement', e.target.value)}
                    placeholder={t('Explain why you are applying for this scholarship, your professional background, and career aspirations...', 'اشرح سبب تقديمك لهذه المنحة، وخلفيتك المهنية، وتطلعاتك الوظيفية...')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t('Community Impact & Public Service Plan', 'خطة الأثر المجتمعي وخدمة المجتمع')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.communityImpact}
                    onChange={e => updateField('communityImpact', e.target.value)}
                    placeholder={t('Describe how your education will directly benefit your institution, public service, and wider community in Ethiopia...', 'وضح كيف ستسهم دراستك ومؤهلك الجديد في تطوير مؤسستك، وتنمية المجتمع وخدمته في إثيوبيا...')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 6: COST SHARING & DOCUMENT UPLOAD
                ══════════════════════════════════════════════════════════════ */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Cost Sharing Toggle */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t('Cost Sharing Document / Status', 'وثيقة أو التزام تقاسم التكاليف')}</p>
                      <p className="text-xs text-slate-500">{t('Do you have prior undergraduate or governmental cost sharing obligation?', 'هل لديك التزام أو وثيقة تقاسم تكاليف سابقة؟')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.hasCostSharing} 
                        onChange={e => updateField('hasCostSharing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1964d2]"></div>
                    </label>
                  </div>

                  {formData.hasCostSharing && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('Cost Sharing Letter Reference / ERCA Number', 'رقم مرجع وثيقة تقاسم التكاليف أو إيركا')}
                      </label>
                      <input
                        type="text"
                        value={formData.costSharingDocRef}
                        onChange={e => updateField('costSharingDocRef', e.target.value)}
                        placeholder="e.g. CS-2022-99881"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1964d2] transition-all bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Document Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {t('Combined Required Documents (Single PDF File)', 'الملف المدمج للمستندات المطلوبة (ملف PDF واحد)')} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    {t('Please merge all required papers (CV, ID, employment letter, recommendation, transcripts, acceptance letter) into one PDF file (max 25MB).', 'يرجى دمج جميع المستندات المطلوبة (السيرة الذاتية، الهوية، خطاب العمل، التزكيات، السجل الأكاديمي، خطاب القبول) في ملف PDF واحد (بحد أقصى 25 ميجابايت).')}
                  </p>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      formData.documentFile
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-[#1964d2] hover:bg-blue-50/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                            setErrorMsg(t('Please select a valid PDF file format.', 'يرجى اختيار ملف بصيغة PDF فقط.'));
                            return;
                          }
                          updateField('documentFile', file);
                        }
                      }}
                    />

                    {formData.documentFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                          <FileText size={24} />
                        </div>
                        <span className="font-bold text-sm text-slate-900">{formData.documentFile.name}</span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {(formData.documentFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateField('documentFile', null);
                          }}
                          className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 underline"
                        >
                          {t('Replace File', 'تغيير الملف')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1964d2] flex items-center justify-center mb-2">
                          <Upload size={24} />
                        </div>
                        <span className="font-bold text-sm text-slate-800">
                          {t('Click or drag & drop to upload your combined PDF', 'انقر هنا أو اسحب الملف لرفع ملف الـ PDF')}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          {t('PDF format only, up to 25MB', 'صيغة PDF فقط، حتى 25 ميجابايت')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Formal Declaration Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declarationAgreed}
                      onChange={e => updateField('declarationAgreed', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-[#1964d2] focus:ring-blue-200 border-slate-300"
                    />
                    <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {t('I certify that all statements made in this scholarship application are true, complete, and accurate to the best of my knowledge. I understand that false or misleading information will result in immediate disqualification or termination of any scholarship grant.', 'أقر وأتعهد بأن جميع البيانات والمعلومات الواردة في هذا الطلب صحيحة وكاملة ودقيقة. وأعلم بأن أي تضليل أو بيانات غير صحيحة تؤدي إلى استبعاد الطلب فوراً أو إلغاء المنحة.')}
                    </span>
                  </label>
                </div>

              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                  <span>{t('Previous', 'السابق')}</span>
                </button>
              ) : (
                <Link
                  href="/application"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                  <span>{t('Back to Info', 'رجوع')}</span>
                </Link>
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#1964d2] hover:bg-[#1553b0] text-white text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <span>{t('Next', 'التالي')}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#185a3a] hover:bg-[#12422a] text-white text-sm font-bold shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('Submitting...', 'جاري الإرسال...')}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{t('Submit Application', 'إرسال طلب المنحة')}</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

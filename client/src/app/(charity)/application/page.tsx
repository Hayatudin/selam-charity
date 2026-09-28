'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Award,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ScholarshipApplicationLandingPage() {
  const { t, isRTL } = useLanguage();

  const sections = [
    { title: t('Personal Details', 'البيانات الشخصية'), desc: t('Full name, contact details, date of birth and identity identification.', 'الاسم الكامل، بيانات التواصل، تاريخ الميلاد وتحديد الهوية.') },
    { title: t('Employment Details', 'بيانات الوظيفة والعمل'), desc: t('Current government organization, position, department and years of service.', 'المؤسسة الحكومية الحالية، المسمى الوظيفي، القسم وسنوات الخدمة.') },
    { title: t('Educational Background', 'المؤهل التعليمي السابق'), desc: t('Undergraduate institution, field of study, graduation year and CGPA.', 'الجامعة السابقة، مجال الدراسة، سنة التخرج والمعدل التراكمي.') },
    { title: t('Study Program', 'البرنامج الدراسي المطلوب'), desc: t('Target degree (Master’s / PhD), government university, and enrollment status.', 'الدرجة المستهدفة (ماجستير / دكتوراه)، الجامعة الحكومية، وحالة القبول.') },
    { title: t('Scholarship Request', 'طلب المنحة والدوافع'), desc: t('Requested grant support type, statement of purpose, and community impact plan.', 'نوع الدعم المطلوب، خطاب الدوافع، وخطة الأثر المجتمعي.') },
    { title: t('Cost Sharing', 'المستندات وتقاسم التكاليف'), desc: t('Cost sharing status, declaration agreement, and combined PDF document upload.', 'حالة تقاسم التكاليف، الإقرار الرسمي، ورفع ملف المستندات المدمج.') },
  ];

  const requiredDocuments = [
    t('Updated CV / Resume', 'السيرة الذاتية المحدثة'),
    t('Copy of National ID / Kebele ID', 'نسخة من بطاقة الهوية الوطنية أو هوية الحي'),
    t('Employment Verification Letter', 'خطاب إثبات وتأييد العمل من جهة التوظيف'),
    t('Guarantee Letter', 'خطاب الضمان والتعهد'),
    t('Recommendation Letters (Academic & Professional)', 'خطابات التزكية (الأكاديمية والمهنية)'),
    t('Cost-Sharing Document (ERCA, if applicable)', 'وثيقة تقاسم التكاليف (إن وجدت)'),
    t('Recent Passport-Sized Photograph', 'صورة شخصية حديثة مقاس جواز السفر'),
    t('Personal Motivation Letter', 'خطاب الدوافع الشخصية'),
    t('Official Academic Transcripts & Degrees', 'السجلات الأكاديمية والشهادات الرسمية'),
    t('Official Acceptance Letter from Government University', 'خطاب القبول الرسمي من الجامعة الحكومية'),
    t('Detailed Course Cost Breakdown', 'تفصيل تكاليف البرنامج الدراسي المعتمد')
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pt-28 sm:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 lg:p-14">
          
          {/* Header Title */}
          <div className="text-center mb-10 pb-8 border-b border-slate-100">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-50 text-emerald-800 mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1964d2] tracking-tight">
              {t('Selam Charity Scholarship Application', 'طلب منحة جمعية سلام الخيرية')}
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
              {t('Supporting dedicated government employees and civil servants in pursuing higher postgraduate education in accredited public universities.', 'دعم موظفي القطاع الحكومي والخدمة المدنية لمواصلة الدراسات العليا في الجامعات الحكومية المعتمدة.')}
            </p>
          </div>

          {/* Section 1: Application Information */}
          <div className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
              <Award size={20} className="text-[#1964d2]" />
              {t('Application Information', 'معلومات التقديم')}
            </h2>
            <ul className="space-y-3.5 text-sm sm:text-[15px] text-slate-700 leading-relaxed pl-2 rtl:pl-0 rtl:pr-2">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                <span>
                  <strong className="text-slate-900">{t('Eligibility:', 'شروط الأهلية:')} </strong>
                  {t("Government employees pursuing Master's or PhD programs with a minimum CGPA of 3.0 in specified fields (Education, Leadership, Sociology, Psychology, Political Science, Journalism, History, Gender Studies, Economics, Peace and Development, Public Administration, Law, and related fields).", 'الموظفون الحكوميون الذين يتابعون برامج الماجستير أو الدكتوراه بمعدل تراكمي لا يقل عن 3.0 في المجالات المحددة (التعليم، القيادة، علم الاجتماع، علم النفس، العلوم السياسية، الصحافة، التاريخ، دراسات النوع الاجتماعي، الاقتصاد، السلام والتنمية، الإدارة العامة، القانون، والمجالات ذات الصلة).')}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                <span>
                  <strong className="text-slate-900">{t('Institution:', 'المؤسسة التعليمية:')} </strong>
                  {t('Enrollment in a government university is mandatory.', 'التسجيل في جامعة حكومية إلزامي ومطلوب.')}
                </span>
              </li>
            </ul>
          </div>

          {/* Section 2: Required Document Submission */}
          <div className="mb-10 p-6 sm:p-7 rounded-2xl bg-blue-50/40 border border-blue-100/80">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2.5">
              <FileText size={20} className="text-[#1964d2]" />
              {t('Required Document Submission:', 'المستندات المطلوبة للتقديم:')}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-4">
              {t('Please combine all required documents into a single PDF file and be ready to submit this in the required field of the form. The required documents include:', 'يرجى دمج جميع المستندات المطلوبة في ملف PDF واحد والاستعداد لإرفاقه في الحقل المخصص بالنموذج. تشمل المستندات المطلوبة:')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Form Sections */}
          <div className="mb-12">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {t('Form Sections', 'أقسام استمارة التقديم')}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {t('The application form is divided into the following six sections:', 'تنقسم استمارة التقديم إلى الأقسام الستة التالية:')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{sec.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-8 rtl:pl-0 rtl:pr-8">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Start Application */}
          <div className="flex flex-col items-center justify-center pt-4">
            <Link
              href="/application/form"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#f15a24] hover:bg-[#d94d1b] text-white text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t('Start Application', 'بدء التقديم الآن')}</span>
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
            <p className="text-xs text-slate-400 mt-3 text-center">
              {t('Takes approximately 5-10 minutes to complete. You will need your single merged PDF file ready.', 'يستغرق إكمال الاستمارة ما بين 5 إلى 10 دقائق. يرجى تجهيز ملف الـ PDF المدمج.')}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

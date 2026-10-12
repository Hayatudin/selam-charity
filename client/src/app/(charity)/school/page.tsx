'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  MapPin,
  Pencil,
  Heart,
  Droplets,
  Landmark,
  Eye,
  ZoomIn
} from 'lucide-react';
import Lightbox from '@/components/charity/public/Lightbox';
import type { CharityGalleryItem } from '@/types/charity';
import { useLanguage } from '@/context/LanguageContext';

export default function CharitySchoolPage() {
  const { t, isRTL } = useLanguage();
  const [activeTier, setActiveTier] = useState<'all' | 'kg' | 'primary' | 'middle' | 'grade9'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<CharityGalleryItem | null>(null);

  // School showcase pictures (user can replace later)
  const schoolPhotos = [
    {
      src: '/hero-images/hero-1.png',
      alt: 'Newly Constructed School Buildings Across Cities',
      badge: 'School Construction',
      badgeAr: 'بناء المدارس',
      title: 'Modern School Buildings in Multiple Cities',
      titleAr: 'مبانٍ مدرسية حديثة في مختلف المدن',
      desc: 'Constructing safe, spacious, and well-ventilated school campuses in underserved cities and rural regions.',
      descAr: 'بناء مرافق مدرسية آمنة وواسعة وجيدة التهوية في المدن والمناطق ذات الاحتياج.',
      highlight: 'Multiple Cities'
    },
    {
      src: '/hero-images/hero-2.png',
      alt: 'Classrooms Furnished with Wooden Desks',
      badge: 'Desks & Furnishings',
      badgeAr: 'المقاعد والتجهيزات',
      title: 'Sturdy Wooden Desks for Every Student',
      titleAr: 'مقاعد خشبية متينة لكل طالب',
      desc: 'Manufacturing and installing quality double and triple wooden desks so that zero children sit on bare floors.',
      descAr: 'تصنيع وتركيب مقاعد خشبية متينة لضمان جلوس كل طالب بكرامة وراحة تامة.',
      highlight: '100% Furnished'
    },
    {
      src: '/hero-images/hero-3.png',
      alt: 'Students Engaged in Accredited Education',
      badge: 'KG to Grade 9',
      badgeAr: 'من الروضة حتى الصف 9',
      title: 'Active Classrooms from Kindergarten to Grade 9',
      titleAr: 'فصول تعليمية نشطة من الروضة حتى التاسع',
      desc: 'Qualified and compassionate educators teaching accredited national curricula with moral and ethical values.',
      descAr: 'معلمون مؤهلون يقدمون المناهج التعليمية المعتمدة مع غرس القيم الأخلاقية.',
      highlight: 'Accredited Curriculum'
    },
    {
      src: '/hero-images/hero-4.png',
      alt: 'Early Childhood & Kindergarten Classrooms',
      badge: 'Kindergarten (KG)',
      badgeAr: 'رياض الأطفال',
      title: 'Foundational Early Childhood Classrooms',
      titleAr: 'فصول رياض الأطفال والتعليم التأسيسي',
      desc: 'Warm, colorful learning spaces fostering early literacy, numeracy, curiosity, and socialization.',
      descAr: 'بيئات تعليمية محفزة وملونة لتنمية المهارات الأساسية في القراءة والحساب والاستكشاف.',
      highlight: 'KG 1 - KG 3'
    },
    {
      src: '/hero-images/hero-5.png',
      alt: 'Supplies Distribution: Pens & Exercise Books',
      badge: 'Essential Supplies',
      badgeAr: 'المستلزمات الدراسية',
      title: 'Exercise Books, Pens & Learning Supplies',
      titleAr: 'الدفاتر والأقلام والمستلزمات التعليمية',
      desc: 'Regular semester distributions of notebooks, pens, pencils, math sets, and learning essentials directly to students.',
      descAr: 'توزيع دوري لكل فصل دراسي يشمل الدفاتر والأقلام ومستلزمات الهندسة والحقائب المدرسية.',
      highlight: 'Free Materials'
    },
    {
      src: '/About.png',
      alt: 'Empowering Orphan and Underprivileged Students',
      badge: 'Yatim Priority',
      badgeAr: 'أولوية رعاية الأيتام',
      title: 'Special Care & Inclusion for Yatim (Orphans)',
      titleAr: 'رعاية خاصة وكفالة تعليمية للأيتام',
      desc: 'Full educational inclusion, free learning materials, and caring mentorship for children who have lost their fathers.',
      descAr: 'دمج تعليمي كامل وتوفير كافة المستلزمات مجاناً للأطفال الأيتام وفاقدي الآباء.',
      highlight: 'Full Sponsorship'
    }
  ];

  // Educational Levels (KG - Grade 9)
  const educationalTiers = [
    {
      key: 'kg',
      tier: 'Kindergarten (KG 1 - KG 3)',
      tierAr: 'رياض الأطفال (المستوى 1 - 3)',
      grades: 'Ages 4 - 6',
      gradesAr: 'الأعمار 4 - 6 سنوات',
      badge: 'Early Childhood',
      badgeAr: 'الطفولة المبكرة',
      desc: 'Foundational play-based and interactive education focusing on basic literacy, numbers, mother tongue vocabulary, and healthy social habits.',
      descAr: 'تعليم تأسيسي تفاعلي يركز على مهارات القراءة والكتابة الأولية والأرقام واللغة الأم والتعايش الإيجابي.',
      materials: [
        'Illustrated alphabet & story books',
        'Drawing pads, crayons & coloring pencils',
        'Kindergarten activity tables & chairs',
        'Educational toys & learning blocks'
      ],
      materialsAr: [
        'كتب مصورة وقصص تعليمية',
        'دفاتر رسم وألوان خشبية',
        'طاولات ومقاعد مخصصة لرياض الأطفال',
        'ألعاب تنمية الذكاء والمهارات الحركية'
      ]
    },
    {
      key: 'primary',
      tier: 'Lower Primary (Grades 1 - 4)',
      tierAr: 'المرحلة الابتدائية الدنيا (الصفوف 1 - 4)',
      grades: 'Grades 1 - 4',
      gradesAr: 'الصفوف 1 - 4',
      badge: 'Primary Foundation',
      badgeAr: 'التأسيس الابتدائي',
      desc: 'Building core competencies in mathematics, reading comprehension, environmental science, and creative writing in dedicated furnished classrooms.',
      descAr: 'بناء المهارات الأساسية في الحساب والقراءة والاستيعاب والعلوم البيئية داخل فصول مجهزة بمقاعد خشبية.',
      materials: [
        'Lined exercise books & handwriting guides',
        'Blue & black pens, pencils & sharpeners',
        'Sturdy double wooden desks & benches',
        'National curriculum textbooks'
      ],
      materialsAr: [
        'دفاتر مسطرة وكتيبات تحسين الخط',
        'أقلام جافة ورصاص ومماحٍ ومبراة',
        'مقاعد خشبية متينة مزدوجة',
        'الكتب المنهجية الوطنية المعتمدة'
      ]
    },
    {
      key: 'middle',
      tier: 'Upper Primary (Grades 5 - 8)',
      tierAr: 'المرحلة الابتدائية العليا (الصفوف 5 - 8)',
      grades: 'Grades 5 - 8',
      gradesAr: 'الصفوف 5 - 8',
      badge: 'Middle Grades',
      badgeAr: 'المرحلة المتوسطة',
      desc: 'Comprehensive academic curricula covering integrated natural sciences, social studies, mathematics, English language, and national assessment readiness.',
      descAr: 'منهاج أكاديمي شامل يغطي العلوم الطبيعية والدراسات الاجتماعية والرياضيات واللغة الإنجليزية والاستعداد للاختبارات الوطنية.',
      materials: [
        'Multi-subject lined & squared exercise books',
        'Mathematical geometry instrument sets & rulers',
        'Subject-specific reference textbooks',
        'Classroom blackboards & science charts'
      ],
      materialsAr: [
        'دفاتر مسطرة ومربعات لمختلف المواد',
        'أطقم الأدوات الهندسية والمساطر',
        'كتب مرجعية متخصصة لكل مادة',
        'سبورات صفية ومخططات علمية توضيحية'
      ]
    },
    {
      key: 'grade9',
      tier: 'Junior Secondary (Grade 9)',
      tierAr: 'المرحلة الإعدادية (الصف التاسع)',
      grades: 'Grade 9',
      gradesAr: 'الصف التاسع',
      badge: 'Secondary Prep',
      badgeAr: 'الإعداد للثانوي',
      desc: 'Advanced general science, algebra, geometry, civics, and critical analytical studies, preparing students for successful secondary education transition.',
      descAr: 'دراسة متقدمة في العلوم والجبر والهندسة والتربية المدنية والتفكير التحليلي، لتأهيل الطلاب لمرحلة التعليم الثانوي.',
      materials: [
        'Advanced scientific exercise books & binders',
        'Scientific calculators & geometry tools',
        'Advanced language & science textbooks',
        'Dedicated study spaces & teacher support'
      ],
      materialsAr: [
        'دفاتر علمية متخصصة ومجلدات',
        'آلات حاسبة وأدوات هندسية دقيقة',
        'كتب علمية ولغوية متقدمة',
        'مساحات مخصصة للمذاكرة وإرشاد المعلمين'
      ]
    }
  ];

  const filteredTiers =
    activeTier === 'all'
      ? educationalTiers
      : educationalTiers.filter((item) => item.key === activeTier);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          1. HERO BANNER: Building Schools Across Cities
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        
        {/* Ambient background grid & glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t('Selam Charity Educational Network', 'الشبكة التعليمية لجمعية سلام')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            {t('Building Schools & Supplying Classrooms Across Cities', 'بناء وتأسيس المدارس وتجهيز الفصول في مختلف المدن')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {t(
              'Selam Charity establishes accredited schools across diverse cities, providing classrooms with desks, pens, exercise books, and complete educational materials from Kindergarten up to Grade 9.',
              'تقوم جمعية سلام الخيرية ببناء وتأسيس المدارس في مدن ومناطق متعددة، وتجهيز الفصول بالمقاعد والدفاتر والأقلام ومستلزمات التعليم من الروضة حتى الصف التاسع.'
            )}
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              {
                value: 'KG - Grade 9',
                label: t('Comprehensive Levels', 'من الروضة حتى الصف 9'),
                icon: GraduationCap,
                color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
              },
              {
                value: t('Multiple Cities', 'مدن متعددة'),
                label: t('Across Various Regions', 'في مختلف الأقاليم'),
                icon: MapPin,
                color: 'text-teal-400 bg-teal-950/60 border-teal-800/60'
              },
              {
                value: t('100% Furnished', 'تجهيز كامل 100%'),
                label: t('Desks & Benches', 'المقاعد الخشبية المتينة'),
                icon: Building2,
                color: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
              },
              {
                value: t('Yatim Priority', 'أولوية الأيتام'),
                label: t('Orphan Full Care', 'كفالة ورعاية فاقدي الآباء'),
                icon: Heart,
                color: 'text-rose-400 bg-rose-950/60 border-rose-800/60'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border backdrop-blur-md text-center flex flex-col items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5 mb-1.5 opacity-90" />
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-white block">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium block mt-0.5">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t('Support a Classroom', 'ساهم في تجهيز فصل')}</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
            >
              <span>{t('Contact Us', 'تواصل معنا')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. PICTURES SHOWCASE: Visual Gallery of Schools & Desks
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              {t('Photo Showcase', 'معرض الصور الميداني')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {t('Our Schools in Action', 'مدارسنا على أرض الواقع')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t(
                'Explore scenes from our established schools across cities—featuring furnished classrooms, wooden desks, distribution of exercise books and pens, and joyful student environments.',
                'شاهد جانباً من مدارسنا المنشأة في مختلف المدن، بما تشمله من فصول مجهزة ومقاعد خشبية متينة، وتوزيع الدفاتر والأقلام، وبيئات تعليمية مفعمة بالأمل.'
              )}
            </p>
          </div>

          {/* 6-Photo Masonry / Modern Grid with Lightbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {schoolPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedPhoto({
                    id: String(index),
                    title: isRTL ? photo.titleAr : photo.title,
                    caption: isRTL ? photo.descAr : photo.desc,
                    mediaUrl: photo.src,
                    mediaType: 'image',
                    category: 'schools',
                    orderIndex: index,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  })
                }
                className="group relative rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[380px] sm:min-h-[420px]"
              >
                {/* Background Image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent group-hover:from-black/95 transition-all" />

                {/* Top Badge & Zoom Indicator */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-extrabold shadow-sm">
                    {isRTL ? photo.badgeAr : photo.badge}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                {/* Bottom Content Container */}
                <div className="relative z-10 p-6 sm:p-7 space-y-2 text-white">
                  <span className="text-[11px] font-mono tracking-wider text-emerald-400 font-bold uppercase block">
                    {photo.highlight}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                    {isRTL ? photo.titleAr : photo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light line-clamp-3">
                    {isRTL ? photo.descAr : photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            {t('* Click on any photo to view full size', '* اضغط على أي صورة لعرضها بالحجم الكامل')}
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. CORE PILLARS: What Selam Charity Provides to Schools
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#185A3A]/10 text-[#185A3A] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              {t('Comprehensive Provision', 'تجهيز متكامل')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {t('How We Establish & Furnish Every School', 'كيف نؤسس ونجهز كل مدرسة')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t(
                'Our mission goes beyond building physical classrooms. We furnish each school completely with durable wooden desks and supply books, pens, and learning materials from Kindergarten up to Grade 9.',
                'لا يقتصر عملنا على بناء الجدران، بل نقوم بتجهيز كل مدرسة بالكامل بالمقاعد الخشبية المتينة وتوفير الدفاتر والأقلام والكتب من الروضة حتى الصف التاسع.'
              )}
            </p>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                number: '01',
                title: t('Building Schools in Many Cities', 'بناء المدارس في مدن متعددة'),
                desc: t(
                  'Constructing sturdy, accredited schools in underserved cities and rural regions to provide clean, safe, and spacious learning environments.',
                  'بناء مدارس معتمدة ومتينة في مدن ومناطق محرومة لتوفير بيئات تعليمية آمنة وفسيحة ونظيفة للأطفال.'
                ),
                icon: Building2,
                color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
              },
              {
                number: '02',
                title: t('Supplying Desks & Benches', 'توفير المقاعد والطاولات الخشبية'),
                desc: t(
                  'Manufacturing quality wooden desks so every student has a dignified, comfortable place to write and study, ending the indignity of floor seating.',
                  'تصنيع مقاعد خشبية متينة لضمان أن لكل تلميذ مقعداً لائقاً ومريحاً للكتابة والدراسة، وإنهاء معاناة الجلوس على الأرض.'
                ),
                icon: Layers,
                color: 'bg-teal-50 text-teal-800 border-teal-200'
              },
              {
                number: '03',
                title: t('Pens, Books & Stationery', 'الدفاتر والأقلام والمستلزمات'),
                desc: t(
                  'Supplying exercise books, pens, pencils, math sets, and reading materials every semester to relieve families of crippling education costs.',
                  'توفير الدفاتر والأقلام والمساطر والأدوات المدرسية دورياً لتخفيف العبء المالي عن كاهل الأسر المحتاجة.'
                ),
                icon: Pencil,
                color: 'bg-amber-50 text-amber-800 border-amber-200'
              },
              {
                number: '04',
                title: t('KG Up to Grade 9 Coverage', 'تغطية شاملة من الروضة حتى التاسع'),
                desc: t(
                  'Providing an unbroken educational continuum spanning early childhood Kindergarten, foundational primary grades, and junior secondary Grade 9.',
                  'مسار تعليمي متواصل يشمل مرحلة الروضة، والصفوف الابتدائية الأساسية، وحتى إتمام الصف التاسع الإعدادي.'
                ),
                icon: GraduationCap,
                color: 'bg-blue-50 text-blue-800 border-blue-200'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[2rem] p-7 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="w-10 h-10 rounded-full bg-[#185A3A] text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {pillar.number}
                      </span>
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${pillar.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#185A3A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('Active Program Priority', 'برنامج أساسي معتمد')}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. EDUCATIONAL LEVELS BREAKDOWN (KG to Grade 9)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                {t('Educational Scope', 'المراحل الدراسية')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {t('Covering Kindergarten to Grade 9', 'من الروضة حتى الصف التاسع')}
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
              {[
                { key: 'all', label: t('All Levels', 'كافة المراحل') },
                { key: 'kg', label: t('KG (Ages 4-6)', 'الروضة') },
                { key: 'primary', label: t('Grades 1-4', 'الصفوف 1-4') },
                { key: 'middle', label: t('Grades 5-8', 'الصفوف 5-8') },
                { key: 'grade9', label: t('Grade 9', 'الصف 9') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTier(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTier === tab.key
                      ? 'bg-[#185A3A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTiers.map((tierItem, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      {isRTL ? tierItem.badgeAr : tierItem.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {isRTL ? tierItem.gradesAr : tierItem.grades}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                    {isRTL ? tierItem.tierAr : tierItem.tier}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {isRTL ? tierItem.descAr : tierItem.desc}
                  </p>

                  {/* Materials provided list */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-200/70">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      {t('Materials & Furnishings Supplied:', 'المستلزمات والتجهيزات المقدمة:')}
                    </h4>
                    {(isRTL ? tierItem.materialsAr : tierItem.materials).map((mat, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{mat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{t('Certified Curriculum', 'منهاج تعليمي معتمد')}</span>
                  <span className="text-[#185A3A] font-bold">{t('Fully Supplied', 'تجهيز مجاني كامل')}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. MATERIALS & SUPPLIES CHECKLIST (Visual Strip)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Pencil className="w-3.5 h-3.5" />
              {t('School Supplies Breakdown', 'قائمة المستلزمات المدرسية')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t('What Goes Into Furnishing a School?', 'ماذا نقدم لكل مدرسة وفصل؟')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t(
                'Every school established by Selam Charity receives a complete inventory of durable classroom furniture, student stationery, and teacher teaching supplies.',
                'تحصل كل مدرسة تؤسسها جمعية سلام على تجهيزات صفية كاملة من المقاعد الخشبية ومستلزمات الطلاب وأدوات المعلمين.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                icon: '🪑',
                title: t('Wooden Desks & Benches', 'طاولات ومقاعد خشبية'),
                desc: t('Sturdy double/triple seating', 'مقاعد متينة لكل طالب')
              },
              {
                icon: '📓',
                title: t('Exercise Books & Notes', 'دفاتر وكشاكيل مسطرة'),
                desc: t('Semester bulk distribution', 'توزيع دوري لكل فصل')
              },
              {
                icon: '✏️',
                title: t('Pens, Pencils & Erasers', 'أقلام ومماحٍ ومبراة'),
                desc: t('Writing kits for all students', 'حقائب أدوات كتابة')
              },
              {
                icon: '📐',
                title: t('Math Sets & Rulers', 'أطقم الهندسة والمساطر'),
                desc: t('Essential geometry tools', 'أدوات الحساب والهندسة')
              },
              {
                icon: '📚',
                title: t('Textbooks & Readers', 'الكتب المنهجية والقصص'),
                desc: t('Accredited subject curriculum', 'مناهج رسمية معتمدة')
              },
              {
                icon: '🧑‍🏫',
                title: t('Blackboards & Supplies', 'سبورات ومستلزمات التعليم'),
                desc: t('Teacher chalk & charts', 'سبورات وأدوات المعلمين')
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2 hover:border-emerald-500/60 hover:bg-slate-800 transition-all"
              >
                <span className="text-3xl mb-1">{item.icon}</span>
                <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. CALL TO ACTION: Build a School or Furnish a Classroom
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-emerald-950 via-[#185A3A] to-slate-950 text-white relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-7 h-7 fill-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {t('Help Us Build a School or Furnish a Classroom', 'ساهم معنا في بناء مدرسة أو تجهيز فصل كامل')}
          </h2>

          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            {t(
              'Your generous contribution directly finances classroom construction, manufactured wooden desks, exercise books, and pens for children and orphans (yatim) in underserved cities.',
              'مساهمتك الكريمة تذهب مباشرة لتمويل بناء الفصول وتصنيع المقاعد الخشبية وتوفير الدفاتر والأقلام للأطفال والأيتام في المناطق المحتاجة.'
            )}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#185A3A] font-black text-sm hover:bg-slate-100 shadow-xl transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-[#185A3A]" />
              <span>{t('Donate to School Projects', 'تبرع لمشاريع المدارس')}</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition-all"
            >
              <span>{t('Inquire About Sponsoring a School', 'استفسر عن كفالة مدرسة كاملة')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Showcase */}
      {selectedPhoto && (
        <Lightbox item={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}

    </div>
  );
}

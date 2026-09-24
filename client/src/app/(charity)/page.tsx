'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  GraduationCap, 
  ArrowRight, 
  ArrowUpRight,
  Sparkles, 
  BookOpen, 
  Users, 
  Building2, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Play, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Eye,
  Plus,
  FlaskConical,
  Lightbulb,
  Mic,
  User
} from 'lucide-react';
import { 
  useCharityNewsList, 
  useCharityGallery, 
  useSchoolSections, 
  usePagesContent 
} from '@/hooks/charity';
import Lightbox from '@/components/charity/public/Lightbox';
import type { CharityGalleryItem, CharityNewsItem } from '@/types/charity';
import { getFileUrl } from '@/lib/utils';

const HERO_IMAGES = [
  '/Her-img1.png',
  '/Her-img2.png',
  '/Her-img3.png',
];

const CHARITY_FAQS = [
  {
    question: 'How are donations utilized and how can I track my impact?',
    answer:
      '100% of public donations directly fund student education, daily nutritious meals, learning materials, and emergency community aid. We maintain transparent financial oversight with regular impact updates shared directly with our donors and sponsors.',
  },
  {
    question: 'How do I sponsor a student at Selam School?',
    answer:
      'You can sponsor a child\'s complete schooling year—covering accredited tuition, uniforms, textbooks, daily balanced lunches, and comprehensive medical checkups through flexible monthly or annual commitments.',
  },
  {
    question: 'Can I schedule a visit to Selam School and facilities?',
    answer:
      'Yes, we warmly welcome visitors, sponsors, and global partners! You can request a guided walkthrough of our school campus and community outreach centers by reaching out through our contact page.',
  },
  {
    question: 'What grade levels and educational programs are offered?',
    answer:
      'Selam School provides values-driven education from Kindergarten through Grade 8 (Middle School), combining rigorous national academic standards with modern STEM labs, digital literacy, and creative arts.',
  },
  {
    question: 'How can I volunteer or contribute professional skills?',
    answer:
      'We welcome passionate volunteers in classroom assistance, vocational training, technology mentorship, and healthcare advocacy. Both on-site in Addis Ababa and remote advisory roles are available based on seasonal initiatives.',
  },
  {
    question: 'Is Selam Charity an officially registered non-profit organization?',
    answer:
      'Yes, Selam Charity & Development Association is a fully licensed, accredited civil society organization operating under regulatory oversight with verified non-governmental humanitarian status.',
  },
];

// Homepage Component
export default function CharityHomePage() {
  const [selectedMedia, setSelectedMedia] = useState<CharityGalleryItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auto loop carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic CMS Data Queries (Only actual data from admin)
  const { data: newsItems = [] } = useCharityNewsList({ status: 'published' });
  const { data: galleryItems = [] } = useCharityGallery();
  const { data: schoolSections } = useSchoolSections();
  const { data: pagesContent } = usePagesContent();

  const introSection = schoolSections?.intro;
  const programsSection = schoolSections?.programs;
  const activitiesSection = schoolSections?.activities;
  const missionPage = pagesContent?.mission;
  const aboutPage = pagesContent?.about;

  // Filter gallery items to top 6 (actual admin data only)
  const previewGallery = galleryItems.slice(0, 6);

  // Only actual published news from admin CMS (no demo items)
  const allArticles = newsItems;

  // Dynamic unique categories derived from actual published articles
  const dynamicCategories = Array.from(
    new Set([
      'ALL',
      ...allArticles.map((a) => (a.category ? a.category.toUpperCase() : 'GENERAL')),
    ])
  );

  // Filtered articles based on selected category
  const filteredArticles =
    selectedNewsCategory === 'ALL'
      ? allArticles
      : allArticles.filter(
          (a) => (a.category ? a.category.toUpperCase() : 'GENERAL') === selectedNewsCategory
        );

  // Top 6 cards for the 3x2 grid
  const displayHotArticles = filteredArticles.slice(0, 6);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          1. HERO SECTION (Looping Background Images & Exact Mockup Layout)
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] md:min-h-screen w-full flex flex-col justify-end overflow-hidden pt-28 sm:pt-36 pb-8 sm:pb-12 select-none">
        
        {/* Background Image Carousel (Loops Her-img1, Her-img2, Her-img3) */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={img}
                alt={`Selam Charity Banner ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Gradient & Vignette Overlays for Maximum Readability */}
        <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/45 via-black/15 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/95 via-black/55 to-transparent z-10 pointer-events-none" />

        {/* Hero Bottom Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
          
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-8 sm:mb-10">
            {/* Left Column Heading */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-bold text-white tracking-tight leading-[1.14]">
                Building Brighter Futures<br />
                Through Education and<br />
                Compassion
              </h1>
            </div>

            {/* Right Column Description */}
            <div className="lg:col-span-5 flex items-end">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
                Our work supports children and families through education, care, and meaningful community initiatives. We create opportunities, strengthen communities, and help those in need build a brighter and more hopeful future.
              </p>
            </div>
          </div>

          {/* Centered Dash / Pill Indicators */}
          <div className="flex items-center justify-center gap-2.5 pt-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const slideIndex = i % HERO_IMAGES.length;
              const isActive = slideIndex === currentSlide;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(slideIndex)}
                  className={`transition-all duration-300 rounded-full h-1.5 focus:outline-none cursor-pointer ${
                    isActive 
                      ? 'w-8 bg-white shadow-sm' 
                      : 'w-6 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. ABOUT US SECTION (Design Inspired by Reference Mockup)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10 xl:gap-14 justify-between">
            
            {/* Left Column: Campus Building Image (Exact 630 * 440) with Floating Glass Effect Overlay (Exact 224 * 330) */}
            <div className="shrink-0 w-full max-w-[630px] h-[440px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-100 bg-slate-100">
              <img
                src="/about-building.jpg"
                alt="Selam Charity & Educational School"
                className="w-full h-full object-cover object-center"
              />

              {/* Floating Frosted Glass Card Overlay (224 * 330) */}
              <div className="absolute right-5 sm:right-7 bottom-5 sm:bottom-7 z-20 w-[224px] h-[330px] rounded-[2rem] p-6 backdrop-blur-xl bg-white/75 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex flex-col justify-between">
                {/* Top Badge: Pill with circle + SELAM */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/90 shadow-2xs border border-slate-100 px-3.5 py-1.5 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-[#185A3A] flex items-center justify-center text-white">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-black tracking-wider text-slate-800">SELAM</span>
                  </div>
                </div>

                {/* Middle: Year / Established info */}
                <div className="my-auto">
                  <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#185A3A]">
                    FROM
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    2010
                  </p>
                </div>

                {/* Bottom: Tagline */}
                <div>
                  <p className="text-xs sm:text-[13px] font-medium text-slate-700 leading-relaxed">
                    Committed to nurturing minds, education, and well-being.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: About Us Content (Structured per inspiration) */}
            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-5 max-w-xl">
              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.18]">
                Welcome to Selam Charity Organization
              </h2>

              {/* Subtitle / Tagline */}
              <p className="text-sm sm:text-base font-semibold text-[#185A3A] tracking-wide -mt-1">
                Empowering Education, Inspiring Change
              </p>

              {/* Paragraph 1: Legal Registration */}
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                Selam Charity Organization has been registered and accorded legal personality with Registry Number 8849 as a Local Organization in accordance with the Civil Society Organizations Proclamation No.1113/2019.
              </p>

              {/* Paragraph 2: Charity Establishment & Primary Focus */}
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                Selam Charity Organization is one of the premier organizations established for charity work in 2010. The main focus of Selam Charity is to empower underprivileged children and youth through comprehensive schooling from Kindergarten through Grade 8, child nutrition and healthcare, and sustainable community support for vulnerable families.
              </p>

              {/* Learn More → Link */}
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#185A3A] hover:text-[#12422a] hover:underline group transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. PROGRAMS SECTION (Design Inspired by Reference Mockup)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#F4F9F6] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Header Row (Two-column layout matching design reference) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            {/* Left Header */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#185A3A]/10 text-[#185A3A] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                OUR PROGRAMS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.14]">
                <span className="text-slate-900 block">Transformative Education</span>
                <span className="text-[#185A3A] block">&amp; Community Solutions</span>
              </h2>
            </div>

            {/* Right Header Description + More Programs Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-start xl:items-center gap-4 lg:max-w-md">
              <p className="text-slate-600 text-sm leading-relaxed">
                Empowering children and families through targeted academic sponsorships, modern STEM facilities, continuous educator training, and community outreach.
              </p>
              <Link
                href="/school#programs"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#185A3A] hover:bg-[#12422a] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md shrink-0 w-fit"
              >
                <span>MORE PROGRAMS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 6 Cards Grid (3 in 1 row, 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                number: '01',
                title: 'Educational Scholarships',
                desc: 'Supporting orphans and underprivileged children with full academic sponsorships, learning materials, and uniforms to ensure zero dropouts.',
                icon: GraduationCap,
                href: '/school#programs',
              },
              {
                number: '02',
                title: 'Research & STEM Support',
                desc: 'Encouraging academic excellence and scientific discovery through modern science laboratories, STEM experiment kits, and library archives.',
                icon: FlaskConical,
                href: '/school#programs',
              },
              {
                number: '03',
                title: 'Training & Skills Programs',
                desc: 'Equipping educators and young learners with essential pedagogy, digital literacy, and foundational vocational skills for personal and career growth.',
                icon: Award,
                href: '/school#programs',
              },
              {
                number: '04',
                title: 'Guided Academic Tutorials',
                desc: 'Enhancing classroom performance and self-confidence through personalized after-school tutoring, remedial learning, and mentor guidance.',
                icon: Lightbulb,
                href: '/school#programs',
              },
              {
                number: '05',
                title: 'Seminars & Workshops',
                desc: 'Promoting community empowerment, parental engagement, and child health awareness through interactive seminars and skill workshops.',
                icon: Users,
                href: '/school#programs',
              },
              {
                number: '06',
                title: 'Conferences & Forums',
                desc: 'Creating enriching platforms for inter-school academic symposiums, student debate tournaments, and community partnership networking.',
                icon: Mic,
                href: '/school#programs',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[2rem] p-7 sm:p-8 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Top Row: Number Badge + Title */}
                    <div className="flex items-center gap-3.5 mb-6">
                      <span className="w-9 h-9 rounded-full bg-[#185A3A] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {card.number}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-[#185A3A] transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    {/* Center Icon in soft circle */}
                    <div className="my-6 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-[#185A3A] group-hover:bg-[#185A3A] group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <Icon className="w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-300" strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Description Text */}
                    <p className="text-slate-500 text-xs sm:text-sm text-center leading-relaxed mb-6 px-1">
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom Link: LEARN MORE */}
                  <div className="pt-4 border-t border-slate-100/80 flex items-center justify-center">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#185A3A] group-hover:text-[#12422a] group-hover:gap-2 transition-all"
                    >
                      <span>LEARN MORE</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. OUR GUIDING PURPOSE (Black Aesthetic / Exact Design Inspiration)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 bg-[#0a0a0c] text-white relative overflow-hidden">
        {/* Subtle background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Header Row Matching Design Inspiration */}
          <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-6 mb-16 lg:mb-20">
            {/* Left Header Column */}
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-[1.12]">
                What is our{' '}
                <span className="inline-flex items-center justify-center align-middle mx-1 text-white/80">
                  <svg
                    className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 inline-block align-middle"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.4" />
                    <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>{' '}
                priority?
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-lg font-light leading-relaxed">
                {missionPage?.content ||
                  'Dedicated to breaking cycles of poverty through dignified schooling, health advocacy, and sustainable community empowerment.'}
              </p>

              <div className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors group"
                >
                  <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-normal underline underline-offset-4 decoration-white/40 group-hover:decoration-white">
                    Explore our mission
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Header Column */}
            <div className="flex flex-col items-start lg:items-end justify-start gap-3 pt-2">
              <p className="text-zinc-400 text-xs sm:text-sm font-light">
                Discover our 4 core pillars of humanitarian impact
              </p>
              <Link
                href="/contact?intent=support"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-xs sm:text-sm font-normal hover:bg-white/10 hover:border-white/40 transition-all duration-200 group"
              >
                <span>Schedule a visit</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block ml-0.5 group-hover:scale-125 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 4 Cards Grid - Exact Design Inspiration with Background Images & Diagonal Cutouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-end">
            
            {/* Card 01: Quality Education (Dark Obsidian Card with Background Image & Diagonal Cut) */}
            <Link
              href="/school"
              className="h-[480px] sm:h-[510px] flex flex-col justify-between p-6 sm:p-7 rounded-[30px] bg-[#141417] text-white border border-white/10 hover:border-white/25 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-black/70"
            >
              {/* Background Image Layer with diagonal cut at bottom right */}
              <div
                className="absolute inset-0 z-0 overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 90px), calc(100% - 90px) 100%, 0 100%)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                  alt="Quality Education"
                  className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700 ease-out opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#141417] via-[#141417]/70 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141417] via-[#141417]/40 to-transparent pointer-events-none" />
              </div>

              {/* Top Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-2xl sm:text-[26px] font-normal tracking-tight leading-[1.18] whitespace-pre-line text-white">
                    Quality{'\n'}education
                  </h3>
                  <span className="text-xs font-mono font-medium text-white/50 tracking-wider">
                    01
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300/90 mt-4 leading-relaxed line-clamp-3 font-light">
                  Accredited schooling, learning materials &amp; STEM equipment for young minds.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 font-normal underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-all">
                    <span>Start the journey</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Spacer */}
              <div className="relative z-10" />

              {/* Bottom-Right Diagonal Cutout Action Button */}
              <div className="absolute bottom-4 right-4 z-20">
                <span className="w-11 h-11 rounded-full bg-[#202026] border border-white/10 text-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#185A3A] group-hover:border-[#185A3A] group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>

            {/* Card 02: Child Nutrition & Health (Light Off-White Card with Background Image & Diagonal Cut) */}
            <Link
              href="/about"
              className="h-[480px] sm:h-[510px] flex flex-col justify-between p-6 sm:p-7 rounded-[30px] bg-[#ededf0] text-zinc-900 border border-zinc-200/80 hover:border-zinc-300 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-white/5"
            >
              {/* Lower Background Image Layer with rounded-t-2xl and diagonal cut at bottom right matching reference */}
              <div
                className="absolute inset-x-0 bottom-0 top-[220px] z-0 overflow-hidden rounded-t-2xl"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 90px), calc(100% - 90px) 100%, 0 100%)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Child Nutrition and Health"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Top Content (Clean typography on solid off-white background) */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-2xl sm:text-[26px] font-normal tracking-tight leading-[1.18] whitespace-pre-line text-zinc-900">
                    Child nutrition{'\n'}&amp; health
                  </h3>
                  <span className="text-xs font-mono font-medium text-zinc-500 tracking-wider">
                    02
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 mt-4 leading-relaxed line-clamp-3 font-light">
                  Ensuring every child receives balanced meals, clean water, and regular medical checkups.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-800 font-normal underline underline-offset-4 decoration-zinc-400 group-hover:decoration-zinc-900 transition-all">
                    <span>Learn about health</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Spacer */}
              <div className="relative z-10" />

              {/* Bottom-Right Diagonal Cutout Action Button */}
              <div className="absolute bottom-4 right-4 z-20">
                <span className="w-11 h-11 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#185A3A] group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>

            {/* Card 03: Community Resilience* (Hero Elevated Slate Card with Crisp White Frame & Diagonal Cut) */}
            <Link
              href="/contact?intent=support"
              className="h-[480px] sm:h-[510px] rounded-[30px] bg-white p-[2.5px] border border-white/90 relative overflow-hidden group transition-all duration-500 lg:-translate-y-4 shadow-2xl hover:shadow-black/80 flex flex-col justify-between"
            >
              {/* Dark Inner Card Clipped Diagonally to Expose Solid White Corner */}
              <div
                className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#18181c] p-6 sm:p-7 flex flex-col justify-between"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 90px), calc(100% - 90px) 100%, 0 100%)',
                }}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                    alt="Community Resilience"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#18181c] via-[#18181c]/80 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#18181c] via-[#18181c]/60 to-transparent pointer-events-none" />
                </div>

                {/* Top Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-2xl sm:text-[26px] font-normal tracking-tight leading-[1.18] whitespace-pre-line text-white">
                      Community{'\n'}resilience*
                    </h3>
                    <span className="text-xs font-mono font-medium text-white/50 tracking-wider">
                      03
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300/80 mt-4 leading-relaxed line-clamp-3 font-light">
                    Emergency humanitarian relief, family aid packages, and long-term community strength.
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-200 font-normal underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-all">
                      <span>View relief work</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Bottom Left Note (matching *2 forms of coverage from reference) */}
                <div className="relative z-10">
                  <span className="text-[11px] text-zinc-400 font-mono tracking-wider">
                    *Immediate aid &amp; support
                  </span>
                </div>
              </div>

              {/* Bottom-Right White Cutout Corner Action Button */}
              <div className="absolute bottom-4 right-4 z-20">
                <span className="w-11 h-11 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#185A3A] group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>

            {/* Card 04: Vocational Empowerment (Dark Slate Card with Background Image & Diagonal Cut) */}
            <Link
              href="/school#programs"
              className="h-[480px] sm:h-[510px] flex flex-col justify-between p-6 sm:p-7 rounded-[30px] bg-[#141417] text-white border border-white/10 hover:border-white/25 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-black/70"
            >
              {/* Background Image Layer with diagonal cut at bottom right */}
              <div
                className="absolute inset-0 z-0 overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 90px), calc(100% - 90px) 100%, 0 100%)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80"
                  alt="Vocational and Youth Empowerment"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#141417] via-[#141417]/75 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141417] via-[#141417]/50 to-transparent pointer-events-none" />
              </div>

              {/* Top Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-2xl sm:text-[26px] font-normal tracking-tight leading-[1.18] whitespace-pre-line text-white">
                    Vocational{'\n'}empowerment
                  </h3>
                  <span className="text-xs font-mono font-medium text-white/50 tracking-wider">
                    04
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300/90 mt-4 leading-relaxed line-clamp-3 font-light">
                  Carpentry, craft tailoring, digital literacy, and sustainable livelihood mentorship.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300 font-normal underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-all">
                    <span>Discover programs</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Spacer */}
              <div className="relative z-10" />

              {/* Bottom-Right Diagonal Cutout Action Button */}
              <div className="absolute bottom-4 right-4 z-20">
                <span className="w-11 h-11 rounded-full bg-[#202026] border border-white/10 text-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#185A3A] group-hover:border-[#185A3A] group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. SCHOOL SPOTLIGHT & PROGRAMS
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                Center of Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {introSection?.title || 'Selam School: Inspiring Young Minds'}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {introSection?.content || 
                  'Our school provides value-based education combining academic distinction with personal character building. From early childhood development to advanced middle school sciences, we nurture curious and confident scholars.'}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Comprehensive Kindergarten to Grade 8 curriculum',
                  'Dedicated STEM labs and digital computer facilities',
                  'Co-curricular clubs: Debate, Sports, Arts, and Science',
                  'Daily student meal assistance & tutoring support',
                ].map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/school"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  <span>Explore Academic Programs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Academic Programs Grid */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {[
                {
                  title: 'Early Childhood (KG)',
                  desc: 'Play-based foundational learning focusing on early literacy, curiosity, and social development.',
                  icon: BookOpen,
                  badge: 'Ages 4-6',
                },
                {
                  title: 'Primary School (Grades 1-4)',
                  desc: 'Core competencies in mathematics, science, language, and cultural understanding.',
                  icon: GraduationCap,
                  badge: 'Grades 1-4',
                },
                {
                  title: 'Middle School (Grades 5-8)',
                  desc: 'In-depth STEM education, lab practicals, critical reasoning, and national exam readiness.',
                  icon: Building2,
                  badge: 'Grades 5-8',
                },
                {
                  title: 'Enrichment & Tutoring',
                  desc: 'Targeted support, language clubs, library reading circles, and student mentorship.',
                  icon: Users,
                  badge: 'All Grades',
                },
              ].map((prog, idx) => {
                const Icon = prog.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {prog.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-2">{prog.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{prog.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. "HOT THIS WEEK" MAGAZINE SECTION (Interactive CMS Feed)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-sans">
                Hot this week<span className="text-[#e11d48] font-black inline-block ml-1">_</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#185A3A] hover:text-[#12422a] transition-colors group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Filter Pills (Horizontal Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar select-none">
            {dynamicCategories.map((cat) => {
              const isActive = selectedNewsCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedNewsCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#185A3A] text-white shadow-sm ring-2 ring-[#185A3A]/20 scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 3 Columns x 2 Rows Grid (6 Cards) */}
          {displayHotArticles.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-slate-500 text-sm">
                {allArticles.length === 0
                  ? 'No news articles have been published yet. Articles published via the admin panel will appear here.'
                  : `No articles found in category "${selectedNewsCategory}".`}
              </p>
              {allArticles.length > 0 && selectedNewsCategory !== 'ALL' && (
                <button
                  onClick={() => setSelectedNewsCategory('ALL')}
                  className="mt-3 text-xs font-bold text-[#185A3A] hover:underline"
                >
                  Reset to ALL
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {displayHotArticles.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Image Container with 16:10 ratio & Badge Pill */}
                  <Link href={`/news/${article.slug || article.id}`} className="block">
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <img
                        src={article.featuredImageUrl ? getFileUrl(article.featuredImageUrl) : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {/* Vibrant Red Category Badge Pill (matching design) */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#e11d48] text-white shadow-md">
                          {article.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Bold 2-line Title */}
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2 mt-3.5 group-hover:text-[#185A3A] transition-colors">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Meta Details: Author + Date */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2.5 font-medium">
                    <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{article.authorName || article.authorId || 'Selam Team'}</span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. GALLERY PREVIEW
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
                Visual Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                Life at Selam Charity &amp; School
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {previewGallery.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-slate-400 text-sm">Media assets will appear here once uploaded via the CMS.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {previewGallery.map((item: CharityGalleryItem) => (
                <div

                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 shadow-md"
                >
                  <img
                    src={getFileUrl(item.thumbnailUrl || item.mediaUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  
                  {item.mediaType === 'video' && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                      {item.category || 'Campus Life'}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-200 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-white text-zinc-900 border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Header Row Matching Design Inspiration */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <span className="inline-flex items-center px-4 py-1 rounded-full border border-zinc-300 text-xs font-semibold tracking-wider text-zinc-700 bg-zinc-50 uppercase">
                FAQ
              </span>
            </div>
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-normal text-zinc-900 tracking-tight leading-[1.28]">
                We’ve gathered the most frequently asked questions in one place. Find clear answers so nothing is left unclear.
              </h2>
            </div>
          </div>

          {/* Two-Column Grid: Left Image & Right Accordion FAQs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Rounded Image */}
            <div className="lg:col-span-5 h-full">
              <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-[32px] overflow-hidden shadow-lg shadow-zinc-200/60 bg-zinc-100">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
                  alt="Selam Charity & School Students"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Column: FAQ Accordion Items */}
            <div className="lg:col-span-7 flex flex-col space-y-3.5">
              {CHARITY_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'border-zinc-300 bg-zinc-50/70 shadow-sm'
                        : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-[15px] font-medium text-zinc-900 pr-4 leading-snug group-hover:text-emerald-700 transition-colors">
                        {faq.question}
                      </span>
                      <span
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111] text-white flex items-center justify-center shrink-0 transition-transform duration-300 shadow-sm group-hover:scale-105"
                      >
                        <Plus
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                          }`}
                        />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed font-light border-t border-zinc-200/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Row Matching Reference: "Still have some questions? Get in touch ↗" */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-zinc-200/80 mt-14">
            <p className="text-base sm:text-lg font-normal text-zinc-900">
              Still have some questions?
            </p>
            <Link
              href="/contact?intent=support"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-medium shadow-md shadow-sky-500/25 hover:scale-105 transition-all duration-200"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Lightbox for gallery preview click */}
      <Lightbox item={selectedMedia} onClose={() => setSelectedMedia(null)} />

    </div>
  );
}

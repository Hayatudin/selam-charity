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
  Clock, 
  ShieldCheck, 
  Award,
  FlaskConical,
  Laptop,
  Trophy,
  Utensils
} from 'lucide-react';
import { useSchoolSections } from '@/hooks/charity';
import Lightbox from '@/components/charity/public/Lightbox';

export default function CharitySchoolPage() {
  const { data: schoolSections, isLoading } = useSchoolSections();
  const [activeTab, setActiveTab] = useState<'programs' | 'activities' | 'facilities'>('programs');

  const intro = schoolSections?.intro;
  const programs = schoolSections?.programs;
  const activities = schoolSections?.activities;
  const facilities = schoolSections?.facilities;

  const defaultPrograms = [
    { name: 'Early Childhood Education (KG)', description: 'Play-based foundational learning focusing on early literacy, curiosity, and socialization.' },
    { name: 'Primary School (Grades 1-4)', description: 'Building fundamental literacy, mathematics, and natural science competencies with individualized guidance.' },
    { name: 'Middle School (Grades 5-8)', description: 'Advanced subject preparation, laboratory experiments, English fluency, and critical reasoning.' },
    { name: 'Special Support & Tutoring', description: 'After-school tutoring, nutritional meal support, and mentoring for vulnerable children.' },
  ];

  const defaultActivities = [
    { name: 'Debate & Public Speaking', schedule: 'Tuesdays & Thursdays', desc: 'Cultivating eloquence, critical thought, and persuasive discourse.' },
    { name: 'Football & Athletics Club', schedule: 'Wednesdays & Saturdays', desc: 'Promoting teamwork, physical fitness, discipline, and competitive spirit.' },
    { name: 'Art & Cultural Performance', schedule: 'Fridays', desc: 'Exploring traditional and contemporary painting, theater, and music.' },
    { name: 'Science & Robotics Exploration', schedule: 'Mondays', desc: 'Hands-on experimentation, coding fundamentals, and environmental projects.' },
  ];

  const defaultFacilities = [
    { name: 'Science & Biology Laboratory', desc: 'Equipped with microscopes, lab glassware, and safety equipment for experiential discovery.', icon: FlaskConical },
    { name: 'Digital Computer Lab', desc: 'Modern workstations providing digital literacy, coding basics, and educational research.', icon: Laptop },
    { name: 'Campus Library & Study Hall', desc: 'Extensive collection of books, story readers, textbooks, and quiet reading areas.', icon: BookOpen },
    { name: 'Sports Field & Courtyard', desc: 'Spacious outdoor arena for football, running tracks, and recreational play.', icon: Trophy },
    { name: 'Student Dining & Nutrition Hall', desc: 'Hygienic kitchen and cafeteria providing daily balanced meals and clean drinking water.', icon: Utensils },
  ];

  const currentPrograms = programs?.metadata?.programsList || defaultPrograms;
  const currentActivities = activities?.metadata?.activitiesList || defaultActivities;
  const currentFacilities = facilities?.metadata?.facilitiesList || defaultFacilities;

  return (
    <div className="flex flex-col w-full">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Center of Excellence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {intro?.title || 'Welcome to Selam School'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {intro?.subtitle || 'Nurturing minds, inspiring character, and equipping the next generation with knowledge, empathy, and leadership.'}
          </p>
        </div>
      </section>

      {/* ── SCHOOL OVERVIEW & METRICS ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                School Introduction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                An Inspiring Environment Where Every Child Thrives
              </h2>
              <div className="prose prose-slate text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  {intro?.content || 
                    'Selam School provides holistic, value-based education for children, fostering intellectual growth, creativity, and moral integrity. Our classrooms are designed to cultivate critical thinking, curiosity, and compassion.'}
                </p>
                <p>
                  We blend rigorous academic curricula certified by the Ministry of Education with active co-curricular engagement, 
                  nutritional meal provisions, and health monitoring. Our teachers are passionately dedicated to instilling a lifelong love of learning.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact?intent=admissions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                >
                  <span>Admission &amp; Enrollment Inquiries</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                <p className="text-3xl sm:text-4xl font-black text-emerald-800">
                  {intro?.metadata?.studentCapacity || 650}+
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">Student Capacity</p>
              </div>
              <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 text-center">
                <p className="text-3xl sm:text-4xl font-black text-teal-800">
                  {intro?.metadata?.teacherCount || 42}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">Certified Educators</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-3xl sm:text-4xl font-black text-slate-800">
                  {intro?.metadata?.establishedYear || 2012}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">Established Year</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                <p className="text-xl sm:text-2xl font-black text-amber-800">
                  KG - Grade 8
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">Grades Covered</p>
              </div>
            </div>
          </div>

          {/* ── SECTION NAV TABS ─────────────────────────────────── */}
          <div className="flex items-center justify-center border-b border-slate-200 mb-12">
            <div className="flex gap-2 sm:gap-6">
              {[
                { key: 'programs', label: 'Academic Programs', icon: BookOpen },
                { key: 'activities', label: 'Activities & Clubs', icon: Trophy },
                { key: 'facilities', label: 'Campus Facilities', icon: Building2 },
              ].map((tab) => {
                const active = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 pb-4 px-2 sm:px-4 text-sm font-bold border-b-2 transition-all ${
                      active
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TAB CONTENT: PROGRAMS ────────────────────────────── */}
          {activeTab === 'programs' && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {currentPrograms.map((prog: any, idx: number) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{prog.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{prog.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB CONTENT: ACTIVITIES ──────────────────────────── */}
          {activeTab === 'activities' && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {currentActivities.map((act: any, idx: number) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                      <Trophy className="w-5 h-5" />
                    </div>
                    {act.schedule && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {act.schedule}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{act.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {act.desc || 'Promoting leadership, team problem-solving, and personal enrichment.'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB CONTENT: FACILITIES ──────────────────────────── */}
          {activeTab === 'facilities' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {currentFacilities.map((fac: any, idx: number) => {
                const Icon = fac.icon || Building2;
                return (
                  <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{fac.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── ADMISSIONS BANNER ───────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-3xl font-black">Interested in Enrolling Your Child?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Selam School welcomes applications across Kindergarten through Grade 8. 
            Scholarships and meal support are provided for families facing hardship.
          </p>
          <div className="pt-2">
            <Link
              href="/contact?intent=admissions"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30"
            >
              <span>Contact Admissions Office</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Award, 
  Heart, 
  Users, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Quote,
  GraduationCap,
  Briefcase,
  Star,
  Plus,
  X,
  Mail
} from 'lucide-react';
import { usePagesContent } from '@/hooks/charity';

export default function CharityAboutPage() {
  const { data: pagesContent, isLoading } = usePagesContent();
  const about = pagesContent?.about;
  const mission = pagesContent?.mission;
  const general = pagesContent?.general;

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    role: string;
    category: 'board' | 'management';
    desc: string;
    fullBio: string;
    image: string;
    credentials?: string[];
    email?: string;
    linkedin?: string;
  } | null>(null);

  return (
    <div className="flex flex-col w-full">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage &amp; Commitment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {about?.title || 'About Selam Charity Organization'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {about?.subtitle || 'Dedicated to empowering communities, transforming lives, and fostering enduring hope across Ethiopia.'}
          </p>
        </div>
      </section>

      {/* ── 1. BACKGROUND ─────────────────────────────────────────── */}
      <section id="background" className="py-20 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Founding Background
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Rooted in Compassion, Driven by Measurable Impact
              </h2>
              <div className="prose prose-slate text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed">
                <p>
                  {about?.content || 
                    'Founded with a commitment to humanitarian excellence, Selam Charity operates community development, educational scholarships, and emergency aid across regions in need. We believe every person deserves dignity, opportunity, and the resources to thrive.'}
                </p>
                <p>
                  Over the past decade, we have expanded from grassroots child relief into an integrated ecosystem encompassing 
                  formal schooling, vocational development, nutritious meal provisions, and health outreach. 
                  Our flagship institution, Selam School, provides high-caliber education to over 650 bright young minds.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-black text-emerald-700">2010</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Year Established</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-2xl font-black text-emerald-700">100%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Accountable Governance</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img
                  src={about?.bannerImageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'}
                  alt="Selam Charity Outreach"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Registered Civil Society</p>
                    <p className="text-[11px] text-slate-500">Certified by the Ethiopian CSO Authority (#8849)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. OUR OBJECTIVES ──────────────────────────────────────── */}
      <section id="objectives" className="py-20 bg-slate-50 border-y border-slate-200/80 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
              Strategic Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Our Objectives
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Clear, targeted commitments delivering sustainable improvements for children and vulnerable families.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Objective 1 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Quality Education
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provide comprehensive, values-driven schooling from Kindergarten through Grade 8, ensuring zero dropouts due to financial hardship.
              </p>
            </div>

            {/* Objective 2 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                Child Nutrition &amp; Care
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guarantee daily balanced meals, clinical checkups, and hygiene support for every student to safeguard child development.
              </p>
            </div>

            {/* Objective 3 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                Community Empowerment
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Offer vocational training and livelihood micro-grants to widowed mothers and guardian families to foster economic autonomy.
              </p>
            </div>

            {/* Objective 4 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                Emergency Relief
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Deploy rapid humanitarian relief, food aid, and warm clothing to communities affected by drought and sudden crisis.
              </p>
            </div>

          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission Statement</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {mission?.metadata?.missionStatement || 
                  'To uplift disadvantaged children and families through sustainable education, healthcare access, and economic support, unlocking human potential with dignity and empathy.'}
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision Statement</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {mission?.metadata?.visionStatement || 
                  'A resilient, empowered society where every individual has equal opportunity to realize their full potential in peace, justice, and self-reliance.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. OUR PEOPLE (BOARD MEMBERS & MANAGEMENT TEAM) ─────────── */}
      <section id="members" className="relative py-24 bg-[#fafbff] overflow-hidden scroll-mt-24 border-t border-slate-200/60">
        {/* Soft pastel ambient background glow inspired by design */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-purple-50/30 to-transparent pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">

          {/* ════════ SUBSECTION A: BOARD MEMBERS ════════ */}
          <div id="board" className="scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-slate-800 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span>Strategic Governance</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Meet the<br />board of trustees
                </h2>
              </div>
              <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed">
                The fiduciary stewards, legal advocates, and community elders providing ethical oversight, institutional integrity, and long-term sustainability to Selam Charity.
              </p>
            </div>

            {/* Board Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {[
                {
                  name: 'Ustaz Ahmed Nur',
                  role: 'Board President & Founder',
                  category: 'board' as const,
                  desc: 'Over 20 years guiding educational philanthropy, Islamic scholarship, and institutional governance across East Africa.',
                  fullBio: 'Ustaz Ahmed Nur founded Selam Charity with the unyielding conviction that every child deserves equitable education, nutritious food, and dignified support. With over two decades of nonprofit stewardship, he oversees high-level strategic alignment, international diaspora partnerships, and institutional integrity.',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                  credentials: ['M.A. in Non-Profit Governance', 'Fellow, East Africa Civil Society Forum', '20+ Years Community Leadership'],
                  email: 'president@selamcharity.org'
                },
                {
                  name: 'Dr. Selamawit Bekele',
                  role: 'Vice President & Legal Counsel',
                  category: 'board' as const,
                  desc: 'Constitutional jurist specializing in NGO regulatory compliance, child welfare rights, and international trust governance.',
                  fullBio: 'Dr. Selamawit brings 16 years of legal expertise in civil society law, institutional compliance, and human rights advocacy. She ensures that all Selam operations strictly adhere to federal regulatory frameworks while championing child protection policies.',
                  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                  credentials: ['Ph.D. in International Law', 'Member, Ethiopian Bar Association', 'Child Rights Legal Consultant'],
                  email: 'legal@selamcharity.org'
                },
                {
                  name: 'Sheikh Mohammed Al-Amoudi',
                  role: 'Senior Ethics & Community Trustee',
                  category: 'board' as const,
                  desc: 'Prominent community mediator ensuring equitable Zakat distribution, moral stewardship, and grassroots consensus.',
                  fullBio: 'A respected elder and religious scholar, Sheikh Mohammed oversees ethical vetting of social programs, zakat distribution criteria, and interfaith harmony initiatives, anchoring Selam’s programs in empathy and communal trust.',
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
                  credentials: ['Senior Scholar in Islamic Jurisprudence', 'Interfaith Peace Ambassador', '30+ Years Civic Mediation'],
                  email: 'ethics@selamcharity.org'
                },
                {
                  name: 'Eng. Dawit Haile',
                  role: 'Trustee of Capital & Infrastructure',
                  category: 'board' as const,
                  desc: 'Supervising school campus construction, water well drilling, and solar energy installations across remote communities.',
                  fullBio: 'Eng. Dawit provides strategic technical supervision for Selam’s physical expansion, overseeing architectural resilience, clean water facilities, modern classrooms, and sustainable green campus structures.',
                  image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
                  credentials: ['M.Sc. Structural Engineering', 'Registered Professional Engineer (PE)', 'Lead Designer, Selam Academic Complex'],
                  email: 'infrastructure@selamcharity.org'
                },
                {
                  name: 'Dr. Meron Tadesse',
                  role: 'Health Strategy & Welfare Trustee',
                  category: 'board' as const,
                  desc: 'Pediatric consultant leading student nutritional policies, vaccination campaigns, and medical emergency funds.',
                  fullBio: 'Dr. Meron is an associate professor of pediatric medicine and healthcare consultant who oversees Selam’s community wellness, vaccination tracking, and clean feeding programs for underprivileged children.',
                  image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
                  credentials: ['M.D. Pediatrics & Child Health', 'Advisor, Maternal & Child Health Taskforce', '15+ Years Clinical Research'],
                  email: 'health.trustee@selamcharity.org'
                },
                {
                  name: 'Ato Yonas Assefa',
                  role: 'Audit & Sustainability Committee Chair',
                  category: 'board' as const,
                  desc: 'Senior financial auditor maintaining donor transparency, independent audits, and endowment longevity.',
                  fullBio: 'With 22 years of forensic auditing experience across international NGOs and financial institutions, Ato Yonas leads the independent audit committee, publishing full transparent accounting for all funds received.',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
                  credentials: ['Certified Public Accountant (CPA)', 'Former Lead Auditor, Pan-African NGO Alliance', 'Expert in Endowment Accounting'],
                  email: 'audit@selamcharity.org'
                }
              ].map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMember(member)}
                  className="group relative aspect-[4/5] rounded-[28px] overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                  {/* Monochromatic portrait image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter grayscale contrast-105 brightness-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />

                  {/* Gradient overlay for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Top indicator tag */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-semibold tracking-wide text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      Board Trustee
                    </span>
                  </div>

                  {/* Bottom content row: Name & Role on left, white round + button on right */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
                    <div className="min-w-0 pr-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug truncate drop-shadow-sm">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-normal truncate mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {/* Floating White Plus Button */}
                    <button
                      type="button"
                      aria-label={`View bio of ${member.name}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-950 flex-shrink-0 flex items-center justify-center shadow-lg group-hover:bg-emerald-400 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* ════════ SUBSECTION B: MANAGEMENT TEAM ════════ */}
          <div id="management" className="scroll-mt-28 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-slate-800 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Our expert crew</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Meet the<br />leadership team
                </h2>
              </div>
              <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed">
                The devoted operational directors, educators, and field specialists who turn donor generosity into everyday classroom success and community transformation.
              </p>
            </div>

            {/* Management Team Grid - 8 Cards matching the 4x2 grid of the user design inspiration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {[
                {
                  name: 'Zemedkun Fikre',
                  role: 'Chief Executive Director',
                  category: 'management' as const,
                  desc: 'Guiding daily operations, cross-departmental coordination, and strategic program delivery across Ethiopia.',
                  fullBio: 'Zemedkun leads day-to-day operations across Selam Charity. He coordinates cross-functional teams, drives resource mobilization, and ensures that every educational and humanitarian project achieves tangible, measurable community outcomes.',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
                  credentials: ['M.Sc. in Organizational Leadership', '12+ Years Executive NGO Management', 'Project Management Professional (PMP)'],
                  email: 'director@selamcharity.org'
                },
                {
                  name: 'Sister Fatima Al-Hassan',
                  role: 'Head of School Administration',
                  category: 'management' as const,
                  desc: 'Leading teacher training, modern curriculum standards, and inclusive child pedagogy at Selam School.',
                  fullBio: 'Sister Fatima oversees the educational ecosystem of Selam School, nurturing over 1,200 students with inclusive learning standards, STEM programs, and character-building extracurriculars.',
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                  credentials: ['B.Ed. & M.Ed. Educational Leadership', 'Distinguished Educator Award 2023', 'Specialist in Child Pedagogy'],
                  email: 'school@selamcharity.org'
                },
                {
                  name: 'Dr. Ibrahim Mohammed',
                  role: 'Director of Community Health',
                  category: 'management' as const,
                  desc: 'Managing school wellness clinics, nutritional meal distribution, and emergency pediatric care.',
                  fullBio: 'Dr. Ibrahim runs the on-campus health clinic and community outreach brigades, providing regular health checkups, dental screening, and daily nutrient-dense meal plans for vulnerable students.',
                  image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
                  credentials: ['Medical Doctor (M.D.)', 'Postgraduate Diploma in Tropical Medicine', '10+ Years Field Medical Experience'],
                  email: 'health@selamcharity.org'
                },
                {
                  name: 'Zahra Abdurrahman',
                  role: 'Community Outreach Coordinator',
                  category: 'management' as const,
                  desc: 'Managing student orphan sponsorships, family welfare evaluations, and donor progress reporting.',
                  fullBio: 'Zahra connects sponsors with orphaned and disadvantaged students, providing individualized progress reports and coordinating direct livelihood stipends to underprivileged families.',
                  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
                  credentials: ['B.A. in Social Work & Community Welfare', 'Orphan Care Liaison Certified', 'Fluency in 4 Regional Languages'],
                  email: 'sponsorship@selamcharity.org'
                },
                {
                  name: 'Tewodros Kassaye',
                  role: 'Chief Financial Officer',
                  category: 'management' as const,
                  desc: 'Overseeing transparent bookkeeping, procurement integrity, and international grant escrow management.',
                  fullBio: 'Tewodros handles financial transparency and statutory audit reporting. His meticulous stewardship ensures that every birr and foreign currency donation is accounted for and maximized.',
                  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
                  credentials: ['B.Sc. Accounting & Finance, ACCA', '14+ Years Financial Systems Administration', 'Audited 50+ Major Donor Grants'],
                  email: 'finance@selamcharity.org'
                },
                {
                  name: 'Rahel Solomon',
                  role: 'Director of Vocational Programs',
                  category: 'management' as const,
                  desc: 'Empowering disadvantaged youth and single mothers through trade skills, sewing, and micro-grants.',
                  fullBio: 'Rahel leads vocational training workshops that transition vulnerable youths and mothers into economic self-reliance, graduating hundreds of skilled artisans and entrepreneurs every year.',
                  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
                  credentials: ['M.A. Sustainable Socioeconomic Development', 'Certified Enterprise Incubator Coach', 'Women Empowerment Advocate'],
                  email: 'vocational@selamcharity.org'
                },
                {
                  name: 'Bilal Kedir',
                  role: 'Head of Operations & Logistics',
                  category: 'management' as const,
                  desc: 'Coordinating emergency relief fleets, educational material shipments, and campus facilities.',
                  fullBio: 'Bilal coordinates field supply chains and rapid response teams, delivering emergency food parcels, textbooks, and essential supplies across remote communities during crises.',
                  image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
                  credentials: ['B.Sc. Supply Chain & Logistics', 'Certified Humanitarian Logistics Specialist', 'Field Security Coordinator'],
                  email: 'operations@selamcharity.org'
                },
                {
                  name: 'Hanif Jemal',
                  role: 'Digital Communications Lead',
                  category: 'management' as const,
                  desc: 'Capturing field stories, multimedia documentaries, and transparent digital donor portals.',
                  fullBio: 'Hanif bridges Selam’s on-the-ground work with our international donor community, managing multi-channel digital transparency, video documentaries, and online donor verification portals.',
                  image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
                  credentials: ['B.Sc. Information Systems & Media', 'Digital Storyteller & Documentary Producer', 'Tech for Good Enthusiast'],
                  email: 'media@selamcharity.org'
                }
              ].map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMember(member)}
                  className="group relative aspect-[4/5] rounded-[28px] overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                  {/* Monochromatic portrait image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter grayscale contrast-105 brightness-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />

                  {/* Gradient overlay for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Bottom content row: Name & Role on left, white round + button on right */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
                    <div className="min-w-0 pr-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug truncate drop-shadow-sm">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-normal truncate mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {/* Floating White Plus Button */}
                    <button
                      type="button"
                      aria-label={`View bio of ${member.name}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-950 flex-shrink-0 flex items-center justify-center shadow-lg group-hover:bg-emerald-400 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── BIOGRAPHY DETAIL MODAL ──────────────────────────────── */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Side */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-900 flex-shrink-0">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-3 left-4 md:hidden text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {selectedMember.category === 'board' ? 'Board of Trustees' : 'Management Team'}
                  </span>
                </div>
              </div>

              {/* Information Side */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                <div>
                  <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
                    {selectedMember.category === 'board' ? 'Board of Trustees' : 'Management Team'}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-600 mt-0.5">
                    {selectedMember.role}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Biography &amp; Contribution
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedMember.fullBio}
                    </p>
                  </div>

                  {selectedMember.credentials && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Credentials &amp; Milestones
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedMember.credentials.map((cred, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedMember.email}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="ml-auto px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 4. TESTIMONIALS ───────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-slate-50 border-y border-slate-200/80 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
              Voices of Hope
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Testimonials &amp; Stories
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Real stories from students, parents, and community members impacted by Selam Charity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'Before Selam School, I could not afford uniforms or textbooks for my two children. Today, both are excelling in their classes and receive healthy lunch every day. Selam gave our family renewed hope.',
                author: 'Maryam Tadesse',
                role: 'Parent of Grade 4 & 6 Students',
                stars: 5,
              },
              {
                quote: 'The teachers at Selam School do not just teach us science and math; they teach us values, kindness, and to dream big. Having access to the modern computer lab changed my life.',
                author: 'Bilal Kedir',
                role: 'Grade 8 Graduate & Scholarship Recipient',
                stars: 5,
              },
              {
                quote: 'Selam Charity is a true cornerstone for our community. Their nutritional programs during challenging seasons have kept hundreds of children healthy, active, and eager to learn.',
                author: 'Elder Dawit Kebede',
                role: 'Community Council Elder',
                stars: 5,
              },
            ].map((test, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: test.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <p className="text-sm font-bold text-slate-900">{test.author}</p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">{test.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── ACCREDITATION & GOVERNANCE ───────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black">Legal Accreditation &amp; Governance</h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {general?.content || 
              'Selam Charity is an officially registered civil society organization operating under the strict regulatory oversight of the Ethiopian Civil Society Organizations Authority. We undergo annual independent audits and publish our impact findings.'}
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-400">
            Registration No: {general?.metadata?.registrationNumber || 'CSO-ETH-2010-8849'} • Tax-Exempt Non-Profit Status
          </div>
        </div>
      </section>

    </div>
  );
}

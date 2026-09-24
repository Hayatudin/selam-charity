'use client';

import React from 'react';
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
  Star
} from 'lucide-react';
import { usePagesContent } from '@/hooks/charity';

export default function CharityAboutPage() {
  const { data: pagesContent, isLoading } = usePagesContent();
  const about = pagesContent?.about;
  const mission = pagesContent?.mission;
  const general = pagesContent?.general;

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

      {/* ── 3. MEMBERS & LEADERSHIP ───────────────────────────────── */}
      <section id="members" className="py-20 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Our People
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Members &amp; Leadership
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Meet the devoted team, board members, and educational leaders steering our mission.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Ustaz Ahmed Nur',
                role: 'Executive Director & Board President',
                desc: 'Over 18 years leading humanitarian and educational nonprofits across East Africa.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'Sister Fatima Al-Hassan',
                role: 'Head of Selam School Administration',
                desc: 'Dedicated educationalist specializing in child pedagogy, curriculum, and inclusive learning.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'Dr. Ibrahim Mohammed',
                role: 'Director of Community Health & Nutrition',
                desc: 'Public health physician coordinating preventive health checkups and student meal programs.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
              },
              {
                name: 'Zahra Abdurrahman',
                role: 'Community Outreach & Sponsorship Coordinator',
                desc: 'Liaison for international partners, donor relations, and family welfare assessment.',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
              },
            ].map((member, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-center">
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                  <p className="text-xs font-semibold text-emerald-700 mt-1 mb-2">{member.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
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

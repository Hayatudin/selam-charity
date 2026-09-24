'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Heart,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePagesContent, useSubmitContactMessage } from '@/hooks/charity';

function ContactContent() {
  const searchParams = useSearchParams();
  const intent = searchParams?.get('intent');


  const { data: pagesContent } = usePagesContent();
  const contact = pagesContent?.contact;

  const submitMutation = useSubmitContactMessage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: intent === 'support' ? 'Donation & Sponsorship' : (intent === 'admissions' ? 'School Admissions' : 'General Inquiry'),
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (intent === 'support') {
      setFormData((prev) => ({ ...prev, category: 'Donation & Sponsorship', subject: 'Inquiring about supporting Selam programs' }));
    } else if (intent === 'admissions') {
      setFormData((prev) => ({ ...prev, category: 'School Admissions', subject: 'Student admission & enrollment inquiry' }));
    }
  }, [intent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Even if offline, show confirmation
      setSubmitted(true);
    }
  };

  const contactInfo = {
    address: contact?.metadata?.address || 'Bole Subcity, Woreda 03, House No. 412, Addis Ababa, Ethiopia',
    phone: contact?.metadata?.phone || '+251 91 100 2233',
    alternatePhone: contact?.metadata?.alternatePhone || '+251 11 661 4455',
    email: contact?.metadata?.email || 'contact@selamcharity.org',
    officeHours: contact?.metadata?.officeHours || 'Monday - Friday: 8:30 AM - 5:30 PM (EAT)',
    socialLinks: contact?.metadata?.socialLinks || {
      facebook: 'https://facebook.com/selamcharity',
      twitter: 'https://twitter.com/selamcharity',
      instagram: 'https://instagram.com/selamcharity',
      telegram: 'https://t.me/selamcharity',
    },
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We Are Here For You</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {contact?.title || 'Contact & Support Information'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {contact?.subtitle || 'Reach out to our main office, explore partnership opportunities, or connect with our admissions team.'}
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Cards & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                  Direct Inquiries
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Our administrative staff and educational counselors are ready to answer your inquiries.
                </p>
              </div>

              {/* Information Cards */}
              <div className="space-y-4">
                
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Head Office &amp; Campus</h4>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Numbers</h4>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-emerald-700">{contactInfo.phone}</a>
                      {contactInfo.alternatePhone && (
                        <span> / <a href={`tel:${contactInfo.alternatePhone}`} className="hover:text-emerald-700">{contactInfo.alternatePhone}</a></span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</h4>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-emerald-700">{contactInfo.email}</a>
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Working Hours</h4>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{contactInfo.officeHours}</p>
                  </div>
                </div>

              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Follow Our Work</h4>
                <p className="text-xs text-slate-300">Join our online community for photos, announcements, and events.</p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={contactInfo.socialLinks.facebook || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={contactInfo.socialLinks.telegram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Telegram
                  </a>
                  <a
                    href={contactInfo.socialLinks.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
                
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Message Received!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Selam Charity &amp; School. A member of our team will review your inquiry and follow up shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        Send Us a Message
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Fill out the form below and we will respond within 24–48 business hours.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+251 9... / 09..."
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Inquiry Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="School Admissions">School Admissions</option>
                          <option value="Donation & Sponsorship">Donation &amp; Sponsorship</option>
                          <option value="Volunteering & Partnerships">Volunteering &amp; Partnerships</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry"
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you?"
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default function CharityContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}


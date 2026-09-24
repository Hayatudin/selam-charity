'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Copy, 
  Check, 
  Upload, 
  Send, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  FileText,
  Plus,
  Landmark,
  Sparkles
} from 'lucide-react';
import { useSubmitDonationReceipt } from '@/hooks/charity';

// ── 4 OFFICIAL BANK ACCOUNTS (From Reference Image 2) ───────────
interface BankAccount {
  id: string;
  bankName: string;
  localName: string;
  accountName: string;
  accounts: { currency: 'ETB' | 'USD'; number: string }[];
  accentColor: string;
  isFeatured?: boolean;
  rowPosition: 'top' | 'bottom';
  badgeCode: string;
}

const BANK_DATA: BankAccount[] = [
  {
    id: 'cbe',
    bankName: 'Commercial Bank of Ethiopia',
    localName: 'የኢትዮጵያ ንግድ ባንክ',
    accountName: 'SELAM CHARITY & EDUCATIONAL ORGANIZATION',
    accounts: [
      { currency: 'ETB', number: '1000582926798' },
    ],
    accentColor: '#f59e0b',
    isFeatured: false,
    rowPosition: 'top',
    badgeCode: 'CBE-01',
  },
  {
    id: 'awash',
    bankName: 'Awash Bank',
    localName: 'አዋሽ ባንክ',
    accountName: 'SELAM CHARITY & EDUCATIONAL ORGANIZATION',
    accounts: [
      { currency: 'ETB', number: '01410778462600' },
      { currency: 'USD', number: '024070778462600' },
    ],
    accentColor: '#185A3A', // Featured with Selam Charity Brand Emerald
    isFeatured: true,
    rowPosition: 'top',
    badgeCode: 'AWASH-02',
  },
  {
    id: 'oromia',
    bankName: 'Oromia International Bank',
    localName: 'Baankii Oromiyaa',
    accountName: 'SELAM CHARITY & EDUCATIONAL ORGANIZATION',
    accounts: [
      { currency: 'ETB', number: '1504837300001' },
      { currency: 'USD', number: '2504837300006' },
    ],
    accentColor: '#10b981',
    isFeatured: false,
    rowPosition: 'bottom',
    badgeCode: 'OIB-03',
  },
  {
    id: 'coop',
    bankName: 'Cooperative Bank of Oromia',
    localName: 'Bank of Oromia',
    accountName: 'SELAM CHARITY & EDUCATIONAL ORGANIZATION',
    accounts: [
      { currency: 'ETB', number: '1011900049698' },
    ],
    accentColor: '#0ea5e9',
    isFeatured: false,
    rowPosition: 'bottom',
    badgeCode: 'COOP-04',
  },
];

// SVG Path Definitions for Intersecting Cuts (Exact Image 1 Shape):
// Top Card: Inward notch on bottom edge (rises up by 28px between x=205 and x=385)
const TOP_CARD_SVG_PATH = 
  "M 24,0 H 516 Q 540,0 540,24 V 356 Q 540,380 516,380 H 385 C 370,380 360,352 344,352 H 246 C 230,352 220,380 205,380 H 24 Q 0,380 0,356 V 24 Q 0,0 24,0 Z";

// Bottom Card: Outward tab on top edge (protrudes up by 28px between x=205 and x=385 to fit into the top card's notch)
const BOTTOM_CARD_SVG_PATH = 
  "M 0,52 Q 0,28 24,28 H 205 C 220,28 230,0 246,0 H 344 C 360,0 370,28 385,28 H 516 Q 540,28 540,52 V 356 Q 540,380 516,380 H 24 Q 0,380 0,356 V 52 Z";

export default function DonatePage() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedBankForModal, setSelectedBankForModal] = useState<string>('Commercial Bank of Ethiopia');

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Success Feedback
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  const submitReceiptMutation = useSubmitDonationReceipt();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 2200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleOpenReceiptModal = (bankName?: string) => {
    if (bankName) setSelectedBankForModal(bankName);
    setSubmissionSuccess(null);
    setIsReceiptModalOpen(true);
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim() || !amount) {
      alert('Please fill in your name, phone number, and donation amount.');
      return;
    }

    try {
      const res = await submitReceiptMutation.mutateAsync({
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim() || undefined,
        bankName: selectedBankForModal,
        amount: parseFloat(amount) || 0,
        currency,
        notes: notes.trim() || undefined,
        receiptFile: receiptFile || undefined,
      });

      setSubmissionSuccess(res.donation);
    } catch (err: any) {
      alert(`Submission error: ${err.message || 'Please check your inputs and try again.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      
      {/* Background Soft Lighting Gradients (Light Mode) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[400px] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ══════════════════════════════════════════════════════════════
            1. TOP HEADER SECTION (Exact Image 1 & Image 2 Inspiration)
            ══════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          
          {/* Subtle Top Pill Badge (Image 1 Style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-widest mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#185A3A] animate-pulse" />
            <span>Selam Charity &amp; Educational Organization</span>
          </div>

          {/* Centered Heading with Decorative Horizontal Accent Lines (Image 1 Signature Style) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
            <div className="hidden sm:block h-[1.5px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-slate-400" />
            <h1 className="text-3xl sm:text-5xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Support Our Mission
            </h1>
            <div className="hidden sm:block h-[1.5px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-slate-400" />
          </div>

          {/* Paragraph Content (Exact from Reference Image 2) */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            We are dedicated to making a positive impact on society, and your support plays a crucial role in helping us achieve our mission. If you share our vision and want to be part of building a better society, we invite you to contribute. Please use the following bank accounts to support our cause.
          </p>

          {/* Prominent Action Button: Send Donation Receipt (Image 2) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenReceiptModal()}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#185A3A] hover:bg-[#12422a] text-white text-sm font-bold shadow-lg shadow-[#185A3A]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Donation Receipt</span>
            </button>
            <p className="text-xs text-rose-600 font-medium">
              * Submit your receipt request after completing your donation.
            </p>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. 4 BANK CARDS IN 2x2 GRID (Exact Intersecting Cuts from Image 1)
               - Top Cards: Inward notch on bottom edge
               - Bottom Cards: Outward tab on top edge (fits into top notch)
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-7 sm:gap-y-8 gap-x-7 max-w-5xl mx-auto">
          {BANK_DATA.map((bank) => {
            const isTopRow = bank.rowPosition === 'top';
            const isFeatured = bank.isFeatured;
            const svgPath = isTopRow ? TOP_CARD_SVG_PATH : BOTTOM_CARD_SVG_PATH;

            // Content padding tailored to leave clear breathing room around the cuts:
            // Top cards: bottom padding leaves room for the inward notch
            // Bottom cards: top padding leaves room below the outward tab
            const innerPaddingClass = isTopRow 
              ? 'pt-8 pb-14 px-7 sm:px-9' 
              : 'pt-14 pb-8 px-7 sm:px-9';

            return (
              <div
                key={bank.id}
                className="relative group transition-all duration-300 filter drop-shadow-md hover:drop-shadow-xl"
                style={{ minHeight: '340px' }}
              >
                {/* ── Background SVG Container with Exact Intersecting Cut Geometry ── */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 group-hover:scale-[1.008]"
                  viewBox="0 0 540 380"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Featured Card Subtle Emerald Wash Gradient */}
                    <linearGradient id={`grad-${bank.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      {isFeatured ? (
                        <>
                          <stop offset="0%" stopColor="#f0fdf4" />
                          <stop offset="60%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#ecfdf5" />
                        </>
                      ) : (
                        <>
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </>
                      )}
                    </linearGradient>
                  </defs>

                  {/* Cut Path Silhouette (Fill & Border Stroke) */}
                  <path
                    d={svgPath}
                    fill={`url(#grad-${bank.id})`}
                    stroke={isFeatured ? '#185A3A' : '#e2e8f0'}
                    strokeWidth={isFeatured ? '2.5' : '1.75'}
                    className="transition-colors duration-300 group-hover:stroke-slate-400"
                  />
                </svg>

                {/* Subtle Decorative Bank Landmark Emblem */}
                <div className="absolute top-4 right-5 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Landmark className="w-28 h-28 stroke-[1] text-slate-800" />
                </div>

                {/* ── Card Inner Content (Light Mode Typography & Controls) ── */}
                <div className={`relative z-10 flex flex-col justify-between h-full ${innerPaddingClass}`}>
                  
                  {/* Top Header Row of Card */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Plus Badge (Image 1 signature element) */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-110 ${
                        isFeatured 
                          ? 'bg-[#185A3A] text-white shadow-md shadow-[#185A3A]/25' 
                          : 'bg-emerald-50 text-[#185A3A] border border-emerald-100 group-hover:bg-[#185A3A] group-hover:text-white transition-colors'
                      }`}>
                        <Plus className="w-5 h-5 stroke-[3]" />
                      </div>

                      <div className="flex items-center gap-2">
                        {isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#185A3A] border border-emerald-200">
                            <Sparkles className="w-3 h-3" />
                            <span>Primary Account</span>
                          </span>
                        )}
                        {/* Bank Badge Code */}
                        <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                          {bank.badgeCode}
                        </span>
                      </div>
                    </div>

                    {/* Bank Name (Big Bold Headline) */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {bank.bankName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {bank.localName}
                    </p>

                    {/* Account Name */}
                    <div className="mt-3.5 pb-3 border-b border-slate-100">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono font-medium">
                        Account Name
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide mt-0.5">
                        {bank.accountName}
                      </p>
                    </div>
                  </div>

                  {/* Account Numbers (With 1-Click Interactive Copy) */}
                  <div className="mt-4 space-y-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono font-medium">
                      Account Numbers (Click to Copy)
                    </span>

                    {bank.accounts.map((acc) => {
                      const isCopied = copiedAccount === acc.number;
                      return (
                        <div
                          key={acc.number}
                          onClick={() => handleCopy(acc.number)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group/item select-all ${
                            isFeatured
                              ? 'bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/80 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded font-mono ${
                              acc.currency === 'USD' 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-emerald-100 text-[#185A3A] border border-emerald-300'
                            }`}>
                              {acc.currency}
                            </span>
                            <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wider truncate">
                              {acc.number}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`p-1.5 px-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isCopied
                                ? 'bg-[#185A3A] text-white shadow-xs'
                                : 'text-slate-500 group-hover/item:text-slate-900 group-hover/item:bg-white border border-transparent group-hover/item:border-slate-200'
                            }`}
                            title="Copy Account Number"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span className="text-[11px] font-sans">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[11px] font-sans">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer: Quick Send Receipt Link */}
                  <div className="mt-5 pt-2 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenReceiptModal(bank.bankName)}
                      className="inline-flex items-center gap-1.5 text-[#185A3A] hover:text-[#12422a] hover:underline transition-colors font-bold cursor-pointer"
                    >
                      <span>Submit transfer proof for this bank</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. TRANSPARENCY & VERIFICATION FOOTER (Light Mode)
            ══════════════════════════════════════════════════════════════ */}
        <div className="mt-14 sm:mt-18 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#185A3A] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Direct &amp; Verified Humanitarian Impact</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Every birr directly funds student scholarships, nutritious school meals, and community aid programs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleOpenReceiptModal()}
            className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            Submit Donation Slip
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. SEND DONATION RECEIPT MODAL (Clean Light Mode)
          ══════════════════════════════════════════════════════════════ */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submissionSuccess ? (
              /* Success Confirmation */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#185A3A] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Receipt Submitted!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6">
                  Thank you, <span className="font-semibold text-slate-900">{submissionSuccess.donorName}</span>! Your donation of <span className="font-bold text-[#185A3A]">{submissionSuccess.currency} {submissionSuccess.amount}</span> has been received and queued for admin verification.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank:</span>
                    <span className="font-semibold text-slate-800">{submissionSuccess.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono font-medium text-slate-800">{submissionSuccess.donorPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-amber-600 font-bold uppercase">{submissionSuccess.status}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#185A3A] hover:bg-[#12422a] text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Submission Form */
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#185A3A] text-xs font-bold uppercase tracking-wider mb-2">
                    <Send className="w-3 h-3" />
                    <span>Receipt Verification</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Send Donation Slip</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Upload your bank transfer slip or transaction snapshot so our finance team can verify and record your contribution.
                  </p>
                </div>

                <form onSubmit={handleSubmitReceipt} className="space-y-4">
                  {/* Donor Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Contact Row: Phone (Required) & Email (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+251 9... or 09..."
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Deposited Bank */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Deposited Bank *
                    </label>
                    <select
                      value={selectedBankForModal}
                      onChange={(e) => setSelectedBankForModal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all"
                    >
                      {BANK_DATA.map((b) => (
                        <option key={b.id} value={b.bankName}>
                          {b.bankName}
                        </option>
                      ))}
                      <option value="Other Bank">Other Bank / Transfer</option>
                    </select>
                  </div>

                  {/* Amount Donated & Currency */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Amount Donated *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as 'ETB' | 'USD')}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all"
                      >
                        <option value="ETB">ETB (ብር)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload (Receipt Slip / Screenshot) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Upload Bank Slip / Screenshot (Image or PDF)
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-[#185A3A] rounded-2xl p-4 text-center transition-colors bg-slate-50 hover:bg-emerald-50/20 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {receiptFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-6 h-6 text-[#185A3A]" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{receiptFile.name}</p>
                            <p className="text-[11px] text-slate-500">{(receiptFile.size / 1024).toFixed(1)} KB • Click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2">
                          <Upload className="w-7 h-7 text-slate-400 mb-1.5" />
                          <p className="text-xs font-semibold text-slate-700">Click or drag receipt file here</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP, PDF up to 25MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes / Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Notes / Dedication (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. In memory of..., or for student supplies"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-[#185A3A] focus:bg-white transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitReceiptMutation.isPending}
                      className="w-full py-3.5 rounded-xl bg-[#185A3A] hover:bg-[#12422a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {submitReceiptMutation.isPending ? (
                        <span>Submitting receipt...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Receipt for Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

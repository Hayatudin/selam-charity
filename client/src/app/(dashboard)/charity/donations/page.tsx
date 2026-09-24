'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useCharityDonations,
  useCharityDonationStats,
  useUpdateDonationStatus,
  useRecordManualDonation,
  useDeleteDonation,
} from '@/hooks/charity';
import type { CharityDonationItem, DonationStatus } from '@/types/charity';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Plus,
  ArrowUpRight,
  Filter,
  FileText,
  DollarSign,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Landmark,
  X,
  CreditCard,
  Building2,
  Calendar,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

const BANKS_FILTER = [
  'All Banks',
  'Commercial Bank of Ethiopia',
  'Awash Bank',
  'Oromia International Bank',
  'Cooperative Bank of Oromia',
  'Telebirr / Mobile Money',
  'Cash / Direct Deposit',
  'Other Bank',
];

export default function CharityDonationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBank, setSelectedBank] = useState<string>('All Banks');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [inspectingDonation, setInspectingDonation] = useState<CharityDonationItem | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualBank, setManualBank] = useState('Commercial Bank of Ethiopia');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCurrency, setManualCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [manualRef, setManualRef] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  // Queries & Mutations
  const { data: stats, isLoading: statsLoading } = useCharityDonationStats();
  const { data: donations = [], isLoading: donationsLoading, refetch } = useCharityDonations({
    status: selectedStatus,
    bank: selectedBank === 'All Banks' ? undefined : selectedBank,
    search: searchTerm,
  });

  const updateStatusMutation = useUpdateDonationStatus();
  const recordManualMutation = useRecordManualDonation();
  const deleteDonationMutation = useDeleteDonation();

  const handleStatusChange = async (id: string, status: DonationStatus, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status, notes });
      if (inspectingDonation && inspectingDonation.id === id) {
        setInspectingDonation(prev => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, donorName: string) => {
    if (!confirm(`Are you sure you want to delete the donation record for "${donorName}"?`)) return;
    try {
      await deleteDonationMutation.mutateAsync(id);
      if (inspectingDonation && inspectingDonation.id === id) {
        setInspectingDonation(null);
      }
    } catch (err: any) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleRecordManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim() || !manualAmount) {
      alert('Please fill in donor name, phone number, and amount.');
      return;
    }

    try {
      await recordManualMutation.mutateAsync({
        donorName: manualName,
        donorEmail: manualEmail || undefined,
        donorPhone: manualPhone || undefined,
        bankName: manualBank,
        amount: parseFloat(manualAmount),
        currency: manualCurrency,
        transactionReference: manualRef || undefined,
        notes: manualNotes || undefined,
        status: 'verified',
      });

      setIsManualModalOpen(false);
      setManualName('');
      setManualEmail('');
      setManualPhone('');
      setManualAmount('');
      setManualRef('');
      setManualNotes('');
    } catch (err: any) {
      alert(`Error recording manual donation: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* ══════════════════════════════════════════════════════════════
          1. PAGE HEADER
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Donations &amp; Receipts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">
              Live CMS
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage public bank transfer slips, verify donor receipts, and record in-person contributions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/donate"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>View Donate Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#185A3A] hover:bg-[#12422a] text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Record Offline Donation</span>
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. KPI STAT CARDS
          ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Verified ETB Total */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Verified Total (ETB)
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : `${(stats?.totalAmountETB || 0).toLocaleString()} ETB`}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Approved and reconciled
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            ETB
          </div>
        </div>

        {/* Verified USD Total */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Verified Total (USD)
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : `$${(stats?.totalAmountUSD || 0).toLocaleString()} USD`}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Foreign currency receipts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            USD
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
              Pending Review
            </span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {statsLoading ? '...' : stats?.pendingCount || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Receipts awaiting confirmation
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Submissions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Recorded Slips
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : stats?.totalDonations || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Across all banks &amp; channels
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. FILTER & SEARCH CONTROLS
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Slips' },
            { id: 'pending', label: 'Pending' },
            { id: 'verified', label: 'Verified' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#185A3A] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bank & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {BANKS_FILTER.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donor or ref..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. DONATIONS DATA TABLE
          ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {donationsLoading ? (
          <div className="p-8">
            <TableSkeleton rows={5} />
          </div>
        ) : donations.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Landmark className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white text-base">No Donation Slips Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedStatus !== 'all' || selectedBank !== 'All Banks'
                ? 'Try clearing your filters or search keywords.'
                : 'Donation receipts submitted through the website will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Donor Information</th>
                  <th className="py-3.5 px-4">Bank &amp; Account</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Slip / Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Receipt File</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {donations.map((item) => {
                  const isVerified = item.status === 'verified';
                  const isRejected = item.status === 'rejected';
                  const isPending = item.status === 'pending';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Donor Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.donorName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-col gap-0.5 mt-0.5">
                          <span>{item.donorEmail}</span>
                          {item.donorPhone && <span>{item.donorPhone}</span>}
                        </div>
                      </td>

                      {/* Bank & Channel */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.bankName || item.paymentMethod}
                        </div>
                        {item.accountNumber && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            Acc: {item.accountNumber}
                          </div>
                        )}
                      </td>

                      {/* Amount & Currency */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {parseFloat(String(item.amount)).toLocaleString()}
                        </span>
                        <span className="ml-1 text-[11px] font-bold text-slate-500 uppercase">
                          {item.currency || 'ETB'}
                        </span>
                      </td>

                      {/* Transaction Reference */}
                      <td className="py-3.5 px-4">
                        {item.transactionReference ? (
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.transactionReference}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Receipt File */}
                      <td className="py-3.5 px-4 text-center">
                        {item.receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setInspectingDonation(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Slip</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No slip</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            Verified
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending Review
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Verify */}
                          {!isVerified && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(item.id, 'verified')}
                              title="Verify Donation"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {!isRejected && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(item.id, 'rejected')}
                              title="Reject Donation"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Inspect Modal */}
                          <button
                            type="button"
                            onClick={() => setInspectingDonation(item)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.donorName)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. INSPECT DONATION RECEIPT MODAL
          ══════════════════════════════════════════════════════════════ */}
      {inspectingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  Slip Reference #{inspectingDonation.id.slice(0, 8)}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Donation Verification &amp; Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDonation(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Donor & Transfer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mb-6 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Donor Name</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{inspectingDonation.donorName}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Amount Transferred</span>
                <p className="font-black text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                  {parseFloat(String(inspectingDonation.amount)).toLocaleString()} {inspectingDonation.currency}
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Email</span>
                <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{inspectingDonation.donorEmail}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Phone</span>
                <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{inspectingDonation.donorPhone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Bank / Channel</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{inspectingDonation.bankName || inspectingDonation.paymentMethod}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-mono">Transaction Ref</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{inspectingDonation.transactionReference || 'None'}</p>
              </div>
              {inspectingDonation.notes && (
                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-400 uppercase text-[10px] font-mono">Donor Notes / Purpose</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{inspectingDonation.notes}</p>
                </div>
              )}
            </div>

            {/* Receipt Preview */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-800 dark:text-white mb-2 block">
                Attached Bank Slip / Proof:
              </span>
              {inspectingDonation.receiptUrl ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950 flex flex-col items-center">
                  <img
                    src={inspectingDonation.receiptUrl}
                    alt="Receipt Proof"
                    className="max-h-96 w-auto object-contain py-2"
                  />
                  <div className="w-full bg-slate-900 p-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-xs font-mono">{inspectingDonation.receiptUrl}</span>
                    <a
                      href={inspectingDonation.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  No image proof was attached with this submission.
                </div>
              )}
            </div>

            {/* Status Change Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Current Status: <strong className="uppercase text-slate-900 dark:text-white">{inspectingDonation.status}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(inspectingDonation.id, 'rejected')}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Mark as Rejected
                </Button>

                <Button
                  onClick={() => handleStatusChange(inspectingDonation.id, 'verified')}
                  className="bg-[#185A3A] hover:bg-[#12422a] text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Verify &amp; Approve
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          6. RECORD OFFLINE DONATION MODAL
          ══════════════════════════════════════════════════════════════ */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Record Offline Donation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record in-person cash, cheque, or direct wire contributions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordManual} className="space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Donor Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Samuel Yohannes"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+251 9... or 09..."
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="donor@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Bank / Channel <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={manualBank}
                    onChange={(e) => setManualBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Awash Bank">Awash Bank</option>
                    <option value="Oromia International Bank">Oromia International Bank</option>
                    <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia</option>
                    <option value="Cash / Direct Handover">Cash / Direct Handover</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Telebirr / Mobile Money">Telebirr / Mobile Money</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Amount &amp; Currency <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder="Amount"
                    />
                    <select
                      value={manualCurrency}
                      onChange={(e) => setManualCurrency(e.target.value as 'ETB' | 'USD')}
                      className="px-2.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold font-mono"
                    >
                      <option value="ETB">ETB</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Reference / Receipt Number
                </label>
                <Input
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                  placeholder="e.g. REC-2026-0041"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Handed to Finance office on campus"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsManualModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={recordManualMutation.isPending}
                  className="bg-[#185A3A] hover:bg-[#12422a] text-white"
                >
                  {recordManualMutation.isPending ? 'Saving...' : 'Save & Verify'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

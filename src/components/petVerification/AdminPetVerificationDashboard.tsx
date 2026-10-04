import React, { useState } from 'react';
import { usePetVerification } from '../../context/PetVerificationContext';
import { ShelterPet, PetVerificationStatus } from '../../types/petVerification';
import { PendingVerificationCard } from './PendingVerificationCard';
import { ScheduleVerificationModal } from './ScheduleVerificationModal';
import { PhysicalVerificationPage } from './PhysicalVerificationPage';
import { AdminApprovalModal } from './AdminApprovalModal';
import { RejectionReasonModal } from './RejectionReasonModal';
import { PetVerificationDetailsModal } from './PetVerificationDetailsModal';
import {
  ShieldCheck,
  Clock,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Info,
  Building2,
  PawPrint,
} from 'lucide-react';

interface AdminPetVerificationDashboardProps {
  onNavigateScreen?: (screen: 'adopter' | 'shelter' | 'admin') => void;
}

export const AdminPetVerificationDashboard: React.FC<AdminPetVerificationDashboardProps> = ({
  onNavigateScreen,
}) => {
  const { pets, stats, resetToSampleData } = usePetVerification();

  // Tab State: Pending | Scheduled | Verified | Rejected (as specified in Section 3)
  const [activeTab, setActiveTab] = useState<'Pending' | 'Scheduled' | 'Verified' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals State
  const [schedulePet, setSchedulePet] = useState<ShelterPet | null>(null);
  const [physicalInspectPet, setPhysicalInspectPet] = useState<ShelterPet | null>(null);
  const [adminApprovalPet, setAdminApprovalPet] = useState<ShelterPet | null>(null);
  const [rejectionModalPet, setRejectionModalPet] = useState<ShelterPet | null>(null);
  const [detailsModalPet, setDetailsModalPet] = useState<ShelterPet | null>(null);

  // Filter items according to the tab
  const filteredPets = pets.filter((pet) => {
    let matchesTab = false;
    switch (activeTab) {
      case 'Pending':
        matchesTab = pet.status === 'Pending Verification';
        break;
      case 'Scheduled':
        matchesTab = pet.status === 'Verification Scheduled';
        break;
      case 'Verified':
        // Includes Verified (awaiting admin approval) and Available for Adoption
        matchesTab = pet.status === 'Verified' || pet.status === 'Available for Adoption';
        break;
      case 'Rejected':
        matchesTab = pet.status === 'Rejected';
        break;
      case 'All':
      default:
        matchesTab = true;
        break;
    }

    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.shelterName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Admin Control</span>
            <span aria-hidden="true">·</span>
            <span>Accreditation Council</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-semibold">Pet Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pet Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Audit in-person physical inspections and authorize public adoption listings for verified companions.
          </p>
        </div>

        {/* Reset / Sample Data Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetToSampleData}
            title="Reset 5 sample pets to test the complete verification lifecycle"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Pets</span>
          </button>
        </div>
      </div>

      {/* Mandatory Rule Callout Banner (Section 10) */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Core Integrity Mandate
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5 leading-relaxed">
              “Only physically verified and admin-approved pets can be displayed to adopters.”
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Unverified pets with status <em>Pending</em>, <em>Scheduled</em>, <em>Rejected</em>, or{' '}
              <em>Waiting for Admin Approval</em> are strictly excluded from the public directory.
            </p>
          </div>
        </div>

        {onNavigateScreen && (
          <button
            type="button"
            onClick={() => onNavigateScreen('adopter')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shrink-0 flex items-center gap-1.5"
          >
            <span>Preview Public Adopter View</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        )}
      </div>

      {/* SUMMARY CARDS AT THE TOP (as requested in Section 3) */}
      {/* Pending Verification | Scheduled Visits | Verified Pets | Rejected Pets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* 1. Pending Verification */}
        <button
          type="button"
          onClick={() => setActiveTab('Pending')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-xs ${
            activeTab === 'Pending'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Verification
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.pending}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires audit scheduling</p>
        </button>

        {/* 2. Scheduled Visits */}
        <button
          type="button"
          onClick={() => setActiveTab('Scheduled')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-xs ${
            activeTab === 'Scheduled'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scheduled Visits
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.scheduled}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Officer field audits set</p>
        </button>

        {/* 3. Verified Pets */}
        <button
          type="button"
          onClick={() => setActiveTab('Verified')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-xs ${
            activeTab === 'Verified'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Pets
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.verified + stats.available}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats.verified} awaiting approval · {stats.available} live
          </p>
        </button>

        {/* 4. Rejected Pets */}
        <button
          type="button"
          onClick={() => setActiveTab('Rejected')}
          className={`p-5 rounded-2xl border text-left transition-all shadow-xs ${
            activeTab === 'Rejected'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rejected Pets
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.rejected}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Failed on-site inspection</p>
        </button>
      </div>

      {/* TABS (as requested in Section 3): Pending | Scheduled | Verified | Rejected */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'Pending', label: 'Pending', count: stats.pending },
            { key: 'Scheduled', label: 'Scheduled', count: stats.scheduled },
            { key: 'Verified', label: 'Verified', count: stats.verified + stats.available },
            { key: 'Rejected', label: 'Rejected', count: stats.rejected },
            { key: 'All', label: 'All Requests', count: pets.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pet, breed, shelter, ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Pet Verification Requests */}
      {filteredPets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <PawPrint className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            No pet verification requests in this tab
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Switch tabs or clear search filters to view other verification requests in the pipeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PendingVerificationCard
              key={pet.id}
              pet={pet}
              onViewDetails={(p) => setDetailsModalPet(p)}
              onScheduleVerification={(p) => setSchedulePet(p)}
              onOpenPhysicalInspection={(p) => setPhysicalInspectPet(p)}
              onAdminReview={(p) => setAdminApprovalPet(p)}
              onViewRejectionReason={(p) => setRejectionModalPet(p)}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {/* 1. Schedule Verification Modal (Section 5) */}
      {schedulePet && (
        <ScheduleVerificationModal
          pet={schedulePet}
          onClose={() => setSchedulePet(null)}
          onScheduledSuccess={() => {
            setActiveTab('Scheduled');
          }}
        />
      )}

      {/* 2. Physical Verification Page/Form Modal (Section 6 & 7) */}
      {physicalInspectPet && (
        <PhysicalVerificationPage
          pet={physicalInspectPet}
          onClose={() => setPhysicalInspectPet(null)}
          onVerificationComplete={() => {
            setPhysicalInspectPet(null);
            setActiveTab('Verified');
          }}
        />
      )}

      {/* 3. Admin Approval Modal (Section 8) */}
      {adminApprovalPet && (
        <AdminApprovalModal
          pet={adminApprovalPet}
          onClose={() => setAdminApprovalPet(null)}
          onApprovalComplete={() => {
            setAdminApprovalPet(null);
            setActiveTab('Verified');
          }}
        />
      )}

      {/* 4. Rejection Reason Modal (Section 7) */}
      {rejectionModalPet && (
        <RejectionReasonModal
          pet={rejectionModalPet}
          mode="view"
          onClose={() => setRejectionModalPet(null)}
        />
      )}

      {/* 5. Pet Verification Details Modal (with Status Flow Tracker) */}
      {detailsModalPet && (
        <PetVerificationDetailsModal
          pet={detailsModalPet}
          onClose={() => setDetailsModalPet(null)}
          onOpenSchedule={() => setSchedulePet(detailsModalPet)}
          onOpenInspection={() => setPhysicalInspectPet(detailsModalPet)}
          onOpenApproval={() => setAdminApprovalPet(detailsModalPet)}
        />
      )}
    </div>
  );
};

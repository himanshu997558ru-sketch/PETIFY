import React, { useState } from 'react';
import { usePetVerification } from '../../context/PetVerificationContext';
import { ShelterPet } from '../../types/petVerification';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Calendar,
  Building2,
  MapPin,
  Heart,
  Search,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PetVerificationDetailsModal } from './PetVerificationDetailsModal';

interface PublicVerifiedAdoptionCatalogProps {
  onOpenPetModal?: (pet: any) => void;
  onNavigateScreen?: (screen: 'adopter' | 'shelter' | 'admin') => void;
}

export const PublicVerifiedAdoptionCatalog: React.FC<PublicVerifiedAdoptionCatalogProps> = ({
  onOpenPetModal,
  onNavigateScreen,
}) => {
  const { pets, getPublicAdoptionPets, stats } = usePetVerification();

  // Strict Public rule: Only Available for Adoption
  const publicPets = getPublicAdoptionPets();

  // Audit Inspector Mode (lets user toggle to inspect what is hidden)
  const [showAuditInspection, setShowAuditInspection] = useState(false);
  const [selectedPetForDetails, setSelectedPetForDetails] = useState<ShelterPet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedPets = showAuditInspection
    ? pets.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.breed.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publicPets.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 1. Header with Petify Verification Guarantee */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Petify Public Catalog</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold">Humane Animal Welfare Standards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Available Companions for Adoption
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Every animal listed below has been physically visited and inspected at the shelter premises by an
          authorized Petify officer, and granted final accreditation approval by our Admin Council.
        </p>
      </div>

      {/* 2. IMPORTANT RULE BANNER (Mandatory as per Section 10) */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white shadow-lg border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Strict Adopter Safeguard
                </span>
                <span className="text-xs text-slate-300">Section 10 Standard</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                “Only physically verified and admin-approved pets can be displayed to adopters.”
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                To prevent fraud, phantom listings, and unethical commercial puppy mills, a pet with these
                statuses is <strong className="text-rose-300">strictly prohibited</strong> from appearing in
                the public adoption catalog:
              </p>

              {/* Status Exclusions Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Hidden: Pending Verification ({stats.pending})</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Hidden: Verification Scheduled ({stats.scheduled})</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Hidden: Waiting for Admin Approval ({stats.verified})</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Hidden: Rejected ({stats.rejected})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Verification Audit Inspector Mode Toggle */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAuditInspection((prev) => !prev)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
                showAuditInspection
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
              }`}
            >
              {showAuditInspection ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Viewing All System Pets (Audit Mode)</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Verify Rule: Test Audit Filter</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              {showAuditInspection
                ? 'Showing all 5 pets including blocked ones'
                : `Showing ${publicPets.length} physically verified & approved companion`}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search adoptable companions..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{displayedPets.length}</span> companions
        </div>
      </div>

      {/* Pet Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPets.map((pet) => {
          const isPubliclyAvailable = pet.status === 'Available for Adoption';

          return (
            <div
              key={pet.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                isPubliclyAvailable
                  ? 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  : 'border-dashed border-rose-300 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Image Slot */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Certified Verified Badge if approved */}
                  {isPubliclyAvailable ? (
                    <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-400/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Physically Verified &amp; Approved</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-rose-900/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-rose-300" />
                      <span>HIDDEN FROM ADOPTERS</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <StatusBadge status={pet.status} size="sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{pet.name}</h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {pet.breed}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                    <span>{pet.age}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pet.gender}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pet.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2.5">
                    {pet.description}
                  </p>

                  {/* Shelter & Inspection Trust Seal */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{pet.shelterName}</span>
                    </div>

                    {isPubliclyAvailable && pet.inspectionReport && (
                      <div className="p-2 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-emerald-950 flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Audited by: {pet.inspectionReport.verificationOfficer}</span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-800">
                          {pet.inspectionReport.verificationDate}
                        </span>
                      </div>
                    )}

                    {!isPubliclyAvailable && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium text-[11px]">
                        <strong>Why Hidden:</strong> Current status is <em>{pet.status}</em>. Physical
                        on-site verification & admin listing release have not completed.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedPetForDetails(pet)}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isPubliclyAvailable
                      ? 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {isPubliclyAvailable ? 'View Full Verification Audit & Profile' : 'Inspect Reason For Exclusion'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedPetForDetails && (
        <PetVerificationDetailsModal
          pet={selectedPetForDetails}
          onClose={() => setSelectedPetForDetails(null)}
        />
      )}
    </div>
  );
};

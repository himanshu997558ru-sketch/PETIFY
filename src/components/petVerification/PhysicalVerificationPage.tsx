import React, { useState } from 'react';
import { ShelterPet, PhysicalChecklist } from '../../types/petVerification';
import { usePetVerification } from '../../context/PetVerificationContext';
import { SAMPLE_VERIFICATION_OFFICERS } from '../../data/sampleShelterPets';
import { RejectionReasonModal } from './RejectionReasonModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Phone,
  UserCheck,
  Calendar,
  CheckSquare,
  Square,
  FileText,
  PawPrint,
  Clock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PhysicalVerificationPageProps {
  pet: ShelterPet;
  onClose: () => void;
  onVerificationComplete?: () => void;
}

export const PhysicalVerificationPage: React.FC<PhysicalVerificationPageProps> = ({
  pet,
  onClose,
  onVerificationComplete,
}) => {
  const { verifyPetPhysical, rejectPet } = usePetVerification();

  // Verification Checklist State (all 6 items from Section 6)
  const [checklist, setChecklist] = useState<PhysicalChecklist>({
    existsAtShelter: true,
    detailsMatch: true,
    photoMatches: true,
    addressVerified: true,
    availableForAdoption: true,
    basicConditionVerified: true,
  });

  const [verificationNotes, setVerificationNotes] = useState(
    `Physically inspected ${pet.name} at ${pet.shelterName}. Animal was present in clean kennel enclosure, active, responsive, and matches submitted photograph and documentation.`
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const [verificationDate, setVerificationDate] = useState(todayStr);

  const defaultOfficer =
    pet.scheduleDetails?.officer || SAMPLE_VERIFICATION_OFFICERS[0].name;
  const [verificationOfficer, setVerificationOfficer] = useState(defaultOfficer);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checklistError, setChecklistError] = useState<string | null>(null);

  const toggleChecklist = (key: keyof PhysicalChecklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (checklistError) setChecklistError(null);
  };

  const allChecked = Object.values(checklist).every(Boolean);

  // Handle Verify Pet Button (Section 7)
  const handleVerifyPet = () => {
    if (!allChecked) {
      setChecklistError(
        'All 6 physical verification checklist standards must be confirmed before approving verification.'
      );
      return;
    }
    if (!verificationNotes.trim()) {
      setChecklistError('Please provide inspector verification observations.');
      return;
    }

    const officerObj = SAMPLE_VERIFICATION_OFFICERS.find((o) => o.name === verificationOfficer);
    const badge = officerObj?.badge || pet.scheduleDetails?.officerBadge || 'PT-FW-042';

    verifyPetPhysical(pet.id, {
      checklist,
      verificationNotes: verificationNotes.trim(),
      verificationDate,
      verificationOfficer,
      officerBadge: badge,
    });

    setSuccessMessage(
      `Pet physically verified successfully by ${verificationOfficer}. Status updated to Verified — Moved to Admin Approval queue.`
    );

    setTimeout(() => {
      if (onVerificationComplete) onVerificationComplete();
    }, 1800);
  };

  // Handle Rejection from Reject Pet Button (Section 7)
  const handleConfirmRejection = (reason: string) => {
    rejectPet(pet.id, reason, verificationOfficer, 'Physical Verification');
    setShowRejectModal(false);
    if (onVerificationComplete) onVerificationComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Physical Pet Verification
              </h2>
              <p className="text-xs text-slate-300">
                Authorized On-Site Inspection Protocol · In-Person Audit Record
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close Form
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-6 py-3.5 flex items-center gap-3 shrink-0 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Current Status:</span>
              <StatusBadge status={pet.status} />
            </div>
            <span className="text-xs font-mono text-slate-500">Pet Record ID: {pet.id}</span>
          </div>

          {/* TWO SECTIONS SIDE-BY-SIDE (as requested in Section 6) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Pet Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-emerald-700" />
                <span>Pet Details</span>
              </h3>

              <div className="space-y-4">
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Pet Name:</span>
                    <span className="font-bold text-slate-900">{pet.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Pet Type:</span>
                    <span className="font-semibold text-slate-800">{pet.petType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Breed:</span>
                    <span className="font-semibold text-slate-800">{pet.breed}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Age & Gender:</span>
                    <span className="font-semibold text-slate-800">
                      {pet.age} · {pet.gender}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Description:</span>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {pet.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Shelter Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Shelter Details</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Shelter Name
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{pet.shelterName}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Address to Verify
                    </span>
                    <span className="font-medium text-slate-800 leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{pet.shelterAddress}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Contact Number
                    </span>
                    <span className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pet.shelterContact}</span>
                    </span>
                  </div>

                  {pet.scheduleDetails && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-blue-900 text-[11px] space-y-1">
                      <span className="font-bold text-blue-950 block">Visit Schedule:</span>
                      <p>
                        Scheduled for {pet.scheduleDetails.visitDate} at {pet.scheduleDetails.visitTime}
                      </p>
                      <p className="text-blue-800">
                        Officer: {pet.scheduleDetails.officer} ({pet.scheduleDetails.officerBadge})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                <strong>Auditor Notice:</strong> You must physically confirm the animal’s presence on-site.
                Virtual, video, or remote verification is strictly forbidden by Petify standards.
              </div>
            </div>
          </div>

          {/* Section 3: Verification Checklist (Checkboxes from Section 6) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-700" />
                  <span>Physical Verification Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check each item verified during your in-person physical inspection
                </p>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  allChecked
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {Object.values(checklist).filter(Boolean).length} / 6 Verified
              </span>
            </div>

            {checklistError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {checklistError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  key: 'existsAtShelter' as const,
                  label: 'Pet physically exists at shelter',
                  sub: 'Inspected animal in-person on facility premises',
                },
                {
                  key: 'detailsMatch' as const,
                  label: 'Pet details match submitted information',
                  sub: 'Breed, age, gender, size verified against paperwork',
                },
                {
                  key: 'photoMatches' as const,
                  label: 'Pet photo matches actual pet',
                  sub: 'Coat markings, colors, and facial profile confirmed identical',
                },
                {
                  key: 'addressVerified' as const,
                  label: 'Shelter address verified',
                  sub: 'Location matches registered physical premises',
                },
                {
                  key: 'availableForAdoption' as const,
                  label: 'Pet is available for adoption',
                  sub: 'Not reserved, held, or claimed by third-party broker',
                },
                {
                  key: 'basicConditionVerified' as const,
                  label: 'Basic pet condition verified',
                  sub: 'Alert, responsive, clean living enclosure, food/water present',
                },
              ].map((item) => {
                const checked = checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleChecklist(item.key)}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      checked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Verification Notes, Date & Officer */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Verification Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Detailed notes from the on-site physical inspection..."
                className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Verification Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={verificationDate}
                  onChange={(e) => setVerificationDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Verification Officer <span className="text-rose-500">*</span>
                </label>
                <select
                  value={verificationOfficer}
                  onChange={(e) => setVerificationOfficer(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SAMPLE_VERIFICATION_OFFICERS.map((o) => (
                    <option key={o.badge} value={o.name}>
                      {o.name} ({o.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Verification Decision (Two large buttons at bottom) */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Official Decision:</span>{' '}
              Verifying advances the pet to Admin Approval. Rejecting archives the submission with documented reason.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* ❌ Reject Pet button (Section 7) */}
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="flex-1 sm:flex-initial px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 hover:border-rose-400 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>❌ Reject Pet</span>
              </button>

              {/* ✅ Verify Pet button (Section 7) */}
              <button
                type="button"
                onClick={handleVerifyPet}
                className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>✅ Verify Pet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal (Section 7) */}
      {showRejectModal && (
        <RejectionReasonModal
          pet={pet}
          mode="reject"
          onClose={() => setShowRejectModal(false)}
          onSubmitRejection={handleConfirmRejection}
        />
      )}
    </div>
  );
};

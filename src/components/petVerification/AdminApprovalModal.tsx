import React, { useState } from 'react';
import { ShelterPet } from '../../types/petVerification';
import { usePetVerification } from '../../context/PetVerificationContext';
import { RejectionReasonModal } from './RejectionReasonModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  CheckSquare,
  Sparkles,
  FileCheck,
  X,
  UserCheck,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AdminApprovalModalProps {
  pet: ShelterPet;
  onClose: () => void;
  onApprovalComplete?: () => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  pet,
  onClose,
  onApprovalComplete,
}) => {
  const { adminApproveListing, rejectPet } = usePetVerification();

  const [adminNotes, setAdminNotes] = useState(
    'All physical verification criteria and health standards verified on-site by accredited Petify inspector. Approved for public adopter listing.'
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const report = pet.inspectionReport;

  const handleApprove = () => {
    setIsApproving(true);
    adminApproveListing(pet.id, adminNotes, 'Sanctuary Super Admin');
    setSuccessBanner(
      `Listing Approved! ${pet.name} is now Available for Adoption and visible in the public catalog.`
    );

    setTimeout(() => {
      setIsApproving(false);
      if (onApprovalComplete) onApprovalComplete();
      onClose();
    }, 1800);
  };

  const handleConfirmRejection = (reason: string) => {
    rejectPet(pet.id, reason, 'Sanctuary Super Admin', 'Admin Review');
    setShowRejectModal(false);
    if (onApprovalComplete) onApprovalComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Admin Approval &amp; Listing Release
              </h2>
              <p className="text-xs text-slate-300">
                Final authorization stage before public adopter publication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="bg-teal-600 text-white px-6 py-3.5 flex items-center gap-3 shrink-0 animate-in slide-in-from-top duration-200">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div className="text-xs font-semibold">{successBanner}</div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 8 State Indicator: Verified -> Waiting for Admin Approval */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Current Workflow Stage:
                  </span>
                  <span className="text-xs font-black text-emerald-950 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Verified → Waiting for Admin Approval
                  </span>
                </div>
                <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                  Physical inspection completed. An admin must review and confirm listing release
                  before this pet appears on the public adoption directory.
                </p>
              </div>
            </div>
          </div>

          {/* Pet & Shelter Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h4 className="text-base font-bold text-slate-900 truncate">{pet.name}</h4>
                <p className="text-xs text-slate-600 truncate mt-0.5">
                  {pet.breed} · {pet.age} · {pet.gender}
                </p>
                <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                  ID: {pet.id}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Shelter Information
              </span>
              <p className="font-bold text-slate-800">{pet.shelterName}</p>
              <p className="text-slate-600 text-[11px] truncate">{pet.shelterAddress}</p>
              <p className="text-slate-600 font-mono text-[11px]">{pet.shelterContact}</p>
            </div>
          </div>

          {/* Physical Verification Report Review */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>Physical Verification Report Audit</span>
              </h3>
              {report && (
                <span className="text-xs font-mono text-slate-500">
                  Inspected on: {report.verificationDate}
                </span>
              )}
            </div>

            {/* Checklist Results */}
            {report ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Verified Checklist Standards:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'existsAtShelter', label: 'Pet physically exists at shelter' },
                      { key: 'detailsMatch', label: 'Pet details match submitted information' },
                      { key: 'photoMatches', label: 'Pet photo matches actual pet' },
                      { key: 'addressVerified', label: 'Shelter address verified' },
                      { key: 'availableForAdoption', label: 'Pet is available for adoption' },
                      { key: 'basicConditionVerified', label: 'Basic pet condition verified' },
                    ].map((item) => {
                      const passed = (report.checklist as any)[item.key];
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-950 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inspector Notes */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Auditor Observation &amp; Signature
                  </span>
                  <p className="text-xs text-slate-800 italic leading-relaxed">
                    “{report.verificationNotes}”
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Officer: {report.verificationOfficer}</span>
                    <span>Badge: {report.officerBadge}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No formal inspection report attached.</p>
            )}
          </div>

          {/* Admin Approval Notes Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Super Admin Authorization Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Public Guarantee Note */}
          <div className="p-3.5 rounded-xl bg-teal-50/90 border border-teal-200/90 text-xs text-teal-950 leading-relaxed">
            <p className="font-bold text-teal-900">Petify Public Visibility Mandate:</p>
            <p className="mt-0.5">
              Approving this listing will set status to{' '}
              <strong className="text-teal-900">Available for Adoption</strong>. The pet will
              immediately become visible to public adopters on Petify with the verified accreditation seal.
            </p>
          </div>
        </div>

        {/* Footer Actions: Approve Listing & Reject Listing (Section 8) */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Reject Listing Button */}
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 hover:border-rose-400 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Reject Listing</span>
            </button>

            {/* Approve Listing Button */}
            <button
              type="button"
              disabled={isApproving}
              onClick={handleApprove}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-200" />
              <span>{isApproving ? 'Approving...' : 'Approve Listing'}</span>
            </button>
          </div>
        </div>
      </div>

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

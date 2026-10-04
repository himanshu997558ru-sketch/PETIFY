import React from 'react';
import { ShelterPet } from '../../types/petVerification';
import { StatusBadge } from './StatusBadge';
import { StatusFlowTracker } from './StatusFlowTracker';
import {
  X,
  PawPrint,
  Building2,
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface PetVerificationDetailsModalProps {
  pet: ShelterPet;
  onClose: () => void;
  onOpenSchedule?: () => void;
  onOpenInspection?: () => void;
  onOpenApproval?: () => void;
}

export const PetVerificationDetailsModal: React.FC<PetVerificationDetailsModalProps> = ({
  pet,
  onClose,
  onOpenSchedule,
  onOpenInspection,
  onOpenApproval,
}) => {
  const isAvailable = pet.status === 'Available for Adoption';
  const isRejected = pet.status === 'Rejected';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <PawPrint className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{pet.name}</h3>
                <span className="text-xs font-mono text-slate-400">({pet.id})</span>
              </div>
              <p className="text-xs text-slate-300">
                {pet.breed} · {pet.age} · {pet.gender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={pet.status} />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Progress Tracker (Section 9) */}
          <StatusFlowTracker pet={pet} />

          {/* Side by side: Pet info and Shelter info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Species / Pet Type:</span>
                  <span className="font-semibold text-slate-800">{pet.petType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Breed:</span>
                  <span className="font-semibold text-slate-800">{pet.breed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Age:</span>
                  <span className="font-semibold text-slate-800">{pet.age}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Gender:</span>
                  <span className="font-semibold text-slate-800">{pet.gender}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{pet.location}</span>
                </div>
                <div className="pt-1.5">
                  <span className="text-slate-500 block mb-1">Description:</span>
                  <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    {pet.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Shelter Card */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Submitting Shelter</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Shelter Organization
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{pet.shelterName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Physical Inspection Address
                    </span>
                    <p className="text-slate-700 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{pet.shelterAddress}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Contact Hotline
                    </span>
                    <p className="text-slate-700 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pet.shelterContact}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical Inspection Details if completed */}
              {pet.inspectionReport && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Physical Inspection Passed</span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700">
                      {pet.inspectionReport.verificationDate}
                    </span>
                  </div>
                  <p className="text-emerald-900 italic bg-white/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                    “{pet.inspectionReport.verificationNotes}”
                  </p>
                  <p className="text-[11px] text-emerald-800 font-mono">
                    Auditor: {pet.inspectionReport.verificationOfficer} (
                    {pet.inspectionReport.officerBadge})
                  </p>
                </div>
              )}

              {/* Rejection Details if rejected */}
              {pet.rejectionDetails && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Inspection Rejection Finding</span>
                  </div>
                  <p className="text-rose-900 italic bg-white/80 p-2.5 rounded-lg border border-rose-200 leading-relaxed">
                    “{pet.rejectionDetails.reason}”
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-rose-700 font-mono">
                    <span>Decided By: {pet.rejectionDetails.rejectedBy}</span>
                    <span>Stage: {pet.rejectionDetails.stage}</span>
                  </div>
                </div>
              )}

              {/* Admin Approval info if available */}
              {pet.adminApproval && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-teal-900">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Admin Approval Granted</span>
                    </span>
                    <span className="font-mono text-[11px] text-teal-700">
                      {pet.adminApproval.approvalDate}
                    </span>
                  </div>
                  <p className="text-teal-900">{pet.adminApproval.adminNotes}</p>
                  <p className="text-[11px] text-teal-700 font-mono">
                    Approved by: {pet.adminApproval.approvedBy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            Submission Date: {pet.submissionDate}
          </span>

          <div className="flex items-center gap-2">
            {pet.status === 'Pending Verification' && onOpenSchedule && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSchedule();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Schedule Physical Visit
              </button>
            )}

            {pet.status === 'Verification Scheduled' && onOpenInspection && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInspection();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Physical Verification Form
              </button>
            )}

            {pet.status === 'Verified' && onOpenApproval && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenApproval();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Review &amp; Approve Listing
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

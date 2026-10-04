import React from 'react';
import { ShelterPet } from '../../types/petVerification';
import { StatusBadge } from './StatusBadge';
import {
  PawPrint,
  Building2,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CalendarCheck,
  Eye,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface PendingVerificationCardProps {
  pet: ShelterPet;
  onViewDetails: (pet: ShelterPet) => void;
  onScheduleVerification?: (pet: ShelterPet) => void;
  onOpenPhysicalInspection?: (pet: ShelterPet) => void;
  onAdminReview?: (pet: ShelterPet) => void;
  onViewRejectionReason?: (pet: ShelterPet) => void;
}

export const PendingVerificationCard: React.FC<PendingVerificationCardProps> = ({
  pet,
  onViewDetails,
  onScheduleVerification,
  onOpenPhysicalInspection,
  onAdminReview,
  onViewRejectionReason,
}) => {
  const isPending = pet.status === 'Pending Verification';
  const isScheduled = pet.status === 'Verification Scheduled';
  const isVerified = pet.status === 'Verified';
  const isRejected = pet.status === 'Rejected';
  const isAvailable = pet.status === 'Available for Adoption';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Card Header: Request Information */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {pet.id}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Submitted: {pet.submissionDate}</span>
            </div>
          </div>
          <StatusBadge status={pet.status} size="sm" />
        </div>

        {/* 1. Pet Information (Photo, Name, Breed, Age, Gender, Description) */}
        <div className="flex gap-4 items-start mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-1">
              <h3 className="text-base font-bold text-slate-900 truncate">{pet.name}</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {pet.petType}
              </span>
            </div>

            <div className="text-xs text-slate-600 font-medium mt-0.5">
              <span>{pet.breed}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{pet.age}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{pet.gender}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
              {pet.description}
            </p>
          </div>
        </div>

        {/* 2. Shelter Information (Shelter Name, Address, Contact Number) */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-1.5 mb-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{pet.shelterName}</span>
          </div>

          <div className="flex items-start gap-2 text-slate-600 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="truncate">{pet.shelterAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono">{pet.shelterContact}</span>
          </div>
        </div>

        {/* Schedule or Report Highlights if applicable */}
        {isScheduled && pet.scheduleDetails && (
          <div className="mb-4 p-2.5 bg-blue-50/80 border border-blue-200/70 rounded-xl text-xs text-blue-900">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Visit: {pet.scheduleDetails.visitDate} @ {pet.scheduleDetails.visitTime}</span>
              </span>
            </div>
            <p className="text-[11px] text-blue-800 mt-1 truncate">
              Assigned: {pet.scheduleDetails.officer}
            </p>
          </div>
        )}

        {isVerified && (
          <div className="mb-4 p-2.5 bg-emerald-50/80 border border-emerald-200/70 rounded-xl text-xs text-emerald-950">
            <div className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Physical Audit Passed (6/6 Criteria)</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Waiting for final Super Admin Approval
            </p>
          </div>
        )}

        {isRejected && pet.rejectionDetails && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <div className="flex items-center gap-1.5 font-semibold text-rose-950">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Inspection Rejected</span>
            </div>
            <p className="text-[11px] text-rose-800 mt-0.5 line-clamp-1 italic">
              “{pet.rejectionDetails.reason}”
            </p>
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(pet)}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Main Action based on status */}
          {isPending && onScheduleVerification && (
            <button
              type="button"
              onClick={() => onScheduleVerification(pet)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Schedule Verification</span>
            </button>
          )}

          {isScheduled && onOpenPhysicalInspection && (
            <button
              type="button"
              onClick={() => onOpenPhysicalInspection(pet)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Execute Physical Inspection</span>
            </button>
          )}

          {isVerified && onAdminReview && (
            <button
              type="button"
              onClick={() => onAdminReview(pet)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Review & Approve</span>
            </button>
          )}

          {isRejected && onViewRejectionReason && (
            <button
              type="button"
              onClick={() => onViewRejectionReason(pet)}
              className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rejection Reason</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

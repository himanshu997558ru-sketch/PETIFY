import React from 'react';
import { ShelterPet, PetVerificationStatus } from '../../types/petVerification';
import {
  FileText,
  Clock,
  CalendarCheck,
  ClipboardCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface StatusFlowTrackerProps {
  pet: ShelterPet;
  compact?: boolean;
}

export const StatusFlowTracker: React.FC<StatusFlowTrackerProps> = ({ pet, compact = false }) => {
  const isRejected = pet.status === 'Rejected';

  // Define steps
  // 1: Pet Added
  // 2: Pending Verification
  // 3: Verification Scheduled
  // 4: Physical Verification
  // 5: Verified
  // 6: Admin Approval
  // 7: Available for Adoption
  const getStepIndex = (status: PetVerificationStatus): number => {
    switch (status) {
      case 'Pending Verification':
        return 2;
      case 'Verification Scheduled':
        return 3;
      case 'Verified':
        return 5;
      case 'Available for Adoption':
        return 7;
      case 'Rejected':
        return 4; // branched
      default:
        return 1;
    }
  };

  const currentIndex = getStepIndex(pet.status);

  const steps = [
    {
      id: 1,
      title: 'Pet Added',
      desc: 'Profile submitted by shelter',
      icon: FileText,
      completed: true,
      timestamp: pet.history.find((h) => h.stage === 'Pet Added')?.timestamp,
    },
    {
      id: 2,
      title: 'Pending Verification',
      desc: 'Queued for inspection review',
      icon: Clock,
      completed: currentIndex >= 2 && !isRejected,
      timestamp: pet.history.find((h) => h.stage === 'Pending Verification')?.timestamp,
    },
    {
      id: 3,
      title: 'Verification Scheduled',
      desc: pet.scheduleDetails
        ? `Visit set for ${pet.scheduleDetails.visitDate} with ${pet.scheduleDetails.officer}`
        : 'Officer dispatch assignment',
      icon: CalendarCheck,
      completed: currentIndex >= 3 && !isRejected,
      timestamp: pet.scheduleDetails?.scheduledAt,
    },
    {
      id: 4,
      title: 'Physical Verification',
      desc: pet.inspectionReport
        ? `On-site inspection completed by ${pet.inspectionReport.verificationOfficer}`
        : isRejected
        ? 'Physical inspection failed criteria'
        : 'In-person shelter audit',
      icon: isRejected ? XCircle : ClipboardCheck,
      completed: isRejected || currentIndex >= 4,
      failed: isRejected,
      timestamp: pet.inspectionReport?.completedAt || pet.rejectionDetails?.rejectedAt,
    },
    {
      id: 5,
      title: 'Verified',
      desc: 'All 6 welfare standards passed',
      icon: CheckCircle2,
      completed: !isRejected && currentIndex >= 5,
      timestamp: pet.history.find((h) => h.stage === 'Verified')?.timestamp,
    },
    {
      id: 6,
      title: 'Admin Approval',
      desc: pet.adminApproval
        ? `Approved by ${pet.adminApproval.approvedBy}`
        : 'Waiting for Admin Review',
      icon: ShieldCheck,
      completed: !isRejected && currentIndex >= 6,
      timestamp: pet.adminApproval?.approvalDate,
    },
    {
      id: 7,
      title: 'Available for Adoption',
      desc: 'Visible in Public Adopter Catalog',
      icon: Sparkles,
      completed: pet.status === 'Available for Adoption',
      timestamp: pet.history.find((h) => h.stage === 'Available for Adoption')?.timestamp,
    },
  ];

  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs">
          {steps.map((s, idx) => {
            const isCurrent = s.id === currentIndex;
            const isDone = s.completed;
            const isError = isRejected && s.id === 4;

            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center shrink-0 min-w-[70px] text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors ${
                      isError
                        ? 'bg-rose-600 text-white'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isError ? '✕' : isDone ? '✓' : s.id}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium leading-tight max-w-[80px] truncate ${
                      isError
                        ? 'text-rose-700 font-semibold'
                        : isCurrent
                        ? 'text-blue-700 font-bold'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[12px] -mt-4 transition-colors ${
                      s.completed && !isRejected ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Pet Verification Lifecycle</span>
            {isRejected ? (
              <span className="text-xs bg-rose-100 text-rose-800 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Rejected
              </span>
            ) : pet.status === 'Available for Adoption' ? (
              <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Live on Adopter Catalog
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                Verification In Progress
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step physical audit trail required before adopter visibility
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500">ID: {pet.id}</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step) => {
          const isDone = step.completed;
          const isCurrent = step.id === currentIndex && !isRejected;
          const isFailedStep = isRejected && step.id === 4;
          const Icon = step.icon;

          if (isRejected && step.id > 4) {
            // Do not show remaining steps as active for rejected pets
            return (
              <div key={step.id} className="relative flex items-start gap-3 opacity-40">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-medium text-slate-400">{step.title}</h5>
                  <p className="text-[11px] text-slate-400">Skipped due to rejection</p>
                </div>
              </div>
            );
          }

          return (
            <div key={step.id} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                  isFailedStep
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                    : isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5
                    className={`text-xs font-bold ${
                      isFailedStep
                        ? 'text-rose-700'
                        : isDone
                        ? 'text-slate-900'
                        : isCurrent
                        ? 'text-blue-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h5>
                  {step.timestamp && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(step.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    isFailedStep
                      ? 'text-rose-600 font-medium'
                      : isCurrent
                      ? 'text-slate-700 font-medium'
                      : isDone
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.desc}
                </p>

                {/* Additional contextual step info */}
                {step.id === 4 && isRejected && pet.rejectionDetails && (
                  <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                    <p className="font-semibold text-rose-900 mb-0.5">Rejection Reason:</p>
                    <p className="italic">{pet.rejectionDetails.reason}</p>
                    <p className="text-[10px] text-rose-700 mt-1 font-mono">
                      Filed by: {pet.rejectionDetails.rejectedBy} on{' '}
                      {new Date(pet.rejectionDetails.rejectedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {step.id === 4 && !isRejected && pet.inspectionReport && (
                  <div className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-xs text-emerald-900">
                    <p className="font-semibold text-emerald-950 mb-0.5">Officer Observation:</p>
                    <p className="italic text-emerald-900/90">{pet.inspectionReport.verificationNotes}</p>
                    <p className="text-[10px] text-emerald-800 mt-1 font-mono">
                      Verified by: {pet.inspectionReport.verificationOfficer} (
                      {pet.inspectionReport.officerBadge})
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

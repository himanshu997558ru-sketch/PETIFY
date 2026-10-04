import React from 'react';
import {
  Building2,
  FileText,
  UserCheck,
  MapPin,
  ClipboardCheck,
  UploadCloud,
  FileSearch,
  CheckCircle,
  XCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { ShelterVerificationRequest, VerificationStage } from '../../types';

interface VerificationPipelineTrackerProps {
  request: ShelterVerificationRequest;
  onSelectAction?: (action: string) => void;
  compact?: boolean;
}

export const PIPELINE_STEPS = [
  {
    stage: 'SHELTER_REGISTRATION',
    label: 'Shelter Registration',
    shortLabel: 'Registration',
    icon: Building2,
    description: 'Organization profiles, legal ID & facility specs registered',
  },
  {
    stage: 'VERIFICATION_REQUESTED',
    label: 'Verification Request',
    shortLabel: 'Request',
    icon: FileText,
    description: 'Accreditation application submitted to alliance admin queue',
  },
  {
    stage: 'WORKER_ASSIGNED',
    label: 'Admin Assigns Field Worker',
    shortLabel: 'Worker Assigned',
    icon: UserCheck,
    description: 'Certified Welfare Officer assigned with scheduled on-site visit',
  },
  {
    stage: 'WORKER_VISITING',
    label: 'Worker Visits Shelter',
    shortLabel: 'Worker Visit',
    icon: MapPin,
    description: 'Field officer checks in on-site at shelter physical facility',
  },
  {
    stage: 'PHYSICAL_VERIFICATION',
    label: 'Physical Verification',
    shortLabel: 'Physical Audit',
    icon: ClipboardCheck,
    description: 'Enclosures, sanitation, water, veterinary care & safety audited',
  },
  {
    stage: 'REPORT_UPLOADED',
    label: 'Worker Uploads Verification Report',
    shortLabel: 'Report Uploaded',
    icon: UploadCloud,
    description: 'Photo evidence, checklist scoring & recommendations filed',
  },
  {
    stage: 'ADMIN_REVIEW',
    label: 'Admin Reviews Report',
    shortLabel: 'Admin Review',
    icon: FileSearch,
    description: 'Alliance administrator reviews field auditor evidence & score',
  },
];

export const getStageIndex = (stage: VerificationStage): number => {
  switch (stage) {
    case 'SHELTER_REGISTRATION':
      return 0;
    case 'VERIFICATION_REQUESTED':
      return 1;
    case 'WORKER_ASSIGNED':
      return 2;
    case 'WORKER_VISITING':
      return 3;
    case 'PHYSICAL_VERIFICATION':
      return 4;
    case 'REPORT_UPLOADED':
      return 5;
    case 'ADMIN_REVIEW':
      return 6;
    case 'VERIFIED':
    case 'REJECTED':
      return 7;
    default:
      return 0;
  }
};

export const VerificationPipelineTracker: React.FC<VerificationPipelineTrackerProps> = ({
  request,
  onSelectAction,
  compact = false,
}) => {
  const currentIndex = getStageIndex(request.stage);
  const isVerified = request.stage === 'VERIFIED';
  const isRejected = request.stage === 'REJECTED';

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900">Verification Pipeline</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isVerified
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isRejected
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {request.stage.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Horizontal Mini Dots Bar */}
        <div className="grid grid-cols-8 gap-1.5 items-center">
          {PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = currentIndex > idx || isVerified;
            const isCurrent = currentIndex === idx && !isVerified && !isRejected;
            const Icon = step.icon;

            return (
              <div
                key={step.stage}
                title={`${step.label}: ${step.description}`}
                className={`h-2 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-amber-500 ring-2 ring-amber-200 animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
          {/* 8th item: Verified or Rejected Badge */}
          <div
            className={`h-2 rounded-full transition-all ${
              isVerified ? 'bg-emerald-600' : isRejected ? 'bg-rose-500' : 'bg-slate-200'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Shelter Verification Pipeline</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  ({request.requestId})
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end multi-tier physical inspection & legal accreditation workflow
              </p>
            </div>
          </div>
        </div>

        {/* Current State Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isVerified ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Verified Shelter Badge Issued</span>
            </div>
          ) : isRejected ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 rounded-xl text-xs font-bold">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Verification Rejected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>In Progress: {request.stage.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Flowchart Diagram with Connected Steps */}
      <div className="relative">
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = currentIndex > idx || isVerified;
            const isCurrent = currentIndex === idx && !isVerified && !isRejected;
            const Icon = step.icon;

            return (
              <div
                key={step.stage}
                className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : isCurrent
                    ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-sm ring-2 ring-amber-400/30'
                    : 'bg-slate-50/60 border-slate-200/70 text-slate-500'
                }`}
              >
                <div>
                  {/* Step Number & Status Indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>Active Now</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Pending</span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-2.5 mb-1.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-200/70 text-emerald-800'
                          : isCurrent
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-slate-200/70 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{step.label}</h4>
                      <p className="text-[11px] mt-1 text-slate-600 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Context Info */}
                <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px]">
                  {idx === 0 && (
                    <span className="text-slate-600 font-medium">
                      Registered: {request.shelter.directorName}
                    </span>
                  )}
                  {idx === 1 && (
                    <span className="text-slate-600 font-medium font-mono">
                      Queue Ref: {request.requestId}
                    </span>
                  )}
                  {idx === 2 && request.assignedWorker && (
                    <span className="text-slate-700 font-semibold truncate block">
                      Inspector: {request.assignedWorker.name}
                    </span>
                  )}
                  {idx === 3 && (
                    <span className="text-slate-600">
                      {request.scheduledVisitDate ? `Visit: ${request.scheduledVisitDate}` : 'Pending Visit'}
                    </span>
                  )}
                  {idx === 4 && request.report && (
                    <span className="text-emerald-700 font-bold">
                      Audit Score: {request.report.overallScore}/100
                    </span>
                  )}
                  {idx === 5 && request.report && (
                    <span className="text-slate-600 font-medium">
                      Photos: {request.report.photos.length} uploaded
                    </span>
                  )}
                  {idx === 6 && (
                    <span className="text-slate-600">
                      {request.adminReview ? `Verdict: ${request.adminReview.decision}` : 'Awaiting Review'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* ================= FINAL STEP: VERIFIED OR REJECTED ================= */}
          <div
            className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              isVerified
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md ring-2 ring-emerald-400'
                : isRejected
                ? 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300 text-rose-950'
                : 'bg-slate-50/60 border-slate-200 text-slate-500'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isVerified
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : isRejected
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  8
                </span>

                {isVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Accredited</span>
                  </span>
                ) : isRejected ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Action Needed</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Final Decision</span>
                )}
              </div>

              <div className="flex items-start gap-2.5 mb-1.5">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isVerified
                      ? 'bg-white/20 text-white'
                      : isRejected
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isVerified ? 'text-white' : ''}`}>
                    {isVerified
                      ? 'Verified Shelter Badge'
                      : isRejected
                      ? 'Verification Rejected'
                      : 'Verified / Rejected'}
                  </h4>
                  <p
                    className={`text-[11px] mt-1 leading-snug ${
                      isVerified ? 'text-emerald-100' : 'text-slate-600'
                    }`}
                  >
                    {isVerified
                      ? 'Official accreditation badge issued with cryptographic verification seal'
                      : isRejected
                      ? 'Detailed remediation feedback supplied with re-audit option'
                      : 'Admin grants Verified Shelter Badge or returns with rectification tasks'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-black/10 text-[11px]">
              {isVerified && request.badge ? (
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-emerald-100 block truncate">
                    Badge: {request.badge.accreditationCode}
                  </span>
                  <span className="text-[10px] text-emerald-200 block">
                    Valid thru: {request.badge.validUntil}
                  </span>
                </div>
              ) : isRejected ? (
                <span className="text-rose-700 font-semibold text-[10px] block">
                  Click to view rectification items
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">Awaiting final admin decision</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

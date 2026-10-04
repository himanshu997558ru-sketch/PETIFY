import React, { useState } from 'react';
import {
  Building2,
  FileText,
  UserCheck,
  Calendar,
  MapPin,
  Camera,
  ClipboardList,
  BarChart3,
  FileCheck,
  ShieldCheck,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

// Import all 12 pipeline components
import { ShelterRegistration } from './ShelterRegistration';
import { VerificationRequest } from './VerificationRequest';
import { WorkerAssignment } from './WorkerAssignment';
import { VisitSchedule } from './VisitSchedule';
import { FieldVisit } from './FieldVisit';
import { CameraEvidence } from './CameraEvidence';
import { InspectionChecklist } from './InspectionChecklist';
import { AuditScore } from './AuditScore';
import { VerificationReport } from './VerificationReport';
import { AdminReview } from './AdminReview';
import { ReInspection } from './ReInspection';
import { VerifiedBadge } from './VerifiedBadge';

export type PipelineStepId =
  | 'registration'
  | 'request'
  | 'assignment'
  | 'schedule'
  | 'visit'
  | 'camera'
  | 'checklist'
  | 'score'
  | 'report'
  | 'review'
  | 'reinspection'
  | 'badge';

interface PipelineStepConfig {
  id: PipelineStepId;
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: any;
  category: 'Registration' | 'Field Audit' | 'Review & Badge';
}

const PIPELINE_STEPS: PipelineStepConfig[] = [
  { id: 'registration', stepNumber: 1, label: '1. Shelter Registration', shortLabel: 'Registration', icon: Building2, category: 'Registration' },
  { id: 'request', stepNumber: 2, label: '2. Verification Request', shortLabel: 'Request', icon: FileText, category: 'Registration' },
  { id: 'assignment', stepNumber: 3, label: '3. Worker Assignment', shortLabel: 'Worker', icon: UserCheck, category: 'Field Audit' },
  { id: 'schedule', stepNumber: 4, label: '4. Visit Schedule', shortLabel: 'Schedule', icon: Calendar, category: 'Field Audit' },
  { id: 'visit', stepNumber: 5, label: '5. Field Visit & Check-In', shortLabel: 'Field Visit', icon: MapPin, category: 'Field Audit' },
  { id: 'camera', stepNumber: 6, label: '6. Camera Evidence (8)', shortLabel: 'Camera', icon: Camera, category: 'Field Audit' },
  { id: 'checklist', stepNumber: 7, label: '7. Inspection Checklist', shortLabel: 'Checklist', icon: ClipboardList, category: 'Field Audit' },
  { id: 'score', stepNumber: 8, label: '8. Inspection Score', shortLabel: 'Audit Score', icon: BarChart3, category: 'Field Audit' },
  { id: 'report', stepNumber: 9, label: '9. Verification Report', shortLabel: 'Report', icon: FileCheck, category: 'Field Audit' },
  { id: 'review', stepNumber: 10, label: '10. Admin Review', shortLabel: 'Admin Review', icon: ShieldCheck, category: 'Review & Badge' },
  { id: 'reinspection', stepNumber: 11, label: '11. Re-Inspection', shortLabel: 'Re-Inspection', icon: RotateCcw, category: 'Review & Badge' },
  { id: 'badge', stepNumber: 12, label: '12. Verified Badge', shortLabel: 'Verified Badge', icon: Award, category: 'Review & Badge' },
];

interface ShelterVerificationPipelineHubProps {
  initialRequestId?: string;
  userRole?: 'admin' | 'shelter';
}

export const ShelterVerificationPipelineHub: React.FC<ShelterVerificationPipelineHubProps> = ({
  initialRequestId = 'VR-2025-105',
  userRole = 'admin',
}) => {
  const { requests, activeRequestId, setActiveRequestId } = useShelterVerification();

  // Active selected ID in dropdown (defaulting to VR-2025-105)
  const currentId = activeRequestId || initialRequestId;
  const currentReq = requests.find((r) => r.requestId === currentId) || requests[0];
  const s = currentReq?.shelter;

  // Active step in 12-page pipeline
  const [activeStep, setActiveStep] = useState<PipelineStepId>('score');

  const currentIndex = PIPELINE_STEPS.findIndex((st) => st.id === activeStep);

  const handleNext = () => {
    if (currentIndex < PIPELINE_STEPS.length - 1) {
      setActiveStep(PIPELINE_STEPS[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveStep(PIPELINE_STEPS[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Universal Verification Record Selector Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#99f6e4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Shelter Verification Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4]">
                VR ID: {currentReq?.requestId || 'VR-2025-105'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Connected End-to-End: Registration → Documents → Worker → Camera → Checklist → Report → Admin Review → Accredited Badge.
            </p>
          </div>
        </div>

        {/* Verification Request Dropdown Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-600 shrink-0">Select Verification Record:</label>
          <div className="relative w-full sm:w-auto">
            <select
              value={currentId}
              onChange={(e) => setActiveRequestId(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-[#0d9488] cursor-pointer shadow-2xs"
            >
              {requests.map((r) => (
                <option key={r.requestId} value={r.requestId}>
                  {r.requestId} — {r.shelter.shelterName} ({r.stage})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shelter Summary Meta Banner */}
      <div className="bg-gradient-to-r from-[#e0f9f5] via-white to-slate-50 p-3 sm:p-4 rounded-2xl border border-[#99f6e4] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-[#0d9488]" />
            <span>{s?.shelterName}</span>
          </div>

          <div className="text-slate-600 flex items-center gap-1">
            <span className="text-slate-400">Director:</span>
            <span className="font-semibold text-slate-800">{s?.directorName || s?.ownerName}</span>
          </div>

          <div className="text-slate-600 flex items-center gap-1">
            <span className="text-slate-400">Animals:</span>
            <span className={`font-bold ${s?.currentAnimalCount && s.currentAnimalCount > s.animalCapacity ? 'text-rose-600' : 'text-slate-800'}`}>
              {s?.currentAnimalCount} / {s?.animalCapacity} Capacity
            </span>
          </div>

          <div className="text-slate-600 flex items-center gap-1">
            <span className="text-slate-400">Worker:</span>
            <span className="font-semibold text-slate-800">{currentReq?.assignedWorker?.name || 'Unassigned'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Stage:</span>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4]">
            {currentReq?.stage || 'PENDING'}
          </span>
        </div>
      </div>

      {/* Mobile Fast Step Selector */}
      <div className="md:hidden flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-[#99f6e4] shadow-xs">
        <span className="text-xs font-bold text-[#0d9488] shrink-0">Pipeline Step:</span>
        <select
          value={activeStep}
          onChange={(e) => setActiveStep(e.target.value as any)}
          className="flex-1 bg-[#f0fdfa] text-xs font-bold text-slate-800 border border-[#99f6e4] rounded-xl py-2 px-3 outline-none"
        >
          {PIPELINE_STEPS.map((step) => (
            <option key={step.id} value={step.id}>
              {step.stepNumber}. {step.label}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive 12-Step Horizontal Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 border border-[#99f6e4] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isPassed = idx < currentIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#0d9488] text-white shadow-xs scale-102 ring-2 ring-[#99f6e4]'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : isPassed ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {step.stepNumber}
                </span>
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{step.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic 12-Component Viewport */}
      <div>
        {activeStep === 'registration' && (
          <ShelterRegistration
            requestId={currentId}
            onSubmitted={() => setActiveStep('request')}
            onNext={handleNext}
          />
        )}

        {activeStep === 'request' && (
          <VerificationRequest
            requestId={currentId}
            onNext={handleNext}
            onAssignWorker={() => setActiveStep('assignment')}
          />
        )}

        {activeStep === 'assignment' && (
          <WorkerAssignment
            requestId={currentId}
            onAssigned={() => setActiveStep('schedule')}
            onNext={handleNext}
          />
        )}

        {activeStep === 'schedule' && (
          <VisitSchedule
            requestId={currentId}
            onNext={handleNext}
            onStartVisit={() => setActiveStep('visit')}
          />
        )}

        {activeStep === 'visit' && (
          <FieldVisit
            requestId={currentId}
            onNext={handleNext}
            onOpenCamera={() => setActiveStep('camera')}
            onOpenChecklist={() => setActiveStep('checklist')}
          />
        )}

        {activeStep === 'camera' && (
          <CameraEvidence
            requestId={currentId}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'checklist' && (
          <InspectionChecklist
            requestId={currentId}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'score' && (
          <AuditScore
            requestId={currentId}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'report' && (
          <VerificationReport
            requestId={currentId}
            onSubmitted={() => setActiveStep('review')}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'review' && (
          <AdminReview
            requestId={currentId}
            onApproved={() => setActiveStep('badge')}
            onRequestReInspection={() => setActiveStep('reinspection')}
            onRejected={() => setActiveStep('review')}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'reinspection' && (
          <ReInspection
            requestId={currentId}
            onStartRevisit={() => setActiveStep('visit')}
            onNext={() => setActiveStep('badge')}
            onPrev={handlePrev}
          />
        )}

        {activeStep === 'badge' && (
          <VerifiedBadge
            requestId={currentId}
            onPrev={handlePrev}
            onResetFlow={() => setActiveStep('score')}
          />
        )}
      </div>
    </div>
  );
};

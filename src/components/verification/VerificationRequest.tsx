import React from 'react';
import {
  FileText,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface VerificationRequestProps {
  requestId?: string;
  onNext?: () => void;
  onAssignWorker?: () => void;
}

export const VerificationRequest: React.FC<VerificationRequestProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onAssignWorker,
}) => {
  const { requests } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;

  // Timeline definition: Registration -> Request Submitted -> Worker Assigned -> Visit Scheduled
  const timelineSteps = [
    {
      id: 'reg',
      title: 'Registration',
      description: 'Shelter details & legal credentials filed',
      isCompleted: true,
      current: false,
      date: s?.registeredAt ? new Date(s.registeredAt).toLocaleDateString() : '02 May 2025',
    },
    {
      id: 'submitted',
      title: 'Request Submitted',
      description: 'Legal documents uploaded & queued for audit',
      isCompleted: true,
      current: !currentReq?.assignedWorker,
      date: currentReq?.requestDate || '02 May 2025',
    },
    {
      id: 'assigned',
      title: 'Worker Assigned',
      description: currentReq?.assignedWorker ? `${currentReq.assignedWorker.name}` : 'Pending administrator assignment',
      isCompleted: Boolean(currentReq?.assignedWorker),
      current: Boolean(currentReq?.assignedWorker && !currentReq?.scheduledVisitDate),
      date: currentReq?.assignedWorker ? '05 May 2025' : 'Pending',
    },
    {
      id: 'scheduled',
      title: 'Visit Scheduled',
      description: currentReq?.scheduledVisitDate
        ? `${currentReq.scheduledVisitDate} (${currentReq.scheduledVisitTime || '10:00 AM'})`
        : 'Inspection date awaiting confirmation',
      isCompleted: Boolean(currentReq?.scheduledVisitDate),
      current: Boolean(currentReq?.scheduledVisitDate),
      date: currentReq?.scheduledVisitDate || 'TBD',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 2 of 12: Request Dossier
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">2. Verification Request Status</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Track legal submission status, assigned field inspection officer, document compliance, and field audit scheduling.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Current Status</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentReq?.stage === 'VERIFICATION_REQUESTED' ? 'Pending Verification' : currentReq?.stage || 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* Core Metadata Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <FileText className="w-4 h-4 text-[#0d9488]" />
              <span>Verification ID</span>
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">{currentReq?.requestId || requestId}</p>
            <span className="text-[10px] text-slate-500">Universal audit tracking code</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Calendar className="w-4 h-4 text-[#0d9488]" />
              <span>Submission Date</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{currentReq?.requestDate || '02 May 2025'}</p>
            <span className="text-[10px] text-slate-500">Official filing date</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Building2 className="w-4 h-4 text-[#0d9488]" />
              <span>Shelter Name</span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate" title={s?.shelterName}>
              {s?.shelterName || 'Metro Paws Sanctuary'}
            </p>
            <span className="text-[10px] text-slate-500">{s?.city || 'Austin'}, {s?.state || 'TX'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4 text-[#0d9488]" />
              <span>Expected Visit Date</span>
            </div>
            <p className="text-sm font-bold text-[#0f766e]">
              {currentReq?.scheduledVisitDate || 'Pending Schedule'}
            </p>
            <span className="text-[10px] text-slate-500">
              {currentReq?.scheduledVisitTime || 'Time window TBD'}
            </span>
          </div>
        </div>

        {/* 4-Step Pipeline Flowchart (Registration -> Request Submitted -> Worker Assigned -> Visit Scheduled) */}
        <div className="bg-gradient-to-br from-[#e0f9f5]/50 to-white p-5 rounded-2xl border border-[#99f6e4]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
            Verification Request Pipeline Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {timelineSteps.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative ${
                    step.isCompleted
                      ? 'bg-white border-emerald-300 shadow-2xs'
                      : step.current
                      ? 'bg-[#ccfbf1]/60 border-[#0d9488] shadow-xs ring-1 ring-[#0d9488]'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        0{idx + 1}
                      </span>
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : step.current ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488] animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{step.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Date</span>
                    <span className="font-semibold text-slate-700">{step.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Officer & Documents Submitted Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Officer Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#0d9488]" />
                Assigned Officer
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ccfbf1] text-[#0f766e]">
                {currentReq?.assignedWorker ? 'Assigned' : 'Unassigned'}
              </span>
            </div>

            {currentReq?.assignedWorker ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentReq.assignedWorker.avatarUrl}
                    alt={currentReq.assignedWorker.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#99f6e4]"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{currentReq.assignedWorker.name}</h5>
                    <p className="text-xs text-slate-500">{currentReq.assignedWorker.designation}</p>
                    <span className="text-[10px] font-mono text-[#0f766e] font-bold">
                      Badge: {currentReq.assignedWorker.badgeNumber}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Phone:</span>
                    <span className="font-semibold text-slate-800">{currentReq.assignedWorker.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-800">{currentReq.assignedWorker.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Specialty:</span>
                    <span className="font-semibold text-slate-800">{currentReq.assignedWorker.specialty}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onAssignWorker}
                  className="w-full py-2 text-xs font-bold text-[#0f766e] bg-[#e0f9f5] hover:bg-[#ccfbf1] rounded-xl transition-colors text-center"
                >
                  Change / Reassign Worker
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600">No field worker has been assigned yet.</p>
                <button
                  type="button"
                  onClick={onAssignWorker}
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Assign Field Worker Now
                </button>
              </div>
            )}
          </div>

          {/* Documents Submitted List */}
          <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#0d9488]" />
                Documents Submitted ({s?.documents?.length || 5})
              </h4>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All legal documents present
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(s?.documents && s.documents.length > 0
                ? s.documents
                : [
                    { id: '1', name: 'Texas_501C3_Registration_Certificate_2025.pdf', type: 'Registration Certificate', status: 'Verified', size: '1.8 MB' },
                    { id: '2', name: 'State_NonProfit_Articles_Incorporation.pdf', type: 'Legal ID', status: 'Verified', size: '2.4 MB' },
                    { id: '3', name: 'Commercial_Lease_Industrial_Blvd.pdf', type: 'Address Proof', status: 'Verified', size: '3.1 MB' },
                    { id: '4', name: 'Arthur_Vance_Govt_Issued_ID.pdf', type: 'Owner ID', status: 'Verified', size: '950 KB' },
                    { id: '5', name: 'Travis_County_Kennel_Notice.pdf', type: 'Other Supporting Documents', status: 'Submitted', size: '1.2 MB' },
                  ]
              ).map((doc, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#0d9488] shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Viewing document: ${doc.name}`)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                      title="View Document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Next Action: Admin assigns field auditor and schedules on-site physical visit.
          </span>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Next: Worker Assignment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

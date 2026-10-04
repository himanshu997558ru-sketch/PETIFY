import React, { useState } from 'react';
import {
  RotateCcw,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Camera,
  Play,
  ShieldAlert,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface ReInspectionProps {
  requestId?: string;
  onNext?: () => void;
  onStartRevisit?: () => void;
  onPrev?: () => void;
}

export const ReInspection: React.FC<ReInspectionProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onStartRevisit,
  onPrev,
}) => {
  const { requests, fieldWorkers, scheduleReInspection, startWorkerVisit } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const re = currentReq?.reInspectionDetails;

  const previousScore = re?.previousAuditScore || currentReq?.report?.overallScore || 58;

  const previousIssues = re?.previousIssues || [
    'Facility exceeded licensed capacity by 37% (48 dogs housed in 35-dog facility)',
    'Quarantine isolation ward was compromised for overflow housing',
    'Staff-to-animal ratio below safety standard (1 worker per 48 animals)',
    'Fire safety extinguisher in Annex B past annual inspection',
  ];

  const requiredImprovements = re?.requiredImprovements || [
    'Reduce animal occupancy to or below licensed limit of 35 companions',
    'Restore dedicated medical isolation ward with negative-pressure or physical containment',
    'Employ at least 2 full-time caretakers during operating intake hours',
    'Recertify all fire extinguishers and repair loose perimeter fence latch',
  ];

  const [newVisitDate, setNewVisitDate] = useState<string>(re?.newVisitDate || '2025-06-30');
  const [assignedWorkerId, setAssignedWorkerId] = useState<string>(re?.assignedWorkerId || 'fw-1');
  const [toast, setToast] = useState<string | null>(null);

  const [completedImprovements, setCompletedImprovements] = useState<Record<number, boolean>>({
    0: true, // Reduced census simulated
    1: false,
    2: true, // 2 caretakers hired
    3: false,
  });

  const toggleImprovement = (index: number) => {
    setCompletedImprovements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const assignedWorker = fieldWorkers.find((w) => w.id === assignedWorkerId) || fieldWorkers[0];

  const handleStartRevisit = () => {
    startWorkerVisit(currentReq.requestId, {
      gpsLat: 30.2241,
      gpsLng: -97.7618,
      address: `${s?.streetAddress}, ${s?.city}`,
      time: '10:30 AM',
    });
    setToast('Re-Inspection field visit activated! GPS check-in verified.');
    setTimeout(() => setToast(null), 3000);
    if (onStartRevisit) onStartRevisit();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 11 of 12: Corrective Action Audit
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">11. Re-Inspection &amp; Remediation Tracker</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Track corrective actions following conditional audit findings. Inspector returns to verify reduced animal census, restored isolation wards, and safety repairs.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Re-Inspection Status</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {re?.status || 'SCHEDULED'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {toast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* 5 Key Metric Cards: Previous Score, Issues, Improvements, Date, Worker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Previous Audit Score */}
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-1">
            <span className="text-[10px] text-rose-600 font-bold uppercase block">Previous Audit Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-900 tracking-tight">{previousScore}/100</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Fail / Non-Compliant
              </span>
            </div>
            <p className="text-[11px] text-rose-700">Initial visit revealed critical capacity violations.</p>
          </div>

          {/* New Visit Date */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">New Visit Date</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0d9488]" />
              <input
                type="date"
                value={newVisitDate}
                onChange={(e) => setNewVisitDate(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200"
              />
            </div>
            <p className="text-[10px] text-slate-500">Scheduled on-site verification appointment</p>
          </div>

          {/* Assigned Field Worker */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Assigned Worker</span>
            <div className="flex items-center gap-2.5">
              <img
                src={assignedWorker.avatarUrl}
                alt={assignedWorker.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{assignedWorker.name}</p>
                <p className="text-[10px] font-mono text-[#0f766e] font-bold">{assignedWorker.badgeNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Issues vs Required Improvements Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Previous Issues Flagged */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Previous Audit Non-Compliance Issues
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {previousIssues.map((issue, idx) => (
                <li key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Improvements Checklist */}
          <div className="p-5 bg-white rounded-2xl border border-[#99f6e4] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#0d9488]" />
                Required Improvements Checklist
              </h4>
              <span className="text-[10px] text-slate-500">Click to toggle resolution</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {requiredImprovements.map((imp, idx) => {
                const isResolved = completedImprovements[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleImprovement(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isResolved
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${isResolved ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {idx + 1}
                      </span>
                      <span className={isResolved ? 'font-semibold line-through text-slate-500' : ''}>
                        {imp}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isResolved ? 'Remediated' : 'Pending Action'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Re-Inspection Visit Trigger Bar */}
        <div className="p-5 bg-gradient-to-br from-[#e0f9f5] via-white to-slate-50 rounded-2xl border border-[#99f6e4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">Execute Field Re-Inspection Walkthrough</h4>
            <p className="text-[11px] text-slate-600">
              Worker revisits the shelter, captures fresh photographic evidence of the renovated areas, and verifies compliance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartRevisit}
            className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Re-Inspection Visit</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Back: Admin Review
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Verified Shelter Badge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

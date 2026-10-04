import React, { useState } from 'react';
import {
  FileText,
  Building2,
  UserCheck,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Camera,
  FileCheck,
  Save,
  Send,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';
import { VerificationReport as IVerificationReport } from '../../types';

interface VerificationReportProps {
  requestId?: string;
  onSubmitted?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const VerificationReport: React.FC<VerificationReportProps> = ({
  requestId = 'VR-2025-105',
  onSubmitted,
  onNext,
  onPrev,
}) => {
  const { requests, saveReportDraft, submitVerificationReport } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const w = currentReq?.assignedWorker;
  const r = currentReq?.report;

  // Report fields
  const [positiveFindings, setPositiveFindings] = useState<string[]>(
    r?.findings?.positiveFindings || [
      'Clean stainless steel water bowls with continuous freshwater circulation',
      'Animals are responsive, well-nourished, and exhibit positive social behaviors',
      'Active volunteer engagement and daily socialization logs maintained',
    ]
  );
  const [issuesFound, setIssuesFound] = useState<string[]>(
    r?.findings?.issuesFound || [
      'Facility is 37% over licensed capacity (48 dogs housed in 35-capacity space)',
      'Staff-to-animal ratio below safety threshold (1 attendant on duty for 48 dogs)',
    ]
  );
  const [safetyConcerns, setSafetyConcerns] = useState<string[]>(
    r?.findings?.safetyConcerns || [
      'Fire safety extinguisher in secondary wing was past annual certification',
      'Secondary containment gate latch requires reinforcement',
    ]
  );
  const [hygieneConcerns, setHygieneConcerns] = useState<string[]>(
    r?.findings?.hygieneConcerns || [
      'East kennel drainage runoff requires enzyme flush upgrade to prevent standing water',
    ]
  );
  const [animalWelfareConcerns, setAnimalWelfareConcerns] = useState<string[]>(
    r?.findings?.animalWelfareConcerns || [
      'Dedicated medical quarantine ward was repurposed for overflow intake',
    ]
  );

  const [recommendations, setRecommendations] = useState<string[]>(
    r?.recommendations || [
      'Reduce animal occupancy to or below licensed limit of 35 companions',
      'Restore dedicated medical isolation ward with physical containment',
      'Employ at least 2 full-time caretakers during operating intake hours',
      'Recertify all fire safety equipment and repair loose perimeter fence latch',
      'Request free Alliance re-inspection after 30 days of documented compliance',
    ]
  );

  const [newRecommendation, setNewRecommendation] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const handleAddRecommendation = () => {
    if (!newRecommendation.trim()) return;
    setRecommendations((prev) => [...prev, newRecommendation.trim()]);
    setNewRecommendation('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    saveReportDraft(currentReq.requestId, {
      findings: {
        positiveFindings,
        issuesFound,
        safetyConcerns,
        hygieneConcerns,
        animalWelfareConcerns,
      },
      recommendations,
    });
    setToast('Draft report saved successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerificationReport(currentReq.requestId, {
      findings: {
        positiveFindings,
        issuesFound,
        safetyConcerns,
        hygieneConcerns,
        animalWelfareConcerns,
      },
      recommendations,
    });
    setToast('Verification report officially submitted! Status updated to Report Submitted.');
    setTimeout(() => setToast(null), 3000);

    if (onSubmitted) onSubmitted();
    if (onNext) onNext();
  };

  const scoreVal = r?.overallScore || 58;

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 9 of 12: Comprehensive Audit Dossier
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">9. Field Verification Report</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Inspectors compile on-site findings, synthesize photographic and documentary evidence, catalog safety and welfare concerns, and formulate actionable recommendations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Report Status</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentReq?.stage === 'REPORT_UPLOADED' ? 'Report Submitted' : 'Report Drafting'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
        {toast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* 1. Report Information Card */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-200">
            <FileText className="w-4 h-4 text-[#0d9488]" />
            1. Report Information
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Verification ID</span>
              <span className="font-bold text-slate-900 font-mono">{currentReq?.requestId || requestId}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Shelter Name</span>
              <span className="font-bold text-slate-900 truncate block">{s?.shelterName}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Worker Name</span>
              <span className="font-bold text-slate-900 truncate block">{w?.name || r?.workerName || 'Officer Elena Rostova'}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Visit Date</span>
              <span className="font-bold text-slate-900">{r?.visitDate || currentReq?.scheduledVisitDate || '2025-05-10'}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Audit Score</span>
              <span className="font-extrabold text-[#0d9488]">{scoreVal}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-600">
              <Clock className="w-4 h-4 text-[#0d9488]" />
              <span><strong>Check-in Time:</strong> {r?.checkInTime || '10:00 AM'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-600">
              <Clock className="w-4 h-4 text-[#0d9488]" />
              <span><strong>Check-out Time:</strong> {r?.checkOutTime || '01:00 PM'}</span>
            </div>
          </div>
        </div>

        {/* 2. Evidence Summary Card */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Camera className="w-4 h-4 text-[#0d9488]" />
            2. Evidence &amp; Verification Assets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#0d9488]" /> Uploaded Photos ({r?.evidencePhotos?.length || 8})
              </span>
              <p className="text-[10px] text-slate-500">
                Front, Entrance, Enclosures, Water, Sanitation, Medical, Safety, and Additional photos verified.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#0d9488]" /> Documents Verified ({s?.documents?.length || 5})
              </span>
              <p className="text-[10px] text-slate-500">
                501(c)(3) certificate, Articles of Inc., commercial lease, owner ID, kennel license cross-referenced.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0d9488]" /> Checklist Results (24 Items)
              </span>
              <p className="text-[10px] text-slate-500">
                Composite Score: <strong>{scoreVal}/100</strong> across Facility, Hygiene, Welfare, Vet &amp; Safety.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Findings Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-1 border-b border-slate-100">
            <ShieldAlert className="w-4 h-4 text-[#0d9488]" />
            3. Inspector Findings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Positive Findings */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Positive Findings
              </span>
              <ul className="space-y-1.5 text-[11px] text-emerald-950">
                {positiveFindings.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Issues Found */}
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Issues Found (Capacity &amp; Staffing)
              </span>
              <ul className="space-y-1.5 text-[11px] text-rose-950">
                {issuesFound.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Concerns */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Safety Concerns
              </span>
              <ul className="space-y-1.5 text-[11px] text-amber-950">
                {safetyConcerns.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hygiene & Welfare Concerns */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-indigo-600" /> Hygiene &amp; Animal Welfare Concerns
              </span>
              <ul className="space-y-1.5 text-[11px] text-indigo-950">
                {[...hygieneConcerns, ...animalWelfareConcerns].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Recommendations Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-1 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#0d9488]" />
            4. Inspector Recommendations for Shelter
          </h3>

          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-[#0d9488]">{index + 1}.</span>
                  <span className="text-slate-800">{rec}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRecommendation(index)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove Recommendation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add Recommendation Row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                placeholder="Type additional recommendation for shelter improvement..."
                className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
              />
              <button
                type="button"
                onClick={handleAddRecommendation}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Back: Audit Score
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-[#99f6e4] text-[#0f766e] bg-[#e0f9f5] hover:bg-[#ccfbf1] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Next: Admin Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

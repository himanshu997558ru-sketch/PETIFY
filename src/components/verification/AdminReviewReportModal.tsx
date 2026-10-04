import React, { useState } from 'react';
import {
  FileSearch,
  X,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Building2,
  UserCheck,
  Calendar,
  Sparkles,
  Camera,
  ClipboardList,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { ShelterVerificationRequest } from '../../types';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface AdminReviewReportModalProps {
  request: ShelterVerificationRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminReviewReportModal: React.FC<AdminReviewReportModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { reviewReport } = useShelterVerification();

  const report = request.report;
  const [decision, setDecision] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [adminNotes, setAdminNotes] = useState(
    'All physical welfare metrics, veterinary protocols, and hygiene standards verified in person by our certified welfare officer. Outstanding commitment to humane companion care.'
  );

  // If rejecting: reasons and remediation
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([
    'Over-capacity violation detected during physical inspection',
    'Inadequate negative-pressure isolation in quarantine ward',
  ]);
  const [newReason, setNewReason] = useState('');

  const [rectificationSteps, setRectificationSteps] = useState<string[]>([
    'Reduce total intake census to licensed threshold',
    'Refit quarantine airflow ventilation and submit photo verification',
    'Schedule free alliance re-inspection within 30 days',
  ]);
  const [newStep, setNewStep] = useState('');

  const handleAddReason = () => {
    if (newReason.trim()) {
      setRejectionReasons([...rejectionReasons, newReason.trim()]);
      setNewReason('');
    }
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setRectificationSteps([...rectificationSteps, newStep.trim()]);
      setNewStep('');
    }
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    reviewReport(
      request.requestId,
      decision,
      adminNotes,
      decision === 'REJECTED' ? rejectionReasons : undefined,
      decision === 'REJECTED' ? rectificationSteps : undefined
    );
    onSuccess?.();
    onClose();
  };

  if (!report) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#fbfdfc] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Admin Reviews Report</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Step 7 of Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Evaluate field auditor physical findings, scores &amp; grant Verified Shelter Badge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Executive Header Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Shelter Facility</span>
              <h4 className="text-base font-bold text-slate-900">{request.shelter.shelterName}</h4>
              <p className="text-slate-600 mt-0.5">
                {request.shelter.streetAddress}, {request.shelter.city}, {request.shelter.state}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                <span>Director: {request.shelter.directorName}</span>
                <span>•</span>
                <span>Reg: {request.shelter.legalRegNumber}</span>
              </div>
            </div>

            {/* Score Pill */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Audit Score</span>
              <span
                className={`text-2xl font-black ${
                  report.overallScore >= 85
                    ? 'text-emerald-600'
                    : report.overallScore >= 70
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {report.overallScore} / 100
              </span>
              <span className="text-[11px] font-bold text-slate-700 block mt-0.5">
                {report.overallGrade}
              </span>
            </div>
          </div>

          {/* Inspector Information & Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-blue-50/50 border border-blue-200/70 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase">Field Officer</span>
              <p className="font-bold text-slate-900 mt-0.5">{report.workerName}</p>
              <p className="text-[10px] font-mono text-blue-700">{report.workerBadge}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase">Visit Date &amp; Window</span>
              <p className="font-bold text-slate-900 mt-0.5">{report.visitDate}</p>
              <p className="text-[10px] text-slate-600">
                {report.visitStartTime} — {report.visitEndTime}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase">Officer Recommendation</span>
              <p
                className={`font-bold mt-0.5 ${
                  report.inspectorRecommendation.includes('Verify')
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {report.inspectorRecommendation}
              </p>
            </div>
          </div>

          {/* Physical Verification Checklist Matrix */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Physical Verification Standards Check</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Enclosure Space', val: report.checklist.enclosureSpace },
                { label: 'Climate & Air', val: report.checklist.climateVentilation },
                { label: 'Clean Water/Food', val: report.checklist.cleanWaterFood },
                { label: 'Quarantine Ward', val: report.checklist.quarantineIsolation },
                { label: 'Medical Records', val: report.checklist.vetCareRecords },
                { label: 'Sanitation & Pest', val: report.checklist.sanitationPestControl },
                { label: 'Staff Ratio/Safety', val: report.checklist.staffRatioSafety },
                { label: 'Humane Treatment', val: report.checklist.humaneTreatment },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                    item.val
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <span className="font-medium truncate">{item.label}</span>
                  {item.val ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Photos */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Auditor Photographic Evidence</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {report.photos.map((p) => (
                <div
                  key={p.id}
                  className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900"
                >
                  <img src={p.imageUrl} alt={p.caption} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5 text-white">
                    <span className="text-[10px] truncate leading-tight font-medium">
                      {p.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observations & Field Officer Signature */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Inspector Field Observations
            </span>
            <p className="text-slate-800 text-xs leading-relaxed italic">
              &quot;{report.inspectorObservations}&quot;
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Audited &amp; Signed By: <strong className="text-slate-700">{report.workerSignature}</strong>
              </span>
              <span className="text-slate-400 font-mono">Ref: {report.reportId}</span>
            </div>
          </div>

          {/* ================= ADMIN DECISION CONTROLS ================= */}
          <form onSubmit={handleConfirmDecision} className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              Admin Final Accreditation Verdict
            </h4>

            {/* Decision Toggle: Verified vs Rejected */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('VERIFIED')}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                  decision === 'VERIFIED'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-emerald-950 text-xs sm:text-sm">
                    Verified (Grant Badge)
                  </h5>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                    Issues official Verified Shelter Badge with public accreditation code.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                  decision === 'REJECTED'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-100 text-rose-800 shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-rose-950 text-xs sm:text-sm">
                    Rejected (Remediation)
                  </h5>
                  <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                    Declines accreditation with required remediation steps for re-application.
                  </p>
                </div>
              </button>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Official Alliance Board Remarks &amp; Certification Statement
              </label>
              <textarea
                rows={2}
                required
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-indigo-600 text-slate-800"
              />
            </div>

            {/* If Rejected: Configurable Remediation Points */}
            {decision === 'REJECTED' && (
              <div className="space-y-3 p-4 bg-rose-50/60 border border-rose-200 rounded-2xl">
                <h5 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Specify Non-Compliance Grounds &amp; Rectification Pathway</span>
                </h5>

                <div className="space-y-2">
                  <span className="font-semibold text-rose-800 block text-[11px]">
                    Identified Non-Compliance Grounds:
                  </span>
                  <ul className="space-y-1">
                    {rejectionReasons.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-rose-900 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Add another violation ground..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-rose-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddReason}
                      className="px-3 py-1.5 bg-rose-200 text-rose-900 font-bold rounded-lg text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-rose-200">
                  <span className="font-semibold text-rose-800 block text-[11px]">
                    Mandatory Rectification Tasks for Shelter Re-Application:
                  </span>
                  <ul className="space-y-1">
                    {rectificationSteps.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-rose-900 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Add remediation directive..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-rose-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3 py-1.5 bg-rose-200 text-rose-900 font-bold rounded-lg text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
              >
                Cancel
              </button>

              {decision === 'VERIFIED' ? (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Grant Accreditation &amp; Issue Verified Shelter Badge</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Finalize Rejection &amp; Transmit Remediation Plan</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

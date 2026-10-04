import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck,
  UserCheck,
  Calendar,
  Camera,
  ClipboardList,
  BarChart3,
  FileText,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  XCircle,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface AdminReviewProps {
  requestId?: string;
  onApproved?: () => void;
  onRequestReInspection?: () => void;
  onRejected?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AdminReview: React.FC<AdminReviewProps> = ({
  requestId = 'VR-2025-105',
  onApproved,
  onRequestReInspection,
  onRejected,
  onNext,
  onPrev,
}) => {
  const { requests, reviewReport } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const w = currentReq?.assignedWorker;
  const r = currentReq?.report;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'registration' | 'documents' | 'photos' | 'checklist' | 'report'
  >('overview');

  const [adminReviewNote, setAdminReviewNote] = useState<string>(
    currentReq?.adminReview?.adminNotes ||
      'Audit reviewed by Alliance Super Admin. Facility exceeds licensed capacity by 37% (48 dogs in 35-capacity space) and isolation ward was repurposed. Re-inspection required after 30-day capacity remediation.'
  );

  const [toast, setToast] = useState<string | null>(null);

  const scoreVal = r?.overallScore || 58;

  const handleApprove = () => {
    reviewReport(
      currentReq.requestId,
      'VERIFIED',
      adminReviewNote || 'Accreditation granted. Verified Shelter Badge issued with gold seal.'
    );
    setToast('Verification APPROVED! Verified Shelter Badge generated.');
    setTimeout(() => setToast(null), 3000);
    if (onApproved) onApproved();
    if (onNext) onNext();
  };

  const handleRequestReInspection = () => {
    reviewReport(
      currentReq.requestId,
      'RE_INSPECTION_REQUESTED',
      adminReviewNote || 'Re-inspection requested to verify capacity compliance.',
      [
        'Facility exceeded licensed capacity by 37% (48 dogs housed in 35-dog facility)',
        'Quarantine isolation ward was compromised for overflow housing',
        'Staff-to-animal ratio below safety standard (1 worker per 48 animals)',
      ],
      [
        'Reduce animal occupancy to or below licensed limit of 35 companions',
        'Restore dedicated medical isolation ward with negative-pressure or physical containment',
        'Employ at least 2 full-time caretakers during operating intake hours',
        'Request free Alliance re-inspection after 30 days of documented compliance',
      ],
      '2025-06-30'
    );
    setToast('Re-Inspection visit requested and scheduled for 30 June 2025.');
    setTimeout(() => setToast(null), 3000);
    if (onRequestReInspection) onRequestReInspection();
    if (onNext) onNext();
  };

  const handleReject = () => {
    reviewReport(
      currentReq.requestId,
      'REJECTED',
      adminReviewNote || 'Accreditation rejected due to critical non-compliance.',
      ['Severe overcrowding and failure to maintain mandatory isolation containment.']
    );
    setToast('Verification rejected.');
    setTimeout(() => setToast(null), 3000);
    if (onRejected) onRejected();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 10 of 12: Administrative Adjudication
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">10. Admin Review &amp; Decision Portal</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Examine the full verification record: registration, documents, worker credentials, visit logs, camera evidence, checklist results, and findings to render the accreditation decision.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Decision Status</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentReq?.adminReview?.decision || currentReq?.stage || 'PENDING DECISION'}
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

        {/* 9 Dossier Inspection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar text-xs font-bold">
          {[
            { id: 'overview', label: 'Dossier Overview', icon: ShieldCheck },
            { id: 'registration', label: 'Shelter Registration', icon: Building2 },
            { id: 'documents', label: 'Legal Documents', icon: FileCheck },
            { id: 'photos', label: 'Camera Evidence (8)', icon: Camera },
            { id: 'checklist', label: 'Inspection Checklist', icon: ClipboardList },
            { id: 'report', label: 'Worker Report & Findings', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#0d9488] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dossier Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Shelter Candidate</span>
                <p className="text-sm font-bold text-slate-900">{s?.shelterName}</p>
                <p className="text-xs text-slate-600">Director: {s?.directorName || s?.ownerName}</p>
                <span className="text-[11px] font-mono text-[#0f766e]">{s?.contactEmail}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Field Auditor</span>
                <p className="text-sm font-bold text-slate-900">{w?.name || 'Officer Elena Rostova'}</p>
                <p className="text-xs text-slate-600">Badge: {w?.badgeNumber || 'PT-FW-042'}</p>
                <span className="text-[11px] text-slate-500">Visit Date: {r?.visitDate || '2025-05-10'}</span>
              </div>

              <div className="p-4 bg-[#e0f9f5]/50 rounded-2xl border border-[#99f6e4] space-y-1">
                <span className="text-[10px] text-[#0f766e] font-semibold uppercase block">Inspection Audit Result</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{scoreVal}/100</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Conditional (58)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">Shortfall: Overcapacity (48/35) &amp; Quarantine ward overflow</p>
              </div>
            </div>

            {/* Quick 5 Dimension Scores Preview */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Audit Score Breakdown</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Facility</span>
                  <span className="text-sm font-bold text-slate-900">15 / 20</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Hygiene</span>
                  <span className="text-sm font-bold text-slate-900">14 / 20</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Animal Welfare</span>
                  <span className="text-sm font-bold text-slate-900">16 / 20</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Veterinary Care</span>
                  <span className="text-sm font-bold text-rose-700">7 / 20</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Safety</span>
                  <span className="text-sm font-bold text-rose-700">6 / 20</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registration Detail */}
        {activeTab === 'registration' && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Shelter Registration Data Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <p><strong>Legal Reg No:</strong> {s?.legalRegNumber}</p>
              <p><strong>Tax ID (EIN):</strong> {s?.taxId}</p>
              <p><strong>Type:</strong> {s?.shelterType}</p>
              <p><strong>Address:</strong> {s?.streetAddress}, {s?.city}, {s?.state} {s?.zipCode}</p>
              <p><strong>Pincode:</strong> {s?.pincode || s?.zipCode}</p>
              <p><strong>Contact Phone:</strong> {s?.contactPhone}</p>
              <p><strong>Operating Hours:</strong> {s?.operatingHours}</p>
              <p><strong>Capacity / Census:</strong> {s?.animalCapacity} max / {s?.currentAnimalCount} active</p>
              <p><strong>Registered Date:</strong> {s?.registeredAt ? new Date(s.registeredAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p><strong>Veterinary Support:</strong> {s?.veterinarySupportDetails}</p>
              <p className="mt-1"><strong>Description:</strong> {s?.shelterDescription}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Legal Documents Detail */}
        {activeTab === 'documents' && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Submitted Legal Verification Documents</h4>
            <div className="divide-y divide-slate-200">
              {(s?.documents || []).map((doc, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#0d9488]" />
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.type} • {doc.size || '2.0 MB'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Photos Detail */}
        {activeTab === 'photos' && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">8 Photographic Verification Evidence Zones</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(r?.evidencePhotos || []).map((p, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                  <div className="h-28 bg-slate-100">
                    <img src={p.photoUrl} alt={p.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 space-y-0.5">
                    <p className="font-bold text-slate-900 truncate">{p.category}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.captureTime} • Ref #{p.id.slice(-4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Checklist Detail */}
        {activeTab === 'checklist' && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Physical Inspection Checklist Audit Record</h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(r?.detailedChecklist || []).map((item) => (
                <div key={item.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.category}</span>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.notes && <p className="text-[10px] text-slate-500 italic">{item.notes}</p>}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Needs Improvement'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Report & Findings Detail */}
        {activeTab === 'report' && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Inspector Observations &amp; Recommendations</h4>
            <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {r?.inspectorObservations || 'Physical audit complete. Severe overcrowding and repurposing of quarantine ward necessitate re-inspection.'}
            </p>
            <div className="space-y-1">
              <span className="font-bold text-slate-800">Recommendations for Shelter:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {(r?.recommendations || []).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Admin Review Note Textarea */}
        <div className="p-5 bg-gradient-to-br from-[#e0f9f5]/30 to-white rounded-2xl border border-[#99f6e4] space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#0d9488]" />
            Official Admin Review Note (Appended to Legal Audit Record)
          </label>
          <textarea
            rows={3}
            value={adminReviewNote}
            onChange={(e) => setAdminReviewNote(e.target.value)}
            placeholder="Document administrative reasoning, statutory compliance benchmarks, or re-inspection mandates..."
            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
          />
        </div>

        {/* 3 Core Admin Actions: Approve / Request Re-Inspection / Reject */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Back: Report
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Reject Verification */}
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Verification</span>
            </button>

            {/* Request Re-Inspection */}
            <button
              type="button"
              onClick={handleRequestReInspection}
              className="px-5 py-2.5 border border-amber-300 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Request Re-Inspection</span>
            </button>

            {/* Approve Verification */}
            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

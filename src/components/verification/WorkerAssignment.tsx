import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  Building2,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  UserPlus,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';
import { FieldWorker } from '../../types';

interface WorkerAssignmentProps {
  requestId?: string;
  onAssigned?: () => void;
  onNext?: () => void;
}

export const WorkerAssignment: React.FC<WorkerAssignmentProps> = ({
  requestId = 'VR-2025-105',
  onAssigned,
  onNext,
}) => {
  const { requests, fieldWorkers, assignFieldWorker, changeWorker } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    currentReq?.assignedWorker?.id || fieldWorkers[0].id
  );
  const [visitDate, setVisitDate] = useState<string>(currentReq?.scheduledVisitDate || '2025-05-10');
  const [visitTime, setVisitTime] = useState<string>(currentReq?.scheduledVisitTime || '10:00 AM - 01:00 PM');
  const [assignmentNotes, setAssignmentNotes] = useState<string>(
    currentReq?.adminAssignmentNotes ||
      'Verify animal capacity compliance (rated for 35, currently housing 48), medical quarantine containment, and staff-to-animal safety ratios.'
  );

  const [toast, setToast] = useState<string | null>(null);

  const handleAssignOrChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReq) return;

    assignFieldWorker(currentReq.requestId, selectedWorkerId, visitDate, visitTime, assignmentNotes);

    const worker = fieldWorkers.find((w) => w.id === selectedWorkerId);
    setToast(`Worker assigned: ${worker?.name} scheduled for ${visitDate} (${visitTime})`);
    setTimeout(() => setToast(null), 3000);

    if (onAssigned) onAssigned();
    if (onNext) onNext();
  };

  const assignedWorker = currentReq?.assignedWorker || fieldWorkers.find((w) => w.id === selectedWorkerId);

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 3 of 12: Field Deployment
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">3. Admin Assigns Field Worker</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Designate an authorized welfare field inspector, set on-site arrival window, and configure audit briefing notes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Assigned Shelter</span>
            <span className="text-sm font-bold text-white tracking-wide truncate block max-w-[200px]">
              {s?.shelterName || 'Metro Paws Sanctuary'}
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

        {/* Current Assignment Overview Panel */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0d9488]" />
            Active Field Worker Assignment Dossier
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Officer Name</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{assignedWorker?.name || 'Unassigned'}</p>
              <span className="text-[10px] text-[#0f766e] font-mono">{assignedWorker?.designation}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Officer ID / Badge</span>
              <p className="text-xs font-bold text-slate-900 font-mono mt-0.5">{assignedWorker?.id.toUpperCase()} • {assignedWorker?.badgeNumber}</p>
              <span className="text-[10px] text-slate-500">Official Alliance Credential</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Contact Number</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{assignedWorker?.phone || 'N/A'}</p>
              <span className="text-[10px] text-slate-500">{assignedWorker?.email}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Visit Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-bold text-slate-900">
                  {currentReq?.workerVisitStartedAt ? 'Visit In Progress' : 'Inspection Scheduled'}
                </p>
              </div>
              <span className="text-[10px] text-slate-500">{visitDate} ({visitTime})</span>
            </div>
          </div>
        </div>

        {/* Worker Selection Directory */}
        <form onSubmit={handleAssignOrChange} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Field Worker
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fieldWorkers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#e0f9f5]/60 border-[#0d9488] shadow-xs ring-2 ring-[#0d9488]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatarUrl}
                          alt={worker.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{worker.name}</h4>
                          <p className="text-[11px] text-slate-500">{worker.designation}</p>
                          <span className="text-[10px] font-mono text-[#0f766e] font-bold">
                            {worker.badgeNumber}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                        <p><strong className="text-slate-700">Specialty:</strong> {worker.specialty}</p>
                        <p><strong className="text-slate-700">Region:</strong> {worker.region}</p>
                        <p className="text-slate-500 font-semibold">{worker.activeAuditsCount} active audits underway</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">{worker.phone}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#0d9488] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Parameters & Audit Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visit Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visit Time Window <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] cursor-pointer"
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning Audit)</option>
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Standard Walkthrough)</option>
                  <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM (Afternoon Shift)</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Late Inspection)</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Assignment Briefing Notes &amp; Audit Focus
              </label>
              <textarea
                rows={2}
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Specific areas of concern or focus for the inspector..."
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  changeWorker(currentReq.requestId, selectedWorkerId);
                  setToast('Worker changed successfully.');
                  setTimeout(() => setToast(null), 2500);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Worker Only</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Assign &amp; Schedule Visit</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

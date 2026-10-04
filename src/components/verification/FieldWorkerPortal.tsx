import React, { useState } from 'react';
import {
  UserCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';
import { ScreenType, ShelterVerificationRequest } from '../../types';
import { FieldWorkerInspectionModal } from './FieldWorkerInspectionModal';
import { VerificationPipelineTracker } from './VerificationPipelineTracker';

interface FieldWorkerPortalProps {
  onNavigateScreen?: (screen: ScreenType) => void;
  onBackToMain?: () => void;
}

export const FieldWorkerPortal: React.FC<FieldWorkerPortalProps> = ({ onNavigateScreen, onBackToMain }) => {
  const { requests, fieldWorkers } = useShelterVerification();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(fieldWorkers[0].id);
  const [activeModalRequest, setActiveModalRequest] = useState<ShelterVerificationRequest | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentWorker =
    fieldWorkers.find((w) => w.id === selectedWorkerId) || fieldWorkers[0];

  // Requests assigned to this worker or needing action
  const assignedRequests = requests.filter((r) => {
    const matchesWorker = r.assignedWorker?.id === currentWorker.id || !r.assignedWorker;
    const matchesSearch =
      r.shelter.shelterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shelter.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 p-2.5 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Field Worker Inspection Portal
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                    On-Site Audits
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Worker Visits Shelter • Physical Verification • Verification Report Uploads
                </p>
              </div>
            </div>

            {/* Inspector Selector & Back CTA */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs">
                <span className="text-slate-300 text-[11px]">Active Inspector:</span>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer"
                >
                  {fieldWorkers.map((w) => (
                    <option key={w.id} value={w.id} className="text-slate-900">
                      {w.name} ({w.badgeNumber})
                    </option>
                  ))}
                </select>
              </div>

              {(onNavigateScreen || onBackToMain) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateScreen) {
                      onNavigateScreen('admin');
                    } else if (onBackToMain) {
                      onBackToMain();
                    }
                  }}
                  className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Exit Inspector Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Worker Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentWorker.avatarUrl}
              alt={currentWorker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentWorker.name}</h2>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg">
                  {currentWorker.badgeNumber}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{currentWorker.designation}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentWorker.region}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {currentWorker.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentWorker.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 self-stretch md:self-auto justify-around">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned</span>
              <span className="text-lg font-black text-slate-900">
                {requests.filter((r) => r.assignedWorker?.id === currentWorker.id).length}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pending Visit
              </span>
              <span className="text-lg font-black text-amber-600">
                {
                  requests.filter(
                    (r) =>
                      r.assignedWorker?.id === currentWorker.id &&
                      (r.stage === 'WORKER_ASSIGNED' || r.stage === 'WORKER_VISITING')
                  ).length
                }
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Reports Filed
              </span>
              <span className="text-lg font-black text-emerald-600">
                {
                  requests.filter(
                    (r) =>
                      r.assignedWorker?.id === currentWorker.id &&
                      (r.stage === 'REPORT_UPLOADED' || r.stage === 'VERIFIED')
                  ).length
                }
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Shelters List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Facility Verification &amp; Inspection Queue
              </h3>
              <p className="text-xs text-slate-500">
                Perform on-site check-in, evaluate physical living standards, and upload verification reports
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facility name or city..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600 text-xs bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assignedRequests.map((req) => {
              const isAssigned = req.assignedWorker?.id === currentWorker.id;
              const hasReport = req.report !== null;
              const isVerified = req.stage === 'VERIFIED';
              const isRejected = req.stage === 'REJECTED';

              return (
                <div
                  key={req.requestId}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {req.shelter.shelterName}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                          {req.requestId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.stage.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {req.shelter.streetAddress}, {req.shelter.city}, {req.shelter.state}{' '}
                          {req.shelter.zipCode}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>Director: {req.shelter.directorName}</span>
                        <span>•</span>
                        <span>Capacity: {req.shelter.animalCapacity}</span>
                        <span>•</span>
                        <span>Current Animals: {req.shelter.currentAnimalCount}</span>
                        {req.scheduledVisitDate && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-blue-700">
                              Visit: {req.scheduledVisitDate} ({req.scheduledVisitTime || '10:00 AM'})
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Button for Worker */}
                    <div className="flex items-center gap-2 self-start lg:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveModalRequest(req)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-2 transition-all"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>
                          {hasReport
                            ? 'View / Update Inspection Audit'
                            : 'Perform Physical Verification →'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Pipeline Tracker Mini */}
                  <div className="pt-2 border-t border-slate-100">
                    <VerificationPipelineTracker request={req} compact />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Physical Inspection Modal */}
      {activeModalRequest && (
        <FieldWorkerInspectionModal
          request={activeModalRequest}
          onClose={() => setActiveModalRequest(null)}
          onSuccess={() => setActiveModalRequest(null)}
        />
      )}
    </div>
  );
};

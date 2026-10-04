import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  UserCheck,
  Building2,
  CheckCircle2,
  Navigation,
  Shield,
  Play,
  Camera,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface FieldVisitProps {
  requestId?: string;
  onNext?: () => void;
  onOpenCamera?: () => void;
  onOpenChecklist?: () => void;
}

export const FieldVisit: React.FC<FieldVisitProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onOpenCamera,
  onOpenChecklist,
}) => {
  const { requests, startWorkerVisit } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const w = currentReq?.assignedWorker;
  const r = currentReq?.report;

  const [isStarted, setIsStarted] = useState<boolean>(Boolean(currentReq?.workerVisitStartedAt));
  const [gpsConfirmed, setGpsConfirmed] = useState<boolean>(Boolean(r?.gpsLocation?.confirmed || true));
  const [checkInTime, setCheckInTime] = useState<string>(r?.checkInTime || '10:00 AM');
  const [toast, setToast] = useState<string | null>(null);

  const handleStartVisit = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeNow);
    setIsStarted(true);
    setGpsConfirmed(true);

    startWorkerVisit(currentReq.requestId, {
      gpsLat: 30.2241,
      gpsLng: -97.7618,
      address: `${s?.streetAddress || '310 Industrial Blvd'}, ${s?.city || 'Austin'}, ${s?.state || 'TX'}`,
      time: timeNow,
    });

    setToast(`Visit started! GPS verified at ${s?.streetAddress}. Check-in recorded at ${timeNow}.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 5 of 12: On-Site Inspection
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">5. Field Worker Check-In &amp; Visit Portal</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Physical verification starts with geo-tagged check-in upon arrival at the shelter gates, timestamping entry credentials and worker presence.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Visit Status</span>
            <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 justify-end">
              <span className={`w-2.5 h-2.5 rounded-full ${isStarted ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isStarted ? 'Visit Active' : 'Ready to Start'}
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

        {/* Start Verification Visit Banner */}
        {!isStarted ? (
          <div className="p-8 bg-gradient-to-br from-[#e0f9f5] via-white to-slate-50 rounded-2xl border border-[#99f6e4] text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0d9488] text-white flex items-center justify-center shadow-sm">
              <Navigation className="w-8 h-8 animate-bounce" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">Arrived at {s?.shelterName}?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Confirm your device GPS location to authenticate physical presence at <strong>{s?.streetAddress}, {s?.city}</strong> and start the on-site walkthrough.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleStartVisit}
                className="px-8 py-3.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Verification Visit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Field Inspection Visit Active</h4>
                <p className="text-[11px] text-emerald-800">
                  Worker verified on-site at {checkInTime}. Proceed to capture photo evidence and complete the checklist.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Check-in: {checkInTime}
            </span>
          </div>
        )}

        {/* Check-in Details: 4 Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* GPS / Location Confirmation */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0d9488]" /> GPS Confirmation
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${gpsConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {gpsConfirmed ? 'Confirmed' : 'Pending'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="font-mono text-slate-800 font-bold">30.2241° N, 97.7618° W</p>
              <p className="text-[10px] text-slate-500">Accuracy: ± 4.2 meters</p>
              <p className="text-[10px] text-emerald-600 font-medium">Within 15m of registered perimeter</p>
            </div>
          </div>

          {/* Check-in Time */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0d9488]" /> Check-in Time
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#ccfbf1] text-[#0f766e]">
                Verified
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="text-sm font-bold text-slate-900">{checkInTime}</p>
              <p className="text-[10px] text-slate-500">Estimated Duration: 3 Hours</p>
              <p className="text-[10px] text-slate-500">Scheduled: 10:00 AM - 01:00 PM</p>
            </div>
          </div>

          {/* Shelter Address */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0d9488]" /> Shelter Address
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                Pincode {s?.pincode || s?.zipCode || '78745'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-900 truncate" title={s?.shelterName}>{s?.shelterName}</p>
              <p className="text-[11px] text-slate-600">{s?.streetAddress}</p>
              <p className="text-[10px] text-slate-500">{s?.city}, {s?.state} {s?.zipCode}</p>
            </div>
          </div>

          {/* Worker Identity */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#0d9488]" /> Worker Identity
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#ccfbf1] text-[#0f766e]">
                Authorized
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 flex items-center gap-2">
              <img
                src={w?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                alt={w?.name}
                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate text-[11px]">{w?.name || 'Officer Elena Rostova'}</p>
                <p className="text-[10px] font-mono text-[#0f766e] font-bold truncate">{w?.badgeNumber || 'PT-FW-042'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation to Camera & Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#99f6e4] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Camera className="w-4 h-4 text-[#0d9488]" />
                <span>Camera Evidence Capture</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Capture 8 standardized photo categories including front, entrance, enclosures, sanitation, and safety gear.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCamera || onNext}
              className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Open Camera
            </button>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#99f6e4] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ClipboardList className="w-4 h-4 text-[#0d9488]" />
                <span>Physical Inspection Checklist</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Inspect 24 criteria across Facility, Hygiene, Animal Welfare, Veterinary Care, and Safety.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenChecklist || onNext}
              className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Open Checklist
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Next Action: Take photographic evidence across all 8 mandatory shelter categories.
          </span>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Camera Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

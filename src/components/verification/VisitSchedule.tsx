import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Building2,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  ArrowRight,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface VisitScheduleProps {
  requestId?: string;
  onNext?: () => void;
  onStartVisit?: () => void;
}

export const VisitSchedule: React.FC<VisitScheduleProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onStartVisit,
}) => {
  const { requests, rescheduleVisit, startWorkerVisit } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const w = currentReq?.assignedWorker;

  const [date, setDate] = useState<string>(currentReq?.scheduledVisitDate || '2025-05-10');
  const [time, setTime] = useState<string>(currentReq?.scheduledVisitTime || '10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState<string>(currentReq?.adminAssignmentNotes || '');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReq) return;
    rescheduleVisit(currentReq.requestId, date, time, notes);
    setIsRescheduling(false);
    setNotice(`Visit successfully rescheduled for ${date} at ${time}. Shelter & Worker dispatched!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleDispatchNotification = () => {
    setNotice(`Official Calendar Dispatch & SMS invite sent to ${w?.name || 'Inspector'} and ${s?.directorName || 'Shelter Director'}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 4 of 12: Inspection Schedule
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">4. Physical Visit Scheduling &amp; Dispatch</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Confirm inspection appointment, synchronize calendar logistics between field worker and shelter director, or initiate re-schedule.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Status</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentReq?.workerVisitStartedAt ? 'In Progress' : 'Confirmed Schedule'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {notice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Current Scheduled Card */}
        <div className="p-6 bg-gradient-to-br from-[#e0f9f5]/60 to-white rounded-2xl border border-[#99f6e4] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                  Official Scheduled Audit Appointment
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Scheduled Date</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#0d9488]" />
                    {currentReq?.scheduledVisitDate || date}
                  </span>
                </div>

                <div className="pl-4 border-l border-slate-200">
                  <span className="text-xs text-slate-500 block">Arrival Window</span>
                  <span className="text-lg sm:text-xl font-bold text-[#0f766e] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#0d9488]" />
                    {currentReq?.scheduledVisitTime || time}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#0d9488]" /> {s?.shelterName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0d9488]" /> {s?.streetAddress}, {s?.city}
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#0d9488]" /> Officer: {w?.name || 'Assigned Inspector'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsRescheduling(!isRescheduling)}
                className="px-4 py-2 bg-white border border-[#99f6e4] hover:bg-slate-50 text-[#0f766e] text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRescheduling ? 'Cancel Reschedule' : 'Reschedule Visit'}</span>
              </button>

              <button
                type="button"
                onClick={handleDispatchNotification}
                className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Calendar &amp; SMS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reschedule Form Toggle */}
        {isRescheduling && (
          <form onSubmit={handleReschedule} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#0d9488]" />
              Modify Visit Schedule
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Visit Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Window</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning Audit)</option>
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Standard Walkthrough)</option>
                  <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM (Afternoon Shift)</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Late Inspection)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Reschedule</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inclement weather or shelter director request..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRescheduling(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Next Action: Worker arrives on site and performs GPS check-in to start physical verification.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onStartVisit) onStartVisit();
                else if (onNext) onNext();
              }}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Field Visit &amp; Check-In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

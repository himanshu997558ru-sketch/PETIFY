import React, { useState } from 'react';
import {
  UserCheck,
  X,
  Calendar,
  Clock,
  Building2,
  MapPin,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { ShelterVerificationRequest } from '../../types';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface AdminAssignWorkerModalProps {
  request: ShelterVerificationRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminAssignWorkerModal: React.FC<AdminAssignWorkerModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { fieldWorkers, assignFieldWorker } = useShelterVerification();

  const [selectedWorkerId, setSelectedWorkerId] = useState(
    request.assignedWorker?.id || fieldWorkers[0]?.id || ''
  );
  const [scheduledDate, setScheduledDate] = useState(
    request.scheduledVisitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    request.scheduledVisitTime || '10:00 AM - 01:00 PM'
  );
  const [notes, setNotes] = useState(
    request.adminAssignmentNotes ||
      'Conduct rigorous physical audit of quarantine isolation ward, ventilation airflow, and animal-to-caretaker ratio.'
  );
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Expedited'>('High');

  const selectedWorker = fieldWorkers.find((w) => w.id === selectedWorkerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId || !scheduledDate) return;

    assignFieldWorker(request.requestId, selectedWorkerId, scheduledDate, scheduledTime, notes);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Admin Assigns Field Worker</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Step 3 of Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Dispatch an authorized Petify welfare auditor for on-site physical verification
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Shelter Target Summary Card */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Target Shelter</span>
                <h4 className="text-sm font-bold text-slate-900">{request.shelter.shelterName}</h4>
                <p className="text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {request.shelter.streetAddress}, {request.shelter.city}, {request.shelter.state}
                  </span>
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-700">
                Reg: {request.shelter.legalRegNumber}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Capacity: {request.shelter.animalCapacity} animals</span>
              <span>•</span>
              <span>Current Count: {request.shelter.currentAnimalCount}</span>
              <span>•</span>
              <span>Director: {request.shelter.directorName}</span>
            </div>
          </div>

          {/* Select Field Worker */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block">
              Select Qualified Welfare Inspector *
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {fieldWorkers.map((worker) => {
                const isSelected = worker.id === selectedWorkerId;
                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatarUrl}
                        alt={worker.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-xs">{worker.name}</h5>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                            {worker.badgeNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {worker.designation}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Specialty: {worker.specialty} • {worker.region}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Inspection Visit Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600 font-medium text-slate-800"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Scheduled Time Window *
              </label>
              <div className="relative">
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600 font-medium text-slate-800"
                >
                  <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="10:00 AM - 01:00 PM">Midday (10:00 AM - 01:00 PM)</option>
                  <option value="01:30 PM - 04:30 PM">Afternoon (01:30 PM - 04:30 PM)</option>
                  <option value="Full Day Audit">Full Day Comprehensive Audit</option>
                </select>
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Special Audit Instructions */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Admin Inspection Directives &amp; Checklist Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-blue-600 text-xs text-slate-800"
              placeholder="Focus areas for on-site physical inspection..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm &amp; Dispatch Field Worker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

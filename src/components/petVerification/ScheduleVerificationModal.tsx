import React, { useState } from 'react';
import { ShelterPet } from '../../types/petVerification';
import { SAMPLE_VERIFICATION_OFFICERS } from '../../data/sampleShelterPets';
import { usePetVerification } from '../../context/PetVerificationContext';
import {
  X,
  CalendarCheck,
  Building2,
  MapPin,
  Clock,
  UserCheck,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ScheduleVerificationModalProps {
  pet: ShelterPet;
  onClose: () => void;
  onScheduledSuccess?: () => void;
}

export const ScheduleVerificationModal: React.FC<ScheduleVerificationModalProps> = ({
  pet,
  onClose,
  onScheduledSuccess,
}) => {
  const { scheduleVerification } = usePetVerification();

  const [selectedOfficer, setSelectedOfficer] = useState(
    SAMPLE_VERIFICATION_OFFICERS[0].name
  );
  // Default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [visitDate, setVisitDate] = useState(defaultDateStr);
  const [visitTime, setVisitTime] = useState('10:30 AM');
  const [visitLocation, setVisitLocation] = useState(
    pet.shelterAddress || '4820 Compassion Way, Austin, TX 78745'
  );
  const [notes, setNotes] = useState(
    `Perform in-person physical verification for ${pet.name} (${pet.breed}). Verify microchip, temperament, physical health, and shelter kennel environment.`
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate) {
      setError('Please select a visit date.');
      return;
    }
    if (!visitTime.trim()) {
      setError('Please select or specify a visit time.');
      return;
    }
    if (!visitLocation.trim()) {
      setError('Please specify the physical visit location.');
      return;
    }

    const officerData = SAMPLE_VERIFICATION_OFFICERS.find((o) => o.name === selectedOfficer);

    scheduleVerification(pet.id, {
      officer: selectedOfficer,
      officerBadge: officerData?.badge || 'PT-FW-042',
      visitDate,
      visitTime,
      visitLocation,
      notes,
    });

    if (onScheduledSuccess) {
      onScheduledSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Schedule Physical Verification Visit
              </h3>
              <p className="text-[11px] text-slate-300">
                Dispatch an authorized Petify field auditor to the shelter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Target Pet Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 truncate">{pet.name}</h4>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {pet.id}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate">
                {pet.breed} · {pet.age} · {pet.gender}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Shelter: {pet.shelterName}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Field: Verification Officer */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Verification Officer <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SAMPLE_VERIFICATION_OFFICERS.map((officer) => (
                <option key={officer.badge} value={officer.name}>
                  {officer.name} ({officer.badge}) — {officer.region}
                </option>
              ))}
            </select>
          </div>

          {/* Grid: Visit Date & Visit Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Visit Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Visit Time <span className="text-rose-500">*</span>
              </label>
              <select
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          {/* Field: Visit Location */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Visit Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={visitLocation}
              onChange={(e) => setVisitLocation(e.target.value)}
              placeholder="Physical street address of shelter facility"
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Defaults to registered shelter address. Auditor must physically verify pet presence here.
            </p>
          </div>

          {/* Field: Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Notes for Verification Officer
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specific instructions or checks to perform during the inspection..."
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Info callout */}
          <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>Next Step:</strong> Clicking <em>Schedule Visit</em> updates pet status to{' '}
            <span className="font-semibold text-blue-800">Verification Scheduled</span>. The assigned officer will
            perform the on-site physical checklist.
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Schedule Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

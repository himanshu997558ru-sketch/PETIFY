import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface AppointmentRequestModalProps {
  petName: string;
  shelterName: string;
  onClose: () => void;
  onSubmit: (appointment: {
    petName: string;
    shelterName: string;
    date: string;
    timeSlot: string;
    type: string;
    notes: string;
  }) => void;
}

export const AppointmentRequestModal: React.FC<AppointmentRequestModalProps> = ({
  petName,
  shelterName,
  onClose,
  onSubmit,
}) => {
  const [date, setDate] = useState('2025-06-21');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [type, setType] = useState('In-Person Meet & Greet');
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      onSubmit({ petName, shelterName, date, timeSlot, type, notes });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Request Appointment</h3>
              <p className="text-[11px] text-slate-500">{petName} with {shelterName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {booked ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Appointment Requested!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {shelterName} has been notified. You will receive a confirmation message and calendar invite once accepted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Appointment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-purple-600 font-medium text-slate-800"
              >
                <option value="In-Person Meet & Greet">In-Person Meet & Greet (Shelter Visit)</option>
                <option value="Video Screening Call">Video Screening Call (15-min)</option>
                <option value="Phone Interview">Phone Interview with Foster Coordinator</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-purple-600 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-purple-600 font-medium text-slate-800"
                >
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notes for Shelter Coordinator (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., bringing our family dog along, questions about diet..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-purple-600 text-slate-800 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl shadow-xs transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

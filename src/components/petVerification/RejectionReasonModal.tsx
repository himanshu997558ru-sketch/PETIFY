import React, { useState } from 'react';
import { ShelterPet } from '../../types/petVerification';
import { X, AlertTriangle, ShieldAlert, Calendar, UserCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface RejectionReasonModalProps {
  pet: ShelterPet;
  mode: 'view' | 'reject';
  onClose: () => void;
  onSubmitRejection?: (reason: string) => void;
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  pet,
  mode,
  onClose,
  onSubmitRejection,
}) => {
  const [reasonInput, setReasonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput.trim()) {
      setError('Please provide a specific physical verification rejection reason.');
      return;
    }
    if (onSubmitRejection) {
      onSubmitRejection(reasonInput.trim());
    }
  };

  const existingRejection = pet.rejectionDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                {mode === 'view' ? 'Verification Rejection Reason' : 'Reject Pet Verification'}
              </h3>
              <p className="text-[11px] text-rose-800">
                {mode === 'view'
                  ? 'Official finding logged by Petify verification auditor'
                  : 'Document why this pet does not meet adoption verification standards'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pet Summary Card */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 truncate">{pet.name}</h4>
                <StatusBadge status={pet.status} size="sm" />
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {pet.breed} · {pet.age} · {pet.gender}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Shelter: {pet.shelterName}
              </p>
            </div>
          </div>

          {/* VIEW MODE */}
          {mode === 'view' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center gap-2 mb-2 text-rose-900 font-semibold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Documented Findings & Welfare Notes:</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed whitespace-pre-wrap font-medium">
                  {existingRejection?.reason || 'No specific notes recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Decided By
                  </span>
                  <span className="font-semibold text-slate-800">
                    {existingRejection?.rejectedBy || 'Verification Officer'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Decision Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {existingRejection?.rejectedAt
                      ? new Date(existingRejection.rejectedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Next Steps for Shelter:</strong> You may correct the physical discrepancies,
                ensure complete veterinary documentation, and submit a new pet profile once the animal is
                physically present and compliant.
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* REJECT ACTION MODE */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reasonInput}
                  onChange={(e) => {
                    setReasonInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Explain why this pet failed physical verification (e.g. animal was not physically present at facility, breed/age discrepancies, untreated contagious illness, missing intake custody proof)..."
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
                {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
              </div>

              {/* Quick sample reasons */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Quick standard notes:
                </span>
                <div className="space-y-1">
                  {[
                    'Pet was not physically present at shelter during scheduled audit visit.',
                    'Physical animal photo and breed do not match submitted paperwork.',
                    'Shelter could not provide valid legal intake custody documentation.',
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReasonInput(phrase)}
                      className="block text-left text-[11px] text-slate-600 hover:text-rose-700 hover:bg-rose-50/50 p-1.5 rounded transition-colors w-full border border-slate-100"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

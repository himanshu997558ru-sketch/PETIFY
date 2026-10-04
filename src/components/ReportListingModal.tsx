import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ReportListingModalProps {
  petName: string;
  petId: string;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

export const ReportListingModal: React.FC<ReportListingModalProps> = ({
  petName,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('Misleading or False Information');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitReport(reason, details);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Report Pet Listing</h3>
              <p className="text-[11px] text-slate-500">Flag listing for administrator review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for keeping our community safe. Our trust & safety team has received the report for {petName} and will inspect the listing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-snug">
                You are reporting <strong>{petName}</strong>. All reports are strictly confidential and investigated by Petify platform compliance.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-500 font-medium text-slate-800"
              >
                <option value="Misleading or False Information">Misleading or False Information</option>
                <option value="Suspicious / Unauthorized Rehoming Fee">Suspicious / Unauthorized Rehoming Fee</option>
                <option value="Animal Welfare or Health Concern">Animal Welfare or Health Concern</option>
                <option value="Unresponsive or Fraudulent Contact">Unresponsive or Fraudulent Contact</option>
                <option value="Duplicate or Expired Listing">Duplicate or Expired Listing</option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Details & Observations (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe what seemed inaccurate, suspicious, or concerning..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-rose-500 text-slate-800 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

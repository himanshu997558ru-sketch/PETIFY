import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Building2,
  FileCheck,
  Printer,
  Share2,
  Download,
  ExternalLink,
  Sparkles,
  QrCode,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';
import { VerifiedShelterBadge as IVerifiedShelterBadge } from '../../types';

interface VerifiedBadgeProps {
  requestId?: string;
  onPrev?: () => void;
  onResetFlow?: () => void;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  requestId = 'VR-2025-105',
  onPrev,
  onResetFlow,
}) => {
  const { requests, approveVerificationWithBadge } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;
  const w = currentReq?.assignedWorker;
  const b = currentReq?.badge;

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Badge parameters
  const badgeId = b?.badgeId || 'KP-VERIFIED-2026-1309';
  const issueDate = b?.issueDate || '03 October 2025';
  const validUntil = b?.validUntil || '30 June 2026';
  const verificationId = currentReq?.requestId || 'VR-2025-105';
  const sealTitle = b?.verificationSeal || 'Petify Humane Alliance Gold Accreditation Seal';

  const handleCopyBadge = () => {
    navigator.clipboard?.writeText(
      `Verified Shelter Badge: ${badgeId} | Verification ID: ${verificationId} | Valid Until: ${validUntil} | Shelter: ${s?.shelterName}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 12 of 12: Accreditation Complete
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {verificationId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">12. Verified Shelter Accreditation Badge</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Official institutional accreditation granted. Verified badge and digital cryptographic credentials issued for public adoption trustworthiness.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Accreditation Status</span>
            <span className="text-sm font-extrabold text-emerald-300 tracking-wider">
              ACCREDITED
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* Main Accreditation Badge Showcase */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#e0f9f5] via-white to-amber-50/40 p-8 rounded-3xl border-2 border-[#99f6e4] shadow-md relative overflow-hidden text-center space-y-5">
          {/* Decorative Corner Seals */}
          <div className="absolute top-3 left-4 text-xs font-mono font-bold text-[#0f766e] flex items-center gap-1 opacity-70">
            <ShieldCheck className="w-4 h-4" /> ALLIANCE CERTIFIED
          </div>
          <div className="absolute top-3 right-4 text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            GOLD TIER
          </div>

          {/* Badge Icon Emblem */}
          <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white flex items-center justify-center shadow-lg ring-8 ring-[#ccfbf1]">
            <Award className="w-12 h-12" />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
              ✓
            </span>
          </div>

          {/* Badge Titles */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>✓ VERIFIED SHELTER</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{s?.shelterName || 'Metro Paws Sanctuary'}</h3>
            <p className="text-xs text-slate-600 font-medium">
              Accredited Animal Welfare &amp; Humane Rescue Partner
            </p>
          </div>

          {/* Core Credentials Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 text-xs">
            <div className="text-left space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Badge ID</span>
              <p className="font-mono font-bold text-slate-900">{badgeId}</p>
            </div>

            <div className="text-left space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verification ID</span>
              <p className="font-mono font-bold text-[#0d9488]">{verificationId}</p>
            </div>

            <div className="text-left space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Valid Until</span>
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> {validUntil}
              </p>
            </div>
          </div>

          {/* Verification Seal Line */}
          <div className="text-xs text-slate-500 flex items-center justify-center gap-2 pt-1 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{sealTitle}</span>
          </div>

          {/* Action Buttons: View Certificate & Share */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsCertificateOpen(true)}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>View Verification Certificate</span>
            </button>

            <button
              type="button"
              onClick={handleCopyBadge}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Badge Data!' : 'Copy Badge ID'}</span>
            </button>
          </div>
        </div>

        {/* Accreditation Benefits Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0d9488]" /> Verified Public Profile
            </span>
            <p className="text-[11px] text-slate-500">
              Your listings display the official green verified badge across all adopter search directories.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#0d9488]" /> Priority Adopter Match
            </span>
            <p className="text-[11px] text-slate-500">
              Accredited sanctuaries receive 40% higher adoption inquiries and expedited application processing.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0d9488]" /> Annual Re-Certification
            </span>
            <p className="text-[11px] text-slate-500">
              Valid through <strong>{validUntil}</strong>. Automatic renewal notification dispatched 60 days in advance.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Back: Re-Inspection
            </button>
          )}

          {onResetFlow && (
            <button
              type="button"
              onClick={onResetFlow}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <span>Return to Pipeline Overview</span>
            </button>
          )}
        </div>
      </div>

      {/* Official High-Resolution Verification Certificate Modal */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 border-4 border-[#0d9488] shadow-2xl relative space-y-6 my-8">
            {/* Certificate Header Watermark */}
            <div className="text-center space-y-2 border-b-2 border-slate-100 pb-6 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white flex items-center justify-center shadow-md ring-4 ring-[#ccfbf1] mb-2">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0d9488]">
                Petify Humane Sanctuary &amp; Welfare Alliance
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Certificate of Humane Shelter Accreditation
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                This official legal accreditation confirms that the named institution has successfully undergone comprehensive on-site physical inspection and complies with all Alliance standards for animal welfare, sanitation, and safety.
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                This is proudly presented to:
              </span>
              <h3 className="text-3xl font-serif font-bold text-slate-900 underline decoration-[#0d9488] decoration-2 underline-offset-8">
                {s?.shelterName || 'Metro Paws Sanctuary'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Located at {s?.streetAddress}, {s?.city}, {s?.state} {s?.zipCode} • Legal Registration #{s?.legalRegNumber}
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto grid grid-cols-2 gap-3 text-xs text-left">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Badge Identifier</span>
                  <span className="font-mono font-bold text-slate-900">{badgeId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verification ID</span>
                  <span className="font-mono font-bold text-[#0d9488]">{verificationId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Issue Date</span>
                  <span className="font-bold text-slate-800">{issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valid Until</span>
                  <span className="font-bold text-emerald-700">{validUntil}</span>
                </div>
              </div>
            </div>

            {/* Signature & Seal Row */}
            <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="space-y-1">
                <span className="font-serif italic text-base text-slate-900 border-b border-slate-400 pb-0.5 block">
                  {w?.name || 'Officer Elena Rostova'}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Certified Field Welfare Inspector ({w?.badgeNumber || 'PT-FW-042'})
                </span>
              </div>

              {/* Gold Seal Graphic */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500 bg-amber-50 text-amber-800 flex flex-col items-center justify-center p-2 text-center shadow-xs">
                <Award className="w-6 h-6 text-amber-600 mb-0.5" />
                <span className="text-[8px] font-bold uppercase leading-tight">OFFICIAL GOLD SEAL</span>
              </div>

              <div className="space-y-1">
                <span className="font-serif italic text-base text-slate-900 border-b border-slate-400 pb-0.5 block">
                  Himanshu (Alliance Super Admin)
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Petify Accreditation Board Director
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSimulatePrint}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCertificateOpen(false)}
                className="px-6 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

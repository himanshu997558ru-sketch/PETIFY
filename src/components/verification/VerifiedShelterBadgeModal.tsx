import React, { useState } from 'react';
import {
  Award,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Building2,
} from 'lucide-react';
import { VerifiedShelterBadge } from '../../types';
import { KIN_PAWS_LOGO } from '../../data/mockData';

interface VerifiedShelterBadgeModalProps {
  badge: VerifiedShelterBadge;
  onClose: () => void;
}

export const VerifiedShelterBadgeModal: React.FC<VerifiedShelterBadgeModalProps> = ({
  badge,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `<a href="https://petify.org/verify/${badge.accreditationCode}" target="_blank"><img src="https://petify.org/badges/verified-shelter.svg" alt="Petify Verified Shelter" /></a>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#1c382b] via-[#24533e] to-[#142c21] p-6 text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 p-2 flex items-center justify-center backdrop-blur-xs">
                <Award className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Verified Shelter Badge
                  </h3>
                  <span className="p-0.5 rounded-full bg-emerald-400/30 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 font-medium">
                  Petify Sanctuary Alliance • Official Accreditation Credential
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 sm:p-8 space-y-6 text-xs bg-[#fdfcf9]">
          {/* Certificate Inner Border Frame */}
          <div className="border-4 border-double border-amber-600/30 rounded-3xl p-6 sm:p-8 bg-white relative shadow-sm space-y-6 text-center">
            {/* Top Seal & Brand */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#fbf5ee] border border-amber-200 p-2 shadow-xs">
                <img
                  src={KIN_PAWS_LOGO}
                  alt="Petify Alliance"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9c3e1f]">
                PETIFY WELFARE ALLIANCE
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-900">
                Certificate of Physical Accreditation
              </h2>
              <p className="text-slate-500 text-[11px] max-w-md mx-auto">
                This official seal confirms on-site physical inspection, full legal compliance, and adherence to highest humane welfare standards.
              </p>
            </div>

            {/* Awarded To */}
            <div className="py-2 border-y border-amber-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Awarded To</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                {badge.shelterName}
              </h3>
              <p className="text-slate-600 text-xs font-medium">
                Accredited Sanctuary &amp; Ethical Rescue Partner
              </p>
            </div>

            {/* Badge Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left py-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">
                  Accreditation Code
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs truncate block mt-0.5">
                  {badge.accreditationCode}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">
                  Audit Rating
                </span>
                <span className="font-bold text-emerald-700 text-xs truncate block mt-0.5">
                  {badge.facilityRating}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">
                  Date of Issue
                </span>
                <span className="font-bold text-slate-900 text-xs truncate block mt-0.5">
                  {badge.issueDate}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">
                  Valid Through
                </span>
                <span className="font-bold text-slate-900 text-xs truncate block mt-0.5">
                  {badge.validUntil}
                </span>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Inspected &amp; Certified By:</span>
                <p className="font-serif italic font-bold text-slate-800 text-sm">
                  {badge.verificationOfficer}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Petify Certified Welfare Inspector
                </span>
              </div>

              {/* Gold Medal Emblem */}
              <div className="flex items-center gap-3 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-amber-950" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-950 block">
                    VERIFIED SHELTER
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 block uppercase">
                    ALLIANCE GOLD SEAL
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-right sm:text-right">
                <span className="text-[10px] text-slate-400 block">Approved by Admin:</span>
                <p className="font-serif italic font-bold text-slate-800 text-sm">
                  {badge.approvedByAdmin}
                </p>
                <span className="text-[10px] text-slate-500">Alliance Accreditation Board</span>
              </div>
            </div>
          </div>

          {/* Action Row: Download & Copy Embed */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Badge HTML Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Badge HTML Embed</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all text-xs"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Certificate Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Official Certificate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

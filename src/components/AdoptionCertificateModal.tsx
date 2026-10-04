import React from 'react';
import { X, Award, Printer, Download, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

export interface CertificateData {
  certId: string;
  petName: string;
  petType: string;
  breed: string;
  microchipId: string;
  adopterName: string;
  shelterName: string;
  adoptionDate: string;
  imageUrl?: string;
  rabiesBatch?: string;
  legalNote?: string;
}

interface AdoptionCertificateModalProps {
  data: CertificateData;
  onClose: () => void;
  viewerRole?: 'admin' | 'shelter' | 'adopter';
}

export const AdoptionCertificateModal: React.FC<AdoptionCertificateModalProps> = ({
  data,
  onClose,
  viewerRole = 'adopter',
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-[#d4af37]/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Official Registry Document • {data.certId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1.5 px-2.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-[#fdfbf7] relative text-center space-y-6">
          {/* Subtle Guilloche / Watermark Corner Ornaments */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none rounded-tl-xl" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none rounded-tr-xl" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none rounded-bl-xl" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none rounded-br-xl" />

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-white shadow-md mx-auto mb-2 border-2 border-white">
              <Award className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Certificate of Adoption
            </h2>
            <p className="text-xs font-semibold tracking-widest text-[#9c782b] uppercase">
              Petify Animal Welfare Registry • Certified Legal Placement
            </p>
          </div>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />

          {/* Declaration */}
          <div className="space-y-3 max-w-lg mx-auto text-sm text-slate-700 leading-relaxed font-serif">
            <p>This is to officially certify that</p>
            <div className="py-1">
              <span className="text-2xl font-bold text-slate-950 underline decoration-amber-400 decoration-2 underline-offset-4">
                {data.petName}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              a loving <strong>{data.breed} ({data.petType})</strong>, has been officially adopted and welcomed into forever companionship by
            </p>
            <div className="py-1">
              <span className="text-xl font-bold text-slate-900 font-sans">
                {data.adopterName}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              facilitated with dedication by <strong>{data.shelterName}</strong> on <strong>{data.adoptionDate}</strong>.
            </p>
          </div>

          {/* Verification Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto text-left font-sans">
            <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Certificate ID</span>
              <span className="text-xs font-mono font-bold text-slate-900">{data.certId}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Microchip ID</span>
              <span className="text-xs font-mono font-bold text-slate-900">{data.microchipId}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Health Status</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Fully Vetted
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Registry Status</span>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Legally Verified
              </span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-lg mx-auto font-sans">
            <div className="text-center sm:text-left">
              <div className="w-36 border-b border-slate-400 pb-1 mb-1 font-serif italic text-sm text-slate-800">
                Elena Rostova
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Shelter Medical Director</p>
              <p className="text-[10px] text-slate-400">{data.shelterName}</p>
            </div>

            {/* Gold Ribbon Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 border-2 border-amber-300 shadow-md flex items-center justify-center text-white text-[9px] font-black uppercase text-center leading-tight p-1">
                Official
                <br />
                Petify
                <br />
                Seal
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-36 border-b border-slate-400 pb-1 mb-1 font-serif italic text-sm text-slate-800">
                M. K. Sharma
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Registrar of Adoptions</p>
              <p className="text-[10px] text-slate-400">Petify Central Registry</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Role: <strong className="capitalize text-slate-800">{viewerRole}</strong> • Official certified copy
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

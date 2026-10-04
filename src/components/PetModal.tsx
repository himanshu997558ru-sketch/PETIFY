import React, { useState } from 'react';
import {
  X,
  Heart,
  MapPin,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  ShieldAlert,
  Activity,
  Award,
} from 'lucide-react';
import { Pet } from '../types';
import { CAT_BREEDS_DIRECTORY } from '../data/catBreedsData';

interface PetModalProps {
  pet: Pet | null;
  onClose: () => void;
  onApply: (pet: Pet) => void;
  onToggleSave?: (petId: string) => void;
  isSaved?: boolean;
  onRequestAppointment?: (pet: Pet) => void;
  onReportListing?: (pet: Pet) => void;
}

export const PetModal: React.FC<PetModalProps> = ({
  pet,
  onClose,
  onApply,
  onToggleSave,
  isSaved = false,
  onRequestAppointment,
  onReportListing,
}) => {
  const [applied, setApplied] = useState(false);

  if (!pet) return null;

  const handleApplyClick = () => {
    setApplied(true);
    setTimeout(() => {
      onApply(pet);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2421]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e8e2da] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Image with Floating Controls */}
        <div className="relative h-64 sm:h-72 w-full bg-[#f3ede5]">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1d1b17] flex items-center justify-center backdrop-blur-xs transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Actions on Top Left */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(pet.id)}
                title="Save to Favorites"
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95 shadow-sm"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isSaved ? 'text-[#9c3e1f] fill-[#9c3e1f]' : 'text-[#8a726b] hover:text-[#9c3e1f]'
                  }`}
                />
              </button>
            )}

            {onReportListing && (
              <button
                onClick={() => onReportListing(pet)}
                title="Report Listing"
                className="px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-rose-600/90 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            )}
          </div>

          {/* Overlay Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap gap-2 mb-1.5">
              {pet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-bold">{pet.name}</h3>
              <span className="text-sm font-medium text-white/90">{pet.age}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#ffb59e]" />
              {pet.breed} • {pet.distance}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1d1b17]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#376851] mb-1">
              Companion Profile &amp; Personality
            </h4>
            <p className="text-xs sm:text-sm text-[#56423c] leading-relaxed">
              {pet.description}
            </p>
          </div>

          {/* Pet Health Info (Feature 14) */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Verified Pet Health &amp; Veterinary Records</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                Audit Clearance: Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Vaccinations</span>
                <span className="font-bold text-slate-800 text-[11px]">Core &amp; Rabies Current</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Microchip ID</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">98514-00291</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Spay / Neuter</span>
                <span className="font-bold text-emerald-700 text-[11px]">Completed &amp; Healed</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Deworming / Flea</span>
                <span className="font-bold text-slate-800 text-[11px]">Up to Date</span>
              </div>
            </div>
          </div>

          {/* Feline Breed Encyclopedia Match */}
          {(() => {
            const matchedCat = CAT_BREEDS_DIRECTORY.find((c) =>
              pet.breed.toLowerCase().includes(c.breed.toLowerCase())
            );
            if (!matchedCat && pet.species !== 'Cat') return null;
            const catInfo = matchedCat || CAT_BREEDS_DIRECTORY[0];
            return (
              <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-purple-950">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Cat Breed Heritage: #{catInfo.no} {catInfo.breed}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-800">
                    Avg Lifespan: {catInfo.lifespan}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-purple-900">
                  <p><strong>Origin / Found:</strong> {catInfo.origin}</p>
                  <p><strong>Coat:</strong> {catInfo.coatType}</p>
                  <p><strong>Weight Range:</strong> {catInfo.weightRange}</p>
                  <p><strong>Activity:</strong> {catInfo.activityLevel}</p>
                </div>
                <p className="text-[11px] text-purple-800/90 italic pt-1 border-t border-purple-200/60">
                  Care Guidance: {catInfo.careTips}
                </p>
              </div>
            );
          })()}

          {/* Traits and Vetting Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#f9f3eb] rounded-xl border border-[#ddc0b8]/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#376851] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Medical Clearance Badge</span>
              </div>
              <p className="text-xs text-[#56423c]">
                {pet.medicalBadge}. Microchipped, up-to-date on preventatives, and verified by partner veterinary hospice.
              </p>
            </div>

            <div className="p-3 bg-[#f9f3eb] rounded-xl border border-[#ddc0b8]/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9c3e1f] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Behavioral Assessment</span>
              </div>
              <p className="text-xs text-[#56423c]">
                Passes companion compatibility check. Excellent leash manners and friendly disposition with foster family.
              </p>
            </div>
          </div>

          {/* Foster & Match Notes */}
          <div className="bg-[#f3ede5] p-4 rounded-xl border border-[#e8e2da]">
            <p className="text-xs font-semibold text-[#1d1b17] mb-1">
              Shelter Partner Note: Austin Sanctuary Network
            </p>
            <p className="text-xs text-[#56423c] leading-relaxed">
              &quot;{pet.name} is ready for adoption with approved applicants who have safe living spaces and moderate activity routines.&quot;
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#e8e2da] bg-[#f9f3eb] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#56423c] hover:text-[#1d1b17] hover:bg-[#e8e2da] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Appointment Request (Feature 13) */}
            {onRequestAppointment && (
              <button
                onClick={() => onRequestAppointment(pet)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Request Appointment</span>
              </button>
            )}

            {/* Adoption Application (Feature 8) */}
            <button
              onClick={handleApplyClick}
              disabled={applied}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#9c3e1f] hover:bg-[#823217] transition-all flex items-center gap-2 shadow-xs"
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Progressing!</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Apply to Adopt {pet.name}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import {
  Camera,
  RotateCcw,
  Upload,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  Eye,
  Maximize2,
  Trash2,
  Tag,
} from 'lucide-react';
import { useShelterVerification, INITIAL_EVIDENCE_PHOTOS } from '../../context/ShelterVerificationContext';
import { CameraPhotoCategory, InspectionEvidencePhoto } from '../../types';

interface CameraEvidenceProps {
  requestId?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

const PHOTO_CATEGORIES: CameraPhotoCategory[] = [
  'Shelter Front',
  'Entrance',
  'Animal Enclosure',
  'Food / Water Area',
  'Sanitation',
  'Veterinary / Medical Area',
  'Safety Equipment',
  'Additional Photos',
];

export const CameraEvidence: React.FC<CameraEvidenceProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onPrev,
}) => {
  const { requests, updatePhotoEvidence } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const r = currentReq?.report;

  const [photos, setPhotos] = useState<InspectionEvidencePhoto[]>(
    r?.evidencePhotos && r.evidencePhotos.length > 0 ? r.evidencePhotos : INITIAL_EVIDENCE_PHOTOS
  );

  const [activeCategory, setActiveCategory] = useState<CameraPhotoCategory>('Shelter Front');
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<InspectionEvidencePhoto | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Active photo for the current selected category
  const currentCategoryPhoto = photos.find((p) => p.category === activeCategory);

  const handleSimulateTakePhoto = (cat: CameraPhotoCategory) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sampleUrls: Record<CameraPhotoCategory, string> = {
      'Shelter Front': 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
      'Entrance': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'Animal Enclosure': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
      'Food / Water Area': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
      'Sanitation': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
      'Veterinary / Medical Area': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'Safety Equipment': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
      'Additional Photos': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    };

    const newPhoto: InspectionEvidencePhoto = {
      id: `ev-${Date.now()}`,
      category: cat,
      photoUrl: sampleUrls[cat],
      captureTime: timeNow,
      verificationId: currentReq?.requestId || requestId,
      caption: `Live camera capture for ${cat} - Verified on-site at ${timeNow}`,
    };

    const updated = photos.filter((p) => p.category !== cat);
    const newPhotos = [...updated, newPhoto];
    setPhotos(newPhotos);
    updatePhotoEvidence(currentReq.requestId, newPhotos);

    setToast(`Captured new photo for: ${cat}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRetake = (cat: CameraPhotoCategory) => {
    handleSimulateTakePhoto(cat);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>, cat: CameraPhotoCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const newPhoto: InspectionEvidencePhoto = {
        id: `ev-${Date.now()}`,
        category: cat,
        photoUrl: url,
        captureTime: timeNow,
        verificationId: currentReq?.requestId || requestId,
        caption: `Custom photo uploaded: ${file.name}`,
      };

      const updated = photos.filter((p) => p.category !== cat);
      const newPhotos = [...updated, newPhoto];
      setPhotos(newPhotos);
      updatePhotoEvidence(currentReq.requestId, newPhotos);
      setToast(`Uploaded photo for ${cat}: ${file.name}`);
      setTimeout(() => setToast(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const completedCount = PHOTO_CATEGORIES.filter((c) => photos.some((p) => p.category === c)).length;

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 6 of 12: Photographic Audit
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">6. Field Worker Camera Evidence</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Inspectors must photograph all 8 standardized zones. Every image embeds capture timestamp, universal Verification ID, and zone classification.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Evidence Progress</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {completedCount} / {PHOTO_CATEGORIES.length} Categories
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {toast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
          {PHOTO_CATEGORIES.map((cat) => {
            const hasPhoto = photos.some((p) => p.category === cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#0d9488] text-white shadow-xs'
                    : hasPhoto
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {hasPhoto ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Camera Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Viewport Card */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 text-white space-y-3 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-teal-400">
                <Camera className="w-4 h-4" /> Live Inspector Lens: {activeCategory}
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 text-teal-200">
                ID: {currentReq?.requestId || requestId}
              </span>
            </div>

            {/* Photo Preview or Camera View */}
            <div className="h-72 sm:h-80 rounded-xl bg-slate-800 relative overflow-hidden flex items-center justify-center border border-slate-700">
              {currentCategoryPhoto ? (
                <>
                  <img
                    src={currentCategoryPhoto.photoUrl}
                    alt={activeCategory}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay HUD */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-black/60 text-emerald-400 border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED EVIDENCE
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedPhotoForModal(currentCategoryPhoto)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs pointer-events-auto"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-white bg-[#0d9488]/80 px-2 py-0.5 rounded">
                          Category: {currentCategoryPhoto.category}
                        </span>
                        <span className="font-mono text-slate-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-[#0d9488]" /> Captured: {currentCategoryPhoto.captureTime}
                        </span>
                        <span className="font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                          Ref: {currentCategoryPhoto.verificationId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{currentCategoryPhoto.caption}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-700 text-teal-400 flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-300">
                    No photo captured yet for <strong>{activeCategory}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Press Take Photo or Upload from device to log this inspection area.
                  </p>
                </div>
              )}
            </div>

            {/* Camera Controls: 4 Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateTakePhoto(activeCategory)}
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRetake(activeCategory)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>

                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCustomUpload(e, activeCategory)}
                  />
                </label>
              </div>

              {/* Next Category shortcut */}
              <button
                type="button"
                onClick={() => {
                  const currentIndex = PHOTO_CATEGORIES.indexOf(activeCategory);
                  const nextIndex = (currentIndex + 1) % PHOTO_CATEGORIES.length;
                  setActiveCategory(PHOTO_CATEGORIES[nextIndex]);
                }}
                className="text-xs text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1"
              >
                <span>Next Category</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* All 8 Categories Snapshot Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>8 Inspection Zones</span>
              <span className="text-[10px] text-[#0f766e] font-mono">{completedCount}/8 Captured</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {PHOTO_CATEGORIES.map((cat) => {
                const photo = photos.find((p) => p.category === cat);
                const isSelected = activeCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#e0f9f5] border-[#0d9488] ring-1 ring-[#0d9488]'
                        : photo
                        ? 'bg-white border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="h-16 rounded-lg bg-slate-100 overflow-hidden relative mb-1.5">
                      {photo ? (
                        <img src={photo.photoUrl} alt={cat} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Camera className="w-5 h-5" />
                        </div>
                      )}
                      {photo && (
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[8px] font-mono bg-black/70 text-emerald-400">
                          {photo.captureTime}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-800 truncate" title={cat}>{cat}</span>
                      {photo ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Back: Field Visit
            </button>
          ) : <div />}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Inspection Checklist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhotoForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4 space-y-3 text-white">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
              <span className="font-bold text-teal-400">Category: {selectedPhotoForModal.category}</span>
              <span className="font-mono text-slate-400">Ref: {selectedPhotoForModal.verificationId} • {selectedPhotoForModal.captureTime}</span>
            </div>
            <div className="h-96 rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img src={selectedPhotoForModal.photoUrl} alt={selectedPhotoForModal.category} className="max-h-full object-contain" />
            </div>
            <p className="text-xs text-slate-300">{selectedPhotoForModal.caption}</p>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedPhotoForModal(null)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

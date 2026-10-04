import React, { useState } from 'react';
import {
  MapPin,
  ClipboardCheck,
  UploadCloud,
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  InspectionChecklist,
  InspectionPhoto,
  ShelterVerificationRequest,
  VerificationReport,
} from '../../types';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface FieldWorkerInspectionModalProps {
  request: ShelterVerificationRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FieldWorkerInspectionModal: React.FC<FieldWorkerInspectionModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { startWorkerVisit, uploadVerificationReport } = useShelterVerification();

  // Workflow sub-steps inside inspector tool:
  // 1: Check-in / Visit Facility
  // 2: Physical Verification Checklist
  // 3: Upload Photos & Finalize Inspection Report
  const [subStep, setSubStep] = useState<'checkin' | 'physical' | 'report'>(
    request.workerVisitStartedAt ? 'physical' : 'checkin'
  );

  // Inspector check-in details
  const [checkInTime, setCheckInTime] = useState<string>(
    request.workerVisitStartedAt
      ? new Date(request.workerVisitStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [gpsVerified, setGpsVerified] = useState(true);

  // Physical Verification Checklist State
  const [checklist, setChecklist] = useState<InspectionChecklist>({
    enclosureSpace: true,
    climateVentilation: true,
    cleanWaterFood: true,
    quarantineIsolation: true,
    vetCareRecords: true,
    sanitationPestControl: true,
    staffRatioSafety: true,
    humaneTreatment: true,
  });

  const [notesEnclosures, setNotesEnclosures] = useState(
    'Individual pens exceed minimum area by 20%. Raised resting beds and clean bedding observed in all active enclosures.'
  );
  const [notesSanitation, setNotesSanitation] = useState(
    'Hospital-grade disinfectant rotated twice daily. High-pressure washdowns and zero foul odor detected.'
  );
  const [notesMedical, setNotesMedical] = useState(
    'Separated physical containment isolation ward active with negative pressure air flow. Pharmacy locked with prescription logs.'
  );
  const [notesWelfare, setNotesWelfare] = useState(
    'Quiet environment, enrichment puzzles in crates, outdoor agility yard utilized in rotational groups.'
  );

  // Report details
  const [overallScore, setOverallScore] = useState<number>(96);
  const [inspectorObservations, setInspectorObservations] = useState(
    'The facility strictly complies with Petify Sanctuary Standards. Staff exhibits high compassionate care and veterinary logs are exceptionally organized.'
  );
  const [recommendation, setRecommendation] = useState<
    'Recommend Verification' | 'Requires Rectification' | 'Recommend Rejection'
  >('Recommend Verification');
  const [inspectorSignature, setInspectorSignature] = useState(
    `${request.assignedWorker?.name || 'Officer Elena Rostova'} (${request.assignedWorker?.badgeNumber || 'PT-FW-042'})`
  );

  // Photos State
  const [photos, setPhotos] = useState<InspectionPhoto[]>([
    {
      id: 'photo-1',
      caption: 'Main indoor climate-controlled kennel row with elevated resting cots',
      category: 'kennels',
      imageUrl:
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=80',
      timestamp: 'Today, 10:15 AM',
    },
    {
      id: 'photo-2',
      caption: 'Dedicated veterinary isolation and medical quarantine recovery zone',
      category: 'medical',
      imageUrl:
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      timestamp: 'Today, 10:45 AM',
    },
    {
      id: 'photo-3',
      caption: 'Double-fenced grassy outdoor socialization and play yard',
      category: 'play_area',
      imageUrl:
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80',
      timestamp: 'Today, 11:20 AM',
    },
    {
      id: 'photo-4',
      caption: 'Clean stainless feeding stations and continuous freshwater distribution',
      category: 'nutrition',
      imageUrl:
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80',
      timestamp: 'Today, 11:40 AM',
    },
  ]);

  const toggleChecklistItem = (key: keyof InspectionChecklist) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const trueCount = Object.values(updated).filter(Boolean).length;
      const calculatedScore = Math.round((trueCount / 8) * 98);
      setOverallScore(calculatedScore);
      if (calculatedScore >= 85) {
        setRecommendation('Recommend Verification');
      } else if (calculatedScore >= 70) {
        setRecommendation('Requires Rectification');
      } else {
        setRecommendation('Recommend Rejection');
      }
      return updated;
    });
  };

  const handleConfirmVisitArrival = () => {
    startWorkerVisit(request.requestId);
    setSubStep('physical');
  };

  const handleSubmitFinalReport = (e: React.FormEvent) => {
    e.preventDefault();

    const worker = request.assignedWorker;
    uploadVerificationReport(request.requestId, {
      workerId: worker?.id || 'fw-1',
      workerName: worker?.name || 'Officer Elena Rostova',
      workerBadge: worker?.badgeNumber || 'KP-FW-042',
      visitDate: new Date().toISOString().split('T')[0],
      visitStartTime: checkInTime,
      visitEndTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overallScore,
      overallGrade:
        overallScore >= 90
          ? 'Grade A (Exemplary)'
          : overallScore >= 80
          ? 'Grade B (Compliant)'
          : overallScore >= 65
          ? 'Grade C (Conditional)'
          : 'Fail (Non-Compliant)',
      checklist,
      checklistNotes: {
        enclosures: notesEnclosures,
        sanitation: notesSanitation,
        medical: notesMedical,
        welfare: notesWelfare,
      },
      photos,
      inspectorObservations,
      inspectorRecommendation: recommendation,
      workerSignature: inspectorSignature,
    });

    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#fbfdfc] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Field Worker Physical Verification &amp; Report
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Steps 4, 5 &amp; 6 of Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Auditing <strong className="text-slate-700">{request.shelter.shelterName}</strong> • Inspector:{' '}
                {request.assignedWorker?.name || 'Officer Elena Rostova'}
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

        {/* Sub-step Tab Switcher */}
        <div className="px-6 pt-3 pb-0 bg-slate-50/70 border-b border-slate-200/80 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSubStep('checkin')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              subStep === 'checkin'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Worker Visits Shelter (Check-In)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubStep('physical')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              subStep === 'physical'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>2. Physical Verification Checklist</span>
          </button>
          <button
            type="button"
            onClick={() => setSubStep('report')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              subStep === 'report'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>3. Upload Verification Report</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6">
          {/* ================= STAGE 1: WORKER VISITS SHELTER ================= */}
          {subStep === 'checkin' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>On-Site Facility Check-In Protocol</span>
                </div>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  Field workers must verify physical arrival at the registered shelter facility address
                  prior to commencing inspection. Timestamp and location coordinates are cryptographically logged.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Facility Name</span>
                    <h4 className="text-sm font-bold text-slate-900">{request.shelter.shelterName}</h4>
                    <p className="text-slate-600 mt-0.5">{request.shelter.streetAddress}</p>
                    <p className="text-slate-500">
                      {request.shelter.city}, {request.shelter.state} {request.shelter.zipCode}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Inspector</span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {request.assignedWorker?.name || 'Officer Elena Rostova'}
                    </h4>
                    <p className="text-slate-600 font-mono text-[11px]">
                      Badge: {request.assignedWorker?.badgeNumber || 'KP-FW-042'}
                    </p>
                    <p className="text-slate-500">{request.assignedWorker?.designation}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-semibold text-slate-700">
                      GPS Geo-Fence Match: 30.2672° N, 97.7431° W (Austin, TX)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Arrival Time: {checkInTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500 text-[11px]">
                  Status: {request.workerVisitStartedAt ? 'Checked In' : 'Awaiting Arrival Check-In'}
                </span>
                <button
                  type="button"
                  onClick={handleConfirmVisitArrival}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Worker Arrival &amp; Start Physical Verification →</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STAGE 2: PHYSICAL VERIFICATION ================= */}
          {subStep === 'physical' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Physical Verification Checklist &amp; Standards
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Evaluate each on-site humane standard. Toggles dynamically compute preliminary audit score.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Score</span>
                  <span
                    className={`text-xl font-black ${
                      overallScore >= 85
                        ? 'text-emerald-600'
                        : overallScore >= 70
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {overallScore} / 100
                  </span>
                </div>
              </div>

              {/* 8-Point Physical Inspection Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'enclosureSpace',
                    title: '1. Adequate Enclosure & Living Space',
                    desc: 'Spacious kennel dimensions, clean resting cots, no inhumane crate stacking.',
                  },
                  {
                    key: 'climateVentilation',
                    title: '2. Climate Control & Ventilation',
                    desc: 'HVAC maintains 68°F–76°F, fresh continuous airflow, zero ammonia accumulation.',
                  },
                  {
                    key: 'cleanWaterFood',
                    title: '3. Clean Water & Nutrition Storage',
                    desc: 'Automated/continuous potable water bowls, sealed vermin-proof kibble bins.',
                  },
                  {
                    key: 'quarantineIsolation',
                    title: '4. Dedicated Medical Quarantine Ward',
                    desc: 'Physical isolation for incoming/sick animals with barrier infection protocols.',
                  },
                  {
                    key: 'vetCareRecords',
                    title: '5. Veterinary Records & Rabies Logs',
                    desc: 'Complete medical charts, up-to-date rabies batches, microchip registrations.',
                  },
                  {
                    key: 'sanitationPestControl',
                    title: '6. Sanitation & Waste Management',
                    desc: 'Daily sanitization schedule, hospital disinfectants, professional pest control.',
                  },
                  {
                    key: 'staffRatioSafety',
                    title: '7. Staffing & Perimeter Security',
                    desc: 'Adequate caretakers per animal, double-gate escape security, fire extinguishers.',
                  },
                  {
                    key: 'humaneTreatment',
                    title: '8. Humane Handling & Enrichment',
                    desc: 'Positive reinforcement, daily outdoor exercise, chew toys, calm behaviors.',
                  },
                ].map((item) => {
                  const passed = checklist[item.key as keyof InspectionChecklist];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key as keyof InspectionChecklist)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        passed
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50/60 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          {passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span>{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {passed ? 'Passed' : 'Deficient'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Inspector Field Observation Notes */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">
                  Inspector Observation Field Notes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Enclosure &amp; Living Space Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notesEnclosures}
                      onChange={(e) => setNotesEnclosures(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Sanitation &amp; Air Quality Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notesSanitation}
                      onChange={(e) => setNotesSanitation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Medical &amp; Quarantine Isolation Notes
                    </label>
                    <textarea
                      rows={2}
                      value={notesMedical}
                      onChange={(e) => setNotesMedical(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Animal Well-being &amp; Staff Ratio
                    </label>
                    <textarea
                      rows={2}
                      value={notesWelfare}
                      onChange={(e) => setNotesWelfare(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubStep('checkin')}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  ← Back to Check-in
                </button>
                <button
                  type="button"
                  onClick={() => setSubStep('report')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <span>Proceed to Upload Report &amp; Evidence Photos →</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: WORKER UPLOADS VERIFICATION REPORT ================= */}
          {subStep === 'report' && (
            <form onSubmit={handleSubmitFinalReport} className="space-y-6">
              {/* Photo Evidence Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Physical Inspection Photo Evidence (4 Mandatory Areas)
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Geo-tagged high-resolution captures of kennels, isolation, play yard, and nutrition.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                    {photos.length} Photos Captured
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.caption}
                        className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                          {p.category}
                        </span>
                        <p className="text-[10px] leading-tight line-clamp-2">{p.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Findings & Recommendation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Final Physical Audit Score (0 - 100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={overallScore}
                      onChange={(e) => setOverallScore(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 font-bold text-slate-900 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      Inspector Final Recommendation *
                    </label>
                    <select
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 font-semibold text-slate-900"
                    >
                      <option value="Recommend Verification">
                        ✅ Recommend Verification (Accreditation Approved)
                      </option>
                      <option value="Requires Rectification">
                        ⚠️ Requires Rectification (Conditional Re-Audit Needed)
                      </option>
                      <option value="Recommend Rejection">
                        ❌ Recommend Rejection (Critical Deficiencies Found)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Comprehensive Inspector Observations &amp; Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inspectorObservations}
                    onChange={(e) => setInspectorObservations(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-600 text-xs text-slate-800"
                    placeholder="Enter detailed assessment for Admin Board review..."
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Inspector Digital Signature &amp; Officer Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={inspectorSignature}
                    onChange={(e) => setInspectorSignature(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 font-mono text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubStep('physical')}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  ← Back to Checklist
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Official Verification Report to Admin Queue</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

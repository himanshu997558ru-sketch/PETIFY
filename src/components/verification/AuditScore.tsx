import React from 'react';
import {
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building,
  Sparkles,
  Heart,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useShelterVerification, calculateScoresFromChecklist } from '../../context/ShelterVerificationContext';
import { InspectionAuditScores } from '../../types';

interface AuditScoreProps {
  requestId?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AuditScore: React.FC<AuditScoreProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onPrev,
}) => {
  const { requests } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const r = currentReq?.report;

  // Derive audit scores from checklist if available or default to target 58/100
  const scores: InspectionAuditScores =
    r?.auditScores ||
    (r?.detailedChecklist
      ? calculateScoresFromChecklist(r.detailedChecklist)
      : {
          facility: { earned: 15, total: 20, percentage: 75 },
          hygiene: { earned: 14, total: 20, percentage: 70 },
          animalWelfare: { earned: 16, total: 20, percentage: 80 },
          veterinaryCare: { earned: 7, total: 20, percentage: 35 },
          safety: { earned: 6, total: 20, percentage: 30 },
          totalScore: 58,
          maxScore: 100,
          grade: 'Fail (Non-Compliant - Requires Re-Inspection)',
        });

  const categoryCards = [
    {
      id: 'facility',
      title: 'Facility',
      score: scores.facility,
      icon: Building,
      color: 'text-sky-700',
      barColor: scores.facility.percentage >= 75 ? 'bg-sky-500' : 'bg-amber-500',
      description: 'Shelter structure, enclosures, space capacity, ventilation, and lighting.',
    },
    {
      id: 'hygiene',
      title: 'Hygiene',
      score: scores.hygiene,
      icon: Sparkles,
      color: 'text-teal-700',
      barColor: scores.hygiene.percentage >= 75 ? 'bg-[#0d9488]' : 'bg-amber-500',
      description: 'Surroundings, waste disposal, potable hydration, food storage, sanitization.',
    },
    {
      id: 'welfare',
      title: 'Animal Welfare',
      score: scores.animalWelfare,
      icon: Heart,
      color: 'text-emerald-700',
      barColor: scores.animalWelfare.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500',
      description: 'Physical demeanor, feeding schedules, fresh water access, isolation, emergency triage.',
    },
    {
      id: 'veterinary',
      title: 'Veterinary Care',
      score: scores.veterinaryCare,
      icon: Stethoscope,
      color: 'text-indigo-700',
      barColor: scores.veterinaryCare.percentage >= 75 ? 'bg-indigo-500' : 'bg-rose-500',
      description: 'Veterinary affiliation, vaccination cards, prescription logbooks, emergency clinic access.',
    },
    {
      id: 'safety',
      title: 'Safety',
      score: scores.safety,
      icon: ShieldAlert,
      color: 'text-rose-700',
      barColor: scores.safety.percentage >= 75 ? 'bg-rose-500' : 'bg-rose-600',
      description: 'Perimeter fencing, certified fire extinguishers, exits, staff safety ratios.',
    },
  ];

  const isPassing = scores.totalScore >= 80;
  const isNeedsReInspection = scores.totalScore >= 50 && scores.totalScore < 80;

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 8 of 12: Audit Scoring
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">8. Automated Inspection Score Engine</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Real-time audit scoring calculated algorithmically across 5 statutory welfare dimensions with visual score progression.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Total Audit Score</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {scores.totalScore} / 100
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
        {/* Total Score Mega Bar */}
        <div className="p-6 bg-gradient-to-br from-[#e0f9f5]/50 to-white rounded-2xl border border-[#99f6e4] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                Overall Accreditation Composite Rating
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {scores.totalScore}
                  <span className="text-2xl font-bold text-slate-400">/100</span>
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isPassing
                      ? 'bg-emerald-100 text-emerald-800'
                      : isNeedsReInspection
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isPassing
                    ? 'PASSED (Eligible for Badge)'
                    : isNeedsReInspection
                    ? 'CONDITIONAL (Re-Inspection Required)'
                    : 'FAILED (Critical Non-Compliance)'}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-xs text-slate-500 font-semibold block">Audit Benchmark</span>
              <span className="text-xs font-bold text-slate-700">80/100 Required for Gold Accreditation</span>
              <span className="text-[11px] text-rose-600 block font-medium">
                Shortfall: {Math.max(0, 80 - scores.totalScore)} points to pass
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300 flex">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isPassing ? 'bg-emerald-500' : isNeedsReInspection ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${scores.totalScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Critical Fail)</span>
              <span>50 (Threshold)</span>
              <span>80 (Accredited Benchmark)</span>
              <span>100 (Exemplary)</span>
            </div>
          </div>
        </div>

        {/* 5 Categories Breakdown Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Inspection Category Breakdown</span>
            <span className="text-[11px] text-slate-500">5 Categories • 20 Points Max Each</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-[#0d9488]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{card.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 font-mono">
                        {card.score.earned} / {card.score.total}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">{card.description}</p>
                  </div>

                  {/* Category Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Compliance</span>
                      <span className="font-bold text-slate-700">{card.score.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${card.barColor}`}
                        style={{ width: `${card.score.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Benchmark Legend */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Award className="w-4 h-4 text-[#0d9488]" />
            <span>Accreditation Audit Protocol Rules:</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <li className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span><strong>80 - 100:</strong> Direct approval &amp; Verified Badge issuance.</span>
            </li>
            <li className="flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span><strong>50 - 79:</strong> Conditional. Administrator requests Re-Inspection.</span>
            </li>
            <li className="flex items-center gap-1.5 text-rose-800">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span><strong>&lt; 50:</strong> Immediate rejection with mandatory 60-day remediation.</span>
            </li>
          </ul>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Back: Checklist
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Verification Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

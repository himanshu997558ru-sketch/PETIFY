import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Building,
  Sparkles,
  Heart,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Save,
} from 'lucide-react';
import { useShelterVerification, INITIAL_CHECKLIST_TEMPLATE } from '../../context/ShelterVerificationContext';
import { ChecklistItem, ChecklistItemStatus } from '../../types';

interface InspectionChecklistProps {
  requestId?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
  requestId = 'VR-2025-105',
  onNext,
  onPrev,
}) => {
  const { requests, updateChecklistItems } = useShelterVerification();
  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const r = currentReq?.report;

  const [items, setItems] = useState<ChecklistItem[]>(
    r?.detailedChecklist && r.detailedChecklist.length > 0 ? r.detailedChecklist : INITIAL_CHECKLIST_TEMPLATE
  );

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [toast, setToast] = useState<string | null>(null);

  const categories: Array<ChecklistItem['category']> = [
    'Facility',
    'Hygiene',
    'Animal Welfare',
    'Veterinary Care',
    'Safety',
  ];

  const handleStatusChange = (id: string, newStatus: ChecklistItemStatus) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setItems(updated);
    updateChecklistItems(currentReq.requestId, updated);
  };

  const handleNotesChange = (id: string, notes: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    setItems(updated);
    updateChecklistItems(currentReq.requestId, updated);
  };

  const handleSaveAll = () => {
    updateChecklistItems(currentReq.requestId, items);
    setToast('Inspection checklist and live audit scores synchronized.');
    setTimeout(() => setToast(null), 3000);
  };

  const statusOptions: Array<{ status: ChecklistItemStatus; label: string; icon: any; color: string; activeBg: string }> = [
    { status: 'Pass', label: 'Pass', icon: CheckCircle2, color: 'text-emerald-700', activeBg: 'bg-emerald-600 text-white' },
    { status: 'Needs Improvement', label: 'Needs Improvement', icon: AlertTriangle, color: 'text-amber-700', activeBg: 'bg-amber-500 text-white' },
    { status: 'Fail', label: 'Fail', icon: XCircle, color: 'text-rose-700', activeBg: 'bg-rose-600 text-white' },
    { status: 'Not Applicable', label: 'N/A', icon: HelpCircle, color: 'text-slate-700', activeBg: 'bg-slate-600 text-white' },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Facility':
        return <Building className="w-4 h-4 text-[#0d9488]" />;
      case 'Hygiene':
        return <Sparkles className="w-4 h-4 text-[#0d9488]" />;
      case 'Animal Welfare':
        return <Heart className="w-4 h-4 text-[#0d9488]" />;
      case 'Veterinary Care':
        return <Stethoscope className="w-4 h-4 text-[#0d9488]" />;
      case 'Safety':
        return <ShieldAlert className="w-4 h-4 text-[#0d9488]" />;
      default:
        return <ClipboardCheck className="w-4 h-4 text-[#0d9488]" />;
    }
  };

  const passCount = items.filter((i) => i.status === 'Pass').length;
  const improveCount = items.filter((i) => i.status === 'Needs Improvement').length;
  const failCount = items.filter((i) => i.status === 'Fail').length;

  const filteredItems = filterCategory === 'All' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 7 of 12: Physical Inspection
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">7. Physical Inspection Checklist</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Inspect all 24 statutory welfare items across Facility, Hygiene, Animal Welfare, Veterinary Care, and Safety. Every metric is rated Pass, Needs Improvement, Fail, or N/A.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/20 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">{passCount} Pass</span>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">{improveCount} Improve</span>
            <span className="px-2 py-0.5 rounded bg-rose-400/20 text-rose-300 font-bold">{failCount} Fail</span>
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

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterCategory === 'All'
                ? 'bg-[#0d9488] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items (24)
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#0d9488] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Checklist Items Table */}
        <div className="space-y-4">
          {categories
            .filter((cat) => filterCategory === 'All' || filterCategory === cat)
            .map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              return (
                <div key={cat} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-2">
                      {getCategoryIcon(cat)}
                      {cat} ({catItems.length} Criteria)
                    </h3>
                    <span className="text-[11px] text-slate-500">Max Weight: 20 Points</span>
                  </div>

                  <div className="divide-y divide-slate-200/80 space-y-3">
                    {catItems.map((item) => (
                      <div key={item.id} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="md:w-1/3">
                          <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">Item Ref: #{item.id}</span>
                        </div>

                        {/* Status Pills: Pass / Needs Improvement / Fail / NA */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {statusOptions.map((opt) => {
                            const isSelected = item.status === opt.status;
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.status}
                                type="button"
                                onClick={() => handleStatusChange(item.id, opt.status)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                                  isSelected
                                    ? `${opt.activeBg} shadow-xs scale-102`
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                <span>{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Inspector Note Input */}
                        <div className="md:w-1/3">
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            placeholder="Inspector observation note..."
                            className="w-full px-2.5 py-1 text-[11px] bg-white rounded-lg border border-slate-200 focus:outline-[#0d9488]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Back: Camera Evidence
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 border border-[#99f6e4] text-[#0f766e] bg-[#e0f9f5] hover:bg-[#ccfbf1] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </button>
          </div>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Next: Inspection Score (Audit Breakdown)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

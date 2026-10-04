import React from 'react';
import { usePetVerification } from '../../context/PetVerificationContext';
import {
  ShieldCheck,
  Building2,
  Users,
  PawPrint,
  Clock,
  RotateCcw,
  Sparkles,
  PlusCircle,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

interface PetVerificationNavHeaderProps {
  currentScreen: 'shelter' | 'admin' | 'adopter';
  onNavigateScreen: (screen: 'shelter' | 'admin' | 'adopter') => void;
  shelterSubTab?: 'dashboard' | 'add-pet' | 'my-pets';
  onSelectShelterSubTab?: (tab: 'dashboard' | 'add-pet' | 'my-pets') => void;
  adminSubTab?: 'verification' | 'dashboard';
  onSelectAdminSubTab?: (tab: 'verification' | 'dashboard') => void;
}

export const PetVerificationNavHeader: React.FC<PetVerificationNavHeaderProps> = ({
  currentScreen,
  onNavigateScreen,
  shelterSubTab = 'my-pets',
  onSelectShelterSubTab,
  adminSubTab = 'verification',
  onSelectAdminSubTab,
}) => {
  const { stats, resetToSampleData } = usePetVerification();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Primary Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
            <PawPrint className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">Petify</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                Verification System
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Humane Animal Welfare Physical Audit Pipeline
            </p>
          </div>
        </div>

        {/* Role Portal Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {/* Shelter Portal */}
          <button
            type="button"
            onClick={() => onNavigateScreen('shelter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'shelter'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Shelter Portal</span>
          </button>

          {/* Admin / Verification Team */}
          <button
            type="button"
            onClick={() => onNavigateScreen('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Verification</span>
            {stats.pending > 0 && (
              <span className="w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                {stats.pending}
              </span>
            )}
          </button>

          {/* Public Adopter View */}
          <button
            type="button"
            onClick={() => onNavigateScreen('adopter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'adopter'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Adopter View</span>
            <span className="text-[10px] bg-purple-900/90 text-purple-200 px-1.5 py-0.2 rounded-full font-mono">
              {stats.available} Live
            </span>
          </button>
        </div>

        {/* Pipeline Summary Counters & Demo Reset */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold">🟡 {stats.pending} Pending</span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-400 font-bold">🔵 {stats.scheduled} Scheduled</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">🟢 {stats.verified} Verified</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-bold">🔴 {stats.rejected} Rejected</span>
          </div>

          <button
            type="button"
            onClick={resetToSampleData}
            title="Reset the 5 demo pets across all stages"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Secondary Context Bar based on active portal */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {currentScreen === 'shelter' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold text-[11px]">Shelter Views:</span>
              <button
                type="button"
                onClick={() => onSelectShelterSubTab && onSelectShelterSubTab('my-pets')}
                className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                  shelterSubTab === 'my-pets'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3 h-3" />
                <span>My Pets Registry (Page 2)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectShelterSubTab && onSelectShelterSubTab('add-pet')}
                className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                  shelterSubTab === 'add-pet'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-3 h-3" />
                <span>Add Pet for Adoption (Page 1)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectShelterSubTab && onSelectShelterSubTab('dashboard')}
                className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                  shelterSubTab === 'dashboard'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Shelter Dashboard
              </button>
            </div>
          )}

          {currentScreen === 'admin' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold text-[11px]">Admin Views:</span>
              <button
                type="button"
                onClick={() => onSelectAdminSubTab && onSelectAdminSubTab('verification')}
                className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                  adminSubTab === 'verification'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Pet Verification Dashboard (Page 3)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectAdminSubTab && onSelectAdminSubTab('dashboard')}
                className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                  adminSubTab === 'dashboard'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin Overview
              </button>
            </div>
          )}

          {currentScreen === 'adopter' && (
            <div className="flex items-center gap-2 text-[11px] text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Public Adopter View: Strictly displays only physically verified &amp; approved companions.</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 ml-auto hidden sm:block">
            <span>Workflow: </span>
            <span className="text-slate-300 font-medium">Add Pet → Pending → Physical Inspection → Admin Approval → Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

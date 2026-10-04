import React from 'react';
import { useAppStore } from '../context/AppContext';
import { User, Home, Shield, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleSyncBarProps {
  onRoleChange?: (role: 'adopter' | 'shelter' | 'admin') => void;
  onSignOut?: () => void;
}

export const RoleSyncBar: React.FC<RoleSyncBarProps> = ({ onRoleChange, onSignOut }) => {
  const {
    currentRole,
    setCurrentRole,
    pets,
    applications,
    appointments,
    reports,
    resetAllData,
  } = useAppStore();

  const handleSwitch = (role: 'adopter' | 'shelter' | 'admin') => {
    setCurrentRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md z-50">
      {/* Left: Role Switcher Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Switch Role:</span>
        </span>

        <button
          onClick={() => handleSwitch('adopter')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'adopter'
              ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Switch to Adopter Seeker Dashboard"
        >
          <User className="w-3.5 h-3.5 text-purple-200" />
          <span>Adopter Portal</span>
        </button>

        <button
          onClick={() => handleSwitch('shelter')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'shelter'
              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Switch to Shelter Operations Portal"
        >
          <Home className="w-3.5 h-3.5 text-emerald-200" />
          <span>Shelter Portal</span>
        </button>

        <button
          onClick={() => handleSwitch('admin')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
            currentRole === 'admin'
              ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Switch to Admin Alliance Management Portal"
        >
          <Shield className="w-3.5 h-3.5 text-sky-200" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Center: Live Sync Status */}
      <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Live Cross-Role Sync Active</span>
        </span>
        <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
          Pets: <strong className="text-white">{pets.length}</strong> • Apps:{' '}
          <strong className="text-white">{applications.length}</strong> • Visits:{' '}
          <strong className="text-white">{appointments.length}</strong>
          {reports.length > 0 && (
            <>
              {' '}• Flags: <strong className="text-rose-400">{reports.length}</strong>
            </>
          )}
        </span>
      </div>

      {/* Right: Quick Reset Data or Sign Out */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.confirm('Reset all shared data to default initial state?')) {
              resetAllData();
            }
          }}
          className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1 transition-colors"
          title="Reset to default mock data"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

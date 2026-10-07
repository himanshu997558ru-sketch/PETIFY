import React, { useState } from 'react';
import { Menu, X, Heart, Shield, CheckCircle2, Home, User, LogOut, ArrowRight, Bell, ClipboardCheck } from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';
import { ScreenType, UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onSignOut: () => void;
  user: UserProfile;
  unreadCount?: number;
  adminActiveTab?: string;
  onSelectAdminTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onSignOut,
  user,
  unreadCount = 1,
  adminActiveTab = 'overview',
  onSelectAdminTab,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fff8f1]/95 backdrop-blur-sm border-b border-[#e8e2da]">
      {/* Primary Brand Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-4">
          <button
            id="mobile-menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-[#56423c] hover:text-[#1d1b17] hover:bg-[#eee7e0] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            id="brand-logo-link"
            onClick={() => onNavigate('adopter')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200 shrink-0">
              <img
                src={KIN_PAWS_LOGO}
                alt="Petify Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tight text-[#1d1b17] leading-none">
              Petify
            </span>
          </button>
        </div>

        {/* Center: Admin Dashboard Navigation Links (Shown only when in Admin view) */}
        {currentScreen === 'admin' && (
          <nav className="hidden lg:flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#e8e2da] shadow-2xs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'links', label: 'Links & Portals' },
              { id: 'shelters', label: 'Shelters Queue' },
              { id: 'pets', label: 'Pet Oversight' },
              { id: 'applications', label: 'Applications' },
              { id: 'users', label: 'Users' },
              { id: 'compliance', label: 'Compliance' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectAdminTab?.(t.id)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                  adminActiveTab === t.id
                    ? 'bg-[#206280] text-white shadow-xs'
                    : 'text-[#56423c] hover:text-[#1d1b17] hover:bg-[#f9f3eb]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right: Avatar & Notifications */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => onNavigate(user.role as ScreenType || 'adopter')}
            className="relative p-2 text-[#56423c] hover:text-[#1d1b17] hover:bg-[#eee7e0] rounded-full transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#9c3e1f] rounded-full ring-2 ring-[#fff8f1]"></span>
            )}
          </button>

          <button
            id="user-profile-toggle"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full border-2 border-transparent hover:border-[#ddc0b8] transition-all cursor-pointer"
            aria-label="User profile"
          >
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
          </button>

          {/* User Dropdown */}
          {profileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-[#e8e2da] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-[#f3ede5]">
                <p className="text-sm font-semibold text-[#1d1b17]">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-[#8a726b] font-mono truncate">{user.email}</p>
                )}
                <p className="text-[11px] text-[#56423c] mt-0.5">{user.location} • {user.status}</p>
              </div>
              <div className="py-1">
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#1d1b17] hover:bg-[#f9f3eb] flex items-center gap-2 font-medium"
                  >
                    <Shield className="w-4 h-4 text-[#206280]" />
                    Alliance Admin Portal
                  </button>
                )}
                {user.role === 'shelter' && (
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigate('shelter');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#1d1b17] hover:bg-[#f9f3eb] flex items-center gap-2 font-medium"
                  >
                    <Home className="w-4 h-4 text-[#376851]" />
                    Shelter Operations
                  </button>
                )}
                {(!user.role || user.role === 'adopter') && (
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigate('adopter');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#1d1b17] hover:bg-[#f9f3eb] flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-[#9c3e1f]" />
                    Adopter Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('inspector');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-indigo-900 hover:bg-indigo-50 flex items-center gap-2 font-medium border-t border-slate-100"
                >
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  Field Worker Audit Portal
                </button>
              </div>
              <div className="border-t border-[#f3ede5] pt-1">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#9c3e1f] hover:bg-[#ffdad6]/40 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[#e8e2da] px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#f9f3eb] rounded-lg">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="lg" />
            <div>
              <p className="font-semibold text-sm text-[#1d1b17]">{user.name}</p>
              {user.email && (
                <p className="text-xs text-[#8a726b] font-mono truncate">{user.email}</p>
              )}
              <p className="text-xs text-[#56423c]">{user.location} • {user.status}</p>
            </div>
          </div>
          <div className="space-y-1">
            {currentScreen === 'admin' ? (
              <>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#8a726b] pt-1">
                  Admin Navigation
                </p>
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'links', label: 'Links & Portals' },
                  { id: 'shelters', label: 'Shelters Queue' },
                  { id: 'pets', label: 'Pet Oversight' },
                  { id: 'applications', label: 'Applications' },
                  { id: 'users', label: 'Users' },
                  { id: 'compliance', label: 'Compliance' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setMenuOpen(false);
                      onSelectAdminTab?.(tab.id);
                    }}
                    className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-md ${
                      adminActiveTab === tab.id
                        ? 'bg-[#206280] text-white'
                        : 'text-[#56423c] hover:bg-[#f9f3eb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="pt-2 border-t border-[#f3ede5]"></div>
              </>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate(user.role as ScreenType || 'adopter');
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium text-[#1d1b17] hover:bg-[#f3ede5] rounded-md"
              >
                {user.role === 'admin'
                  ? 'Alliance Admin Portal'
                  : user.role === 'shelter'
                  ? 'Shelter Operations Portal'
                  : 'Companions & Adopter Dashboard'}
              </button>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                onSignOut();
              }}
              className="w-full text-left py-2 px-3 text-sm font-medium text-[#9c3e1f] hover:bg-[#ffdad6]/40 rounded-md flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

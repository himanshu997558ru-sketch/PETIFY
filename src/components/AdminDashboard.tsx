import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  PawPrint,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Check,
  X,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
  Clock,
  ExternalLink,
  Mail,
  Brain,
  MapPin,
  CalendarCheck,
  ShieldAlert,
  FileCheck,
  Award,
  Globe,
  Share2,
  Trash2,
  Lock,
  UserCheck,
  AlertCircle,
  Menu,
  ShieldCheck,
  Activity,
  CheckCircle,
  Building2,
  ClipboardCheck,
} from 'lucide-react';
import { Pet, AdoptionApplication, UserProfile, ShelterVerificationRequest, VerifiedShelterBadge, VerificationStage } from '../types';
import { AdoptionCertificateModal, CertificateData } from './AdoptionCertificateModal';
import { useShelterVerification } from '../context/ShelterVerificationContext';
import { VerificationPipelineTracker } from './verification/VerificationPipelineTracker';
import { ShelterRegistrationModal } from './verification/ShelterRegistrationModal';
import { AdminAssignWorkerModal } from './verification/AdminAssignWorkerModal';
import { AdminReviewReportModal } from './verification/AdminReviewReportModal';
import { VerifiedShelterBadgeModal } from './verification/VerifiedShelterBadgeModal';
import { FieldWorkerInspectionModal } from './verification/FieldWorkerInspectionModal';
import { ShelterVerificationPipelineHub } from './verification/ShelterVerificationPipelineHub';
import { useAppStore } from '../context/AppContext';

interface AdminDashboardProps {
  user?: UserProfile;
  onSignOut: () => void;
  onNavigateScreen?: (screen: 'adopter' | 'shelter' | 'admin') => void;
  pets?: Pet[];
  applications?: AdoptionApplication[];
}

interface PetListingItem {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Others';
  breed: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  image: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onSignOut,
  onNavigateScreen,
  pets = [],
  applications = [],
}) => {
  // Navigation tabs in the left sidebar
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'users' | 'pets' | 'shelters' | 'applications' | 'reports' | 'certificates' | 'analytics' | 'settings' | 'messages'
  >('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Timeframe filter for Platform Activity chart
  const [activityTimeframe, setActivityTimeframe] = useState<'7' | '30' | '90'>('7');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Adopter' | 'Shelter' | 'Admin'>('Adopter');

  const [viewPetModal, setViewPetModal] = useState<PetListingItem | null>(null);

  // Shelter Verification Pipeline Integration (New Full Multi-Stage Workflow)
  const { requests, fastTrackToStage, activeRequestId, setActiveRequestId } = useShelterVerification();
  const [selectedPipelineRequest, setSelectedPipelineRequest] = useState<ShelterVerificationRequest | null>(null);
  const [assignWorkerRequest, setAssignWorkerRequest] = useState<ShelterVerificationRequest | null>(null);
  const [reviewReportRequest, setReviewReportRequest] = useState<ShelterVerificationRequest | null>(null);
  const [viewBadge, setViewBadge] = useState<VerifiedShelterBadge | null>(null);
  const [isRegisterShelterOpen, setIsRegisterShelterOpen] = useState(false);
  const [workerInspectRequest, setWorkerInspectRequest] = useState<ShelterVerificationRequest | null>(null);
  const [shelterStageFilter, setShelterStageFilter] = useState<string>('ALL');
  const [shelterViewMode, setShelterViewMode] = useState<'hub' | 'list'>('hub');

  // Shelter Verification state (Feature 2: Admin ✅, Shelter ✅, Adopter ❌)
  const [shelterListings, setShelterListings] = useState([
    {
      id: 'sh-1',
      name: 'Happy Paws Rescue & Sanctuary',
      regNumber: 'NGO-DEL-8891',
      city: 'Delhi NCR',
      capacity: '45 Animals',
      verificationStatus: 'Verified',
      documentsVerified: true,
      inspectionDate: '15 Jan 2025',
    },
    {
      id: 'sh-2',
      name: 'Austin Animal Welfare Network',
      regNumber: 'TX-501C-4421',
      city: 'Austin, TX',
      capacity: '60 Animals',
      verificationStatus: 'Pending Review',
      documentsVerified: true,
      inspectionDate: 'Pending Audit',
    },
    {
      id: 'sh-3',
      name: 'City Animal League',
      regNumber: 'NGO-UP-3312',
      city: 'Ghaziabad, UP',
      capacity: '30 Animals',
      verificationStatus: 'Pending Review',
      documentsVerified: false,
      inspectionDate: 'Scheduled 25 Jun',
    },
    {
      id: 'sh-4',
      name: 'Blue Cross Community Center',
      regNumber: 'NGO-MUM-7721',
      city: 'Mumbai',
      capacity: '80 Animals',
      verificationStatus: 'Verified',
      documentsVerified: true,
      inspectionDate: '10 Feb 2025',
    },
  ]);

  // Reported Listings Moderation Queue (Feature 15: Admin ✅, Shelter ❌, Adopter ✅)
  const [reportedListings, setReportedListings] = useState([
    {
      id: 'rep-1',
      petName: 'Chippy (Parrot)',
      reporter: 'Riya Sharma',
      reason: 'Misleading or False Information',
      details: 'Suspected unauthorized exotic species listing without certified captive breeding wildlife clearance.',
      date: '2 hours ago',
      status: 'Pending Action',
    },
    {
      id: 'rep-2',
      petName: 'Bruno (Labrador)',
      reporter: 'Vikram Mehta',
      reason: 'Suspicious / Unauthorized Rehoming Fee',
      details: 'Third party claiming advance cash deposit required before meet and greet.',
      date: 'Yesterday',
      status: 'Investigating',
    },
  ]);

  // Adoption Certificates Registry (Feature 18: Admin ✅, Shelter ✅, Adopter ✅)
  const [certificatesList] = useState<CertificateData[]>([
    {
      certId: 'PC-CERT-2024-8841',
      petName: 'Bella',
      petType: 'Cat',
      breed: 'Calico Domestic Shorthair',
      microchipId: '985141002345891',
      adopterName: 'Riya Sharma',
      shelterName: 'Happy Paws Rescue & Sanctuary',
      adoptionDate: '18 May 2024',
    },
    {
      certId: 'PC-CERT-2023-6102',
      petName: 'Rusty',
      petType: 'Dog',
      breed: 'Hound Mix',
      microchipId: '985141007721034',
      adopterName: 'Riya Sharma',
      shelterName: 'Austin Sanctuary Network',
      adoptionDate: '12 January 2023',
    },
    {
      certId: 'PC-CERT-2025-9943',
      petName: 'Luna',
      petType: 'Cat',
      breed: 'Persian Longhair',
      microchipId: '985141008819201',
      adopterName: 'Rohan Gupta',
      shelterName: 'Happy Paws Rescue & Sanctuary',
      adoptionDate: '15 June 2025',
    },
  ]);

  // Initial Pet Listings matching screenshot:
  // Bruno (Dog, Labrador, Delhi, Pending)
  // Luna (Cat, Persian, Noida, Approved)
  // Milo (Dog, Beagle, Ghaziabad, Pending)
  // Chippy (Bird, Parrot, Lucknow, Approved)
  const [petListings, setPetListings] = useState<PetListingItem[]>([
    {
      id: 'p-1',
      name: 'Bruno',
      type: 'Dog',
      breed: 'Labrador',
      location: 'Delhi',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&h=200&q=80',
    },
    {
      id: 'p-2',
      name: 'Luna',
      type: 'Cat',
      breed: 'Persian',
      location: 'Noida',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&h=200&q=80',
    },
    {
      id: 'p-3',
      name: 'Milo',
      type: 'Dog',
      breed: 'Beagle',
      location: 'Ghaziabad',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=200&h=200&q=80',
    },
    {
      id: 'p-4',
      name: 'Chippy',
      type: 'Bird',
      breed: 'Parrot',
      location: 'Lucknow',
      status: 'Approved',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=200&h=200&q=80',
    },
  ]);

  // Connect to shared store
  const {
    pets: storePets,
    approvePetByAdmin,
    rejectPetByAdmin,
  } = useAppStore();

  // Combine storePets with petListings so shelter-added pets show up in Admin Moderation
  const combinedPetListings: PetListingItem[] = [
    ...storePets.map((p) => ({
      id: p.id,
      name: p.name,
      type: (p.type === 'Dog' || p.type === 'Cat' || p.type === 'Bird' ? p.type : 'Others') as any,
      breed: p.breed,
      location: p.location || 'Delhi NCR',
      status: (p.adminStatus === 'Approved' ? 'Approved' : p.adminStatus === 'Rejected' ? 'Rejected' : 'Pending') as any,
      image: p.image,
    })),
    ...petListings.filter((lp) => !storePets.some((sp) => sp.id === lp.id || sp.name === lp.name)),
  ];

  // Handle Approve Pet (Step 4 in Lifecycle)
  const handleApprovePet = (id: string, name: string) => {
    approvePetByAdmin(id);
    setPetListings((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, status: 'Approved' } : pet))
    );
    triggerToast(`Listing approved for ${name}! Published to public Adopter Search (Step 4 → 5).`);
  };

  // Handle Reject Pet
  const handleRejectPet = (id: string, name: string) => {
    rejectPetByAdmin(id);
    setPetListings((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, status: 'Rejected' } : pet))
    );
    triggerToast(`Listing rejected for ${name}.`);
  };

  // Handle Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    triggerToast(`New user "${newUserName}" created as ${newUserRole}!`);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Activity Chart dataset per timeframe
  const activityDataMap = {
    '7': [
      { date: '16 Sep', users: 10, adoptions: 2 },
      { date: '17 Sep', users: 18, adoptions: 7 },
      { date: '18 Sep', users: 20, adoptions: 10 },
      { date: '19 Sep', users: 18, adoptions: 8 },
      { date: '20 Sep', users: 28, adoptions: 12 },
      { date: '21 Sep', users: 35, adoptions: 16 },
      { date: '22 Sep', users: 44, adoptions: 22 },
    ],
    '30': [
      { date: 'Week 1', users: 55, adoptions: 18 },
      { date: 'Week 2', users: 70, adoptions: 24 },
      { date: 'Week 3', users: 95, adoptions: 34 },
      { date: 'Week 4', users: 120, adoptions: 48 },
    ],
    '90': [
      { date: 'July', users: 140, adoptions: 42 },
      { date: 'August', users: 195, adoptions: 60 },
      { date: 'September', users: 250, adoptions: 78 },
    ],
  };

  const currentActivityData = activityDataMap[activityTimeframe];

  // Planned features list matching screenshot exactly
  const plannedFeatures = [
    {
      id: 'f-1',
      title: 'Google Login',
      desc: 'Easy and secure access',
      iconBg: 'bg-white border border-slate-200 text-slate-700',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      ),
    },
    {
      id: 'f-2',
      title: 'Email Notifications',
      desc: 'Keep users updated in real-time',
      iconBg: 'bg-blue-50 text-blue-600',
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: 'f-3',
      title: 'Advanced Analytics',
      desc: 'Detailed reports & insights',
      iconBg: 'bg-purple-50 text-purple-600',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'f-4',
      title: 'AI-based Pet Recommendation',
      desc: 'Find the perfect pet using AI',
      iconBg: 'bg-indigo-50 text-indigo-600',
      icon: <Brain className="w-5 h-5" />,
    },
    {
      id: 'f-5',
      title: 'Location/Map Integration',
      desc: 'Find pets near you',
      iconBg: 'bg-emerald-50 text-emerald-600',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 'f-6',
      title: 'Online Appointment Scheduling',
      desc: 'Book visits & meetups',
      iconBg: 'bg-violet-50 text-violet-600',
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      id: 'f-7',
      title: 'Pet Health Records',
      desc: 'Track vaccinations & health history',
      iconBg: 'bg-cyan-50 text-cyan-600',
      icon: <ShieldAlert className="w-5 h-5" />,
    },
    {
      id: 'f-8',
      title: 'Document Verification',
      desc: 'Ensure safe adoptions',
      iconBg: 'bg-fuchsia-50 text-fuchsia-600',
      icon: <FileCheck className="w-5 h-5" />,
    },
    {
      id: 'f-9',
      title: 'Adoption Certificate Generation',
      desc: 'Official adoption certificates',
      iconBg: 'bg-amber-50 text-amber-600',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fe] text-[#1e293b] font-sans antialiased overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="p-6 pb-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200 shrink-0">
                <img src="/petify-logo.svg" alt="Petify Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0f172a] tracking-tight leading-none">Petify</h1>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'pets', label: 'Pet Verification & Browse', icon: PawPrint },
              { id: 'shelters', label: 'Shelter Verification', icon: ShieldCheck },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'reports', label: 'Reported Listings', icon: ShieldAlert, badge: String(reportedListings.length) },
              { id: 'certificates', label: 'Adoption Certificates', icon: Award },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '3' },
              { id: 'settings', label: 'System Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#e0edff] text-[#2563eb] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 text-[11px] font-bold text-white bg-[#ef4444] rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Section */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          {/* Logout Button */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#ef4444] hover:bg-red-50/70 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            <span>Logout</span>
          </button>

          {/* Cute Pet Illustration Box with "Better Homes Happier Tails ♡" */}
          <div className="relative rounded-2xl bg-gradient-to-b from-blue-50/60 to-indigo-50/60 p-3 pt-4 border border-blue-100/60 text-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center -space-x-4 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Dog"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Cat"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs translate-y-1"
                />
              </div>
              <p className="text-[12px] font-bold text-slate-800 tracking-tight leading-tight">
                Better Homes
              </p>
              <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 justify-center">
                Happier Tails <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar matching screenshot */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search users, pets, applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8fafc] text-sm text-[#0f172a] rounded-full pl-10 pr-4 py-2 border border-slate-200/80 outline-none focus:bg-white focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3 relative">

            {/* Notification Bell with red alert dot */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h4>
                    <span className="text-[11px] text-blue-600 font-medium">4 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-blue-50/60 text-slate-700">
                      <p className="font-semibold text-blue-900">New pet listed: Bruno</p>
                      <p className="text-[11px] text-slate-500">Pending review from Delhi Shelter</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                      <p className="font-semibold text-slate-800">New adopter registration</p>
                      <p className="text-[11px] text-slate-500">Riya Sharma verified account</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  A
                </div>
                <span className="text-sm font-semibold text-[#0f172a] hidden sm:inline">Admin</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-800">{user?.name || 'Himanshu (Admin)'}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{user?.email || 'himanshu@admin'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN DASHBOARD VIEW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {activeNav === 'dashboard' && (
            <>
              {/* ================= GREETING ROW ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a] flex items-center gap-2">
                <span>👋</span>
                <span>Good Morning, Admin!</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Here&apos;s what&apos;s happening on your platform today.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
              Mon, 22 Sep 2025
            </div>
          </div>

          {/* ================= 4 STAT SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* 1. Total Users */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <Users className="w-4 h-4 text-blue-300" />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-4">Total Users</p>
              <h3 className="text-3xl font-bold text-[#0f172a] tracking-tight mt-0.5">250</h3>
              <div className="flex items-center gap-1 text-[11px] text-[#16a34a] font-semibold mt-2">
                <span>↑ 12%</span>
                <span className="text-slate-400 font-normal">from last month</span>
              </div>
            </div>

            {/* 2. Total Pets */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                  <PawPrint className="w-6 h-6" />
                </div>
                <PawPrint className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-4">Total Pets</p>
              <h3 className="text-3xl font-bold text-[#0f172a] tracking-tight mt-0.5">120</h3>
              <div className="flex items-center gap-1 text-[11px] text-[#16a34a] font-semibold mt-2">
                <span>↑ 8%</span>
                <span className="text-slate-400 font-normal">from last month</span>
              </div>
            </div>

            {/* 3. Adoptions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <Heart className="w-4 h-4 text-rose-300 fill-current" />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-4">Adoptions</p>
              <h3 className="text-3xl font-bold text-[#0f172a] tracking-tight mt-0.5">78</h3>
              <div className="flex items-center gap-1 text-[11px] text-[#16a34a] font-semibold mt-2">
                <span>↑ 15%</span>
                <span className="text-slate-400 font-normal">from last month</span>
              </div>
            </div>

            {/* 4. Pending Applications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <Clock className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-4">Pending Applications</p>
              <h3 className="text-3xl font-bold text-[#0f172a] tracking-tight mt-0.5">15</h3>
              <div className="flex items-center gap-1 text-[11px] text-[#dc2626] font-semibold mt-2">
                <span>↓ 5%</span>
                <span className="text-slate-400 font-normal">from last month</span>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE GRID (LEFT: CHARTS & TABLES, RIGHT: ACTIONS & RECENT) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS: CHARTS & PET LISTINGS */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Row: Platform Activity & Pet Type Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platform Activity Line Chart (2/3 width) */}
                <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h3 className="text-sm font-bold text-[#0f172a]">Platform Activity</h3>
                    <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-lg text-xs font-medium">
                      {(['7', '30', '90'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setActivityTimeframe(t)}
                          className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                            activityTimeframe === t
                              ? 'bg-[#2563eb] text-white font-semibold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t === '7' ? '7 Days' : t === '30' ? '30 Days' : '3 Months'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                      <span>New Users</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span>
                      <span>Adoptions</span>
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="h-44 w-full relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      {[0, 30, 60, 90].map((y) => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                      ))}

                      {/* Blue Line: New Users */}
                      <path
                        d="M 0,95 Q 60,80 120,70 T 240,65 T 320,40 T 400,15"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Blue dots */}
                      {[
                        { cx: 10, cy: 95 },
                        { cx: 75, cy: 80 },
                        { cx: 140, cy: 75 },
                        { cx: 200, cy: 78 },
                        { cx: 265, cy: 55 },
                        { cx: 330, cy: 40 },
                        { cx: 395, cy: 15 },
                      ].map((pt, i) => (
                        <circle
                          key={i}
                          cx={pt.cx}
                          cy={pt.cy}
                          r="4"
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      ))}

                      {/* Purple Line: Adoptions */}
                      <path
                        d="M 0,115 Q 65,105 130,95 T 260,98 T 330,85 T 400,68"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Purple dots */}
                      {[
                        { cx: 10, cy: 115 },
                        { cx: 75, cy: 105 },
                        { cx: 140, cy: 95 },
                        { cx: 200, cy: 98 },
                        { cx: 265, cy: 90 },
                        { cx: 330, cy: 82 },
                        { cx: 395, cy: 68 },
                      ].map((pt, i) => (
                        <circle
                          key={i}
                          cx={pt.cx}
                          cy={pt.cy}
                          r="4"
                          fill="#8b5cf6"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-3 px-1">
                    {currentActivityData.map((d, i) => (
                      <span key={i}>{d.date}</span>
                    ))}
                  </div>
                </div>

                {/* Pet Type Distribution Donut Chart (1/3 width) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#0f172a] mb-2">Pet Type Distribution</h3>

                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Dogs: 43% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="14"
                          strokeDasharray="102 136"
                          strokeDashoffset="0"
                        />
                        {/* Cats: 32% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#8b5cf6"
                          strokeWidth="14"
                          strokeDasharray="76 162"
                          strokeDashoffset="-102"
                        />
                        {/* Birds: 10% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="14"
                          strokeDasharray="24 214"
                          strokeDashoffset="-178"
                        />
                        {/* Others: 15% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="14"
                          strokeDasharray="36 202"
                          strokeDashoffset="-202"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold text-[#0f172a] leading-none">120</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total Pets</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend list matching screenshot */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                        <span>Dogs</span>
                      </div>
                      <span className="font-semibold text-slate-800">52 (43%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></span>
                        <span>Cats</span>
                      </div>
                      <span className="font-semibold text-slate-800">38 (32%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                        <span>Birds</span>
                      </div>
                      <span className="font-semibold text-slate-800">12 (10%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                        <span>Others</span>
                      </div>
                      <span className="font-semibold text-slate-800">18 (15%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Pet Listings Table & Adoption Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Pet Listings Table (2/3 width) */}
                <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0f172a]">Recent Pet Listings</h3>
                    <button
                      onClick={() => setActiveNav('pets')}
                      className="text-xs font-semibold text-[#2563eb] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                          <th className="pb-3 font-semibold">Pet</th>
                          <th className="pb-3 font-semibold">Type</th>
                          <th className="pb-3 font-semibold">Breed</th>
                          <th className="pb-3 font-semibold">Location</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {combinedPetListings.map((pet) => (
                          <tr key={pet.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={pet.image}
                                  alt={pet.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                />
                                <span className="font-bold text-slate-900">{pet.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-slate-600">{pet.type}</td>
                            <td className="py-3 text-slate-600">{pet.breed}</td>
                            <td className="py-3 text-slate-600">{pet.location}</td>
                            <td className="py-3">
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                  pet.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : pet.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                }`}
                              >
                                {pet.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {pet.status === 'Pending' ? (
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    onClick={() => handleApprovePet(pet.id, pet.name)}
                                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#10b981] hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectPet(pet.id, pet.name)}
                                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setViewPetModal(pet)}
                                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Adoption Statistics Bar Chart (1/3 width) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#0f172a]">Adoption Statistics</h3>
                    <button
                      onClick={() => setActiveNav('analytics')}
                      className="text-xs font-semibold text-[#2563eb] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {/* Simple Bar Chart matching screenshot */}
                  <div className="h-44 w-full relative flex items-end justify-around pt-8 pb-2">
                    {/* Y-axis guide */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-slate-400 font-mono pointer-events-none">
                      <span>100</span>
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>

                    {/* Bar 1: Adopted (78) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end z-10 pl-6">
                      <span className="text-[11px] font-bold text-emerald-700">78</span>
                      <div
                        className="w-10 rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all shadow-xs"
                        style={{ height: '78%' }}
                      ></div>
                      <span className="text-[11px] font-medium text-slate-600 mt-1">Adopted</span>
                    </div>

                    {/* Bar 2: In Process (15) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end z-10">
                      <span className="text-[11px] font-bold text-blue-700">15</span>
                      <div
                        className="w-10 rounded-t-xl bg-gradient-to-t from-blue-500 to-blue-400 transition-all shadow-xs"
                        style={{ height: '18%' }}
                      ></div>
                      <span className="text-[11px] font-medium text-slate-600 mt-1">In Process</span>
                    </div>

                    {/* Bar 3: Rejected (12) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end z-10">
                      <span className="text-[11px] font-bold text-rose-700">12</span>
                      <div
                        className="w-10 rounded-t-xl bg-gradient-to-t from-rose-500 to-rose-400 transition-all shadow-xs"
                        style={{ height: '14%' }}
                      ></div>
                      <span className="text-[11px] font-medium text-slate-600 mt-1">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (1/3 WIDTH): QUICK ACTIONS & RECENT ACTIVITY */}
            <div className="space-y-6">
              {/* Quick Actions Card matching screenshot */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                <h3 className="text-sm font-bold text-[#0f172a] mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Add New User</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveNav('pets')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <PawPrint className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Review Pet Listings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveNav('applications')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">View Applications</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveNav('settings')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Manage Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Recent Activity Card matching screenshot */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#0f172a]">Recent Activity</h3>
                  <button className="text-xs font-semibold text-[#2563eb] hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">New user registered</p>
                      <p className="text-[11px] text-slate-500">Riya Sharma (Adopter)</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">2 hours ago</span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <PawPrint className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">Pet listing approved</p>
                      <p className="text-[11px] text-slate-500">Luna (Cat) - Happy Paws Shelter</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">3 hours ago</span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">New adoption application</p>
                      <p className="text-[11px] text-slate-500">APP1024 - Bruno (Dog)</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">4 hours ago</span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">Message received</p>
                      <p className="text-[11px] text-slate-500">From: Happy Paws Shelter</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">5 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Inspirational Card matching screenshot: "Together we can make a difference" */}
              <div className="rounded-2xl p-5 bg-gradient-to-tr from-blue-50 to-indigo-50/70 border border-blue-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PawPrint className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Together we can make a difference</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Every adoption saves a life. Help pets find their forever homes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Every adoption creates a brighter future for animals!')}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM CARD: PLANNED FEATURES (COMING SOON) ================= */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0f172a]">Planned Features</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  We are working on these features to make the platform even better!
                </p>
              </div>
            </div>

            {/* Grid of 9 planned features matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-3">
              {plannedFeatures.map((feat) => (
                <div
                  key={feat.id}
                  className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 shadow-2xs">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center ${feat.iconBg}`}>
                      {feat.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{feat.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ================= SUBVIEW: USER MANAGEMENT ================= */}
      {activeNav === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">Manage adopters, shelter coordinators, and platform administrators.</p>
            </div>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Registered</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'Riya Sharma', role: 'Adopter', loc: 'Delhi, IN', status: 'Active', date: 'Today, 2h ago' },
                    { name: 'Happy Paws Rescue', role: 'Shelter', loc: 'Noida, IN', status: 'Verified', date: '12 Sep 2025' },
                    { name: 'Rohan Gupta', role: 'Adopter', loc: 'Ghaziabad, IN', status: 'Active', date: '15 Sep 2025' },
                    { name: 'City Animal League', role: 'Shelter', loc: 'Delhi, IN', status: 'Verified', date: '01 Aug 2025' },
                    { name: 'Himanshu (Admin)', role: 'Administrator', loc: 'Central HQ', status: 'Active', date: 'System' },
                  ].map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 text-slate-600">{u.role}</td>
                      <td className="py-3 text-slate-600">{u.loc}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{u.date}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => triggerToast(`Managing profile for ${u.name}`)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: PET LISTINGS ================= */}
      {activeNav === 'pets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-900">Pet Oversight & Listings</h2>
              <p className="text-xs text-slate-500">Review, approve, or verify companion animal listings from shelters.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                {combinedPetListings.filter(p => p.status === 'Approved').length} Approved
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
                {combinedPetListings.filter(p => p.status === 'Pending').length} Pending
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3">Pet</th>
                    <th className="pb-3">Species</th>
                    <th className="pb-3">Breed</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {combinedPetListings.map((pet) => (
                    <tr key={pet.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                          <span className="font-bold text-slate-900">{pet.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600">{pet.type}</td>
                      <td className="py-3 text-slate-600">{pet.breed}</td>
                      <td className="py-3 text-slate-600">{pet.location}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pet.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {pet.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setViewPetModal(pet)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Health &amp; Info</span>
                          </button>
                          <button
                            onClick={() => handleApprovePet(pet.id, pet.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPet(pet.id, pet.name)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: APPLICATIONS ================= */}
      {activeNav === 'applications' && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-xl font-bold text-slate-900">Adoption Applications</h2>
            <p className="text-xs text-slate-500">Cross-shelter queue of adoption screenings and interviews.</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="space-y-3">
              {[
                { id: 'APP1024', applicant: 'Riya Sharma', pet: 'Bruno (Labrador)', shelter: 'Delhi Animal Shelter', status: 'Pending Review' },
                { id: 'APP1025', applicant: 'Rohan Gupta', pet: 'Luna (Persian Cat)', shelter: 'Happy Paws Rescue', status: 'Interview Scheduled' },
                { id: 'APP1026', applicant: 'Vikram Mehta', pet: 'Milo (Beagle)', shelter: 'City Animal League', status: 'Background Check' },
              ].map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 font-mono">{app.id}</span>
                      <span className="text-xs font-bold text-slate-900">• {app.pet}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Applicant: {app.applicant} | Shelter: {app.shelter}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {app.status}
                    </span>
                    <button
                      onClick={() => triggerToast(`Application ${app.id} fast-tracked!`)}
                      className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: ANALYTICS ================= */}
      {activeNav === 'analytics' && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-xl font-bold text-slate-900">Platform Analytics</h2>
            <p className="text-xs text-slate-500">Comprehensive velocity, adoption ratios, and community health statistics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-xs text-slate-500">Average Adoption Turnaround</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">4.8 Days</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">↓ 1.2 days faster than avg</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-xs text-slate-500">Adopter Screen Pass Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">86.4%</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 4.1% higher retention</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-xs text-slate-500">Active Foster Homes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">42 Homes</h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">100% capacity covered</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: SYSTEM SETTINGS ================= */}
      {activeNav === 'settings' && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
            <p className="text-xs text-slate-500">Platform security protocols, verification thresholds, and notification configs.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 max-w-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Strict Veterinary Verification</p>
                <p className="text-[11px] text-slate-500">Require rabies, microchip, and spay/neuter proof before listing.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Instant Email Notifications</p>
                <p className="text-[11px] text-slate-500">Broadcast urgent foster needs to local volunteers in real-time.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">AI Compatibility Scoring</p>
                <p className="text-[11px] text-slate-500">Match adopters with pets based on activity level and living space.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: MESSAGES ================= */}
      {activeNav === 'messages' && (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setActiveNav('dashboard')}
              className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-xl font-bold text-slate-900">Alliance Communications</h2>
            <p className="text-xs text-slate-500">Broadcasts and direct messages with affiliated shelters.</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            {[
              { from: 'Happy Paws Rescue', subject: 'Inquiry regarding Bruno intake status', time: '5 hours ago', unread: true },
              { from: 'Delhi Animal League', subject: 'Emergency foster needed for 3 Beagle pups', time: 'Yesterday', unread: false },
              { from: 'City Veterinary Hospital', subject: 'Medical records uploaded for Luna', time: '2 days ago', unread: false },
            ].map((m, i) => (
              <div key={i} className={`p-3.5 rounded-xl border flex items-center justify-between ${m.unread ? 'bg-blue-50/40 border-blue-200' : 'border-slate-100'}`}>
                <div>
                  <p className="text-xs font-bold text-slate-900">{m.from}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{m.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400">{m.time}</span>
                  <button
                    onClick={() => triggerToast(`Opening message thread with ${m.from}`)}
                    className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: SHELTER VERIFICATION PIPELINE (Full Multi-Stage Audit Flow) ================= */}
      {activeNav === 'shelters' && (
        <div className="space-y-6">
          {/* Header & Metric Counter Cards */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">
                  Shelter Registration &amp; Verification Pipeline
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Official 7-Step Workflow
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                End-to-end accreditation: Registration → Verification Request → Worker Assignment → Physical Visit &amp; Verification → Report Review → Verified Shelter Badge.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1 bg-[#e0f9f5] p-1 rounded-xl border border-[#99f6e4]/80">
                <button
                  type="button"
                  onClick={() => setShelterViewMode('hub')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    shelterViewMode === 'hub'
                      ? 'bg-[#0d9488] text-white shadow-xs'
                      : 'text-[#115e59] hover:text-[#042f2e]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>12-Step Pipeline Hub (VR-2025-105)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShelterViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    shelterViewMode === 'list'
                      ? 'bg-[#0d9488] text-white shadow-xs'
                      : 'text-[#115e59] hover:text-[#042f2e]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Directory View ({requests.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsRegisterShelterOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register New Shelter</span>
              </button>
            </div>
          </div>

          {shelterViewMode === 'hub' ? (
            <ShelterVerificationPipelineHub
              initialRequestId={activeRequestId || 'VR-2025-105'}
              userRole="admin"
            />
          ) : (
            <>
              {/* KPI Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div
              onClick={() => setShelterStageFilter('ALL')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'ALL' ? 'text-slate-300' : 'text-slate-400'}`}>
                Total Pipeline
              </span>
              <span className="text-xl font-black mt-1 block">{requests.length}</span>
              <span className="text-[10px] opacity-75">All Registrations</span>
            </div>

            <div
              onClick={() => setShelterStageFilter('VERIFICATION_REQUESTED')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'VERIFICATION_REQUESTED'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-amber-200'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'VERIFICATION_REQUESTED' ? 'text-amber-100' : 'text-amber-600'}`}>
                Step 2: Assign Worker
              </span>
              <span className="text-xl font-black mt-1 block">
                {requests.filter((r) => r.stage === 'VERIFICATION_REQUESTED').length}
              </span>
              <span className="text-[10px] opacity-75">Pending Inspector</span>
            </div>

            <div
              onClick={() => setShelterStageFilter('WORKER_ASSIGNED')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'WORKER_ASSIGNED'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-200'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'WORKER_ASSIGNED' ? 'text-blue-100' : 'text-blue-600'}`}>
                Step 3 &amp; 4: Visits
              </span>
              <span className="text-xl font-black mt-1 block">
                {requests.filter((r) => r.stage === 'WORKER_ASSIGNED' || r.stage === 'WORKER_VISITING').length}
              </span>
              <span className="text-[10px] opacity-75">Physical Audits Active</span>
            </div>

            <div
              onClick={() => setShelterStageFilter('REPORT_UPLOADED')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'REPORT_UPLOADED'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-purple-200'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'REPORT_UPLOADED' ? 'text-purple-100' : 'text-purple-600'}`}>
                Step 5: Admin Review
              </span>
              <span className="text-xl font-black mt-1 block">
                {requests.filter((r) => r.stage === 'REPORT_UPLOADED' || r.stage === 'ADMIN_REVIEW').length}
              </span>
              <span className="text-[10px] opacity-75">Reports Uploaded</span>
            </div>

            <div
              onClick={() => setShelterStageFilter('VERIFIED')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-emerald-200'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'VERIFIED' ? 'text-emerald-100' : 'text-emerald-600'}`}>
                Step 6: Verified
              </span>
              <span className="text-xl font-black mt-1 block">
                {requests.filter((r) => r.stage === 'VERIFIED').length}
              </span>
              <span className="text-[10px] opacity-75">Badges Issued</span>
            </div>

            <div
              onClick={() => setShelterStageFilter('REJECTED')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                shelterStageFilter === 'REJECTED'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-rose-200'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${shelterStageFilter === 'REJECTED' ? 'text-rose-100' : 'text-rose-600'}`}>
                Step 7: Rejected
              </span>
              <span className="text-xl font-black mt-1 block">
                {requests.filter((r) => r.stage === 'REJECTED').length}
              </span>
              <span className="text-[10px] opacity-75">Remediation Needed</span>
            </div>
          </div>

          {/* Shelter Verification List with Integrated Flow Tracker */}
          <div className="space-y-4">
            {requests
              .filter((req) => {
                if (shelterStageFilter === 'ALL') return true;
                if (shelterStageFilter === 'WORKER_ASSIGNED') {
                  return req.stage === 'WORKER_ASSIGNED' || req.stage === 'WORKER_VISITING';
                }
                if (shelterStageFilter === 'REPORT_UPLOADED') {
                  return req.stage === 'REPORT_UPLOADED' || req.stage === 'ADMIN_REVIEW';
                }
                return req.stage === shelterStageFilter;
              })
              .map((req) => {
                const isVerified = req.stage === 'VERIFIED';
                const isRejected = req.stage === 'REJECTED';
                const isReportUploaded =
                  req.stage === 'REPORT_UPLOADED' || req.stage === 'ADMIN_REVIEW';
                const isWorkerAssigned =
                  req.stage === 'WORKER_ASSIGNED' || req.stage === 'WORKER_VISITING';
                const isPendingAssignment = req.stage === 'VERIFICATION_REQUESTED';

                return (
                  <div
                    key={req.requestId}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5 hover:border-slate-300 transition-all"
                  >
                    {/* Top Row: Shelter Meta & Main Status Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                            <Building2 className="w-5 h-5 text-emerald-700" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">
                                {req.shelter.shelterName}
                              </h3>
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200 font-semibold">
                                {req.shelter.legalRegNumber}
                              </span>
                              {isVerified && (
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-950 border border-amber-300 rounded-full shadow-2xs">
                                  <Award className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Verified Shelter Badge</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Accreditation Rejected</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {req.shelter.streetAddress}, {req.shelter.city}, {req.shelter.state} {req.shelter.zipCode}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Director: <strong className="text-slate-700">{req.shelter.directorName}</strong></span>
                          <span>•</span>
                          <span>Capacity: <strong className="text-slate-700">{req.shelter.animalCapacity} Animals</strong></span>
                          <span>•</span>
                          <span>Active Count: <strong className="text-slate-700">{req.shelter.currentAnimalCount}</strong></span>
                          {req.assignedWorker && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                                <UserCheck className="w-3.5 h-3.5" />
                                Assigned: {req.assignedWorker.name} ({req.assignedWorker.badgeNumber})
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Primary Step Execution Buttons */}
                      <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
                        {/* Step 2: Assign Field Worker */}
                        {isPendingAssignment && (
                          <button
                            type="button"
                            onClick={() => setAssignWorkerRequest(req)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Assign Field Worker →</span>
                          </button>
                        )}

                        {/* Step 3 & 4: Worker Visits & Physical Verification */}
                        {isWorkerAssigned && (
                          <button
                            type="button"
                            onClick={() => setWorkerInspectRequest(req)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <ClipboardCheck className="w-4 h-4" />
                            <span>Perform Physical Inspection &amp; Upload Report →</span>
                          </button>
                        )}

                        {/* Step 5: Admin Reviews Report */}
                        {isReportUploaded && (
                          <button
                            type="button"
                            onClick={() => setReviewReportRequest(req)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <FileCheck className="w-4 h-4 text-indigo-200" />
                            <span>Admin Reviews Report &amp; Grant Badge →</span>
                          </button>
                        )}

                        {/* Step 6: Verified Shelter Badge View */}
                        {isVerified && req.badge && (
                          <button
                            type="button"
                            onClick={() => setViewBadge(req.badge!)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <Award className="w-4 h-4 text-amber-300" />
                            <span>View Verified Shelter Badge &amp; Seal</span>
                          </button>
                        )}

                        {/* Re-Assign / Re-Audit Option for any request */}
                        <button
                          type="button"
                          onClick={() => setAssignWorkerRequest(req)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                          title="Assign or reassign field auditor"
                        >
                          {req.assignedWorker ? 'Reassign Auditor' : 'Assign Officer'}
                        </button>
                      </div>
                    </div>

                    {/* Integrated 7-Step Verification Pipeline Tracker */}
                    <div className="pt-2">
                      <VerificationPipelineTracker request={req} />
                    </div>

                    {/* Fast-Track Simulation Bar (Helps test every stage of the workflow interactively) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold text-slate-700">Test Pipeline Fast-Track:</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'VERIFICATION_REQUESTED');
                            triggerToast(`${req.shelter.shelterName} reset to Verification Requested`);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                        >
                          1. Reg / Request
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'WORKER_ASSIGNED');
                            triggerToast(`Worker assigned to ${req.shelter.shelterName}`);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                        >
                          2. Worker Assigned
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'WORKER_VISITING');
                            triggerToast(`Worker visit started at ${req.shelter.shelterName}`);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                        >
                          3. Physical Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'REPORT_UPLOADED');
                            triggerToast(`Report uploaded for ${req.shelter.shelterName}`);
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                        >
                          4. Report Uploaded
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'VERIFIED');
                            triggerToast(`Verified Shelter Badge issued to ${req.shelter.shelterName}!`);
                          }}
                          className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-lg hover:bg-emerald-200 text-emerald-900 font-bold"
                        >
                          5. Verified (Badge)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fastTrackToStage(req.requestId, 'REJECTED');
                            triggerToast(`Verification rejected for ${req.shelter.shelterName}`);
                          }}
                          className="px-2.5 py-1 bg-rose-100 border border-rose-300 rounded-lg hover:bg-rose-200 text-rose-900 font-bold"
                        >
                          6. Rejected
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          </>
          )}
        </div>
      )}

      {/* ================= SUBVIEW: REPORTED LISTINGS (Feature 15) ================= */}
      {activeNav === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-900">Reported Listings Moderation Queue</h2>
              <p className="text-xs text-slate-500">Member flags for policy non-compliance, inaccurate health info, or unauthorized fees.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {reportedListings.length} Active Flags
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            {reportedListings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No active listing reports in queue. All flags resolved!
              </div>
            ) : (
              reportedListings.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        {rep.reason}
                      </span>
                      <span className="text-xs font-bold text-slate-900">• Pet: {rep.petName}</span>
                    </div>
                    <p className="text-xs text-slate-700">{rep.details}</p>
                    <p className="text-[11px] text-slate-400">Reported by {rep.reporter} • {rep.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setReportedListings(prev => prev.filter(r => r.id !== rep.id));
                        triggerToast(`Report for ${rep.petName} dismissed after investigation.`);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => {
                        setReportedListings(prev => prev.filter(r => r.id !== rep.id));
                        triggerToast(`Listing for ${rep.petName} removed from platform.`);
                      }}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                    >
                      Remove Listing
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= SUBVIEW: ADOPTION CERTIFICATES (Feature 18) ================= */}
      {activeNav === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setActiveNav('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-slate-900">Legal Adoption Certificates Central Registry</h2>
              <p className="text-xs text-slate-500">Audited digital legal certificates of adoption issued by accredited partners.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              {certificatesList.length} Certified Records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificatesList.map((cert) => (
              <div
                key={cert.certId}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cert.certId}
                    </span>
                    <span className="text-[10px] text-slate-400">{cert.adoptionDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{cert.petName}</h4>
                  <p className="text-xs text-slate-500">{cert.breed} ({cert.petType})</p>
                  <div className="mt-3 p-2 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                    <p><strong className="text-slate-800">Adopter:</strong> {cert.adopterName}</p>
                    <p><strong className="text-slate-800">Shelter:</strong> {cert.shelterName}</p>
                    <p><strong className="text-slate-800">Microchip:</strong> <span className="font-mono">{cert.microchipId}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Inspect Official Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        </main>
      </div>

      {/* ================= MODAL: ADD NEW USER ================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Add New User</h3>
              </div>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rohan Gupta"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., rohan@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Type</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-slate-50 text-xs rounded-xl px-3 py-2.5 border border-slate-200 outline-none"
                >
                  <option value="Adopter">Adopter Seeker</option>
                  <option value="Shelter">Shelter Partner</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW PET DETAILS & HEALTH INFO ================= */}
      {viewPetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{viewPetModal.name} Health &amp; Verification Audit</h3>
              <button onClick={() => setViewPetModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={viewPetModal.image}
              alt={viewPetModal.name}
              className="w-full h-44 rounded-2xl object-cover"
            />
            <div className="space-y-1.5 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900">Species &amp; Breed:</strong> {viewPetModal.type} ({viewPetModal.breed})
              </p>
              <p>
                <strong className="text-slate-900">Location:</strong> {viewPetModal.location}
              </p>
              <p>
                <strong className="text-slate-900">Listing Status:</strong>{' '}
                <span className="font-semibold text-emerald-600">{viewPetModal.status}</span>
              </p>
            </div>

            {/* Verified Pet Health Info (Feature 14) */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Veterinary Records &amp; Medical Clearance</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Rabies Batch</span>
                  <span className="font-semibold text-slate-800">RB-2024-998</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Microchip ID</span>
                  <span className="font-mono font-semibold text-slate-800">9851410098</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Spay / Neuter</span>
                  <span className="font-semibold text-emerald-700">Verified Completed</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Health Certificate</span>
                  <span className="font-semibold text-blue-700">Issued by DVM Vance</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleApprovePet(viewPetModal.id, viewPetModal.name);
                  setViewPetModal(null);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs"
              >
                Verify &amp; Approve Pet
              </button>
              <button
                onClick={() => setViewPetModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL ADOPTION CERTIFICATE (Feature 18) ================= */}
      {selectedCert && (
        <AdoptionCertificateModal
          data={selectedCert}
          onClose={() => setSelectedCert(null)}
          viewerRole="admin"
        />
      )}

      {/* ================= MODAL: SHELTER REGISTRATION (Step 1) ================= */}
      {isRegisterShelterOpen && (
        <ShelterRegistrationModal
          onClose={() => setIsRegisterShelterOpen(false)}
          onSuccess={() => {
            triggerToast('Shelter registration and verification request successfully initiated!');
            setIsRegisterShelterOpen(false);
          }}
        />
      )}

      {/* ================= MODAL: ADMIN ASSIGN WORKER (Step 3) ================= */}
      {assignWorkerRequest && (
        <AdminAssignWorkerModal
          request={assignWorkerRequest}
          onClose={() => setAssignWorkerRequest(null)}
          onSuccess={() => {
            triggerToast(`Field worker assigned to ${assignWorkerRequest.shelter.shelterName}!`);
            setAssignWorkerRequest(null);
          }}
        />
      )}

      {/* ================= MODAL: WORKER VISITS & PHYSICAL VERIFICATION (Steps 4, 5, 6) ================= */}
      {workerInspectRequest && (
        <FieldWorkerInspectionModal
          request={workerInspectRequest}
          onClose={() => setWorkerInspectRequest(null)}
          onSuccess={() => {
            triggerToast(`Verification report uploaded for ${workerInspectRequest.shelter.shelterName}!`);
            setWorkerInspectRequest(null);
          }}
        />
      )}

      {/* ================= MODAL: ADMIN REVIEWS REPORT & DECISION (Step 7) ================= */}
      {reviewReportRequest && (
        <AdminReviewReportModal
          request={reviewReportRequest}
          onClose={() => setReviewReportRequest(null)}
          onSuccess={() => {
            triggerToast(`Accreditation review completed for ${reviewReportRequest.shelter.shelterName}!`);
            setReviewReportRequest(null);
          }}
        />
      )}

      {/* ================= MODAL: VERIFIED SHELTER BADGE ================= */}
      {viewBadge && (
        <VerifiedShelterBadgeModal
          badge={viewBadge}
          onClose={() => setViewBadge(null)}
        />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

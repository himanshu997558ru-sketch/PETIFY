import React, { useState } from 'react';
import {
  Plus,
  PawPrint,
  FileText,
  Mail,
  BarChart2,
  Clock,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar,
  Sparkles,
  Heart,
  Eye,
  Check,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  Shield,
  Menu,
  Filter,
  Award,
  Activity,
  FileCheck,
  UserCheck,
  MessageSquare,
  Building2,
} from 'lucide-react';
import { AdoptionApplication, Pet, ScreenType, UserProfile, VerifiedShelterBadge } from '../types';
import { PETIFY_LOGO } from '../data/mockData';
import { AdoptionCertificateModal, CertificateData } from './AdoptionCertificateModal';
import { AdopterCommunicationHub } from './AdopterCommunicationHub';
import { CatBreedsDirectory } from './CatBreedsDirectory';
import { CAT_BREEDS_DIRECTORY } from '../data/catBreedsData';
import { DogBreedsDirectory } from './DogBreedsDirectory';
import { DOG_BREEDS_DIRECTORY } from '../data/dogBreedsData';
import { useAppStore } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';

interface ShelterDashboardProps {
  user?: UserProfile;
  applications: AdoptionApplication[];
  pets: Pet[];
  onOpenChat: (adopterName: string, text: string) => void;
  onUpdateAppStep: (appId: string, step: number) => void;
  onAddNewListing: () => void;
  onNavigateScreen: (screen: ScreenType) => void;
  onSignOut: () => void;
}

export const ShelterDashboard: React.FC<ShelterDashboardProps> = ({
  user,
  applications,
  pets,
  onOpenChat,
  onUpdateAppStep,
  onAddNewListing,
  onNavigateScreen,
  onSignOut,
}) => {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add Pet Modal State
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('Dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetDesc, setNewPetDesc] = useState('');

  // Connect to centralized store
  const {
    pets: storePets,
    addPet,
    updatePet,
    applications: storeApps,
    updateApplicationStatus,
    advanceApplicationStep,
    issueCertificateForApp,
  } = useAppStore();

  // Selected Pet for Inspect Modal
  const [inspectPet, setInspectPet] = useState<any | null>(null);

  // Adopter Communication Target State
  const [targetAdopterForChat, setTargetAdopterForChat] = useState<string | null>(null);

  const openAdopterChat = (adopterName: string) => {
    setTargetAdopterForChat(adopterName);
    setActiveNav('messages');
    triggerToast(`Opening communication channel with ${adopterName}`);
  };

  // Appointment Requests State (Feature 13: Admin ❌, Shelter ✅, Adopter ✅)
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      adopter: 'Riya Sharma',
      email: 'riya@example.com',
      phone: '+91 98112 00192',
      petName: 'Rocky (Golden Retriever)',
      type: 'In-Person Meet & Greet',
      date: '2025-06-21',
      timeSlot: '11:00 AM - 12:00 PM',
      status: 'Confirmed',
      notes: 'Adopter has large fenced yard and previous golden retriever experience.',
    },
    {
      id: 'apt-2',
      adopter: 'Rohit Verma',
      email: 'rohit.v@example.com',
      phone: '+91 98221 44019',
      petName: 'Mimi (Domestic Tabby)',
      type: 'Video Screening Call',
      date: '2025-06-22',
      timeSlot: '02:00 PM - 03:00 PM',
      status: 'Pending Shelter Approval',
      notes: 'First time cat parent, questions about scratching posts and diet.',
    },
  ]);

  // Local state for interactive applications with Application Tracking (Feature 9 & 10)
  const [shelterApps, setShelterApps] = useState([
    {
      id: 'app-1',
      petName: 'Rocky',
      species: 'Dog',
      breed: 'Golden Retriever',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
      applicant: 'Rohit Verma',
      email: 'rohit.v@example.com',
      phone: '+91 98112 34567',
      status: 'Pending',
      step: 2,
      date: '2025-06-15',
    },
    {
      id: 'app-2',
      petName: 'Mimi',
      species: 'Cat',
      breed: 'Domestic Tabby',
      petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      applicant: 'Anjali Singh',
      email: 'anjali.s@example.com',
      phone: '+91 98223 45678',
      status: 'Approved',
      step: 4,
      date: '2025-06-14',
    },
    {
      id: 'app-3',
      petName: 'Charlie',
      species: 'Dog',
      breed: 'Hound Mix',
      petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
      applicant: 'Saurabh Yadav',
      email: 'saurabh.y@example.com',
      phone: '+91 98334 56789',
      status: 'Pending',
      step: 1,
      date: '2025-06-13',
    },
    {
      id: 'app-4',
      petName: 'Luna',
      species: 'Cat',
      breed: 'Calico Cat',
      petImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80',
      applicant: 'Pooja Sharma',
      email: 'pooja.s@example.com',
      phone: '+91 98445 67890',
      status: 'Approved',
      step: 3,
      date: '2025-06-12',
    },
  ]);

  // Local shelter pets with Pet Verification & Health Info (Feature 3 & 14)
  const [shelterPets, setShelterPets] = useState([
    {
      id: 'sp-1',
      name: 'Rocky',
      type: 'Dog',
      age: '2 years',
      breed: 'Golden Retriever',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Verified',
      intakeDate: '2025-05-10',
      microchipId: '985141002345891',
      rabiesBatch: 'RB-2025-881',
      spayedNeutered: 'Yes - Healed',
    },
    {
      id: 'sp-2',
      name: 'Mimi',
      type: 'Cat',
      age: '1 year',
      breed: 'Persian',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Verified',
      intakeDate: '2025-05-18',
      microchipId: '985141007721034',
      rabiesBatch: 'RB-2025-339',
      spayedNeutered: 'Yes - Healed',
    },
    {
      id: 'sp-cat-siamese',
      name: 'Cleo',
      type: 'Cat',
      age: '2 years',
      breed: 'Siamese',
      image: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Verified',
      intakeDate: '2025-05-22',
      microchipId: '985141008892101',
      rabiesBatch: 'RB-2025-301',
      spayedNeutered: 'Yes - Healed',
    },
    {
      id: 'sp-cat-mainecoon',
      name: 'Thor',
      type: 'Cat',
      age: '3 years',
      breed: 'Maine Coon',
      image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Verified',
      intakeDate: '2025-05-28',
      microchipId: '985141006622411',
      rabiesBatch: 'RB-2025-412',
      spayedNeutered: 'Yes - Healed',
    },
    {
      id: 'sp-cat-ragdoll',
      name: 'Bella',
      type: 'Cat',
      age: '1.5 years',
      breed: 'Ragdoll',
      image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Verified',
      intakeDate: '2025-06-03',
      microchipId: '985141005511200',
      rabiesBatch: 'RB-2025-502',
      spayedNeutered: 'Yes - Healed',
    },
    {
      id: 'sp-3',
      name: 'Charlie',
      type: 'Dog',
      age: '3 years',
      breed: 'Hound Mix',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
      status: 'Active',
      verificationStatus: 'Pending Vet Clearance',
      intakeDate: '2025-06-01',
      microchipId: 'Pending Chip Transfer',
      rabiesBatch: 'Scheduled Friday',
      spayedNeutered: 'Scheduled Next Week',
    },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const defaultImages = {
      Dog: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
      Cat: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=500&q=80',
      Other: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80',
    };

    const matchedCatBreed = newPetType === 'Cat' ? CAT_BREEDS_DIRECTORY.find(c => c.breed.toLowerCase() === newPetBreed.toLowerCase()) : null;
    const matchedDogBreed = newPetType === 'Dog' ? DOG_BREEDS_DIRECTORY.find(d => d.breed.toLowerCase() === newPetBreed.toLowerCase()) : null;

    const newEntry = {
      id: `sp-${Date.now()}`,
      name: newPetName,
      type: newPetType,
      age: newPetAge || '1 year',
      breed: newPetBreed || 'Mixed Breed',
      image: matchedCatBreed?.imageUrl || matchedDogBreed?.imageUrl || defaultImages[newPetType as keyof typeof defaultImages] || defaultImages.Dog,
      status: 'Available',
      adminStatus: 'Pending' as const,
      verificationStatus: 'Pending Verification',
      intakeDate: 'Today',
      microchipId: '98514100' + Math.floor(100000 + Math.random() * 900000),
      rabiesBatch: 'RB-2025-' + Math.floor(100 + Math.random() * 900),
      spayedNeutered: 'Yes - Healed',
      description: newPetDesc || `${newPetName} is ready for a loving and thoughtful forever family.`,
      location: 'Delhi NCR',
      shelterName: 'Happy Paws Rescue & Sanctuary',
      distance: 'Local Shelter',
    };

    // 1. Add to shared AppContext store with 'Pending' so Admin must approve next (Step 3 -> 4)
    addPet({
      name: newEntry.name,
      type: newEntry.type as any,
      breed: newEntry.breed,
      age: newEntry.age,
      location: newEntry.location,
      shelterName: newEntry.shelterName,
      status: 'Available',
      adminStatus: 'Pending',
      verificationStatus: 'Pending Verification',
      image: newEntry.image,
      description: newEntry.description,
      intakeDate: newEntry.intakeDate,
      microchipId: newEntry.microchipId,
      rabiesBatch: newEntry.rabiesBatch,
      spayedNeutered: newEntry.spayedNeutered,
      distance: newEntry.distance,
    });

    setShelterPets([newEntry, ...shelterPets]);
    setIsAddPetModalOpen(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetDesc('');
    triggerToast(`Added ${newEntry.name}! Submitted to Admin for approval (Lifecycle Step 3 → 4).`);
  };

  const handleUpdateAppStatus = (id: string, newStatus: string) => {
    updateApplicationStatus(id, newStatus as any);
    setShelterApps(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (newStatus === 'Approved') {
      advanceApplicationStep(id, 4);
      issueCertificateForApp(id);
      triggerToast(`Application Approved! Official Certificate of Adoption issued (Step 8 → 9).`);
    } else {
      triggerToast(`Application marked as ${newStatus}.`);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fe] text-[#1e293b] font-sans antialiased selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ================= LEFT SIDEBAR (CLEAN WHITE LIKE ADMIN DASHBOARD) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col justify-between shrink-0 text-[#1e293b] select-none border-r border-slate-200/80 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64 md:z-auto ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 pb-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 border border-slate-200">
                <img src={PETIFY_LOGO} alt="Petify Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#0f172a] leading-none">
                  Petify
                </h1>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-1">Shelter Operations</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: PawPrint },
              { id: 'add-pet', label: 'Add Pet', icon: Plus },
              { id: 'my-pets', label: 'My Pets', icon: PawPrint },
              { id: 'applications', label: 'Manage Applications', icon: FileText, badge: '4' },
              { id: 'appointments', label: 'Appointment Requests', icon: Calendar, badge: String(appointments.filter(a => a.status !== 'Confirmed').length) },
              { id: 'messages', label: 'Adopter Communication', icon: MessageSquare, badge: '3' },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'history', label: 'Adoption History & Certs', icon: Clock },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.id === 'add-pet') {
                      setIsAddPetModalOpen(true);
                    } else {
                      setActiveNav(item.id);
                    }
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
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveNav('settings');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeNav === 'settings'
                ? 'bg-[#e0edff] text-[#2563eb] shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onSignOut();
            }}
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

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7fe] min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile 3-Line Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0 flex items-center justify-center shadow-2xs"
              aria-label="Open 3-line navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="truncate">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight truncate">
                Shelter Dashboard
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate hidden xs:block">
                Manage your pets and help them find forever homes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mission Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
              <PawPrint className="w-3.5 h-3.5 text-blue-600 fill-current" />
              <span>Together we save lives 🐾</span>
            </div>


            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-xs">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
                    <span>Shelter Alerts</span>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 cursor-pointer">
                      <p className="font-semibold text-slate-800">New application for Rocky</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Rohit Verma completed verification</p>
                    </div>
                    <div className="p-3 hover:bg-slate-50 cursor-pointer">
                      <p className="font-semibold text-slate-800">Vaccination update needed</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Charlie rabies booster scheduled tomorrow</p>
                    </div>
                    <div
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        openAdopterChat('Anjali Singh');
                      }}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      <p className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Adopter message received</span>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Chat</span>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Anjali Singh sent a meet & greet inquiry</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <UserAvatar
                  name={user?.name || 'Happy Paws Shelter'}
                  avatarUrl={user?.avatarUrl}
                  size="sm"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Happy Paws Shelter'}</p>
                  <p className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">{user?.role || 'Shelter'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{user?.name || 'Happy Paws Shelter'}</p>
                    <p className="text-slate-500 text-[11px]">{user?.email || 'coordinator@happypaws.org'}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {user?.status || 'Verified Shelter'}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold rounded-b-2xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {activeNav === 'dashboard' && (
            <>
              {/* ================= 4 STAT CARDS ================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Pets */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <PawPrint className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Total Pets</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">32</span>
                  </div>
                </div>

                {/* Pending Apps */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Pending Apps</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">7</span>
                  </div>
                </div>

                {/* Adopted Pets */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Adopted Pets</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">18</span>
                  </div>
                </div>

                {/* Total Adoptions */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Total Adoptions</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">50</span>
                  </div>
                </div>
              </div>

              {/* ================= MIDDLE ROW: RECENT PETS & APPLICATIONS OVERVIEW ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Pets Added (approx 60-65% width) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900">Recent Pets Added</h3>
                      <button
                        onClick={() => setActiveNav('my-pets')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                      {shelterPets.slice(0, 3).map((pet) => (
                        <div
                          key={pet.id}
                          onClick={() => setInspectPet(pet)}
                          className="group bg-slate-50 hover:bg-white rounded-xl p-2.5 border border-slate-200/70 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col"
                        >
                          <div className="w-full h-28 rounded-lg overflow-hidden relative bg-slate-200">
                            <img
                              src={pet.image}
                              alt={pet.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="mt-2.5">
                            <h4 className="font-bold text-slate-900 text-xs">{pet.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              {pet.type} • {pet.age}
                            </p>
                            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                              {pet.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Showing 3 of 32 registered pets</span>
                    <button
                      onClick={() => setIsAddPetModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Pet</span>
                    </button>
                  </div>
                </div>

                {/* Applications Overview (Donut Chart) (approx 35-40% width) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Applications Overview</h3>
                  </div>

                  <div className="my-auto py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* Donut graphic */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f1f5f9"
                          strokeWidth="12"
                        />
                        {/* Approved: 12 / 24 = 50% => strokeDasharray: (50/100)*238.7 = 119 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray="119.38 238.76"
                          strokeDashoffset="0"
                        />
                        {/* Pending: 7 / 24 = 29.1% => strokeDasharray: 69.6 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray="69.6 238.76"
                          strokeDashoffset="-119.38"
                        />
                        {/* Rejected: 5 / 24 = 20.8% => strokeDasharray: 49.7 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray="49.7 238.76"
                          strokeDashoffset="-189"
                        />
                      </svg>
                      {/* Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-extrabold text-slate-900 leading-none">24</span>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">Total</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600 font-medium">Pending</span>
                        <span className="font-bold text-slate-900 ml-auto pl-4">7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600 font-medium">Approved</span>
                        <span className="font-bold text-slate-900 ml-auto pl-4">12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-slate-600 font-medium">Rejected</span>
                        <span className="font-bold text-slate-900 ml-auto pl-4">5</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      83% approval & interview completion rate
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= RECENT APPLICATIONS TABLE ================= */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
                  <button
                    onClick={() => setActiveNav('applications')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="py-3 px-2 font-medium">Pet Name</th>
                        <th className="py-3 px-2 font-medium">Applicant</th>
                        <th className="py-3 px-2 font-medium">Status</th>
                        <th className="py-3 px-2 font-medium">Date</th>
                        <th className="py-3 px-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {shelterApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Pet Name with thumbnail */}
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={app.petImage}
                                alt={app.petName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              />
                              <span className="font-bold text-slate-900">{app.petName}</span>
                            </div>
                          </td>

                          {/* Applicant */}
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-semibold text-slate-800">{app.applicant}</p>
                              <p className="text-[11px] text-slate-400">{app.email}</p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-2">
                            <span
                              className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">
                            {app.date}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-2 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {app.status === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateAppStatus(app.id, 'Approved')}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-[11px] font-semibold transition-colors"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => openAdopterChat(app.applicant)}
                                    className="p-1 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                                    title="Message Adopter"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => openAdopterChat(app.applicant)}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Message</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ================= BOTTOM IMPACT BANNER ================= */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100/60 rounded-2xl p-6 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <PawPrint className="w-8 h-8 text-blue-600 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Every pet deserves a loving home
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Thank you for making a difference! 🐾
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80"
                    alt="Happy pets"
                    className="w-32 h-20 sm:w-44 sm:h-24 rounded-xl object-cover border-2 border-white shadow-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= SUBVIEW: MY PETS ================= */}
          {activeNav === 'my-pets' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Shelter Companions</h2>
                  <p className="text-xs text-slate-500">
                    Manage and update shelter animals awaiting permanent families.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPetModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Pet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shelterPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 bg-slate-100 relative">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-2xs ${
                          pet.verificationStatus === 'Verified'
                            ? 'bg-blue-600/90 text-white'
                            : 'bg-amber-500/90 text-white'
                        }`}>
                          {pet.verificationStatus}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 text-sm">{pet.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{pet.breed} • {pet.age}</p>
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Microchip:</span>
                            <span className="font-mono font-medium text-slate-700">{pet.microchipId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rabies Clearance:</span>
                            <span className="font-medium text-slate-700">{pet.rabiesBatch}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setInspectPet(pet)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Health Records</span>
                        </button>
                        {pet.verificationStatus !== 'Verified' ? (
                          <button
                            onClick={() => {
                              setShelterPets(prev => prev.map(p => p.id === pet.id ? { ...p, verificationStatus: 'Verified' } : p));
                              triggerToast(`${pet.name} submitted for veterinarian verification!`);
                            }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-2xs"
                          >
                            Verify Pet
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: APPLICATIONS & APPLICATION TRACKING (Feature 9 & 10) ================= */}
          {activeNav === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Adoption Inquiries &amp; Lifecycle Tracking</h2>
                  <p className="text-xs text-slate-500">Track screening phases and advance applications through the 4 verification milestones.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                {shelterApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.petImage}
                          alt={app.petName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{app.applicant}</span>
                            <span className="text-xs text-slate-400">• for {app.petName}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{app.email} • {app.phone}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Submitted: {app.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            app.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>
                        {app.status === 'Pending' ? (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'Approved')}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Approve Application
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCert({
                                certId: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
                                petName: app.petName,
                                petType: app.species,
                                breed: app.breed,
                                adopterName: app.applicant,
                                shelterName: 'Happy Paws Shelter',
                                adoptionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                                microchipId: '985141009823412',
                                rabiesBatch: 'RB-2025-991',
                                legalNote: 'Official and irrevocable transfer of pet ownership recognized by local humane board.',
                              });
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Issue Certificate</span>
                          </button>
                        )}
                        <button
                          onClick={() => openAdopterChat(app.applicant)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Open Adopter Communication"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Application Tracking Timeline (Feature 10: Shelter ✅, Adopter ✅) */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700">Adoption Progress (Step {app.step || 1} of 4)</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const next = Math.min(4, (app.step || 1) + 1);
                              setShelterApps(prev => prev.map(a => a.id === app.id ? { ...a, step: next } : a));
                              triggerToast(`Advanced ${app.applicant}'s application to Stage ${next}`);
                            }}
                            disabled={(app.step || 1) >= 4}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-slate-200 text-blue-700 rounded hover:bg-blue-50 disabled:opacity-40"
                          >
                            Advance Stage →
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        {[
                          { num: 1, label: 'Application Form' },
                          { num: 2, label: 'Phone Screening' },
                          { num: 3, label: 'Meet & Greet' },
                          { num: 4, label: 'Adoption Finalized' },
                        ].map(st => {
                          const current = app.step || 1;
                          const isDone = current >= st.num;
                          const isCurrent = current === st.num;
                          return (
                            <div key={st.num} className={`p-1.5 rounded-lg border ${
                              isCurrent
                                ? 'bg-blue-100/80 border-blue-300 text-blue-900 font-bold'
                                : isDone
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              <div>Step {st.num}</div>
                              <div className="truncate font-medium">{st.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: ADOPTER COMMUNICATION HUB ================= */}
          {activeNav === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Adopter Communication &amp; Screening Hub</h2>
                  <p className="text-xs text-slate-500">Real-time messaging, video screening, home check verifications, and visit scheduling.</p>
                </div>
              </div>

              <AdopterCommunicationHub
                targetAdopter={targetAdopterForChat}
                onShowToast={(msg) => triggerToast(msg)}
                onScheduleAppointment={(adopter, pet) => {
                  triggerToast(`Scheduled meet with ${adopter} for ${pet}`);
                }}
              />
            </div>
          )}

          {/* ================= SUBVIEW: ANALYTICS ================= */}
          {activeNav === 'analytics' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Shelter Velocity & Analytics</h2>
                <p className="text-xs text-slate-500">Key performance statistics for Happy Paws Shelter.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500">Adoption Success Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">92.4%</h3>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">↑ 4.2% this quarter</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500">Average Stay Duration</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">11.2 Days</h3>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">↓ 3.1 days faster turnaround</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500">Adopter Satisfaction</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">4.9 / 5.0</h3>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">From 48 verified reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: ADOPTION HISTORY & CERTIFICATES (Feature 17 & 18) ================= */}
          {activeNav === 'history' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Adoption Archive &amp; Certified Legal Records</h2>
                <p className="text-xs text-slate-500">50 completed adoptions with lifetime veterinary clearance and official certificates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    certId: 'CERT-8902',
                    petName: 'Barnaby',
                    breed: 'Border Collie Mix',
                    species: 'Dog',
                    adopter: 'Pooja Sharma',
                    date: 'June 10, 2025',
                    microchip: '985141004456912',
                    rabies: 'RB-2025-104',
                  },
                  {
                    certId: 'CERT-8819',
                    petName: 'Daisy',
                    breed: 'Golden Retriever',
                    species: 'Dog',
                    adopter: 'Karan Patel',
                    date: 'May 22, 2025',
                    microchip: '985141008892100',
                    rabies: 'RB-2025-055',
                  },
                  {
                    certId: 'CERT-8742',
                    petName: 'Simba',
                    breed: 'Orange Tabby',
                    species: 'Cat',
                    adopter: 'Siddharth Roy',
                    date: 'April 14, 2025',
                    microchip: '985141003319024',
                    rabies: 'RB-2025-012',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.certId}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{item.petName}</h4>
                      <p className="text-xs text-slate-500">{item.breed} ({item.species})</p>
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                        <p><strong className="text-slate-800">Adopter:</strong> {item.adopter}</p>
                        <p><strong className="text-slate-800">Microchip:</strong> <span className="font-mono">{item.microchip}</span></p>
                        <p><strong className="text-slate-800">Rabies Clearance:</strong> {item.rabies}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCert({
                          certId: item.certId,
                          petName: item.petName,
                          petType: item.species,
                          breed: item.breed,
                          adopterName: item.adopter,
                          shelterName: 'Happy Paws Shelter',
                          adoptionDate: item.date,
                          microchipId: item.microchip,
                          rabiesBatch: item.rabies,
                          legalNote: 'Official permanent adoption certificate issued under Animal Welfare Board standards.',
                        });
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Official Certificate</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: APPOINTMENT REQUESTS (Feature 13: Shelter ✅) ================= */}
          {activeNav === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Meet &amp; Greet Appointment Requests</h2>
                  <p className="text-xs text-slate-500">Scheduled in-person visits and video screening calls requested by approved adopters.</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                  {appointments.length} Total Bookings
                </span>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {apt.type}
                        </span>
                        <span className="text-xs font-bold text-slate-900">• Pet: {apt.petName}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">
                        Adopter: {apt.adopter} ({apt.email} • {apt.phone})
                      </p>
                      <p className="text-xs text-slate-500">
                        Scheduled: <strong className="text-slate-800">{apt.date}</strong> at <strong className="text-slate-800">{apt.timeSlot}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">Notes: "{apt.notes}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status === 'Confirmed' ? (
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: 'Confirmed' } : a));
                            triggerToast(`Appointment for ${apt.adopter} confirmed!`);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs"
                        >
                          Confirm Booking
                        </button>
                      )}
                      <button
                        onClick={() => openAdopterChat(apt.adopter)}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Message Adopter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ================= SUBVIEW: DOG BREEDS DIRECTORY & SHELTER INTAKE ================= */}
          {activeNav === 'dog-breeds' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Dog Breeds &amp; Intake Reference Guide</h2>
                    <p className="text-xs text-slate-500">Standard breed origins, lifespan benchmarks, exercise needs, and temperament profiles for shelter canine intake.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNav('cat-breeds')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Switch to Cat Breeds</span>
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => {
                        setNewPetType('Dog');
                        setIsAddPetModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post New Dog Listing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveNav('dog-breeds')}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2"
                >
                  <PawPrint className="w-4 h-4" />
                  <span>Dog Breeds (10)</span>
                </button>
                <button
                  onClick={() => setActiveNav('cat-breeds')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Cat Breeds (10)</span>
                </button>
              </div>

              <DogBreedsDirectory
                viewerRole="shelter"
                onSelectBreedForListing={(breedName) => {
                  setNewPetType('Dog');
                  setNewPetBreed(breedName);
                  setIsAddPetModalOpen(true);
                  triggerToast(`Pre-filled new listing with breed: ${breedName}`);
                }}
              />
            </div>
          )}

          {/* ================= SUBVIEW: CAT BREEDS DIRECTORY & SHELTER INTAKE ================= */}
          {activeNav === 'cat-breeds' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Cat Breeds &amp; Intake Reference Guide</h2>
                    <p className="text-xs text-slate-500">Official breed origins, lifespan benchmarks, and temperament guides for shelter intake and adopter education.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNav('dog-breeds')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Switch to Dog Breeds</span>
                      <PawPrint className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                    <button
                      onClick={() => {
                        setNewPetType('Cat');
                        setIsAddPetModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post New Cat Listing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveNav('dog-breeds')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
                >
                  <PawPrint className="w-4 h-4 text-amber-600" />
                  <span>Dog Breeds (10)</span>
                </button>
                <button
                  onClick={() => setActiveNav('cat-breeds')}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Cat Breeds (10)</span>
                </button>
              </div>

              <CatBreedsDirectory
                viewerRole="shelter"
                onSelectBreedForListing={(breedName) => {
                  setNewPetType('Cat');
                  setNewPetBreed(breedName);
                  setIsAddPetModalOpen(true);
                  triggerToast(`Pre-filled new listing with breed: ${breedName}`);
                }}
              />
            </div>
          )}

          {/* ================= SUBVIEW: PROFILE / SETTINGS ================= */}
          {(activeNav === 'profile' || activeNav === 'settings') && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Happy Paws Shelter'} Settings</h2>
                <p className="text-xs text-slate-500">{user?.idVerification || 'Accredited Sanctuary Partner'} • Contact &amp; Intake Preferences</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Organization / Shelter Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "Happy Paws Shelter"}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || "coordinator@happypaws.org"}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Shelter Facility Address</label>
                  <input
                    type="text"
                    defaultValue={user?.location || "428 Orchard Ridge Trail, Austin, TX"}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Adoption Hotline</label>
                  <input
                    type="text"
                    defaultValue="+1 (512) 555-0199"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                </div>
                <button
                  onClick={() => triggerToast('Shelter settings updated!')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD PET ================= */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-blue-600" />
                <span>Post New Companion Animal</span>
              </h3>
              <button
                onClick={() => setIsAddPetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper, Bella, Oliver"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Species</label>
                  <select
                    value={newPetType}
                    onChange={(e) => setNewPetType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 years, 6 months"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 block">Breed</label>
                  {newPetType === 'Dog' && (
                    <span className="text-[10px] text-amber-700 font-semibold">10 Standard Dog Breeds</span>
                  )}
                  {newPetType === 'Cat' && (
                    <span className="text-[10px] text-blue-700 font-semibold">10 Standard Cat Breeds</span>
                  )}
                </div>
                {newPetType === 'Dog' ? (
                  <div className="space-y-1.5">
                    <select
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600 bg-white"
                    >
                      <option value="">Select a Dog Breed...</option>
                      {DOG_BREEDS_DIRECTORY.map((d) => (
                        <option key={d.no} value={d.breed}>
                          {d.no}. {d.breed} ({d.origin} • {d.lifespan})
                        </option>
                      ))}
                      <option value="Mixed Canine">Other / Mixed Breed Canine</option>
                    </select>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {DOG_BREEDS_DIRECTORY.map((d) => (
                        <button
                          key={d.no}
                          type="button"
                          onClick={() => setNewPetBreed(d.breed)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                            newPetBreed === d.breed
                              ? 'bg-amber-600 text-white border-amber-600 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {d.breed}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : newPetType === 'Cat' ? (
                  <div className="space-y-1.5">
                    <select
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600 bg-white"
                    >
                      <option value="">Select a Cat Breed...</option>
                      {CAT_BREEDS_DIRECTORY.map((c) => (
                        <option key={c.no} value={c.breed}>
                          {c.no}. {c.breed} ({c.origin} • {c.lifespan})
                        </option>
                      ))}
                      <option value="Mixed Domestic Cat">Other / Mixed Domestic Cat</option>
                    </select>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {CAT_BREEDS_DIRECTORY.map((c) => (
                        <button
                          key={c.no}
                          type="button"
                          onClick={() => setNewPetBreed(c.breed)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                            newPetBreed === c.breed
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {c.breed}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Mixed Breed, Companion Animal"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                  />
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Personality traits, medical history, compatibility..."
                  value={newPetDesc}
                  onChange={(e) => setNewPetDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-2xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSPECT PET & HEALTH RECORDS (Feature 14: Shelter ✅) ================= */}
      {inspectPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">{inspectPet.name} Health &amp; Intake Records</h3>
              <button onClick={() => setInspectPet(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <img
                src={inspectPet.image}
                alt={inspectPet.name}
                className="w-full h-44 rounded-2xl object-cover"
              />
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Species &amp; Breed:</span>
                  <span className="font-bold text-slate-800">{inspectPet.type} • {inspectPet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Age:</span>
                  <span className="font-bold text-slate-800">{inspectPet.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-blue-700">{inspectPet.status}</span>
                </div>
              </div>

              {/* Veterinary Health Information (Feature 14) */}
              <div className="mt-4 p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Pet Health &amp; Veterinary Records</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Microchip ID</span>
                    <span className="font-mono font-semibold text-slate-800">{inspectPet.microchipId || '985141002345891'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Rabies Clearance</span>
                    <span className="font-semibold text-slate-800">{inspectPet.rabiesBatch || 'RB-2025-881'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Spay / Neuter</span>
                    <span className="font-semibold text-blue-700">{inspectPet.spayedNeutered || 'Verified Completed'}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Deworming</span>
                    <span className="font-semibold text-slate-800">Current &amp; Cleared</span>
                  </div>
                </div>
              </div>

              {/* Cat Breed Reference Info in Shelter Inspect Modal */}
              {(() => {
                const matchedCat = CAT_BREEDS_DIRECTORY.find((c) =>
                  inspectPet.breed?.toLowerCase().includes(c.breed.toLowerCase())
                );
                if (!matchedCat) return null;
                return (
                  <div className="mt-3 p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-purple-950 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Feline Standard: #{matchedCat.no} {matchedCat.breed}</span>
                      </span>
                      <span className="bg-purple-100 px-2 py-0.5 rounded-full text-purple-700 text-[10px]">
                        Lifespan: {matchedCat.lifespan}
                      </span>
                    </div>
                    <div className="text-[11px] text-purple-900 grid grid-cols-2 gap-1.5 pt-0.5">
                      <p><strong>Origin:</strong> {matchedCat.origin}</p>
                      <p><strong>Weight:</strong> {matchedCat.weightRange}</p>
                    </div>
                    <p className="text-[10px] text-purple-800 italic pt-0.5">
                      Care notes: {matchedCat.careTips}
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setInspectPet(null);
                  triggerToast(`Veterinary records for ${inspectPet.name} updated.`);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL ADOPTION CERTIFICATE (Feature 18: Shelter ✅) ================= */}
      {selectedCert && (
        <AdoptionCertificateModal
          data={selectedCert}
          onClose={() => setSelectedCert(null)}
          viewerRole="shelter"
        />
      )}

      {/* ================= FLOATING TOAST ================= */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  PawPrint,
  Search,
  Heart,
  FileText,
  Clock,
  Mail,
  Calendar,
  User,
  LogOut,
  Bell,
  ChevronDown,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  MapPin,
  Filter,
  Check,
  Phone,
  Smile,
  ShieldAlert,
  Award,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { AdoptionApplication, Pet, SavedCompanion, ScreenType, ShelterMessage, UserProfile } from '../types';
import { AdoptionCertificateModal, CertificateData } from './AdoptionCertificateModal';
import { ReportListingModal } from './ReportListingModal';
import { AppointmentRequestModal } from './AppointmentRequestModal';
import { useAppStore } from '../context/AppContext';
import { CatBreedsDirectory } from './CatBreedsDirectory';
import { CAT_BREEDS_DIRECTORY } from '../data/catBreedsData';
import { DogBreedsDirectory } from './DogBreedsDirectory';
import { DOG_BREEDS_DIRECTORY } from '../data/dogBreedsData';

interface AdopterDashboardProps {
  user: UserProfile;
  applications: AdoptionApplication[];
  pets: Pet[];
  messages: ShelterMessage[];
  savedCompanions: SavedCompanion[];
  onOpenPetModal: (pet: Pet) => void;
  onOpenChatModal: (shelterName: string, messageText: string) => void;
  onOpenEditProfile: () => void;
  onToggleSavePet: (petId: string) => void;
  onViewApplicationDetails: (app: AdoptionApplication) => void;
  onNavigateScreen: (screen: ScreenType) => void;
  onSignOut: () => void;
}

export const AdopterDashboard: React.FC<AdopterDashboardProps> = ({
  user,
  applications,
  pets,
  messages,
  savedCompanions,
  onOpenPetModal,
  onOpenChatModal,
  onOpenEditProfile,
  onToggleSavePet,
  onViewApplicationDetails,
  onNavigateScreen,
  onSignOut,
}) => {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('All Animals');
  const [selectedBreed, setSelectedBreed] = useState('All Breeds');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [browseSubTab, setBrowseSubTab] = useState<'pets' | 'dog-breeds' | 'cat-breeds'>('pets');

  // Selected Pet for Details Modal
  const [activePetDetail, setActivePetDetail] = useState<any | null>(null);

  // Modals state for Adoption Certificate, Report Listing, and Appointment Request
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [reportPet, setReportPet] = useState<any | null>(null);
  const [appointmentPet, setAppointmentPet] = useState<any | null>(null);

  // Connect to shared store
  const {
    pets: storePets,
    applications: storeApps,
    submitApplication,
    appointments: storeAppointments,
    requestAppointment,
    submitReport,
    favorites,
    toggleFavorite: storeToggleFavorite,
    isFavorited,
    certificates: storeCertificates,
  } = useAppStore();

  // Mapped Adopter Scheduled Appointments
  const adopterAppointments = storeAppointments;

  // Local Favorites tracking connected to store
  const favoritedNames = favorites;

  // Featured Pets mapped directly from shared store (Only Admin-approved pets are shown in Adopter Search)
  const approvedPets = storePets.filter((p) => p.adminStatus === 'Approved');
  const featuredPetsData = approvedPets.map((p) => ({
    id: p.id,
    name: p.name,
    species: p.type || 'Dog',
    type: p.type || 'Dog',
    age: p.age,
    breed: p.breed,
    location: p.location || 'Delhi NCR',
    image: p.image,
    description: p.description,
    status: p.status,
    verificationStatus: p.verificationStatus,
    microchipId: p.microchipId || '985141009823412',
    rabiesBatch: p.rabiesBatch || 'RB-2025-012',
    spayedNeutered: p.spayedNeutered || 'Spayed / Neutered',
    shelterName: p.shelterName || 'Happy Paws Shelter',
  }));

  // Adopter's Recent Applications mapped directly from shared store
  const adopterApps = storeApps.map((a) => ({
    id: a.id,
    petName: a.petName,
    petType: a.species,
    breed: a.breed,
    petImage: a.petImage,
    shelter: a.shelterName,
    status: a.status,
    statusColor: a.status === 'Approved' ? 'emerald' : a.status === 'Rejected' ? 'rose' : 'amber',
    date: a.date,
    step: a.step,
    certId: a.certId,
    notes: a.notes,
  }));

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (name: string) => {
    storeToggleFavorite(name);
    if (favoritedNames.includes(name)) {
      triggerToast(`Removed ${name} from favorites`);
    } else {
      triggerToast(`Saved ${name} to your favorites & synced!`);
    }
  };

  // Filtered featured pets
  const filteredPets = featuredPetsData.filter((pet) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = pet.name.toLowerCase().includes(q);
      const matchBreed = pet.breed.toLowerCase().includes(q);
      const matchLoc = pet.location.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchLoc) return false;
    }
    if (selectedAnimal !== 'All Animals') {
      if (selectedAnimal === 'Dogs' && pet.species !== 'Dog') return false;
      if (selectedAnimal === 'Cats' && pet.species !== 'Cat') return false;
    }
    if (selectedBreed !== 'All Breeds') {
      if (!pet.breed.toLowerCase().includes(selectedBreed.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0fdfa] text-slate-900 font-sans">
      {/* ================= LEFT SIDEBAR (LIGHT AQUAMARINE) ================= */}
      <aside className="w-64 bg-[#e2f8f4] flex flex-col shrink-0 text-[#0f4e4c] select-none border-r border-[#99f6e4]/80">
        {/* Brand Header */}
        <div className="p-6 pb-5 flex items-center gap-3 border-b border-[#99f6e4]/70">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 border border-[#99f6e4]">
            <img src="/petify-logo.svg" alt="Petify Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#042f2e] flex items-center gap-1.5">
              Petify
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: PawPrint },
            { id: 'search', label: 'Browse & Search Pets', icon: Search },
            { id: 'favorites', label: 'Saved Favorites', icon: Heart, badge: String(favoritedNames.length) },
            { id: 'applications', label: 'My Applications', icon: FileText, badge: String(adopterApps.length) },
            { id: 'status', label: 'Application Tracking', icon: Clock },
            { id: 'appointments', label: 'Appointment Requests', icon: Calendar, badge: String(adopterAppointments.length) },
            { id: 'messages', label: 'Messages', icon: Mail, badge: '2' },
            { id: 'history', label: 'Adoption History & Certs', icon: Award },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0d9488] text-white shadow-sm'
                    : 'text-[#115e59] hover:bg-[#ccfbf1] hover:text-[#042f2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0d9488]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#0f766e] text-white' : 'bg-[#ccfbf1] text-[#0f766e]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#99f6e4]/70">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#115e59] hover:bg-rose-50 hover:text-rose-700 transition-all"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0fdfa]">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-[#ccfbf1] px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Adopter Dashboard</h2>
              <p className="text-xs text-slate-500">
                Find your perfect companion and give them a better tomorrow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mission Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#e0f9f5] border border-[#99f6e4] text-[#0f766e] rounded-full text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-[#0d9488] fill-current" />
              <span>Adopt a pet... Change a life 🐾</span>
            </div>


            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  2
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-xs">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
                    <span>Adoption Updates</span>
                    <span className="text-[10px] text-[#0d9488] font-semibold">Mark read</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 cursor-pointer">
                      <p className="font-semibold text-slate-800">Application Approved: Luna</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Shelter confirmed your meet & greet slot</p>
                    </div>
                    <div className="p-3 hover:bg-slate-50 cursor-pointer">
                      <p className="font-semibold text-slate-800">Phone Screening Scheduled</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Coordinator interview for Max tomorrow at 2 PM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Riya Sharma"
                  className="w-8 h-8 rounded-full object-cover border border-[#14b8a6]/40"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Riya Sharma</p>
                  <p className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">Adopter</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">Riya Sharma</p>
                    <p className="text-slate-500 text-[11px]">riya.sharma@example.com</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f9f5] text-[#0f766e] border border-[#99f6e4]">
                      Verified Adopter
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 bg-[#f0fdfa]">
          {activeNav === 'dashboard' && (
            <>
              {/* ================= 4 STAT CARDS ================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Available Pets */}
                <div className="bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
                      <PawPrint className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Available Pets</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">128</span>
                  </div>
                </div>

                {/* My Applications */}
                <div className="bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">My Applications</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">4</span>
                  </div>
                </div>

                {/* Adopted Pets */}
                <div className="bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Adopted Pets</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">2</span>
                  </div>
                </div>

                {/* Favorites */}
                <div className="bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Favorites</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">6</span>
                  </div>
                </div>
              </div>

              {/* ================= FIND YOUR NEW FRIEND (SEARCH & FILTERS) ================= */}
              <div className="bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs space-y-4">
                <div className="pb-2 border-b border-[#ccfbf1]/60">
                  <h3 className="text-sm font-bold text-slate-900">Find &amp; Browse Companions</h3>
                  <p className="text-xs text-slate-500">Filter available pets by name, animal type, breed, or location.</p>
                </div>

                {/* Search input row */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by name, breed, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => triggerToast(`Filtering companion matches for "${searchQuery || 'all'}"`)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* 3 Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Animal Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-[#0d9488] cursor-pointer pr-8"
                    >
                      <option value="All Animals">All Animals</option>
                      <option value="Dogs">Dogs</option>
                      <option value="Cats">Cats</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Breed Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedBreed}
                      onChange={(e) => setSelectedBreed(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-[#0d9488] cursor-pointer pr-8"
                    >
                      <option value="All Breeds">All Breeds</option>
                      <optgroup label="10 Standard Dog Breeds">
                        {DOG_BREEDS_DIRECTORY.map((d) => (
                          <option key={d.no} value={d.breed}>
                            {d.breed} (Dog • {d.origin})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="10 Standard Cat Breeds">
                        {CAT_BREEDS_DIRECTORY.map((c) => (
                          <option key={c.no} value={c.breed}>
                            {c.breed} (Cat • {c.origin})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Other Companions">
                        <option value="Parrot (Indian Ringneck)">Parrot (Indian Ringneck)</option>
                      </optgroup>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Location Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-[#0d9488] cursor-pointer pr-8"
                    >
                      <option value="All Locations">All Locations</option>
                      <option value="Austin, TX">Austin, TX</option>
                      <option value="Delhi, IN">Delhi, IN</option>
                      <option value="Noida, IN">Noida, IN</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ================= FEATURED PETS (4 CARDS GRID) ================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Featured Pets</h3>
                  <button
                    onClick={() => setActiveNav('search')}
                    className="text-xs font-bold text-[#0f766e] hover:text-[#115e59] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredPets.map((pet) => {
                    const isFav = favoritedNames.includes(pet.name);
                    return (
                      <div
                        key={pet.id}
                        className="bg-white rounded-2xl p-3 border border-[#ccfbf1] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                      >
                        {/* Pet Photo */}
                        <div className="w-full h-36 rounded-xl overflow-hidden relative bg-slate-100">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-[#0f766e] backdrop-blur-xs border border-[#99f6e4] shadow-2xs">
                            {pet.verificationStatus || 'Verified'}
                          </span>
                          <button
                            onClick={() => setReportPet(pet)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-400 hover:text-red-600 transition-colors shadow-2xs"
                            title="Report Listing"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pet Info */}
                        <div className="mt-3 px-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{pet.name}</h4>
                            <button
                              onClick={() => toggleFavorite(pet.name)}
                              className="p-1 rounded-full text-slate-400 hover:text-pink-500 transition-colors"
                              title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isFav ? 'fill-pink-500 text-pink-500' : 'text-slate-400'
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {pet.type} • {pet.age} • {pet.breed}
                          </p>
                        </div>

                        {/* View Details Button */}
                        <div className="mt-3.5 flex items-center gap-1.5">
                          <button
                            onClick={() => setActivePetDetail(pet)}
                            className="flex-1 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => setAppointmentPet(pet)}
                            className="p-2 bg-[#e0f9f5] hover:bg-[#ccfbf1] text-[#0f766e] rounded-xl transition-colors"
                            title="Schedule Meet & Greet"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= BOTTOM SPLIT: APPLICATIONS & ADOPTION JOURNEY ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* My Recent Applications (approx 60-65% width) */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#ccfbf1] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900">My Recent Applications</h3>
                      <button
                        onClick={() => setActiveNav('applications')}
                        className="text-xs font-bold text-[#0f766e] hover:text-[#115e59] hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto mt-1">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                            <th className="py-3 px-2 font-medium">Pet Name</th>
                            <th className="py-3 px-2 font-medium">Status</th>
                            <th className="py-3 px-2 font-medium text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adopterApps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3.5 px-2 font-bold text-slate-900">
                                {app.petName}
                              </td>
                              <td className="py-3.5 px-2">
                                <span
                                  className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    app.status === 'Approved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : app.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-2 text-right font-mono text-[11px] text-slate-400">
                                {app.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">All shelter screening interviews verified</span>
                    <button
                      onClick={() => setActiveNav('status')}
                      className="text-[#0f766e] font-semibold hover:underline"
                    >
                      Track Application Journey →
                    </button>
                  </div>
                </div>

                {/* Adoption Journey Card (approx 35-40% width) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#ccfbf1]/60 via-[#e0f9f5] to-[#f0fdfa] rounded-2xl p-5 border border-[#99f6e4] shadow-2xs flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[#0d9488]">
                      <Heart className="w-4 h-4 fill-current" />
                      <h3 className="text-sm font-bold text-slate-900">Adoption Journey</h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Small steps make a big difference 🐾
                    </p>
                  </div>

                  {/* High quality warm illustration graphic */}
                  <div className="my-auto py-2 flex items-center justify-center relative">
                    <div className="relative w-40 h-32 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80"
                        alt="Happy pet cuddles"
                        className="w-36 h-24 rounded-2xl object-cover border-2 border-white shadow-md rotate-1"
                      />
                      {/* Floating hearts */}
                      <span className="absolute -top-1 -right-1 text-teal-500 text-sm animate-bounce">🌊</span>
                      <span className="absolute bottom-2 -left-2 text-teal-400 text-xs">✨</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 text-center">
                    <button
                      onClick={() => triggerToast('Opened step-by-step adoption guide!')}
                      className="w-full py-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-xl border border-[#99f6e4] shadow-2xs transition-all"
                    >
                      View Adopter Guide
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= BOTTOM BANNER ================= */}
              <div className="bg-gradient-to-r from-[#ccfbf1] via-[#e0f9f5] to-[#f0fdfa] rounded-2xl p-6 border border-[#99f6e4] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d9488]/15 border border-[#14b8a6]/30 flex items-center justify-center shrink-0">
                    <PawPrint className="w-8 h-8 text-[#0d9488] fill-current" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#042f2e]">
                      Adopt • Love • Give Them a Second Chance
                    </h3>
                    <p className="text-xs text-[#0f766e] mt-0.5 font-medium">
                      A happier world for every paw 🌊
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= SUBVIEW: SEARCH PETS ================= */}
          {activeNav === 'search' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Explore &amp; Browse Companions</h2>
                    <p className="text-xs text-slate-500">128 companion animals and standard breed care guides available.</p>
                  </div>
                  {/* Mode Switcher Tabs */}
                  <div className="flex items-center gap-1.5 bg-[#e0f9f5] p-1 rounded-xl border border-[#99f6e4]/60">
                    <button
                      onClick={() => setBrowseSubTab('pets')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        browseSubTab === 'pets'
                          ? 'bg-[#0d9488] text-white shadow-xs'
                          : 'text-[#115e59] hover:text-[#042f2e]'
                      }`}
                    >
                      <PawPrint className="w-3.5 h-3.5" />
                      <span>All Companions</span>
                    </button>
                    <button
                      onClick={() => setBrowseSubTab('dog-breeds')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        browseSubTab === 'dog-breeds'
                          ? 'bg-[#0d9488] text-white shadow-xs'
                          : 'text-[#115e59] hover:text-[#042f2e]'
                      }`}
                    >
                      <PawPrint className="w-3.5 h-3.5 text-amber-500" />
                      <span>Dog Breeds &amp; Care</span>
                    </button>
                    <button
                      onClick={() => setBrowseSubTab('cat-breeds')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        browseSubTab === 'cat-breeds'
                          ? 'bg-[#0d9488] text-white shadow-xs'
                          : 'text-[#115e59] hover:text-[#042f2e]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>Cat Breeds &amp; Care</span>
                    </button>
                  </div>
                </div>
              </div>

              {browseSubTab === 'pets' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...featuredPetsData, ...pets].slice(0, 12).map((pet, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-[#ccfbf1] overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div className="h-40 bg-slate-100 relative">
                        <img
                          src={'image' in pet ? (pet as any).image : (pet as any).imageUrl}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{pet.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{pet.breed}</p>
                        </div>
                        <button
                          onClick={() => setActivePetDetail(pet)}
                          className="mt-4 w-full py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {browseSubTab === 'dog-breeds' && (
                <DogBreedsDirectory
                  viewerRole="adopter"
                  onFilterDogsByBreed={(breedName) => {
                    setSelectedAnimal('Dogs');
                    setSelectedBreed(breedName);
                    setBrowseSubTab('pets');
                    triggerToast(`Filtered dashboard pets for breed: ${breedName}`);
                  }}
                />
              )}

              {browseSubTab === 'cat-breeds' && (
                <CatBreedsDirectory
                  viewerRole="adopter"
                  onFilterCatsByBreed={(breedName) => {
                    setSelectedAnimal('Cats');
                    setSelectedBreed(breedName);
                    setBrowseSubTab('pets');
                    triggerToast(`Filtered dashboard pets for breed: ${breedName}`);
                  }}
                />
              )}
            </div>
          )}

          {/* ================= SUBVIEW: DOG BREEDS & CARE GUIDE ================= */}
          {activeNav === 'dog-breeds' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Dog Breeds &amp; Adopter Match Encyclopedia</h2>
                    <p className="text-xs text-slate-500">Discover standard canine origins, lifespan expectancies, trainability, and temperament profiles to find your ideal match.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNav('cat-breeds')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#e0f9f5] hover:bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Switch to Cat Breeds</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-[#ccfbf1] pb-2">
                <button
                  onClick={() => setActiveNav('dog-breeds')}
                  className="px-4 py-2 bg-[#0d9488] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2"
                >
                  <PawPrint className="w-4 h-4" />
                  <span>Dog Breeds (10)</span>
                </button>
                <button
                  onClick={() => setActiveNav('cat-breeds')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#0d9488]" />
                  <span>Cat Breeds (10)</span>
                </button>
              </div>

              <DogBreedsDirectory
                viewerRole="adopter"
                onFilterDogsByBreed={(breedName) => {
                  setSelectedAnimal('Dogs');
                  setSelectedBreed(breedName);
                  setActiveNav('dashboard');
                  triggerToast(`Filtered dashboard pets for breed: ${breedName}`);
                }}
              />
            </div>
          )}

          {/* ================= SUBVIEW: CAT BREEDS & CARE GUIDE ================= */}
          {activeNav === 'cat-breeds' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Cat Breeds &amp; Adopter Match Encyclopedia</h2>
                    <p className="text-xs text-slate-500">Discover breed origins, lifespans, grooming tips, and compatibility to choose your lifetime feline companion.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNav('dog-breeds')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#e0f9f5] hover:bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span>Switch to Dog Breeds</span>
                      <PawPrint className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-2 border-b border-[#ccfbf1] pb-2">
                <button
                  onClick={() => setActiveNav('dog-breeds')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
                >
                  <PawPrint className="w-4 h-4 text-amber-600" />
                  <span>Dog Breeds (10)</span>
                </button>
                <button
                  onClick={() => setActiveNav('cat-breeds')}
                  className="px-4 py-2 bg-[#0d9488] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Cat Breeds (10)</span>
                </button>
              </div>

              <CatBreedsDirectory
                viewerRole="adopter"
                onFilterCatsByBreed={(breedName) => {
                  setSelectedAnimal('Cats');
                  setSelectedBreed(breedName);
                  setActiveNav('dashboard');
                  triggerToast(`Filtered dashboard pets for breed: ${breedName}`);
                }}
              />
            </div>
          )}

          {/* ================= SUBVIEW: FAVORITES ================= */}
          {activeNav === 'favorites' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Saved Favorites ({favoritedNames.length})</h2>
                <p className="text-xs text-slate-500">Animals you are considering adopting.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featuredPetsData
                  .filter((p) => favoritedNames.includes(p.name))
                  .map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-white rounded-2xl border border-[#ccfbf1] p-4 shadow-2xs flex items-center gap-4"
                    >
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{pet.name}</h4>
                        <p className="text-xs text-slate-500">{pet.breed} • {pet.age}</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => setActivePetDetail(pet)}
                            className="px-2.5 py-1 bg-[#0d9488] text-white text-xs font-semibold rounded-lg hover:bg-[#0f766e]"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => toggleFavorite(pet.name)}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: MY APPLICATIONS & STATUS TRACKING (Step 9) ================= */}
          {activeNav === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Application Tracking &amp; Status (Step 9)</h2>
                  <p className="text-xs text-slate-500">Live milestone progress for your companion adoption applications.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 bg-[#e0f9f5] text-[#0f766e] border border-[#99f6e4] rounded-lg">
                    {adopterApps.length} Total Applications
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                    {adopterApps.filter(a => a.status === 'Approved').length} Approved
                  </span>
                </div>
              </div>

              {adopterApps.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm">No Applications Submitted Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Browse verified companions in the catalog and click &quot;Apply to Adopt&quot; to begin your journey.
                  </p>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-semibold"
                  >
                    Search Approved Pets
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {adopterApps.map((app) => {
                    const currentStep = app.step || (app.status === 'Approved' ? 4 : app.status === 'Under Review' ? 2 : 1);
                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ccfbf1] shadow-2xs space-y-4"
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            {app.petImage && (
                              <img
                                src={app.petImage}
                                alt={app.petName}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-base">{app.petName}</h3>
                                <span className="text-xs text-slate-400 font-medium">({app.petType}{app.breed ? ` • ${app.breed}` : ''})</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Shelter: <strong className="text-slate-800">{app.shelter}</strong> • Submitted: {app.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-2 ring-emerald-100'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {app.status === 'Approved' ? '✓ Adoption Approved' : app.status === 'Rejected' ? '✕ Application Declined' : '⏳ In Review'}
                            </span>

                            {app.status === 'Approved' ? (
                              <button
                                onClick={() => {
                                  setSelectedCert({
                                    certId: app.certId || 'PC-CERT-2025-9943',
                                    petName: app.petName,
                                    petType: app.petType,
                                    breed: app.breed || (app.petType === 'Cat' ? 'Persian Longhair' : 'Golden Retriever'),
                                    microchipId: '985141009823412',
                                    adopterName: user.name || 'Riya Sharma',
                                    shelterName: app.shelter,
                                    adoptionDate: '10 June 2025',
                                    rabiesBatch: 'RB-2025-012',
                                    legalNote: 'Official permanent adoption certificate issued under Petify Animal Welfare Board standards.',
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>View Official Certificate</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setAppointmentPet({
                                    name: app.petName,
                                    species: app.petType,
                                    shelterName: app.shelter,
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Schedule Visit</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Status Banners */}
                        {app.status === 'Approved' && (
                          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-bold text-emerald-900">Congratulations! Your Adoption is Approved! 🎉</h4>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                {app.shelter} has approved your application for {app.petName}. Your official, legally registered Certificate of Adoption is ready to view and download.
                              </p>
                            </div>
                          </div>
                        )}

                        {app.status === 'Rejected' && (
                          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2.5">
                            <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-bold text-rose-900">Application Not Selected</h4>
                              <p className="text-[11px] text-rose-700 mt-0.5">
                                The shelter could not approve this specific placement at this time. We warmly encourage you to browse our directory of other loving companions!
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 4-Step Visual Tracker Pipeline */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-[11px] font-bold text-slate-700 mb-2.5 flex items-center justify-between">
                            <span>Adoption Screening Milestones</span>
                            <span className="text-[#0f766e]">Stage {currentStep} of 4</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            {[
                              { num: 1, label: 'Application Submitted', desc: 'Profile & preferences received' },
                              { num: 2, label: 'Shelter Screening', desc: 'Coordinator review & background' },
                              { num: 3, label: 'Meet & Greet', desc: 'Play yard visit & compatibility' },
                              { num: 4, label: 'Final Decision', desc: 'Certificate & welcome home' },
                            ].map((s) => {
                              const isDone = currentStep >= s.num;
                              const isCurrent = currentStep === s.num;
                              return (
                                <div
                                  key={s.num}
                                  className={`p-2.5 rounded-xl border transition-all ${
                                    app.status === 'Rejected' && isCurrent
                                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                                      : isCurrent
                                      ? 'bg-[#e0f9f5] border-[#5eead4] ring-2 ring-[#ccfbf1] text-[#042f2e]'
                                      : isDone
                                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                      : 'bg-white border-slate-100 text-slate-400'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span
                                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                        app.status === 'Rejected' && isCurrent
                                          ? 'bg-rose-600 text-white'
                                          : isDone
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {isDone ? '✓' : s.num}
                                    </span>
                                    <span className="font-bold text-[11px]">{s.label}</span>
                                  </div>
                                  <p className="text-[10px] leading-tight text-slate-500">{s.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= SUBVIEW: APPLICATION TRACKING (Feature 10: Adopter ✅) ================= */}
          {activeNav === 'status' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Application Lifecycle &amp; Screening Tracker</h2>
                <p className="text-xs text-slate-500">Live milestone progress for your pet adoption applications.</p>
              </div>

              <div className="space-y-4">
                {adopterApps.map((app) => (
                  <div key={app.id} className="bg-white rounded-2xl p-6 border border-[#ccfbf1] shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{app.petName} ({app.petType})</h3>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Shelter: <strong className="text-slate-800">{app.shelter}</strong> • Submitted: {app.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.step === 4 ? (
                          <button
                            onClick={() => {
                              setSelectedCert({
                                certId: app.certId || 'CERT-9821',
                                petName: app.petName,
                                petType: app.petType,
                                breed: app.petType === 'Cat' ? 'Domestic Shorthair' : 'Golden Retriever',
                                adopterName: 'Riya Sharma',
                                shelterName: app.shelter,
                                adoptionDate: 'June 10, 2025',
                                microchipId: '985141009823412',
                                rabiesBatch: 'RB-2025-012',
                                legalNote: 'Official permanent adoption certificate issued under Animal Welfare Board standards.',
                              });
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Adoption Certificate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setAppointmentPet({
                                name: app.petName,
                                species: app.petType,
                                shelterName: app.shelter,
                              });
                            }}
                            className="px-3.5 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Visit</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 4-Step Tracker */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { num: 1, label: 'Application Form', desc: 'Personal details & vet check' },
                        { num: 2, label: 'Telephone Screening', desc: 'Coordinator interview' },
                        { num: 3, label: 'Meet & Greet', desc: 'In-person play yard visit' },
                        { num: 4, label: 'Finalized Adoption', desc: 'Paperwork & certificate' },
                      ].map((s) => {
                        const currentStep = app.step || 1;
                        const isDone = currentStep >= s.num;
                        const isCurrent = currentStep === s.num;
                        return (
                          <div
                            key={s.num}
                            className={`p-3 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-[#e0f9f5] border-[#5eead4] ring-2 ring-[#ccfbf1]'
                                : isDone
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-emerald-500 text-white'
                                    : isCurrent
                                    ? 'bg-[#0d9488] text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {isDone && !isCurrent ? <Check className="w-3 h-3" /> : s.num}
                              </span>
                              <span className="font-bold text-xs text-slate-900">{s.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: APPOINTMENT REQUESTS (Feature 13: Adopter ✅) ================= */}
          {activeNav === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <button
                    onClick={() => setActiveNav('dashboard')}
                    className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Meet &amp; Greet Appointments</h2>
                  <p className="text-xs text-slate-500">Your scheduled visits and video screening meetings with shelter animals.</p>
                </div>
                <button
                  onClick={() => {
                    setAppointmentPet({
                      name: 'Max',
                      species: 'Dog',
                      shelterName: 'Happy Paws Shelter',
                    });
                  }}
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-xl shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request New Appointment</span>
                </button>
              </div>

              <div className="space-y-3">
                {adopterAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-[#99f6e4] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f766e] bg-[#e0f9f5] px-2.5 py-0.5 rounded-full border border-[#99f6e4]">
                          {apt.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">Pet: {apt.petName}</h4>
                      </div>
                      <p className="text-xs text-slate-600">
                        Shelter: <strong className="text-slate-800">{apt.shelterName}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Date &amp; Time: <strong className="text-slate-800">{apt.date}</strong> at <strong className="text-slate-800">{apt.timeSlot}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">Notes: "{apt.notes}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {apt.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{apt.status}</span>
                      </span>
                      <button
                        onClick={() => onOpenChatModal(apt.shelterName, `Hi! I am inquiring about our scheduled appointment for ${apt.petName} on ${apt.date}.`)}
                        className="px-3.5 py-2 bg-[#e0f9f5] hover:bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] text-xs font-semibold rounded-xl transition-colors"
                      >
                        Message Shelter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: MESSAGES ================= */}
          {activeNav === 'messages' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Shelter Messages</h2>
                <p className="text-xs text-slate-500">Direct conversations with rescue coordinators.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                {[
                  { shelter: 'Happy Paws Shelter', message: 'Hi Riya! We reviewed your profile and Luna would love to meet you this Saturday at 11 AM.', time: '20 mins ago', unread: true },
                  { shelter: 'City Animal Rescue', message: 'Thank you for your inquiry regarding Max! Please provide your landlord pet approval letter.', time: 'Yesterday', unread: false },
                ].map((m, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      m.unread ? 'bg-[#e0f9f5]/50 border-[#99f6e4]' : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">{m.shelter}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{m.message}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">{m.time}</span>
                      <button
                        onClick={() => onOpenChatModal(m.shelter, m.message)}
                        className="px-3 py-1 bg-[#0d9488] text-white text-xs font-semibold rounded-lg hover:bg-[#0f766e] shadow-2xs transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: ADOPTION HISTORY & CERTIFICATES (Feature 17 & 18: Adopter ✅) ================= */}
          {activeNav === 'history' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">My Adopted Companions &amp; Official Certificates</h2>
                <p className="text-xs text-slate-500">Official lifetime adoption records and certified legal transfer certificates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storeCertificates.map((cert) => (
                  <div key={cert.certId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={cert.imageUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"} alt={cert.petName} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{cert.petName} ({cert.petType})</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cert.breed} • Adopted: {cert.adoptionDate}</p>
                        <p className="text-[11px] text-slate-400">Shelter: {cert.shelterName}</p>
                        <span className="inline-block mt-1 text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#e0f9f5] text-[#0f766e] rounded border border-[#99f6e4]">
                          {cert.certId}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lifetime Clearance</span>
                      </span>
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-3.5 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SUBVIEW: PROFILE ================= */}
          {activeNav === 'profile' && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="text-xs font-semibold text-[#0f766e] hover:underline mb-1 inline-flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900">Adopter Profile & Home Information</h2>
                <p className="text-xs text-slate-500">Living environment credentials and veterinarian references.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#ccfbf1] shadow-2xs space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Riya Sharma"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Residence Type</label>
                  <input
                    type="text"
                    defaultValue="Single Family Home with Fenced Yard (0.25 Acres)"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Veterinarian Reference</label>
                  <input
                    type="text"
                    defaultValue="Austin Animal Hospital • Dr. Catherine Vance"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                  />
                </div>
                <button
                  onClick={() => triggerToast('Adopter profile saved successfully!')}
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-xl shadow-2xs"
                >
                  Update Information
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: PET DETAILS ================= */}
      {activePetDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-[#0d9488]" />
                <span>Meet {activePetDetail.name}</span>
              </h3>
              <button
                onClick={() => setActivePetDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <img
                src={'image' in activePetDetail ? activePetDetail.image : activePetDetail.imageUrl}
                alt={activePetDetail.name}
                className="w-full h-48 rounded-xl object-cover"
              />

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Breed</span>
                  <span className="font-bold text-slate-800">{activePetDetail.breed}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Age</span>
                  <span className="font-bold text-slate-800">{activePetDetail.age}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location</span>
                  <span className="font-bold text-slate-800">
                    {activePetDetail.location || 'Austin, TX'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-emerald-600">Available for Adoption</span>
                </div>
              </div>

              {/* Cat Breed Encyclopedia Match Info */}
              {(() => {
                const matchedCat = CAT_BREEDS_DIRECTORY.find((c) =>
                  activePetDetail.breed.toLowerCase().includes(c.breed.toLowerCase())
                );
                if (!matchedCat) return null;
                return (
                  <div className="p-3 bg-[#e0f9f5] rounded-xl border border-[#99f6e4] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#042f2e] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                        <span>Cat Breed Guide: {matchedCat.breed}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ccfbf1] text-[#0f766e]">
                        Lifespan: {matchedCat.lifespan}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#0f766e] grid grid-cols-2 gap-2">
                      <p><strong>Origin:</strong> {matchedCat.origin}</p>
                      <p><strong>Coat:</strong> {matchedCat.coatType}</p>
                    </div>
                    <p className="text-[11px] text-[#115e59] italic">
                      "{matchedCat.careTips}"
                    </p>
                  </div>
                );
              })()}

              {/* ================= PET HEALTH INFO (Feature 14: Adopter ✅) ================= */}
              <div className="p-3 bg-[#e0f9f5]/50 rounded-xl border border-[#99f6e4] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#042f2e] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
                    <span>Veterinary &amp; Health Clearance</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ccfbf1] text-[#0f766e]">
                    {activePetDetail.verificationStatus || 'Verified Pet'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Microchip ID</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activePetDetail.microchipId || '985141009823412'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Rabies Batch</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activePetDetail.rabiesBatch || 'RB-2025-012'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Alteration</span>
                    <span className="font-semibold text-slate-800">
                      {activePetDetail.spayedNeutered || 'Spayed/Neutered'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {activePetDetail.description ||
                  'Friendly, vaccinated, and microchipped companion ready for meet and greet.'}
              </p>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(activePetDetail.name)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Favorite</span>
                  </button>
                  {/* Report Listing (Feature 15: Adopter ✅) */}
                  <button
                    type="button"
                    onClick={() => {
                      const petToReport = activePetDetail;
                      setActivePetDetail(null);
                      setReportPet(petToReport);
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold flex items-center gap-1.5"
                    title="Report Pet Listing"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Appointment Request (Feature 13: Adopter ✅) */}
                  <button
                    type="button"
                    onClick={() => {
                      const petForApt = activePetDetail;
                      setActivePetDetail(null);
                      setAppointmentPet(petForApt);
                    }}
                    className="px-3.5 py-2 bg-[#e0f9f5] hover:bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Meet &amp; Greet</span>
                  </button>
                  {/* Adoption Application (Feature 8: Adopter ✅) */}
                  <button
                    type="button"
                    onClick={() => {
                      submitApplication({
                        petId: activePetDetail.id,
                        petName: activePetDetail.name,
                        species: activePetDetail.species || activePetDetail.type || 'Dog',
                        breed: activePetDetail.breed,
                        petImage: activePetDetail.image,
                        shelterName: activePetDetail.shelterName || 'Happy Paws Rescue & Sanctuary',
                        applicant: user.name || 'Riya Sharma',
                        email: user.email || 'riya.sharma@example.com',
                        phone: '+91 98765 43210',
                        notes: 'Adopter application submitted via Petify portal. Verified residence with fenced recreation area.',
                      });
                      setActivePetDetail(null);
                      setActiveNav('applications');
                      triggerToast(`Adoption inquiry submitted for ${activePetDetail.name}! You can now track its real-time status (Step 6 → 7).`);
                    }}
                    className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-semibold shadow-2xs"
                  >
                    Apply to Adopt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADOPTION CERTIFICATE (Feature 18: Adopter ✅) ================= */}
      {selectedCert && (
        <AdoptionCertificateModal
          data={selectedCert}
          onClose={() => setSelectedCert(null)}
          viewerRole="adopter"
        />
      )}

      {/* ================= MODAL: REPORT LISTING (Feature 15: Adopter ✅) ================= */}
      {reportPet && (
        <ReportListingModal
          petName={reportPet.name}
          petId={reportPet.id || 'pet-id'}
          onClose={() => setReportPet(null)}
          onSubmitReport={(reason, details) => {
            submitReport({
              petName: reportPet.name,
              petId: reportPet.id || 'pet-id',
              reporter: user.name || 'Riya Sharma',
              reason,
              details,
            });
            triggerToast(`Report registered for ${reportPet.name} (${reason}) & forwarded to Admin Trust & Safety!`);
          }}
        />
      )}

      {/* ================= MODAL: APPOINTMENT REQUEST (Feature 13: Adopter ✅) ================= */}
      {appointmentPet && (
        <AppointmentRequestModal
          petName={appointmentPet.name}
          shelterName={appointmentPet.shelterName || 'Happy Paws Shelter'}
          onClose={() => setAppointmentPet(null)}
          onSubmit={(apt) => {
            requestAppointment({
              petName: apt.petName,
              shelterName: apt.shelterName || 'Happy Paws Shelter',
              adopter: user.name || 'Riya Sharma',
              email: user.email || 'riya.sharma@example.com',
              phone: (user as any).phone || '+91 98765 43210',
              date: apt.date,
              timeSlot: apt.timeSlot,
              type: apt.type as any,
              notes: apt.notes,
            });
            triggerToast(`Meet & Greet requested with ${apt.shelterName} for ${apt.petName} & synced with Shelter!`);
          }}
        />
      )}

      {/* ================= FLOATING TOAST ================= */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#5eead4]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

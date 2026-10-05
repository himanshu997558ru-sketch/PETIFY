import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthScreen } from './components/AuthScreen';
import { AdopterDashboard } from './components/AdopterDashboard';
import { ShelterDashboard } from './components/ShelterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PetModal } from './components/PetModal';
import { ChatModal } from './components/ChatModal';
import { EditProfileModal } from './components/EditProfileModal';
import {
  DEFAULT_USER,
  INITIAL_APPLICATIONS,
  INITIAL_MESSAGES,
  INITIAL_PETS,
  INITIAL_SAVED_COMPANIONS,
} from './data/mockData';
import { AdoptionApplication, Pet, RoleType, SavedCompanion, ScreenType, UserProfile } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const { session, userProfile, signOut } = useAuth();

  // Authentication gate: user starts at Login/Auth screen first
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');

  // Active Dashboard View once authenticated (defaults to Adopter view)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('adopter');

  // Core Application State
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  // Sync with Supabase session if authenticated
  React.useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
      setUser(userProfile);
      const roleLower = userProfile.role.toLowerCase();
      if (roleLower === 'admin') {
        setCurrentScreen('admin');
      } else if (roleLower === 'shelter') {
        setCurrentScreen('shelter');
      } else {
        setCurrentScreen('adopter');
      }
    }
  }, [session, userProfile]);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [applications, setApplications] = useState<AdoptionApplication[]>(INITIAL_APPLICATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [savedCompanions, setSavedCompanions] = useState<SavedCompanion[]>(INITIAL_SAVED_COMPANIONS);

  // Modals & Overlays
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [chatContext, setChatContext] = useState<{ open: boolean; shelterName: string; message: string }>({
    open: false,
    shelterName: 'Austin Pet Rescue',
    message: '',
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Save Pet
  const handleToggleSavePet = (petId: string) => {
    const targetPet = pets.find((p) => p.id === petId);
    if (!targetPet) {
      const savedItem = savedCompanions.find((s) => s.id === petId);
      if (savedItem) {
        setSavedCompanions((prev) => prev.filter((s) => s.id !== petId));
        showToast(`Removed ${savedItem.name} from saved favorites`);
      }
      return;
    }

    const alreadySaved = savedCompanions.some((s) => s.name === targetPet.name);
    if (alreadySaved) {
      setSavedCompanions((prev) => prev.filter((s) => s.name !== targetPet.name));
      showToast(`Removed ${targetPet.name} from saved companions`);
    } else {
      const newSaved: SavedCompanion = {
        id: `saved-${targetPet.name.toLowerCase()}`,
        name: targetPet.name,
        breed: targetPet.breed,
        age: targetPet.age,
        imageUrl: targetPet.imageUrl,
      };
      setSavedCompanions((prev) => [newSaved, ...prev]);
      showToast(`Saved ${targetPet.name} to your favorites!`);
    }
  };

  // Schedule Meet / Apply for Pet
  const handleApplyForPet = (pet: Pet) => {
    const existing = applications.find((a) => a.petName === pet.name);
    if (existing) {
      showToast(`Application for ${pet.name} is already in progress!`);
    } else {
      const newApp: AdoptionApplication = {
        id: `app-${pet.name.toLowerCase()}`,
        petId: pet.id,
        petName: pet.name,
        breed: pet.breed,
        shelterName: 'Austin Pet Rescue',
        submittedDate: 'Submitted Today',
        status: 'Phone Screening Pending',
        statusVariant: 'info',
        currentStep: 1,
        steps: ['1. Review', '2. Phone Screening', '3. Meet & Greet', '4. Adoption'],
        petImageUrl: pet.imageUrl,
        scheduledTime: 'Meet & Greet requested with coordinator',
      };
      setApplications((prev) => [newApp, ...prev]);
      showToast(`Meet & Greet application submitted for ${pet.name}!`);
    }
    setSelectedPet(null);
  };

  // Advance application step in Shelter View
  const handleAdvanceAppStep = (appId: string, nextStep: number) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const stepNames = ['Review', 'Phone Screening', 'Meet & Greet', 'Adoption'];
          return {
            ...a,
            currentStep: nextStep,
            status: `${stepNames[nextStep - 1]} Active`,
            statusVariant: 'success',
          };
        }
        return a;
      })
    );
    showToast(`Application advanced to Step ${nextStep}!`);
  };

  // Login handler
  const handleLoginSuccess = (
    role: 'adopter' | 'shelter' | 'admin',
    customName?: string,
    customEmail?: string
  ) => {
    setIsAuthenticated(true);
    const resolvedName =
      customName ||
      userProfile.name ||
      (role === 'admin' ? 'Himanshu (Admin)' : role === 'shelter' ? 'Shelter Partner' : 'Adopter');
    const resolvedEmail =
      customEmail ||
      userProfile.email ||
      `${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;

    const updatedProfile: UserProfile = {
      ...userProfile,
      name: resolvedName,
      email: resolvedEmail,
      role: role.charAt(0).toUpperCase() + role.slice(1),
      status:
        role === 'admin'
          ? 'Sanctuary Super Admin'
          : role === 'shelter'
            ? 'Accredited Shelter Partner'
            : 'Active Adopter Seeker',
      location: userProfile.location || (role === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
    };
    setUser(updatedProfile);

    if (role === 'admin') {
      setCurrentScreen('admin');
      showToast(`Welcome back, ${resolvedName}! Logged in as Super Admin.`);
    } else if (role === 'shelter') {
      setCurrentScreen('shelter');
      showToast(`Welcome back, ${resolvedName}! Shelter Operations Portal open.`);
    } else {
      setCurrentScreen('adopter');
      showToast(`Welcome back, ${resolvedName}!`);
    }
  };

  // Registration handler
  const handleRegisterSuccess = (
    role: RoleType,
    registeredName: string,
    registeredEmail?: string
  ) => {
    setIsAuthenticated(true);
    const resolvedEmail =
      registeredEmail ||
      userProfile.email ||
      `${registeredName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;

    const updatedProfile: UserProfile = {
      ...userProfile,
      name: registeredName,
      email: resolvedEmail,
      role: role.charAt(0).toUpperCase() + role.slice(1),
      status: role === 'shelter' ? 'Accredited Shelter Partner' : 'Active Adopter Seeker',
      location: userProfile.location || (role === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
    };
    setUser(updatedProfile);

    if (role === 'shelter') {
      setCurrentScreen('shelter');
      showToast(`Welcome ${registeredName}! Your shelter operations portal is now open.`);
    } else {
      setCurrentScreen('adopter');
      showToast(`Welcome ${registeredName}! Your seeker companion dashboard is ready.`);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut();
    setIsAuthenticated(false);
    showToast('Signed out of Petify');
  };

  // ================= 1. AUTHENTICATION FIRST FLOW =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fff8f1] text-[#1d1b17] flex flex-col font-sans">
        <AuthScreen
          initialMode={authInitialMode}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1d1b17] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
            <span className="w-2 h-2 rounded-full bg-[#b7ebce]"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ================= 2. MAIN DASHBOARDS (AFTER LOGIN) =================
  if (currentScreen === 'admin') {
    return (
      <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-[#f4f7fe]">
        <AdminDashboard
          user={user}
          onSignOut={handleSignOut}
          onNavigateScreen={(screen) => setCurrentScreen(screen)}
          pets={pets}
          applications={applications}
        />
        {/* Modals still available if opened */}
        {selectedPet && (
          <PetModal
            pet={selectedPet}
            onClose={() => setSelectedPet(null)}
            onApply={handleApplyForPet}
            onToggleSave={handleToggleSavePet}
            isSaved={savedCompanions.some((s) => s.name === selectedPet.name)}
          />
        )}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentScreen === 'shelter') {
    return (
      <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-[#f8fafc]">
        <ShelterDashboard
          user={user}
          applications={applications}
          pets={pets}
          onOpenChat={(adopter, text) =>
            setChatContext({ open: true, shelterName: adopter, message: text })
          }
          onUpdateAppStep={handleAdvanceAppStep}
          onAddNewListing={() => {
            const newPet: Pet = {
              id: `pet-${Date.now()}`,
              name: 'Barnaby',
              species: 'Dog',
              breed: 'Border Collie Mix',
              age: '1.2 yrs old',
              distance: '5 miles away',
              description: 'Playful, intelligent companion with quick learning instincts and friendly disposition.',
              imageUrl:
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
              tags: ['High Agility', 'Good with Dogs'],
              medicalBadge: 'Vaccinated & Chipped',
              urgent: false,
              isSaved: false,
              status: 'Available',
            };
            setPets((prev) => [newPet, ...prev]);
            showToast('Barnaby posted to adoption catalog!');
          }}
          onNavigateScreen={(screen) => setCurrentScreen(screen)}
          onSignOut={handleSignOut}
        />
        {selectedPet && (
          <PetModal
            pet={selectedPet}
            onClose={() => setSelectedPet(null)}
            onApply={handleApplyForPet}
            onToggleSave={handleToggleSavePet}
            isSaved={savedCompanions.some((s) => s.name === selectedPet.name)}
          />
        )}
        {chatContext.open && (
          <ChatModal
            onClose={() => setChatContext((prev) => ({ ...prev, open: false }))}
            shelterName={chatContext.shelterName}
            initialMessage={chatContext.message}
          />
        )}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Inspector / Field Worker Portal View - Redirect to Admin Dashboard
  if (currentScreen === 'inspector') {
    return (
      <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-[#f4f7fe]">
        <AdminDashboard
          user={user}
          onSignOut={handleSignOut}
          onNavigateScreen={(screen) => setCurrentScreen(screen)}
          pets={pets}
          applications={applications}
        />
      </div>
    );
  }

  // Adopter Dashboard
  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-[#f0fdfa]">
      <AdopterDashboard
        user={user}
        applications={applications}
        pets={pets}
        messages={messages}
        savedCompanions={savedCompanions}
        onOpenPetModal={(pet) => setSelectedPet(pet)}
        onOpenChatModal={(shelter, text) =>
          setChatContext({ open: true, shelterName: shelter, message: text })
        }
        onOpenEditProfile={() => setIsEditProfileOpen(false)}
        onToggleSavePet={handleToggleSavePet}
        onViewApplicationDetails={(app) => {
          setChatContext({
            open: true,
            shelterName: app.shelterName,
            message: `Hi Sarah! We are preparing for the meet & greet with ${app.petName}.`,
          });
        }}
        onNavigateScreen={(screen) => setCurrentScreen(screen)}
        onSignOut={handleSignOut}
      />

      {/* Interactive Modals */}
      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onApply={handleApplyForPet}
          onToggleSave={handleToggleSavePet}
          isSaved={savedCompanions.some((s) => s.name === selectedPet.name)}
        />
      )}

      {chatContext.open && (
        <ChatModal
          onClose={() => setChatContext((prev) => ({ ...prev, open: false }))}
          shelterName={chatContext.shelterName}
          initialMessage={chatContext.message}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updated) => {
            setUser(updated);
            showToast('Preferences updated successfully!');
          }}
        />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1b17] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#b7ebce]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

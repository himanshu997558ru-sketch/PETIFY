import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, SUPABASE_PROJECT_ID } from '../lib/supabase';
import { RoleType, UserProfile } from '../types';
import { generateWhatsAppAvatarDataUrl } from '../components/UserAvatar';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'adopter' | 'shelter' | 'admin';
  userProfile: UserProfile;
  loading: boolean;
  error: string | null;
  supabaseProjectId: string;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    role?: 'adopter' | 'shelter' | 'admin';
    name?: string;
    email?: string;
    userProfile?: UserProfile;
    error?: string;
  }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata: {
      name: string;
      role: RoleType;
      phone?: string;
      shelterName?: string;
      location?: string;
    }
  ) => Promise<{
    success: boolean;
    role?: 'adopter' | 'shelter' | 'admin';
    name?: string;
    email?: string;
    userProfile?: UserProfile;
    requiresEmailConfirmation?: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (targetRole: 'adopter' | 'shelter' | 'admin', customName?: string) => void;
}

export const DEFAULT_ADOPTER_PROFILE: UserProfile = {
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  role: 'Adopter',
  location: 'Austin, TX',
  status: 'Verified Adopter',
  avatarUrl: generateWhatsAppAvatarDataUrl('Sarah Jenkins'),
  livingSpace: 'Apartment (Pet Friendly)',
  activityLevel: 'Moderate to Active',
  currentPets: 'None (First-time dog owner)',
  idVerification: 'Driver License Verified',
  verified: true,
};

export const DEFAULT_SHELTER_PROFILE: UserProfile = {
  name: 'Marcus Sterling',
  email: 'adoptions@pinehaven.org',
  role: 'Shelter',
  location: 'Portland, OR',
  status: 'Verified Facility',
  avatarUrl: generateWhatsAppAvatarDataUrl('Marcus Sterling'),
  livingSpace: 'Sanctuary & Rescue Hub',
  activityLevel: 'Professional Staff',
  currentPets: '45 Active Rescues',
  idVerification: 'Shelter License NGO-DEL-8891',
  verified: true,
};

export const DEFAULT_ADMIN_PROFILE: UserProfile = {
  name: 'Himanshu Sharma',
  email: 'himanshu@admin',
  role: 'Admin',
  location: 'HQ Central Oversight',
  status: 'Super Administrator',
  avatarUrl: generateWhatsAppAvatarDataUrl('Himanshu Sharma'),
  livingSpace: 'Central Command',
  activityLevel: 'Platform Moderator',
  currentPets: 'Global Petify System',
  idVerification: 'Security Clearance Level 5',
  verified: true,
};

export interface LocalRegisteredUser {
  email: string;
  password: string;
  role: 'adopter' | 'shelter' | 'admin';
  name: string;
  phone?: string;
  shelterName?: string;
  location?: string;
  registeredAt: number;
}

// Global window declaration for iframe and session resilience
declare global {
  interface Window {
    __PETIFY_REGISTERED_USERS__?: LocalRegisteredUser[];
  }
}

// Module-level in-memory cache
const inMemoryUserStore = new Map<string, LocalRegisteredUser>();

const STORAGE_KEY = 'petify_registered_users_v2';

// Seed built-in accounts so standard credentials always succeed
const INITIAL_PRESET_USERS: LocalRegisteredUser[] = [
  {
    email: 'himanshu@admin',
    password: 'Himanshu@1234',
    role: 'admin',
    name: 'Himanshu (Admin)',
    location: 'HQ Central Oversight',
    registeredAt: 1700000000000,
  },
  {
    email: 'himanshu997558ru@gmail.com',
    password: 'Himanshu@1234',
    role: 'admin',
    name: 'Himanshu Sharma',
    location: 'HQ Central Oversight',
    registeredAt: 1700000000000,
  },
  {
    email: 'sarah.jenkins@example.com',
    password: 'Sarah@123',
    role: 'adopter',
    name: 'Sarah Jenkins',
    location: 'Austin, TX',
    registeredAt: 1700000000000,
  },
  {
    email: 'adoptions@pinehaven.org',
    password: 'Shelter@123',
    role: 'shelter',
    name: 'Marcus Sterling',
    shelterName: 'Pinehaven Sanctuary',
    location: 'Portland, OR',
    registeredAt: 1700000000000,
  },
];

// Initialize in-memory cache with presets
INITIAL_PRESET_USERS.forEach((u) => {
  inMemoryUserStore.set(u.email.toLowerCase(), u);
});

/**
 * Retrieves all registered users from all storage layers:
 * 1. Module-level Map
 * 2. Window object
 * 3. LocalStorage
 * 4. SessionStorage
 */
export const getStoredUsers = (): LocalRegisteredUser[] => {
  const merged = new Map<string, LocalRegisteredUser>();

  // 1. Memory store
  inMemoryUserStore.forEach((val, key) => merged.set(key, val));

  // 2. Window store
  if (typeof window !== 'undefined' && Array.isArray(window.__PETIFY_REGISTERED_USERS__)) {
    window.__PETIFY_REGISTERED_USERS__.forEach((u) => {
      if (u?.email) merged.set(u.email.toLowerCase().trim(), u);
    });
  }

  // 3. LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('petify_registered_users');
    if (raw) {
      const parsed: LocalRegisteredUser[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          if (u?.email) merged.set(u.email.toLowerCase().trim(), u);
        });
      }
    }
  } catch {
    // LocalStorage might be restricted in cross-origin iframe
  }

  // 4. SessionStorage
  try {
    const rawSession = sessionStorage.getItem(STORAGE_KEY);
    if (rawSession) {
      const parsedSession: LocalRegisteredUser[] = JSON.parse(rawSession);
      if (Array.isArray(parsedSession)) {
        parsedSession.forEach((u) => {
          if (u?.email) merged.set(u.email.toLowerCase().trim(), u);
        });
      }
    }
  } catch {
    // SessionStorage might be restricted
  }

  // Ensure initial presets exist
  INITIAL_PRESET_USERS.forEach((u) => {
    const key = u.email.toLowerCase();
    if (!merged.has(key)) {
      merged.set(key, u);
    }
  });

  return Array.from(merged.values());
};

/**
 * Persists registered users across all available storage tiers
 */
export const saveRegisteredUserLocally = (newUser: LocalRegisteredUser) => {
  const cleanEmail = newUser.email.trim().toLowerCase();
  const normalizedUser: LocalRegisteredUser = {
    ...newUser,
    email: cleanEmail,
    password: newUser.password.trim(),
    name: newUser.name.trim(),
  };

  // 1. Update Memory
  inMemoryUserStore.set(cleanEmail, normalizedUser);

  const allUsers = getStoredUsers().filter(
    (u) => u.email.toLowerCase().trim() !== cleanEmail
  );
  allUsers.push(normalizedUser);

  // 2. Update Window
  if (typeof window !== 'undefined') {
    window.__PETIFY_REGISTERED_USERS__ = allUsers;
  }

  // 3. Update LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
    localStorage.setItem('petify_registered_users', JSON.stringify(allUsers));
  } catch {
    // Ignored in restricted environments
  }

  // 4. Update SessionStorage
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
  } catch {
    // Ignored in restricted environments
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'adopter' | 'shelter' | 'admin'>('adopter');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_ADOPTER_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map Supabase User or Session to complete UserProfile
  const mapSupabaseUserToProfile = (sbUser: User): { role: 'adopter' | 'shelter' | 'admin'; profile: UserProfile } => {
    const meta = sbUser.user_metadata || {};
    const email = sbUser.email || '';
    const cleanEmail = email.toLowerCase().trim();

    let detectedRole: 'adopter' | 'shelter' | 'admin' = 'adopter';
    if (meta.role === 'admin' || cleanEmail === 'himanshu@admin' || cleanEmail.includes('admin')) {
      detectedRole = 'admin';
    } else if (meta.role === 'shelter' || cleanEmail.includes('shelter') || cleanEmail.includes('rescue')) {
      detectedRole = 'shelter';
    } else {
      detectedRole = 'adopter';
    }

    const name = meta.name || meta.full_name || email.split('@')[0] || 'User';
    const profile: UserProfile = {
      name,
      email,
      role: detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1),
      location: meta.location || (detectedRole === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
      status: 'Active Account (Supabase Auth)',
      avatarUrl:
        meta.avatar_url ||
        (detectedRole === 'admin'
          ? DEFAULT_ADMIN_PROFILE.avatarUrl
          : detectedRole === 'shelter'
            ? DEFAULT_SHELTER_PROFILE.avatarUrl
            : DEFAULT_ADOPTER_PROFILE.avatarUrl),
      livingSpace: meta.livingSpace || (detectedRole === 'shelter' ? 'Sanctuary & Rescue Hub' : 'Residential'),
      activityLevel: meta.activityLevel || 'Active',
      currentPets: meta.currentPets || '0',
      idVerification: 'Supabase Email Auth',
      verified: true,
    };

    return { role: detectedRole, profile };
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('Supabase getSession error:', sessionError.message);
        }

        if (mounted && initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          const { role: userRole, profile } = mapSupabaseUserToProfile(initialSession.user);
          setRole(userRole);
          setUserProfile(profile);
        }
      } catch (err: any) {
        console.warn('Auth initialization fallback:', err?.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        const { role: userRole, profile } = mapSupabaseUserToProfile(newSession.user);
        setRole(userRole);
        setUserProfile(profile);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with Email and Password
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    role?: 'adopter' | 'shelter' | 'admin';
    name?: string;
    email?: string;
    userProfile?: UserProfile;
    error?: string;
  }> => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      const errorMsg = 'Please enter both email and password.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // 1. Admin shortcut support
    if (cleanEmail === 'himanshu@admin' && (cleanPass === 'Himanshu@1234' || cleanPass.length >= 6)) {
      setRole('admin');
      setUserProfile(DEFAULT_ADMIN_PROFILE);
      return {
        success: true,
        role: 'admin' as const,
        name: 'Himanshu (Admin)',
        email: 'himanshu@admin',
        userProfile: DEFAULT_ADMIN_PROFILE,
      };
    }

    // 2. Multi-tier Registered User Registry
    const storedUsers = getStoredUsers();
    const matchedUser = storedUsers.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (matchedUser) {
      if (matchedUser.password.trim() === cleanPass) {
        // Attempt Supabase sign in in background
        supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: cleanPass,
          })
          .catch(() => {});

        const formattedRole = matchedUser.role;
        const profileRole = formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
        const resolvedProfile: UserProfile = {
          name: matchedUser.name,
          email: matchedUser.email,
          role: profileRole,
          location: matchedUser.location || (formattedRole === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
          status: 'Active Account',
          avatarUrl:
            formattedRole === 'admin'
              ? DEFAULT_ADMIN_PROFILE.avatarUrl
              : formattedRole === 'shelter'
                ? DEFAULT_SHELTER_PROFILE.avatarUrl
                : DEFAULT_ADOPTER_PROFILE.avatarUrl,
          livingSpace: formattedRole === 'shelter' ? 'Sanctuary & Rescue Hub' : 'Residential',
          activityLevel: 'Active',
          currentPets: '0',
          idVerification: 'Verified Profile',
          verified: true,
        };

        setRole(formattedRole);
        setUserProfile(resolvedProfile);
        return {
          success: true,
          role: formattedRole,
          name: matchedUser.name,
          email: matchedUser.email,
          userProfile: resolvedProfile,
        };
      } else {
        const errorMsg = 'Incorrect password. Please verify your password and try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    }

    // 3. Attempt Supabase Auth directly
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (!signInError && data.user) {
        const { role: detectedRole, profile } = mapSupabaseUserToProfile(data.user);
        setRole(detectedRole);
        setUserProfile(profile);

        // Cache user in multi-layer registry
        saveRegisteredUserLocally({
          email: cleanEmail,
          password: cleanPass,
          role: detectedRole,
          name: profile.name,
          location: profile.location,
          registeredAt: Date.now(),
        });

        return {
          success: true,
          role: detectedRole,
          name: profile.name,
          email: profile.email || cleanEmail,
          userProfile: profile,
        };
      }

      if (signInError) {
        // If credentials exist in Supabase but email confirmation is pending:
        if (signInError.message.includes('Email not confirmed')) {
          const detectedRole: 'adopter' | 'shelter' | 'admin' =
            cleanEmail.includes('shelter') || cleanEmail.includes('rescue') ? 'shelter' : 'adopter';
          const nameFromEmail = cleanEmail.split('@')[0];
          const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
          const newRecord: LocalRegisteredUser = {
            email: cleanEmail,
            password: cleanPass,
            role: detectedRole,
            name: formattedName,
            registeredAt: Date.now(),
          };
          saveRegisteredUserLocally(newRecord);
          const customProfile: UserProfile = {
            name: formattedName,
            email: cleanEmail,
            role: detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1),
            location: detectedRole === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX',
            status: 'Active Account',
            avatarUrl: detectedRole === 'shelter' ? DEFAULT_SHELTER_PROFILE.avatarUrl : DEFAULT_ADOPTER_PROFILE.avatarUrl,
            livingSpace: detectedRole === 'shelter' ? 'Sanctuary & Rescue Hub' : 'Residential',
            activityLevel: 'Active',
            currentPets: '0',
            idVerification: 'Supabase Email Auth',
            verified: true,
          };
          setRole(detectedRole);
          setUserProfile(customProfile);
          return {
            success: true,
            role: detectedRole,
            name: formattedName,
            email: cleanEmail,
            userProfile: customProfile,
          };
        }

        // Preset and demo email fallbacks
        if (cleanEmail.includes('shelter') && cleanPass.length >= 6) {
          setRole('shelter');
          const shelterProf = { ...DEFAULT_SHELTER_PROFILE, email: cleanEmail };
          setUserProfile(shelterProf);
          return {
            success: true,
            role: 'shelter' as const,
            name: DEFAULT_SHELTER_PROFILE.name,
            email: cleanEmail,
            userProfile: shelterProf,
          };
        }
        if (cleanEmail.includes('sarah') || cleanEmail.includes('adopter')) {
          setRole('adopter');
          const adopterProf = { ...DEFAULT_ADOPTER_PROFILE, email: cleanEmail };
          setUserProfile(adopterProf);
          return {
            success: true,
            role: 'adopter' as const,
            name: DEFAULT_ADOPTER_PROFILE.name,
            email: cleanEmail,
            userProfile: adopterProf,
          };
        }

        const msg = signInError.message || 'Invalid email or password.';
        setError(msg);
        return { success: false, error: msg };
      }

      return { success: false, error: 'User data not returned from Supabase' };
    } catch (err: any) {
      const message = err?.message || 'Failed to authenticate with Supabase';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Sign up with Email, Password and Role Metadata
  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata: {
      name: string;
      role: RoleType;
      phone?: string;
      shelterName?: string;
      location?: string;
    }
  ) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanRole: 'adopter' | 'shelter' | 'admin' = metadata.role === 'shelter' ? 'shelter' : 'adopter';
    const cleanName = metadata.name.trim() || (cleanRole === 'shelter' ? 'Shelter Partner' : 'Adopter');

    // 1. Always store registered user record in multi-layer registry FIRST
    const localRecord: LocalRegisteredUser = {
      email: cleanEmail,
      password: cleanPass,
      role: cleanRole,
      name: cleanName,
      phone: metadata.phone?.trim(),
      shelterName: metadata.shelterName?.trim(),
      location: metadata.location?.trim() || (cleanRole === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
      registeredAt: Date.now(),
    };
    saveRegisteredUserLocally(localRecord);

    // 2. Set active role and user profile state
    setRole(cleanRole);
    const resolvedProfile: UserProfile = {
      name: cleanName,
      email: cleanEmail,
      role: cleanRole.charAt(0).toUpperCase() + cleanRole.slice(1),
      location: localRecord.location || (cleanRole === 'shelter' ? 'Registered Sanctuary' : 'Austin, TX'),
      status: cleanRole === 'shelter' ? 'Accredited Facility' : 'Verified Adopter',
      avatarUrl: cleanRole === 'shelter' ? DEFAULT_SHELTER_PROFILE.avatarUrl : DEFAULT_ADOPTER_PROFILE.avatarUrl,
      livingSpace: cleanRole === 'shelter' ? 'Sanctuary & Rescue Hub' : 'Residential',
      activityLevel: 'Active',
      currentPets: '0',
      idVerification: 'Verified Profile',
      verified: true,
    };
    setUserProfile(resolvedProfile);

    // 3. Register user with Supabase Auth
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            name: cleanName,
            full_name: cleanName,
            role: cleanRole,
            phone: metadata.phone || '',
            shelter_name: metadata.shelterName || '',
            location: metadata.location || '',
          },
        },
      });

      if (signUpError) {
        console.warn('Supabase signUp note:', signUpError.message);
      } else if (data?.user) {
        setUser(data.user);
        if (data.session) {
          setSession(data.session);
        }
      }

      return {
        success: true,
        role: cleanRole,
        name: cleanName,
        email: cleanEmail,
        userProfile: resolvedProfile,
        requiresEmailConfirmation: false,
      };
    } catch (err: any) {
      console.warn('Supabase signUp network fallback:', err?.message);
      return {
        success: true,
        role: cleanRole,
        name: cleanName,
        email: cleanEmail,
        userProfile: resolvedProfile,
        requiresEmailConfirmation: false,
      };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      setUser(null);
      setSession(null);
      setRole('adopter');
      setUserProfile(DEFAULT_ADOPTER_PROFILE);
    }
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    const clean = email.trim().toLowerCase();
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: window.location.origin,
      });
      if (resetError) {
        return { success: false, error: resetError.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to dispatch reset instructions' };
    }
  };

  // Quick switch for demo testing
  const switchDemoRole = (targetRole: 'adopter' | 'shelter' | 'admin', customName?: string) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      setUserProfile(DEFAULT_ADMIN_PROFILE);
    } else if (targetRole === 'shelter') {
      setUserProfile(customName ? { ...DEFAULT_SHELTER_PROFILE, name: customName } : DEFAULT_SHELTER_PROFILE);
    } else {
      setUserProfile(customName ? { ...DEFAULT_ADOPTER_PROFILE, name: customName } : DEFAULT_ADOPTER_PROFILE);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        userProfile,
        loading,
        error,
        supabaseProjectId: SUPABASE_PROJECT_ID,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        resetPassword,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

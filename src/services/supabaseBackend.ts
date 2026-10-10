import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';
import { SyncedPet, SyncedApplication, SyncedAppointment, SyncedShelter, SyncedReport, SyncedUser } from '../context/AppContext';

export interface DatabaseStatus {
  connected: boolean;
  projectId: string;
  supabaseUrl: string;
  hasRealDatabaseTables: boolean;
  activeProvider: 'supabase_auth_and_cloud' | 'local_resilient_store';
  tables: {
    pets: boolean;
    applications: boolean;
    shelters: boolean;
    appointments: boolean;
    reports: boolean;
    users: boolean;
  };
  lastChecked: string;
  error?: string | null;
}

/**
 * Service to manage Supabase database persistence and live status checking.
 * Seamlessly connects to real Supabase tables when provisioned in the user's
 * Supabase project schema, while providing instant fallback to resilient
 * local client-side storage so the user experience never breaks.
 */
class SupabaseBackendService {
  private status: DatabaseStatus = {
    connected: false,
    projectId: SUPABASE_PROJECT_ID,
    supabaseUrl: SUPABASE_URL,
    hasRealDatabaseTables: false,
    activeProvider: 'local_resilient_store',
    tables: {
      pets: false,
      applications: false,
      shelters: false,
      appointments: false,
      reports: false,
      users: false,
    },
    lastChecked: new Date().toISOString(),
  };

  private tableAvailabilityCache = new Map<string, boolean>();

  /**
   * Probes Supabase connection and tests table availability
   */
  async checkConnection(): Promise<DatabaseStatus> {
    try {
      // 1. Verify Supabase Auth / API reachability
      const { data: authData, error: authError } = await supabase.auth.getSession();
      const authReachable = !authError;

      // 2. Test individual tables
      const tableNames = ['pets', 'applications', 'shelters', 'appointments', 'reports', 'users'] as const;
      const tableStatus: Record<string, boolean> = {};

      for (const table of tableNames) {
        try {
          const { error } = await supabase.from(table).select('id').limit(1);
          const exists = !error || (error.code !== 'PGRST205' && error.code !== '42P01');
          tableStatus[table] = exists;
          this.tableAvailabilityCache.set(table, exists);
        } catch {
          tableStatus[table] = false;
          this.tableAvailabilityCache.set(table, false);
        }
      }

      const anyTableExists = Object.values(tableStatus).some(Boolean);

      this.status = {
        connected: authReachable,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: SUPABASE_URL,
        hasRealDatabaseTables: anyTableExists,
        activeProvider: anyTableExists ? 'supabase_auth_and_cloud' : 'local_resilient_store',
        tables: {
          pets: !!tableStatus.pets,
          applications: !!tableStatus.applications,
          shelters: !!tableStatus.shelters,
          appointments: !!tableStatus.appointments,
          reports: !!tableStatus.reports,
          users: !!tableStatus.users,
        },
        lastChecked: new Date().toISOString(),
      };

      return this.status;
    } catch (err: any) {
      this.status = {
        ...this.status,
        connected: false,
        error: err?.message || 'Failed to connect to Supabase',
        lastChecked: new Date().toISOString(),
      };
      return this.status;
    }
  }

  getStatus(): DatabaseStatus {
    return this.status;
  }

  /**
   * Sync pets from Supabase table if available
   */
  async fetchPets(): Promise<SyncedPet[] | null> {
    try {
      const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as SyncedPet[];
      }
    } catch {
      // Return null to allow caller to use initial/local state
    }
    return null;
  }

  /**
   * Sync single pet to Supabase table
   */
  async savePet(pet: SyncedPet): Promise<boolean> {
    try {
      const { error } = await supabase.from('pets').upsert(pet, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete pet from Supabase table
   */
  async deletePet(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync applications from Supabase table if available
   */
  async fetchApplications(): Promise<SyncedApplication[] | null> {
    try {
      const { data, error } = await supabase.from('applications').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as SyncedApplication[];
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * Sync single application to Supabase table
   */
  async saveApplication(app: SyncedApplication): Promise<boolean> {
    try {
      const { error } = await supabase.from('applications').upsert(app, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete application from Supabase table
   */
  async deleteApplication(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync appointment
   */
  async saveAppointment(apt: SyncedAppointment): Promise<boolean> {
    try {
      const { error } = await supabase.from('appointments').upsert(apt, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync shelter
   */
  async saveShelter(shelter: SyncedShelter): Promise<boolean> {
    try {
      const { error } = await supabase.from('shelters').upsert(shelter, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync report
   */
  async saveReport(report: SyncedReport): Promise<boolean> {
    try {
      const { error } = await supabase.from('reports').upsert(report, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Generates the SQL schema migration script for users to execute in Supabase SQL Editor
   * to immediately establish all database tables matching the domain models.
   */
  getSchemaMigrationSQL(): string {
    return `-- ========================================================
-- Petify (Kin & Paws) Real Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ========================================================

-- 1. PETS TABLE
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  location TEXT NOT NULL,
  shelter_name TEXT NOT NULL,
  shelter_id TEXT,
  status TEXT DEFAULT 'Available',
  admin_status TEXT DEFAULT 'Approved',
  verification_status TEXT DEFAULT 'Verified',
  image TEXT,
  description TEXT,
  intake_date TEXT,
  microchip_id TEXT,
  rabies_batch TEXT,
  spayed_neutered TEXT,
  distance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADOPTION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  pet_name TEXT NOT NULL,
  species TEXT DEFAULT 'Dog',
  breed TEXT,
  pet_image TEXT,
  shelter_name TEXT NOT NULL,
  applicant TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  status_color TEXT DEFAULT 'amber',
  step INTEGER DEFAULT 1,
  cert_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  pet_name TEXT NOT NULL,
  shelter_name TEXT NOT NULL,
  adopter TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  type TEXT DEFAULT 'In-Person Visit',
  status TEXT DEFAULT 'Pending Shelter Confirmation',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SHELTERS ACCREDITATION TABLE
CREATE TABLE IF NOT EXISTS public.shelters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reg_number TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity TEXT NOT NULL,
  verification_status TEXT DEFAULT 'Pending Review',
  documents_verified BOOLEAN DEFAULT FALSE,
  inspection_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WELFARE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  pet_name TEXT NOT NULL,
  pet_id TEXT,
  reporter TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending Action',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'Adopter',
  status TEXT DEFAULT 'Active',
  location TEXT,
  avatar_url TEXT,
  living_space TEXT,
  activity_level TEXT,
  current_pets TEXT,
  id_verification TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY & PUBLIC PERMISSIVE POLICIES
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow read & write for app client
CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.pets FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.pets FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.applications FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.applications FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.appointments FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.appointments FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.shelters FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.shelters FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.reports FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.reports FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow write access to all" ON public.user_profiles FOR ALL USING (true);
`;
  }
}

export const supabaseBackendService = new SupabaseBackendService();

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CertificateData } from '../components/AdoptionCertificateModal';
import { supabaseBackendService } from '../services/supabaseBackend';

export interface SyncedPet {
  id: string;
  name: string;
  type: string; // 'Dog' | 'Cat' | 'Bird' | 'Others'
  breed: string;
  age: string;
  location: string;
  shelterName: string;
  shelterId?: string;
  status: 'Available' | 'Pending' | 'Adopted' | 'Suspended';
  adminStatus: 'Approved' | 'Pending' | 'Rejected';
  verificationStatus: 'Verified' | 'Pending Verification' | 'Pending Vet Clearance';
  image: string;
  description?: string;
  intakeDate?: string;
  microchipId?: string;
  rabiesBatch?: string;
  spayedNeutered?: string;
  distance?: string;
}

export interface SyncedApplication {
  id: string;
  petId: string;
  petName: string;
  species: string; // 'Dog' | 'Cat' | 'Bird'
  breed: string;
  petImage: string;
  shelterName: string;
  applicant: string;
  email: string;
  phone: string;
  date: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Finalized' | 'Cancelled';
  statusColor?: 'amber' | 'emerald' | 'sky' | 'rose' | 'slate';
  step: number; // 1: Application Form, 2: Phone Screening, 3: Meet & Greet, 4: Adoption Finalized
  certId?: string;
  notes?: string;
}

export interface SyncedAppointment {
  id: string;
  petName: string;
  shelterName: string;
  adopter: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  type: 'In-Person Visit' | 'Video Screening Call';
  status: 'Pending Shelter Confirmation' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes: string;
}

export interface SyncedShelter {
  id: string;
  name: string;
  regNumber: string;
  city: string;
  capacity: string;
  verificationStatus: 'Verified' | 'Pending Review' | 'Audit Scheduled';
  documentsVerified: boolean;
  inspectionDate: string;
}

export interface SyncedReport {
  id: string;
  petName: string;
  petId: string;
  reporter: string;
  reason: string;
  details: string;
  date: string;
  status: 'Pending Action' | 'Investigating' | 'Resolved - Pet Delisted' | 'Dismissed';
}

export interface SyncedUser {
  id: string;
  name: string;
  email: string;
  role: 'Adopter' | 'Shelter' | 'Admin';
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  location?: string;
  adoptionsCount?: number;
}

interface AppContextType {
  // Navigation / Role
  currentRole: 'adopter' | 'shelter' | 'admin';
  setCurrentRole: (role: 'adopter' | 'shelter' | 'admin') => void;

  // Pets
  pets: SyncedPet[];
  addPet: (newPet: Omit<SyncedPet, 'id'>) => SyncedPet;
  updatePet: (id: string, updates: Partial<SyncedPet>) => void;
  approvePetByAdmin: (id: string) => void;
  rejectPetByAdmin: (id: string) => void;
  deletePet: (id: string) => void;

  // Applications
  applications: SyncedApplication[];
  submitApplication: (appData: Partial<SyncedApplication> & { petName: string; petId: string }) => SyncedApplication;
  updateApplicationStatus: (appId: string, status: SyncedApplication['status']) => void;
  advanceApplicationStep: (appId: string, step: number) => void;
  cancelApplication: (appId: string, reason?: string) => void;
  deleteApplication: (appId: string) => void;
  issueCertificateForApp: (appId: string, certData?: Partial<CertificateData>) => void;

  // Appointments
  appointments: SyncedAppointment[];
  requestAppointment: (aptData: Omit<SyncedAppointment, 'id' | 'status'>) => SyncedAppointment;
  updateAppointmentStatus: (aptId: string, status: SyncedAppointment['status']) => void;

  // Shelters
  shelters: SyncedShelter[];
  updateShelterVerification: (shelterId: string, status: SyncedShelter['verificationStatus'], documentsVerified?: boolean) => void;
  submitShelterAccreditationDocs: (shelterId: string) => void;

  // Reports
  reports: SyncedReport[];
  submitReport: (reportData: Omit<SyncedReport, 'id' | 'status' | 'date'>) => SyncedReport;
  updateReportStatus: (reportId: string, status: SyncedReport['status']) => void;

  // Certificates
  certificates: CertificateData[];
  addCertificate: (cert: CertificateData) => void;

  // Favorites
  favorites: string[]; // pet IDs or names
  toggleFavorite: (petNameOrId: string) => void;
  isFavorited: (petNameOrId: string) => boolean;

  // Users Management
  users: SyncedUser[];
  addUser: (userData: Omit<SyncedUser, 'id' | 'joinedDate'>) => void;
  updateUserStatus: (userId: string, status: SyncedUser['status']) => void;

  // Database & Supabase Live Status
  dbStatus: {
    connected: boolean;
    projectId: string;
    hasRealDatabaseTables: boolean;
    activeProvider: string;
    lastChecked: string;
  };
  refreshDbStatus: () => Promise<void>;
  getMigrationSQL: () => string;

  // Reset to initial defaults
  resetAllData: () => void;
}

const INITIAL_PETS: SyncedPet[] = [
  {
    id: 'p-1',
    name: 'Bruno',
    type: 'Dog',
    breed: 'Labrador Retriever',
    age: '2.5 years',
    location: 'Delhi',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1579213838051-dc00a8863640?auto=format&fit=crop&w=500&q=80',
    description: 'Friendly, playful Labrador Retriever from Canada (10–13 yrs lifespan). Loves retrieving tennis balls and gentle water splash play.',
    intakeDate: '2025-05-10',
    microchipId: '985141001189432',
    rabiesBatch: 'RB-2025-099',
    spayedNeutered: 'Neutered Male',
    distance: '3.2 km away',
  },
  {
    id: 'p-dog-gsd',
    name: 'Rex',
    type: 'Dog',
    breed: 'German Shepherd',
    age: '3 years',
    location: 'Delhi NCR',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=500&q=80',
    description: 'Courageous, highly obedient German Shepherd originating from Germany (9–13 yrs lifespan). Trained in basic commands, vigilant companion.',
    intakeDate: '2025-05-14',
    microchipId: '985141002233445',
    rabiesBatch: 'RB-2025-104',
    spayedNeutered: 'Neutered Male',
    distance: '4.8 km away',
  },
  {
    id: 'p-5',
    name: 'Rocky',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'Delhi NCR',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80',
    description: 'Affectionate, eager-to-please Golden Retriever from Scotland (10–12 yrs lifespan). Patient family companion with a lustrous golden coat.',
    intakeDate: '2025-05-10',
    microchipId: '985141002345891',
    rabiesBatch: 'RB-2025-881',
    spayedNeutered: 'Yes - Healed',
    distance: '4.5 km away',
  },
  {
    id: 'p-3',
    name: 'Milo',
    type: 'Dog',
    breed: 'Beagle',
    age: '1.5 years',
    location: 'Ghaziabad',
    shelterName: 'City Animal Rescue',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=500&q=80',
    description: 'Merry, inquisitive Beagle from England (10–15 yrs lifespan). Scent-tracking explorer with expressive hazel eyes and gentle disposition.',
    intakeDate: '2025-06-01',
    microchipId: '985141004499120',
    rabiesBatch: 'RB-2025-118',
    spayedNeutered: 'Neutered Male',
    distance: '8.4 km away',
  },
  {
    id: 'p-dog-pug',
    name: 'Otis',
    type: 'Dog',
    breed: 'Pug',
    age: '2 years',
    location: 'Noida',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80',
    description: 'Charming, quiet Pug originating from ancient China (11–13 yrs lifespan). Deeply cuddly lap companion with a playful curly tail.',
    intakeDate: '2025-05-22',
    microchipId: '985141005544332',
    rabiesBatch: 'RB-2025-332',
    spayedNeutered: 'Neutered Male',
    distance: '3.6 km away',
  },
  {
    id: 'p-dog-husky',
    name: 'Shadow',
    type: 'Dog',
    breed: 'Siberian Husky',
    age: '2.5 years',
    location: 'Delhi',
    shelterName: 'City Animal Rescue',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=500&q=80',
    description: 'Spirited, athletic Siberian Husky from Siberia, Russia (12–14 yrs lifespan). Captivating dual-colored eyes, energetic trail buddy.',
    intakeDate: '2025-05-28',
    microchipId: '985141006677889',
    rabiesBatch: 'RB-2025-455',
    spayedNeutered: 'Neutered Male',
    distance: '5.2 km away',
  },
  {
    id: 'p-dog-rottweiler',
    name: 'Diesel',
    type: 'Dog',
    breed: 'Rottweiler',
    age: '3 years',
    location: 'Ghaziabad',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?auto=format&fit=crop&w=500&q=80',
    description: 'Calm, devoted Rottweiler from Germany (8–10 yrs lifespan). Confident, deeply loyal family protector with solid obedience foundation.',
    intakeDate: '2025-06-03',
    microchipId: '985141007788990',
    rabiesBatch: 'RB-2025-560',
    spayedNeutered: 'Neutered Male',
    distance: '6.7 km away',
  },
  {
    id: 'p-dog-dachshund',
    name: 'Oscar',
    type: 'Dog',
    breed: 'Dachshund',
    age: '1.5 years',
    location: 'Noida',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=500&q=80',
    description: 'Spunky, clever Dachshund from Germany (12–16 yrs lifespan). Charming long-body companion who loves cozy blanket burrows.',
    intakeDate: '2025-06-06',
    microchipId: '985141008899001',
    rabiesBatch: 'RB-2025-671',
    spayedNeutered: 'Neutered Male',
    distance: '2.8 km away',
  },
  {
    id: 'p-dog-greatdane',
    name: 'Zeus',
    type: 'Dog',
    breed: 'Great Dane',
    age: '2.8 years',
    location: 'Delhi',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1554692998-0d25f385c7f8?auto=format&fit=crop&w=500&q=80',
    description: 'Patient gentle giant Great Dane originating from Germany (8–10 yrs lifespan). Incredibly mild mannered, loves peaceful afternoon snoozes.',
    intakeDate: '2025-06-09',
    microchipId: '985141009900112',
    rabiesBatch: 'RB-2025-782',
    spayedNeutered: 'Neutered Male',
    distance: '7.5 km away',
  },
  {
    id: 'p-dog-shihtzu',
    name: 'Teddy',
    type: 'Dog',
    breed: 'Shih Tzu',
    age: '1.8 years',
    location: 'Delhi NCR',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1541364983658-d7b1a2b226e6?auto=format&fit=crop&w=500&q=80',
    description: 'Affectionate, outgoing Shih Tzu originating from Tibet/China (10–16 yrs lifespan). Silky coat, playful personality, perfect apartment companion.',
    intakeDate: '2025-06-12',
    microchipId: '985141001011223',
    rabiesBatch: 'RB-2025-893',
    spayedNeutered: 'Neutered Male',
    distance: '3.9 km away',
  },
  {
    id: 'p-2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Persian',
    age: '1.5 years',
    location: 'Noida',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80',
    description: 'Sweet, quiet Persian companion from Persia (Iran). 12–17 years lifespan, loves warm sunny windowsill naps.',
    intakeDate: '2025-05-18',
    microchipId: '985141009823412',
    rabiesBatch: 'RB-2025-012',
    spayedNeutered: 'Spayed Female',
    distance: '5.0 km away',
  },
  {
    id: 'p-cat-siamese',
    name: 'Cleo',
    type: 'Cat',
    breed: 'Siamese',
    age: '2 years',
    location: 'Delhi NCR',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=500&q=80',
    description: 'Vocal, affectionate Siamese originating from Thailand (12–20 yrs lifespan). Blue-eyed sweetheart with high intelligence.',
    intakeDate: '2025-05-20',
    microchipId: '985141008892101',
    rabiesBatch: 'RB-2025-301',
    spayedNeutered: 'Spayed Female',
    distance: '3.8 km away',
  },
  {
    id: 'p-cat-mainecoon',
    name: 'Barnaby',
    type: 'Cat',
    breed: 'Maine Coon',
    age: '3 years',
    location: 'Austin, TX',
    shelterName: 'Cedar Creek Haven',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=500&q=80',
    description: 'Gentle giant Maine Coon originating from USA (10–13 yrs lifespan). Dog-like loyalty with fluffy tufted ears.',
    intakeDate: '2025-05-25',
    microchipId: '985141007712399',
    rabiesBatch: 'RB-2025-412',
    spayedNeutered: 'Neutered Male',
    distance: '6.2 km away',
  },
  {
    id: 'p-cat-ragdoll',
    name: 'Mochi',
    type: 'Cat',
    breed: 'Ragdoll',
    age: '1 year',
    location: 'Delhi',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=500&q=80',
    description: 'Docile, placid Ragdoll from USA (12–17 yrs lifespan). Loves collapsing gently in your arms like a plush doll.',
    intakeDate: '2025-06-02',
    microchipId: '985141006622411',
    rabiesBatch: 'RB-2025-502',
    spayedNeutered: 'Neutered Male',
    distance: '2.5 km away',
  },
  {
    id: 'p-cat-british',
    name: 'Winston',
    type: 'Cat',
    breed: 'British Shorthair',
    age: '2.5 years',
    location: 'Noida',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80',
    description: 'Calm, dignified British Shorthair from England, UK (12–17 yrs lifespan). Plush crisp coat and round amber eyes.',
    intakeDate: '2025-05-15',
    microchipId: '985141005511200',
    rabiesBatch: 'RB-2025-224',
    spayedNeutered: 'Neutered Male',
    distance: '4.1 km away',
  },
  {
    id: 'p-cat-bengal',
    name: 'Simba',
    type: 'Cat',
    breed: 'Bengal',
    age: '1.5 years',
    location: 'Ghaziabad',
    shelterName: 'City Animal Rescue',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=500&q=80',
    description: 'Wild-patterned, athletic Bengal from USA (12–16 yrs lifespan). Loves leash walking, fetch, and climbing perches.',
    intakeDate: '2025-06-05',
    microchipId: '985141004499188',
    rabiesBatch: 'RB-2025-618',
    spayedNeutered: 'Neutered Male',
    distance: '7.0 km away',
  },
  {
    id: 'p-cat-sphynx',
    name: 'Pixel',
    type: 'Cat',
    breed: 'Sphynx',
    age: '2 years',
    location: 'Delhi',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=500&q=80',
    description: 'Acrobatic, extroverted Sphynx from Canada (8–14 yrs lifespan). Warm suede skin and super cuddly human lover.',
    intakeDate: '2025-06-08',
    microchipId: '985141003388712',
    rabiesBatch: 'RB-2025-722',
    spayedNeutered: 'Spayed Female',
    distance: '3.4 km away',
  },
  {
    id: 'p-cat-abyssinian',
    name: 'Amber',
    type: 'Cat',
    breed: 'Abyssinian',
    age: '1.8 years',
    location: 'Austin, TX',
    shelterName: 'Austin Pet Rescue',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=500&q=80',
    description: 'Agile explorer Abyssinian from Ethiopia/Africa (9–15 yrs lifespan). Stunning ticked agouti coat and inquisitive spirit.',
    intakeDate: '2025-05-12',
    microchipId: '985141002277601',
    rabiesBatch: 'RB-2025-833',
    spayedNeutered: 'Spayed Female',
    distance: '5.8 km away',
  },
  {
    id: 'p-cat-russianblue',
    name: 'Misty',
    type: 'Cat',
    breed: 'Russian Blue',
    age: '2 years',
    location: 'Noida',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=500&q=80',
    description: 'Silvery-tipped Russian Blue from Russia (12–20 yrs lifespan). Emerald eyes, low dander profile, gentle and loyal.',
    intakeDate: '2025-05-19',
    microchipId: '985141001166599',
    rabiesBatch: 'RB-2025-944',
    spayedNeutered: 'Spayed Female',
    distance: '4.7 km away',
  },
  {
    id: 'p-cat-turkish',
    name: 'Zara',
    type: 'Cat',
    breed: 'Turkish Angora',
    age: '1.2 years',
    location: 'Delhi',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=500&q=80',
    description: 'Graceful, silky Turkish Angora from Turkey (12–18 yrs lifespan). Plumed tail, intelligent, highly playful.',
    intakeDate: '2025-06-11',
    microchipId: '985141009955488',
    rabiesBatch: 'RB-2025-155',
    spayedNeutered: 'Spayed Female',
    distance: '2.9 km away',
  },
  {
    id: 'p-4',
    name: 'Chippy',
    type: 'Bird',
    breed: 'Parrot (Indian Ringneck)',
    age: '2 years',
    location: 'Lucknow',
    shelterName: 'Blue Cross Community Center',
    status: 'Available',
    adminStatus: 'Approved',
    verificationStatus: 'Verified',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80',
    description: 'Vocal, affectionate bird who loves gentle whistles and fresh fruit treats.',
    intakeDate: '2025-04-12',
    microchipId: 'LEG-BAND-88210',
    rabiesBatch: 'AVIAN-CLEAR-2025',
    spayedNeutered: 'N/A',
    distance: '14.0 km away',
  },
];

const INITIAL_APPLICATIONS: SyncedApplication[] = [
  {
    id: 'app-1',
    petId: 'p-1',
    petName: 'Rocky',
    species: 'Dog',
    breed: 'Golden Retriever',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    applicant: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    phone: '+91 98765 43210',
    status: 'Pending',
    statusColor: 'amber',
    step: 2,
    date: '2025-06-15',
    notes: 'Large fenced yard, veterinarian reference approved.',
  },
  {
    id: 'app-2',
    petId: 'p-2',
    petName: 'Luna',
    species: 'Cat',
    breed: 'Persian Longhair',
    petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    applicant: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    phone: '+91 98765 43210',
    status: 'Approved',
    statusColor: 'emerald',
    step: 4,
    date: '2025-06-10',
    certId: 'PC-CERT-2025-9943',
    notes: 'Adoption finalized. Official adoption certificate issued.',
  },
  {
    id: 'app-3',
    petId: 'p-3',
    petName: 'Milo',
    species: 'Dog',
    breed: 'Beagle',
    petImage: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=300&q=80',
    shelterName: 'City Animal Rescue',
    applicant: 'Saurabh Yadav',
    email: 'saurabh.y@example.com',
    phone: '+91 98334 56789',
    status: 'Under Review',
    statusColor: 'sky',
    step: 1,
    date: '2025-06-08',
    notes: 'Coordinator verifying residential pet policy.',
  },
];

const INITIAL_APPOINTMENTS: SyncedAppointment[] = [
  {
    id: 'apt-1',
    petName: 'Rocky',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    adopter: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2025-06-25',
    timeSlot: '02:00 PM - 03:00 PM',
    type: 'In-Person Visit',
    status: 'Confirmed',
    notes: 'Meet & Greet with family in private play yard.',
  },
  {
    id: 'apt-2',
    petName: 'Luna',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    adopter: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2025-06-28',
    timeSlot: '11:00 AM - 12:00 PM',
    type: 'Video Screening Call',
    status: 'Pending Shelter Confirmation',
    notes: 'Virtual home check and meet & greet.',
  },
];

const INITIAL_SHELTERS: SyncedShelter[] = [
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
    name: 'City Animal Rescue',
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
];

const INITIAL_REPORTS: SyncedReport[] = [
  {
    id: 'rep-1',
    petName: 'Chippy (Parrot)',
    petId: 'p-4',
    reporter: 'Riya Sharma',
    reason: 'Misleading or False Information',
    details: 'Suspected unauthorized exotic species listing without certified captive breeding wildlife clearance.',
    date: '2 hours ago',
    status: 'Pending Action',
  },
  {
    id: 'rep-2',
    petName: 'Bruno (Labrador)',
    petId: 'p-1',
    reporter: 'Vikram Mehta',
    reason: 'Suspicious / Unauthorized Rehoming Fee',
    details: 'Third party claiming advance cash deposit required before meet and greet.',
    date: 'Yesterday',
    status: 'Investigating',
  },
];

const INITIAL_CERTIFICATES: CertificateData[] = [
  {
    certId: 'PC-CERT-2025-9943',
    petName: 'Luna',
    petType: 'Cat',
    breed: 'Persian Longhair',
    microchipId: '985141009823412',
    adopterName: 'Riya Sharma',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    adoptionDate: '10 June 2025',
    rabiesBatch: 'RB-2025-012',
    legalNote: 'Official permanent adoption certificate issued under Animal Welfare Board standards.',
  },
  {
    certId: 'PC-CERT-2024-8841',
    petName: 'Bella',
    petType: 'Cat',
    breed: 'Calico Cat',
    microchipId: '985141002345891',
    adopterName: 'Riya Sharma',
    shelterName: 'Happy Paws Rescue & Sanctuary',
    adoptionDate: '18 May 2024',
    rabiesBatch: 'RB-2024-411',
    legalNote: 'Official and irrevocable certificate of adoption recognized by municipal animal board.',
  },
  {
    certId: 'PC-CERT-2023-6102',
    petName: 'Rusty',
    petType: 'Dog',
    breed: 'Beagle Hound Mix',
    microchipId: '985141007721034',
    adopterName: 'Riya Sharma',
    shelterName: 'Central Texas Pet Rescue',
    adoptionDate: '20 January 2023',
    rabiesBatch: 'RB-2023-018',
    legalNote: 'Official and irrevocable certificate of adoption recognized by municipal animal board.',
  },
];

const INITIAL_USERS: SyncedUser[] = [
  { id: 'u-1', name: 'Riya Sharma', email: 'riya.sharma@example.com', role: 'Adopter', status: 'Active', joinedDate: '12 Jan 2025', adoptionsCount: 2 },
  { id: 'u-2', name: 'Happy Paws Rescue & Sanctuary', email: 'contact@happypaws.org', role: 'Shelter', status: 'Active', joinedDate: '01 Nov 2024', adoptionsCount: 48 },
  { id: 'u-3', name: 'Himanshu (Super Admin)', email: 'admin@petify.org', role: 'Admin', status: 'Active', joinedDate: '01 Jan 2024' },
  { id: 'u-4', name: 'Rohit Verma', email: 'rohit.v@example.com', role: 'Adopter', status: 'Active', joinedDate: '28 Feb 2025', adoptionsCount: 0 },
  { id: 'u-5', name: 'City Animal Rescue', email: 'rescue@cityanimal.org', role: 'Shelter', status: 'Active', joinedDate: '15 Mar 2025', adoptionsCount: 19 },
];

const STORAGE_KEY = 'petify_synced_state_v5';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<'adopter' | 'shelter' | 'admin'>('adopter');

  // Load from LocalStorage if available
  const [pets, setPets] = useState<SyncedPet[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pets`);
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [applications, setApplications] = useState<SyncedApplication[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_apps`);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [appointments, setAppointments] = useState<SyncedAppointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_apts`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [shelters, setShelters] = useState<SyncedShelter[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_shelters`);
      return saved ? JSON.parse(saved) : INITIAL_SHELTERS;
    } catch {
      return INITIAL_SHELTERS;
    }
  });

  const [reports, setReports] = useState<SyncedReport[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reports`);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [certificates, setCertificates] = useState<CertificateData[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_certs`);
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_favs`);
      return saved ? JSON.parse(saved) : ['Luna', 'Bruno'];
    } catch {
      return ['Luna', 'Bruno'];
    }
  });

  const [users, setUsers] = useState<SyncedUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Live Supabase Database state
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    projectId: 'pdrxzltydbsrmiapiuct',
    hasRealDatabaseTables: false,
    activeProvider: 'local_resilient_store',
    lastChecked: new Date().toLocaleTimeString(),
  });

  // Check connection to Supabase database on mount
  useEffect(() => {
    let mounted = true;
    async function checkSupabase() {
      try {
        const status = await supabaseBackendService.checkConnection();
        if (mounted) {
          setDbStatus({
            connected: status.connected,
            projectId: status.projectId,
            hasRealDatabaseTables: status.hasRealDatabaseTables,
            activeProvider: status.activeProvider,
            lastChecked: new Date().toLocaleTimeString(),
          });

          // If real Supabase database has records, hydrate into state
          if (status.hasRealDatabaseTables) {
            const remotePets = await supabaseBackendService.fetchPets();
            if (remotePets && remotePets.length > 0) {
              setPets(remotePets);
            }
            const remoteApps = await supabaseBackendService.fetchApplications();
            if (remoteApps && remoteApps.length > 0) {
              setApplications(remoteApps);
            }
          }
        }
      } catch (e) {
        console.warn('Supabase status check:', e);
      }
    }
    checkSupabase();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshDbStatus = async () => {
    try {
      const status = await supabaseBackendService.checkConnection();
      setDbStatus({
        connected: status.connected,
        projectId: status.projectId,
        hasRealDatabaseTables: status.hasRealDatabaseTables,
        activeProvider: status.activeProvider,
        lastChecked: new Date().toLocaleTimeString(),
      });
      if (status.hasRealDatabaseTables) {
        const remotePets = await supabaseBackendService.fetchPets();
        if (remotePets && remotePets.length > 0) setPets(remotePets);
        const remoteApps = await supabaseBackendService.fetchApplications();
        if (remoteApps && remoteApps.length > 0) setApplications(remoteApps);
      }
    } catch {
      // Keep existing state
    }
  };

  const getMigrationSQL = () => supabaseBackendService.getSchemaMigrationSQL();

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_pets`, JSON.stringify(pets));
      localStorage.setItem(`${STORAGE_KEY}_apps`, JSON.stringify(applications));
      localStorage.setItem(`${STORAGE_KEY}_apts`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_shelters`, JSON.stringify(shelters));
      localStorage.setItem(`${STORAGE_KEY}_reports`, JSON.stringify(reports));
      localStorage.setItem(`${STORAGE_KEY}_certs`, JSON.stringify(certificates));
      localStorage.setItem(`${STORAGE_KEY}_favs`, JSON.stringify(favorites));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [pets, applications, appointments, shelters, reports, certificates, favorites, users]);

  // Pet Operations
  const addPet = (newPetData: Omit<SyncedPet, 'id'>) => {
    const newPet: SyncedPet = {
      ...newPetData,
      id: `p-${Date.now()}`,
    };
    setPets((prev) => [newPet, ...prev]);
    supabaseBackendService.savePet(newPet).catch(() => {});
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<SyncedPet>) => {
    setPets((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const target = updated.find((p) => p.id === id);
      if (target) supabaseBackendService.savePet(target).catch(() => {});
      return updated;
    });
  };

  const approvePetByAdmin = (id: string) => {
    setPets((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              adminStatus: 'Approved' as const,
              verificationStatus: 'Verified' as const,
              status: 'Available' as const,
            }
          : p
      );
      const target = updated.find((p) => p.id === id);
      if (target) supabaseBackendService.savePet(target).catch(() => {});
      return updated;
    });
  };

  const rejectPetByAdmin = (id: string) => {
    setPets((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              adminStatus: 'Rejected' as const,
              status: 'Suspended' as const,
            }
          : p
      );
      const target = updated.find((p) => p.id === id);
      if (target) supabaseBackendService.savePet(target).catch(() => {});
      return updated;
    });
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    supabaseBackendService.deletePet(id).catch(() => {});
  };

  // Application Operations
  const submitApplication = (appData: Partial<SyncedApplication> & { petName: string; petId: string }) => {
    const targetPet = pets.find((p) => p.id === appData.petId || p.name === appData.petName);
    const newApp: SyncedApplication = {
      id: `app-${Date.now()}`,
      petId: appData.petId,
      petName: appData.petName,
      species: targetPet?.type || appData.species || 'Dog',
      breed: targetPet?.breed || appData.breed || 'Companion',
      petImage: targetPet?.image || appData.petImage || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
      shelterName: targetPet?.shelterName || appData.shelterName || 'Happy Paws Rescue & Sanctuary',
      applicant: appData.applicant || 'Riya Sharma',
      email: appData.email || 'riya.sharma@example.com',
      phone: appData.phone || '+91 98765 43210',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      statusColor: 'amber',
      step: 1,
      notes: appData.notes || 'Submitted via Adopter Portal',
    };
    setApplications((prev) => [newApp, ...prev]);
    supabaseBackendService.saveApplication(newApp).catch(() => {});
    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: SyncedApplication['status']) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const color: SyncedApplication['statusColor'] =
            status === 'Approved' ? 'emerald' : status === 'Rejected' ? 'rose' : status === 'Cancelled' ? 'slate' : status === 'Under Review' ? 'sky' : 'amber';
          const updated = { ...a, status, statusColor: color };
          supabaseBackendService.saveApplication(updated).catch(() => {});
          return updated;
        }
        return a;
      })
    );
  };

  const advanceApplicationStep = (appId: string, step: number) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const isFinal = step === 4;
          const status: SyncedApplication['status'] = isFinal ? 'Approved' : 'Under Review';
          const certId = isFinal ? a.certId || `PC-CERT-${Math.floor(1000 + Math.random() * 9000)}` : a.certId;
          const updated: SyncedApplication = {
            ...a,
            step,
            status,
            statusColor: isFinal ? ('emerald' as const) : ('sky' as const),
            certId,
          };
          supabaseBackendService.saveApplication(updated).catch(() => {});
          return updated;
        }
        return a;
      })
    );
  };

  const cancelApplication = (appId: string, reason?: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const updated: SyncedApplication = {
            ...a,
            status: 'Cancelled',
            statusColor: 'slate',
            notes: reason || 'Cancelled by adopter request',
          };
          supabaseBackendService.saveApplication(updated).catch(() => {});
          return updated;
        }
        return a;
      })
    );
  };

  const deleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    supabaseBackendService.deleteApplication(appId).catch(() => {});
  };

  const issueCertificateForApp = (appId: string, customCertData?: Partial<CertificateData>) => {
    const targetApp = applications.find((a) => a.id === appId);
    const certNumber = customCertData?.certId || targetApp?.certId || `PC-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const petObj = pets.find((p) => p.name === targetApp?.petName || p.id === targetApp?.petId);

    const newCert: CertificateData = {
      certId: certNumber,
      petName: targetApp?.petName || petObj?.name || 'Companion',
      petType: targetApp?.species || petObj?.type || 'Pet',
      breed: targetApp?.breed || petObj?.breed || 'Mixed Breed',
      microchipId: petObj?.microchipId || '98514100' + Math.floor(100000 + Math.random() * 900000),
      adopterName: targetApp?.applicant || 'Riya Sharma',
      shelterName: targetApp?.shelterName || 'Happy Paws Rescue & Sanctuary',
      adoptionDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      rabiesBatch: petObj?.rabiesBatch || 'RB-2025-012',
      legalNote: 'Official permanent adoption certificate recognized by the Animal Welfare Board.',
      ...customCertData,
    };

    setCertificates((prev) => {
      const exists = prev.some((c) => c.certId === newCert.certId);
      return exists ? prev.map((c) => (c.certId === newCert.certId ? newCert : c)) : [newCert, ...prev];
    });

    if (targetApp) {
      advanceApplicationStep(appId, 4);
    }
  };

  // Appointment Operations
  const requestAppointment = (aptData: Omit<SyncedAppointment, 'id' | 'status'>) => {
    const newApt: SyncedAppointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Pending Shelter Confirmation',
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (aptId: string, status: SyncedAppointment['status']) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === aptId ? { ...apt, status } : apt)));
  };

  // Shelter Verification Operations
  const updateShelterVerification = (
    shelterId: string,
    verificationStatus: SyncedShelter['verificationStatus'],
    documentsVerified: boolean = true
  ) => {
    setShelters((prev) =>
      prev.map((s) => (s.id === shelterId ? { ...s, verificationStatus, documentsVerified } : s))
    );
  };

  const submitShelterAccreditationDocs = (shelterId: string) => {
    setShelters((prev) =>
      prev.map((s) => (s.id === shelterId ? { ...s, documentsVerified: true, verificationStatus: 'Audit Scheduled' } : s))
    );
  };

  // Reports Operations
  const submitReport = (reportData: Omit<SyncedReport, 'id' | 'status' | 'date'>) => {
    const newReport: SyncedReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      date: 'Just now',
      status: 'Pending Action',
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (reportId: string, status: SyncedReport['status']) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status };
        }
        return r;
      })
    );
  };

  // Certificates
  const addCertificate = (cert: CertificateData) => {
    setCertificates((prev) => [cert, ...prev.filter((c) => c.certId !== cert.certId)]);
  };

  // Favorites
  const toggleFavorite = (nameOrId: string) => {
    setFavorites((prev) =>
      prev.includes(nameOrId) ? prev.filter((item) => item !== nameOrId) : [...prev, nameOrId]
    );
  };

  const isFavorited = (nameOrId: string) => favorites.includes(nameOrId);

  // Users
  const addUser = (userData: Omit<SyncedUser, 'id' | 'joinedDate'>) => {
    const newUser: SyncedUser = {
      ...userData,
      id: `u-${Date.now()}`,
      joinedDate: 'Today',
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUserStatus = (userId: string, status: SyncedUser['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  };

  // Reset to initial
  const resetAllData = () => {
    localStorage.clear();
    setPets(INITIAL_PETS);
    setApplications(INITIAL_APPLICATIONS);
    setAppointments(INITIAL_APPOINTMENTS);
    setShelters(INITIAL_SHELTERS);
    setReports(INITIAL_REPORTS);
    setCertificates(INITIAL_CERTIFICATES);
    setFavorites(['Luna', 'Bruno']);
    setUsers(INITIAL_USERS);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        pets,
        addPet,
        updatePet,
        approvePetByAdmin,
        rejectPetByAdmin,
        deletePet,
        applications,
        submitApplication,
        updateApplicationStatus,
        advanceApplicationStep,
        cancelApplication,
        deleteApplication,
        issueCertificateForApp,
        appointments,
        requestAppointment,
        updateAppointmentStatus,
        shelters,
        updateShelterVerification,
        submitShelterAccreditationDocs,
        reports,
        submitReport,
        updateReportStatus,
        certificates,
        addCertificate,
        favorites,
        toggleFavorite,
        isFavorited,
        users,
        addUser,
        updateUserStatus,
        dbStatus,
        refreshDbStatus,
        getMigrationSQL,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};

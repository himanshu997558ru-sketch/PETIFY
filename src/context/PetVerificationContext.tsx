import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ShelterPet,
  PetVerificationStatus,
  VerificationScheduleDetails,
  PhysicalInspectionReport,
  RejectionDetails,
} from '../types/petVerification';
import { INITIAL_SHELTER_PETS } from '../data/sampleShelterPets';

interface NewPetInput {
  name: string;
  petType: 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  location: string;
  description: string;
  photoUrl: string;
  shelterName: string;
  shelterAddress: string;
  shelterContact: string;
}

interface PetVerificationContextType {
  pets: ShelterPet[];
  addPet: (input: NewPetInput) => ShelterPet;
  scheduleVerification: (petId: string, details: Omit<VerificationScheduleDetails, 'scheduledAt'>) => void;
  verifyPetPhysical: (petId: string, report: Omit<PhysicalInspectionReport, 'completedAt'>) => void;
  rejectPet: (petId: string, reason: string, rejectedBy: string, stage: 'Physical Verification' | 'Admin Review') => void;
  adminApproveListing: (petId: string, adminNotes?: string, approvedBy?: string) => void;
  resetToSampleData: () => void;
  getPetById: (id: string) => ShelterPet | undefined;
  getPublicAdoptionPets: () => ShelterPet[];
  stats: {
    pending: number;
    scheduled: number;
    verified: number;
    rejected: number;
    available: number;
    total: number;
  };
}

const STORAGE_KEY = 'petify_shelter_pet_verification_v1';

const PetVerificationContext = createContext<PetVerificationContextType | undefined>(undefined);

export const PetVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<ShelterPet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored shelter pets', e);
      }
    }
    return INITIAL_SHELTER_PETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  }, [pets]);

  // 1. Shelter adds a pet -> Status: 'Pending Verification'
  const addPet = (input: NewPetInput): ShelterPet => {
    const newId = `PET-${new Date().getFullYear()}-${String(pets.length + 1).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();
    const todayStr = new Date().toISOString().split('T')[0];

    const newPet: ShelterPet = {
      id: newId,
      name: input.name.trim(),
      petType: input.petType,
      breed: input.breed.trim(),
      age: input.age.trim(),
      gender: input.gender,
      location: input.location.trim(),
      description: input.description.trim(),
      photoUrl: input.photoUrl.trim(),
      shelterName: input.shelterName.trim(),
      shelterAddress: input.shelterAddress.trim(),
      shelterContact: input.shelterContact.trim(),
      submissionDate: todayStr,
      status: 'Pending Verification',
      history: [
        {
          stage: 'Pet Added',
          timestamp: nowIso,
          actor: input.shelterName.trim(),
          note: `Pet profile created for ${input.name.trim()} (${input.breed.trim()}).`,
        },
        {
          stage: 'Pending Verification',
          timestamp: nowIso,
          actor: 'System',
          note: 'Queued for in-person physical inspection scheduling.',
        },
      ],
    };

    setPets((prev) => [newPet, ...prev]);
    return newPet;
  };

  // 2. Schedule Physical Verification -> Status: 'Verification Scheduled'
  const scheduleVerification = (
    petId: string,
    details: Omit<VerificationScheduleDetails, 'scheduledAt'>
  ) => {
    const nowIso = new Date().toISOString();
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== petId) return pet;
        const updatedDetails: VerificationScheduleDetails = {
          ...details,
          scheduledAt: nowIso,
        };
        return {
          ...pet,
          status: 'Verification Scheduled',
          scheduleDetails: updatedDetails,
          history: [
            ...pet.history,
            {
              stage: 'Verification Scheduled',
              timestamp: nowIso,
              actor: details.officer,
              note: `Physical verification visit scheduled for ${details.visitDate} at ${details.visitTime} at location: ${details.visitLocation}. Notes: ${details.notes || 'None'}`,
            },
          ],
        };
      })
    );
  };

  // 3. Physical Verification Completed (Pass) -> Status: 'Verified' (Awaiting Admin Approval)
  const verifyPetPhysical = (
    petId: string,
    report: Omit<PhysicalInspectionReport, 'completedAt'>
  ) => {
    const nowIso = new Date().toISOString();
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== petId) return pet;
        const fullReport: PhysicalInspectionReport = {
          ...report,
          completedAt: nowIso,
        };
        return {
          ...pet,
          status: 'Verified',
          inspectionReport: fullReport,
          history: [
            ...pet.history,
            {
              stage: 'Physical Verification',
              timestamp: nowIso,
              actor: `${report.verificationOfficer} (${report.officerBadge})`,
              note: `All 6 physical checklist standards verified. Officer notes: "${report.verificationNotes}".`,
            },
            {
              stage: 'Verified',
              timestamp: nowIso,
              actor: 'System',
              note: 'Physical inspection verified. Listing is awaiting final Admin Approval.',
            },
          ],
        };
      })
    );
  };

  // 4. Reject Pet (either at Physical Verification or Admin Review) -> Status: 'Rejected'
  const rejectPet = (
    petId: string,
    reason: string,
    rejectedBy: string,
    stage: 'Physical Verification' | 'Admin Review'
  ) => {
    const nowIso = new Date().toISOString();
    const rejection: RejectionDetails = {
      reason,
      rejectedBy,
      rejectedAt: nowIso,
      stage,
    };

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== petId) return pet;
        return {
          ...pet,
          status: 'Rejected',
          rejectionDetails: rejection,
          history: [
            ...pet.history,
            {
              stage: 'Rejected',
              timestamp: nowIso,
              actor: rejectedBy,
              note: `Listing rejected during ${stage}. Reason: ${reason}`,
            },
          ],
        };
      })
    );
  };

  // 5. Admin Approves Listing -> Status: 'Available for Adoption'
  const adminApproveListing = (
    petId: string,
    adminNotes: string = 'Approved for public listing after physical verification report audit.',
    approvedBy: string = 'Sanctuary Super Admin'
  ) => {
    const nowIso = new Date().toISOString();
    const todayStr = new Date().toISOString().split('T')[0];

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== petId) return pet;
        return {
          ...pet,
          status: 'Available for Adoption',
          adminApproval: {
            approvedBy,
            approvalDate: todayStr,
            adminNotes,
          },
          history: [
            ...pet.history,
            {
              stage: 'Admin Approval',
              timestamp: nowIso,
              actor: approvedBy,
              note: `Listing approved. ${adminNotes}`,
            },
            {
              stage: 'Available for Adoption',
              timestamp: nowIso,
              actor: 'System',
              note: 'Pet is now publicly visible in the Adopter Catalog.',
            },
          ],
        };
      })
    );
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPets(INITIAL_SHELTER_PETS);
  };

  const getPetById = (id: string) => pets.find((p) => p.id === id);

  // STRICT RULE: Only 'Available for Adoption' pets are visible to adopters!
  const getPublicAdoptionPets = () => pets.filter((p) => p.status === 'Available for Adoption');

  const stats = {
    pending: pets.filter((p) => p.status === 'Pending Verification').length,
    scheduled: pets.filter((p) => p.status === 'Verification Scheduled').length,
    verified: pets.filter((p) => p.status === 'Verified').length,
    rejected: pets.filter((p) => p.status === 'Rejected').length,
    available: pets.filter((p) => p.status === 'Available for Adoption').length,
    total: pets.length,
  };

  return (
    <PetVerificationContext.Provider
      value={{
        pets,
        addPet,
        scheduleVerification,
        verifyPetPhysical,
        rejectPet,
        adminApproveListing,
        resetToSampleData,
        getPetById,
        getPublicAdoptionPets,
        stats,
      }}
    >
      {children}
    </PetVerificationContext.Provider>
  );
};

export const usePetVerification = () => {
  const context = useContext(PetVerificationContext);
  if (!context) {
    throw new Error('usePetVerification must be used within a PetVerificationProvider');
  }
  return context;
};

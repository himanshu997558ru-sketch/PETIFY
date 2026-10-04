export type PetVerificationStatus =
  | 'Pending Verification'
  | 'Verification Scheduled'
  | 'Verified' // Physical inspection passed, waiting for Admin Approval
  | 'Rejected'
  | 'Available for Adoption'; // Verified + Admin Approved (Publicly visible to adopters)

export interface PhysicalChecklist {
  existsAtShelter: boolean;
  detailsMatch: boolean;
  photoMatches: boolean;
  addressVerified: boolean;
  availableForAdoption: boolean;
  basicConditionVerified: boolean;
}

export interface VerificationScheduleDetails {
  officer: string;
  officerBadge?: string;
  visitDate: string;
  visitTime: string;
  visitLocation: string;
  notes: string;
  scheduledAt: string;
}

export interface PhysicalInspectionReport {
  checklist: PhysicalChecklist;
  verificationNotes: string;
  verificationDate: string;
  verificationOfficer: string;
  officerBadge: string;
  completedAt: string;
}

export interface AdminApprovalDetails {
  approvedBy: string;
  approvalDate: string;
  adminNotes?: string;
}

export interface RejectionDetails {
  reason: string;
  rejectedBy: string;
  rejectedAt: string;
  stage: 'Physical Verification' | 'Admin Review';
}

export interface VerificationHistoryEntry {
  stage: string;
  timestamp: string;
  actor: string;
  note: string;
}

export interface ShelterPet {
  id: string;
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
  submissionDate: string;
  status: PetVerificationStatus;
  scheduleDetails?: VerificationScheduleDetails;
  inspectionReport?: PhysicalInspectionReport;
  adminApproval?: AdminApprovalDetails;
  rejectionDetails?: RejectionDetails;
  history: VerificationHistoryEntry[];
}

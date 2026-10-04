export type ScreenType = 'login' | 'register' | 'adopter' | 'shelter' | 'admin' | 'inspector';

export type RoleType = 'adopter' | 'shelter';

export type VerificationStage =
  | 'SHELTER_REGISTRATION'
  | 'VERIFICATION_REQUESTED'
  | 'WORKER_ASSIGNED'
  | 'WORKER_VISITING'
  | 'PHYSICAL_VERIFICATION'
  | 'REPORT_UPLOADED'
  | 'ADMIN_REVIEW'
  | 'VERIFIED'
  | 'REJECTED';

export type ChecklistItemStatus = 'Pass' | 'Needs Improvement' | 'Fail' | 'Not Applicable';

export interface ChecklistItem {
  id: string;
  name: string;
  category: 'Facility' | 'Hygiene' | 'Animal Welfare' | 'Veterinary Care' | 'Safety';
  status: ChecklistItemStatus;
  notes?: string;
}

export interface CategoryScore {
  earned: number;
  total: number;
  percentage: number;
}

export interface InspectionAuditScores {
  facility: CategoryScore;
  hygiene: CategoryScore;
  animalWelfare: CategoryScore;
  veterinaryCare: CategoryScore;
  safety: CategoryScore;
  totalScore: number;
  maxScore: number;
  grade: string;
}

export type CameraPhotoCategory =
  | 'Shelter Front'
  | 'Entrance'
  | 'Animal Enclosure'
  | 'Food / Water Area'
  | 'Sanitation'
  | 'Veterinary / Medical Area'
  | 'Safety Equipment'
  | 'Additional Photos';

export interface InspectionEvidencePhoto {
  id: string;
  photoUrl: string;
  captureTime: string;
  verificationId: string;
  category: CameraPhotoCategory;
  caption?: string;
}

export interface ShelterDocumentItem {
  id: string;
  name: string;
  type: 'Registration Certificate' | 'Legal ID' | 'Address Proof' | 'Owner ID' | 'Other Supporting Documents';
  fileUrl?: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Submitted';
  size?: string;
}

export interface FieldWorker {
  id: string;
  name: string;
  designation: string;
  avatarUrl: string;
  phone: string;
  email: string;
  badgeNumber: string;
  specialty: string;
  region: string;
  activeAuditsCount: number;
}

export interface InspectionChecklist {
  enclosureSpace: boolean;
  climateVentilation: boolean;
  cleanWaterFood: boolean;
  quarantineIsolation: boolean;
  vetCareRecords: boolean;
  sanitationPestControl: boolean;
  staffRatioSafety: boolean;
  humaneTreatment: boolean;
}

export interface InspectionPhoto {
  id: string;
  caption: string;
  category: 'kennels' | 'medical' | 'play_area' | 'quarantine' | 'nutrition';
  imageUrl: string;
  timestamp: string;
}

export interface VerificationReport {
  reportId: string;
  workerId: string;
  workerName: string;
  workerBadge: string;
  visitDate: string;
  visitStartTime: string;
  visitEndTime: string;
  overallScore: number; // 0 - 100
  overallGrade: 'Grade A (Exemplary)' | 'Grade B (Compliant)' | 'Grade C (Conditional)' | 'Fail (Non-Compliant)';
  checklist: InspectionChecklist;
  checklistNotes: {
    enclosures: string;
    sanitation: string;
    medical: string;
    welfare: string;
  };
  photos: InspectionPhoto[];
  inspectorObservations: string;
  inspectorRecommendation: 'Recommend Verification' | 'Requires Rectification' | 'Recommend Rejection';
  workerSignature: string;
  uploadedAt: string;
  // Extended fields for complete 12-stage pipeline
  checkInTime?: string;
  checkOutTime?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
    address: string;
    confirmed: boolean;
  };
  evidencePhotos?: InspectionEvidencePhoto[];
  detailedChecklist?: ChecklistItem[];
  auditScores?: InspectionAuditScores;
  findings?: {
    positiveFindings: string[];
    issuesFound: string[];
    safetyConcerns: string[];
    hygieneConcerns: string[];
    animalWelfareConcerns: string[];
  };
  recommendations?: string[];
}

export interface ShelterRegistrationData {
  id: string;
  shelterName: string;
  legalRegNumber: string; // 501(c)(3) or NGO Reg No
  taxId: string;
  shelterType: 'Sanctuary' | 'Rescue Center' | 'Foster Network' | 'Municipal Partner';
  directorName: string;
  ownerName?: string;
  contactPhone: string;
  contactEmail: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  pincode?: string;
  animalCapacity: number;
  currentAnimalCount: number;
  speciesHandled: string[];
  facilities: string[];
  veterinarySupportDetails?: string;
  operatingHours?: string;
  shelterDescription?: string;
  documents?: ShelterDocumentItem[];
  licenseDocName?: string;
  sanitaryCertDocName?: string;
  registeredAt: string;
}

export interface VerifiedShelterBadge {
  badgeId: string;
  shelterId: string;
  shelterName: string;
  accreditationCode: string; // e.g. KP-VERIFIED-2025-8821 or KP-VERIFIED-2026-1309
  verificationId?: string;
  issueDate: string;
  validUntil: string;
  verificationOfficer: string;
  approvedByAdmin: string;
  facilityRating: string;
  verificationSeal?: string;
  status: 'ACTIVE' | 'ACCREDITED' | 'REVOKED' | 'EXPIRED';
}

export interface ReInspectionDetails {
  previousAuditScore: number;
  previousIssues: string[];
  requiredImprovements: string[];
  newVisitDate: string;
  assignedWorkerId: string;
  assignedWorkerName: string;
  reInspectionCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ShelterVerificationRequest {
  requestId: string;
  shelterId: string;
  shelter: ShelterRegistrationData;
  stage: VerificationStage;
  requestDate: string;
  priority: 'Normal' | 'High' | 'Expedited';
  assignedWorker: FieldWorker | null;
  scheduledVisitDate: string | null;
  scheduledVisitTime: string | null;
  adminAssignmentNotes: string | null;
  workerVisitStartedAt: string | null;
  report: VerificationReport | null;
  badge: VerifiedShelterBadge | null;
  reInspectionDetails?: ReInspectionDetails | null;
  adminReview: {
    reviewedBy: string;
    reviewedAt: string;
    decision: 'VERIFIED' | 'REJECTED' | 'RE_INSPECTION_REQUESTED';
    adminNotes: string;
    rejectionReasons?: string[];
    rectificationSteps?: string[];
  } | null;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  age: string;
  distance: string;
  description: string;
  imageUrl: string;
  tags: string[];
  medicalBadge: string;
  urgent?: boolean;
  isSaved?: boolean;
  status?: 'Available' | 'Foster Needed' | 'Application Pending' | 'Adopted';
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  breed: string;
  shelterName: string;
  submittedDate: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'info';
  currentStep: number; // 1: Review, 2: Phone Screening, 3: Meet & Greet, 4: Adoption
  steps: string[];
  petImageUrl: string;
  nextMilestone?: string;
  scheduledTime?: string;
}

export interface ShelterMessage {
  id: string;
  shelterName: string;
  timestamp: string;
  content: string;
  unread: boolean;
  avatarUrl?: string;
}

export interface SavedCompanion {
  id: string;
  name: string;
  breed: string;
  age: string;
  imageUrl: string;
}

export interface AdminLink {
  id: string;
  title: string;
  url: string;
  category: 'Accreditation' | 'Public Portal' | 'Adoptions' | 'Audits & Registry' | 'Emergency';
  accessLevel: 'Public' | 'Verified Shelters' | 'Admin & Auditors';
  description: string;
  visits: number;
  status: 'active' | 'paused';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  role: string;
  location: string;
  status: string;
  avatarUrl: string;
  livingSpace: string;
  activityLevel: string;
  currentPets: string;
  idVerification: string;
  verified: boolean;
}

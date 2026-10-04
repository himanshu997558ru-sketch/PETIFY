export type ChecklistRating = 'Pass' | 'Needs Improvement' | 'Fail' | 'Not Applicable';

export interface ChecklistItemDef {
  id: string;
  label: string;
  description: string;
  rating: ChecklistRating;
  notes?: string;
}

export interface InspectionChecklistCategory {
  categoryId: 'facility' | 'hygiene' | 'animalWelfare' | 'veterinaryCare' | 'safety';
  title: string;
  maxScore: number;
  items: ChecklistItemDef[];
}

export interface InspectionChecklistState {
  facility: ChecklistItemDef[];
  hygiene: ChecklistItemDef[];
  animalWelfare: ChecklistItemDef[];
  veterinaryCare: ChecklistItemDef[];
  safety: ChecklistItemDef[];
}

export interface CategoryScores {
  facility: number;
  hygiene: number;
  animalWelfare: number;
  veterinaryCare: number;
  safety: number;
  total: number;
}

export type CameraPhotoCategory =
  | 'Shelter Front'
  | 'Entrance'
  | 'Animal Enclosure'
  | 'Food/Water Area'
  | 'Sanitation'
  | 'Veterinary/Medical Area'
  | 'Safety Equipment'
  | 'Additional Photos';

export interface EvidencePhoto {
  id: string;
  category: CameraPhotoCategory;
  imageUrl: string;
  captureTime: string;
  verificationId: string;
  notes?: string;
}

export type DocumentCategory =
  | 'Registration Certificate'
  | 'Legal ID'
  | 'Address Proof'
  | 'Owner ID'
  | 'Other Supporting Documents';

export interface UploadedDocument {
  id: string;
  category: DocumentCategory;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
}

export interface ShelterRegistrationFormData {
  verificationId: string;
  shelterName: string;
  ownerName: string;
  email: string;
  phone: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  registrationNumber: string;
  legalId: string;
  shelterType: 'Sanctuary' | 'Rescue Center' | 'Foster Network' | 'Municipal Partner';
  animalCount: number;
  facilityCapacity: number;
  vetSupportDetails: string;
  operatingHours: string;
  description: string;
  documents: UploadedDocument[];
  submittedAt: string;
}

export interface FieldWorkerAssignment {
  officerName: string;
  officerId: string;
  contactNumber: string;
  email: string;
  badgeNumber: string;
  assignedShelter: string;
  visitDate: string;
  visitTime: string;
  visitStatus: 'Assigned' | 'Scheduled' | 'In Progress' | 'Completed' | 'Rescheduled';
  avatarUrl?: string;
  specialty?: string;
}

export interface CheckInDetails {
  gpsCoordinates: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
  shelterAddress: string;
  workerIdentity: string;
  verifiedGeofence: boolean;
  status: 'Checked In' | 'Pending Arrival' | 'Completed';
}

export interface VerificationReportData {
  verificationId: string;
  shelterName: string;
  workerName: string;
  workerBadge: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime: string;
  auditScore: number;
  categoryScores: CategoryScores;
  evidencePhotos: EvidencePhoto[];
  documents: UploadedDocument[];
  checklist: InspectionChecklistState;
  positiveFindings: string;
  issuesFound: string;
  safetyConcerns: string;
  hygieneConcerns: string;
  animalWelfareConcerns: string;
  recommendations: string;
  submittedAt?: string;
  status: 'Draft' | 'Report Submitted';
}

export interface AdminReviewData {
  decision?: 'Approve Verification' | 'Request Re-Inspection' | 'Reject Verification';
  reviewNote: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ReInspectionData {
  previousScore: number;
  previousIssues: string[];
  requiredImprovements: string[];
  newVisitDate: string;
  newVisitTime: string;
  assignedWorker: FieldWorkerAssignment;
  reInspectionStatus: 'Pending Visit' | 'In Progress' | 'Completed';
}

export interface VerifiedShelterBadgeData {
  status: 'ACCREDITED';
  badgeTitle: string; // '✓ VERIFIED SHELTER'
  badgeId: string; // 'KP-VERIFIED-2026-1309'
  verificationId: string;
  issueDate: string;
  validUntil: string; // '30 June 2026'
  verificationSeal: string;
  certificateNumber: string;
  approvedByAdmin: string;
  verificationOfficer: string;
  shelterName: string;
  score: number;
}

export type PipelineStageKey =
  | 'registration'
  | 'request'
  | 'assignment'
  | 'schedule'
  | 'fieldVisit'
  | 'camera'
  | 'checklist'
  | 'score'
  | 'report'
  | 'adminReview'
  | 'reInspection'
  | 'badge';

export interface FullPipelineRecord {
  verificationId: string;
  currentStage: PipelineStageKey;
  statusText: string;
  registration: ShelterRegistrationFormData;
  assignment: FieldWorkerAssignment;
  checkIn: CheckInDetails;
  photos: EvidencePhoto[];
  checklist: InspectionChecklistState;
  scores: CategoryScores;
  report: VerificationReportData;
  adminReview: AdminReviewData;
  reInspection: ReInspectionData;
  badge: VerifiedShelterBadgeData | null;
}

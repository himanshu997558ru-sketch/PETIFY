import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CameraPhotoCategory,
  ChecklistItem,
  ChecklistItemStatus,
  FieldWorker,
  InspectionAuditScores,
  InspectionChecklist,
  InspectionEvidencePhoto,
  InspectionPhoto,
  ReInspectionDetails,
  ShelterDocumentItem,
  ShelterRegistrationData,
  ShelterVerificationRequest,
  VerificationReport,
  VerificationStage,
  VerifiedShelterBadge,
} from '../types';

export interface ShelterVerificationContextType {
  requests: ShelterVerificationRequest[];
  fieldWorkers: FieldWorker[];
  activeRequestId: string | null;
  setActiveRequestId: (id: string | null) => void;
  getActiveRequest: () => ShelterVerificationRequest;
  getShelterRequest: (shelterNameOrId: string) => ShelterVerificationRequest | undefined;
  isShelterVerified: (shelterName: string) => boolean;
  getShelterBadge: (shelterName: string) => VerifiedShelterBadge | null;
  registerShelter: (data: Omit<ShelterRegistrationData, 'id' | 'registeredAt'> & { customRequestId?: string }) => string;
  updateShelterRegistration: (requestId: string, data: Partial<ShelterRegistrationData>) => void;
  assignFieldWorker: (
    requestId: string,
    workerId: string,
    scheduledDate: string,
    scheduledTime: string,
    notes: string
  ) => void;
  rescheduleVisit: (requestId: string, scheduledDate: string, scheduledTime: string, notes?: string) => void;
  changeWorker: (requestId: string, workerId: string) => void;
  startWorkerVisit: (requestId: string, checkInInfo?: { gpsLat: number; gpsLng: number; address: string; time: string }) => void;
  updatePhotoEvidence: (requestId: string, photos: InspectionEvidencePhoto[]) => void;
  updateChecklistItems: (requestId: string, items: ChecklistItem[]) => void;
  saveReportDraft: (requestId: string, reportData: Partial<VerificationReport>) => void;
  submitVerificationReport: (
    requestId: string,
    reportData: Partial<VerificationReport>
  ) => void;
  uploadVerificationReport: (
    requestId: string,
    reportData: any
  ) => void;
  reviewReport: (
    requestId: string,
    decision: 'VERIFIED' | 'REJECTED' | 'RE_INSPECTION_REQUESTED',
    adminNotes: string,
    rejectionReasons?: string[],
    rectificationSteps?: string[],
    reInspectionDate?: string
  ) => void;
  approveVerificationWithBadge: (
    requestId: string,
    badgeInfo?: { badgeId?: string; validUntil?: string; note?: string }
  ) => void;
  requestReInspection: (
    requestId: string,
    details: {
      previousAuditScore: number;
      previousIssues: string[];
      requiredImprovements: string[];
      newVisitDate: string;
      assignedWorkerId: string;
      adminNote?: string;
    }
  ) => void;
  scheduleReInspection: (
    requestId: string,
    details: any
  ) => void;
  reApplyVerification: (requestId: string) => void;
  fastTrackToStage: (requestId: string, targetStage: VerificationStage) => void;
}

export const INITIAL_FIELD_WORKERS: FieldWorker[] = [
  {
    id: 'fw-1',
    name: 'Officer Elena Rostova',
    designation: 'Senior Animal Welfare Inspector',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '(512) 555-0142',
    email: 'elena.rostova@petify-alliance.org',
    badgeNumber: 'PT-FW-042',
    specialty: 'Sanctuary Enclosures & Quarantine Protocol',
    region: 'Central Texas (Austin Metro)',
    activeAuditsCount: 2,
  },
  {
    id: 'fw-2',
    name: 'Dr. David Chen, DVM',
    designation: 'Veterinary Field Auditor & Welfare Lead',
    avatarUrl:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    phone: '(512) 555-0189',
    email: 'david.chen@petify-alliance.org',
    badgeNumber: 'PT-FW-077',
    specialty: 'Veterinary Care, Rabies Compliance & Medication Storage',
    region: 'Greater Austin & Hill Country',
    activeAuditsCount: 1,
  },
  {
    id: 'fw-3',
    name: 'Sarah Miller',
    designation: 'Certified Humane Habitat Specialist',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    phone: '(512) 555-0211',
    email: 'sarah.miller@petify-alliance.org',
    badgeNumber: 'PT-FW-095',
    specialty: 'Behavioral Enrichment & Staff-to-Animal Ratios',
    region: 'North Austin & Williamson County',
    activeAuditsCount: 3,
  },
];

export const INITIAL_CHECKLIST_TEMPLATE: ChecklistItem[] = [
  // Facility (5 items)
  { id: 'fac-1', name: 'Shelter structure', category: 'Facility', status: 'Pass', notes: 'Sound architectural perimeter with weather-tight roofing' },
  { id: 'fac-2', name: 'Proper enclosures', category: 'Facility', status: 'Needs Improvement', notes: 'Some kennel latches require adjustment' },
  { id: 'fac-3', name: 'Adequate space', category: 'Facility', status: 'Fail', notes: 'Over-capacity: 48 animals housed in space rated for 35' },
  { id: 'fac-4', name: 'Ventilation', category: 'Facility', status: 'Pass', notes: 'HVAC maintains continuous air exchanges' },
  { id: 'fac-5', name: 'Lighting', category: 'Facility', status: 'Pass', notes: 'Natural skylights plus LED daylight illumination' },

  // Hygiene (5 items)
  { id: 'hyg-1', name: 'Clean surroundings', category: 'Hygiene', status: 'Pass', notes: 'Grounds free of debris and well maintained' },
  { id: 'hyg-2', name: 'Waste management', category: 'Hygiene', status: 'Needs Improvement', notes: 'Runoff drainage trench in east run requires enzyme flush' },
  { id: 'hyg-3', name: 'Clean water', category: 'Hygiene', status: 'Pass', notes: 'Automatic freshwater dispensers operational' },
  { id: 'hyg-4', name: 'Food storage', category: 'Hygiene', status: 'Pass', notes: 'Food stored in elevated airtight containers' },
  { id: 'hyg-5', name: 'Sanitation', category: 'Hygiene', status: 'Needs Improvement', notes: 'Midday sanitization schedule not documented' },

  // Animal Welfare (5 items)
  { id: 'wel-1', name: 'Animal condition', category: 'Animal Welfare', status: 'Pass', notes: 'Active, well-fed, and responsive demeanor' },
  { id: 'wel-2', name: 'Feeding arrangements', category: 'Animal Welfare', status: 'Pass', notes: 'Portioned nutrition schedule per animal weight' },
  { id: 'wel-3', name: 'Drinking water', category: 'Animal Welfare', status: 'Pass', notes: 'Fresh water bowls in all pens' },
  { id: 'wel-4', name: 'Isolation area', category: 'Animal Welfare', status: 'Fail', notes: 'Quarantine room was utilized for general overflow housing' },
  { id: 'wel-5', name: 'Emergency care', category: 'Animal Welfare', status: 'Pass', notes: 'On-call emergency clinic contract active' },

  // Veterinary Care (4 items)
  { id: 'vet-1', name: 'Veterinary support', category: 'Veterinary Care', status: 'Pass', notes: 'Visiting veterinarian attends twice weekly' },
  { id: 'vet-2', name: 'Vaccination records', category: 'Veterinary Care', status: 'Needs Improvement', notes: '4 canine rabies tags pending physical filing' },
  { id: 'vet-3', name: 'Medical records', category: 'Veterinary Care', status: 'Fail', notes: 'Digital medication logs missing 2 days of entries' },
  { id: 'vet-4', name: 'Emergency treatment arrangement', category: 'Veterinary Care', status: 'Needs Improvement', notes: 'Transport crate for emergency van missing restraint strap' },

  // Safety (5 items)
  { id: 'saf-1', name: 'Secure boundaries', category: 'Safety', status: 'Needs Improvement', notes: 'Perimeter fence height adequate but north gate latch loose' },
  { id: 'saf-2', name: 'Fire safety', category: 'Safety', status: 'Fail', notes: 'Fire extinguisher in Annex B was past annual inspection' },
  { id: 'saf-3', name: 'Emergency exit', category: 'Safety', status: 'Pass', notes: 'Illuminated exit signage and unblocked pathways' },
  { id: 'saf-4', name: 'Animal safety', category: 'Safety', status: 'Needs Improvement', notes: 'Overcrowding increases stress and cross-kennel agitation' },
  { id: 'saf-5', name: 'Staff safety', category: 'Safety', status: 'Fail', notes: 'Only 1 staff handler on duty for 48 active dogs' },
];

export const INITIAL_EVIDENCE_PHOTOS: InspectionEvidencePhoto[] = [
  {
    id: 'ev-1',
    category: 'Shelter Front',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    captureTime: '10:05 AM',
    verificationId: 'VR-2025-105',
    caption: 'Metro Paws exterior entrance with address 310 Industrial Blvd clearly posted',
  },
  {
    id: 'ev-2',
    category: 'Entrance',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    captureTime: '10:14 AM',
    verificationId: 'VR-2025-105',
    caption: 'Public visitor intake desk and double security airlock door',
  },
  {
    id: 'ev-3',
    category: 'Animal Enclosure',
    photoUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    captureTime: '10:28 AM',
    verificationId: 'VR-2025-105',
    caption: 'Indoor kennels showing 48 dogs housed in 35-capacity designated area (Overcapacity)',
  },
  {
    id: 'ev-4',
    category: 'Food / Water Area',
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    captureTime: '10:45 AM',
    verificationId: 'VR-2025-105',
    caption: 'Airtight food storage containers and stainless steel hydration stations',
  },
  {
    id: 'ev-5',
    category: 'Sanitation',
    photoUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    captureTime: '11:02 AM',
    verificationId: 'VR-2025-105',
    caption: 'Sanitization wash bay and drainage trench in east run (needs enzyme flush upgrade)',
  },
  {
    id: 'ev-6',
    category: 'Veterinary / Medical Area',
    photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    captureTime: '11:25 AM',
    verificationId: 'VR-2025-105',
    caption: 'Quarantine & exam room currently occupied with overflow companion housing',
  },
  {
    id: 'ev-7',
    category: 'Safety Equipment',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    captureTime: '11:42 AM',
    verificationId: 'VR-2025-105',
    caption: 'Fire extinguisher in Annex B showing expired annual inspection sticker',
  },
  {
    id: 'ev-8',
    category: 'Additional Photos',
    photoUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    captureTime: '12:05 PM',
    verificationId: 'VR-2025-105',
    caption: 'Outdoor exercise yard with secure perimeter fencing (loose north latch)',
  },
];

export const INITIAL_METRO_DOCUMENTS: ShelterDocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Texas_501C3_Registration_Certificate_2025.pdf',
    type: 'Registration Certificate',
    uploadDate: '2025-05-02',
    status: 'Verified',
    size: '1.8 MB',
  },
  {
    id: 'doc-2',
    name: 'State_NonProfit_Articles_Incorporation.pdf',
    type: 'Legal ID',
    uploadDate: '2025-05-02',
    status: 'Verified',
    size: '2.4 MB',
  },
  {
    id: 'doc-3',
    name: 'Commercial_Lease_Industrial_Blvd.pdf',
    type: 'Address Proof',
    uploadDate: '2025-05-02',
    status: 'Verified',
    size: '3.1 MB',
  },
  {
    id: 'doc-4',
    name: 'Arthur_Vance_Govt_Issued_ID.pdf',
    type: 'Owner ID',
    uploadDate: '2025-05-02',
    status: 'Verified',
    size: '950 KB',
  },
  {
    id: 'doc-5',
    name: 'Travis_County_Kennel_Notice.pdf',
    type: 'Other Supporting Documents',
    uploadDate: '2025-05-02',
    status: 'Submitted',
    size: '1.2 MB',
  },
];

export const calculateScoresFromChecklist = (items: ChecklistItem[]): InspectionAuditScores => {
  const categories: Array<ChecklistItem['category']> = [
    'Facility',
    'Hygiene',
    'Animal Welfare',
    'Veterinary Care',
    'Safety',
  ];

  const catMap: Record<string, { earned: number; total: number; percentage: number }> = {};

  categories.forEach((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length === 0) {
      catMap[cat] = { earned: 0, total: 20, percentage: 0 };
      return;
    }
    const pointsPerItem = 20 / catItems.length;
    let earned = 0;
    catItems.forEach((i) => {
      if (i.status === 'Pass') earned += pointsPerItem;
      else if (i.status === 'Needs Improvement') earned += pointsPerItem * 0.5;
      else if (i.status === 'Not Applicable') earned += pointsPerItem * 0.75;
      // Fail gives 0 points
    });
    const roundedEarned = Math.round(earned);
    catMap[cat] = {
      earned: roundedEarned,
      total: 20,
      percentage: Math.round((roundedEarned / 20) * 100),
    };
  });

  // Calculate total
  const totalScore =
    catMap['Facility'].earned +
    catMap['Hygiene'].earned +
    catMap['Animal Welfare'].earned +
    catMap['Veterinary Care'].earned +
    catMap['Safety'].earned;

  let grade = 'Fail (Non-Compliant)';
  if (totalScore >= 85) grade = 'Grade A (Exemplary)';
  else if (totalScore >= 75) grade = 'Grade B (Compliant)';
  else if (totalScore >= 60) grade = 'Grade C (Conditional)';

  return {
    facility: catMap['Facility'],
    hygiene: catMap['Hygiene'],
    animalWelfare: catMap['Animal Welfare'],
    veterinaryCare: catMap['Veterinary Care'],
    safety: catMap['Safety'],
    totalScore,
    maxScore: 100,
    grade,
  };
};

const DEFAULT_AUDIT_SCORE_58: InspectionAuditScores = {
  facility: { earned: 15, total: 20, percentage: 75 },
  hygiene: { earned: 14, total: 20, percentage: 70 },
  animalWelfare: { earned: 16, total: 20, percentage: 80 },
  veterinaryCare: { earned: 7, total: 20, percentage: 35 },
  safety: { earned: 6, total: 20, percentage: 30 },
  totalScore: 58,
  maxScore: 100,
  grade: 'Fail (Non-Compliant - Requires Re-Inspection)',
};

const INITIAL_REQUESTS: ShelterVerificationRequest[] = [
  // Primary Target Request from User Prompt: VR-2025-105
  {
    requestId: 'VR-2025-105',
    shelterId: 'sh-metro-shelter',
    shelter: {
      id: 'sh-metro-shelter',
      shelterName: 'Metro Paws Sanctuary',
      legalRegNumber: 'TX-501C-1194',
      taxId: '74-9988112',
      shelterType: 'Rescue Center',
      directorName: 'Arthur Vance',
      ownerName: 'Arthur Vance',
      contactPhone: '(512) 555-9018',
      contactEmail: 'info@metropaws.org',
      streetAddress: '310 Industrial Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78745',
      pincode: '78745',
      animalCapacity: 35,
      currentAnimalCount: 48,
      speciesHandled: ['Dogs', 'Canine Rehabilitation'],
      facilities: ['Indoor Kennels', 'Intake Airlock', 'Quarantine Room', 'Outdoor Run'],
      veterinarySupportDetails: 'South Austin Veterinary Center on-call emergency partner & bi-weekly wellness checks',
      operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 3:00 PM',
      shelterDescription: 'Urban rescue sanctuary specializing in high-energy canine rehabilitation and stray rescue.',
      documents: INITIAL_METRO_DOCUMENTS,
      licenseDocName: 'Texas_501C3_Registration_Certificate_2025.pdf',
      sanitaryCertDocName: 'Travis_County_Kennel_Notice.pdf',
      registeredAt: '2025-05-02T10:00:00Z',
    },
    stage: 'ADMIN_REVIEW',
    requestDate: '2025-05-02',
    priority: 'High',
    assignedWorker: INITIAL_FIELD_WORKERS[0],
    scheduledVisitDate: '2025-05-10',
    scheduledVisitTime: '10:00 AM - 01:00 PM',
    adminAssignmentNotes: 'Verify capacity limit compliance, animal welfare ratios, and isolation containment protocols.',
    workerVisitStartedAt: '2025-05-10T10:00:00Z',
    report: {
      reportId: 'REP-2025-105',
      workerId: 'fw-1',
      workerName: 'Officer Elena Rostova',
      workerBadge: 'PT-FW-042',
      visitDate: '2025-05-10',
      visitStartTime: '10:00 AM',
      visitEndTime: '01:00 PM',
      checkInTime: '10:00 AM',
      checkOutTime: '01:00 PM',
      gpsLocation: {
        lat: 30.2241,
        lng: -97.7618,
        address: '310 Industrial Blvd, Austin, TX 78745',
        confirmed: true,
      },
      overallScore: 58,
      overallGrade: 'Fail (Non-Compliant)',
      checklist: {
        enclosureSpace: false,
        climateVentilation: true,
        cleanWaterFood: true,
        quarantineIsolation: false,
        vetCareRecords: false,
        sanitationPestControl: false,
        staffRatioSafety: false,
        humaneTreatment: true,
      },
      detailedChecklist: INITIAL_CHECKLIST_TEMPLATE,
      auditScores: DEFAULT_AUDIT_SCORE_58,
      checklistNotes: {
        enclosures: 'Over-capacity: 48 dogs housed in facility rated for 35. Stacking observed.',
        sanitation: 'Drainage needs overhaul in East kennel row.',
        medical: 'Quarantine ward was being utilized for general intake overflow.',
        welfare: 'Insufficient staff (only 1 attendant on duty for 48 active dogs).',
      },
      photos: INITIAL_EVIDENCE_PHOTOS.map((p) => ({
        id: p.id,
        caption: p.caption || '',
        category: 'kennels',
        imageUrl: p.photoUrl,
        timestamp: p.captureTime,
      })),
      evidencePhotos: INITIAL_EVIDENCE_PHOTOS,
      findings: {
        positiveFindings: [
          'Clean stainless steel water bowls with continuous freshwater circulation',
          'Animals are responsive, well-nourished, and exhibit positive social behaviors',
          'Active volunteer engagement and daily socialization logs maintained',
        ],
        issuesFound: [
          'Facility is 37% over licensed capacity (48 dogs housed in 35-capacity space)',
          'Staff-to-animal ratio below safety threshold (1 attendant on duty for 48 dogs)',
        ],
        safetyConcerns: [
          'Fire safety extinguisher in secondary wing was past annual certification',
          'Secondary containment gate latch requires reinforcement',
        ],
        hygieneConcerns: [
          'East kennel drainage runoff requires enzyme flush upgrade to prevent standing water',
        ],
        animalWelfareConcerns: [
          'Dedicated medical quarantine ward was repurposed for overflow intake',
        ],
      },
      recommendations: [
        'Reduce animal occupancy to or below licensed limit of 35 companions',
        'Restore dedicated medical isolation ward with physical containment',
        'Employ at least 2 full-time caretakers during operating intake hours',
        'Recertify all fire safety equipment and repair loose perimeter fence latch',
        'Request free Alliance re-inspection after 30 days of documented compliance',
      ],
      inspectorObservations:
        'Physical verification audit complete. While companion care and nourishment are compassionate, severe overcrowding (48/35) and loss of quarantine isolation necessitate a formal re-inspection before accredited badge issuance.',
      inspectorRecommendation: 'Requires Rectification',
      workerSignature: 'Officer Elena Rostova (PT-FW-042)',
      uploadedAt: '2025-05-10T14:30:00Z',
    },
    badge: null,
    reInspectionDetails: {
      previousAuditScore: 58,
      previousIssues: [
        'Facility exceeded licensed capacity by 37% (48 dogs housed in 35-dog facility)',
        'Quarantine isolation ward was compromised for overflow housing',
        'Staff-to-animal ratio below safety standard (1 worker per 48 animals)',
        'Expired fire safety certification in Annex B',
      ],
      requiredImprovements: [
        'Reduce animal occupancy to <= 35 companions',
        'Restore dedicated medical isolation containment ward',
        'Employ at least 2 full-time staff caretakers on duty',
        'Recertify fire extinguishers and secure north yard perimeter latch',
      ],
      newVisitDate: '2025-06-30',
      assignedWorkerId: 'fw-1',
      assignedWorkerName: 'Officer Elena Rostova',
      reInspectionCount: 1,
      status: 'SCHEDULED',
    },
    adminReview: {
      reviewedBy: 'Himanshu (Alliance Super Admin)',
      reviewedAt: '2025-05-11T11:00:00Z',
      decision: 'RE_INSPECTION_REQUESTED',
      adminNotes:
        'Accreditation withheld pending physical re-inspection. Facility must demonstrate reduced animal census (<=35) and restored quarantine isolation.',
      rejectionReasons: [
        'Facility exceeded licensed capacity by 37% (48 dogs housed in 35-dog facility)',
        'Quarantine isolation ward was compromised for overflow housing',
        'Staff-to-animal ratio below safety standard (1 worker per 48 animals)',
      ],
      rectificationSteps: [
        'Reduce animal occupancy to or below licensed limit of 35 companions',
        'Restore dedicated medical isolation ward with negative-pressure or physical containment',
        'Employ at least 2 full-time caretakers during operating intake hours',
        'Request free Alliance re-inspection after 30 days of documented compliance',
      ],
    },
  },
  {
    requestId: 'VR-2025-102',
    shelterId: 'sh-happy-paws',
    shelter: {
      id: 'sh-happy-paws',
      shelterName: 'Happy Paws Rescue & Sanctuary',
      legalRegNumber: 'TX-501C-8891',
      taxId: '74-1882903',
      shelterType: 'Sanctuary',
      directorName: 'Dr. Rebecca Moore',
      ownerName: 'Dr. Rebecca Moore',
      contactPhone: '(512) 555-8821',
      contactEmail: 'contact@happypaws.org',
      streetAddress: '1204 Highland Springs Way',
      city: 'Austin',
      state: 'TX',
      zipCode: '78746',
      pincode: '78746',
      animalCapacity: 80,
      currentAnimalCount: 56,
      speciesHandled: ['Dogs', 'Cats', 'Equine Support'],
      facilities: ['24/7 Vet Clinic', 'Agility Park', 'Feline Enrichment Lounge', 'Medical Quarantine'],
      licenseDocName: 'State_Accreditation_Certificate_2025.pdf',
      sanitaryCertDocName: 'Annual_Humane_Audit_A_Plus.pdf',
      registeredAt: '2025-01-12T11:00:00Z',
    },
    stage: 'VERIFIED',
    requestDate: '2025-01-12',
    priority: 'Normal',
    assignedWorker: INITIAL_FIELD_WORKERS[1],
    scheduledVisitDate: '2025-01-18',
    scheduledVisitTime: '09:30 AM',
    adminAssignmentNotes: 'Annual renewal inspection.',
    workerVisitStartedAt: '2025-01-18T09:30:00Z',
    report: {
      reportId: 'REP-2025-044',
      workerId: 'fw-2',
      workerName: 'Dr. David Chen, DVM',
      workerBadge: 'KP-FW-077',
      visitDate: '2025-01-18',
      visitStartTime: '09:30 AM',
      visitEndTime: '01:15 PM',
      overallScore: 98,
      overallGrade: 'Grade A (Exemplary)',
      checklist: {
        enclosureSpace: true,
        climateVentilation: true,
        cleanWaterFood: true,
        quarantineIsolation: true,
        vetCareRecords: true,
        sanitationPestControl: true,
        staffRatioSafety: true,
        humaneTreatment: true,
      },
      detailedChecklist: INITIAL_CHECKLIST_TEMPLATE.map((c) => ({ ...c, status: 'Pass' as ChecklistItemStatus })),
      auditScores: {
        facility: { earned: 20, total: 20, percentage: 100 },
        hygiene: { earned: 20, total: 20, percentage: 100 },
        animalWelfare: { earned: 20, total: 20, percentage: 100 },
        veterinaryCare: { earned: 19, total: 20, percentage: 95 },
        safety: { earned: 19, total: 20, percentage: 95 },
        totalScore: 98,
        maxScore: 100,
        grade: 'Grade A (Exemplary)',
      },
      checklistNotes: {
        enclosures: 'Exceptional hygiene, climate control maintained at 71°F, double barriers secure.',
        sanitation: 'Hospital-grade sanitization protocols and spotless waste management.',
        medical: 'Full veterinary surgical suite with automated pharmaceutical dispensary logs.',
        welfare: 'Calm animal demeanors, scheduled socialization and enrichment toys in all pens.',
      },
      photos: [],
      evidencePhotos: INITIAL_EVIDENCE_PHOTOS,
      inspectorObservations:
        'Happy Paws Rescue sets an outstanding benchmark for animal sheltering in Texas. Staff is highly qualified and veterinary standards exceed state minimums.',
      inspectorRecommendation: 'Recommend Verification',
      workerSignature: 'Dr. David Chen, DVM (KP-FW-077)',
      uploadedAt: '2025-01-18T14:20:00Z',
    },
    badge: {
      badgeId: 'KP-VERIFIED-2026-1309',
      shelterId: 'sh-happy-paws',
      shelterName: 'Happy Paws Rescue & Sanctuary',
      accreditationCode: 'KP-VERIFIED-2026-1309',
      verificationId: 'VR-2025-102',
      issueDate: '2025-01-20',
      validUntil: '30 June 2026',
      verificationOfficer: 'Dr. David Chen, DVM',
      approvedByAdmin: 'Himanshu (Alliance Super Admin)',
      facilityRating: '98/100 (Exemplary)',
      verificationSeal: 'Gold Alliance Seal of Humane Excellence',
      status: 'ACCREDITED',
    },
    reInspectionDetails: null,
    adminReview: {
      reviewedBy: 'Himanshu (Super Admin)',
      reviewedAt: '2025-01-20T16:00:00Z',
      decision: 'VERIFIED',
      adminNotes:
        'Flawless physical inspection report and stellar veterinary documentation. Official Verified Shelter Badge issued with gold accreditation seal.',
    },
  },
  {
    requestId: 'VR-2025-101',
    shelterId: 'sh-austin-rescue',
    shelter: {
      id: 'sh-austin-rescue',
      shelterName: 'Austin Pet Rescue Sanctuary',
      legalRegNumber: 'TX-501C-4421',
      taxId: '74-2991048',
      shelterType: 'Sanctuary',
      directorName: 'Marcus Sterling (Director)',
      contactPhone: '(512) 843-9921',
      contactEmail: 'adoptions@austinrescue.org',
      streetAddress: '428 Orchard Ridge Trail',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      pincode: '78704',
      animalCapacity: 65,
      currentAnimalCount: 42,
      speciesHandled: ['Dogs', 'Cats', 'Small Animals'],
      facilities: ['Indoor Kennels', 'Outdoor Play Run', 'Quarantine Ward', 'Exam Room'],
      licenseDocName: 'Texas_DSHS_Animal_Shelter_Permit_2025.pdf',
      sanitaryCertDocName: 'City_Austin_Health_Inspection_Passed.pdf',
      registeredAt: '2025-06-10T09:30:00Z',
    },
    stage: 'WORKER_ASSIGNED',
    requestDate: '2025-06-10',
    priority: 'High',
    assignedWorker: INITIAL_FIELD_WORKERS[0],
    scheduledVisitDate: '2025-06-25',
    scheduledVisitTime: '10:00 AM - 01:00 PM',
    adminAssignmentNotes:
      'Special focus on quarantine ward capacity and summer cooling systems in secondary kennel wing.',
    workerVisitStartedAt: null,
    report: null,
    badge: null,
    reInspectionDetails: null,
    adminReview: null,
  },
  {
    requestId: 'VR-2025-104',
    shelterId: 'sh-pine-valley',
    shelter: {
      id: 'sh-pine-valley',
      shelterName: 'Pine Valley Animal Haven',
      legalRegNumber: 'TX-501C-7741',
      taxId: '74-6019283',
      shelterType: 'Rescue Center',
      directorName: 'Marcus Sterling',
      contactPhone: '(555) 782-9011',
      contactEmail: 'adoptions@pinehaven.org',
      streetAddress: '428 Orchard Ridge Trail',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      pincode: '78701',
      animalCapacity: 40,
      currentAnimalCount: 22,
      speciesHandled: ['Dogs', 'Cats'],
      facilities: ['Indoor Kennels', 'Outdoor Yards', 'Intake Quarantine'],
      registeredAt: '2025-06-22T08:00:00Z',
    },
    stage: 'VERIFICATION_REQUESTED',
    requestDate: '2025-06-22',
    priority: 'Normal',
    assignedWorker: null,
    scheduledVisitDate: null,
    scheduledVisitTime: null,
    adminAssignmentNotes: null,
    workerVisitStartedAt: null,
    report: null,
    badge: null,
    reInspectionDetails: null,
    adminReview: null,
  },
];

const ShelterVerificationContext = createContext<ShelterVerificationContextType | undefined>(undefined);

export const ShelterVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ShelterVerificationRequest[]>(() => {
    const saved = localStorage.getItem('petify_shelter_verification_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved verification requests', e);
      }
    }
    return INITIAL_REQUESTS;
  });

  const [activeRequestId, setActiveRequestId] = useState<string | null>('VR-2025-105');

  useEffect(() => {
    localStorage.setItem('petify_shelter_verification_v4', JSON.stringify(requests));
  }, [requests]);

  const getActiveRequest = (): ShelterVerificationRequest => {
    return requests.find((r) => r.requestId === activeRequestId) || requests[0] || INITIAL_REQUESTS[0];
  };

  const getShelterRequest = (shelterNameOrId: string) => {
    const clean = shelterNameOrId.trim().toLowerCase();
    return requests.find(
      (r) =>
        r.shelterId.toLowerCase() === clean ||
        r.requestId.toLowerCase() === clean ||
        r.shelter.shelterName.toLowerCase().includes(clean) ||
        clean.includes(r.shelter.shelterName.toLowerCase())
    );
  };

  const isShelterVerified = (shelterName: string): boolean => {
    const req = getShelterRequest(shelterName);
    return req?.stage === 'VERIFIED' && req?.badge !== null;
  };

  const getShelterBadge = (shelterName: string): VerifiedShelterBadge | null => {
    const req = getShelterRequest(shelterName);
    return req?.badge || null;
  };

  // 1. Shelter Registration
  const registerShelter = (
    data: Omit<ShelterRegistrationData, 'id' | 'registeredAt'> & { customRequestId?: string }
  ): string => {
    const shelterId = `sh-${Date.now()}`;
    const requestId = data.customRequestId || `VR-2025-${Math.floor(200 + Math.random() * 800)}`;

    const newShelter: ShelterRegistrationData = {
      ...data,
      id: shelterId,
      registeredAt: new Date().toISOString(),
    };

    const newRequest: ShelterVerificationRequest = {
      requestId,
      shelterId,
      shelter: newShelter,
      stage: 'VERIFICATION_REQUESTED',
      requestDate: new Date().toISOString().split('T')[0],
      priority: 'Normal',
      assignedWorker: null,
      scheduledVisitDate: null,
      scheduledVisitTime: null,
      adminAssignmentNotes: null,
      workerVisitStartedAt: null,
      report: null,
      badge: null,
      reInspectionDetails: null,
      adminReview: null,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setActiveRequestId(requestId);
    return requestId;
  };

  const updateShelterRegistration = (requestId: string, data: Partial<ShelterRegistrationData>) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            shelter: {
              ...r.shelter,
              ...data,
            },
          };
        }
        return r;
      })
    );
  };

  // 2. Admin Assigns Field Worker
  const assignFieldWorker = (
    requestId: string,
    workerId: string,
    scheduledDate: string,
    scheduledTime: string,
    notes: string
  ) => {
    const worker = INITIAL_FIELD_WORKERS.find((w) => w.id === workerId) || INITIAL_FIELD_WORKERS[0];
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            stage: 'WORKER_ASSIGNED',
            assignedWorker: worker,
            scheduledVisitDate: scheduledDate,
            scheduledVisitTime: scheduledTime,
            adminAssignmentNotes: notes,
          };
        }
        return r;
      })
    );
  };

  const rescheduleVisit = (requestId: string, scheduledDate: string, scheduledTime: string, notes?: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            scheduledVisitDate: scheduledDate,
            scheduledVisitTime: scheduledTime,
            adminAssignmentNotes: notes || r.adminAssignmentNotes,
          };
        }
        return r;
      })
    );
  };

  const changeWorker = (requestId: string, workerId: string) => {
    const worker = INITIAL_FIELD_WORKERS.find((w) => w.id === workerId);
    if (!worker) return;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            assignedWorker: worker,
          };
        }
        return r;
      })
    );
  };

  // 3. Worker Starts Verification Visit (Check-in)
  const startWorkerVisit = (
    requestId: string,
    checkInInfo?: { gpsLat: number; gpsLng: number; address: string; time: string }
  ) => {
    const now = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          const existingReport = r.report;
          const updatedReport: VerificationReport = existingReport
            ? {
                ...existingReport,
                checkInTime: checkInInfo?.time || '10:00 AM',
                gpsLocation: {
                  lat: checkInInfo?.gpsLat || 30.2241,
                  lng: checkInInfo?.gpsLng || -97.7618,
                  address: checkInInfo?.address || r.shelter.streetAddress + ', ' + r.shelter.city,
                  confirmed: true,
                },
              }
            : {
                reportId: `REP-${Date.now().toString().slice(-6)}`,
                workerId: r.assignedWorker?.id || 'fw-1',
                workerName: r.assignedWorker?.name || 'Field Inspector',
                workerBadge: r.assignedWorker?.badgeNumber || 'PT-FW-042',
                visitDate: new Date().toISOString().split('T')[0],
                visitStartTime: checkInInfo?.time || '10:00 AM',
                visitEndTime: '01:00 PM',
                checkInTime: checkInInfo?.time || '10:00 AM',
                gpsLocation: {
                  lat: checkInInfo?.gpsLat || 30.2241,
                  lng: checkInInfo?.gpsLng || -97.7618,
                  address: checkInInfo?.address || r.shelter.streetAddress + ', ' + r.shelter.city,
                  confirmed: true,
                },
                overallScore: 58,
                overallGrade: 'Fail (Non-Compliant)',
                checklist: {
                  enclosureSpace: false,
                  climateVentilation: true,
                  cleanWaterFood: true,
                  quarantineIsolation: false,
                  vetCareRecords: false,
                  sanitationPestControl: false,
                  staffRatioSafety: false,
                  humaneTreatment: true,
                },
                detailedChecklist: INITIAL_CHECKLIST_TEMPLATE,
                auditScores: DEFAULT_AUDIT_SCORE_58,
                checklistNotes: {
                  enclosures: 'Pending inspection.',
                  sanitation: 'Pending inspection.',
                  medical: 'Pending inspection.',
                  welfare: 'Pending inspection.',
                },
                photos: [],
                evidencePhotos: INITIAL_EVIDENCE_PHOTOS,
                inspectorObservations: 'Visit initiated. Physical walkthrough in progress.',
                inspectorRecommendation: 'Requires Rectification',
                workerSignature: `${r.assignedWorker?.name || 'Field Inspector'} (${r.assignedWorker?.badgeNumber || 'PT-FW-042'})`,
                uploadedAt: now,
              };

          return {
            ...r,
            stage: 'WORKER_VISITING',
            workerVisitStartedAt: now,
            report: updatedReport,
          };
        }
        return r;
      })
    );
  };

  // 4. Update Photo Evidence
  const updatePhotoEvidence = (requestId: string, photos: InspectionEvidencePhoto[]) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId && r.report) {
          return {
            ...r,
            report: {
              ...r.report,
              evidencePhotos: photos,
              photos: photos.map((p) => ({
                id: p.id,
                caption: p.caption || '',
                category: 'kennels',
                imageUrl: p.photoUrl,
                timestamp: p.captureTime,
              })),
            },
          };
        }
        return r;
      })
    );
  };

  // 5. Update Checklist Items & Recalculate Scores
  const updateChecklistItems = (requestId: string, items: ChecklistItem[]) => {
    const scores = calculateScoresFromChecklist(items);
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId && r.report) {
          return {
            ...r,
            report: {
              ...r.report,
              detailedChecklist: items,
              auditScores: scores,
              overallScore: scores.totalScore,
              overallGrade: scores.grade as any,
            },
          };
        }
        return r;
      })
    );
  };

  // 6. Save Draft / Submit Report
  const saveReportDraft = (requestId: string, reportData: Partial<VerificationReport>) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId && r.report) {
          return {
            ...r,
            report: {
              ...r.report,
              ...reportData,
            },
          };
        }
        return r;
      })
    );
  };

  const submitVerificationReport = (requestId: string, reportData: Partial<VerificationReport>) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId && r.report) {
          const updatedReport: VerificationReport = {
            ...r.report,
            ...reportData,
            uploadedAt: new Date().toISOString(),
          };
          return {
            ...r,
            stage: 'REPORT_UPLOADED',
            report: updatedReport,
          };
        }
        return r;
      })
    );
  };

  // 7. Admin Review
  const reviewReport = (
    requestId: string,
    decision: 'VERIFIED' | 'REJECTED' | 'RE_INSPECTION_REQUESTED',
    adminNotes: string,
    rejectionReasons?: string[],
    rectificationSteps?: string[],
    reInspectionDate?: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          if (decision === 'VERIFIED') {
            const badgeId = `KP-VERIFIED-2026-1309`;
            const accreditationCode = `KP-VERIFIED-2026-1309`;
            const todayStr = new Date().toISOString().split('T')[0];

            const badge: VerifiedShelterBadge = {
              badgeId,
              shelterId: r.shelterId,
              shelterName: r.shelter.shelterName,
              accreditationCode,
              verificationId: r.requestId,
              issueDate: todayStr,
              validUntil: '30 June 2026',
              verificationOfficer: r.assignedWorker?.name || 'Officer Elena Rostova',
              approvedByAdmin: 'Himanshu (Alliance Super Admin)',
              facilityRating: `${r.report?.overallScore || 95}/100 (Accredited)`,
              verificationSeal: 'Gold Alliance Seal of Humane Excellence',
              status: 'ACCREDITED',
            };

            return {
              ...r,
              stage: 'VERIFIED',
              badge,
              adminReview: {
                reviewedBy: 'Himanshu (Super Admin)',
                reviewedAt: new Date().toISOString(),
                decision: 'VERIFIED',
                adminNotes: adminNotes || 'Physical inspection and standards criteria fully verified. Accredited Badge granted.',
              },
            };
          } else if (decision === 'RE_INSPECTION_REQUESTED') {
            const reDetails: ReInspectionDetails = {
              previousAuditScore: r.report?.overallScore || 58,
              previousIssues: rejectionReasons || [
                'Facility exceeded licensed capacity by 37% (48 dogs housed in 35-dog facility)',
                'Quarantine isolation ward was compromised for overflow housing',
                'Staff-to-animal ratio below safety standard (1 worker per 48 animals)',
              ],
              requiredImprovements: rectificationSteps || [
                'Reduce animal occupancy to <= 35 companions',
                'Restore dedicated medical isolation containment ward',
                'Employ at least 2 full-time staff caretakers on duty',
                'Recertify fire safety gear and repair loose fencing latch',
              ],
              newVisitDate: reInspectionDate || '2025-06-30',
              assignedWorkerId: r.assignedWorker?.id || 'fw-1',
              assignedWorkerName: r.assignedWorker?.name || 'Officer Elena Rostova',
              reInspectionCount: (r.reInspectionDetails?.reInspectionCount || 0) + 1,
              status: 'SCHEDULED',
            };

            return {
              ...r,
              stage: 'WORKER_ASSIGNED',
              scheduledVisitDate: reDetails.newVisitDate,
              reInspectionDetails: reDetails,
              adminReview: {
                reviewedBy: 'Himanshu (Super Admin)',
                reviewedAt: new Date().toISOString(),
                decision: 'RE_INSPECTION_REQUESTED',
                adminNotes: adminNotes || 'Re-inspection visit scheduled to verify correction of flagged issues.',
                rejectionReasons,
                rectificationSteps,
              },
            };
          } else {
            return {
              ...r,
              stage: 'REJECTED',
              badge: null,
              adminReview: {
                reviewedBy: 'Himanshu (Super Admin)',
                reviewedAt: new Date().toISOString(),
                decision: 'REJECTED',
                adminNotes: adminNotes || 'Verification rejected due to persistent non-compliance.',
                rejectionReasons,
                rectificationSteps,
              },
            };
          }
        }
        return r;
      })
    );
  };

  const approveVerificationWithBadge = (
    requestId: string,
    badgeInfo?: { badgeId?: string; validUntil?: string; note?: string }
  ) => {
    reviewReport(requestId, 'VERIFIED', badgeInfo?.note || 'Accreditation granted. Verified Shelter Badge issued.');
  };

  const requestReInspection = (
    requestId: string,
    details: {
      previousAuditScore: number;
      previousIssues: string[];
      requiredImprovements: string[];
      newVisitDate: string;
      assignedWorkerId: string;
      adminNote?: string;
    }
  ) => {
    reviewReport(
      requestId,
      'RE_INSPECTION_REQUESTED',
      details.adminNote || 'Re-inspection requested.',
      details.previousIssues,
      details.requiredImprovements,
      details.newVisitDate
    );
  };

  const reApplyVerification = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            stage: 'VERIFICATION_REQUESTED',
            requestDate: new Date().toISOString().split('T')[0],
            priority: 'High',
            assignedWorker: null,
            scheduledVisitDate: null,
            scheduledVisitTime: null,
            workerVisitStartedAt: null,
            report: null,
            badge: null,
            adminReview: null,
          };
        }
        return r;
      })
    );
  };

  const fastTrackToStage = (requestId: string, targetStage: VerificationStage) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.requestId === requestId) {
          return {
            ...r,
            stage: targetStage,
          };
        }
        return r;
      })
    );
  };

  return (
    <ShelterVerificationContext.Provider
      value={{
        requests,
        fieldWorkers: INITIAL_FIELD_WORKERS,
        activeRequestId,
        setActiveRequestId,
        getActiveRequest,
        getShelterRequest,
        isShelterVerified,
        getShelterBadge,
        registerShelter,
        updateShelterRegistration,
        assignFieldWorker,
        rescheduleVisit,
        changeWorker,
        startWorkerVisit,
        updatePhotoEvidence,
        updateChecklistItems,
        saveReportDraft,
        submitVerificationReport,
        uploadVerificationReport: submitVerificationReport,
        reviewReport,
        approveVerificationWithBadge,
        requestReInspection,
        scheduleReInspection: requestReInspection,
        reApplyVerification,
        fastTrackToStage,
      }}
    >
      {children}
    </ShelterVerificationContext.Provider>
  );
};

export const useShelterVerification = () => {
  const context = useContext(ShelterVerificationContext);
  if (!context) {
    throw new Error('useShelterVerification must be used within a ShelterVerificationProvider');
  }
  return context;
};

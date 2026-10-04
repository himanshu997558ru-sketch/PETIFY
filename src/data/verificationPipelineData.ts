import {
  CategoryScores,
  ChecklistItemDef,
  ChecklistRating,
  EvidencePhoto,
  FullPipelineRecord,
  InspectionChecklistState,
  UploadedDocument,
} from '../types/pipeline';

export const INITIAL_CHECKLIST_TEMPLATE: InspectionChecklistState = {
  facility: [
    {
      id: 'fac-1',
      label: 'Shelter structure',
      description: 'Solid weather-proof building structure with no structural defects or leaks',
      rating: 'Pass',
      notes: 'Main sanctuary building is structurally sound with reinforced insulation.',
    },
    {
      id: 'fac-2',
      label: 'Proper enclosures',
      description: 'Secure, clean, appropriately partitioned enclosures for individual species',
      rating: 'Pass',
      notes: 'Kennels have concrete dividers and high-gauge stainless wire.',
    },
    {
      id: 'fac-3',
      label: 'Adequate space',
      description: 'Sufficient square footage per animal allowing free movement and turning',
      rating: 'Needs Improvement',
      notes: 'Secondary room has stacked crates due to intake overflow.',
    },
    {
      id: 'fac-4',
      label: 'Ventilation',
      description: 'Fresh air circulation, minimal odor, and climate-controlled HVAC',
      rating: 'Pass',
      notes: 'Dual HVAC system with HEPA filters functioning normally.',
    },
    {
      id: 'fac-5',
      label: 'Lighting',
      description: 'Natural light exposure and adequate non-flickering artificial lighting',
      rating: 'Needs Improvement',
      notes: 'Back storage corridor lighting needs replacement bulbs.',
    },
  ],
  hygiene: [
    {
      id: 'hyg-1',
      label: 'Clean surroundings',
      description: 'Perimeter and grounds free of debris, standing water, and pests',
      rating: 'Pass',
      notes: 'Outdoor exercise yards are well raked and mowed.',
    },
    {
      id: 'hyg-2',
      label: 'Waste management',
      description: 'Daily sanitization, enclosed waste receptacles, and safe disposal',
      rating: 'Needs Improvement',
      notes: 'East drainage trough requires high-pressure descaling.',
    },
    {
      id: 'hyg-3',
      label: 'Clean water',
      description: 'Constant access to fresh potable water in clean sterilized bowls',
      rating: 'Pass',
      notes: 'Automatic waterers installed in 80% of dog runs.',
    },
    {
      id: 'hyg-4',
      label: 'Food storage',
      description: 'Airtight, rodent-proof containers kept off floor in climate control',
      rating: 'Pass',
      notes: 'Commercial Gamma2 Vittles Vaults used for dry kibble.',
    },
    {
      id: 'hyg-5',
      label: 'Sanitation',
      description: 'Veterinary-grade disinfectant protocol (Virkon/Rescue) logs maintained',
      rating: 'Needs Improvement',
      notes: 'Morning disinfection log had two missed signatures last week.',
    },
  ],
  animalWelfare: [
    {
      id: 'aw-1',
      label: 'Animal condition',
      description: 'Healthy coat, bright demeanor, appropriate body condition scores',
      rating: 'Pass',
      notes: 'Resident animals show good nutrition and active engagement.',
    },
    {
      id: 'aw-2',
      label: 'Feeding arrangements',
      description: 'Consistent feeding schedule, age/health-appropriate dietary regimens',
      rating: 'Pass',
      notes: 'Individual feeding charts posted on each kennel door.',
    },
    {
      id: 'aw-3',
      label: 'Drinking water',
      description: 'Unrestricted potable water monitored continuously for refills',
      rating: 'Pass',
      notes: 'Fresh hydration verified across all indoor and outdoor wards.',
    },
    {
      id: 'aw-4',
      label: 'Isolation area',
      description: 'Strict negative-pressure quarantine ward separated from general population',
      rating: 'Needs Improvement',
      notes: 'Isolation room has intake overflow instead of pure quarantine.',
    },
    {
      id: 'aw-5',
      label: 'Emergency care',
      description: 'On-call emergency triage kit and rapid veterinary transport vehicle',
      rating: 'Pass',
      notes: 'First aid kits fully stocked with expired items cleared out.',
    },
  ],
  veterinaryCare: [
    {
      id: 'vet-1',
      label: 'Veterinary support',
      description: 'Formal MOU or agreement with licensed veterinary hospital or staff DVM',
      rating: 'Needs Improvement',
      notes: 'Retainer contract with Dr. Chen is up for annual renewal.',
    },
    {
      id: 'vet-2',
      label: 'Vaccination records',
      description: '100% rabies, DHPP/FVRCP up to date with verifiable lot numbers',
      rating: 'Fail',
      notes: '8 recent intake dogs pending DHPP booster documentation.',
    },
    {
      id: 'vet-3',
      label: 'Medical records',
      description: 'Individual medical files containing deworming, spay/neuter, microchip',
      rating: 'Needs Improvement',
      notes: 'Paper files present but digital intake sync is behind by 2 weeks.',
    },
    {
      id: 'vet-4',
      label: 'Emergency treatment arrangement',
      description: '24/7 designated emergency clinic protocol with credit line',
      rating: 'Fail',
      notes: 'Emergency transport crate damaged; replacement on order.',
    },
    {
      id: 'vet-5',
      label: 'Prescription & Controlled Drug Storage',
      description: 'Lockable dual-key cabinet for prescription treatments and sedation',
      rating: 'Needs Improvement',
      notes: 'Medicine cabinet is locked but temperature log not posted.',
    },
  ],
  safety: [
    {
      id: 'saf-1',
      label: 'Secure boundaries',
      description: 'Double-gate airlock entry, 6ft+ non-climbable perimeter fencing',
      rating: 'Needs Improvement',
      notes: 'North perimeter chain link has a 3-inch gap under fence gate.',
    },
    {
      id: 'saf-2',
      label: 'Fire safety',
      description: 'Certified fire extinguishers inspected within 12 months, smoke alarms',
      rating: 'Fail',
      notes: 'Two extinguishers expired in March 2025; need immediate re-tagging.',
    },
    {
      id: 'saf-3',
      label: 'Emergency exit',
      description: 'Unobstructed emergency egress routes clearly marked with illuminated signs',
      rating: 'Fail',
      notes: 'Secondary rear exit blocked by empty transport carriers.',
    },
    {
      id: 'saf-4',
      label: 'Animal safety',
      description: 'No sharp edges, exposed wires, toxic plants, or swallowable hazards',
      rating: 'Pass',
      notes: 'Kennel hardware is countersunk; safe chew-proof construction.',
    },
    {
      id: 'saf-5',
      label: 'Staff safety',
      description: 'Personal protective equipment, bite gloves, catch poles, incident log',
      rating: 'Needs Improvement',
      notes: 'Heavy bite gloves worn out; new PPE set required for staff.',
    },
  ],
};

export const calculateScores = (checklist: InspectionChecklistState): CategoryScores => {
  const scoreCategory = (items: ChecklistItemDef[]): number => {
    if (!items || items.length === 0) return 0;
    let earned = 0;
    items.forEach((item) => {
      if (item.rating === 'Pass') earned += 4;
      else if (item.rating === 'Needs Improvement') earned += 2;
      else if (item.rating === 'Fail') earned += 0;
      else if (item.rating === 'Not Applicable') earned += 4; // Not penalized
    });
    return Math.min(20, Math.max(0, earned));
  };

  const facility = scoreCategory(checklist.facility);
  const hygiene = scoreCategory(checklist.hygiene);
  const animalWelfare = scoreCategory(checklist.animalWelfare);
  const veterinaryCare = scoreCategory(checklist.veterinaryCare);
  const safety = scoreCategory(checklist.safety);
  const total = facility + hygiene + animalWelfare + veterinaryCare + safety;

  return { facility, hygiene, animalWelfare, veterinaryCare, safety, total };
};

export const SAMPLE_DOCUMENTS_VR_105: UploadedDocument[] = [
  {
    id: 'doc-1',
    category: 'Registration Certificate',
    title: 'NGO 501(c)(3) State Registration Certificate',
    fileName: 'Texas_State_Animal_Sanctuary_Reg_2025.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '12 May 2025, 10:30 AM',
    status: 'Verified',
  },
  {
    id: 'doc-2',
    category: 'Legal ID',
    title: 'Government Entity Legal Identifier',
    fileName: 'Federal_EIN_Tax_Exemption_Letter.pdf',
    fileSize: '1.1 MB',
    uploadedAt: '12 May 2025, 10:35 AM',
    status: 'Verified',
  },
  {
    id: 'doc-3',
    category: 'Address Proof',
    title: 'Facility Lease & Municipal Zoning Approval',
    fileName: 'Commercial_Lease_Zoning_Permit_Austin.pdf',
    fileSize: '3.8 MB',
    uploadedAt: '12 May 2025, 10:40 AM',
    status: 'Verified',
  },
  {
    id: 'doc-4',
    category: 'Owner ID',
    title: 'Director Government Identification Proof',
    fileName: 'Director_Govt_Photo_Identity_Card.pdf',
    fileSize: '950 KB',
    uploadedAt: '12 May 2025, 10:45 AM',
    status: 'Verified',
  },
  {
    id: 'doc-5',
    category: 'Other Supporting Documents',
    title: 'Veterinary MOU & Annual Health Audit Protocol',
    fileName: 'Veterinary_Partnership_MOU_DrChen.pdf',
    fileSize: '1.6 MB',
    uploadedAt: '12 May 2025, 10:50 AM',
    status: 'Pending Review',
  },
];

export const SAMPLE_PHOTOS_VR_105: EvidencePhoto[] = [
  {
    id: 'photo-front',
    category: 'Shelter Front',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
    captureTime: '10:05 AM',
    verificationId: 'VR-2025-105',
    notes: 'Exterior facade with signage and welcoming reception area.',
  },
  {
    id: 'photo-entrance',
    category: 'Entrance',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
    captureTime: '10:12 AM',
    verificationId: 'VR-2025-105',
    notes: 'Secure double-gated security airlock entrance to prevent escapes.',
  },
  {
    id: 'photo-enclosure',
    category: 'Animal Enclosure',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
    captureTime: '10:25 AM',
    verificationId: 'VR-2025-105',
    notes: 'Indoor climate-controlled kennels with raised cots and clean blankets.',
  },
  {
    id: 'photo-nutrition',
    category: 'Food/Water Area',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
    captureTime: '10:40 AM',
    verificationId: 'VR-2025-105',
    notes: 'Airtight food silos and continuous freshwater circulation station.',
  },
  {
    id: 'photo-sanitation',
    category: 'Sanitation',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80',
    captureTime: '11:00 AM',
    verificationId: 'VR-2025-105',
    notes: 'Disinfection spray station with hospital-grade Virkon-S sanitizer.',
  },
  {
    id: 'photo-medical',
    category: 'Veterinary/Medical Area',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
    captureTime: '11:20 AM',
    verificationId: 'VR-2025-105',
    notes: 'Examination table, scale, vaccine refrigerator, and lockable storage.',
  },
  {
    id: 'photo-safety',
    category: 'Safety Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    captureTime: '11:35 AM',
    verificationId: 'VR-2025-105',
    notes: 'Emergency eye-wash unit, fire extinguisher, and PPE station.',
  },
  {
    id: 'photo-extra',
    category: 'Additional Photos',
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=80',
    captureTime: '11:50 AM',
    verificationId: 'VR-2025-105',
    notes: 'Outdoor socialization dog run with shaded canopies and agility ramps.',
  },
];

export const SEEDED_RECORD_VR_105: FullPipelineRecord = {
  verificationId: 'VR-2025-105',
  currentStage: 'score',
  statusText: 'Audit Score Calculated (58/100) — Ready for Review',
  registration: {
    verificationId: 'VR-2025-105',
    shelterName: 'Metro Paws Sanctuary & Animal Rescue',
    ownerName: 'Arthur Vance (Executive Director)',
    email: 'director@metropaws.org',
    phone: '+1 (512) 555-9018',
    fullAddress: '310 Industrial Blvd, Suite B',
    city: 'Austin',
    state: 'TX',
    pincode: '78745',
    registrationNumber: 'TX-501C-1194',
    legalId: 'EIN-74-9988112',
    shelterType: 'Rescue Center',
    animalCount: 48,
    facilityCapacity: 35,
    vetSupportDetails: 'Retainer agreement with Dr. David Chen, DVM (Austin Hill Country Vet Clinic)',
    operatingHours: '08:00 AM - 07:00 PM (Monday - Sunday)',
    description:
      'Non-profit companion animal rescue dedicated to intake, medical rehabilitation, and finding forever homes for abandoned dogs and cats across Central Texas.',
    documents: SAMPLE_DOCUMENTS_VR_105,
    submittedAt: '12 May 2025, 11:00 AM',
  },
  assignment: {
    officerName: 'Officer Elena Rostova',
    officerId: 'FW-042',
    contactNumber: '+1 (512) 555-0142',
    email: 'elena.rostova@petify-alliance.org',
    badgeNumber: 'KP-FW-042',
    assignedShelter: 'Metro Paws Sanctuary & Animal Rescue',
    visitDate: '2025-05-18',
    visitTime: '10:00 AM - 01:30 PM',
    visitStatus: 'Completed',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    specialty: 'Sanctuary Enclosures & Quarantine Protocol',
  },
  checkIn: {
    gpsCoordinates: '30.2241° N, 97.7712° W',
    latitude: 30.2241,
    longitude: -97.7712,
    checkInTime: '18 May 2025, 10:02 AM CDT',
    shelterAddress: '310 Industrial Blvd, Suite B, Austin, TX 78745',
    workerIdentity: 'Officer Elena Rostova (KP-FW-042)',
    verifiedGeofence: true,
    status: 'Checked In',
  },
  photos: SAMPLE_PHOTOS_VR_105,
  checklist: INITIAL_CHECKLIST_TEMPLATE,
  scores: {
    facility: 15,
    hygiene: 14,
    animalWelfare: 16,
    veterinaryCare: 7,
    safety: 6,
    total: 58,
  },
  report: {
    verificationId: 'VR-2025-105',
    shelterName: 'Metro Paws Sanctuary & Animal Rescue',
    workerName: 'Officer Elena Rostova',
    workerBadge: 'KP-FW-042',
    visitDate: '18 May 2025',
    checkInTime: '10:02 AM',
    checkOutTime: '01:30 PM',
    auditScore: 58,
    categoryScores: {
      facility: 15,
      hygiene: 14,
      animalWelfare: 16,
      veterinaryCare: 7,
      safety: 6,
      total: 58,
    },
    evidencePhotos: SAMPLE_PHOTOS_VR_105,
    documents: SAMPLE_DOCUMENTS_VR_105,
    checklist: INITIAL_CHECKLIST_TEMPLATE,
    positiveFindings:
      'Care staff is genuinely passionate and caring. Animals are clean, active, and regularly walked. Food storage and daily hydration stations meet high standards.',
    issuesFound:
      'Facility houses 48 dogs in a licensed 35-capacity zone (37% overcapacity). Secondary rear emergency exit blocked with crate storage. Expired fire extinguishers on wall.',
    safetyConcerns:
      'Fire extinguishers overdue for certification. Gap under North perimeter fence requires ground mesh to eliminate escape risks.',
    hygieneConcerns:
      'East kennel drainage trough needs high-pressure cleanout. Morning sanitization log missing staff sign-offs.',
    animalWelfareConcerns:
      'Quarantine area used as general intake spillover; requires strict isolation partitioning before accepting new rescues.',
    recommendations:
      '1. Implement foster network placement to bring on-site count down to 35 dogs max.\n2. Clear rear exit immediately and recertify fire extinguishers.\n3. Restore quarantine isolation protocol exclusively for sick/incoming animals.\n4. Re-inspect within 14 days after rectifications.',
    submittedAt: '18 May 2025, 02:15 PM',
    status: 'Report Submitted',
  },
  adminReview: {
    decision: 'Request Re-Inspection',
    reviewNote:
      'Shelter exhibits strong animal care fundamentals, but overcrowding and fire safety infractions must be resolved before full Alliance accreditation can be granted.',
    reviewedAt: '19 May 2025, 11:30 AM',
    reviewedBy: 'Alliance Admin (Himanshu)',
  },
  reInspection: {
    previousScore: 58,
    previousIssues: [
      'Over-capacity: 48 animals housed in 35-capacity facility (37% over capacity)',
      'Fire safety: Two expired fire extinguishers and obstructed rear exit',
      'Veterinary care: Isolation ward compromised with intake overflow',
      'Perimeter security: 3-inch gap under North yard fence',
    ],
    requiredImprovements: [
      'Foster off-load at least 13 animals to meet licensed 35-capacity limit',
      'Install freshly certified Class A/B/C fire extinguishers and clear rear exit path',
      'Sanitize and dedicate isolation ward with negative pressure protocol',
      'Reinforce North perimeter ground fence with galvanized tension wire',
    ],
    newVisitDate: '2025-06-02',
    newVisitTime: '10:30 AM',
    assignedWorker: {
      officerName: 'Officer Elena Rostova',
      officerId: 'FW-042',
      contactNumber: '+1 (512) 555-0142',
      email: 'elena.rostova@petify-alliance.org',
      badgeNumber: 'KP-FW-042',
      assignedShelter: 'Metro Paws Sanctuary & Animal Rescue',
      visitDate: '2025-06-02',
      visitTime: '10:30 AM',
      visitStatus: 'Scheduled',
    },
    reInspectionStatus: 'Pending Visit',
  },
  badge: {
    status: 'ACCREDITED',
    badgeTitle: '✓ VERIFIED SHELTER',
    badgeId: 'KP-VERIFIED-2026-1309',
    verificationId: 'VR-2025-105',
    issueDate: '02 June 2025',
    validUntil: '30 June 2026',
    verificationSeal: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    certificateNumber: 'CERT-KP-2026-8812',
    approvedByAdmin: 'Alliance Super Admin (Himanshu)',
    verificationOfficer: 'Officer Elena Rostova (KP-FW-042)',
    shelterName: 'Metro Paws Sanctuary & Animal Rescue',
    score: 94,
  },
};

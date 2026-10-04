import { AdoptionApplication, Pet, SavedCompanion, ShelterMessage, UserProfile } from '../types';

export const KIN_PAWS_LOGO = '/petify-logo.svg';

export const PETIFY_LOGO = '/petify-logo.svg';

export const DEFAULT_USER: UserProfile = {
  name: 'Sarah Jenkins',
  role: 'Active Adopter',
  location: 'Austin, TX',
  status: 'Active Adopter',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  livingSpace: 'House (Fenced Backyard)',
  activityLevel: 'Moderate Daily Walks',
  currentPets: 'None (Pet-Ready)',
  idVerification: 'Level 3 Verified',
  verified: true,
};

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'app-milo',
    petId: 'pet-milo',
    petName: 'Milo',
    breed: 'Australian Shepherd Mix',
    shelterName: 'Austin Pet Rescue',
    submittedDate: 'Submitted Oct 14',
    status: 'Interview Scheduled',
    statusVariant: 'success',
    currentStep: 3, // 1. Review, 2. Phone Screening, 3. Meet & Greet, 4. Adoption
    steps: ['1. Review', '2. Phone Screening', '3. Meet & Greet', '4. Adoption'],
    petImageUrl:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
    nextMilestone: 'Meet & Greet with Milo',
    scheduledTime: 'Saturday, 11:30 AM • Austin Pet Rescue',
  },
  {
    id: 'app-juniper',
    petId: 'pet-juniper',
    petName: 'Juniper',
    breed: 'Domestic Shorthair (Calico)',
    shelterName: 'Cedar Creek Animal Haven',
    submittedDate: 'Submitted Oct 22',
    status: 'Under Review',
    statusVariant: 'warning',
    currentStep: 1, // 1. Review
    steps: ['1. Review', '2. Phone Screening', '3. Meet & Greet', '4. Adoption'],
    petImageUrl:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=300&q=80',
  },
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-bella',
    name: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2.5 yrs old',
    distance: '8 miles away',
    description:
      'Affectionate, house-trained gentle companion who loves fetch and quiet evening cuddles on the rug.',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80',
    tags: ['Urgent Foster', 'Good with Kids'],
    medicalBadge: 'Fully Vaccinated',
    urgent: true,
    isSaved: false,
    status: 'Foster Needed',
  },
  {
    id: 'pet-oliver',
    name: 'Oliver',
    species: 'Cat',
    breed: 'Persian',
    age: '1.5 yrs old',
    distance: '14 miles away',
    description:
      'Curious, sweet Persian purr machine who adores window perches and peaceful, low-noise apartment environments. Origin: Persia (Iran), 12–17 yrs lifespan.',
    imageUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80',
    tags: ['Persian Standard', 'Calm Energy'],
    medicalBadge: 'Neutered & Microchipped',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
  {
    id: 'pet-cleo',
    name: 'Cleo',
    species: 'Cat',
    breed: 'Siamese',
    age: '2 yrs old',
    distance: '9 miles away',
    description:
      'Vocal and affectionate Siamese beauty from Thailand (12–20 yrs lifespan). Striking blue eyes and deeply interactive personality.',
    imageUrl:
      'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=900&q=80',
    tags: ['Siamese Breed', 'Highly Social'],
    medicalBadge: 'Vaccinated & Chipped',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
  {
    id: 'pet-barnaby-cat',
    name: 'Barnaby',
    species: 'Cat',
    breed: 'Maine Coon',
    age: '3 yrs old',
    distance: '5 miles away',
    description:
      'Gentle giant Maine Coon originating from USA (10–13 yrs lifespan). Incredibly loyal, tufted ears, loves human companion cuddles.',
    imageUrl:
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=900&q=80',
    tags: ['Maine Coon Standard', 'Kid Friendly'],
    medicalBadge: 'Neutered & Microchipped',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
  {
    id: 'pet-mochi',
    name: 'Mochi',
    species: 'Cat',
    breed: 'Ragdoll',
    age: '1 yr old',
    distance: '11 miles away',
    description:
      'Extremely docile and affectionate Ragdoll from USA (12–17 yrs lifespan). Silky coat, collapses comfortably in your arms.',
    imageUrl:
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=900&q=80',
    tags: ['Ragdoll Breed', 'Plush & Gentle'],
    medicalBadge: 'Vaccinated & Healed',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
  {
    id: 'pet-copper',
    name: 'Copper',
    species: 'Dog',
    breed: 'Beagle & Hound Mix',
    age: '3 yrs old',
    distance: '12 miles away',
    description:
      'Gentle natured, scent-hound curiosity with a loving demeanor. Great on nature trails and loves chew bones.',
    imageUrl:
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=900&q=80',
    tags: ['Leash Trained', 'Friendly with Dogs'],
    medicalBadge: 'Vaccinated & Heartworm Free',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
  {
    id: 'pet-clover',
    name: 'Clover',
    species: 'Cat',
    breed: 'British Shorthair',
    age: '2 yrs old',
    distance: '19 miles away',
    description:
      'Crisp plush British Shorthair from England, UK (12–17 yrs lifespan). Silky emerald-eyed sweetheart who seeks gentle brushing.',
    imageUrl:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80',
    tags: ['British Shorthair', 'Quiet Home'],
    medicalBadge: 'Spayed & Vaccinated',
    urgent: false,
    isSaved: false,
    status: 'Available',
  },
];

export const INITIAL_MESSAGES: ShelterMessage[] = [
  {
    id: 'msg-1',
    shelterName: 'Austin Pet Rescue',
    timestamp: '10:42 AM',
    content:
      '"Hi Sarah! We reviewed your yard specs and Milo is going to thrive. We\'re excited for Saturday\'s meet!"',
    unread: true,
  },
  {
    id: 'msg-2',
    shelterName: 'Cedar Creek Haven',
    timestamp: 'Yesterday',
    content:
      '"Your landlord confirmation for Juniper has been processed successfully."',
    unread: false,
  },
];

export const INITIAL_SAVED_COMPANIONS: SavedCompanion[] = [
  {
    id: 'saved-rusty',
    name: 'Rusty',
    breed: 'Basset Hound',
    age: '4 yrs',
    imageUrl:
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'saved-shadow',
    name: 'Shadow',
    breed: 'Domestic Short',
    age: '6 mos',
    imageUrl:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=80',
  },
];

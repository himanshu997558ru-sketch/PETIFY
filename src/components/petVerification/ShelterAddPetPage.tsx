import React, { useState } from 'react';
import { usePetVerification } from '../../context/PetVerificationContext';
import {
  PawPrint,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Image as ImageIcon,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ShelterAddPetPageProps {
  onPetSubmitted?: (petId: string) => void;
  onGoToMyPets?: () => void;
}

const PRESET_SAMPLE_PHOTOS = [
  {
    label: 'Golden Retriever Dog',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    type: 'Dog' as const,
    breed: 'Golden Retriever',
  },
  {
    label: 'Tuxedo Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    type: 'Cat' as const,
    breed: 'Domestic Short Hair (Tuxedo)',
  },
  {
    label: 'Husky / Shepherd Mix',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    type: 'Dog' as const,
    breed: 'Husky Shepherd Mix',
  },
  {
    label: 'Calico Cat',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    type: 'Cat' as const,
    breed: 'Calico Shorthair',
  },
  {
    label: 'Mini Holland Lop Rabbit',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
    type: 'Rabbit' as const,
    breed: 'Holland Lop Rabbit',
  },
];

export const ShelterAddPetPage: React.FC<ShelterAddPetPageProps> = ({
  onPetSubmitted,
  onGoToMyPets,
}) => {
  const { addPet } = usePetVerification();

  // Form State
  const [photoUrl, setPhotoUrl] = useState(PRESET_SAMPLE_PHOTOS[0].url);
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [location, setLocation] = useState('Austin, TX');
  const [description, setDescription] = useState('');
  const [shelterName, setShelterName] = useState('Austin Pet Rescue Sanctuary');
  const [shelterAddress, setShelterAddress] = useState('4820 Compassion Way, Austin, TX 78745');
  const [shelterContact, setShelterContact] = useState('(512) 555-0199');

  // Submission Feedback State
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [newlyCreatedPetId, setNewlyCreatedPetId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectPreset = (preset: (typeof PRESET_SAMPLE_PHOTOS)[0]) => {
    setPhotoUrl(preset.url);
    setPetType(preset.type);
    if (!breed) setBreed(preset.breed);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Pet Name is required';
    if (!breed.trim()) errs.breed = 'Breed is required';
    if (!age.trim()) errs.age = 'Age is required (e.g. 2 years, 6 months)';
    if (!location.trim()) errs.location = 'Location is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!shelterName.trim()) errs.shelterName = 'Shelter Name is required';
    if (!shelterAddress.trim()) errs.shelterAddress = 'Shelter Address is required';
    if (!shelterContact.trim()) errs.shelterContact = 'Shelter Contact Number is required';
    if (!photoUrl.trim()) errs.photoUrl = 'Pet Photo is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const createdPet = addPet({
      name,
      petType,
      breed,
      age,
      gender,
      location,
      description,
      photoUrl,
      shelterName,
      shelterAddress,
      shelterContact,
    });

    setNewlyCreatedPetId(createdPet.id);
    setSubmittedMessage(
      'Pet successfully submitted. Our verification team will physically verify this pet before it becomes available for adoption.'
    );

    if (onPetSubmitted) {
      onPetSubmitted(createdPet.id);
    }
  };

  const handleResetForm = () => {
    setName('');
    setBreed('');
    setAge('');
    setDescription('');
    setSubmittedMessage(null);
    setNewlyCreatedPetId(null);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header breadcrumb & title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Shelter Operations</span>
          <span aria-hidden="true">·</span>
          <span>Pet Registration</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-900 font-semibold">Verification Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Add Pet for Adoption
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Submit pet companion information for physical on-site verification. Once submitted, our authorized
          welfare team schedules an in-person audit at your shelter before public listing.
        </p>
      </div>

      {/* Mandatory Verification Policy Banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold text-amber-950">Petify Physical Verification Guarantee</p>
          <p className="mt-0.5">
            <strong>Rule:</strong> Newly added pets are assigned the initial status of{' '}
            <span className="font-semibold text-amber-900">Pending Verification</span>. No pet will be displayed to
            public adopters until an accredited verification officer conducts an in-person physical audit and
            super admin grants final listing approval.
          </p>
        </div>
      </div>

      {/* Success Notification Box (Shows required message) */}
      {submittedMessage && (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-emerald-950">
                Submission Queued for Physical Verification
              </h3>
              <p className="text-sm font-medium text-emerald-900 mt-1 leading-relaxed bg-white/60 p-3 rounded-xl border border-emerald-200/60">
                “{submittedMessage}”
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-800 font-semibold">Initial Status:</span>
                  <StatusBadge status="Pending Verification" />
                </div>
                {newlyCreatedPetId && (
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    ID: {newlyCreatedPetId}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {onGoToMyPets && (
                  <button
                    type="button"
                    onClick={onGoToMyPets}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <span>View in My Pets Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
                >
                  Submit Another Pet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Section 1: Pet Identification & Media */}
        <div>
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-emerald-700" />
            <span>1. Pet Details</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Photo Input & Preview */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Pet Photo <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-36 h-36 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 relative group">
                  <img
                    src={photoUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'}
                    alt="Pet Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                    Live Preview
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.example.com/pet-photo.jpg"
                      className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    {errors.photoUrl && <p className="text-xs text-rose-600 mt-1">{errors.photoUrl}</p>}
                    <p className="text-[11px] text-slate-500 mt-1">
                      Must match physical animal during inspection visit. Enter direct image URL or choose preset:
                    </p>
                  </div>

                  {/* Quick Preset Selector for Easy Testing */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Quick Preset Pets for Testing:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                            photoUrl === preset.url
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pet Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bella"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Pet Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pet Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Breed <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.breed && <p className="text-xs text-rose-600 mt-1">{errors.breed}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 2 years or 8 months"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'Male'}
                    onChange={() => setGender('Male')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'Female'}
                    onChange={() => setGender('Female')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State (e.g. Austin, TX)"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description & Behavioral Background <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe pet temperament, medical status, training level, background story..."
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Shelter Contact & Physical Location */}
        <div>
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>2. Shelter Verification Facility Details</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Auditors will verify that the pet is physically present at this specific shelter address.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shelter Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shelter Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                placeholder="e.g. Austin Pet Rescue Sanctuary"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.shelterName && <p className="text-xs text-rose-600 mt-1">{errors.shelterName}</p>}
            </div>

            {/* Shelter Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shelter Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={shelterAddress}
                onChange={(e) => setShelterAddress(e.target.value)}
                placeholder="e.g. 4820 Compassion Way, Austin, TX 78745"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.shelterAddress && <p className="text-xs text-rose-600 mt-1">{errors.shelterAddress}</p>}
            </div>

            {/* Shelter Contact Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shelter Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={shelterContact}
                onChange={(e) => setShelterContact(e.target.value)}
                placeholder="e.g. (512) 555-0199"
                className="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.shelterContact && <p className="text-xs text-rose-600 mt-1">{errors.shelterContact}</p>}
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Submitting will immediately set initial status to Pending Verification</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Submit for Verification</span>
          </button>
        </div>
      </form>
    </div>
  );
};

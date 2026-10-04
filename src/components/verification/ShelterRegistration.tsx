import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Heart,
  Stethoscope,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';
import { ShelterDocumentItem, ShelterRegistrationData } from '../../types';

interface ShelterRegistrationProps {
  requestId?: string;
  onSubmitted?: (requestId: string) => void;
  onNext?: () => void;
}

export const ShelterRegistration: React.FC<ShelterRegistrationProps> = ({
  requestId = 'VR-2025-105',
  onSubmitted,
  onNext,
}) => {
  const { requests, updateShelterRegistration, registerShelter, setActiveRequestId } = useShelterVerification();

  const currentReq = requests.find((r) => r.requestId === requestId) || requests[0];
  const s = currentReq?.shelter;

  // Form states initialized with current request data (VR-2025-105 by default)
  const [shelterName, setShelterName] = useState(s?.shelterName || 'Metro Paws Sanctuary');
  const [ownerName, setOwnerName] = useState(s?.ownerName || s?.directorName || 'Arthur Vance');
  const [email, setEmail] = useState(s?.contactEmail || 'info@metropaws.org');
  const [phone, setPhone] = useState(s?.contactPhone || '(512) 555-9018');
  const [streetAddress, setStreetAddress] = useState(s?.streetAddress || '310 Industrial Blvd');
  const [city, setCity] = useState(s?.city || 'Austin');
  const [state, setState] = useState(s?.state || 'TX');
  const [pincode, setPincode] = useState(s?.pincode || s?.zipCode || '78745');
  const [legalRegNumber, setLegalRegNumber] = useState(s?.legalRegNumber || 'TX-501C-1194');
  const [taxId, setTaxId] = useState(s?.taxId || '74-9988112');
  const [shelterType, setShelterType] = useState<ShelterRegistrationData['shelterType']>(
    s?.shelterType || 'Rescue Center'
  );
  const [currentAnimalCount, setCurrentAnimalCount] = useState<number>(s?.currentAnimalCount || 48);
  const [animalCapacity, setAnimalCapacity] = useState<number>(s?.animalCapacity || 35);
  const [veterinarySupportDetails, setVeterinarySupportDetails] = useState(
    s?.veterinarySupportDetails ||
      'South Austin Veterinary Center on-call emergency partner & bi-weekly wellness checks'
  );
  const [operatingHours, setOperatingHours] = useState(
    s?.operatingHours || 'Mon - Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 3:00 PM'
  );
  const [shelterDescription, setShelterDescription] = useState(
    s?.shelterDescription ||
      'Urban rescue sanctuary specializing in high-energy canine rehabilitation, intake medical triage, and foster placement.'
  );

  const [documents, setDocuments] = useState<ShelterDocumentItem[]>(
    s?.documents && s.documents.length > 0
      ? s.documents
      : [
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
        ]
  );

  const [isSaved, setIsSaved] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleSimulateUpload = (type: ShelterDocumentItem['type']) => {
    const filename = `${type.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
    const newDoc: ShelterDocumentItem = {
      id: `doc-${Date.now()}`,
      name: filename,
      type,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
    };

    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== type);
      return [...filtered, newDoc];
    });

    setUploadNotice(`Uploaded: ${filename}`);
    setTimeout(() => setUploadNotice(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<ShelterRegistrationData> = {
      shelterName,
      directorName: ownerName,
      ownerName,
      contactEmail: email,
      contactPhone: phone,
      streetAddress,
      city,
      state,
      zipCode: pincode,
      pincode,
      legalRegNumber,
      taxId,
      shelterType,
      currentAnimalCount: Number(currentAnimalCount),
      animalCapacity: Number(animalCapacity),
      veterinarySupportDetails,
      operatingHours,
      shelterDescription,
      documents,
    };

    if (currentReq) {
      updateShelterRegistration(currentReq.requestId, payload);
      setIsSaved(true);
      if (onSubmitted) onSubmitted(currentReq.requestId);
      if (onNext) onNext();
    } else {
      const newId = registerShelter({
        ...payload,
        speciesHandled: ['Dogs'],
        facilities: ['Indoor Kennels', 'Quarantine'],
      } as any);
      setIsSaved(true);
      if (onSubmitted) onSubmitted(newId);
      if (onNext) onNext();
    }
  };

  const documentTypes: Array<ShelterDocumentItem['type']> = [
    'Registration Certificate',
    'Legal ID',
    'Address Proof',
    'Owner ID',
    'Other Supporting Documents',
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#99f6e4] shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ccfbf1] text-[#0f766e]">
                Step 1 of 12: Registration
              </span>
              <span className="text-xs text-teal-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                Verification ID: {currentReq?.requestId || requestId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">1. Shelter Registration Dossier</h2>
            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Collect complete institutional metadata, contact credentials, animal census, veterinary support arrangements, and certified legal documentation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-right">
            <span className="text-[11px] text-teal-200 block">Current Stage</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {currentReq?.stage || 'SHELTER_REGISTRATION'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {uploadNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadNotice}</span>
          </div>
        )}

        {isSaved && (
          <div className="p-3 bg-[#e0f9f5] border border-[#99f6e4] rounded-xl text-xs text-[#0f766e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
              <span>Registration successfully submitted for <strong>{shelterName}</strong> under ID <strong>{currentReq?.requestId || requestId}</strong>.</span>
            </div>
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:underline"
              >
                Proceed to Request Timeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Section A: Institutional Identity */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#0d9488]" />
            A. Shelter Identity &amp; Leadership
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shelter Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={shelterName}
                  onChange={(e) => setShelterName(e.target.value)}
                  placeholder="e.g. Metro Paws Sanctuary"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Contact Person <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Arthur Vance"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shelter Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={shelterType}
                onChange={(e) => setShelterType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-medium cursor-pointer"
              >
                <option value="Rescue Center">Rescue Center</option>
                <option value="Sanctuary">Sanctuary</option>
                <option value="Foster Network">Foster Network</option>
                <option value="Municipal Partner">Municipal Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@metropaws.org"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(512) 555-9018"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Location & Legal Registration */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#0d9488]" />
            B. Address &amp; Legal Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Physical Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="310 Industrial Blvd"
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / State <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Austin"
                  className="w-2/3 px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TX"
                  className="w-1/3 px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pincode / ZIP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="78745"
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Number (501c3 / NGO / Trust) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={legalRegNumber}
                  onChange={(e) => setLegalRegNumber(e.target.value)}
                  placeholder="TX-501C-1194"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-mono"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal ID / Tax Registration Number (EIN / PAN)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="74-9988112"
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section C: Capacity & Veterinary Support */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Heart className="w-4 h-4 text-[#0d9488]" />
            C. Capacity, Veterinary Support &amp; Mission
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Licensed Facility Capacity <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min={1}
                  value={animalCapacity}
                  onChange={(e) => setAnimalCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488] font-bold"
                />
                <span className="text-xs text-slate-500 shrink-0">animals max</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Number of Animals in Care <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min={0}
                  value={currentAnimalCount}
                  onChange={(e) => setCurrentAnimalCount(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs rounded-xl border font-bold ${
                    currentAnimalCount > animalCapacity
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <span className="text-xs text-slate-500 shrink-0">current animals</span>
              </div>
              {currentAnimalCount > animalCapacity && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Over capacity by {currentAnimalCount - animalCapacity} animals! Flagged for inspection audit.
                </p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Occupancy Ratio
              </label>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Capacity Utilization</span>
                  <span className={currentAnimalCount > animalCapacity ? 'text-rose-600' : 'text-[#0d9488]'}>
                    {Math.round((currentAnimalCount / animalCapacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${currentAnimalCount > animalCapacity ? 'bg-rose-500' : 'bg-[#0d9488]'}`}
                    style={{ width: `${Math.min(100, Math.round((currentAnimalCount / animalCapacity) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Veterinary Support Details <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  required
                  value={veterinarySupportDetails}
                  onChange={(e) => setVeterinarySupportDetails(e.target.value)}
                  placeholder="Describe affiliated veterinary clinics, attending DVMs, emergency arrangements, and rabies protocols..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shelter Description &amp; Mission Statement
              </label>
              <textarea
                rows={2}
                value={shelterDescription}
                onChange={(e) => setShelterDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of shelter history, intake policies, and public adoption operations..."
                className="w-full px-3 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-[#0d9488]"
              />
            </div>
          </div>
        </div>

        {/* Section D: Upload Documents */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#0d9488]" />
              D. Upload Verified Legal Documents (Mandatory)
            </h3>
            <span className="text-[11px] text-slate-500">PDF, JPG, PNG up to 10MB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {documentTypes.map((type) => {
              const existing = documents.find((d) => d.type === type);
              return (
                <div
                  key={type}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    existing
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50/60 border-dashed border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">{type}</span>
                      {existing ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      )}
                    </div>

                    {existing ? (
                      <p className="text-[11px] text-slate-600 font-mono mt-1 truncate" title={existing.name}>
                        {existing.name} ({existing.size || '2.1 MB'})
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Government recognized document proof.
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(type)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0d9488] hover:text-[#0f766e]"
                    >
                      <Upload className="w-3 h-3" />
                      {existing ? 'Replace File' : 'Upload File'}
                    </button>
                    {existing && (
                      <span className="text-[10px] text-slate-400">
                        {existing.uploadDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-[#0d9488]" />
            <span>Registration will be assigned to a Field Worker for on-site physical inspection.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

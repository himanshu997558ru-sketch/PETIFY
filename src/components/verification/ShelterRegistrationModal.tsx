import React, { useState } from 'react';
import {
  Building2,
  X,
  FileText,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ShieldCheck,
  Upload,
  AlertCircle,
  ArrowRight,
  PawPrint,
} from 'lucide-react';
import { useShelterVerification } from '../../context/ShelterVerificationContext';

interface ShelterRegistrationModalProps {
  onClose: () => void;
  onSuccess?: (requestId: string) => void;
}

export const ShelterRegistrationModal: React.FC<ShelterRegistrationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { registerShelter } = useShelterVerification();

  const [shelterName, setShelterName] = useState('Austin Animal Welfare Sanctuary');
  const [legalRegNumber, setLegalRegNumber] = useState('TX-501C-5582');
  const [taxId, setTaxId] = useState('74-8831920');
  const [shelterType, setShelterType] = useState<
    'Sanctuary' | 'Rescue Center' | 'Foster Network' | 'Municipal Partner'
  >('Sanctuary');
  const [directorName, setDirectorName] = useState('Clara Montgomery (Executive Director)');
  const [contactEmail, setContactEmail] = useState('director@austinwelfare.org');
  const [contactPhone, setContactPhone] = useState('(512) 555-4421');
  const [streetAddress, setStreetAddress] = useState('8901 Sanctuary Way');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [zipCode, setZipCode] = useState('78736');
  const [animalCapacity, setAnimalCapacity] = useState('60');
  const [currentAnimalCount, setCurrentAnimalCount] = useState('42');
  const [speciesHandled, setSpeciesHandled] = useState<string[]>(['Dogs', 'Cats']);
  const [facilities, setFacilities] = useState<string[]>([
    'Indoor Kennels',
    'Outdoor Play Yard',
    'Medical Quarantine',
    'Veterinary Exam Room',
  ]);
  const [licenseDocName, setLicenseDocName] = useState('Texas_DSHS_Shelter_Permit_2025.pdf');
  const [sanitaryCertDocName, setSanitaryCertDocName] = useState('Austin_Health_Department_Sanitary_Cert.pdf');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSpecies = (sp: string) => {
    setSpeciesHandled((prev) =>
      prev.includes(sp) ? prev.filter((s) => s !== sp) : [...prev, sp]
    );
  };

  const toggleFacility = (fac: string) => {
    setFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelterName.trim() || !legalRegNumber.trim() || !directorName.trim()) {
      setErrorMsg('Please fill in all required organization identity fields.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please acknowledge the Petify Animal Welfare Accreditation Standards.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const requestId = registerShelter({
        shelterName,
        legalRegNumber,
        taxId,
        shelterType,
        directorName,
        contactEmail,
        contactPhone,
        streetAddress,
        city,
        state,
        zipCode,
        animalCapacity: parseInt(animalCapacity, 10) || 50,
        currentAnimalCount: parseInt(currentAnimalCount, 10) || 30,
        speciesHandled,
        facilities,
        licenseDocName,
        sanitaryCertDocName,
      });

      setIsSubmitting(false);
      onSuccess?.(requestId);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#fbfdfc] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Shelter Registration</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Step 1 of Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Register facility details to initiate formal on-site verification & accreditation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Legal Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Organization &amp; Non-Profit Legal Identity</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Shelter / Sanctuary Name *
                </label>
                <input
                  type="text"
                  required
                  value={shelterName}
                  onChange={(e) => setShelterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                  placeholder="e.g. Austin Pet Rescue Sanctuary"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Organization Type
                </label>
                <select
                  value={shelterType}
                  onChange={(e) => setShelterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                >
                  <option value="Sanctuary">Permanent Sanctuary & Rescue</option>
                  <option value="Rescue Center">Rescue Center / Foster Hub</option>
                  <option value="Foster Network">Foster Care Alliance</option>
                  <option value="Municipal Partner">Municipal Tie-Up Facility</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  501(c)(3) / State NGO Registration No. *
                </label>
                <input
                  type="text"
                  required
                  value={legalRegNumber}
                  onChange={(e) => setLegalRegNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50 font-mono"
                  placeholder="e.g. TX-501C-4421"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tax EIN / Tax ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50 font-mono"
                  placeholder="e.g. 74-2991048"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Key Personnel */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Director &amp; Operations Contact</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Director / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                  placeholder="Marcus Sterling (Director)"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                  placeholder="adoptions@shelter.org"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                  placeholder="(512) 555-0199"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Facility Location & Capacity */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Facility Physical Address &amp; Animal Capacity</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Facility Street Address *
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                placeholder="428 Orchard Ridge Trail"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ZIP</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Capacity</label>
                <input
                  type="number"
                  value={animalCapacity}
                  onChange={(e) => setAnimalCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
                />
              </div>
            </div>

            {/* Species Handled Checkboxes */}
            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1.5">
                Species Accommodated at Facility
              </label>
              <div className="flex flex-wrap gap-2">
                {['Dogs', 'Cats', 'Small Mammals', 'Birds', 'Equine'].map((sp) => {
                  const selected = speciesHandled.includes(sp);
                  return (
                    <button
                      type="button"
                      key={sp}
                      onClick={() => toggleSpecies(sp)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facilities Checkboxes */}
            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1.5">
                Available Facility Infrastructure
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {[
                  'Indoor Kennels with Heating/Cooling',
                  'Outdoor Fenced Play Yard',
                  'Dedicated Medical Quarantine Ward',
                  'Veterinary Exam / Surgery Room',
                  'Wash & Sanitation Bay',
                  'Air Scrubbers & Odor Filtration',
                ].map((fac) => {
                  const selected = facilities.includes(fac);
                  return (
                    <button
                      type="button"
                      key={fac}
                      onClick={() => toggleFacility(fac)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 transition-all ${
                        selected
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          selected ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>{fac}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload Simulation */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Accreditation Documents &amp; Permits</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{licenseDocName}</p>
                    <p className="text-[10px] text-slate-500">State Operating Permit</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Attached
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{sanitaryCertDocName}</p>
                    <p className="text-[10px] text-slate-500">Health Board Certificate</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Attached
                </span>
              </div>
            </div>
          </div>

          {/* Commitment Terms */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-welfare"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 accent-emerald-600"
            />
            <label
              htmlFor="agree-welfare"
              className="text-slate-700 select-none cursor-pointer leading-relaxed text-[11px]"
            >
              <strong>Welfare Commitment &amp; Inspection Consent:</strong> We consent to unannounced
              physical inspections by Petify certified welfare officers, adhere to zero-euthanasia
              protocols for treatable companions, and maintain clean, transparent intake records.
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <span>Submit Shelter &amp; Request Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

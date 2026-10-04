import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  RotateCcw,
  Building2,
  Contact,
  MapPin,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';
import { RoleType, ScreenType } from '../types';
import { useShelterVerification } from '../context/ShelterVerificationContext';

interface RegisterScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onRegisterSuccess: (role: RoleType, name: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess,
}) => {
  const [role, setRole] = useState<RoleType>('adopter');

  // Adopter Form State
  const [adopterName, setAdopterName] = useState('Eleanor Vance');
  const [adopterEmail, setAdopterEmail] = useState('eleanor@example.com');
  const [adopterPhone, setAdopterPhone] = useState('(555) 349-2018');
  const [adopterPassword, setAdopterPassword] = useState('');
  const [adopterConfirm, setAdopterConfirm] = useState('');

  // Shelter Form State
  const [shelterName, setShelterName] = useState('Pine Valley Animal Haven');
  const [shelterContact, setShelterContact] = useState('Marcus Sterling (Director)');
  const [shelterEmail, setShelterEmail] = useState('adoptions@pinehaven.org');
  const [shelterPhone, setShelterPhone] = useState('(555) 782-9011');
  const [shelterStreet, setShelterStreet] = useState('428 Orchard Ridge Trail');
  const [shelterCity, setShelterCity] = useState('Portland');
  const [shelterState, setShelterState] = useState('OR');
  const [shelterZip, setShelterZip] = useState('97201');
  const [shelterPassword, setShelterPassword] = useState('');
  const [shelterConfirm, setShelterConfirm] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { registerShelter } = useShelterVerification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Care and Welfare Commitment to continue.');
      return;
    }
    setErrorMsg('');

    if (role === 'shelter') {
      // Step 1 & 2: Shelter Registration initiates Verification Request automatically
      registerShelter({
        shelterName: shelterName.trim() || 'Pine Valley Animal Haven',
        legalRegNumber: `NGO-TX-${Math.floor(1000 + Math.random() * 9000)}`,
        taxId: 'XX-XXXXXXX',
        shelterType: 'Sanctuary',
        directorName: shelterContact.trim() || 'Marcus Sterling',
        contactEmail: shelterEmail.trim() || 'adoptions@pinehaven.org',
        contactPhone: shelterPhone.trim() || '(555) 782-9011',
        streetAddress: shelterStreet.trim() || '428 Orchard Ridge Trail',
        city: shelterCity.trim() || 'Portland',
        state: shelterState.trim() || 'OR',
        zipCode: shelterZip.trim() || '97201',
        animalCapacity: 45,
        currentAnimalCount: 18,
        speciesHandled: ['Dogs', 'Cats'],
        facilities: ['Insulated Kennels', 'Quarantine Ward', 'Play Yards'],
        licenseDocName: 'license_compliance_2025.pdf',
        sanitaryCertDocName: 'sanitation_disinfection_sop.pdf',
      });
    }

    const name = role === 'adopter' ? adopterName : shelterName;
    onRegisterSuccess(role, name);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative">
      {/* Ambient Soft Backdrop Spheres */}
      <div className="relative w-full max-w-xl flex flex-col items-center">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#ffdbd0]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute -bottom-20 -right-16 w-64 h-64 bg-[#b9eed1]/35 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Main Card Container */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-[#1d1b17]/5 p-6 sm:p-10 flex flex-col items-center border border-[#e8e2da]/60">
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#f9f3eb] p-2 shadow-xs flex items-center justify-center border border-[#ddc0b8]/30">
              <img
                alt="Petify Logo"
                className="w-full h-full object-contain"
                src={KIN_PAWS_LOGO}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1b17] mt-1">
                Create Your Account
              </h1>
              <p className="text-sm text-[#56423c] max-w-sm mx-auto mt-1 leading-relaxed">
                Join our verified sanctuary network to adopt, foster, or list companions needing caring homes.
              </p>
            </div>
          </div>

          {/* Segmented Role Selector Control */}
          <div className="w-full bg-[#f3ede5] p-1 rounded-xl flex items-center justify-between gap-1 mb-6">
            <button
              id="tab-adopter"
              type="button"
              onClick={() => setRole('adopter')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'adopter'
                  ? 'bg-[#9c3e1f] text-white shadow-xs'
                  : 'text-[#56423c] hover:text-[#1d1b17] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-lg fill-1">pets</span>
              <span>Adopter</span>
            </button>
            <button
              id="tab-shelter"
              type="button"
              onClick={() => setRole('shelter')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'shelter'
                  ? 'bg-[#376851] text-white shadow-xs'
                  : 'text-[#56423c] hover:text-[#1d1b17] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-lg">holiday_village</span>
              <span>Shelter / Rescue</span>
            </button>
          </div>

          {/* Role Status Helper Banner */}
          {role === 'adopter' ? (
            <div className="w-full bg-[#f9f3eb] rounded-xl p-3.5 flex items-start gap-3 mb-6 border border-[#ddc0b8]/30">
              <span className="material-symbols-outlined text-[#376851] text-xl fill-1 mt-0.5">
                favorite
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1d1b17]">Pet Seeker Profile</p>
                <p className="text-xs text-[#56423c]">
                  Find pets, save favorites, and track adoption applications in real time.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full bg-[#b9eed1]/25 rounded-xl p-3.5 flex items-start gap-3 mb-6 border border-[#376851]/30">
              <span className="material-symbols-outlined text-[#376851] text-xl fill-1 mt-0.5">
                verified_user
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#376851]">Shelter &amp; Foster Partner</p>
                <p className="text-xs text-[#1e4f3a]">
                  Shelters are verified within 24 hours to ensure animal safety and ethical standards.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="w-full mb-4 p-3 bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-lg text-xs text-[#93000a] text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Main Registration Form */}
          <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* =================== ADOPTER FIELDS =================== */}
            {role === 'adopter' && (
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="adopter-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="adopter-name"
                      type="text"
                      required
                      value={adopterName}
                      onChange={(e) => setAdopterName(e.target.value)}
                      placeholder="Eleanor Vance"
                      className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all"
                    />
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="adopter-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="adopter-email"
                        type="email"
                        required
                        value={adopterEmail}
                        onChange={(e) => setAdopterEmail(e.target.value)}
                        placeholder="eleanor@example.com"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all"
                      />
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="adopter-phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="adopter-phone"
                        type="tel"
                        value={adopterPhone}
                        onChange={(e) => setAdopterPhone(e.target.value)}
                        placeholder="(555) 349-2018"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all"
                      />
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="adopter-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="adopter-password"
                        type="password"
                        required
                        value={adopterPassword}
                        onChange={(e) => setAdopterPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all"
                      />
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="adopter-confirm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="adopter-confirm"
                        type="password"
                        required
                        value={adopterConfirm}
                        onChange={(e) => setAdopterConfirm(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all"
                      />
                      <RotateCcw className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================== SHELTER FIELDS =================== */}
            {role === 'shelter' && (
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-name">
                      Shelter / Organization Name
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-name"
                        type="text"
                        required
                        value={shelterName}
                        onChange={(e) => setShelterName(e.target.value)}
                        placeholder="Pine Valley Animal Haven"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-contact">
                      Contact Person
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-contact"
                        type="text"
                        required
                        value={shelterContact}
                        onChange={(e) => setShelterContact(e.target.value)}
                        placeholder="Marcus Sterling (Director)"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <Contact className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-email">
                      Official Email
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-email"
                        type="email"
                        required
                        value={shelterEmail}
                        onChange={(e) => setShelterEmail(e.target.value)}
                        placeholder="adoptions@pinehaven.org"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-phone">
                      Shelter Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-phone"
                        type="tel"
                        value={shelterPhone}
                        onChange={(e) => setShelterPhone(e.target.value)}
                        placeholder="(555) 782-9011"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-street">
                    Facility Street Address
                  </label>
                  <div className="relative">
                    <input
                      id="shelter-street"
                      type="text"
                      required
                      value={shelterStreet}
                      onChange={(e) => setShelterStreet(e.target.value)}
                      placeholder="428 Orchard Ridge Trail"
                      className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                    />
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-city">
                      City
                    </label>
                    <input
                      id="shelter-city"
                      type="text"
                      value={shelterCity}
                      onChange={(e) => setShelterCity(e.target.value)}
                      placeholder="Portland"
                      className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-state">
                      State
                    </label>
                    <input
                      id="shelter-state"
                      type="text"
                      value={shelterState}
                      onChange={(e) => setShelterState(e.target.value)}
                      placeholder="OR"
                      className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-zip">
                      ZIP Code
                    </label>
                    <input
                      id="shelter-zip"
                      type="text"
                      value={shelterZip}
                      onChange={(e) => setShelterZip(e.target.value)}
                      placeholder="97201"
                      className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-password"
                        type="password"
                        required
                        value={shelterPassword}
                        onChange={(e) => setShelterPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="shelter-confirm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="shelter-confirm"
                        type="password"
                        required
                        value={shelterConfirm}
                        onChange={(e) => setShelterConfirm(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] transition-all"
                      />
                      <RotateCcw className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agreement Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded text-[#9c3e1f] focus:ring-[#9c3e1f] accent-[#9c3e1f] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#56423c] select-none leading-relaxed">
                I agree to the{' '}
                <a href="#terms-care" className="text-[#9c3e1f] hover:underline font-medium">
                  Terms of Care
                </a>{' '}
                and acknowledge the Petify{' '}
                <a href="#welfare-commitment" className="text-[#9c3e1f] hover:underline font-medium">
                  Animal Welfare Commitment
                </a>
                .
              </label>
            </div>

            {/* Primary Call to Action */}
            <button
              id="register-submit-btn"
              type="submit"
              className={`w-full text-white text-sm font-semibold py-3.5 px-6 rounded-lg transition-all duration-150 shadow-md flex items-center justify-center gap-2 mt-2 ${
                role === 'adopter'
                  ? 'bg-[#9c3e1f] hover:bg-[#823217] shadow-[#9c3e1f]/20'
                  : 'bg-[#376851] hover:bg-[#285943] shadow-[#376851]/20'
              }`}
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow bg-[#e8e2da] h-px"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold uppercase tracking-wider text-[#8a726b]">
                or continue with
              </span>
              <div className="flex-grow bg-[#e8e2da] h-px"></div>
            </div>

            {/* Google OAuth Option */}
            <button
              type="button"
              onClick={() => onRegisterSuccess(role, role === 'adopter' ? adopterName : shelterName)}
              className="w-full bg-[#f9f3eb] hover:bg-[#eee7e0] text-[#1d1b17] text-sm font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 border border-[#ddc0b8]/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </form>

          {/* Bottom Redirection to Login */}
          <div className="mt-8 text-center pt-2">
            <p className="text-sm text-[#56423c]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[#9c3e1f] hover:underline font-semibold ml-1 underline-offset-4"
              >
                Log in
              </button>
            </p>
          </div>
        </div>

        {/* Security & Ethics Micro-Footnote */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#56423c]/80 text-center">
          <ShieldCheck className="w-4 h-4 text-[#376851]" />
          <span>256-bit encrypted data protection • Non-profit shelter alliance</span>
        </div>
      </div>
    </div>
  );
};

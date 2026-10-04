import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';
import { RoleType } from '../types';

interface AuthScreenProps {
  initialMode?: 'login' | 'register';
  onLoginSuccess: (role: 'adopter' | 'shelter' | 'admin', customName?: string) => void;
  onRegisterSuccess: (role: RoleType, registeredName: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  // Common form state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('sarah.jenkins@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Register inputs
  const [registerRole, setRegisterRole] = useState<RoleType>('adopter');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [registerEmail, setRegisterEmail] = useState('sarah.jenkins@example.com');
  const [phone, setPhone] = useState('(512) 843-9921');
  const [registerPassword, setRegisterPassword] = useState('••••••••••••');
  const [shelterName, setShelterName] = useState('Austin Pet Rescue Sanctuary');
  const [shelterAddress, setShelterAddress] = useState('428 Orchard Ridge Trail, Austin, TX');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = loginEmail.trim().toLowerCase();
    const rawPassword = loginPassword.trim();

    // Specific Admin Login Requested:
    // email - himanshu@admin and password - Himanshu@1234
    if (cleanEmail === 'himanshu@admin') {
      if (rawPassword === 'Himanshu@1234') {
        onLoginSuccess('admin', 'Himanshu (Admin)');
        return;
      } else {
        setErrorMessage('Invalid password for admin. Please use Himanshu@1234');
        return;
      }
    }

    // Shelter login routing
    if (cleanEmail.includes('shelter') || cleanEmail.includes('rescue')) {
      onLoginSuccess('shelter', 'Austin Pet Rescue Sanctuary');
      return;
    }

    // Default Adopter login
    onLoginSuccess('adopter', 'Sarah Jenkins');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = registerRole === 'adopter' ? fullName : shelterName;
    onRegisterSuccess(registerRole, name);
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] relative overflow-hidden flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#ffdbd0] selection:text-[#9c3e1f]">
      {/* Soft Ambient Background Elements matching Images */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-[#f9e0d9]/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[28rem] h-[28rem] rounded-full bg-[#b9eed1]/25 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#9c3e1f]/5 border border-[#e8e2da] p-8 sm:p-10 backdrop-blur-xs transition-all duration-300">
          
          {/* Logo & Brand Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-200/80 shadow-md p-2 mx-auto">
              <img
                src="/petify-logo.svg"
                alt="Petify Official Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#1d1b17] flex items-center justify-center gap-1">
                Petify
              </h2>
            </div>

            {/* Seamless Mode Switcher Tabs */}
            <div className="flex bg-[#f3ede5] p-1 rounded-xl mx-auto max-w-xs mt-2 border border-[#e8e2da]">
              <button
                type="button"
                id="tab-login"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-[#1d1b17] shadow-xs'
                    : 'text-[#56423c] hover:text-[#1d1b17]'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="tab-register"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-[#1d1b17] shadow-xs'
                    : 'text-[#56423c] hover:text-[#1d1b17]'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="pt-1">
              <h3 className="text-xl font-bold text-[#1d1b17]">
                {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-[#56423c] mt-1 max-w-xs mx-auto leading-relaxed">
                {authMode === 'login'
                  ? 'Sign in to manage your pet applications, saved favorites, or shelter listings.'
                  : 'Join our verified sanctuary network to adopt, foster, or list companions needing caring homes.'}
              </p>
            </div>
          </div>

          {/* ================= LOGIN FORM (Screen 1) ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="login-email">
                  Email Address or Admin Username
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="user@example.com"
                    className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                  />
                  <Mail className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1d1b17]" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-xs font-semibold text-[#9c3e1f] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your password"
                    className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-11 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                  />
                  <Lock className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#8a726b] hover:text-[#1d1b17] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Remember for 30 days */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9c3e1f] focus:ring-[#9c3e1f] border-[#ddc0b8] cursor-pointer accent-[#9c3e1f]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-[#56423c] cursor-pointer select-none">
                    Remember for 30 days
                  </label>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                id="btn-login-submit"
                className="w-full bg-[#9c3e1f] hover:bg-[#823217] active:scale-[0.99] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#9c3e1f]/20 flex items-center justify-center gap-2 text-sm"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e8e2da]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-[#8a726b] font-medium">or continue with</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                id="btn-google-login"
                onClick={() => onLoginSuccess('adopter')}
                className="w-full bg-[#f9f3eb] hover:bg-[#eee7e0] active:scale-[0.99] text-[#1d1b17] font-semibold py-2.5 px-4 rounded-xl border border-[#ddc0b8]/40 transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.26 21.4 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.6 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Switch to Register link */}
              <p className="text-center text-xs text-[#56423c] pt-2">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  id="link-to-register"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-[#9c3e1f] hover:underline"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {/* ================= REGISTER FORM (Screen 2) ================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              {/* Segmented Role Selector: Adopter vs Shelter / Rescue */}
              <div className="grid grid-cols-2 gap-2 bg-[#f3ede5] p-1 rounded-xl border border-[#e8e2da]">
                <button
                  type="button"
                  id="role-select-adopter"
                  onClick={() => setRegisterRole('adopter')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    registerRole === 'adopter'
                      ? 'bg-[#9c3e1f] text-white shadow-sm'
                      : 'text-[#56423c] hover:text-[#1d1b17]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Adopter</span>
                </button>

                <button
                  type="button"
                  id="role-select-shelter"
                  onClick={() => setRegisterRole('shelter')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    registerRole === 'shelter'
                      ? 'bg-[#376851] text-white shadow-sm'
                      : 'text-[#56423c] hover:text-[#1d1b17]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Shelter / Rescue</span>
                </button>
              </div>

              {/* Contextual Role Helper Banner */}
              {registerRole === 'adopter' ? (
                <div className="p-2.5 rounded-xl bg-[#b9eed1]/25 border border-[#376851]/20 flex items-center gap-2 text-xs text-[#1e4f3a]">
                  <CheckCircle2 className="w-4 h-4 text-[#376851] shrink-0" />
                  <span>Pet Seeker Profile: Free lifetime matching &amp; verified applications.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#c2e8ff]/30 border border-[#206280]/20 flex items-center gap-2 text-xs text-[#184e66]">
                  <ShieldCheck className="w-4 h-4 text-[#206280] shrink-0" />
                  <span>Shelter &amp; Foster Partner: Verified 501(c)(3) animal welfare profile.</span>
                </div>
              )}

              {/* Dynamic Inputs depending on role */}
              {registerRole === 'adopter' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-name">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                      />
                      <User className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="sarah.jenkins@example.com"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                      />
                      <Mail className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-phone">
                      Mobile Phone (for interview alerts)
                    </label>
                    <div className="relative">
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(512) 843-9921"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                      />
                      <Phone className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-shelter">
                      Shelter / Sanctuary Name
                    </label>
                    <div className="relative">
                      <input
                        id="reg-shelter"
                        type="text"
                        required
                        value={shelterName}
                        onChange={(e) => setShelterName(e.target.value)}
                        placeholder="Austin Pet Rescue Sanctuary"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] border border-transparent focus:border-[#376851] transition-all placeholder-[#8a726b]"
                      />
                      <Building2 className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-shelter-email">
                      Official Contact Email
                    </label>
                    <div className="relative">
                      <input
                        id="reg-shelter-email"
                        type="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="adoptions@austinrescue.org"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] border border-transparent focus:border-[#376851] transition-all placeholder-[#8a726b]"
                      />
                      <Mail className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-address">
                      Facility Street Address
                    </label>
                    <div className="relative">
                      <input
                        id="reg-address"
                        type="text"
                        value={shelterAddress}
                        onChange={(e) => setShelterAddress(e.target.value)}
                        placeholder="428 Orchard Ridge Trail, Austin, TX"
                        className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#376851] border border-transparent focus:border-[#376851] transition-all placeholder-[#8a726b]"
                      />
                      <MapPin className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1b17] mb-1.5" htmlFor="reg-pwd">
                  Create Secure Password
                </label>
                <div className="relative">
                  <input
                    id="reg-pwd"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-xl pl-10 pr-11 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] border border-transparent focus:border-[#9c3e1f] transition-all placeholder-[#8a726b]"
                  />
                  <Lock className="w-4 h-4 text-[#8a726b] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8a726b] hover:text-[#1d1b17] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#9c3e1f] focus:ring-[#9c3e1f] border-[#ddc0b8] cursor-pointer accent-[#9c3e1f]"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-xs text-[#56423c] leading-tight cursor-pointer select-none">
                  I agree to the{' '}
                  <span className="text-[#9c3e1f] font-semibold underline">Terms of Care</span> and Animal Welfare Commitment.
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-register-submit"
                className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm ${
                  registerRole === 'adopter'
                    ? 'bg-[#9c3e1f] hover:bg-[#823217] shadow-[#9c3e1f]/20'
                    : 'bg-[#376851] hover:bg-[#285943] shadow-[#376851]/20'
                }`}
              >
                <span>Create {registerRole === 'adopter' ? 'Adopter' : 'Shelter'} Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Login link */}
              <p className="text-center text-xs text-[#56423c] pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  id="link-to-login"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#9c3e1f] hover:underline"
                >
                  Log in
                </button>
              </p>

              {/* Privacy footnote matching Image 3 */}
              <div className="pt-2 text-center">
                <p className="text-[10px] text-[#8a726b] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#376851]" />
                  <span>256-bit encrypted data protection • Privacy Guaranteed</span>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

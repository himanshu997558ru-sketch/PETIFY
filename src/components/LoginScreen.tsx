import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';
import { ScreenType } from '../types';

interface LoginScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (role: 'adopter' | 'shelter' | 'admin') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'himanshu@admin') {
      if (cleanPass === 'Himanshu@1234') {
        onLoginSuccess('admin');
        return;
      } else {
        setErrorMsg('Invalid password for admin. Please use Himanshu@1234');
        return;
      }
    }

    if (cleanEmail.includes('shelter') || cleanEmail.includes('rescue')) {
      onLoginSuccess('shelter');
      return;
    }

    onLoginSuccess('adopter');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative">
      {/* Ambient Soft Backdrop Spheres */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#ffdbd0]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute -bottom-20 -right-16 w-64 h-64 bg-[#b9eed1]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Main Card Container */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-[#1d1b17]/5 p-7 sm:p-10 flex flex-col items-center border border-[#e8e2da]/60">
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#f9f3eb] p-2.5 shadow-xs flex items-center justify-center border border-[#ddc0b8]/30">
              <img
                alt="Petify Logo"
                className="w-full h-full object-contain"
                src={KIN_PAWS_LOGO}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1d1b17] flex items-center justify-center gap-1">
                Petify
              </h2>
            </div>
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1b17]">
                Welcome Back
              </h1>
              <p className="text-sm text-[#56423c] max-w-xs mx-auto mt-1.5 leading-relaxed">
                Sign in to manage your pet applications, saved favorites, or shelter listings.
              </p>
            </div>
          </div>

          {/* Reset password notification toast */}
          {forgotSent && (
            <div className="w-full mb-4 p-3 bg-[#b7ebce]/40 border border-[#376851]/30 rounded-lg text-xs text-[#1e4f3a] text-center font-medium">
              A recovery link was dispatched to {email || 'your email'}.
            </div>
          )}

          {/* Login Form */}
          <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                className="block text-xs font-semibold text-[#1d1b17] mb-1.5"
                htmlFor="login-email"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="user@example.com"
                  className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all placeholder-[#8a726b]"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-xs font-semibold text-[#1d1b17]"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-[#9c3e1f] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f9f3eb] text-[#1d1b17] text-sm rounded-lg px-4 py-3 pl-11 pr-11 outline-none focus:bg-white focus:ring-2 focus:ring-[#9c3e1f] transition-all placeholder-[#8a726b]"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8a726b] pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8a726b] hover:text-[#1d1b17] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#9c3e1f] focus:ring-[#9c3e1f] accent-[#9c3e1f] w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="text-xs text-[#56423c] select-none cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Login CTA */}
            <button
              id="login-submit-btn"
              type="submit"
              className="w-full bg-[#9c3e1f] hover:bg-[#823217] active:scale-[0.99] text-white text-sm font-semibold py-3.5 px-6 rounded-lg transition-all duration-150 shadow-md shadow-[#9c3e1f]/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>Login</span>
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

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => onLoginSuccess('adopter')}
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
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-7 text-center pt-1">
            <p className="text-sm text-[#56423c]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-[#9c3e1f] hover:underline font-semibold ml-1"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

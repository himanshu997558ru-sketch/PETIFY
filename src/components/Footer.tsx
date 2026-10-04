import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { KIN_PAWS_LOGO } from '../data/mockData';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#fff8f1] border-t border-[#e8e2da] mt-16 pt-16 pb-12 text-[#56423c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-[#ddc0b8]/40 shadow-xs shrink-0">
                <img src={KIN_PAWS_LOGO} alt="Petify Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#1d1b17] leading-none">
                Petify
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#56423c] max-w-sm">
              Connecting thoughtful humans with companion animals through dignified care,
              institutional shelter networks, and warm community stewardship.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#376851] pt-1">
              <CheckCircle2 className="w-4 h-4 text-[#376851]" />
              <span>Verified 501(c)(3) Animal Shelter Partner Network</span>
            </div>
          </div>

          {/* Shelter Directory */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1d1b17] tracking-tight">Shelter Directory</h4>
            <ul className="space-y-2 text-sm text-[#56423c]">
              <li><a href="#shelters" className="hover:text-[#9c3e1f] transition-colors">Metropolitan Shelters</a></li>
              <li><a href="#fosters" className="hover:text-[#9c3e1f] transition-colors">Foster Alliances</a></li>
              <li><a href="#rescues" className="hover:text-[#9c3e1f] transition-colors">Breed Specific Rescues</a></li>
              <li><a href="#hospices" className="hover:text-[#9c3e1f] transition-colors">Veterinary Hospices</a></li>
            </ul>
          </div>

          {/* Adoption Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1d1b17] tracking-tight">Adoption Resources</h4>
            <ul className="space-y-2 text-sm text-[#56423c]">
              <li><a href="#milestones" className="hover:text-[#9c3e1f] transition-colors">Application Milestones</a></li>
              <li><a href="#guide" className="hover:text-[#9c3e1f] transition-colors">First-Time Pet Guide</a></li>
              <li><a href="#checklist" className="hover:text-[#9c3e1f] transition-colors">Home Prep Checklist</a></li>
              <li><a href="#post-adoption" className="hover:text-[#9c3e1f] transition-colors">Post-Adoption Care</a></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1d1b17] tracking-tight">Stay Connected</h4>
            <p className="text-sm text-[#56423c]">
              Receive weekly urgent foster alerts and joyful adoption stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#f3ede5] text-sm text-[#1d1b17] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f] focus:bg-white placeholder-[#8a726b] transition-all"
              />
              <button
                type="submit"
                className="bg-[#376851] hover:bg-[#285943] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
              >
                Join
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-[#376851] font-medium animate-in fade-in">
                ✓ Thank you for joining our caregiver community!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e8e2da] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a726b]">
          <p>© 2024 Petify Foundation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#1d1b17] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#1d1b17] transition-colors">Terms of Adoption</a>
            <a href="#ethics" className="hover:text-[#1d1b17] transition-colors">Ethical Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

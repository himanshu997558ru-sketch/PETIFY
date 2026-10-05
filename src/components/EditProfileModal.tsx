import React, { useState } from 'react';
import { X, Check, Home, Activity, Dog, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [location, setLocation] = useState(user.location);
  const [livingSpace, setLivingSpace] = useState(user.livingSpace);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel);
  const [currentPets, setCurrentPets] = useState(user.currentPets);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name,
      email,
      location,
      livingSpace,
      activityLevel,
      currentPets,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2421]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e8e2da] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f9f3eb] border-b border-[#e8e2da] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1d1b17]">Edit Profile &amp; Preferences</h3>
            <p className="text-xs text-[#56423c]">Update your pet seeker matching criteria</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#eee7e0] hover:bg-[#e8e2da] text-[#56423c] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Living Space</label>
            <select
              value={livingSpace}
              onChange={(e) => setLivingSpace(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            >
              <option value="House (Fenced Backyard)">House (Fenced Backyard)</option>
              <option value="House (Unfenced Yard)">House (Unfenced Yard)</option>
              <option value="Apartment (Pet-Friendly)">Apartment (Pet-Friendly)</option>
              <option value="Townhouse with Patio">Townhouse with Patio</option>
              <option value="Acreage / Farm Sanctuary">Acreage / Farm Sanctuary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            >
              <option value="Moderate Daily Walks">Moderate Daily Walks</option>
              <option value="High Energy Runner / Hiker">High Energy Runner / Hiker</option>
              <option value="Calm & Gentle Indoor Snuggles">Calm &amp; Gentle Indoor Snuggles</option>
              <option value="Flexible / Family Routine">Flexible / Family Routine</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1d1b17] mb-1">Current Pets</label>
            <select
              value={currentPets}
              onChange={(e) => setCurrentPets(e.target.value)}
              className="w-full bg-[#f9f3eb] text-[#1d1b17] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#9c3e1f]"
            >
              <option value="None (Pet-Ready)">None (Pet-Ready)</option>
              <option value="1 Friendly Dog">1 Friendly Dog</option>
              <option value="1 Gentle Cat">1 Gentle Cat</option>
              <option value="Multi-Pet Household">Multi-Pet Household</option>
            </select>
          </div>

          <div className="p-2.5 bg-[#b9eed1]/25 rounded-lg flex items-center gap-2 text-xs text-[#1e4f3a]">
            <ShieldCheck className="w-4 h-4 text-[#376851]" />
            <span>Identity status: {user.idVerification}</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#56423c] hover:bg-[#eee7e0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#9c3e1f] hover:bg-[#823217] transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

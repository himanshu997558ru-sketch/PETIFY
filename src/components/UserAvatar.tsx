import React, { useState } from 'react';

// WhatsApp signature avatar color palette
const WHATSAPP_PALETTE = [
  { bg: 'bg-[#128C7E]', hex: '#128C7E' }, // WhatsApp Dark Teal
  { bg: 'bg-[#075E54]', hex: '#075E54' }, // WhatsApp Deep Forest
  { bg: 'bg-[#25D366]', hex: '#25D366' }, // WhatsApp Emerald
  { bg: 'bg-[#1E88E5]', hex: '#1E88E5' }, // Ocean Blue
  { bg: 'bg-[#8E24AA]', hex: '#8E24AA' }, // Royal Violet
  { bg: 'bg-[#D81B60]', hex: '#D81B60' }, // Rose Pink
  { bg: 'bg-[#E53935]', hex: '#E53935' }, // Coral Red
  { bg: 'bg-[#FB8C00]', hex: '#FB8C00' }, // Vivid Amber
  { bg: 'bg-[#00ACC1]', hex: '#00ACC1' }, // Electric Cyan
  { bg: 'bg-[#3949AB]', hex: '#3949AB' }, // Classic Indigo
  { bg: 'bg-[#5E35B1]', hex: '#5E35B1' }, // Deep Purple
  { bg: 'bg-[#00897B]', hex: '#00897B' }, // Teal Green
  { bg: 'bg-[#43A047]', hex: '#43A047' }, // Leaf Green
];

export function getWhatsAppColor(name: string): { bg: string; hex: string } {
  const safeName = (name || 'User').trim();
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % WHATSAPP_PALETTE.length;
  return WHATSAPP_PALETTE[index];
}

export function generateWhatsAppAvatarDataUrl(name: string): string {
  const safeName = (name || 'User').trim();
  const firstLetter = (safeName[0] || 'U').toUpperCase();
  const { hex } = getWhatsAppColor(safeName);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="${hex}" />
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="46" fill="#ffffff">${firstLetter}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineDot?: boolean;
}

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', text: 'text-[11px]', dot: 'w-1.5 h-1.5' },
  sm: { box: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2' },
  md: { box: 'w-9 h-9', text: 'text-sm', dot: 'w-2.5 h-2.5' },
  lg: { box: 'w-11 h-11', text: 'text-base', dot: 'w-3 h-3' },
  xl: { box: 'w-16 h-16', text: 'text-2xl', dot: 'w-3.5 h-3.5' },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  avatarUrl,
  size = 'sm',
  className = '',
  showOnlineDot = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const safeName = (name || 'User').trim();
  const firstLetter = (safeName[0] || 'U').toUpperCase();
  const { bg } = getWhatsAppColor(safeName);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.sm;

  // In WhatsApp style: unless a user has deliberately provided a custom uploaded data/blob picture,
  // the default DP is the first letter circle.
  const isGenericStockPhoto =
    !avatarUrl ||
    avatarUrl.includes('images.unsplash.com') ||
    avatarUrl.includes('photo-');
  const shouldUseImage = Boolean(avatarUrl && !isGenericStockPhoto && !imgError);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeConfig.box} ${className}`}>
      {shouldUseImage ? (
        <img
          src={avatarUrl}
          alt={safeName}
          onError={() => setImgError(true)}
          className={`w-full h-full rounded-full object-cover shadow-xs border border-white/40`}
        />
      ) : (
        <div
          className={`w-full h-full rounded-full ${bg} text-white font-bold flex items-center justify-center select-none shadow-xs border border-white/25 uppercase tracking-wide ${sizeConfig.text}`}
          title={safeName}
        >
          {firstLetter}
        </div>
      )}

      {showOnlineDot && (
        <span
          className={`absolute bottom-0 right-0 ${sizeConfig.dot} bg-[#25D366] rounded-full ring-2 ring-white`}
          title="Active"
        />
      )}
    </div>
  );
};

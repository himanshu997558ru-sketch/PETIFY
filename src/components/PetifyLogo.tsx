import React from 'react';

interface PetifyLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const PetifyLogo: React.FC<PetifyLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor,
}) => {
  const sizeMap = {
    xs: { iconSize: 22, textHeight: 'text-base', gap: 'gap-1.5' },
    sm: { iconSize: 28, textHeight: 'text-lg', gap: 'gap-2' },
    md: { iconSize: 36, textHeight: 'text-xl', gap: 'gap-2.5' },
    lg: { iconSize: 48, textHeight: 'text-2xl', gap: 'gap-3' },
    xl: { iconSize: 64, textHeight: 'text-3xl', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center select-none ${currentSize.gap} ${className}`}>
      {/* Icon Emblem: Green Heart with Cuddled Dog and Cat & Accent Heart */}
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        {/* Emerald Green Main Heart Outline */}
        <path
          d="M50 84 C30 68 12 50 12 30 C12 15 24 6 38 6 C43 6 47 8 50 11 C53 8 57 6 62 6 C76 6 88 15 88 30 C88 50 70 68 50 84 Z"
          fill="none"
          stroke="#059669"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small Emerald Heart on Top Right Cusp */}
        <path
          d="M72 13 C68 9 63 12 65 16 L72 21 L79 16 C81 12 76 9 72 13 Z"
          fill="#059669"
        />

        {/* Golden-Amber Dog Head (Left & Upper Cuddle) */}
        <path
          d="M32 78 C26 66 25 51 27 40 C29 30 35 20 46 18 C57 16 66 23 69 32 C71 37 69 43 66 47 C63 50 57 52 52 55 C46 59 40 68 32 78 Z"
          fill="#F59E0B"
        />
        {/* Dog Floppy Ear */}
        <path
          d="M38 25 C33 26 29 32 30 40 C31 48 37 54 42 54 C44 54 45 52 44 49 C42 43 40 33 38 25 Z"
          fill="#D97706"
        />
        {/* Dog Happy Closed Eye */}
        <path
          d="M52 32 C54 29 58 29 60 32"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dog Small Nose */}
        <ellipse cx="64" cy="37" rx="2.5" ry="1.8" fill="#1E293B" />

        {/* White Cat Head & Body (Nestled in Front & Lower Right) */}
        <path
          d="M42 78 C39 68 42 57 49 51 C53 48 59 46 64 47 C71 49 76 54 76 62 C76 69 72 75 66 78 C59 81 50 81 42 78 Z"
          fill="#FFFFFF"
          stroke="#059669"
          strokeWidth="1.8"
        />
        {/* Cat Left Ear with Pink Inside */}
        <path d="M51 48 L54 39 L60 46 Z" fill="#FFFFFF" stroke="#059669" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M53 46 L55 41 L58 45 Z" fill="#FCE7F3" />
        {/* Cat Right Ear with Pink Inside */}
        <path d="M68 47 L74 41 L75 50 Z" fill="#FFFFFF" stroke="#059669" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M70 48 L73 44 L74 49 Z" fill="#FCE7F3" />

        {/* Cat Happy Closed Eye */}
        <path
          d="M56 56 C58 54 61 54 63 56"
          stroke="#1E293B"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cat Nose */}
        <polygon points="52,60 55,60 53.5,62" fill="#1E293B" />
        {/* Cat Whiskers */}
        <line x1="48" y1="60" x2="43" y2="59" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="48" y1="62" x2="43" y2="63" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Wordmark: "Petify" with heart dot over the 'i' */}
      {showText && (
        <span
          className={`font-black tracking-tight leading-none flex items-center ${currentSize.textHeight}`}
          style={{ fontFamily: "'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          <span className={textColor || 'text-slate-900'}>Pet</span>
          <span className="text-[#059669] flex items-center relative">
            <span className="relative inline-block">
              {/* Dotless 'i' stem */}
              ı
              {/* Little Heart Dot over the 'i' */}
              <svg
                viewBox="0 0 16 16"
                className="w-2.5 h-2.5 fill-current absolute -top-1 left-1/2 -translate-x-1/2"
              >
                <path d="M8 14s-5.5-3.5-5.5-7.5C2.5 4 4.5 2.5 6.5 3.5 7.5 4 8 5 8 5s.5-1 1.5-1.5C11.5 2.5 13.5 4 13.5 6.5 13.5 10.5 8 14 8 14z" />
              </svg>
            </span>
            fy
          </span>
        </span>
      )}
    </div>
  );
};

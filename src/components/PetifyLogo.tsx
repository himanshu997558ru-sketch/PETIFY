import React from 'react';
import petifyLogo from '../assets/images/regenerated_image_1791344475697.png';

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
      {/* Official Petify Logo Emblem */}
      <img
        src={petifyLogo}
        alt="Petify Logo"
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        className="shrink-0 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      />

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

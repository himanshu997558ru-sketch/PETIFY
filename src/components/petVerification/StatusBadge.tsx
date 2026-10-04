import React from 'react';
import { PetVerificationStatus } from '../../types/petVerification';
import { Clock, CalendarCheck, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: PetVerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  switch (status) {
    case 'Pending Verification':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 tracking-wide ${sizeClasses}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>Pending Verification</span>
        </span>
      );

    case 'Verification Scheduled':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 tracking-wide ${sizeClasses}`}
        >
          {showIcon && <CalendarCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
          <span>Verification Scheduled</span>
        </span>
      );

    case 'Verified':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 tracking-wide ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>Verified (Awaiting Approval)</span>
        </span>
      );

    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 tracking-wide ${sizeClasses}`}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>Rejected</span>
        </span>
      );

    case 'Available for Adoption':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-teal-50 text-teal-800 border border-teal-300 tracking-wide ${sizeClasses}`}
        >
          {showIcon && <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
          <span>Available for Adoption</span>
        </span>
      );

    default:
      return null;
  }
};

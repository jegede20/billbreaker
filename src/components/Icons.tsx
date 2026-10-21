import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function ApplianceIcon({
  iconKey,
  className = 'text-[#1F2937]',
  size = 22,
}: {
  iconKey: string;
  className?: string;
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `shrink-0 ${className}`,
    'aria-hidden': true,
  };

  switch (iconKey) {
    case 'ac':
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="9" rx="2" />
          <line x1="6" y1="11" x2="18" y2="11" />
          <path d="M7 17c0 1.5-1 2.5-1 2.5" />
          <path d="M12 17v3" />
          <path d="M17 17c0 1.5 1 2.5 1 2.5" />
        </svg>
      );
    case 'fan':
    case 'ceiling-fan':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 9.5C12 6 9.5 4 7.5 5.5S9 10.5 9.5 11" />
          <path d="M14.5 12c3.5 0 5.5-2.5 4-4.5s-5 1.5-5.5 2" />
          <path d="M12 14.5c0 3.5 2.5 5.5 4.5 4s-1.5-5-2-5.5" />
          <path d="M9.5 12c-3.5 0-5.5 2.5-4 4.5s5-1.5 5.5-2" />
        </svg>
      );
    case 'freezer':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <path d="M12 13v4M10 15h4" />
        </svg>
      );
    case 'fridge':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <line x1="5" y1="10" x2="19" y2="10" />
          <line x1="8" y1="6.5" x2="8" y2="8" />
          <line x1="8" y1="13" x2="8" y2="16" />
        </svg>
      );
    case 'tv':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <line x1="8" y1="20" x2="16" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" />
        </svg>
      );
    case 'decoder':
      return (
        <svg {...props}>
          <rect x="3" y="13" width="18" height="6" rx="1.5" />
          <line x1="7" y1="16" x2="11" y2="16" />
          <circle cx="17" cy="16" r="1" />
          <path d="M8 9a6 6 0 0 1 8 0" />
        </svg>
      );
    case 'iron':
      return (
        <svg {...props}>
          <path d="M3 17h18l-2-7H9a6 6 0 0 0-6 6v1Z" />
          <path d="M9 10V7h6" />
        </svg>
      );
    case 'kettle':
      return (
        <svg {...props}>
          <path d="M6 19h10l1-10H7L6 19Z" />
          <path d="M17 11h2a2 2 0 0 1 0 4h-2" />
          <path d="M6 9L4 7" />
          <line x1="5" y1="21" x2="17" y2="21" />
        </svg>
      );
    case 'microwave':
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <rect x="5" y="8" width="10" height="8" rx="1" />
          <line x1="18" y1="9" x2="18" y2="9.01" />
          <line x1="18" y1="13" x2="18" y2="13.01" />
        </svg>
      );
    case 'washer':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <circle cx="12" cy="13" r="4" />
          <line x1="8" y1="6" x2="10" y2="6" />
        </svg>
      );
    case 'pump':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 7V4h4" />
          <path d="M7 12H4v4" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case 'bulb':
    case 'security-light':
      return (
        <svg {...props}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3Z" />
        </svg>
      );
    case 'laptop':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="11" rx="1.5" />
          <line x1="2" y1="19" x2="22" y2="19" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...props}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case 'router':
      return (
        <svg {...props}>
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <line x1="7" y1="14" x2="7" y2="8" />
          <line x1="17" y1="14" x2="17" y2="8" />
          <line x1="7" y1="17" x2="7.01" y2="17" />
          <line x1="11" y1="17" x2="11.01" y2="17" />
        </svg>
      );
    case 'cooker':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="11" r="2.5" />
          <circle cx="15.5" cy="11" r="2.5" />
          <line x1="7" y1="16" x2="17" y2="16" />
        </svg>
      );
    case 'water-heater':
    case 'heater':
      return (
        <svg {...props}>
          <rect x="6" y="3" width="12" height="18" rx="3" />
          <path d="M10 9c1-1 3-1 4 0s3 1 4 0" />
          <path d="M10 13c1-1 3-1 4 0" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <line x1="9" y1="9" x2="9" y2="13" />
          <line x1="15" y1="9" x2="15" y2="13" />
          <line x1="12" y1="14" x2="12" y2="16" />
        </svg>
      );
  }
}

export function NavHomeIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

export function NavAppliancesIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="8" height="7" rx="1.5" />
      <rect x="13" y="4" width="8" height="7" rx="1.5" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" />
      <rect x="13" y="13" width="8" height="7" rx="1.5" />
    </svg>
  );
}

export function NavSavingsIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

export function NavTokensIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="10" x2="17" y2="10" />
      <line x1="7" y1="14" x2="13" y2="14" />
    </svg>
  );
}

export function NavSettingsIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="#FFFBF2" />
      <circle cx="15" cy="12" r="2" fill="#FFFBF2" />
      <circle cx="10" cy="18" r="2" fill="#FFFBF2" />
    </svg>
  );
}

export function PlusIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function MinusIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function CheckIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function EditIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

export function TrashIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function SearchIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function CloseIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function MenuIcon({ className = '', size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function ArrowRightIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

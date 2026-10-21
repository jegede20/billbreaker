import React from 'react';
import { STRINGS } from '@/lib/strings';

interface BrandMarkProps {
  className?: string;
  size?: number;
}

export function BrandMark({ className = '', size = 28 }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2 1 30 28"
      width={size}
      height={Math.round((size * 28) / 30)}
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M4 6H18L13 17H19L14 26H4Z" fill="#1F2937" />
      <path d="M20 4H30V24H16L21 15H15Z" fill="#F59E0B" />
    </svg>
  );
}

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  onClick,
  className = '',
}: BrandLogoProps) {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 34 : 28;
  const textSize =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-xl';

  const content = (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandMark size={iconSize} />
      <span className={`${textSize} tracking-tight text-[#1F2937] leading-none`}>
        <span className="font-medium">{STRINGS.brand.wordmarkFirst}</span>
        <span className="font-extrabold">{STRINGS.brand.wordmarkSecond}</span>
      </span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2937] rounded-lg min-h-[44px]"
        aria-label={STRINGS.brand.name}
      >
        {content}
      </button>
    );
  }

  return content;
}

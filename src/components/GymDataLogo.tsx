import React from 'react';

interface GymDataLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge' | 'white' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GymDataLogo: React.FC<GymDataLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const heights = {
    sm: 30,
    md: 44,
    lg: 60,
    xl: 84,
  }[size];

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 p-2 border border-slate-700 shadow-md ${className}`}
        style={{ width: heights * 1.1, height: heights * 1.1 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Metallic gradient definitions */}
          <defs>
            <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="45%" stopColor="#94A3B8" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>

          {/* Dumbbell plates bottom arcs */}
          <path
            d="M 24 64 C 20 68 18 74 24 80 C 30 86 70 86 76 80 C 82 74 80 68 76 64"
            stroke="url(#metalGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 28 68 C 26 71 25 76 30 79 C 35 83 65 83 70 79 C 75 76 74 71 72 68"
            stroke="url(#metalGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Main "G" Gear / Dumbbell arc */}
          <path
            d="M 52 22 C 34 22 20 36 20 54 C 20 72 34 84 52 84 C 64 84 74 78 78 68"
            stroke="url(#metalGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Upward Growth Arrow inside G */}
          <path
            d="M 32 60 L 44 46 L 56 54 L 72 26"
            stroke="url(#metalGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow Head */}
          <polygon points="74,18 62,26 76,34" fill="url(#metalGrad)" />
          {/* Bar Chart bars */}
          <rect x="36" y="52" width="6" height="18" fill="url(#metalGrad)" rx="1.5" />
          <rect x="46" y="44" width="6" height="26" fill="url(#metalGrad)" rx="1.5" />
          <rect x="56" y="36" width="6" height="34" fill="url(#metalGrad)" rx="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} style={{ height: heights }}>
      {/* Emblem SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        style={{ height: heights, width: heights }}
        className="flex-shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metalGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="65%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Dumbbell plates at base */}
        <path
          d="M 22 66 C 18 70 16 75 22 81 C 28 87 72 87 78 81 C 84 75 82 70 78 66"
          stroke="url(#metalGrad2)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 28 71 C 25 74 24 78 29 82 C 34 85 66 85 71 82 C 76 78 75 74 72 71"
          stroke="url(#metalGrad2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* G ring */}
        <path
          d="M 50 20 C 32 20 18 34 18 52 C 18 70 32 82 50 82 C 64 82 74 76 78 65"
          stroke="url(#metalGrad2)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Financial Growth Chart inside */}
        <rect x="34" y="50" width="6" height="20" fill="url(#barGrad)" rx="1.5" />
        <rect x="44" y="40" width="6" height="30" fill="url(#barGrad)" rx="1.5" />
        <rect x="54" y="32" width="6" height="38" fill="url(#barGrad)" rx="1.5" />

        {/* Upward Growth Arrow */}
        <path
          d="M 30 58 L 42 46 L 52 52 L 72 24"
          stroke="url(#metalGrad2)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="76,16 63,24 75,34" fill="url(#metalGrad2)" />
      </svg>

      {/* Typography Section */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span className="font-extrabold tracking-tight text-slate-300" style={{ fontSize: heights * 0.52 }}>
            ym
          </span>
          <span
            className="font-black tracking-tight text-rose-600 drop-shadow-sm"
            style={{ fontSize: heights * 0.52 }}
          >
            Data
          </span>
        </div>
        <span
          className="font-bold tracking-widest text-slate-400 uppercase mt-0.5"
          style={{ fontSize: Math.max(8, heights * 0.16) }}
        >
          SMART FITNESS SOLUTIONS
        </span>
      </div>
    </div>
  );
};

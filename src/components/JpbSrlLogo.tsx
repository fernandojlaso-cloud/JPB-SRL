import React from 'react';

interface JpbSrlLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge' | 'stacked' | 'auth';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const JpbSrlLogo: React.FC<JpbSrlLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  // Precision Canadian Maple Leaf SVG with black outline matching JPB SRL logo
  const MapleLeafSvg = ({ size = 44 }: { size?: number }) => (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="shrink-0 drop-shadow-sm transition-transform group-hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Red Maple Leaf body */}
      <path
        d="M 50 14
           L 56 26 L 66 19 L 64 34 L 77 32 L 72 44 L 85 50 L 77 59 L 83 71 L 67 68 L 69 81 L 56 74 L 50 90
           L 44 74 L 31 81 L 33 68 L 17 71 L 23 59 L 15 50 L 28 44 L 23 32 L 36 34 L 34 19 L 44 26 Z"
        fill="#E11D48"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Central Trunk & Veins */}
      <path
        d="M 50 90 L 50 40"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 50 64 L 66 48"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 50 64 L 34 48"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 50 75 L 61 66"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 50 75 L 39 66"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'auth' || variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center ${className}`}>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-xl border border-slate-200 inline-flex flex-col items-center ring-4 ring-red-500/10">
          <MapleLeafSvg size={64} />
          <div className="mt-1 text-center select-none">
            <div className="font-black text-slate-950 tracking-tighter text-3xl font-sans leading-none">
              JPB
            </div>
            <div className="font-black text-slate-900 tracking-widest text-xl font-sans mt-0.5">
              SRL
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-md p-1 shrink-0 ${className}`}
      >
        <MapleLeafSvg size={size === 'sm' ? 24 : size === 'lg' ? 44 : 32} />
      </div>
    );
  }

  // Full Horizontal Brand Layout for Navbar / Headers
  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Icon Card with White Backdrop */}
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white flex items-center justify-center shadow-md border border-slate-200 shrink-0 p-1 ring-2 ring-red-500/10">
        <MapleLeafSvg size={32} />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-black tracking-tight text-white text-lg sm:text-xl font-sans">
            JPB
          </span>
          <span className="text-[11px] font-black text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-sm tracking-wider">
            SRL
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
          Control Financiero & Obras
        </span>
      </div>
    </div>
  );
};

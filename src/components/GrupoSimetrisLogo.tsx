import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'badge' | 'compact' | 'light-badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GrupoSimetrisLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { height: 28, textGrupo: 9, textSimetris: 14, circleSize: 36 },
    md: { height: 38, textGrupo: 11, textSimetris: 18, circleSize: 48 },
    lg: { height: 50, textGrupo: 13, textSimetris: 22, circleSize: 64 },
    xl: { height: 80, textGrupo: 18, textSimetris: 32, circleSize: 110 },
  }[size];

  // Specific olive-gold brand color from the logo
  const oliveGold = '#8FA02A';
  const oliveGoldDark = '#7B8B20';
  const slateGrey = '#64748B';

  if (variant === 'badge' || variant === 'light-badge') {
    return (
      <div 
        className={`inline-flex items-center justify-center rounded-full transition-transform ${
          variant === 'light-badge' ? 'bg-white shadow-md border border-slate-200' : 'bg-slate-900 border border-slate-700 shadow-lg'
        } ${className}`}
        style={{ width: dimensions.circleSize, height: dimensions.circleSize }}
      >
        <svg
          viewBox="0 0 160 160"
          width={dimensions.circleSize * 0.85}
          height={dimensions.circleSize * 0.85}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle circular boundary ring */}
          <circle cx="80" cy="80" r="76" stroke={variant === 'light-badge' ? '#e2e8f0' : '#334155'} strokeWidth="1.5" strokeDasharray="4 2" />
          
          {/* "GRUPO" Text */}
          <text
            x="80"
            y="64"
            textAnchor="middle"
            fill={variant === 'light-badge' ? '#64748b' : '#94a3b8'}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="700"
            fontSize="17"
            letterSpacing="3"
          >
            GRUPO
          </text>

          {/* "SIMETRIS" Geometric Stylized Text */}
          <g>
            <text
              x="80"
              y="98"
              textAnchor="middle"
              fill={oliveGold}
              fontFamily="'Orbitron', 'Eurostile', 'Microgramma', 'Arial Black', system-ui, sans-serif"
              fontWeight="900"
              fontSize="24"
              letterSpacing="2"
            >
              SIMETRIS
            </text>
            {/* Subtle architectural geometric underline accent */}
            <rect x="36" y="104" width="88" height="2" rx="1" fill={oliveGold} opacity="0.8" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 p-0.5 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <text x="50" y="44" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800" letterSpacing="1">
              G
            </text>
            <text x="50" y="70" textAnchor="middle" fill={oliveGold} fontSize="20" fontWeight="900" letterSpacing="0.5">
              S
            </text>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 leading-tight">
            GRUPO
          </span>
          <span 
            className="text-sm font-black tracking-wide leading-none font-mono"
            style={{ color: oliveGold }}
          >
            SIMETRIS
          </span>
        </div>
      </div>
    );
  }

  // Full Horizontal Vector Brand representation
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Authentic Circle Emblem (White circular container matching uploaded logo) */}
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-300/80 shrink-0 p-1 hover:scale-105 transition">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Faint perimeter circle */}
          <circle cx="60" cy="60" r="56" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
          
          {/* GRUPO */}
          <text 
            x="60" 
            y="48" 
            textAnchor="middle" 
            fill="#525f75" 
            fontSize="14" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontWeight="800" 
            letterSpacing="2.5"
          >
            GRUPO
          </text>
          
          {/* SIMETRIS */}
          <text 
            x="60" 
            y="76" 
            textAnchor="middle" 
            fill={oliveGoldDark} 
            fontSize="19" 
            fontFamily="'Arial Black', system-ui, sans-serif" 
            fontWeight="900" 
            letterSpacing="1.2"
          >
            SIMETRIS
          </text>
        </svg>
      </div>

      {/* Brand Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-slate-400 leading-none">
            GRUPO
          </span>
          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
            Construcción
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span 
            className="text-lg sm:text-xl font-black tracking-wider leading-none"
            style={{ color: '#97A82B' }}
          >
            SIMETRIS
          </span>
          <span className="text-xs text-slate-400 font-semibold tracking-tight">
            • Obras
          </span>
        </div>
      </div>
    </div>
  );
};

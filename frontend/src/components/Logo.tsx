import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20 border border-cyan-400/40 p-1.5 shadow-[0_0_20px_rgba(0,242,254,0.25)] transition-all hover:border-cyan-400 hover:shadow-[0_0_28px_rgba(0,242,254,0.45)]"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Futuristic ZL Monogram */}
          <path
            d="M8 10 H30 L16 26 H32"
            stroke="url(#cyanGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 26 V33 H32"
            stroke="#4facfe"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="10" r="2.5" fill="#00f2fe" />
          <defs>
            <linearGradient id="cyanGlow" x1="8" y1="10" x2="32" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00f2fe" />
              <stop offset="0.6" stopColor="#4facfe" />
              <stop offset="1" stopColor="#00e599" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-bold tracking-wider">
          <span className="text-white text-base tracking-tight font-extrabold">ZERO</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-base font-black tracking-tight">
            LATENCY
          </span>
          <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold ml-1">
            WEALTH
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 tracking-wider font-medium">
            One Portfolio. Every Asset. Clearer Understanding.
          </span>
        )}
      </div>
    </div>
  );
};

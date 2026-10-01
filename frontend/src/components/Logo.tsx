import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 40 : 32;

  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none group">
      {/* Brand Icon: Geometric High-Precision ZL Vector */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 via-purple-600/30 to-indigo-600/20 border border-purple-500/40 p-1.5 shadow-[0_0_20px_rgba(139,92,246,0.25)] group-hover:border-purple-400 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Z Form with neon electric glow */}
          <path
            d="M9 11 H31 L15 27 H33"
            stroke="url(#zlPurpleGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Vertical L Base Accent */}
          <path
            d="M21 27 V33 H33"
            stroke="#c084fc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="31" cy="11" r="2.5" fill="#a855f7" />
          <defs>
            <linearGradient id="zlPurpleGrad" x1="9" y1="11" x2="33" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <span className="text-zinc-900 dark:text-white text-[15px] font-extrabold tracking-tight">
            ZERO LATENCY
          </span>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 border border-purple-500/30">
            WEALTH
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide mt-1">
            One Portfolio. Every Asset. Clearer Understanding.
          </span>
        )}
      </div>
    </div>
  );
};

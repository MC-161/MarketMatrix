import React from 'react';

interface MarketMatrixLogoProps {
  size?: number;
  className?: string;
}

const MarketMatrixLogo: React.FC<MarketMatrixLogoProps> = ({ 
  size = 32, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="marketMatrixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="logoBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065f46" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#164e63" stopOpacity="0.9" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background - Rounded square with gradient - More pronounced */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="12"
        fill="url(#logoBgGradient)"
        stroke="url(#marketMatrixGradient)"
        strokeWidth="2.5"
        opacity="1"
        filter="url(#glow)"
      />
      
      {/* Inner highlight for depth */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="10"
        fill="none"
        stroke="url(#marketMatrixGradient)"
        strokeWidth="1"
        opacity="0.3"
      />
      
      {/* Matrix Grid in background - More visible */}
      <g stroke="url(#marketMatrixGradient)" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round">
        <line x1="20" y1="16" x2="20" y2="48" />
        <line x1="32" y1="16" x2="32" y2="48" />
        <line x1="44" y1="16" x2="44" y2="48" />
        <line x1="16" y1="24" x2="48" y2="24" />
        <line x1="16" y1="32" x2="48" y2="32" />
        <line x1="16" y1="40" x2="48" y2="40" />
      </g>
      
      {/* Stock Candlesticks - Bullish (Green) */}
      <g>
        {/* First candlestick - Bullish */}
        <rect x="18" y="38" width="4" height="8" fill="#10b981" rx="0.5" />
        <line x1="20" y1="34" x2="20" y2="38" stroke="#10b981" strokeWidth="1.5" />
        <line x1="20" y1="46" x2="20" y2="50" stroke="#10b981" strokeWidth="1.5" />
        
        {/* Second candlestick - Bullish */}
        <rect x="26" y="30" width="4" height="10" fill="#10b981" rx="0.5" />
        <line x1="28" y1="26" x2="28" y2="30" stroke="#10b981" strokeWidth="1.5" />
        <line x1="28" y1="40" x2="28" y2="44" stroke="#10b981" strokeWidth="1.5" />
        
        {/* Third candlestick - Bullish (larger) */}
        <rect x="34" y="22" width="4" height="12" fill="#06b6d4" rx="0.5" />
        <line x1="36" y1="18" x2="36" y2="22" stroke="#06b6d4" strokeWidth="1.5" />
        <line x1="36" y1="34" x2="36" y2="38" stroke="#06b6d4" strokeWidth="1.5" />
        
        {/* Fourth candlestick - Bullish (largest) */}
        <rect x="42" y="16" width="4" height="14" fill="#06b6d4" rx="0.5" />
        <line x1="44" y1="12" x2="44" y2="16" stroke="#06b6d4" strokeWidth="1.5" />
        <line x1="44" y1="30" x2="44" y2="34" stroke="#06b6d4" strokeWidth="1.5" />
      </g>
      
      {/* Upward trending arrow overlay */}
      <path
        d="M 16 50 L 48 18"
        stroke="url(#marketMatrixGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="2 2"
        opacity="0.6"
      />
      
      {/* Arrow head */}
      <path
        d="M 44 22 L 48 18 L 46 20"
        stroke="url(#marketMatrixGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MarketMatrixLogo;


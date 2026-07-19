interface LandingLogoProps {
  className?: string;
  size?: number | string;
}

export default function LandingLogo({ className = "", size = "2.25rem" }: LandingLogoProps) {
  return (
    <div 
      className={`flex-shrink-0 flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
      id="landing-logo-container"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full text-[#0066FF] filter drop-shadow-[0_0_8px_rgba(0,102,255,0.3)] transition-transform duration-300 hover:scale-105"
        id="landing-logo-svg"
      >
        {/* Outer Squircle Border */}
        <rect 
          x="6" 
          y="6" 
          width="88" 
          height="88" 
          rx="26" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="6.5" 
        />
        
        {/* Horizontal top bar of T */}
        <path 
          d="M 25 33 L 61 33" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          fill="none" 
        />
        
        {/* Left diagonal leg of T/A */}
        <path 
          d="M 52 33 L 31 73" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          fill="none" 
        />
        
        {/* Right diagonal leg of A */}
        <path 
          d="M 51 41 L 71 73" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          fill="none" 
        />
        
        {/* Center dot of A */}
        <circle 
          cx="51" 
          cy="68" 
          r="8" 
          fill="currentColor" 
        />
      </svg>
    </div>
  );
}

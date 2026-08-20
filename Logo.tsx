import React from 'react';

interface LogoProps {
  variant?: 'W-DRIVER' | 'W-BANK' | 'W-BIKE' | 'W-MOTO' | 'W-CARRO' | 'W-TÁXI' | 'icon-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'W-DRIVER',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  const sizeMap = {
    xs: { icon: 22, text: 'text-sm', sub: 'text-[8px]' },
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 68, text: 'text-3xl', sub: 'text-sm' },
    '2xl': { icon: 96, text: 'text-4xl', sub: 'text-base' },
  };

  const { icon, text, sub } = sizeMap[size];

  // Official W-DRIVER 3D Vector Logo:
  // Curved asphalt road winding through the lime green 'W' with white dashed highway center line
  const WIcon = (
    <svg
      width={icon}
      height={icon}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-[0_4px_14px_rgba(168,230,58,0.35)]"
    >
      <defs>
        {/* Apple/Lime Green 3D Gradients matching W-DRIVER brand asset */}
        <linearGradient id="wLimeLeft" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#C4F859" />
          <stop offset="45%" stopColor="#A8E63A" />
          <stop offset="100%" stopColor="#67AC16" />
        </linearGradient>
        <linearGradient id="wLimeRight" x1="10%" y1="10%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#B3F446" />
          <stop offset="50%" stopColor="#95DA26" />
          <stop offset="100%" stopColor="#538D0F" />
        </linearGradient>
        <linearGradient id="wRoadGradient" x1="30%" y1="95%" x2="80%" y2="15%">
          <stop offset="0%" stopColor="#76BC1B" />
          <stop offset="35%" stopColor="#97DD2A" />
          <stop offset="70%" stopColor="#B5F447" />
          <stop offset="100%" stopColor="#D4FC70" />
        </linearGradient>
        <linearGradient id="wAsphaltShadow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4D7F12" />
          <stop offset="100%" stopColor="#7EC824" />
        </linearGradient>
      </defs>

      {/* Outer Left Stem of the 'W' */}
      <path
        d="M18 24C18 24 29 25 36 44L47 76C47 76 34 85 24 58L18 24Z"
        fill="url(#wLimeLeft)"
      />

      {/* Outer Right Leg of the 'W' */}
      <path
        d="M98 24C102 34 96 56 83 78C73 95 65 95 65 95C65 95 75 79 85 55L98 24Z"
        fill="url(#wLimeRight)"
      />

      {/* Main Curved Sweeping Highway Ribbon forming the central 3D 'W' */}
      <path
        d="M39 77C39 77 56 34 94 24C94 24 81 38 52 83C46 93 37 96 33 94C29 91 33 82 39 77Z"
        fill="url(#wRoadGradient)"
      />

      {/* Dynamic Upper Left Wing Arch */}
      <path
        d="M21 24L35 24L48 70C48 70 38 88 27 62L21 24Z"
        fill="url(#wLimeLeft)"
      />

      {/* White Highway Dashed Centerline (Curving upward along the road) */}
      <path
        d="M42 79L44 75"
        stroke="#FFFFFF"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M48 69L52 63"
        stroke="#FFFFFF"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M57 57L63 50"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M70 43L78 37"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M84 32L89 28"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{WIcon}</div>;
  }

  const getVariantLabel = () => {
    switch (variant) {
      case 'W-BANK':
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">BANK</span>
          </>
        );
      case 'W-BIKE':
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">BIKE</span>
          </>
        );
      case 'W-MOTO':
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">MOTO</span>
          </>
        );
      case 'W-CARRO':
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">CARRO</span>
          </>
        );
      case 'W-TÁXI':
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">TÁXI</span>
          </>
        );
      case 'W-DRIVER':
      default:
        return (
          <>
            <span className="font-black tracking-tight text-[#A8E63A]">W-</span>
            <span className="font-black tracking-tight text-white">DRIVER</span>
          </>
        );
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {WIcon}
      <div className="flex flex-col justify-center">
        <div className={`flex items-center leading-none ${text}`}>
          {getVariantLabel()}
        </div>
        {showSubtitle && (
          <span className={`text-zinc-300 font-medium tracking-wide mt-1 leading-none ${sub}`}>
            {variant === 'W-BANK'
              ? 'Conta Digital & Pagamentos'
              : 'Transporte legal de passageiros'}
          </span>
        )}
      </div>
    </div>
  );
};

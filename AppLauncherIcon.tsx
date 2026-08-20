import React from 'react';

interface AppLauncherIconProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  showSubtitle?: boolean;
  withShadow?: boolean;
}

export const AppLauncherIcon: React.FC<AppLauncherIconProps> = ({
  size = 'lg',
  className = '',
  showSubtitle = true,
  withShadow = true,
}) => {
  const getDimension = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm':
        return 48;
      case 'md':
        return 80;
      case 'lg':
        return 120;
      case 'xl':
        return 160;
      case '2xl':
        return 220;
      case 'hero':
        return 280;
      default:
        return 120;
    }
  };

  const dim = getDimension();

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: dim }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${
          withShadow
            ? 'filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] drop-shadow-[0_0_24px_rgba(168,230,58,0.22)]'
            : ''
        }`}
      >
        <defs>
          {/* Metallic Chrome Bezel Gradient */}
          <linearGradient id="chromeBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6E8EC" />
            <stop offset="25%" stopColor="#8A92A0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#5B6270" />
            <stop offset="100%" stopColor="#D4D9E2" />
          </linearGradient>

          {/* Dark Brushed Inner Background */}
          <radialGradient id="darkBg" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#22272E" />
            <stop offset="55%" stopColor="#121519" />
            <stop offset="100%" stopColor="#080A0D" />
          </radialGradient>

          {/* Golden / Bronze Subtle Glow Accent */}
          <linearGradient id="bronzeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C59B27" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#76BC21" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C59B27" stopOpacity="0.3" />
          </linearGradient>

          {/* W Green 3D Road Gradients */}
          <linearGradient id="iconLimeLeft" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#D2FD65" />
            <stop offset="45%" stopColor="#A8E63A" />
            <stop offset="100%" stopColor="#5E9F10" />
          </linearGradient>

          <linearGradient id="iconLimeRight" x1="10%" y1="10%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#C0FA4D" />
            <stop offset="50%" stopColor="#95DA26" />
            <stop offset="100%" stopColor="#4A810B" />
          </linearGradient>

          <linearGradient id="iconRoadGradient" x1="25%" y1="95%" x2="85%" y2="10%">
            <stop offset="0%" stopColor="#67AB15" />
            <stop offset="35%" stopColor="#8FE020" />
            <stop offset="70%" stopColor="#B3F446" />
            <stop offset="100%" stopColor="#E4FE8C" />
          </linearGradient>

          {/* Inner Shadow Filter */}
          <filter id="innerBevel" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0" dy="3" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="#000" floodOpacity="0.7" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Outer Squircle Container with Chrome Metallic Bezel */}
        <rect
          x="12"
          y="12"
          width="376"
          height="376"
          rx="82"
          fill="url(#chromeBezel)"
          stroke="#404854"
          strokeWidth="2"
        />

        {/* Subtle Bronze / Gold Outer Ring Accent */}
        <rect
          x="18"
          y="18"
          width="364"
          height="364"
          rx="76"
          fill="none"
          stroke="url(#bronzeGlow)"
          strokeWidth="3"
        />

        {/* Inner Dark Textured Squircle Canvas */}
        <rect
          x="24"
          y="24"
          width="352"
          height="352"
          rx="72"
          fill="url(#darkBg)"
        />

        {/* Subtle Geometric Polygonal Grid Pattern */}
        <g stroke="#2C3440" strokeWidth="0.8" strokeOpacity="0.4">
          <line x1="24" y1="120" x2="376" y2="120" />
          <line x1="24" y1="200" x2="376" y2="200" />
          <line x1="24" y1="280" x2="376" y2="280" />
          <line x1="120" y1="24" x2="120" y2="376" />
          <line x1="200" y1="24" x2="200" y2="376" />
          <line x1="280" y1="24" x2="280" y2="376" />
        </g>

        {/* Central 3D W Road Glyph */}
        <g transform="translate(100, 48) scale(1.68)">
          {/* Outer Left Stem */}
          <path
            d="M18 24C18 24 29 25 36 44L47 76C47 76 34 85 24 58L18 24Z"
            fill="url(#iconLimeLeft)"
          />

          {/* Outer Right Leg */}
          <path
            d="M98 24C102 34 96 56 83 78C73 95 65 95 65 95C65 95 75 79 85 55L98 24Z"
            fill="url(#iconLimeRight)"
          />

          {/* Main Sweeping Highway Ribbon */}
          <path
            d="M39 77C39 77 56 34 94 24C94 24 81 38 52 83C46 93 37 96 33 94C29 91 33 82 39 77Z"
            fill="url(#iconRoadGradient)"
          />

          {/* Upper Left Wing */}
          <path
            d="M21 24L35 24L48 70C48 70 38 88 27 62L21 24Z"
            fill="url(#iconLimeLeft)"
          />

          {/* Highway Dashed Centerline Markings */}
          <path d="M42 79L44 75" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M48 69L52 63" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M57 57L63 50" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M70 43L78 37" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M84 32L89 28" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        {/* Text: W-DRIVER */}
        <text
          x="200"
          y="272"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="40"
          letterSpacing="0.05em"
        >
          <tspan fill="#A8E63A">W-</tspan>
          <tspan fill="#FFFFFF">DRIVER</tspan>
        </text>

        {/* Subtitle: transporte legal de passageiros */}
        {showSubtitle && (
          <>
            <text
              x="200"
              y="302"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="600"
              fontSize="12.5"
              fill="#D4D9E2"
              letterSpacing="0.03em"
            >
              transporte legal de passageiros
            </text>
            <text
              x="200"
              y="320"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="500"
              fontSize="11"
              fill="#8A92A0"
              letterSpacing="0.02em"
            >
              e encomendas desde 2009
            </text>
          </>
        )}

        {/* Metallic Bevel Light Reflection Highlight */}
        <path
          d="M32 94C32 58 58 32 94 32H306C342 32 368 58 368 94V130C320 90 240 80 160 100C80 120 40 140 32 130V94Z"
          fill="#FFFFFF"
          fillOpacity="0.06"
        />
      </svg>
    </div>
  );
};

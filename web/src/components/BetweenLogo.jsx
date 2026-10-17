import React from 'react';

export default function BetweenLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 108 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="Between Logo"
    >
      <defs>
        {/* Soft Ceramic Squircle Shadow */}
        <filter id="logoTileShadow" x="0" y="2" width="108" height="106" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1C1917" floodOpacity="0.08" />
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#1C1917" floodOpacity="0.04" />
        </filter>

        {/* Squircle Tile Surface Gradient */}
        <linearGradient id="tileGradient" x1="16" y1="8" x2="92" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5EFE7" />
        </linearGradient>

        {/* Left Ring: Ember to Warm Rose Gold */}
        <linearGradient id="leftRingGrad" x1="28" y1="36" x2="68" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D94E34" />
          <stop offset="60%" stopColor="#DE4D6A" />
          <stop offset="100%" stopColor="#E5A93C" />
        </linearGradient>

        {/* Right Ring: Deep Charcoal Obsidian to Warm Bronze */}
        <linearGradient id="rightRingGrad" x1="40" y1="36" x2="80" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1C1917" />
          <stop offset="50%" stopColor="#3F3731" />
          <stop offset="100%" stopColor="#8C6D58" />
        </linearGradient>

        {/* Golden Vesica Piscis Center Glow */}
        <radialGradient id="vesicaGlow" cx="54" cy="54" r="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2DC" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#E5A93C" stopOpacity="0.75" />
          <stop offset="85%" stopColor="#D94E34" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#D94E34" stopOpacity="0.1" />
        </radialGradient>

        {/* Central Luminous Lens Filter */}
        <filter id="lensBloom" x="38" y="30" width="32" height="48" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Base Squircle Plinth (Porcelain Ceramic with tactile edge) */}
      <rect
        x="6"
        y="6"
        width="96"
        height="96"
        rx="26"
        fill="url(#tileGradient)"
        stroke="#E6DDD2"
        strokeWidth="1.5"
        filter="url(#logoTileShadow)"
      />

      {/* Inner subtle hair rim */}
      <rect
        x="7.5"
        y="7.5"
        width="93"
        height="93"
        rx="24.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeOpacity="0.85"
      />

      {/* 2. Golden Vesica Piscis Lens (The Sacred Space "Between") */}
      <g filter="url(#lensBloom)">
        <path
          d="M 54 36.5 A 20 20 0 0 1 54 71.5 A 20 20 0 0 1 54 36.5 Z"
          fill="url(#vesicaGlow)"
        />
      </g>

      {/* 3. Left Ring (Partner 1 / Ember Presence) */}
      <circle
        cx="46"
        cy="54"
        r="19"
        stroke="url(#leftRingGrad)"
        strokeWidth="3.75"
        strokeLinecap="round"
      />

      {/* 4. Right Ring (Partner 2 / Ink Presence) */}
      <circle
        cx="62"
        cy="54"
        r="19"
        stroke="url(#rightRingGrad)"
        strokeWidth="3.75"
        strokeLinecap="round"
      />

      {/* 5. Vesica Piscis Perimeter Contour (Sharpened connection edge) */}
      <path
        d="M 54 36.5 A 20 20 0 0 1 54 71.5 A 20 20 0 0 1 54 36.5 Z"
        fill="none"
        stroke="#E5A93C"
        strokeWidth="1.25"
        strokeOpacity="0.65"
      />

      {/* 6. Central Spark / Star of Connection */}
      <path
        d="M 54 49.5 Q 54 54 58.5 54 Q 54 54 54 58.5 Q 54 54 49.5 54 Q 54 54 54 49.5 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <circle
        cx="54"
        cy="54"
        r="1.2"
        fill="#E5A93C"
      />
    </svg>
  );
}

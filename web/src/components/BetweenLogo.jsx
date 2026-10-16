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
      {/* Outer iOS Squircle Background */}
      <path
        d="M24 4H84C95.0457 4 104 12.9543 104 24V84C104 95.0457 95.0457 104 84 104H24C12.9543 104 4 95.0457 4 84V24C4 12.9543 12.9543 4 24 4Z"
        fill="#F6F4F0"
      />

      {/* Elevated Center Squircle */}
      <path
        d="M34 22H74C80.6274 22 86 27.3726 86 34V74C86 80.6274 80.6274 86 74 86H34C27.3726 86 22 80.6274 22 74V34C22 27.3726 27.3726 22 34 22Z"
        fill="#FFFFFF"
      />

      {/* Left Venn Loop (Warm Ember/Terracotta: #C2673B) */}
      <circle
        cx="45"
        cy="54"
        r="13"
        stroke="#C2673B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Venn Loop (Warm Slate/Ink: #18181B) */}
      <circle
        cx="63"
        cy="54"
        r="13"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

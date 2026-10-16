import React, { useState, useRef } from 'react';

export default function InteractiveCard3D({ children, isWildcard = false, className = '' }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 10 degrees tilt for balanced elegance
    const rotateX = -((y - centerY) / centerY) * 9;
    const rotateY = ((x - centerX) / centerX) * 9;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handlePointerLeave = () => {
    setTilt(prev => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  };

  return (
    <div
      style={{
        perspective: '1400px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`soft-card ${isWildcard ? 'wildcard-card' : ''} ${className}`}
        style={{
          width: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${tilt.isHovered ? 'scale3d(1.015, 1.015, 1.015)' : 'scale3d(1, 1, 1)'}`,
          transition: tilt.isHovered 
            ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.2s ease-out' 
            : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out',
          boxShadow: tilt.isHovered
            ? '0 28px 64px -12px rgba(28, 25, 23, 0.14), 0 16px 24px -8px rgba(28, 25, 23, 0.08)'
            : 'var(--shadow-md)',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic Specular Sheen (Curved Light Reflection) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle 380px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0) 75%)`,
            opacity: tilt.isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            zIndex: 1
          }}
          aria-hidden="true"
        />

        {/* Inner Content with Subtle 3D Depth Layer */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          transform: 'translateZ(26px)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

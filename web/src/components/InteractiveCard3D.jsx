import React, { useState, useRef } from 'react';

export default function InteractiveCard3D({ 
  children, 
  frontContent,
  backContent,
  isFlipped = false,
  isWildcard = false, 
  className = '', 
  swipeClass = '',
  onSwipeLeft,
  onSwipeRight
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
      return;
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;

    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      setDragOffset(deltaX);
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handlePointerUp = () => {
    if (isDragging) {
      if (dragOffset < -65 && onSwipeLeft) {
        onSwipeLeft();
      } else if (dragOffset > 65 && onSwipeRight) {
        onSwipeRight();
      }
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const handlePointerLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
    setTilt(prev => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  };

  const dragRotation = dragOffset * 0.045;
  const baseFlipAngle = isFlipped ? 180 : 0;
  
  // Real Z-Axis Card Elevation & Tactile Physics
  const currentTransform = isDragging
    ? `translateX(${dragOffset}px) translateZ(38px) rotateZ(${dragRotation}deg) rotateX(${tilt.rotateX * 0.45}deg) rotateY(${baseFlipAngle + tilt.rotateY * 0.45}deg) scale(0.99)`
    : (tilt.isHovered
        ? `translateZ(24px) rotateX(${tilt.rotateX}deg) rotateY(${baseFlipAngle + tilt.rotateY}deg) scale3d(1.012, 1.012, 1.012)`
        : `translateZ(0px) rotateX(0deg) rotateY(${baseFlipAngle}deg) scale3d(1, 1, 1)`);

  const renderSpecularSheen = () => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle 420px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0) 75%)`,
        opacity: tilt.isHovered || isDragging ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
        zIndex: 1,
        borderRadius: 'inherit'
      }}
      aria-hidden="true"
    />
  );

  const renderCornerMarks = () => (
    <>
      <div style={{ position: 'absolute', top: '12px', left: '14px', fontSize: '10px', color: 'rgba(198, 136, 44, 0.4)', pointerEvents: 'none', zIndex: 3, userSelect: 'none' }}>◇</div>
      <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10px', color: 'rgba(198, 136, 44, 0.4)', pointerEvents: 'none', zIndex: 3, userSelect: 'none' }}>◇</div>
      <div style={{ position: 'absolute', bottom: '12px', left: '14px', fontSize: '10px', color: 'rgba(198, 136, 44, 0.4)', pointerEvents: 'none', zIndex: 3, userSelect: 'none' }}>◇</div>
      <div style={{ position: 'absolute', bottom: '12px', right: '14px', fontSize: '10px', color: 'rgba(198, 136, 44, 0.4)', pointerEvents: 'none', zIndex: 3, userSelect: 'none' }}>◇</div>
    </>
  );

  return (
    <div
      style={{
        perspective: '1400px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`${swipeClass} ${className}`}
        style={{
          width: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: currentTransform,
          transition: isDragging 
            ? 'none' 
            : 'transform 0.58s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {frontContent && backContent ? (
          <>
            {/* FRONT FACE */}
            <div
              className={`tabletop-playing-card ${isWildcard ? 'wildcard-card' : ''}`}
              style={{
                width: '100%',
                position: isFlipped ? 'absolute' : 'relative',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg) translateZ(1px)',
                zIndex: isFlipped ? 1 : 2,
                pointerEvents: isFlipped ? 'none' : 'auto'
              }}
            >
              {renderSpecularSheen()}
              <div style={{ position: 'relative', zIndex: 5, width: '100%' }}>
                {frontContent}
              </div>
            </div>

            {/* BACK FACE */}
            <div
              className={`tabletop-playing-card ${isWildcard ? 'wildcard-card' : ''}`}
              style={{
                width: '100%',
                position: isFlipped ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(1px)',
                zIndex: isFlipped ? 2 : 1,
                pointerEvents: isFlipped ? 'auto' : 'none'
              }}
            >
              {renderSpecularSheen()}
              <div style={{ position: 'relative', zIndex: 5, width: '100%' }}>
                {backContent}
              </div>
            </div>
          </>
        ) : (
          <div
            className={`tabletop-playing-card ${isWildcard ? 'wildcard-card' : ''}`}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {renderSpecularSheen()}
            <div style={{ position: 'relative', zIndex: 5, width: '100%' }}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

// Hand-Drawn Ink Illustration Assets
import ghostImg from '../assets/illustrations/ghost.jpg';
import pizzaImg from '../assets/illustrations/pizza.jpg';
import needleImg from '../assets/illustrations/needle.jpg';
import balaclavasImg from '../assets/illustrations/balaclavas.jpg';
import bleichmonsterImg from '../assets/illustrations/bleichmonster.jpg';
import mittenImg from '../assets/illustrations/mitten.jpg';
import matchstickImg from '../assets/illustrations/matchstick.jpg';
import telephoneImg from '../assets/illustrations/telephone.jpg';
import teacupImg from '../assets/illustrations/teacup.jpg';
import polaroidImg from '../assets/illustrations/polaroid.jpg';
import cheersImg from '../assets/illustrations/cheers.jpg';
import padlockImg from '../assets/illustrations/padlock.jpg';

/**
 * Common Hand-Drawn Card Illustration Component:
 * - Uses mix-blend-mode: multiply so the black ink linework naturally sinks
 *   directly onto the powder blue or peach cardstock background without white boxes.
 * - Living micro-animation keyframes add delightful personality.
 */
function CardIllustration({ src, alt, size = 118, animationClass = '', className = '' }) {
  return (
    <div
      className={`card-illustration-container mascot-animated ${animationClass} ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      <img
        src={src}
        alt={alt}
        className="card-illustration-img"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          filter: 'contrast(1.1) brightness(1.02)',
          userSelect: 'none',
          pointerEvents: 'none',
          display: 'block'
        }}
        loading="eager"
      />
    </div>
  );
}

// 1. Ghost Mascot ("Downcycling" - Hand-drawn reference match)
export function GhostMascot({ size = 118, className = '' }) {
  return <CardIllustration src={ghostImg} alt="Downcycling Ghost" size={size} animationClass="mascot-ghost" className={className} />;
}

// 2. Melting Pizza Mascot ("Speckgürtel" - Hand-drawn reference match)
export function PizzaMascot({ size = 118, className = '' }) {
  return <CardIllustration src={pizzaImg} alt="Speckgürtel Pizza" size={size} animationClass="mascot-melting" className={className} />;
}

// 3. Sewing Needle Mascot ("Nähcafe" - Hand-drawn reference match)
export function NeedleMascot({ size = 118, className = '' }) {
  return <CardIllustration src={needleImg} alt="Nähcafe Needle" size={size} animationClass="mascot-needle" className={className} />;
}

// 4. Twin Ski Masks Mascot ("Upcycling" - Hand-drawn reference match)
export function SkiMasksMascot({ size = 118, className = '' }) {
  return <CardIllustration src={balaclavasImg} alt="Upcycling Balaclavas" size={size} animationClass="mascot-hoods" className={className} />;
}

// 5. Bleach Monster Mascot ("Bleichmonster" - Hand-drawn reference match)
export function BleichmonsterMascot({ size = 118, className = '' }) {
  return <CardIllustration src={bleichmonsterImg} alt="Bleichmonster" size={size} animationClass="mascot-blob" className={className} />;
}

// 6. Mitten & Moths Mascot ("Mottenfresser" - Hand-drawn reference match)
export function MittenMascot({ size = 118, className = '' }) {
  return <CardIllustration src={mittenImg} alt="Mottenfresser Mitten" size={size} animationClass="mascot-hands" className={className} />;
}

// 7. Matchstick Mascot ("Zündholz" / Wildcard - Hand-drawn reference match)
export function MatchstickMascot({ size = 118, className = '' }) {
  return <CardIllustration src={matchstickImg} alt="Zündholz Matchstick" size={size} animationClass="mascot-spark" className={className} />;
}

// 8. Tin Can Telephone Mascot (Hand-drawn reference match)
export function TinCanTelephoneMascot({ size = 118, className = '' }) {
  return <CardIllustration src={telephoneImg} alt="Tin Can Telephone" size={size} animationClass="mascot-glide" className={className} />;
}

// 9. Cozy Teacup Mascot (Hand-drawn reference match)
export function TeacupMascot({ size = 118, className = '' }) {
  return <CardIllustration src={teacupImg} alt="Cozy Teacup" size={size} animationClass="mascot-cup" className={className} />;
}

// 10. Vintage Polaroid Camera Mascot (Hand-drawn reference match)
export function PolaroidCameraMascot({ size = 118, className = '' }) {
  return <CardIllustration src={polaroidImg} alt="Polaroid Camera" size={size} animationClass="mascot-breathe" className={className} />;
}

// 11. Clinking Coupe Glasses Mascot (Hand-drawn reference match)
export function ClinkingGlassesMascot({ size = 118, className = '' }) {
  return <CardIllustration src={cheersImg} alt="Cheers Clinking Glasses" size={size} animationClass="mascot-spark" className={className} />;
}

// 12. Heart Padlock & Key Mascot (Hand-drawn reference match)
export function HeartPadlockMascot({ size = 118, className = '' }) {
  return <CardIllustration src={padlockImg} alt="Heart Padlock" size={size} animationClass="mascot-sway" className={className} />;
}

// Fallback & Legacy Aliases
export const HoodsMascot = SkiMasksMascot;
export const MeltingMascot = PizzaMascot;
export const HandsMascot = MittenMascot;
export const FlightMascot = NeedleMascot;
export const CatPawMascot = MittenMascot;
export const LoveLetterMascot = GhostMascot;
export const HourglassMascot = MatchstickMascot;
export const CandleMascot = MatchstickMascot;

/**
 * The 6 Signature Mascots directly from the German tabletop card game reference:
 */
export const PHOTO_HERO_MASCOTS = [
  GhostMascot,         // 0: Downcycling
  PizzaMascot,         // 1: Speckgürtel
  NeedleMascot,        // 2: Nähcafe
  SkiMasksMascot,      // 3: Upcycling
  BleichmonsterMascot, // 4: Bleichmonster
  MittenMascot         // 5: Mottenfresser
];

export const ALL_TABLETOP_MASCOTS = [
  GhostMascot,
  PizzaMascot,
  NeedleMascot,
  SkiMasksMascot,
  BleichmonsterMascot,
  MittenMascot,
  MatchstickMascot,
  TinCanTelephoneMascot,
  TeacupMascot,
  ClinkingGlassesMascot,
  PolaroidCameraMascot,
  HeartPadlockMascot
];

/**
 * Powder blue palette matching the photo reference (#A8CEEB),
 * with warm golden apricot for wildcards (#F5D0A8).
 */
export function getCardThemeColor(question) {
  if (!question) return '#A8CEEB';
  if (question.isWildcard || (question.id && question.id.startsWith('wildcard'))) {
    return '#F5D0A8';
  }
  return '#A8CEEB';
}

/**
 * Clean sticker label matching the reference card's white pill strip.
 */
export function getCardStickerLabel(question) {
  if (!question) return 'BETWEEN';
  if (question.isWildcard || question.id?.startsWith('wildcard')) {
    return '★ WILDCARD · ASK ANYTHING ★';
  }
  if (question.isMystery || question.category === 'MYSTERY') {
    return `SECRET · FROM ${question.author ? question.author.toUpperCase() : 'PARTNER'}`;
  }
  return (question.category || 'BETWEEN').toUpperCase();
}

/**
 * Intelligent mascot selector ensuring every card has a delightful, hand-drawn
 * character from the authentic tabletop universe.
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // Special cases
  if (id.includes('WILDCARD')) return MatchstickMascot;
  if (id.includes('MIDNIGHT')) return MatchstickMascot;

  // Specific thematic matches
  if (cat.includes('TEA') || cat.includes('CONVERS')) return TeacupMascot;
  if (cat.includes('SPARK') || cat.includes('CHEM')) return ClinkingGlassesMascot;
  if (cat.includes('CALL') || cat.includes('PHONE')) return TinCanTelephoneMascot;
  if (cat.includes('SECRET') || cat.includes('MYSTERY')) return BleichmonsterMascot;
  if (cat.includes('KEY') || cat.includes('LOCK')) return HeartPadlockMascot;
  if (cat.includes('PHOTO') || cat.includes('IMAGE')) return PolaroidCameraMascot;

  // Compute a deterministic hash based on questionId to evenly rotate illustrations
  let hash = 0;
  const seed = (id || cat || 'BETWEEN');
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const safeHash = Math.abs(hash);

  // In early rounds (Depth 1-2), strongly prioritize the 6 famous photo heroes!
  if (depth <= 2) {
    return PHOTO_HERO_MASCOTS[safeHash % PHOTO_HERO_MASCOTS.length];
  }

  // In deeper rounds (Depth 3-5), blend all illustrations
  return ALL_TABLETOP_MASCOTS[safeHash % ALL_TABLETOP_MASCOTS.length];
}

import React from 'react';

/**
 * ============================================================================
 * MINIMALIST ROMANTIC & CONNECTION OBJECT LINE ART
 * Pure vector single-line illustrations of iconic romantic still-life objects
 * and poetic symbols in the refined style of modern indie card decks:
 * - 100% clean object/symbol illustrations (no distorted human figures or faces)
 * - Fluid, expressive continuous bezier contours (#1C1917, strokeWidth 2.2 - 2.8)
 * - Razor-sharp on all screens (zero raster compression artifacts)
 * ============================================================================
 */

// 1. Cozy Coffee Cups (Conversations, Morning Talks, Safe Warmth)
export function CozyCoffeeCupsIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-cup ${className}`}>
      {/* Table horizon line */}
      <path d="M18 78C35 80 65 80 82 78" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      
      {/* Left Coffee Mug */}
      <path
        d="M26 50H46V68C46 74 40 76 36 76C32 76 26 74 26 68V50Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Mug Handle */}
      <path
        d="M26 54C20 54 18 64 26 66"
        stroke="#1C1917"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Right Coffee Mug */}
      <path
        d="M54 50H74V68C74 74 68 76 64 76C60 76 54 74 54 68V50Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Mug Handle */}
      <path
        d="M74 54C80 54 82 64 74 66"
        stroke="#1C1917"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Intertwining steam loops forming a subtle heart */}
      <path
        d="M36 44C36 34 44 32 48 24C50 20 50 16 50 16"
        stroke="#1C1917"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M64 44C64 34 56 32 52 24C50 20 50 16 50 16"
        stroke="#1C1917"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Heart at the top of steam */}
      <path
        d="M50 20C48.5 17.5 45.5 18 46.5 21C47.5 24 50 26 50 26C50 26 52.5 24 53.5 21C54.5 18 51.5 17.5 50 20Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 2. Clinking Coupe Glasses (Chemistry, Celebration, Date Night)
export function ClinkingGlassesIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      {/* Left Glass tilted */}
      <g transform="rotate(14 36 56)">
        <path d="M26 30H46C46 42 36 48 36 48C36 48 26 42 26 30Z" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="36" y1="48" x2="36" y2="74" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="36" cy="74" rx="9" ry="2.6" stroke="#1C1917" strokeWidth="2.6" />
      </g>
      {/* Right Glass tilted */}
      <g transform="rotate(-14 64 56)">
        <path d="M54 30H74C74 42 64 48 64 48C64 48 54 42 54 30Z" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="64" y1="48" x2="64" y2="74" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="64" cy="74" rx="9" ry="2.6" stroke="#1C1917" strokeWidth="2.6" />
      </g>
      {/* Celebratory Starburst */}
      <path d="M50 18L51.5 24L57 25.5L51.5 27L50 33L48.5 27L43 25.5L48.5 24Z" fill="#1C1917" />
      <circle cx="38" cy="22" r="1.5" fill="#1C1917" />
      <circle cx="62" cy="22" r="1.5" fill="#1C1917" />
      <circle cx="50" cy="38" r="1.3" fill="#1C1917" />
    </svg>
  );
}

// 3. Star Constellation (Destiny, Dreams, Future Together)
export function ConstellationIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-glide ${className}`}>
      {/* Connected constellation lines */}
      <polyline
        points="22,68 36,44 50,56 64,34 80,48"
        stroke="#1C1917"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Secondary romantic connecting arc */}
      <path
        d="M36 44C44 28 58 28 64 34"
        stroke="#1C1917"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Star nodes */}
      <circle cx="22" cy="68" r="3.2" fill="#1C1917" />
      <circle cx="36" cy="44" r="3.6" fill="#1C1917" />
      <circle cx="50" cy="56" r="3.2" fill="#1C1917" />
      <circle cx="64" cy="34" r="3.6" fill="#1C1917" />
      <circle cx="80" cy="48" r="3.2" fill="#1C1917" />
      {/* Northern starburst atop constellation */}
      <path d="M50 14L51.5 19L56 20.5L51.5 22L50 27L48.5 22L44 20.5L48.5 19Z" fill="#1C1917" />
    </svg>
  );
}

// 4. Folded Letter (Unspoken Thoughts, Confessions, Words)
export function FoldedLetterIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-float ${className}`}>
      {/* Minimalist envelope body */}
      <rect x="22" y="32" width="56" height="38" rx="4" stroke="#1C1917" strokeWidth="2.6" fill="#FFFFFF" />
      {/* Envelope flap lines */}
      <polyline points="22,34 50,54 78,34" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="22" y1="70" x2="42" y2="50" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="78" y1="70" x2="58" y2="50" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
      {/* Heart wax seal in center */}
      <path
        d="M50 50C48.5 47 45 47.5 46 51C47 54.5 50 57.5 50 57.5C50 57.5 53 54.5 54 51C55 47.5 51.5 47 50 50Z"
        fill="#1C1917"
      />
      {/* Floating love ink specks */}
      <circle cx="18" cy="26" r="1.6" fill="#1C1917" />
      <circle cx="82" cy="24" r="1.8" fill="#1C1917" />
      <path d="M74 18L75 20L77 21L75 22L74 24L73 22L71 21L73 20Z" fill="#1C1917" />
    </svg>
  );
}

// 5. Candle Flame (Midnight Whispers, Stillness, Warmth)
export function CandleFlameIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Base holder line */}
      <path d="M30 84C42 86 58 86 70 84" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Slender candle body */}
      <rect x="44" y="44" width="12" height="40" rx="3" stroke="#1C1917" strokeWidth="2.6" fill="#FFFFFF" />
      {/* Wick */}
      <line x1="50" y1="38" x2="50" y2="44" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      {/* Teardrop dancing flame */}
      <path
        d="M50 14C50 14 62 26 62 32C62 38 56 42 50 42C44 42 38 38 38 32C38 26 50 14 50 14Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner flame core */}
      <path
        d="M50 24C50 24 55 29 55 33C55 36 53 38 50 38C47 38 45 36 45 33C45 29 50 24 50 24Z"
        fill="#1C1917"
      />
      {/* Radiating warmth ring */}
      <path d="M34 26C31 30 31 36 34 40" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M66 26C69 30 69 36 66 40" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 6. Matchstick Spark (Wildcard / The First Spark / Chemistry)
export function MatchSparkIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      {/* Slender wooden matchstick tilted */}
      <g transform="rotate(22 50 64)">
        <rect x="46" y="44" width="8" height="42" rx="2" stroke="#1C1917" strokeWidth="2.5" fill="#FFFFFF" />
        <ellipse cx="50" cy="40" rx="6" ry="7" fill="#1C1917" />
      </g>
      {/* Radiant vibrant flame */}
      <path
        d="M48 16C48 16 60 26 60 32C60 38 54 42 48 42C42 42 38 38 38 32C38 26 48 16 48 16Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkle starbursts */}
      <path d="M48 6V12" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M66 22L61 24" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 22L35 24" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="64" cy="14" r="1.6" fill="#1C1917" />
      <circle cx="32" cy="14" r="1.6" fill="#1C1917" />
      <circle cx="56" cy="8" r="1.3" fill="#1C1917" />
    </svg>
  );
}

// 7. Vintage Vinyl Record (Shared Rhythm, Music, Kitchen Dancing)
export function VinylRecordIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-sway ${className}`}>
      {/* Outer Vinyl Disc */}
      <circle cx="50" cy="50" r="34" stroke="#1C1917" strokeWidth="2.6" />
      {/* Sound Grooves */}
      <circle cx="50" cy="50" r="26" stroke="#1C1917" strokeWidth="1.2" strokeDasharray="8 4" />
      <circle cx="50" cy="50" r="19" stroke="#1C1917" strokeWidth="1.2" strokeDasharray="6 3" />
      {/* Center Label */}
      <circle cx="50" cy="50" r="12" stroke="#1C1917" strokeWidth="2.2" fill="#FFFFFF" />
      {/* Spindle Hole */}
      <circle cx="50" cy="50" r="3.2" fill="#1C1917" />
      {/* Turntable Stylus / Tone Arm */}
      <path d="M78 18L66 26L60 38" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="56" y="36" width="6" height="4" rx="1" fill="#1C1917" transform="rotate(-30 59 38)" />
      {/* Musical Note & Sparkle */}
      <path d="M22 28V20C22 17 26 17 29 19V24" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="28" r="2.5" fill="#1C1917" />
      <circle cx="78" cy="74" r="1.6" fill="#1C1917" />
      <path d="M26 72L27 74L29 75L27 76L26 78L25 76L23 75L25 74Z" fill="#1C1917" />
    </svg>
  );
}

// 8. Polaroid Photo (Memories, Captured Moments, Nostalgia)
export function PolaroidPhotoIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-float ${className}`}>
      {/* Polaroid Outer Card Frame */}
      <rect x="25" y="20" width="50" height="60" rx="4" stroke="#1C1917" strokeWidth="2.6" fill="#FFFFFF" />
      {/* Photo Viewport */}
      <rect x="30" y="25" width="40" height="38" rx="2" stroke="#1C1917" strokeWidth="2.2" />
      {/* Scenic Horizon Inside Photo */}
      <path d="M30 52C36 45 42 48 50 42C56 38 62 46 70 52" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      {/* Sun / Moon in Photo */}
      <circle cx="42" cy="36" r="3.2" fill="#1C1917" />
      {/* Heart Doodle on Bottom Margin */}
      <path
        d="M50 71C48.5 68.5 45 69 46 72.5C47 75.5 50 78 50 78C50 78 53 75.5 54 72.5C55 69 51.5 68.5 50 71Z"
        fill="#1C1917"
      />
      {/* Top Paperclip */}
      <path d="M44 14C44 10 52 10 52 14V24C52 27 48 27 48 24V16" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      {/* Ambient Twinkles */}
      <circle cx="18" cy="30" r="1.6" fill="#1C1917" />
      <circle cx="82" cy="65" r="1.8" fill="#1C1917" />
    </svg>
  );
}

// 9. Paper Airplane (Messages Across Distance, Playful Love, Unspoken Thoughts)
export function PaperAirplaneIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-glide ${className}`}>
      {/* Looping Heart Flight Trail */}
      <path
        d="M16 78C26 80 32 68 28 58C24 48 14 54 20 66C24 74 36 68 46 58"
        stroke="#1C1917"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      {/* Main Origami Paper Plane */}
      <polygon points="80,24 28,44 50,58" stroke="#1C1917" strokeWidth="2.6" strokeLinejoin="round" fill="#FFFFFF" />
      <line x1="80" y1="24" x2="50" y2="58" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <polygon points="50,58 52,70 62,53" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" fill="#1C1917" />
      {/* Guiding Sparkle Star */}
      <path d="M86 16L87.5 20L92 21.5L87.5 23L86 27L84.5 23L80 21.5L84.5 20Z" fill="#1C1917" />
      <circle cx="68" cy="80" r="1.6" fill="#1C1917" />
    </svg>
  );
}

// 10. Antique Skeleton Key (Trust, Unlocking Deeper Layers, Emotional Safety)
export function AntiqueKeyIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-sway ${className}`}>
      {/* Heart-Shaped Key Bow */}
      <path
        d="M50 32C44 23 32 25 32 35C32 44 48 53 50 55C52 53 68 44 68 35C68 25 56 23 50 32Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Inner Heart Cutout */}
      <path
        d="M50 36C47 31 39 32 39 38C39 43 48 48 50 50C52 48 61 43 61 38C61 32 53 31 50 36Z"
        fill="#1C1917"
      />
      {/* Slender Key Stem */}
      <line x1="50" y1="55" x2="50" y2="84" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Key Teeth with Heart Notch */}
      <path d="M50 72H60V77H55V82H60" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles of Trust */}
      <circle cx="68" cy="74" r="1.8" fill="#1C1917" />
      <circle cx="32" cy="66" r="1.6" fill="#1C1917" />
      <path d="M50 14L51.5 17L54 18L51.5 19L50 22L48.5 19L46 18L48.5 17Z" fill="#1C1917" />
    </svg>
  );
}

// 11. Crescent Moon & Star (Midnight Conversations, Pillow Talk, Dreams)
export function CrescentMoonIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-glide ${className}`}>
      {/* Slender Romantic Crescent Moon */}
      <path
        d="M52 18C38 22 28 36 30 52C32 68 46 80 64 78C48 74 40 58 44 42C47 30 56 22 62 18C59 17 55 17 52 18Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Twinkling Star Cradled in Crescent */}
      <path d="M68 42L70 47L75 49L70 51L68 56L66 51L61 49L66 47Z" fill="#1C1917" />
      {/* Starlight Constellation Dots */}
      <circle cx="26" cy="32" r="1.6" fill="#1C1917" />
      <circle cx="76" cy="26" r="1.5" fill="#1C1917" />
      <circle cx="34" cy="72" r="1.6" fill="#1C1917" />
      <circle cx="74" cy="68" r="1.3" fill="#1C1917" />
    </svg>
  );
}

// 12. Minimalist Hourglass (Presence, Stillness, Precious Time Together)
export function HourglassIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-breathe ${className}`}>
      {/* Top & Bottom Tabletop Caps */}
      <line x1="26" y1="22" x2="74" y2="22" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="26" y1="78" x2="74" y2="78" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
      {/* Tapered Glass Bulbs */}
      <path
        d="M32 22L48 48C49 50 49 50 48 52L32 78M68 22L52 48C51 50 51 50 52 52L68 78"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flowing Sand Mound in Lower Chamber */}
      <path d="M38 76C44 68 56 68 62 76" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      {/* Gentle Stream of Falling Sand */}
      <line x1="50" y1="46" x2="50" y2="70" stroke="#1C1917" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
      {/* Presence Sparkle at Center Waist */}
      <circle cx="50" cy="50" r="2.2" fill="#1C1917" />
      <circle cx="20" cy="50" r="1.4" fill="#1C1917" />
      <circle cx="80" cy="50" r="1.4" fill="#1C1917" />
    </svg>
  );
}

/**
 * 12 Refined Romantic Object & Poetic Symbol Illustrations
 * (All 100% inanimate tabletop objects - zero anatomical oddities)
 */
export const ROMANTIC_HERO_MASCOTS = [
  CozyCoffeeCupsIllustration,   // 0: Morning talks, warmth
  MatchSparkIllustration,        // 1: The first spark, chemistry
  CandleFlameIllustration,       // 2: Midnight whispers, stillness
  FoldedLetterIllustration,      // 3: Unspoken thoughts, confessions
  ConstellationIllustration,     // 4: Destiny, future, dreams
  ClinkingGlassesIllustration,   // 5: Celebration, date night
  VinylRecordIllustration,       // 6: Music, slow dance in kitchen
  PolaroidPhotoIllustration,     // 7: Memories, captured moments
  PaperAirplaneIllustration,     // 8: Messages, thoughts across distance
  AntiqueKeyIllustration,        // 9: Trust, unlocking vulnerability
  CrescentMoonIllustration,      // 10: Pillow talk, bedtime dreams
  HourglassIllustration          // 11: Presence, time standing still
];

// Aliases for seamless backwards compatibility
export const IntertwinedHandsIllustration = CozyCoffeeCupsIllustration;
export const GentleEmbraceIllustration = CandleFlameIllustration;
export const ProfileWhisperIllustration = FoldedLetterIllustration;
export const LeaningShouldersIllustration = ConstellationIllustration;
export const HeartKeyholeIllustration = AntiqueKeyIllustration;
export const BotanicalBloomIllustration = HourglassIllustration;

export const NeedleMascot = CozyCoffeeCupsIllustration;
export const GhostMascot = CandleFlameIllustration;
export const PizzaMascot = FoldedLetterIllustration;
export const SkiMasksMascot = ConstellationIllustration;
export const BleichmonsterMascot = AntiqueKeyIllustration;
export const MittenMascot = CozyCoffeeCupsIllustration;
export const MatchstickMascot = MatchSparkIllustration;
export const TinCanTelephoneMascot = PaperAirplaneIllustration;
export const TeacupMascot = CozyCoffeeCupsIllustration;
export const PolaroidCameraMascot = PolaroidPhotoIllustration;
export const ClinkingGlassesMascot = ClinkingGlassesIllustration;
export const HeartPadlockMascot = AntiqueKeyIllustration;
export const HoodsMascot = ConstellationIllustration;
export const MeltingMascot = CandleFlameIllustration;
export const HandsMascot = CozyCoffeeCupsIllustration;
export const FlightMascot = PaperAirplaneIllustration;
export const CatPawMascot = PolaroidPhotoIllustration;
export const LoveLetterMascot = FoldedLetterIllustration;
export const HourglassMascot = HourglassIllustration;
export const CandleMascot = CandleFlameIllustration;

/**
 * Powder blue palette matching the photo reference (#A8CEEB),
 * with warm golden apricot for wildcards (#F5D0A8).
 */
export function getCardThemeColor(question) {
  if (!question) return '#A8CEEB';
  if (question.isWildcard || (question.id && question.id.startsWith('wildcard'))) {
    return '#F5D0A8'; // Soft Peach Gold for Wildcard
  }
  return '#A8CEEB'; // Signature Powder Blue
}

/**
 * Clean, punchy sticker label matching the reference card's white pill strip.
 */
export function getCardStickerLabel(question) {
  if (!question) return 'BETWEEN';
  if (question.isWildcard || question.id?.startsWith('wildcard')) {
    return '★ WILDCARD · ASK ANYTHING ★';
  }
  if (question.isMystery || question.category === 'MYSTERY') {
    return `SECRET · FROM ${question.author ? question.author.toUpperCase() : 'PARTNER'}`;
  }
  const cat = (question.category || '').toUpperCase();
  if (cat === 'US') return 'BETWEEN US';
  if (cat === 'CONFLICT') return 'RESOLUTION';
  return cat || 'CONNECTION';
}

/**
 * Intelligent selector pairing each question with an evocative,
 * beautifully drawn romantic object illustration.
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // 1. Wildcard & Spark questions
  if (id.includes('WILDCARD') || cat.includes('SPARK')) {
    return MatchSparkIllustration;
  }

  // 2. Midnight, deep intimacy, quiet questions
  if (id.includes('MIDNIGHT') || cat.includes('INTIM') || cat.includes('DEEP')) {
    return CandleFlameIllustration;
  }

  // 3. Morning talks, cozy habits, safety
  if (cat.includes('TEA') || cat.includes('COFFEE') || cat.includes('WARM') || cat.includes('HABIT') || cat.includes('DAILY')) {
    return CozyCoffeeCupsIllustration;
  }

  // 4. Celebration, chemistry, playfulness
  if (cat.includes('CHEM') || cat.includes('PLAY') || cat.includes('DATE') || cat.includes('CHEERS')) {
    return ClinkingGlassesIllustration;
  }

  // 5. Written words, letters, confessions
  if (cat.includes('LETTER') || cat.includes('WRITE') || cat.includes('CONFESS') || cat.includes('UNSPOKEN')) {
    return FoldedLetterIllustration;
  }

  // 6. Dreams, future, destiny, stars
  if (cat.includes('DREAM') || cat.includes('FUTURE') || cat.includes('STARRY') || cat.includes('GOAL')) {
    return ConstellationIllustration;
  }

  // 7. Music, rhythms, dancing, shared vibes
  if (cat.includes('MUSIC') || cat.includes('DANCE') || cat.includes('VIBE') || cat.includes('FUN')) {
    return VinylRecordIllustration;
  }

  // 8. Memories, nostalgia, moments, photos
  if (cat.includes('MEMOR') || cat.includes('PAST') || cat.includes('FIRST') || cat.includes('MOMENT')) {
    return PolaroidPhotoIllustration;
  }

  // 9. Distance, messages, sending love, flight
  if (cat.includes('DISTANCE') || cat.includes('THOUGHT') || cat.includes('TRAVEL') || cat.includes('MESSAGE')) {
    return PaperAirplaneIllustration;
  }

  // 10. Secrets, trust, emotional safety, unlocking
  if (cat.includes('SECRET') || cat.includes('TRUST') || cat.includes('VULNER') || cat.includes('TRUTH')) {
    return AntiqueKeyIllustration;
  }

  // 11. Night talks, pillow conversations, sleep
  if (cat.includes('NIGHT') || cat.includes('BED') || cat.includes('SLEEP') || cat.includes('MOON')) {
    return CrescentMoonIllustration;
  }

  // 12. Time, patience, presence, growth
  if (cat.includes('TIME') || cat.includes('GROW') || cat.includes('SLOW') || cat.includes('PRESENT')) {
    return HourglassIllustration;
  }

  // Deterministic fallback based on questionId so consecutive cards never repeat
  let hash = 0;
  const seed = (id || cat || 'BETWEEN');
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const safeHash = Math.abs(hash);
  return ROMANTIC_HERO_MASCOTS[safeHash % ROMANTIC_HERO_MASCOTS.length];
}

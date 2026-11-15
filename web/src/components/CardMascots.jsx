import React from 'react';

/**
 * ============================================================================
 * MINIMALIST ROMANTIC & CONNECTION LINE ART
 * Pure vector single-line illustrations symbolizing intimacy, vulnerability,
 * and connection in the refined style of modern indie card decks:
 * - Fluid, expressive continuous bezier contours (#1C1917, strokeWidth 2.4 - 2.8)
 * - Delicate romantic symbolism (intertwined hands, gentle embrace, whispers,
 *   cozy coffee mugs, starry constellations, heart keyhole, flame spark)
 * - Razor-sharp on all screens (zero raster compression artifacts)
 * ============================================================================
 */

// 1. Intertwined Hands (Connection, Touch, Holding Hands)
export function IntertwinedHandsIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      {/* Left arm & hand */}
      <path
        d="M14 62C22 62 28 58 36 50C40 46 44 44 50 48C54 50 56 55 52 58C48 61 42 59 38 64C34 68 28 72 16 72"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right arm & hand interlocking */}
      <path
        d="M86 62C78 62 72 58 64 50C60 46 56 44 50 48C46 50 44 55 48 58C52 61 58 59 62 64C66 68 72 72 84 72"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gentle touch accent arc */}
      <path
        d="M44 42C48 38 52 38 56 42"
        stroke="#1C1917"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Starburst of connection above touch point */}
      <path d="M50 22V32" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M45 27H55" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="50" cy="27" r="1.6" fill="#1C1917" />
    </svg>
  );
}

// 2. Gentle Embrace (Intimacy, Deep Hug, Safe Harbor)
export function GentleEmbraceIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-breathe ${className}`}>
      {/* Left head resting on shoulder */}
      <path
        d="M44 32C44 24 38 20 32 24C26 28 26 38 32 44C36 48 42 50 42 58C42 66 38 78 30 84"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right head leaning in */}
      <path
        d="M44 32C48 24 56 22 62 26C68 30 68 40 62 46C56 52 52 56 52 64C52 72 58 80 66 84"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arm wrapping in tender embrace */}
      <path
        d="M28 54C34 50 48 48 58 56C66 62 70 72 64 78"
        stroke="#1C1917"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heart warmth mark in between */}
      <path
        d="M50 40C48 37 45 38 46 41C47 44 50 47 50 47C50 47 53 44 54 41C55 38 52 37 50 40Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 3. Profile Whispers (Secrets, Vulnerability, Unspoken Words)
export function ProfileWhisperIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-sway ${className}`}>
      {/* Left Face Profile (whispering) */}
      <path
        d="M28 20C34 20 38 24 38 30C38 34 36 36 38 38C40 40 44 41 44 44C44 46 41 47 40 49C42 51 43 53 40 55C37 57 32 58 32 64C32 70 30 78 26 82"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Face Profile (listening, facing left) */}
      <path
        d="M72 20C66 20 62 24 62 30C62 34 64 36 62 38C60 40 56 41 56 44C56 46 59 47 60 49C58 51 57 53 60 55C63 57 68 58 68 64C68 70 70 78 74 82"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gentle whisper waves */}
      <path d="M48 42C50 43 50 45 48 46" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M51 39C54 41 54 47 51 49" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      {/* Star twinkle above heads */}
      <path d="M50 18L51.5 22L55.5 23L51.5 24L50 28L48.5 24L44.5 23L48.5 22Z" fill="#1C1917" />
    </svg>
  );
}

// 4. Leaning Shoulders (Companionship, Trust, Under the Night Sky)
export function LeaningShouldersIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-breathe ${className}`}>
      {/* Ground horizon */}
      <path d="M16 84C38 80 62 80 84 84" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      {/* Left person silhouette back */}
      <path
        d="M36 46C36 38 40 34 46 36C48 37 49 42 46 48"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26 82C26 66 32 54 46 52C50 51 52 54 52 64C52 74 50 82 50 82"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person silhouette back leaning in */}
      <path
        d="M54 46C54 38 52 34 46 36"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M74 82C74 66 68 54 54 52"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Night sky constellation stars */}
      <circle cx="28" cy="26" r="1.6" fill="#1C1917" />
      <circle cx="72" cy="24" r="1.8" fill="#1C1917" />
      <path d="M50 14L51.5 18L55.5 19L51.5 20L50 24L48.5 20L44.5 19L48.5 18Z" fill="#1C1917" />
    </svg>
  );
}

// 5. Cozy Coffee Cups (Conversations, Morning Talks, Safe Warmth)
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

// 6. Clinking Coupe Glasses (Chemistry, Celebration, Date Night)
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

// 7. Heart Keyhole & Skeleton Key (Trust, Vulnerability, Unlocking)
export function HeartKeyholeIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-sway ${className}`}>
      {/* Continuous single-line elegant heart */}
      <path
        d="M50 82C40 74 20 58 20 40C20 28 28 20 38 20C44 20 48 24 50 28C52 24 56 20 62 20C72 20 80 28 80 40C80 58 60 74 50 82Z"
        stroke="#1C1917"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Delicate Antique Skeleton Key turning inside */}
      <circle cx="50" cy="40" r="6" stroke="#1C1917" strokeWidth="2.3" />
      <line x1="50" y1="46" x2="50" y2="64" stroke="#1C1917" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M50 56H56" stroke="#1C1917" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M50 62H55" stroke="#1C1917" strokeWidth="2.3" strokeLinecap="round" />
      {/* Twinkle dots */}
      <circle cx="34" cy="32" r="1.6" fill="#1C1917" />
      <circle cx="66" cy="32" r="1.6" fill="#1C1917" />
    </svg>
  );
}

// 8. Constellation (Destiny, Dreams, Future Together)
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

// 9. Folded Letter (Unspoken Thoughts, Confessions, Words)
export function FoldedLetterIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-float ${className}`}>
      {/* Minimalist envelope body */}
      <rect x="22" y="32" width="56" height="38" rx="4" stroke="#1C1917" strokeWidth="2.6" />
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

// 10. Candle Flame (Midnight Whispers, Stillness, Warmth)
export function CandleFlameIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Base holder line */}
      <path d="M30 84C42 86 58 86 70 84" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Slender candle body */}
      <rect x="44" y="44" width="12" height="40" rx="3" stroke="#1C1917" strokeWidth="2.6" />
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

// 11. Botanical Bloom (Growing Together, Roots, Tenderness)
export function BotanicalBloomIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-breathe ${className}`}>
      {/* Left curving stem with delicate leaves */}
      <path
        d="M48 84C48 70 42 56 36 44C32 36 32 28 36 22"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M38 52C30 50 26 44 28 38C34 38 37 44 38 52Z" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M36 34C28 30 28 24 32 20C36 22 37 28 36 34Z" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      
      {/* Right curving stem intertwining */}
      <path
        d="M52 84C52 70 58 56 64 44C68 36 68 28 64 22"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M62 52C70 50 74 44 72 38C66 38 63 44 62 52Z" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M64 34C72 30 72 24 68 20C64 22 63 28 64 34Z" stroke="#1C1917" strokeWidth="2.2" strokeLinejoin="round" />
      
      {/* Blooming blossom meeting in center */}
      <path
        d="M50 24C46 16 54 12 50 8C46 12 54 16 50 24Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 12. Match Spark (Wildcard / The First Spark / Chemistry)
export function MatchSparkIllustration({ size = 116, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      {/* Slender wooden matchstick tilted */}
      <g transform="rotate(22 50 64)">
        <rect x="46" y="44" width="8" height="42" rx="2" stroke="#1C1917" strokeWidth="2.5" />
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

// Aliases for backwards compatibility with previous imports
export const NeedleMascot = IntertwinedHandsIllustration;
export const GhostMascot = GentleEmbraceIllustration;
export const PizzaMascot = ProfileWhisperIllustration;
export const SkiMasksMascot = LeaningShouldersIllustration;
export const BleichmonsterMascot = HeartKeyholeIllustration;
export const MittenMascot = CozyCoffeeCupsIllustration;
export const MatchstickMascot = MatchSparkIllustration;
export const TinCanTelephoneMascot = ProfileWhisperIllustration;
export const TeacupMascot = CozyCoffeeCupsIllustration;
export const PolaroidCameraMascot = FoldedLetterIllustration;
export const ClinkingGlassesMascot = ClinkingGlassesIllustration;
export const HeartPadlockMascot = HeartKeyholeIllustration;
export const HoodsMascot = LeaningShouldersIllustration;
export const MeltingMascot = ProfileWhisperIllustration;
export const HandsMascot = IntertwinedHandsIllustration;
export const FlightMascot = ConstellationIllustration;
export const CatPawMascot = IntertwinedHandsIllustration;
export const LoveLetterMascot = FoldedLetterIllustration;
export const HourglassMascot = CandleFlameIllustration;
export const CandleMascot = CandleFlameIllustration;

/**
 * The 12 Romantic & Connection Line Art Masterpieces
 */
export const ROMANTIC_HERO_MASCOTS = [
  IntertwinedHandsIllustration, // 0: Touch & Connection
  GentleEmbraceIllustration,    // 1: Intimacy & Closeness
  ProfileWhisperIllustration,   // 2: Vulnerability & Secrets
  LeaningShouldersIllustration, // 3: Companionship & Night Sky
  CozyCoffeeCupsIllustration,   // 4: Warmup & Morning Conversations
  ClinkingGlassesIllustration,  // 5: Chemistry & Date Night
  HeartKeyholeIllustration,     // 6: Trust & Unlocking Heart
  ConstellationIllustration,    // 7: Destiny & Dreams
  FoldedLetterIllustration,     // 8: Words & Confessions
  CandleFlameIllustration,      // 9: Midnight Whispers
  BotanicalBloomIllustration,   // 10: Growth & Tenderness
  MatchSparkIllustration        // 11: Wildcard / The Spark
];

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
 * Intelligent selector pairing each question with an emotionally resonant,
 * minimalist romantic line art drawing.
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // Special cases
  if (id.includes('WILDCARD')) return MatchSparkIllustration;
  if (id.includes('MIDNIGHT')) return CandleFlameIllustration;

  // Thematic Affinity Mappings
  if (cat.includes('TEA') || cat.includes('CONVERS') || cat.includes('WARM') || cat.includes('HABIT')) {
    return CozyCoffeeCupsIllustration;
  }
  if (cat.includes('SPARK') || cat.includes('CHEM') || cat.includes('PLAY')) {
    return ClinkingGlassesIllustration;
  }
  if (cat.includes('TOUCH') || cat.includes('HOLD') || cat.includes('US') || cat.includes('CONNECT')) {
    return IntertwinedHandsIllustration;
  }
  if (cat.includes('INTIM') || cat.includes('EMBRACE') || cat.includes('CLOSENESS')) {
    return GentleEmbraceIllustration;
  }
  if (cat.includes('SECRET') || cat.includes('VULNER') || cat.includes('FEAR') || cat.includes('UNSPOKEN')) {
    return ProfileWhisperIllustration;
  }
  if (cat.includes('TRUST') || cat.includes('LOCK') || cat.includes('KEY') || cat.includes('TRUTH')) {
    return HeartKeyholeIllustration;
  }
  if (cat.includes('DREAM') || cat.includes('FUTURE') || cat.includes('STARRY') || cat.includes('GOAL')) {
    return ConstellationIllustration;
  }
  if (cat.includes('LETTER') || cat.includes('WRITE') || cat.includes('WORD') || cat.includes('MEMOR')) {
    return FoldedLetterIllustration;
  }
  if (cat.includes('GROW') || cat.includes('ROOT') || cat.includes('ORIGIN') || cat.includes('VALUE')) {
    return BotanicalBloomIllustration;
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

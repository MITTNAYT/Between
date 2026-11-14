import React from 'react';

/**
 * Handcrafted black & white ink mascots faithfully complementing
 * indie card game aesthetics (stark organic ink strokes, bold silhouettes, comic linework).
 * Directly matches the reference cards:
 * - Downcycling: Cute sheet ghost with solid cast shadow
 * - Speckgürtel: Melting pizza slice with dripping cheese & eyes
 * - Nähcafe: Needle creature with thread arms & eyes
 * - Upcycling: Twin ski mask balaclavas (one solid black, one striped)
 * - Bleichmonster: White creature rising from ink puddle
 * - Mottenfresser: Black mitten creature with moth stars
 * Plus Candle, Mirror, and Spark mascots.
 */

// 1. Ghost Mascot ("Downcycling" - Vulnerability, Fears, Inner World)
export function GhostMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Ground Cast Shadow on right floor */}
      <path
        d="M48 84C62 84 82 81 86 74C82 70 72 71 58 73C50 74 46 80 48 84Z"
        fill="#1C1917"
        opacity="0.85"
      />
      {/* Ghost Body Outer Silhouette / Ink Shadow */}
      <path
        d="M48 14C34 14 26 26 26 42C26 58 24 70 19 76C26 77 33 71 39 74C45 77 50 82 56 80C62 78 66 73 73 76C79 79 81 72 82 66C83 52 82 36 76 26C69 17 59 14 48 14Z"
        fill="#1C1917"
      />
      {/* Ghost Main Body (Crisp White with Heavy Ink Stroke) */}
      <path
        d="M47 16C36 16 29 27 29 42C29 56 27 67 22 72C29 72 35 67 41 70C47 73 51 77 57 75C63 73 67 68 73 71C78 73 79 66 80 61C81 48 80 35 74 26C68 18 58 16 47 16Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Vertical Hollow Oval Eyes */}
      <ellipse cx="43" cy="35" rx="3.6" ry="6.2" fill="#1C1917" />
      <ellipse cx="57" cy="36" rx="3.6" ry="6.2" fill="#1C1917" />
      {/* Comic Accent Marks */}
      <path d="M20 28C17 30 17 34 17 34" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M78 24C81 26 81 30 81 30" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Pizza / Melting Slice Mascot ("Speckgürtel" - Playful, Food, Habits, Quirks)
export function PizzaMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-melting ${className}`}>
      {/* Solid Black Silhouette Behind */}
      <path
        d="M32 20C46 16 72 24 82 32C78 50 68 70 54 84C48 82 46 76 44 76C42 76 40 82 36 82C32 80 34 72 32 72C28 72 26 78 24 76C20 62 24 40 32 20Z"
        fill="#1C1917"
      />
      {/* White Pizza Slice Surface with Ink Border */}
      <path
        d="M34 22C46 18 70 26 79 33C75 49 66 67 52 80C47 79 45 74 43 74C41 74 39 79 35 79C32 78 33 71 31 71C28 71 26 76 25 74C22 62 25 42 34 22Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Wavy Crust Line */}
      <path
        d="M34 22C46 18 70 26 79 33"
        stroke="#1C1917"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* 4 Bold Black Cutouts / Pepperoni Eyes */}
      <circle cx="44" cy="38" r="4.5" fill="#1C1917" />
      <circle cx="58" cy="42" r="4.8" fill="#1C1917" />
      <circle cx="48" cy="54" r="5.2" fill="#1C1917" />
      <circle cx="62" cy="58" r="4.6" fill="#1C1917" />
      {/* Dripping Cheese Drops */}
      <circle cx="44" cy="79" r="2.2" fill="#1C1917" />
      <circle cx="34" cy="76" r="2" fill="#1C1917" />
    </svg>
  );
}

// 3. Needle & Thread Creature ("Nähcafe" - Origins, Deep Roots, Crafting, Memory)
export function NeedleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-needle ${className}`}>
      {/* Subtle floor shadow */}
      <ellipse cx="50" cy="88" rx="18" ry="4" fill="#1C1917" opacity="0.2" />
      {/* Expressive Wavy Thread Arms */}
      <path
        d="M47 38C28 32 16 42 22 52C28 62 14 68 18 78"
        stroke="#1C1917"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M53 38C72 32 84 42 78 52C72 62 86 68 82 78"
        stroke="#1C1917"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Needle Body (Tapering Down to Sharp Tip) */}
      <path
        d="M47 16C47 13 53 13 53 16L55 60C55 74 50 86 50 86C50 86 45 74 45 60L47 16Z"
        fill="#1C1917"
      />
      {/* Eye of the Needle */}
      <ellipse cx="50" cy="22" rx="1.8" ry="4.5" fill="#FFFFFF" />
      {/* Two Dot Eyes on the Needle Body */}
      <circle cx="48" cy="38" r="1.8" fill="#FFFFFF" />
      <circle cx="52" cy="38" r="1.8" fill="#FFFFFF" />
      {/* Expressive Quotation/Tick Marks above Head */}
      <path d="M40 20C38 22 38 25 38 25" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M60 20C62 22 62 25 62 25" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 4. Twin Ski Masks ("Upcycling" - Whispers, Unspoken, Intimacy, Alter Egos)
export function SkiMasksMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hoods ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="34" ry="4.5" fill="#1C1917" opacity="0.2" />
      
      {/* Left Mask: Solid Black Balaclava */}
      <path
        d="M26 84C24 66 26 40 37 32C46 25 53 33 51 46C49 59 47 72 50 84C40 85 31 85 26 84Z"
        fill="#1C1917"
      />
      {/* Eye Cutouts */}
      <ellipse cx="37" cy="46" rx="2.8" ry="4.5" fill="#FFFFFF" />
      <ellipse cx="45" cy="47" rx="2.8" ry="4.5" fill="#FFFFFF" />
      {/* Mouth Cutout */}
      <ellipse cx="41" cy="62" rx="3.5" ry="2" fill="#FFFFFF" />

      {/* Right Mask: White Knit with Bold Vertical Black Stripes */}
      <path
        d="M55 84C53 66 57 40 67 33C76 27 84 35 81 48C79 61 77 74 80 84C72 85 62 85 55 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Vertical Knit Stripes */}
      <path d="M60 44L59 81" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M65 39L64 81" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M71 39L70 81" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M76 46L75 81" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Black Eye Cutouts */}
      <ellipse cx="65" cy="48" rx="2.8" ry="4.5" fill="#1C1917" />
      <ellipse cx="73" cy="49" rx="2.8" ry="4.5" fill="#1C1917" />
      {/* Black Mouth Cutout */}
      <ellipse cx="69" cy="63" rx="3.2" ry="1.8" fill="#1C1917" />
    </svg>
  );
}

// 5. Bleichmonster Mascot ("Bleichmonster" - Secrets, Emergence, Raw Truths)
export function BleichmonsterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Organic Black Ink Puddle */}
      <path
        d="M18 78C26 73 38 75 50 74C64 73 82 72 86 78C90 84 76 89 60 88C44 87 24 88 18 84C14 80 14 79 18 78Z"
        fill="#1C1917"
      />
      {/* White Creature Head Rising from Puddle */}
      <path
        d="M48 38C38 38 34 48 34 62C34 70 32 76 36 78C44 79 56 79 64 78C68 76 66 70 66 62C66 48 60 38 48 38Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Curious Dot Eyes */}
      <circle cx="44" cy="54" r="2.8" fill="#1C1917" />
      <circle cx="56" cy="54" r="2.8" fill="#1C1917" />
    </svg>
  );
}

// 6. Mitten Monster ("Mottenfresser" - Habits, Comfort, Shared Home, Closeness)
export function MittenMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.2" />
      {/* Black Mitten Body with Thumb on Left */}
      <path
        d="M34 50C28 48 24 54 26 60C28 66 34 68 36 64C36 58 35 74 36 80L66 80C68 74 68 56 68 46C68 32 60 26 50 26C40 26 36 36 36 50Z"
        fill="#1C1917"
      />
      {/* Jagged White Cuff at Bottom */}
      <path
        d="M36 80L40 76L44 80L48 76L52 80L56 76L60 80L64 76L66 80V83H36V80Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="2"
      />
      {/* Fluttering Moth Accents */}
      <path d="M22 36L25 39L22 42L19 39Z" fill="#1C1917" />
      <path d="M28 26L31 28L28 30L25 28Z" fill="#1C1917" />
      <path d="M72 32L75 35L72 38L69 35Z" fill="#1C1917" />
      <path d="M78 44L81 46L78 48L75 46Z" fill="#1C1917" />
    </svg>
  );
}

// 7. Star Spark Mascot (Dreams, Future, Ambition, Sparkles)
export function SparkMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#1C1917" opacity="0.18" />
      <path
        d="M50 15C52 32 64 45 82 48C64 52 52 64 50 82C48 64 36 52 18 48C36 45 48 32 50 15Z"
        fill="#1C1917"
      />
      <path
        d="M50 20C52 34 62 45 76 48C62 51 52 62 50 76C48 62 38 51 24 48C38 45 48 34 50 20Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <ellipse cx="45" cy="47" rx="2.5" ry="3.8" fill="#1C1917" />
      <path d="M53 46C56 49 59 47 60 45" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2" fill="#1C1917" />
      <circle cx="72" cy="30" r="2.5" fill="#1C1917" />
    </svg>
  );
}

// 8. Midnight Candle Mascot (Midnight Whispers, Bedtime Vulnerabilities)
export function CandleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4.5" fill="#1C1917" opacity="0.18" />
      <path
        d="M50 16C50 16 58 28 58 36C58 42 54 46 50 46C46 46 42 42 42 36C42 28 50 16 50 16Z"
        fill="#1C1917"
      />
      <circle cx="50" cy="38" r="3" fill="#FFFFFF" />
      <path
        d="M38 50C38 48 62 48 62 50L64 82C64 84 36 84 36 82L38 50Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M43 51C43 58 47 58 47 51" fill="#1C1917" />
      <path d="M44 66C46 68 48 68 50 66" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 66C56 68 58 68 60 66" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 9. Mirrored Faces Mascot (Identity, Self-Worth, Truth)
export function MirrorMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-mirror ${className}`}>
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.18" />
      <path
        d="M26 80C26 68 28 58 34 50C37 46 38 42 36 38C34 34 36 26 44 24C44 32 41 38 44 44C47 50 43 58 41 68L42 80H26Z"
        fill="#1C1917"
      />
      <path
        d="M74 80C74 68 72 58 66 50C63 46 62 42 64 38C66 34 64 26 56 24C56 32 59 38 56 44C53 50 57 58 59 68L58 80H74Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="34" r="2" fill="#FFFFFF" />
      <circle cx="63" cy="34" r="2" fill="#1C1917" />
    </svg>
  );
}

// Aliases for backwards compatibility
export const HoodsMascot = SkiMasksMascot;
export const MeltingMascot = PizzaMascot;
export const HandsMascot = MittenMascot;
export const FlightMascot = NeedleMascot;

/**
 * Cohesive powder blue palette matching the photo reference (#A8CEEB),
 * with subtle golden warmth for wildcards.
 */
export function getCardThemeColor(question) {
  if (!question) return '#A8CEEB'; // Iconic Powder Blue from photo
  if (question.isWildcard || (question.id && question.id.startsWith('wildcard'))) {
    return '#F5D0A8'; // Soft Peach Gold for Wildcard
  }
  return '#A8CEEB'; // Signature Powder Blue
}

/**
 * Intelligent mascot selector matching question category & depth
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  if (id.includes('WILDCARD')) return PizzaMascot;
  if (id.includes('MIDNIGHT')) return CandleMascot;

  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT')) return GhostMascot;
  if (cat.includes('INTIM') || cat.includes('TALK') || cat.includes('UNSPOKEN')) return SkiMasksMascot;
  if (cat.includes('MEMOR') || cat.includes('ORIGIN') || cat.includes('ROOTS')) return NeedleMascot;
  if (cat.includes('PLAY') || cat.includes('HABIT') || cat.includes('QUIRK')) return PizzaMascot;
  if (cat.includes('SECRET') || cat.includes('MYSTERY') || depth >= 5) return BleichmonsterMascot;
  if (cat.includes('COMFORT') || cat.includes('HOME') || cat.includes('US')) return MittenMascot;
  if (cat.includes('DREAM') || cat.includes('FUTURE')) return SparkMascot;
  if (cat.includes('IDENT') || cat.includes('TRUTH')) return MirrorMascot;

  // Depth-based fallbacks
  if (depth === 5) return BleichmonsterMascot;
  if (depth === 4) return GhostMascot;
  if (depth === 3) return SkiMasksMascot;
  if (depth === 2) return NeedleMascot;
  return PizzaMascot;
}

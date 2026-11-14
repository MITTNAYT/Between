import React from 'react';

/**
 * Handcrafted minimalist black & white ink mascots inspired by indie card games.
 * Bold organic strokes, comic linework, playful expressions.
 */

// 1. Playful Ghost Mascot (Vulnerability, Fears, Unspoken)
export function GhostMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="88" rx="28" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Ghost Body Outer Silhouette with Shadow Offset */}
      <path
        d="M49 14C34 14 26 26 26 42C26 58 24 72 18 78C26 79 33 71 39 74C45 77 50 82 56 80C62 78 66 73 73 76C79 79 81 72 82 66C83 52 82 36 76 26C69 17 59 14 49 14Z"
        fill="#1C1917"
      />
      {/* Ghost Main Body (Crisp Cream/White with Thick Outline) */}
      <path
        d="M48 16C36 16 29 27 29 42C29 57 27 69 22 74C29 74 35 68 41 71C47 74 51 78 57 76C63 74 67 69 73 72C78 74 79 67 80 62C81 49 80 35 74 26C68 18 58 16 48 16Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Ghost Eyes */}
      <ellipse cx="44" cy="36" rx="3.5" ry="5.5" fill="#1C1917" />
      <ellipse cx="58" cy="37" rx="3.5" ry="5.5" fill="#1C1917" />
      {/* Playful Floating Blush / Little Cheeks */}
      <circle cx="39" cy="44" r="2" fill="#1C1917" opacity="0.25" />
      <circle cx="63" cy="45" r="2" fill="#1C1917" opacity="0.25" />
      {/* Little floating sweat/spark lines */}
      <path d="M21 28C18 30 18 34 18 34" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 24C81 26 81 30 81 30" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 2. Whispering Hooded Figures (Intimacy, Deep Talk, Midnight)
export function HoodsMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hoods ${className}`}>
      <ellipse cx="50" cy="88" rx="32" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Left Figure */}
      <path
        d="M26 82C24 64 26 40 37 32C46 25 53 33 51 46C49 59 47 72 50 82C40 83 31 83 26 82Z"
        fill="#1C1917"
      />
      <ellipse cx="37" cy="44" rx="2.5" ry="4" fill="#FFFFFF" />
      <ellipse cx="45" cy="45" rx="2.5" ry="4" fill="#FFFFFF" />
      {/* Right Figure (Striped / Textured) */}
      <path
        d="M55 82C53 66 57 42 67 36C76 30 83 38 80 50C78 62 76 74 78 82C71 83 62 83 55 82Z"
        fill="#1C1917"
      />
      {/* Vertical Stripes on right figure */}
      <path d="M60 48L59 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M65 42L64 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M71 42L70 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M76 48L75 78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="65" cy="46" rx="2.5" ry="4" fill="#FFFFFF" />
      <ellipse cx="73" cy="47" rx="2.5" ry="4" fill="#FFFFFF" />
    </svg>
  );
}

// 3. Thread & Needle Creature (Origins, Memories, Childhood, Ties)
export function NeedleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-needle ${className}`}>
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Whimsical Thread Arms */}
      <path d="M47 38C30 32 18 42 22 52C26 62 14 68 18 78" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M53 38C70 32 82 42 78 52C74 62 86 68 82 78" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Needle Body */}
      <path
        d="M47 18C47 15 53 15 53 18L55 58C55 72 50 84 50 84C50 84 45 72 45 58L47 18Z"
        fill="#1C1917"
      />
      {/* Eye of Needle */}
      <ellipse cx="50" cy="24" rx="1.8" ry="4.5" fill="#FFFFFF" />
      {/* Curious Eyes on Needle Body */}
      <circle cx="48" cy="40" r="1.8" fill="#FFFFFF" />
      <circle cx="52" cy="40" r="1.8" fill="#FFFFFF" />
      {/* Expression accent marks */}
      <path d="M40 22C38 24 38 27 38 27" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 22C62 24 62 27 62 27" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 4. Melting Character / Dripping Slice (Playful, Icebreakers, Secrets)
export function MeltingMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-melting ${className}`}>
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Melting Slice Body */}
      <path
        d="M28 26C38 20 62 20 72 26L78 34C74 52 76 68 80 82C74 81 72 74 68 76C64 78 62 84 58 82C54 80 52 74 48 76C44 78 40 84 36 82C32 80 32 74 28 76C24 78 22 83 18 80C22 66 22 50 24 34L28 26Z"
        fill="#1C1917"
      />
      <path
        d="M30 28C40 23 60 23 70 28L75 35C72 49 73 63 76 76C71 75 70 70 66 72C62 74 61 79 57 77C53 75 51 70 48 72C44 74 41 79 38 77C34 75 34 70 30 72C27 73 25 78 22 75C25 63 25 49 26 35L30 28Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Melting Droop Eyes & Smile */}
      <ellipse cx="44" cy="44" rx="4.5" ry="6" fill="#1C1917" />
      <ellipse cx="58" cy="46" rx="4.5" ry="6" fill="#1C1917" />
      <path d="M48 58C51 61 54 61 57 58" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
      {/* Dripping Dots */}
      <circle cx="58" cy="72" r="2.5" fill="#1C1917" />
      <circle cx="42" cy="70" r="2" fill="#1C1917" />
    </svg>
  );
}

// 5. Star Spark Mascot (Dreams, Future, Ambition, Sparkles)
export function SparkMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Four-Pointed Star Character Body */}
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
      {/* Playful Blink Eye & Wink Eye */}
      <ellipse cx="45" cy="47" rx="2.5" ry="3.8" fill="#1C1917" />
      <path d="M53 46C56 49 59 47 60 45" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
      {/* Little Star Halo / Sparkles */}
      <circle cx="28" cy="28" r="2" fill="#1C1917" />
      <circle cx="72" cy="30" r="2.5" fill="#1C1917" />
      <circle cx="74" cy="68" r="2" fill="#1C1917" />
    </svg>
  );
}

// 6. Warm Hands / Embracing Mitten Mascot (Us, Closeness, Support)
export function HandsMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Two Hands Interlocked / Mittens */}
      <path
        d="M34 82C31 66 31 46 42 36C49 29 57 32 58 44C60 32 68 29 75 36C86 46 86 66 83 82C73 83 62 83 58 78C55 83 44 83 34 82Z"
        fill="#1C1917"
      />
      {/* Left Hand Inner Face */}
      <path
        d="M36 80C34 66 34 49 43 40C48 35 54 37 55 47C53 58 52 70 55 76C48 78 41 78 36 80Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Heart between thumbs */}
      <path
        d="M58 48C56 44 51 46 51 49C51 54 58 58 58 58C58 58 65 54 65 49C65 46 60 44 58 48Z"
        fill="#1C1917"
      />
      <circle cx="44" cy="49" r="2" fill="#1C1917" />
      <circle cx="72" cy="49" r="2" fill="#FFFFFF" />
    </svg>
  );
}

// 7. Long Distance Birds / Flight Mascot (Long Distance, Airports, Bridges)
export function FlightMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      <ellipse cx="50" cy="88" rx="28" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Two Origami / Folk Birds Flying Toward Each Other */}
      <path
        d="M20 48C30 38 42 42 48 52C40 56 32 60 24 58L20 48Z"
        fill="#1C1917"
      />
      <circle cx="28" cy="48" r="1.8" fill="#FFFFFF" />
      <path
        d="M80 48C70 38 58 42 52 52C60 56 68 60 76 58L80 48Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="72" cy="48" r="1.8" fill="#1C1917" />
      {/* Dotted Flight Path connecting them */}
      <path
        d="M32 54C42 66 58 66 68 54"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeDasharray="3 3"
        fill="none"
      />
      {/* Tiny Heart in Middle */}
      <path
        d="M50 63C48 60 44 61 44 63C44 67 50 70 50 70C50 70 56 67 56 63C56 61 52 60 50 63Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 8. Midnight Candle Mascot (Midnight Whispers, Bedtime Vulnerabilities)
export function CandleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Flame */}
      <path
        d="M50 16C50 16 58 28 58 36C58 42 54 46 50 46C46 46 42 42 42 36C42 28 50 16 50 16Z"
        fill="#1C1917"
      />
      <circle cx="50" cy="38" r="3" fill="#FFFFFF" />
      {/* Candle Body with Gentle Wax Drip */}
      <path
        d="M38 50C38 48 62 48 62 50L64 82C64 84 36 84 36 82L38 50Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Drip Details */}
      <path d="M43 51C43 58 47 58 47 51" fill="#1C1917" />
      {/* Sleepy Eyes on Candle */}
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
      {/* Two Profile Silhouettes Facing Each Other */}
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

/**
 * Intelligent theme color selector matching the pastel aesthetic from reference cards
 */
export function getCardThemeColor(question) {
  if (!question) return '#A8CEEB'; // Powder Blue (from photo)
  const cat = (question.category || '').toUpperCase();
  const id = (question.id || '').toUpperCase();
  const depth = question.depth || 1;
  const pack = question.deckPack || '';

  if (pack === 'MIDNIGHT' || id.includes('MIDNIGHT')) return '#C8BEE8'; // Soft Lavender
  if (pack === 'PLAY_SPARKS') return cat.includes('PLAY') ? '#F5E1A4' : '#B6DDD0'; // Butter Cream / Mint Sage
  if (pack === 'DEEP_INTIMACY') return '#F4BEB0'; // Pale Coral
  if (pack === 'RAW_WILDCARD' || id.includes('WILDCARD')) return '#F5D0A8'; // Soft Peach Gold

  if (id.includes('LONG_DISTANCE')) return '#9BC4E2'; // Light Sky Blue

  if (cat.includes('MEMOR') || cat.includes('ORIGIN')) return '#B6DDD0'; // Mint Sage
  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT') || depth >= 4) return '#F4BEB0'; // Pale Coral
  if (cat.includes('INTIM') || cat.includes('CONNECT')) return '#C8BEE8'; // Lavender
  if (cat.includes('DREAM') || cat.includes('FUTURE') || cat.includes('VALUE')) return '#A8CEEB'; // Powder Blue
  if (cat.includes('PLAY') || cat.includes('HABIT')) return '#F5E1A4'; // Butter Cream

  return '#A8CEEB'; // Powder Blue default
}

/**
 * Intelligent mascot selector matching question category & depth
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  if (id.includes('MIDNIGHT')) return CandleMascot;
  if (id.includes('LONG_DISTANCE')) return FlightMascot;
  if (id.includes('WILDCARD')) return MeltingMascot;

  if (cat.includes('MEMOR') || cat.includes('ORIGIN')) return NeedleMascot;
  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT')) return GhostMascot;
  if (cat.includes('INTIM') || cat.includes('CONNECT')) return HoodsMascot;
  if (cat.includes('US') || cat.includes('GRATITUDE')) return HandsMascot;
  if (cat.includes('DREAM') || cat.includes('FUTURE') || cat.includes('VALUE')) return SparkMascot;
  if (cat.includes('PLAY') || cat.includes('HABIT')) return MeltingMascot;
  if (cat.includes('IDENT')) return MirrorMascot;

  // Fallback by depth
  if (depth >= 4) return GhostMascot;
  if (depth === 3) return HoodsMascot;
  if (depth === 2) return NeedleMascot;
  return SparkMascot;
}

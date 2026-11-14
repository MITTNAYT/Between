import React from 'react';

/**
 * ============================================================================
 * BESPOKE TABLETOP INK MASCOTS & CHARACTERS
 * Faithfully crafted in the authentic aesthetic of the German tabletop card game:
 * - Bold, chunky 3.6px - 4px black ink outlines (#1C1917)
 * - Deep solid black shadow cavities & comic linework
 * - Crisp white negative space (#FFFFFF) & floor cast shadows
 * - Playful, inanimate-objects-with-personality mascot universe
 * ============================================================================
 */

// 1. Ghost Mascot ("Downcycling" - Exact match to German tabletop reference)
export function GhostMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="52" cy="88" rx="26" ry="4" fill="#1C1917" opacity="0.16" />

      {/* Solid Black Shadow Layer under folds & right flank */}
      <path
        d="M52 14C38 14 28 24 28 40C28 47 24 53 18 57C26 60 32 55 36 60C40 66 42 78 46 80C50 82 54 75 58 79C64 83 70 82 74 76C78 70 82 58 82 44C82 28 70 14 52 14Z"
        fill="#1C1917"
      />

      {/* White Sheet Body with Heavy Black Outline */}
      <path
        d="M50 14C36 14 28 24 28 40C28 47 24 53 18 57C26 60 32 54 36 58C40 62 41 73 45 75C49 77 53 71 57 74C61 77 66 74 70 69C74 63 76 54 76 42C76 28 66 14 50 14Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Internal Fold Shadow Cavity (Distinctive photo feature) */}
      <path
        d="M62 48C68 52 74 58 72 68C68 64 64 62 60 62L62 48Z"
        fill="#1C1917"
      />

      {/* Vertical Oval Black Eyes */}
      <ellipse cx="42" cy="34" rx="3.6" ry="6.2" fill="#1C1917" />
      <ellipse cx="56" cy="35" rx="3.6" ry="6.2" fill="#1C1917" />

      {/* Comic Accent Marks */}
      <path d="M18 26C15 28 15 32 15 32" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M80 22C83 24 83 28 83 28" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Melting Pizza Slice ("Speckgürtel" - Exact match to reference photo)
export function PizzaMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-melting ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="89" rx="20" ry="3.5" fill="#1C1917" opacity="0.16" />

      {/* Solid Black Shadow Layer */}
      <path
        d="M32 18C46 14 74 22 84 32C79 50 70 70 56 84C49 82 47 75 44 75C42 75 40 82 35 82C31 79 33 71 31 71C27 71 25 77 23 75C19 60 23 38 32 18Z"
        fill="#1C1917"
      />

      {/* White Pizza Slice with Thick Ink Outline */}
      <path
        d="M34 20C47 16 72 24 82 33C77 49 68 67 54 80C49 78 47 72 44 72C42 72 40 78 36 78C32 76 34 68 32 68C28 68 26 73 25 72C21 59 24 38 34 20Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />

      {/* Wavy Black Crust Bar on Top */}
      <path
        d="M32 20C46 15 72 23 83 34"
        stroke="#1C1917"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 4 Chunky Black Irregular Cutouts / Pepperoni Eyes */}
      <ellipse cx="45" cy="38" rx="4.8" ry="4.2" fill="#1C1917" transform="rotate(-8 45 38)" />
      <ellipse cx="60" cy="42" rx="5.2" ry="4.4" fill="#1C1917" transform="rotate(12 60 42)" />
      <ellipse cx="48" cy="54" rx="5.5" ry="4.8" fill="#1C1917" transform="rotate(-5 48 54)" />
      <ellipse cx="63" cy="58" rx="5" ry="4.2" fill="#1C1917" transform="rotate(15 63 58)" />

      {/* Dripping Cheese Droplets */}
      <ellipse cx="44" cy="80" rx="2.5" ry="3.2" fill="#1C1917" />
      <ellipse cx="34" cy="78" rx="2.2" ry="2.6" fill="#1C1917" />
    </svg>
  );
}

// 3. Sewing Needle & Thread ("Nähcafe" - Exact match to reference photo)
export function NeedleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-needle ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="89" rx="14" ry="3.5" fill="#1C1917" opacity="0.18" />

      {/* Wavy Thread Arms passing through the eye */}
      <path
        d="M48 30C36 28 22 34 18 42C14 50 12 58 14 62"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 30C64 28 78 34 82 42C86 50 88 56 86 60"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Solid Black Needle Shaft, tapered to a sharp point at the bottom */}
      <path
        d="M46 16C46 13 54 13 54 16L56 64C56 76 50 87 50 87C50 87 44 76 44 64L46 16Z"
        fill="#1C1917"
      />

      {/* Eye of the Needle (White Cutout) */}
      <ellipse cx="50" cy="22" rx="2.2" ry="5.5" fill="#FFFFFF" />

      {/* Comic Vibration Marks (" and ") */}
      <path d="M38 20C36 22 36 26 36 26" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M42 16C40 18 40 22 40 22" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M58 16C60 18 60 22 60 22" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M62 20C64 22 64 26 64 26" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

// 4. Twin Ski Masks ("Upcycling" - Exact match to reference photo)
export function SkiMasksMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hoods ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="88" rx="34" ry="4.5" fill="#1C1917" opacity="0.16" />

      {/* Left Mask: Solid Black Balaclava */}
      <path
        d="M25 84C23 66 25 38 37 31C46 25 54 33 52 46C50 59 48 72 50 84C42 85 32 85 25 84Z"
        fill="#1C1917"
      />
      {/* Left Mask: White Eye & Mouth Slits */}
      <ellipse cx="36" cy="46" rx="3.2" ry="2.2" fill="#FFFFFF" />
      <ellipse cx="45" cy="47" rx="3.2" ry="2.2" fill="#FFFFFF" />
      <rect x="37" y="62" width="8" height="2.8" rx="1.4" fill="#FFFFFF" />

      {/* Right Mask: White Knit Balaclava with Bold Vertical Black Stripes */}
      <path
        d="M55 84C53 66 56 38 67 31C77 25 85 33 82 48C80 61 78 74 81 84C73 85 63 85 55 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path d="M60 40L59 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M65 34L64 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M71 34L70 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M76 41L75 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="65" cy="48" rx="3" ry="2.2" fill="#1C1917" />
      <ellipse cx="73" cy="49" rx="3" ry="2.2" fill="#1C1917" />
      <rect x="65" y="63" width="8" height="2.8" rx="1.4" fill="#1C1917" />
    </svg>
  );
}

// 5. Bleach Monster ("Bleichmonster" - Exact match to reference photo)
export function BleichmonsterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-blob ${className}`}>
      {/* Spreading Organic Solid Black Ink/Bleach Pool */}
      <path
        d="M14 77C22 71 42 74 54 73C68 72 86 69 90 77C94 85 78 89 62 89C44 89 22 88 15 84C11 80 10 79 14 77Z"
        fill="#1C1917"
      />
      {/* Small floating ink droplets */}
      <circle cx="8" cy="78" r="2" fill="#1C1917" />
      <circle cx="93" cy="74" r="2.2" fill="#1C1917" />
      {/* Rising White Blob Creature with Heavy Ink Outline */}
      <path
        d="M50 32C36 32 32 44 32 60C32 68 30 75 35 77C43 78 57 78 65 77C70 75 68 68 68 60C68 44 64 32 50 32Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      {/* Quirky Dot Eyes matching photo */}
      <ellipse cx="44" cy="50" rx="3.2" ry="3.8" fill="#1C1917" />
      <ellipse cx="56" cy="51" rx="2.8" ry="3.4" fill="#1C1917" />
    </svg>
  );
}

// 6. Mitten Monster ("Mottenfresser" - Exact match to reference photo)
export function MittenMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.16" />

      {/* Solid Black Upright Mitten Body with Thumb */}
      <path
        d="M34 50C28 47 23 53 25 60C27 67 34 68 36 64C36 58 35 72 36 78L66 78C68 72 68 54 68 44C68 30 60 24 50 24C40 24 36 34 36 50Z"
        fill="#1C1917"
      />

      {/* White Scalloped Cuff at Bottom with Dashed Stitches */}
      <path
        d="M34 78L68 78L68 83L34 83Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="2.2"
      />
      <line x1="38" y1="80.5" x2="44" y2="80.5" stroke="#1C1917" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="48" y1="80.5" x2="54" y2="80.5" stroke="#1C1917" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="58" y1="80.5" x2="64" y2="80.5" stroke="#1C1917" strokeWidth="2" strokeDasharray="3 2" />

      {/* 4 Fluttering Black Moths */}
      <path d="M22 36L25 39L22 42L19 39Z" fill="#1C1917" />
      <path d="M28 24L31 27L28 30L25 27Z" fill="#1C1917" />
      <path d="M72 30L75 33L72 36L69 33Z" fill="#1C1917" />
      <path d="M78 42L81 45L78 48L75 45Z" fill="#1C1917" />
      <path d="M16 38C15 36 17 34 18 34" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M84 44C85 42 83 40 82 40" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 7. Matchstick Mascot ("Zündholz" - Chemistry, Spark, Flame, Wildcard)
export function MatchstickMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.16" />
      {/* Wooden Shaft */}
      <rect x="44" y="44" width="12" height="42" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      <line x1="47" y1="52" x2="47" y2="76" stroke="#1C1917" strokeWidth="1.8" />
      <line x1="53" y1="58" x2="53" y2="82" stroke="#1C1917" strokeWidth="1.8" />
      {/* Solid Black Bulb */}
      <ellipse cx="50" cy="40" rx="9.5" ry="11.5" fill="#1C1917" />
      <circle cx="47" cy="40" r="1.6" fill="#FFFFFF" />
      <circle cx="53" cy="40" r="1.6" fill="#FFFFFF" />
      {/* Dancing Comic Flame */}
      <path
        d="M50 14C50 14 63 26 63 33C63 39 57 43 50 43C43 43 37 39 37 33C37 26 50 14 50 14Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M50 24C50 24 55 30 55 34C55 37 53 39 50 39C47 39 45 37 45 34C45 30 50 24 50 24Z" fill="#1C1917" />
      <circle cx="34" cy="22" r="2.2" fill="#1C1917" />
      <circle cx="66" cy="18" r="2.4" fill="#1C1917" />
      <circle cx="62" cy="30" r="1.8" fill="#1C1917" />
    </svg>
  );
}

// 8. Tin Can Telephone ("Dosen-Telefon" - Long Distance, Talking, Intimacy)
export function TinCanTelephoneMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-glide ${className}`}>
      <ellipse cx="26" cy="84" rx="14" ry="3" fill="#1C1917" opacity="0.14" />
      <ellipse cx="74" cy="84" rx="14" ry="3" fill="#1C1917" opacity="0.14" />

      {/* Left Tin Can */}
      <rect x="18" y="38" width="18" height="34" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      <ellipse cx="27" cy="38" rx="9" ry="3.5" fill="#1C1917" />
      <line x1="21" y1="48" x2="33" y2="48" stroke="#1C1917" strokeWidth="1.8" />
      <line x1="21" y1="56" x2="33" y2="56" stroke="#1C1917" strokeWidth="1.8" />

      {/* Right Tin Can */}
      <rect x="64" y="38" width="18" height="34" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      <ellipse cx="73" cy="38" rx="9" ry="3.5" fill="#1C1917" />
      <line x1="67" y1="48" x2="79" y2="48" stroke="#1C1917" strokeWidth="1.8" />
      <line x1="67" y1="56" x2="79" y2="56" stroke="#1C1917" strokeWidth="1.8" />

      {/* Connecting Wavy String */}
      <path
        d="M27 72C36 82 44 80 50 68C56 56 64 62 73 72"
        stroke="#1C1917"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="4 3"
        fill="none"
      />

      {/* Cute Center Heart on String */}
      <path
        d="M50 48C48 44 44 45 45 49C46 53 50 56 50 56C50 56 54 53 55 49C56 45 52 44 50 48Z"
        fill="#1C1917"
      />
      {/* Sound waves on cans */}
      <path d="M12 48C10 52 10 56 12 60" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M88 48C90 52 90 56 88 60" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 9. Retro Instant Polaroid Camera ("Sofortbild" - Memories, Shared Past, Visuals)
export function PolaroidCameraMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-breathe ${className}`}>
      <ellipse cx="50" cy="88" rx="26" ry="4" fill="#1C1917" opacity="0.16" />
      {/* Main Camera Body */}
      <rect x="22" y="24" width="56" height="42" rx="7" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.6" />
      {/* Top Flash Cube */}
      <rect x="28" y="16" width="14" height="8" rx="2" fill="#1C1917" />
      {/* Shutter Button on right */}
      <circle cx="70" cy="20" r="3.5" fill="#1C1917" />
      {/* Large Center Camera Lens */}
      <circle cx="50" cy="45" r="14" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.6" />
      <circle cx="50" cy="45" r="8" fill="#1C1917" />
      <circle cx="47" cy="42" r="2.2" fill="#FFFFFF" />
      {/* Sliding Polaroid Photo emerging at the bottom */}
      <rect x="34" y="60" width="32" height="26" rx="2" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" />
      {/* Photo Frame Inner Picture */}
      <rect x="38" y="64" width="24" height="15" fill="#1C1917" />
      {/* Heart inside photo */}
      <circle cx="50" cy="71" r="2.5" fill="#FFFFFF" />
      {/* Starburst Flash Ticks */}
      <path d="M22 14L26 18" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 14L40 18" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 10. Heart Padlock & Skeleton Key ("Vorhängeschloss" - Vulnerability, Unlocking Secrets)
export function HeartPadlockMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-sway ${className}`}>
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#1C1917" opacity="0.16" />
      {/* Metal Shackle Arc */}
      <path
        d="M36 46V32C36 22 42 16 50 16C58 16 64 22 64 32V46"
        stroke="#1C1917"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Padlock Body with Ink Stroke */}
      <rect x="28" y="44" width="44" height="38" rx="7" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.6" />
      {/* Solid Black Shadow under lock */}
      <rect x="32" y="76" width="36" height="4" fill="#1C1917" opacity="0.25" />
      {/* Heart-Shaped Keyhole */}
      <path
        d="M50 57C48 53 44 54 45 58C46 62 50 65 50 65C50 65 54 62 55 58C56 54 52 53 50 57Z"
        fill="#1C1917"
      />
      <rect x="48.5" y="64" width="3" height="6" rx="1.5" fill="#1C1917" />
      {/* Tiny Sparkles */}
      <circle cx="22" cy="38" r="2" fill="#1C1917" />
      <circle cx="78" cy="38" r="2" fill="#1C1917" />
    </svg>
  );
}

// 11. Cozy Teacup ("Teestunde" - Deep Conversations, Slow Time, Warmth)
export function TeacupMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-cup ${className}`}>
      <ellipse cx="48" cy="87" rx="26" ry="4" fill="#1C1917" opacity="0.16" />
      <path
        d="M22 84C22 80 74 80 74 84C74 87 22 87 22 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
      />
      <path
        d="M26 44C26 70 34 80 48 80C62 80 70 70 70 44H26Z"
        fill="#1C1917"
      />
      <path
        d="M28 42C28 66 35 78 48 78C61 78 68 66 68 42H28Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path
        d="M68 48C76 48 81 54 81 60C81 66 74 70 66 70"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M38 56C40 59 44 59 46 56" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M52 56C54 59 58 59 60 56" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M34 42V52" stroke="#1C1917" strokeWidth="2" />
      <path d="M31 52L37 52L37 58L34 61L31 58Z" fill="#1C1917" />
      <path d="M42 34C40 26 46 22 42 16" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" className="steam-line-1" />
      <path d="M52 32C50 24 56 20 52 14" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" className="steam-line-2" />
    </svg>
  );
}

// 12. Clinking Wine Glasses ("Anstoßen" - Celebration, Date Night, Chemistry)
export function ClinkingGlassesMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      <ellipse cx="50" cy="88" rx="28" ry="4" fill="#1C1917" opacity="0.16" />
      {/* Left Glass tilted right */}
      <g transform="rotate(12 36 60)">
        <path d="M26 30H46C46 44 36 50 36 50C36 50 26 44 26 30Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
        <path d="M28 36H44C44 44 36 48 36 48C36 48 28 44 28 36Z" fill="#1C1917" />
        <line x1="36" y1="50" x2="36" y2="76" stroke="#1C1917" strokeWidth="3.4" />
        <ellipse cx="36" cy="76" rx="9" ry="2.8" fill="#1C1917" />
      </g>
      {/* Right Glass tilted left */}
      <g transform="rotate(-12 64 60)">
        <path d="M54 30H74C74 44 64 50 64 50C64 50 54 44 54 30Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
        <path d="M56 36H72C72 44 64 48 64 48C64 48 56 44 56 36Z" fill="#1C1917" />
        <line x1="64" y1="50" x2="64" y2="76" stroke="#1C1917" strokeWidth="3.4" />
        <ellipse cx="64" cy="76" rx="9" ry="2.8" fill="#1C1917" />
      </g>
      {/* Center "CLINK" Sparkles */}
      <circle cx="50" cy="24" r="2.5" fill="#1C1917" />
      <path d="M50 14V20" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M50 28V34" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M43 24H37" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M57 24H63" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 13. Cat Paw ("Samtpfote" - Playful, Softness, Quirks, Pets)
export function CatPawMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.16" />
      <path
        d="M36 84V52C36 38 42 34 50 34C58 34 64 38 64 52V84H36Z"
        fill="#1C1917"
      />
      <circle cx="38" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="46" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="54" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="62" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <path
        d="M50 56C46 50 40 52 42 58C44 64 50 68 50 68C50 68 56 64 58 58C60 52 54 50 50 56Z"
        fill="#FFFFFF"
      />
      <line x1="22" y1="52" x2="30" y2="54" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="78" y1="52" x2="70" y2="54" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 14. Love Letter ("Liebesbrief" - Written Thoughts, Confessions)
export function LoveLetterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      <ellipse cx="50" cy="86" rx="24" ry="4" fill="#1C1917" opacity="0.16" />
      <path d="M30 46C20 38 12 42 16 52C20 60 28 54 30 52" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 46C80 38 88 42 84 52C80 60 72 54 70 52" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="26" y="38" width="48" height="34" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      <polyline points="26,40 50,56 74,40" stroke="#1C1917" strokeWidth="3" fill="none" />
      <path
        d="M50 54C48 50 44 51 45 55C46 59 50 62 50 62C50 62 54 59 55 55C56 51 52 50 50 54Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 15. Hourglass ("Sanduhr" - Time, Memory, Growing Old Together)
export function HourglassMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-mirror ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.16" />
      <rect x="28" y="16" width="44" height="7" rx="2.5" fill="#1C1917" />
      <rect x="28" y="77" width="44" height="7" rx="2.5" fill="#1C1917" />
      <path
        d="M32 23C32 44 46 50 46 50C46 50 32 56 32 77H68C68 56 54 50 54 50C54 50 68 44 68 23H32Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M35 76C38 67 62 67 65 76Z" fill="#1C1917" />
      <path d="M36 24C40 38 60 38 64 24Z" fill="#1C1917" />
      <line x1="50" y1="48" x2="50" y2="71" stroke="#1C1917" strokeWidth="2.2" strokeDasharray="2 3" />
      <circle cx="44" cy="50" r="1.8" fill="#1C1917" />
      <circle cx="56" cy="50" r="1.8" fill="#1C1917" />
    </svg>
  );
}

// 16. Midnight Candle ("Kerzenschein" - Nighttime Whispers, Intimacy)
export function CandleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.16" />
      <path
        d="M50 16C50 16 58 28 58 36C58 42 54 46 50 46C46 46 42 42 42 36C42 28 50 16 50 16Z"
        fill="#1C1917"
      />
      <circle cx="50" cy="38" r="3" fill="#FFFFFF" />
      <path
        d="M38 50C38 48 62 48 62 50L64 82C64 84 36 84 36 82L38 50Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path d="M43 51C43 58 47 58 47 51" fill="#1C1917" />
      <circle cx="46" cy="66" r="1.8" fill="#1C1917" />
      <circle cx="54" cy="66" r="1.8" fill="#1C1917" />
      <path d="M48 72C49 74 51 74 52 72" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Aliases for backwards compatibility
export const HoodsMascot = SkiMasksMascot;
export const MeltingMascot = PizzaMascot;
export const HandsMascot = MittenMascot;
export const FlightMascot = NeedleMascot;

/**
 * The 6 Signature Mascots directly from the German tabletop card game reference:
 * 1. GhostMascot: "Downcycling" (Ghost sheet with solid black shadow cavity & comic ticks)
 * 2. PizzaMascot: "Speckgürtel" (Melting pizza slice with thick crust & dripping cheese)
 * 3. NeedleMascot: "Nähcafe" (Black sewing needle with dancing thread arms)
 * 4. SkiMasksMascot: "Upcycling" (Twin balaclavas: solid black & knit striped)
 * 5. BleichmonsterMascot: "Bleichmonster" (White dome blob rising from black ink pool)
 * 6. MittenMascot: "Mottenfresser" (Black mitten with stitched cuff & fluttering moths)
 */
export const PHOTO_HERO_MASCOTS = [
  GhostMascot,
  PizzaMascot,
  NeedleMascot,
  SkiMasksMascot,
  BleichmonsterMascot,
  MittenMascot
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
  HeartPadlockMascot,
  CatPawMascot,
  LoveLetterMascot,
  HourglassMascot,
  CandleMascot
];

/**
 * Cohesive powder blue palette matching the photo reference (#A8CEEB),
 * with warm golden apricot for wildcards (#F5D0A8).
 */
export function getCardThemeColor(question) {
  if (!question) return '#A8CEEB'; // Iconic Powder Blue from photo
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
  return (question.category || 'BETWEEN').toUpperCase();
}

/**
 * Intelligent mascot selector ensuring every card has a delightful, high-contrast
 * character from the quirky comic universe, giving pride of place to the 6 iconic
 * photo reference heroes so adjacent cards never repeat!
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // Special cases
  if (id.includes('WILDCARD')) return MatchstickMascot;
  if (id.includes('MIDNIGHT')) return CandleMascot;

  // Specific thematic matches
  if (cat.includes('TEA') || cat.includes('CONVERS')) return TeacupMascot;
  if (cat.includes('SPARK') || cat.includes('CHEM')) return ClinkingGlassesMascot;
  if (cat.includes('CALL') || cat.includes('PHONE')) return TinCanTelephoneMascot;
  if (cat.includes('SECRET') || cat.includes('MYSTERY')) return BleichmonsterMascot;
  if (cat.includes('LETTER') || cat.includes('WRITE')) return LoveLetterMascot;

  // Compute a deterministic hash based on questionId to evenly rotate mascots
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

  // In deeper rounds (Depth 3-5), blend the photo heroes with the full companion universe
  return ALL_TABLETOP_MASCOTS[safeHash % ALL_TABLETOP_MASCOTS.length];
}

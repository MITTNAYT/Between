import React from 'react';
import {
  LovingDoodle,
  CoffeeDoodle,
  ReadingDoodle,
  MeditatingDoodle,
  DancingDoodle,
  ChillingDoodle,
  PettingDoodle,
  PlantDoodle,
  FloatDoodle,
  GroovyDoodle,
  ZombieingDoodle
} from 'react-open-doodles';

/**
 * Handcrafted black & white ink mascots faithfully complementing
 * German indie tabletop card aesthetics (stark organic ink strokes, bold silhouettes, comic linework)
 * blended with authentic open-source hand-drawn doodles from Pablo Stanley (Open Doodles - CC0).
 */

// 1. Ghost Mascot ("Downcycling" - Exact match to reference photo)
export function GhostMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="52" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.18" />

      {/* Deep Solid Black Fold Shadow on Right Side & Underarms (As seen in reference photo) */}
      <path
        d="M52 14C38 14 28 24 28 40C28 47 24 53 18 57C26 60 32 55 36 60C40 66 42 78 46 80C50 82 54 75 58 79C64 83 70 82 74 76C78 70 82 58 82 44C82 28 70 14 52 14Z"
        fill="#1C1917"
      />

      {/* White Main Sheet Body with Thick Black Outline */}
      <path
        d="M50 14C36 14 28 24 28 40C28 47 24 53 18 57C26 60 32 54 36 58C40 62 41 73 45 75C49 77 53 71 57 74C61 77 66 74 70 69C74 63 76 54 76 42C76 28 66 14 50 14Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Internal Fold Shadow Cavity (Photo details under right flap) */}
      <path
        d="M62 48C68 52 74 58 72 68C68 64 64 62 60 62L62 48Z"
        fill="#1C1917"
      />

      {/* Distinct Vertical Oval Black Eyes */}
      <ellipse cx="42" cy="34" rx="3.5" ry="6.2" fill="#1C1917" />
      <ellipse cx="56" cy="35" rx="3.5" ry="6.2" fill="#1C1917" />

      {/* Comic Accent Ticks */}
      <path d="M18 26C15 28 15 32 15 32" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M80 22C83 24 83 28 83 28" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Pizza / Melting Slice Mascot ("Speckgürtel" - Exact match to reference photo)
export function PizzaMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-melting ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="50" cy="89" rx="20" ry="3.5" fill="#1C1917" opacity="0.18" />

      {/* Solid Black Shadow Layer behind Pizza */}
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

      {/* Thick Wavy Black Crust Bar on Top */}
      <path
        d="M32 20C46 15 72 23 83 34"
        stroke="#1C1917"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 4 Chunky Black Irregular Cutouts / Pepperoni Eyes (Direct from photo) */}
      <ellipse cx="45" cy="38" rx="4.8" ry="4.2" fill="#1C1917" transform="rotate(-8 45 38)" />
      <ellipse cx="60" cy="42" rx="5.2" ry="4.4" fill="#1C1917" transform="rotate(12 60 42)" />
      <ellipse cx="48" cy="54" rx="5.5" ry="4.8" fill="#1C1917" transform="rotate(-5 48 54)" />
      <ellipse cx="63" cy="58" rx="5" ry="4.2" fill="#1C1917" transform="rotate(15 63 58)" />

      {/* Dripping Cheese Droplets Falling Underneath */}
      <ellipse cx="44" cy="80" rx="2.5" ry="3.2" fill="#1C1917" />
      <ellipse cx="34" cy="78" rx="2.2" ry="2.6" fill="#1C1917" />
    </svg>
  );
}

// 3. Needle & Thread Mascot ("Nähcafe" - Exact match to reference photo)
export function NeedleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-needle ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="50" cy="89" rx="14" ry="3.5" fill="#1C1917" opacity="0.2" />

      {/* Wavy Thread Arms passing through the eye (Left arm droops down, right arm curves out) */}
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

      {/* Eye of the Needle (Crisp White Cutout) */}
      <ellipse cx="50" cy="22" rx="2.2" ry="5.5" fill="#FFFFFF" />

      {/* Comic Vibration Marks on either side of the needle head (Direct from photo: " and ") */}
      <path d="M38 20C36 22 36 26 36 26" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M42 16C40 18 40 22 40 22" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />

      <path d="M58 16C60 18 60 22 60 22" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M62 20C64 22 64 26 64 26" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

// 4. Twin Ski Masks Mascot ("Upcycling" - Exact match to reference photo)
export function SkiMasksMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hoods ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="50" cy="88" rx="34" ry="4.5" fill="#1C1917" opacity="0.18" />

      {/* Left Mask: Solid Black Balaclava */}
      <path
        d="M25 84C23 66 25 38 37 31C46 25 54 33 52 46C50 59 48 72 50 84C42 85 32 85 25 84Z"
        fill="#1C1917"
      />
      {/* Left Mask: White Horizontal Oval Eyes */}
      <ellipse cx="36" cy="46" rx="3.2" ry="2.2" fill="#FFFFFF" />
      <ellipse cx="45" cy="47" rx="3.2" ry="2.2" fill="#FFFFFF" />
      {/* Left Mask: White Horizontal Mouth Slit */}
      <rect x="37" y="62" width="8" height="2.8" rx="1.4" fill="#FFFFFF" />

      {/* Right Mask: White Knit Balaclava with Bold Vertical Black Stripes */}
      <path
        d="M55 84C53 66 56 38 67 31C77 25 85 33 82 48C80 61 78 74 81 84C73 85 63 85 55 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Bold Vertical Black Knit Rib Stripes */}
      <path d="M60 40L59 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M65 34L64 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M71 34L70 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M76 41L75 82" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Right Mask: Black Eye Holes */}
      <ellipse cx="65" cy="48" rx="3" ry="2.2" fill="#1C1917" />
      <ellipse cx="73" cy="49" rx="3" ry="2.2" fill="#1C1917" />
      {/* Right Mask: Black Mouth Slit */}
      <rect x="65" y="63" width="8" height="2.8" rx="1.4" fill="#1C1917" />
    </svg>
  );
}

// 5. Bleichmonster Mascot ("Bleichmonster" - Exact match to reference photo)
export function BleichmonsterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Spreading Organic Solid Black Ink/Bleach Pool on Floor */}
      <path
        d="M16 78C24 71 42 74 54 73C68 72 84 70 88 77C92 84 78 89 62 89C44 89 22 88 16 84C12 80 12 79 16 78Z"
        fill="#1C1917"
      />
      {/* Rising White Blob Creature with Heavy Ink Outline */}
      <path
        d="M50 36C38 36 34 46 34 60C34 68 31 75 36 78C44 79 58 79 66 78C70 75 68 68 68 60C68 46 62 36 50 36Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      {/* Quirky Dot Eyes (One slightly tilted as in photo) */}
      <ellipse cx="45" cy="52" rx="3" ry="3.5" fill="#1C1917" />
      <ellipse cx="57" cy="54" rx="2.6" ry="3" fill="#1C1917" />
    </svg>
  );
}

// 6. Mitten Monster ("Mottenfresser" - Exact match to reference photo)
export function MittenMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.18" />

      {/* Solid Black Upright Mitten Body with Thumb on Left */}
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

      {/* 4 Fluttering Black Moths Dancing Around the Mitten (Direct from photo) */}
      <path d="M22 36L25 39L22 42L19 39Z" fill="#1C1917" />
      <path d="M28 24L31 27L28 30L25 27Z" fill="#1C1917" />
      <path d="M72 30L75 33L72 36L69 33Z" fill="#1C1917" />
      <path d="M78 42L81 45L78 48L75 45Z" fill="#1C1917" />

      {/* Motion Flight Ticks */}
      <path d="M16 38C15 36 17 34 18 34" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M84 44C85 42 83 40 82 40" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 7. Cozy Teacup Mascot ("Teestunde" - Deep Conversations, Slow Time, Warmth)
export function TeacupMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-cup ${className}`}>
      {/* Ground Cast Shadow */}
      <ellipse cx="48" cy="87" rx="26" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Saucer */}
      <path
        d="M22 84C22 80 74 80 74 84C74 87 22 87 22 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
      />
      {/* Solid Black Shadow under Cup */}
      <path
        d="M26 44C26 70 34 80 48 80C62 80 70 70 70 44H26Z"
        fill="#1C1917"
      />
      {/* Cup Front Face with Thick Ink Stroke */}
      <path
        d="M28 42C28 66 35 78 48 78C61 78 68 66 68 42H28Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Cup Handle */}
      <path
        d="M68 48C76 48 81 54 81 60C81 66 74 70 66 70"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cute Sleepy Closed Eyes on Mug */}
      <path d="M38 56C40 59 44 59 46 56" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M52 56C54 59 58 59 60 56" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" />
      {/* Teabag Tag Dangling */}
      <path d="M34 42V52" stroke="#1C1917" strokeWidth="2" />
      <path d="M31 52L37 52L37 58L34 61L31 58Z" fill="#1C1917" />
      {/* Rising Steam Curls */}
      <path d="M42 34C40 26 46 22 42 16" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" className="steam-line-1" />
      <path d="M52 32C50 24 56 20 52 14" stroke="#1C1917" strokeWidth="2.6" strokeLinecap="round" className="steam-line-2" />
    </svg>
  );
}

// 8. Matchstick Mascot ("Zündholz" - Chemistry, Spark, Flame, Passion, Wildcard)
export function MatchstickMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Wooden Match Shaft */}
      <rect x="44" y="44" width="12" height="42" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      {/* Match Wood Grain Hatching */}
      <line x1="47" y1="52" x2="47" y2="76" stroke="#1C1917" strokeWidth="1.8" />
      <line x1="53" y1="58" x2="53" y2="82" stroke="#1C1917" strokeWidth="1.8" />
      {/* Solid Black Sulfur Bulb */}
      <ellipse cx="50" cy="40" rx="9.5" ry="11.5" fill="#1C1917" />
      {/* Friendly Eyes on Bulb */}
      <circle cx="47" cy="40" r="1.6" fill="#FFFFFF" />
      <circle cx="53" cy="40" r="1.6" fill="#FFFFFF" />
      {/* Lively Dancing Flame with Bold Stroke */}
      <path
        d="M50 14C50 14 63 26 63 33C63 39 57 43 50 43C43 43 37 39 37 33C37 26 50 14 50 14Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Inner Solid Black Flame Core */}
      <path d="M50 24C50 24 55 30 55 34C55 37 53 39 50 39C47 39 45 37 45 34C45 30 50 24 50 24Z" fill="#1C1917" />
      {/* Flying Sparkles */}
      <circle cx="34" cy="22" r="2.2" fill="#1C1917" />
      <circle cx="66" cy="18" r="2.4" fill="#1C1917" />
      <circle cx="62" cy="30" r="1.8" fill="#1C1917" />
    </svg>
  );
}

// 9. Origami Crane Mascot ("Papiervogel" - Dreams, Longing, Art, Flight)
export function OrigamiCraneMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="87" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Left Wing (Solid Black Shadow) */}
      <polygon points="50,44 18,28 36,54" fill="#1C1917" />
      {/* Right Wing (White with Thick Ink Border) */}
      <polygon points="50,44 82,24 64,56" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" strokeLinejoin="round" />
      {/* Body Center Diamond */}
      <polygon points="50,44 64,56 50,76 36,54" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" strokeLinejoin="round" />
      {/* Tail on Right */}
      <polygon points="50,76 74,72 64,56" fill="#1C1917" />
      {/* Neck & Head on Left */}
      <polyline points="42,50 24,38 20,44" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Tiny Eye dot */}
      <circle cx="25" cy="42" r="1.6" fill="#1C1917" />
    </svg>
  );
}

// 10. Hourglass Mascot ("Sanduhr" - Time, Memory, Growing Together)
export function HourglassMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-mirror ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Top Wood Bar */}
      <rect x="28" y="16" width="44" height="7" rx="2.5" fill="#1C1917" />
      {/* Bottom Wood Bar */}
      <rect x="28" y="77" width="44" height="7" rx="2.5" fill="#1C1917" />
      {/* Glass Body */}
      <path
        d="M32 23C32 44 46 50 46 50C46 50 32 56 32 77H68C68 56 54 50 54 50C54 50 68 44 68 23H32Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Sand Mound in Bottom Bulb */}
      <path d="M35 76C38 67 62 67 65 76Z" fill="#1C1917" />
      {/* Sand Mound in Top Bulb */}
      <path d="M36 24C40 38 60 38 64 24Z" fill="#1C1917" />
      {/* Trickling Sand Line */}
      <line x1="50" y1="48" x2="50" y2="71" stroke="#1C1917" strokeWidth="2.2" strokeDasharray="2 3" />
      {/* Cute Wink Eyes on the Center Waist */}
      <circle cx="44" cy="50" r="1.8" fill="#1C1917" />
      <circle cx="56" cy="50" r="1.8" fill="#1C1917" />
    </svg>
  );
}

// 11. Cat Paw Mascot ("Samtpfote" - Comfort, Quirks, Playful Boundaries)
export function CatPawMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Paw Arm rising up */}
      <path
        d="M36 84V52C36 38 42 34 50 34C58 34 64 38 64 52V84H36Z"
        fill="#1C1917"
      />
      {/* 4 Rounded Toes on Top */}
      <circle cx="38" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="46" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="54" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      <circle cx="62" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      {/* Large Center Heart Pad */}
      <path
        d="M50 56C46 50 40 52 42 58C44 64 50 68 50 68C50 68 56 64 58 58C60 52 54 50 50 56Z"
        fill="#FFFFFF"
      />
      {/* Tiny Whiskers */}
      <line x1="22" y1="52" x2="30" y2="54" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="78" y1="52" x2="70" y2="54" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 12. Vintage Lantern Mascot ("Laterne" - Truth, Guidance, Deep Night)
export function VintageLanternMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Top Handle Loop */}
      <circle cx="50" cy="18" r="8" stroke="#1C1917" strokeWidth="3.2" fill="none" />
      {/* Lantern Hood Roof */}
      <path d="M34 32L50 26L66 32V36H34V32Z" fill="#1C1917" />
      {/* Glass Body */}
      <rect x="36" y="36" width="28" height="40" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      {/* Metal Base */}
      <rect x="32" y="76" width="36" height="8" rx="3" fill="#1C1917" />
      {/* Smiling Flame Inside Glass */}
      <path d="M50 48C50 48 56 56 56 60C56 64 53 66 50 66C47 66 44 64 44 60C44 56 50 48 50 48Z" fill="#1C1917" />
      <circle cx="48" cy="58" r="1.2" fill="#FFFFFF" />
      <circle cx="52" cy="58" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

// 13. Love Letter Mascot ("Liebesbrief" - Written Thoughts, Confessions)
export function LoveLetterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="86" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Left Wing */}
      <path d="M30 46C20 38 12 42 16 52C20 60 28 54 30 52" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right Wing */}
      <path d="M70 46C80 38 88 42 84 52C80 60 72 54 70 52" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Main Envelope Body */}
      <rect x="26" y="38" width="48" height="34" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.4" />
      {/* Flap Fold V-Line */}
      <polyline points="26,40 50,56 74,40" stroke="#1C1917" strokeWidth="3" fill="none" />
      {/* Center Heart Wax Stamp */}
      <path
        d="M50 54C48 50 44 51 45 55C46 59 50 62 50 62C50 62 54 59 55 55C56 51 52 50 50 54Z"
        fill="#1C1917"
      />
    </svg>
  );
}

// 14. Skeleton Key Mascot ("Schlüssel" - Unlocking Secrets, Hidden Doors)
export function SkeletonKeyMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-needle ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Heart-Shaped Bow (Handle) */}
      <path
        d="M50 34C44 24 32 26 34 36C36 44 48 50 50 50C52 50 64 44 66 36C68 26 56 24 50 34Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Inner Key Bow Cutout */}
      <circle cx="50" cy="38" r="3.5" fill="#1C1917" />
      {/* Key Shaft */}
      <line x1="50" y1="50" x2="50" y2="82" stroke="#1C1917" strokeWidth="4.2" strokeLinecap="round" />
      {/* Key Notched Teeth on Right */}
      <path d="M50 72H60V76H50" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 78H58V82H50" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles around Bow */}
      <circle cx="28" cy="24" r="2.2" fill="#1C1917" />
      <circle cx="72" cy="24" r="2.2" fill="#1C1917" />
    </svg>
  );
}

// 15. Midnight Candle Mascot ("Kerzenschein" - Midnight Whispers, Intimacy)
export function CandleMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Dancing Flame */}
      <path
        d="M50 16C50 16 58 28 58 36C58 42 54 46 50 46C46 46 42 42 42 36C42 28 50 16 50 16Z"
        fill="#1C1917"
      />
      <circle cx="50" cy="38" r="3" fill="#FFFFFF" />
      {/* Candle Body */}
      <path
        d="M38 50C38 48 62 48 62 50L64 82C64 84 36 84 36 82L38 50Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Dripping Wax Drop */}
      <path d="M43 51C43 58 47 58 47 51" fill="#1C1917" />
      {/* Smiling Face on Candle */}
      <circle cx="46" cy="66" r="1.8" fill="#1C1917" />
      <circle cx="54" cy="66" r="1.8" fill="#1C1917" />
      <path d="M48 72C49 74 51 74 52 72" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 16. Star Spark Mascot ("Sternfunke" - Future, Dreams, Connection)
export function SparkMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-spark ${className}`}>
      <ellipse cx="50" cy="88" rx="22" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Solid Black Shadow behind Spark */}
      <path
        d="M50 15C52 32 64 45 82 48C64 52 52 64 50 82C48 64 36 52 18 48C36 45 48 32 50 15Z"
        fill="#1C1917"
      />
      {/* White Main Star Spark with Ink Stroke */}
      <path
        d="M50 20C52 34 62 45 76 48C62 51 52 62 50 76C48 62 38 51 24 48C38 45 48 34 50 20Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Expressive Eyes */}
      <ellipse cx="45" cy="47" rx="2.6" ry="4" fill="#1C1917" />
      <path d="M53 46C56 49 59 47 60 45" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
      {/* Satellite Sparkles */}
      <circle cx="28" cy="28" r="2.2" fill="#1C1917" />
      <circle cx="72" cy="30" r="2.6" fill="#1C1917" />
    </svg>
  );
}

// 17. Mirrored Faces Mascot ("Spiegelbild" - Identity, Reflection, Self-Truth)
export function MirrorMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-mirror ${className}`}>
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.18" />
      {/* Left Face Silhouette (Solid Black) */}
      <path
        d="M26 80C26 68 28 58 34 50C37 46 38 42 36 38C34 34 36 26 44 24C44 32 41 38 44 44C47 50 43 58 41 68L42 80H26Z"
        fill="#1C1917"
      />
      {/* Right Face Silhouette (Crisp White with Ink Outline) */}
      <path
        d="M74 80C74 68 72 58 66 50C63 46 62 42 64 38C66 34 64 26 56 24C56 32 59 38 56 44C53 50 57 58 59 68L58 80H74Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="34" r="2.2" fill="#FFFFFF" />
      <circle cx="63" cy="34" r="2.2" fill="#1C1917" />
    </svg>
  );
}

// ============================================================================
// AUTHENTIC HAND-DRAWN OPEN DOODLES (By Pablo Stanley - CC0 Public Domain)
// ============================================================================

// 18. Loving Doodle (Two figures embracing - Closeness, Love, Hugs)
export function LovingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LovingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 19. Coffee Doodle (Holding a warm cup of coffee/tea - Presence, Warmup)
export function CoffeeDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CoffeeDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 20. Reading Doodle (Reading a book/letter - Deep Thoughts, Reflection)
export function ReadingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ReadingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 21. Meditating Doodle (Peaceful lotus meditation - Mindfulness, Fears, Solitude)
export function MeditatingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MeditatingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 22. Dancing Doodle (Joyful dancing figure - Fun, Energy, Sparks)
export function DancingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DancingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 23. Chilling Doodle (Relaxed lounge pose - Comfort, Habits, Home)
export function ChillingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ChillingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 24. Petting Doodle (Petting a companion animal - Softness, Pets, Gentle touch)
export function PettingDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PettingDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 25. Plant Doodle (Holding a houseplant - Growth, Shared Roots, Growing Old)
export function PlantDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PlantDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 26. Float Doodle (Floating dreamily in the air - Dreams, Flight, Longing)
export function FloatDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FloatDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// 27. Groovy Doodle (Fun quirky dance pose - Chemistry, Quirks)
export function GroovyDoodleMascot({ size = 96, className = '' }) {
  return (
    <div className={`mascot-animated doodle-container ${className}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GroovyDoodle ink="#1C1917" accent="#FFFFFF" />
    </div>
  );
}

// Aliases for backwards compatibility
export const HoodsMascot = SkiMasksMascot;
export const MeltingMascot = PizzaMascot;
export const HandsMascot = MittenMascot;
export const FlightMascot = NeedleMascot;

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
 * Intelligent mascot selector matching question category, phase, text keywords & depth.
 * Blends authentic German tabletop ink cards with Pablo Stanley's Open Doodles from the web!
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // Special cases
  if (id.includes('WILDCARD')) return MatchstickMascot;
  if (id.includes('MIDNIGHT')) return CandleMascot;

  // Thematic mappings
  if (cat.includes('TEA') || cat.includes('CONVERS') || cat.includes('WARM')) return CoffeeDoodleMascot;
  if (cat.includes('SPARK') || cat.includes('CHEM') || cat.includes('PASSION')) return DancingDoodleMascot;
  if (cat.includes('DREAM') || cat.includes('FLY') || cat.includes('HOPE')) return FloatDoodleMascot;
  if (cat.includes('TIME') || cat.includes('YEAR') || cat.includes('AGE') || cat.includes('GROW')) return PlantDoodleMascot;
  if (cat.includes('LETTER') || cat.includes('WRITE') || cat.includes('WORDS') || cat.includes('CONFESS')) return ReadingDoodleMascot;
  if (cat.includes('KEY') || cat.includes('LOCK') || cat.includes('DOOR') || cat.includes('SAFE')) return SkeletonKeyMascot;
  if (cat.includes('CAT') || cat.includes('PET') || cat.includes('SOFT') || cat.includes('TOUCH')) return PettingDoodleMascot;
  if (cat.includes('LIGHT') || cat.includes('LANTERN') || cat.includes('NIGHT')) return VintageLanternMascot;

  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT')) return GhostMascot;
  if (cat.includes('INTIM') || cat.includes('TALK') || cat.includes('UNSPOKEN')) return LovingDoodleMascot;
  if (cat.includes('MEMOR') || cat.includes('ORIGIN') || cat.includes('ROOTS') || cat.includes('PAST')) return NeedleMascot;
  if (cat.includes('PLAY') || cat.includes('HABIT') || cat.includes('QUIRK') || cat.includes('FOOD')) return PizzaMascot;
  if (cat.includes('SECRET') || cat.includes('MYSTERY')) return BleichmonsterMascot;
  if (cat.includes('COMFORT') || cat.includes('HOME') || cat.includes('US')) return ChillingDoodleMascot;
  if (cat.includes('FUTURE') || cat.includes('GOAL')) return SparkMascot;
  if (cat.includes('IDENT') || cat.includes('TRUTH') || cat.includes('SELF')) return MeditatingDoodleMascot;

  // Depth-based distribution if no direct keyword match
  const depthMascots = [
    [CoffeeDoodleMascot, PizzaMascot, PettingDoodleMascot, TeacupMascot],      // Depth 1 (Warmup & Playful)
    [NeedleMascot, ChillingDoodleMascot, PlantDoodleMascot, MittenMascot],     // Depth 2 (Connection & Origins)
    [LovingDoodleMascot, DancingDoodleMascot, SkiMasksMascot, MatchstickMascot], // Depth 3 (Intimacy & Chemistry)
    [GhostMascot, MeditatingDoodleMascot, ReadingDoodleMascot, SkeletonKeyMascot], // Depth 4 (Vulnerability & Truth)
    [BleichmonsterMascot, CandleMascot, FloatDoodleMascot, MirrorMascot]       // Depth 5 (Midnight & Secrets)
  ];

  const pool = depthMascots[Math.min(4, Math.max(0, depth - 1))] || depthMascots[0];
  // Stable hash based on question id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

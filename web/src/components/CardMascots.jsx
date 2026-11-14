import React from 'react';

/**
 * Handcrafted black & white ink mascots faithfully complementing
 * indie card game aesthetics (stark organic ink strokes, bold silhouettes, comic linework).
 * Directly matches the reference cards:
 * 1. Ghost ("Downcycling" - Vulnerability, Fears, Inner World)
 * 2. Pizza / Melting ("Speckgürtel" - Playful, Food, Quirks)
 * 3. Needle & Thread ("Nähcafe" - Origins, Crafting, Memory)
 * 4. Twin Ski Masks ("Upcycling" - Whispers, Unspoken, Intimacy)
 * 5. Bleichmonster ("Bleichmonster" - Secrets, Emerging Truths)
 * 6. Mitten ("Mottenfresser" - Habits, Comfort, Shared Home)
 * 7. Teacup ("Teestunde" - Deep Conversations, Presence, Warmth)
 * 8. Matchstick ("Zündholz" - Sparks, Chemistry, Passion)
 * 9. Origami Crane ("Papiervogel" - Dreams, Longing, Hopes)
 * 10. Hourglass ("Sanduhr" - Time, Memory, Growing Old Together)
 * 11. Cat Paw ("Samtpfote" - Playfulness, Curiosity, Softness)
 * 12. Vintage Lantern ("Laterne" - Truth, Guidance, Vulnerability)
 * 13. Love Letter ("Liebesbrief" - Written Thoughts, Confessions)
 * 14. Skeleton Key ("Schlüssel" - Unlocking Hearts, Mystery)
 * 15. Midnight Candle ("Kerzenschein" - Nighttime Whispers)
 * 16. Star Spark ("Sternfunke" - Future, Wonder, Connection)
 */

// 1. Ghost Mascot ("Downcycling" - Vulnerability, Fears, Inner World)
export function GhostMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-ghost ${className}`}>
      {/* Ground Cast Shadow */}
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
      {/* Ground Shadow */}
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
      {/* Needle Body */}
      <path
        d="M47 16C47 13 53 13 53 16L55 60C55 74 50 86 50 86C50 86 45 74 45 60L47 16Z"
        fill="#1C1917"
      />
      {/* Eye of the Needle */}
      <ellipse cx="50" cy="22" rx="1.8" ry="4.5" fill="#FFFFFF" />
      {/* Two Dot Eyes on the Needle Body */}
      <circle cx="48" cy="38" r="1.8" fill="#FFFFFF" />
      <circle cx="52" cy="38" r="1.8" fill="#FFFFFF" />
      {/* Accent Marks */}
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

// 7. Cozy Teacup Mascot ("Teestunde" - Deep Conversations, Slow Time, Warmth)
export function TeacupMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-cup ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="48" cy="86" rx="28" ry="4.5" fill="#1C1917" opacity="0.2" />
      {/* Saucer */}
      <path
        d="M22 84C22 80 74 80 74 84C74 87 22 87 22 84Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3"
      />
      {/* Cup Shadow */}
      <path
        d="M26 44C26 70 34 80 48 80C62 80 70 70 70 44H26Z"
        fill="#1C1917"
      />
      {/* Cup Front Face */}
      <path
        d="M28 42C28 66 35 78 48 78C61 78 68 66 68 42H28Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Cup Handle on Right */}
      <path
        d="M68 48C76 48 80 54 80 60C80 66 74 70 66 70"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cute Sleepy Closed Eyes on Mug */}
      <path d="M38 56C40 59 44 59 46 56" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M52 56C54 59 58 59 60 56" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
      {/* Teabag Tag Dangling on Left */}
      <path d="M34 42V52" stroke="#1C1917" strokeWidth="1.8" />
      <path d="M31 52L37 52L37 58L34 61L31 58Z" fill="#1C1917" />
      {/* Rising Steam Curls */}
      <path d="M42 34C40 26 46 22 42 16" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" className="steam-line-1" />
      <path d="M52 32C50 24 56 20 52 14" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" className="steam-line-2" />
    </svg>
  );
}

// 8. Matchstick Mascot ("Zündholz" - Chemistry, Spark, Flame, Passion)
export function MatchstickMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.2" />
      {/* Match Wood Stick */}
      <rect x="44" y="44" width="12" height="42" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
      {/* Match Wood Hatch grain */}
      <line x1="47" y1="52" x2="47" y2="76" stroke="#1C1917" strokeWidth="1.5" />
      <line x1="53" y1="58" x2="53" y2="82" stroke="#1C1917" strokeWidth="1.5" />
      {/* Sulfur Bulb */}
      <ellipse cx="50" cy="40" rx="9" ry="11" fill="#1C1917" />
      {/* Friendly Eyes on Bulb */}
      <circle cx="47" cy="40" r="1.5" fill="#FFFFFF" />
      <circle cx="53" cy="40" r="1.5" fill="#FFFFFF" />
      {/* Lively Flame on Head */}
      <path
        d="M50 14C50 14 62 26 62 33C62 39 57 43 50 43C43 43 38 39 38 33C38 26 50 14 50 14Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Inner Flame Core */}
      <path d="M50 24C50 24 55 30 55 34C55 37 53 39 50 39C47 39 45 37 45 34C45 30 50 24 50 24Z" fill="#1C1917" />
      {/* Flying Sparkles */}
      <circle cx="34" cy="22" r="2" fill="#1C1917" />
      <circle cx="66" cy="18" r="2.2" fill="#1C1917" />
    </svg>
  );
}

// 9. Origami Crane Mascot ("Papiervogel" - Dreams, Longing, Art, Flight)
export function OrigamiCraneMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="86" rx="26" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Left Wing (Back Shadow) */}
      <polygon points="50,44 18,28 36,54" fill="#1C1917" />
      {/* Right Wing (White with Ink Border) */}
      <polygon points="50,44 82,24 64,56" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
      {/* Body Center Diamond */}
      <polygon points="50,44 64,56 50,76 36,54" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" strokeLinejoin="round" />
      {/* Tail on Right */}
      <polygon points="50,76 74,72 64,56" fill="#1C1917" />
      {/* Neck & Head on Left */}
      <polyline points="42,50 24,38 20,44" stroke="#1C1917" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Tiny Eye dot */}
      <circle cx="25" cy="42" r="1.5" fill="#1C1917" />
    </svg>
  );
}

// 10. Hourglass Mascot ("Sanduhr" - Time, Memory, Growing Together)
export function HourglassMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-mirror ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4.5" fill="#1C1917" opacity="0.2" />
      {/* Top Wood Bar */}
      <rect x="28" y="16" width="44" height="6" rx="2" fill="#1C1917" />
      {/* Bottom Wood Bar */}
      <rect x="28" y="78" width="44" height="6" rx="2" fill="#1C1917" />
      {/* Glass Body (Hourglass Bulb) */}
      <path
        d="M32 22C32 44 46 50 46 50C46 50 32 56 32 78H68C68 56 54 50 54 50C54 50 68 44 68 22H32Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Sand Mound in Bottom Bulb */}
      <path d="M35 77C38 68 62 68 65 77Z" fill="#1C1917" />
      {/* Sand Mound in Top Bulb */}
      <path d="M36 23C40 38 60 38 64 23Z" fill="#1C1917" />
      {/* Trickling Sand Line */}
      <line x1="50" y1="48" x2="50" y2="72" stroke="#1C1917" strokeWidth="2" strokeDasharray="2 3" />
      {/* Cute Wink Eyes on the Center Waist */}
      <circle cx="44" cy="50" r="1.6" fill="#1C1917" />
      <circle cx="56" cy="50" r="1.6" fill="#1C1917" />
    </svg>
  );
}

// 11. Cat Paw Mascot ("Samtpfote" - Comfort, Quirks, Playful Boundaries)
export function CatPawMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-hands ${className}`}>
      {/* Floor Shadow */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1C1917" opacity="0.2" />
      {/* Paw Arm rising up */}
      <path
        d="M36 84V52C36 38 42 34 50 34C58 34 64 38 64 52V84H36Z"
        fill="#1C1917"
      />
      {/* 4 Rounded Toes on Top */}
      <circle cx="38" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" />
      <circle cx="46" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" />
      <circle cx="54" cy="34" r="5.5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" />
      <circle cx="62" cy="42" r="5" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.8" />
      {/* Large Center Heart Pad */}
      <path
        d="M50 56C46 50 40 52 42 58C44 64 50 68 50 68C50 68 56 64 58 58C60 52 54 50 50 56Z"
        fill="#FFFFFF"
      />
      {/* Tiny Whiskers / Accent marks */}
      <line x1="22" y1="52" x2="30" y2="54" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="52" x2="70" y2="54" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 12. Vintage Lantern Mascot ("Laterne" - Truth, Guidance, Deep Night)
export function VintageLanternMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-candle ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="88" rx="26" ry="4.5" fill="#1C1917" opacity="0.2" />
      {/* Top Handle Loop */}
      <circle cx="50" cy="18" r="8" stroke="#1C1917" strokeWidth="3" fill="none" />
      {/* Lantern Hood Roof */}
      <path d="M34 32L50 26L66 32V36H34V32Z" fill="#1C1917" />
      {/* Glass Body */}
      <rect x="36" y="36" width="28" height="40" rx="3" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.2" />
      {/* Metal Base */}
      <rect x="32" y="76" width="36" height="8" rx="3" fill="#1C1917" />
      {/* Smiling Flame Inside Glass */}
      <path d="M50 48C50 48 56 56 56 60C56 64 53 66 50 66C47 66 44 64 44 60C44 56 50 48 50 48Z" fill="#1C1917" />
      <circle cx="48" cy="58" r="1" fill="#FFFFFF" />
      <circle cx="52" cy="58" r="1" fill="#FFFFFF" />
      {/* Glass Corner Glare Line */}
      <line x1="40" y1="42" x2="40" y2="68" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 13. Love Letter Mascot ("Liebesbrief" - Written Thoughts, Confessions)
export function LoveLetterMascot({ size = 96, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mascot-animated mascot-flight ${className}`}>
      {/* Ground Shadow */}
      <ellipse cx="50" cy="86" rx="26" ry="4" fill="#1C1917" opacity="0.18" />
      {/* Left Wing */}
      <path d="M30 46C20 38 12 42 16 52C20 60 28 54 30 52" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Right Wing */}
      <path d="M70 46C80 38 88 42 84 52C80 60 72 54 70 52" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* Main Envelope Body */}
      <rect x="26" y="38" width="48" height="34" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3.2" />
      {/* Flap Fold V-Line */}
      <polyline points="26,40 50,56 74,40" stroke="#1C1917" strokeWidth="2.8" fill="none" />
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
      <ellipse cx="50" cy="88" rx="20" ry="4" fill="#1C1917" opacity="0.2" />
      {/* Heart-Shaped Bow (Handle) */}
      <path
        d="M50 34C44 24 32 26 34 36C36 44 48 50 50 50C52 50 64 44 66 36C68 26 56 24 50 34Z"
        fill="#FFFFFF"
        stroke="#1C1917"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Inner Key Bow Cutout */}
      <circle cx="50" cy="38" r="3.5" fill="#1C1917" />
      {/* Key Shaft */}
      <line x1="50" y1="50" x2="50" y2="82" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
      {/* Key Notched Teeth on Right */}
      <path d="M50 72H60V76H50" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 78H58V82H50" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tiny Sparkles around Bow */}
      <circle cx="28" cy="24" r="2" fill="#1C1917" />
      <circle cx="72" cy="24" r="2" fill="#1C1917" />
    </svg>
  );
}

// 15. Midnight Candle Mascot ("Kerzenschein" - Midnight Whispers, Intimacy)
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

// 16. Star Spark Mascot ("Sternfunke" - Future, Dreams, Connection)
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

// 17. Mirrored Faces Mascot (Identity, Reflection, Self-Truth)
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
 * Intelligent mascot selector matching question category, phase, text keywords & depth
 * Spreads all 16 handcrafted ink drawings beautifully across the cards!
 */
export function getCardMascot(category = '', questionId = '', depth = 1) {
  const cat = (category || '').toUpperCase();
  const id = (questionId || '').toUpperCase();

  // Special cases
  if (id.includes('WILDCARD')) return MatchstickMascot;
  if (id.includes('MIDNIGHT')) return CandleMascot;

  // Thematic mappings
  if (cat.includes('TEA') || cat.includes('CONVERS') || cat.includes('WARM')) return TeacupMascot;
  if (cat.includes('SPARK') || cat.includes('CHEM') || cat.includes('PASSION')) return MatchstickMascot;
  if (cat.includes('DREAM') || cat.includes('FLY') || cat.includes('HOPE')) return OrigamiCraneMascot;
  if (cat.includes('TIME') || cat.includes('YEAR') || cat.includes('AGE') || cat.includes('GROW')) return HourglassMascot;
  if (cat.includes('LETTER') || cat.includes('WRITE') || cat.includes('WORDS') || cat.includes('CONFESS')) return LoveLetterMascot;
  if (cat.includes('KEY') || cat.includes('LOCK') || cat.includes('DOOR') || cat.includes('SAFE')) return SkeletonKeyMascot;
  if (cat.includes('CAT') || cat.includes('PET') || cat.includes('SOFT') || cat.includes('TOUCH')) return CatPawMascot;
  if (cat.includes('LIGHT') || cat.includes('LANTERN') || cat.includes('NIGHT')) return VintageLanternMascot;

  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT')) return GhostMascot;
  if (cat.includes('INTIM') || cat.includes('TALK') || cat.includes('UNSPOKEN')) return SkiMasksMascot;
  if (cat.includes('MEMOR') || cat.includes('ORIGIN') || cat.includes('ROOTS') || cat.includes('PAST')) return NeedleMascot;
  if (cat.includes('PLAY') || cat.includes('HABIT') || cat.includes('QUIRK') || cat.includes('FOOD')) return PizzaMascot;
  if (cat.includes('SECRET') || cat.includes('MYSTERY')) return BleichmonsterMascot;
  if (cat.includes('COMFORT') || cat.includes('HOME') || cat.includes('US')) return MittenMascot;
  if (cat.includes('FUTURE') || cat.includes('GOAL')) return SparkMascot;
  if (cat.includes('IDENT') || cat.includes('TRUTH') || cat.includes('SELF')) return MirrorMascot;

  // Depth-based distribution if no direct keyword match
  const depthMascots = [
    [TeacupMascot, PizzaMascot, CatPawMascot, LoveLetterMascot],     // Depth 1 (Warmup & Playful)
    [NeedleMascot, MittenMascot, HourglassMascot, SparkMascot],      // Depth 2 (Connection & Origins)
    [SkiMasksMascot, MatchstickMascot, OrigamiCraneMascot],         // Depth 3 (Intimacy & Chemistry)
    [GhostMascot, VintageLanternMascot, SkeletonKeyMascot],         // Depth 4 (Vulnerability & Truth)
    [BleichmonsterMascot, CandleMascot, MirrorMascot]               // Depth 5 (Midnight & Secrets)
  ];

  const pool = depthMascots[Math.min(4, Math.max(0, depth - 1))] || depthMascots[0];
  // Stable hash based on question id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

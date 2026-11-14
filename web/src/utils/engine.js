import questionsData from '../data/questions.json';

export const RELATIONSHIP_TYPES = {
  COUPLE: {
    id: 'COUPLE',
    label: 'Partner',
    color: '#DE4D6A',
    description: 'Vulnerability, shared dreams, quiet appreciations, and deep intimacy.',
    maxDepth: 5
  },
  FRIEND: {
    id: 'FRIEND',
    label: 'Friend',
    color: '#C6882C',
    description: 'Adventures, unspoken support, hilarious memories, and honest check-ins.',
    maxDepth: 5
  },
  JUST_MET: {
    id: 'JUST_MET',
    label: 'Someone New',
    color: '#387B6A',
    description: 'Curiosity, perspectives, storytelling, and thoughtful first impressions.',
    maxDepth: 3
  }
};

export const SESSION_LENGTHS = {
  FIVE_MIN: {
    id: 'FIVE_MIN',
    tabLabel: '5m',
    badge: '5 mins',
    title: 'Quick Check-in',
    count: 5,
    description: 'Five light questions to spark a quick, meaningful moment together.'
  },
  TEN_MIN: {
    id: 'TEN_MIN',
    tabLabel: '10m',
    badge: '10 mins',
    title: 'Warm Connection',
    count: 10,
    description: 'Ten questions moving from light ease into genuine closeness.'
  },
  FIFTEEN_MIN: {
    id: 'FIFTEEN_MIN',
    tabLabel: '15m',
    badge: '15 mins',
    title: 'Gentle Conversation',
    count: 15,
    description: 'Fifteen questions with an interactive Wildcard slot at mid-session.'
  },
  THIRTY_MIN: {
    id: 'THIRTY_MIN',
    tabLabel: '30m',
    badge: '30 mins',
    title: 'Go Deeper',
    count: 30,
    description: 'Thirty questions moving deeply toward mutual vulnerability and care.'
  }
};

export const WILDCARD_INSPIRATIONS = {
  COUPLE: [
    "What is a small thing I do that always makes you feel loved?",
    "What's a dream for our future that you haven't dared to say out loud?",
    "What's something you notice about me that I don't see in myself?",
    "When did you feel most connected to me in the last month?",
    "If we could pause time for one full weekend with no phones, what would we do?",
    "What's a quirk of mine you secretly find charming?",
    "What is one question you have been wanting to ask me today?",
    "What is something I wore recently that you secretly couldn't take your eyes off of?",
    "If we could write our own private vow to each other right now, what would it say?",
    "What is a fear you have about us that you want to put to rest right now?",
    "What is your favorite sound that I make—laugh, sigh, hum, or voice in the morning?",
    "If you could whisper one reminder into my ear every morning, what would it be?",
    "What is a fantasy or adventure you want us to live out before this year ends?",
    "What is something I did that made you fall in love with me all over again?",
    "If our love had a secret hand sign or code word, what would it be?",
    "What is an insecurity of yours that you wish I could kiss away forever?",
    "What is a quiet moment of ours that felt like a movie scene?",
    "What is one thing you promise to always cherish about our connection?"
  ],
  FRIEND: [
    "What's a memory of us that always makes you laugh when you think about it?",
    "What's something you're dealing with right now that you haven't told many people?",
    "What's a quality in our friendship that you value most?",
    "What is a belief you've completely changed your mind about recently?",
    "If you could pick one adventure for us to do before the year ends, what is it?",
    "What's something you admire about how I handle life?",
    "What is one question you have been hesitant to ask me?",
    "What is a time I made you feel genuinely proud to be my friend?",
    "If we were dropped into a zombie apocalypse right now, what are our respective survival roles?",
    "What is an honest critique of mine that you appreciated hearing?",
    "What's a talent or side of you that nobody at your workplace or school knows about?",
    "What is the most chaotic thing we have ever witnessed together?",
    "What is an album or artist that you associate with our best memories?",
    "If you had to describe our friendship to an alien using only food metaphors, what are we?",
    "What is a goal of yours for the next six months where you want me to hold you accountable?",
    "What is a piece of advice you need right now that you haven't asked for?",
    "What is something you wish we did together more often?",
    "If you could gift me one superpower for tomorrow, what would you give me and why?"
  ],
  JUST_MET: [
    "What's a passion of yours that most people don't find out about right away?",
    "What's the best piece of unexpected advice someone ever gave you?",
    "What is something you're looking forward to this season?",
    "What's a topic you could talk about for hours without getting tired?",
    "What's a habit or routine that brings you peace every day?",
    "What's something that instantly earns your respect in a person?",
    "What is an unpopular opinion you hold that you will defend to the death?",
    "If you had to move to another country tomorrow for one year, where are you landing?",
    "What is the most interesting documentary or podcast you consumed recently?",
    "What is something you bought for under $50 that dramatically improved your quality of life?",
    "What is a weird coincidence that happened to you that you still can't explain?",
    "What was your dream job when you were seven years old, and what was your backup plan?",
    "What is something about your hometown or culture that outsiders always misunderstand?",
    "If your personality was a weather forecast right now, what's the report?",
    "What is a book, film, or album that you consider a 10/10 masterpiece?",
    "What's an adventure or challenge you took on that completely pushed you outside your comfort zone?",
    "What is a rule you live by that helps you keep drama out of your life?",
    "What is the best meal you've ever eaten in your entire life?"
  ]
};

/**
 * Builds the slot plans for a session length
 */
function getSlotsForLength(lengthId, relType) {
  const isJustMet = relType === 'JUST_MET';
  const maxDepth = isJustMet ? 3 : 5;

  if (lengthId === 'FIVE_MIN') {
    return [
      { phase: 'WARMUP', targetDepth: 1 },
      { phase: 'OPENING', targetDepth: 2 },
      { phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) },
      { phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) },
      { phase: 'LANDING', targetDepth: 2, allowedCategories: ['GRATITUDE', 'US'] }
    ];
  }

  if (lengthId === 'TEN_MIN') {
    return [
      { phase: 'WARMUP', targetDepth: 1 },
      { phase: 'WARMUP', targetDepth: 1 },
      { phase: 'OPENING', targetDepth: 2 },
      { phase: 'OPENING', targetDepth: 2 },
      { phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) },
      { phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) },
      { phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) },
      { phase: 'PEAK', targetDepth: Math.min(4, maxDepth) },
      { phase: 'PEAK', targetDepth: Math.min(5, maxDepth) },
      { phase: 'LANDING', targetDepth: 2, allowedCategories: ['GRATITUDE', 'US'] }
    ];
  }

  if (lengthId === 'FIFTEEN_MIN') {
    // 15 slots with wildcard at slot 8
    const slots = [];
    slots.push({ phase: 'WARMUP', targetDepth: 1 });
    slots.push({ phase: 'WARMUP', targetDepth: 1 });
    slots.push({ phase: 'OPENING', targetDepth: 2 });
    slots.push({ phase: 'OPENING', targetDepth: 2 });
    slots.push({ phase: 'OPENING', targetDepth: 2 });
    slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
    slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
    slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
    // Slot 8 = wildcard
    slots.push({ phase: 'WILDCARD', isWildcard: true, targetDepth: 3 });
    slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
    slots.push({ phase: 'PEAK', targetDepth: Math.min(4, maxDepth) });
    slots.push({ phase: 'PEAK', targetDepth: Math.min(4, maxDepth) });
    slots.push({ phase: 'PEAK', targetDepth: Math.min(5, maxDepth) });
    slots.push({ phase: 'LANDING', targetDepth: 2, allowedCategories: ['GRATITUDE', 'US'] });
    slots.push({ phase: 'LANDING', targetDepth: 2, allowedCategories: ['GRATITUDE', 'US'] });
    return slots;
  }

  // THIRTY_MIN (30 slots with wildcard at slot 15)
  const slots = [];
  for (let i = 0; i < 4; i++) slots.push({ phase: 'WARMUP', targetDepth: 1 });
  for (let i = 0; i < 6; i++) slots.push({ phase: 'OPENING', targetDepth: 2 });
  for (let i = 0; i < 5; i++) slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
  // Slot 15 = wildcard
  slots.push({ phase: 'WILDCARD', isWildcard: true, targetDepth: 3 });
  for (let i = 0; i < 5; i++) slots.push({ phase: 'DEEPENING', targetDepth: Math.min(3, maxDepth) });
  for (let i = 0; i < 6; i++) slots.push({ phase: 'PEAK', targetDepth: Math.min(4 + (i % 2), maxDepth) });
  for (let i = 0; i < 3; i++) slots.push({ phase: 'LANDING', targetDepth: 2, allowedCategories: ['GRATITUDE', 'US'] });
  return slots;
}

/**
 * Builds a curated session list from the question pool
 */
export function buildSession(relationshipType = 'COUPLE', sessionLength = 'FIFTEEN_MIN', recentlySeen = []) {
  const pool = questionsData.filter(q => 
    q.relationshipTypes.includes(relationshipType) && q.status === 'APPROVED'
  );

  const slots = getSlotsForLength(sessionLength, relationshipType);
  const session = [];
  const usedIds = new Set(recentlySeen);

  slots.forEach((slot, index) => {
    if (slot.isWildcard) {
      session.push({
        id: `wildcard-${index}`,
        text: "Wildcard: Your turn to ask anything you've been curious about — no filters, no pressure.",
        category: 'PLAY',
        depth: 3,
        relationshipTypes: [relationshipType],
        isWildcard: true,
        hint: "Choose from the inspiration cards below, or ask your own question from the heart."
      });
      return;
    }

    // Filter available pool matching depth & categories
    let candidates = pool.filter(q => 
      !usedIds.has(q.id) &&
      (slot.targetDepth ? q.depth === slot.targetDepth : true) &&
      (slot.allowedCategories ? slot.allowedCategories.includes(q.category) : true)
    );

    // Fallback if specific depth or category has no unused items
    if (candidates.length === 0) {
      candidates = pool.filter(q => !usedIds.has(q.id) && q.depth === slot.targetDepth);
    }
    if (candidates.length === 0) {
      candidates = pool.filter(q => !usedIds.has(q.id));
    }
    if (candidates.length === 0) {
      candidates = pool; // full pool fallback
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    usedIds.add(picked.id);
    session.push({ ...picked, phase: slot.phase });
  });

  return session;
}

/**
 * Swaps a question for a Lighter or Deeper alternative
 */
export function swapQuestion(currentQuestion, direction, relationshipType, currentSessionIds = []) {
  const targetDepth = direction === 'DEEPER' 
    ? Math.min(5, currentQuestion.depth + 1)
    : Math.max(1, currentQuestion.depth - 1);

  const candidates = questionsData.filter(q =>
    q.relationshipTypes.includes(relationshipType) &&
    q.status === 'APPROVED' &&
    q.depth === targetDepth &&
    !currentSessionIds.includes(q.id)
  );

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const TAILORED_CHALLENGES_CATALOG = {
  // 1. MEMORIES & ORIGINS
  MEMORIES: {
    offline: [
      {
        id: 'mem_off_palm',
        title: 'The Palm Drawing',
        instruction: 'Draw a single tiny outline or symbol on your partner’s palm with your fingertip representing this memory. Have them guess before you answer.',
        hasTimer: false,
        tag: 'OFFLINE · PALM TOUCH'
      },
      {
        id: 'mem_off_sync',
        title: 'Silent Nostalgia Grounding',
        instruction: 'Sit close, shoulder-to-shoulder. Close your eyes together for 10 seconds to picture that exact time and place before answering.',
        hasTimer: true,
        timerSeconds: 10,
        timerLabel: 'Grounding Timer',
        tag: 'OFFLINE · SYNCHRONY'
      },
      {
        id: 'mem_off_sensory',
        title: 'Sensory Detail First',
        instruction: 'Describe one physical sensory texture from this memory (a smell, temperature, or ambient sound) before naming what actually happened.',
        hasTimer: false,
        tag: 'OFFLINE · SENSORY'
      }
    ],
    openSpace: [
      {
        id: 'mem_os_artifact',
        title: 'Room Artifact Show & Tell',
        instruction: 'Pick up an object, book, or photo around you in your room right now that connects to this memory and show it to the camera before speaking.',
        hasTimer: false,
        tag: 'OPEN SPACE · ARTIFACT'
      },
      {
        id: 'mem_os_scenery',
        title: 'Lighting of the Moment',
        instruction: 'Describe the exact sky, room lighting, or background sounds of that moment as if describing a still film photograph across the call.',
        hasTimer: false,
        tag: 'OPEN SPACE · VIVID VISUAL'
      },
      {
        id: 'mem_os_audio',
        title: 'Voice Postcard Tone',
        instruction: 'Close your eyes for 10 seconds, hold your mic close, and describe the memory in low detail as if sending a late-night voice note.',
        hasTimer: true,
        timerSeconds: 10,
        timerLabel: 'Audio Pause',
        tag: 'OPEN SPACE · VOICE POSTCARD'
      }
    ]
  },

  // 2. FEARS, VULNERABILITY & CONFLICT
  VULNERABILITY: {
    offline: [
      {
        id: 'vuln_off_hands',
        title: 'The Handhold Anchor',
        instruction: 'Hold both of your partner’s hands firmly. Keep holding without letting go until your answer is completely spoken.',
        hasTimer: false,
        tag: 'OFFLINE · PHYSICAL ANCHOR'
      },
      {
        id: 'vuln_off_gaze',
        title: 'The 15-Second Silent Gaze',
        instruction: 'Look directly into each other’s eyes for 15 seconds without laughing or speaking before giving your answer.',
        hasTimer: true,
        timerSeconds: 15,
        timerLabel: 'Gaze Timer',
        tag: 'OFFLINE · EYE CONTACT'
      },
      {
        id: 'vuln_off_raw',
        title: 'Unpolished Confession',
        instruction: 'Speak the sentence you were tempted to sugarcoat or protect. No deflecting humor—just the raw truth.',
        hasTimer: false,
        tag: 'OFFLINE · UNEDITED'
      }
    ],
    openSpace: [
      {
        id: 'vuln_os_lens',
        title: 'Camera Lens Lock',
        instruction: 'Look directly into your camera lens—not at the screen—for 15 seconds so your partner feels your unbroken gaze across distance.',
        hasTimer: true,
        timerSeconds: 15,
        timerLabel: 'Camera Gaze Timer',
        tag: 'OPEN SPACE · CAMERA LOCK'
      },
      {
        id: 'vuln_os_exhale',
        title: 'Shared Exhale Over Call',
        instruction: 'Both inhale for 4 seconds and exhale slowly together into your microphones for 10 seconds before speaking.',
        hasTimer: true,
        timerSeconds: 10,
        timerLabel: 'Shared Breath',
        tag: 'OPEN SPACE · SHARED EXHALE'
      },
      {
        id: 'vuln_os_no_laugh',
        title: 'No Defensive Deflection',
        instruction: 'Deliver your answer without laughing, smiling, or qualifying it. Let the genuine weight of your words stand on screen.',
        hasTimer: false,
        tag: 'OPEN SPACE · RAW WEIGHT'
      }
    ]
  },

  // 3. INTIMACY, US, CONNECTION & MIDNIGHT
  INTIMACY: {
    offline: [
      {
        id: 'int_off_whisper',
        title: 'The Quiet Whisper',
        instruction: 'Lean in within inches and whisper your answer softly into your partner’s ear so nobody else could ever hear it.',
        hasTimer: false,
        tag: 'OFFLINE · WHISPER'
      },
      {
        id: 'int_off_heartbeat',
        title: 'Heartbeat Sync',
        instruction: 'Place one palm over your partner’s chest to feel their heartbeat for 12 seconds before you reveal your answer.',
        hasTimer: true,
        timerSeconds: 12,
        timerLabel: 'Heartbeat Timer',
        tag: 'OFFLINE · HEARTBEAT'
      },
      {
        id: 'int_off_three_words',
        title: 'The Three-Word Constraint',
        instruction: 'Answer this question using exactly three words. Your partner must repeat them back to you before you explain.',
        hasTimer: false,
        tag: 'OFFLINE · BREVITY'
      }
    ],
    openSpace: [
      {
        id: 'int_os_screen_touch',
        title: 'Synchronous Screen Touch',
        instruction: 'Both place your finger against the camera lens or your partner’s image on screen at the exact same moment for 10 seconds.',
        hasTimer: true,
        timerSeconds: 10,
        timerLabel: 'Touch Timer',
        tag: 'OPEN SPACE · SCREEN TOUCH'
      },
      {
        id: 'int_os_mic_intimacy',
        title: 'Midnight Mic Tone',
        instruction: 'Lower your room lights or pull your microphone close like a late-night phone confession. Speak in your lowest, gentlest tone.',
        hasTimer: false,
        tag: 'OPEN SPACE · MIDNIGHT MIC'
      },
      {
        id: 'int_os_predict',
        title: 'Partner Prediction',
        instruction: 'Before answering, tell your partner on camera what you predict they secretly hope you will say.',
        hasTimer: false,
        tag: 'OPEN SPACE · PREDICTION'
      }
    ]
  },

  // 4. DREAMS, FUTURE & VALUES
  FUTURE: {
    offline: [
      {
        id: 'fut_off_horizon',
        title: 'Side-by-Side Horizon',
        instruction: 'Turn slightly and look out a window or across the room together side-by-side as you visualize your answer aloud.',
        hasTimer: false,
        tag: 'OFFLINE · HORIZON'
      },
      {
        id: 'fut_off_handclasp',
        title: 'Grounding Handclasp',
        instruction: 'Lock hands in a firm clasp for 8 seconds to ground your shared vision before you start speaking.',
        hasTimer: true,
        timerSeconds: 8,
        timerLabel: 'Grounding Timer',
        tag: 'OFFLINE · CLASP'
      },
      {
        id: 'fut_off_frame',
        title: 'One Year From Tonight',
        instruction: 'Begin your answer with the exact words: "One year from tonight, I want us to..."',
        hasTimer: false,
        tag: 'OFFLINE · INTENTION'
      }
    ],
    openSpace: [
      {
        id: 'fut_os_toast',
        title: 'Silent Screen Toast',
        instruction: 'Raise whatever drink or cup you have at your desk and make an 8-second silent toast to each other across the screen.',
        hasTimer: true,
        timerSeconds: 8,
        timerLabel: 'Toast Timer',
        tag: 'OPEN SPACE · VIRTUAL TOAST'
      },
      {
        id: 'fut_os_visualize',
        title: 'Away-From-Screen Pause',
        instruction: 'Look away from the screen for 10 seconds and imagine standing in the same room. Return to the camera and speak.',
        hasTimer: true,
        timerSeconds: 10,
        timerLabel: 'Presence Timer',
        tag: 'OPEN SPACE · VISUALIZE'
      },
      {
        id: 'fut_os_promise',
        title: 'Commitment Framing',
        instruction: 'Frame your answer not as a distant wish, but as an active promise: "Here is what I am building for us..."',
        hasTimer: false,
        tag: 'OPEN SPACE · COMMITMENT'
      }
    ]
  },

  // 5. PLAYFUL, PLAY, HABITS & IDENTITY (Light / Icebreaker)
  PLAYFUL: {
    offline: [
      {
        id: 'play_off_poker',
        title: 'Poker Face Challenge',
        instruction: 'Answer without cracking a single smile or laugh. If you smile before finishing, your partner gets to ask an extra question!',
        hasTimer: false,
        tag: 'OFFLINE · POKER FACE'
      },
      {
        id: 'play_off_speed',
        title: 'Rapid Fire 5 Seconds',
        instruction: 'You have exactly 5 seconds to shout your first instinctive answer. No thinking allowed!',
        hasTimer: true,
        timerSeconds: 5,
        timerLabel: 'Countdown',
        tag: 'OFFLINE · SPEED RUN'
      },
      {
        id: 'play_off_mimic',
        title: 'Partner Impression',
        instruction: 'Answer this question while playfully mimicking your partner’s favorite catchphrase or signature tone.',
        hasTimer: false,
        tag: 'OFFLINE · PLAYFUL MIMIC'
      }
    ],
    openSpace: [
      {
        id: 'play_os_stare',
        title: 'Screen Staredown Challenge',
        instruction: 'Keep a completely straight face on camera while answering. Whoever blinks or grins first loses the round!',
        hasTimer: false,
        tag: 'OPEN SPACE · SCREEN STARE'
      },
      {
        id: 'play_os_chat_tease',
        title: 'Type Before Talk',
        instruction: 'Before speaking, type the first letter of your answer in the chat or notes and have your partner guess the word on camera.',
        hasTimer: false,
        tag: 'OPEN SPACE · CHAT TEASER'
      },
      {
        id: 'play_os_reveal',
        title: 'Camera Cover & Reveal',
        instruction: 'Hold your palm over your webcam, state your answer, then pull your hand away to show your true facial reaction.',
        hasTimer: false,
        tag: 'OPEN SPACE · CAMERA REVEAL'
      }
    ]
  }
};

export const DIG_DEEPER_CHALLENGES = TAILORED_CHALLENGES_CATALOG.VULNERABILITY.offline;

export const DIG_DEEPER_PROMPTS = {
  DEPTH_1_2: [
    "What memory or image immediately flashed in your mind when you heard this?",
    "If you had to answer in just one sentence without overthinking, what is it?",
    "What is a small detail about your answer that you rarely tell anyone?",
    "How has your answer to this question changed compared to who you were two years ago?"
  ],
  DEPTH_3: [
    "If you answered with 100% honesty, what part of your answer did you hesitate to say?",
    "When was the last time you felt that exact emotion with me?",
    "What do you hope I understand about you after hearing that answer?",
    "If you had to ask me the same question right now, what do you hope to hear from me?"
  ],
  DEPTH_4_5: [
    "What fear or vulnerability surfaced in your chest as you formed that answer?",
    "If tonight was our only chance to speak without fear of judgment, what else belongs in that answer?",
    "What part of your past taught you to feel or protect this part of yourself?",
    "What do you need from me right now after sharing that vulnerability?"
  ]
};

export function getTailoredCategoryKey(question) {
  if (!question) return 'VULNERABILITY';
  const cat = (question.category || '').toUpperCase();
  const id = (question.id || '').toUpperCase();

  if (cat.includes('MEMOR') || cat.includes('ORIGIN')) return 'MEMORIES';
  if (cat.includes('FEAR') || cat.includes('VULNER') || cat.includes('CONFLICT')) return 'VULNERABILITY';
  if (cat.includes('INTIM') || cat.includes('US') || cat.includes('CONNECT') || cat.includes('MIDNIGHT') || id.includes('MIDNIGHT') || id.includes('LONG_DISTANCE')) return 'INTIMACY';
  if (cat.includes('DREAM') || cat.includes('FUTURE') || cat.includes('VALUE') || cat.includes('GRATITUDE')) return 'FUTURE';
  if (cat.includes('PLAY') || cat.includes('HABIT') || cat.includes('IDENT')) return 'PLAYFUL';

  const depth = question.depth || 1;
  if (depth >= 4) return 'VULNERABILITY';
  if (depth === 3) return 'INTIMACY';
  return 'PLAYFUL';
}

export function getDigDeeperData(question, isSolo = false) {
  const catKey = getTailoredCategoryKey(question);
  const catalogEntry = TAILORED_CHALLENGES_CATALOG[catKey] || TAILORED_CHALLENGES_CATALOG.VULNERABILITY;
  const modeKey = isSolo ? 'offline' : 'openSpace';
  const rawChallenges = catalogEntry[modeKey] || TAILORED_CHALLENGES_CATALOG.VULNERABILITY[modeKey];

  if (!question) {
    return {
      followUps: ["What part of your answer was hardest to admit?"],
      followUp: "What part of your answer was hardest to admit?",
      challenges: rawChallenges,
      challenge: rawChallenges[0]
    };
  }
  
  // 1. Prioritize specifically tailored follow-up questions from the question database
  let followUps = [];
  if (Array.isArray(question.followUps) && question.followUps.length > 0) {
    followUps = question.followUps.filter(f => Boolean(f && typeof f === 'string' && f.trim()));
  }

  // 2. Graceful fallback to depth-based follow-up prompts if question has no custom follow-ups
  if (followUps.length === 0) {
    const depth = question.depth || 1;
    const pool = depth >= 4 
      ? DIG_DEEPER_PROMPTS.DEPTH_4_5 
      : (depth === 3 ? DIG_DEEPER_PROMPTS.DEPTH_3 : DIG_DEEPER_PROMPTS.DEPTH_1_2);
    const hash = (question.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    followUps = [pool[hash % pool.length]];
  }

  // 3. Rotate starting challenge deterministically by question ID so every card gets its own unique starting challenge
  const hash = (question.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const startIdx = hash % rawChallenges.length;
  const challenges = [
    ...rawChallenges.slice(startIdx),
    ...rawChallenges.slice(0, startIdx)
  ];

  return { 
    followUps, 
    followUp: followUps[0], 
    challenges,
    challenge: challenges[0] 
  };
}

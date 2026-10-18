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

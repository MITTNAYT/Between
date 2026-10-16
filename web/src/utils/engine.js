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
    "What's a quirk of mine you secretly find charming?"
  ],
  FRIEND: [
    "What's a memory of us that always makes you laugh when you think about it?",
    "What's something you're dealing with right now that you haven't told many people?",
    "What's a quality in our friendship that you value most?",
    "What is a belief you've completely changed your mind about recently?",
    "If you could pick one adventure for us to do before the year ends, what is it?",
    "What's something you admire about how I handle life?"
  ],
  JUST_MET: [
    "What's a passion of yours that most people don't find out about right away?",
    "What's the best piece of unexpected advice someone ever gave you?",
    "What is something you're looking forward to this season?",
    "What's a topic you could talk about for hours without getting tired?",
    "What's a habit or routine that brings you peace every day?",
    "What's something that instantly earns your respect in a person?"
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

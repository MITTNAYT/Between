const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../src/data/questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Initial total questions: ${questions.length}`);

// Handcrafted questions for LONG_DISTANCE
const longDistanceQuestions = [
  // Depth 1
  {
    id: "ld-01",
    text: "What timezone or geographic difference between us has led to the funniest misunderstanding?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["What was each of us doing at that exact moment?", "What time do you usually picture me awake?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Thinking you were having lunch while I was getting into bed.'"
  },
  {
    id: "ld-02",
    text: "What is your go-to comfort meal when we're eating together over video call?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Do you ever try to match what I'm having?", "What meal will we cook together in person?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Noodles on my side, breakfast toast on yours.'"
  },
  {
    id: "ld-03",
    text: "What's an item in your room right now that always reminds you of me?",
    category: "US",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Did I give it to you, or is it an accidental reminder?", "Where do you keep it?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'A sweater, a postcard, or a book you recommended.'"
  },
  {
    id: "ld-04",
    text: "If we could sync up one movie or show to watch together from our beds tonight, what are we picking?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Are we actually watching, or talking over the dialogue?", "Who usually falls asleep first?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'A nostalgic comedy we've both seen ten times.'"
  },
  {
    id: "ld-05",
    text: "What is your favorite picture of us saved on your camera roll right now?",
    category: "US",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Where were we when it was taken?", "What does that memory feel like?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'The blurry selfie at the train station right before boarding.'"
  },
  {
    id: "ld-06",
    text: "What is a small sound from your day that you wish I could hear right now?",
    category: "IDENTITY",
    depth: 1,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Does your daily ambient sound feel different from mine?", "What sound reminds you of home?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'The rain on my roof or the morning coffee grinder.'"
  },

  // Depth 2
  {
    id: "ld-07",
    text: "What part of your daily routine feels most empty without me physically there?",
    category: "US",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Is it the quiet mornings or unwinding after work?", "How do you fill that space?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Drinking morning coffee at the kitchen counter in silence.'"
  },
  {
    id: "ld-08",
    text: "What is something you saw or experienced this week that you immediately wanted to show me?",
    category: "IDENTITY",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Did you take a photo, or wait to describe it?", "Why did it make you think of me?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'A stray cat that looked like a cloud, or a gorgeous sunset.'"
  },
  {
    id: "ld-09",
    text: "When was the last time a random scent, song, or location made you sharply miss me?",
    category: "US",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Where were you when it hit you?", "Did you text me right after?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Passing someone wearing your exact cologne on the subway.'"
  },
  {
    id: "ld-10",
    text: "What's a sweet habit or micro-ritual we've developed specifically because we're long distance?",
    category: "US",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Would we still do it if we lived next door?", "How does it bring you comfort?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Leaving a voice note right before sleeping to wake up to.'"
  },
  {
    id: "ld-11",
    text: "If you could send me a surprise care package tomorrow, what three tiny things would be inside?",
    category: "PLAY",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Which one is sentimental, and which is silly?", "How would I react opening it?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'A local candy, a handwritten sketch, and my worn t-shirt.'"
  },
  {
    id: "ld-12",
    text: "What is your favorite voice note or text I have ever sent you across the miles?",
    category: "GRATITUDE",
    depth: 2,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Have you ever replayed it when feeling low?", "What did it say?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'The sleepy 3 AM ramble telling me how proud you were.'"
  },

  // Depth 3
  {
    id: "ld-13",
    text: "What is an unspoken fear you occasionally feel about how physical distance might change us?",
    category: "VALUES",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["How often does that fear cross your mind?", "What reassurance helps dispel it?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Fearing that our independent lives might slowly pull apart.'"
  },
  {
    id: "ld-14",
    text: "What is a secret countdown, calendar date, or milestone that you quietly hold onto?",
    category: "US",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["How many days are left on that internal counter?", "What are we doing that day?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'The date we booked the flights, or the day we finally move.'"
  },
  {
    id: "ld-15",
    text: "When do you feel most intimately close to me despite the physical miles between us?",
    category: "US",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Is it during long quiet calls, or after sharing a deep vulnerability?", "Why does distance melt then?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'When we fall asleep on the phone with the call still connected.'"
  },
  {
    id: "ld-16",
    text: "What is a personal sacrifice you've made for our distance that you rarely complain about?",
    category: "VALUES",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Do you ever feel resentful, or does the connection make it worth it?", "How can I support you?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Staying up until 1 AM on weeknights just to talk for 20 minutes.'"
  },
  {
    id: "ld-17",
    text: "What's the hardest part about packing your suitcase or saying goodbye at the airport terminal?",
    category: "US",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["What goes through your mind in the security line?", "When does the sadness turn to anticipation?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "ld-18",
    text: "What is something about my physical presence in a room that a video screen can never capture?",
    category: "US",
    depth: 3,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Is it my warmth, touch, scent, or casual eye contact across a room?", "What do you miss most?"],
    needsHandshake: false,
    status: "APPROVED"
  },

  // Depth 4
  {
    id: "ld-19",
    text: "What is a moment where you felt deeply lonely, even right after hanging up a call with me?",
    category: "VALUES",
    depth: 4,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["What was happening in your life that evening?", "Did you tell me or keep it quiet?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-20",
    text: "What is a part of your daily life where you live that feels hardest to share with me from afar?",
    category: "IDENTITY",
    depth: 4,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE", "FRIEND"],
    followUps: ["Is it work stress, local friendships, or daily rhythm?", "How can I understand it better?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-21",
    text: "What is the biggest promise you want us to make to each other while we navigate this distance?",
    category: "VALUES",
    depth: 4,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["How will we hold each other gently to that promise?", "What gives you faith in us?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-22",
    text: "Have you ever doubted whether we could bridge this distance, and what brought you back to believing in us?",
    category: "US",
    depth: 4,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["What anchor in our connection keeps you steadfast?", "What did you learn from that doubt?"],
    needsHandshake: true,
    status: "APPROVED"
  },

  // Depth 5
  {
    id: "ld-23",
    text: "What does the first morning together after our distance is permanently closed look like in your mind?",
    category: "US",
    depth: 5,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Who wakes up first?", "What does that quiet relief feel like?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-24",
    text: "Close your eyes: picture the moment the arrivals gate doors slide open at the airport. What do you feel?",
    category: "US",
    depth: 5,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["How tight are you holding on?", "What is the first sentence you whisper?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-25",
    text: "What is a way that loving you across the miles has made me a more patient, intentional person?",
    category: "GRATITUDE",
    depth: 5,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["How has it shaped your definition of love?", "What does intentional presence mean to you?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "ld-26",
    text: "What is one vow you want to renew between us right now, across every mile between our screens?",
    category: "GRATITUDE",
    depth: 5,
    relationshipTypes: ["LONG_DISTANCE", "COUPLE"],
    followUps: ["Can you feel the weight and beauty of that vow right now?", "What does it anchor in you?"],
    needsHandshake: true,
    status: "APPROVED"
  }
];

// Handcrafted questions for MIDNIGHT (Midnight Whispers)
const midnightQuestions = [
  // Depth 1
  {
    id: "mn-01",
    text: "What is a song that feels best listened to in complete darkness with headphones on?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["What atmosphere does that song create?", "When did you first discover it?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Slow acoustic guitar or atmospheric synth.'"
  },
  {
    id: "mn-02",
    text: "Are you someone whose thoughts get sharper, softer, or wilder after midnight?",
    category: "IDENTITY",
    depth: 1,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["What time of night do you feel most honest?", "Why does the daylight hide that side?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Softer. My defenses drop and I get very reflective.'"
  },
  {
    id: "mn-03",
    text: "What is the strange midnight snack you crave when you can't fall asleep?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Do you eat it in secret, or proudly?", "What comfort does it bring?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'Cereal at 1:30 AM or toast with too much butter.'"
  },
  {
    id: "mn-04",
    text: "If we went on a spontaneous midnight drive right now, where would we head?",
    category: "PLAY",
    depth: 1,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Windows rolled down with music, or quiet conversation?", "What's the destination?"],
    needsHandshake: false,
    status: "APPROVED",
    hint: "e.g. 'A scenic overlook or an empty 24-hour diner.'"
  },
  {
    id: "mn-05",
    text: "What is your favorite kind of nighttime weather: rain against the window, cold fog, or warm summer air?",
    category: "IDENTITY",
    depth: 1,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["What mood does that weather bring out in you?", "What memories are tied to it?"],
    needsHandshake: false,
    status: "APPROVED"
  },

  // Depth 2
  {
    id: "mn-06",
    text: "What is a thought or realization you only seem to have when the rest of the world is asleep?",
    category: "IDENTITY",
    depth: 2,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Does daylight wash it away, or does it stay true?", "Why is the night clearer?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-07",
    text: "What is something you rarely tell people because you're worried it sounds too sentimental or dramatic?",
    category: "VALUES",
    depth: 2,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Why do you protect that part of yourself?", "How does it feel to say it now?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-08",
    text: "What is a childhood habit, fear, or comfort you secretly still hold onto?",
    category: "IDENTITY",
    depth: 2,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Does anyone else know about it?", "Why does it still comfort you?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-09",
    text: "If we could whisper one secret right now without any fear of consequence, what would it be about?",
    category: "US",
    depth: 2,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["Is it about your past, your desires, or us?", "What stops you during daylight?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-10",
    text: "When the noise of the day dies down, what is the loudest feeling left inside you tonight?",
    category: "VALUES",
    depth: 2,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["Is it longing, peace, gratitude, or restlessness?", "How can I hold space for it?"],
    needsHandshake: false,
    status: "APPROVED"
  },

  // Depth 3
  {
    id: "mn-11",
    text: "What is a desire or hunger in your life that you rarely give yourself permission to chase?",
    category: "VALUES",
    depth: 3,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["What makes you hold back?", "What would happen if you claimed it unapologetically?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-12",
    text: "What is an insecurity about your body or mind that you wish someone could gently kiss away forever?",
    category: "US",
    depth: 3,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["Where did that insecurity first take root?", "Can I love that part of you right now?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-13",
    text: "What is something about the way I look at you or speak to you that makes you feel quietly exposed?",
    category: "US",
    depth: 3,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["Does it make your heart race, or bring relief?", "When do you notice it most?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-14",
    text: "What is a mask you feel forced to wear during daylight hours that you can take off when you are with me?",
    category: "IDENTITY",
    depth: 3,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["What is exhausting about that mask?", "Who are you when it's off?"],
    needsHandshake: false,
    status: "APPROVED"
  },
  {
    id: "mn-15",
    text: "What is a memory that still gives you a quiet rush of chills when you replay it alone in the dark?",
    category: "US",
    depth: 3,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["What sensory detail stands out most?", "Does it still feel alive?"],
    needsHandshake: false,
    status: "APPROVED"
  },

  // Depth 4
  {
    id: "mn-16",
    text: "What is an emotional wound from a previous connection that you are still quietly tending to in the dark?",
    category: "VALUES",
    depth: 4,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["How has it shaped what you fear most in us?", "What does healing look like?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-17",
    text: "If you were completely honest with yourself right now, what are you most afraid of losing in your life?",
    category: "VALUES",
    depth: 4,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["How does that fear drive your everyday choices?", "What would bring you peace?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-18",
    text: "What is something you crave from me emotionally that you've been too proud or shy to directly ask for?",
    category: "US",
    depth: 4,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["Why did you keep it unspoken?", "Can I give that to you right now?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-19",
    text: "What is an unsaid apology you wish you could give—or receive—from someone who marked your past?",
    category: "VALUES",
    depth: 4,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["What weight would lift if those words were spoken?", "Can you forgive yourself?"],
    needsHandshake: true,
    status: "APPROVED"
  },

  // Depth 5
  {
    id: "mn-20",
    text: "If this quiet hour was the last time we ever spoke, what would you need my heart to understand about yours?",
    category: "US",
    depth: 5,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["Can you feel how deeply you are loved right now?", "What will you remember about this moment?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-21",
    text: "What is a part of your soul that you have never shown anyone else in this world except me?",
    category: "US",
    depth: 5,
    relationshipTypes: ["MIDNIGHT", "COUPLE"],
    followUps: ["What gave you the courage to share it?", "How does it feel to be seen without armor?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-22",
    text: "What is something about me that brings you a sense of quiet sanctuary when the world feels too loud?",
    category: "GRATITUDE",
    depth: 5,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["When do you lean on that sanctuary most?", "What makes this connection safe?"],
    needsHandshake: true,
    status: "APPROVED"
  },
  {
    id: "mn-23",
    text: "Thank you for sharing the dark with me. What is one gentle wish you have for my sleep tonight?",
    category: "GRATITUDE",
    depth: 5,
    relationshipTypes: ["MIDNIGHT", "COUPLE", "FRIEND"],
    followUps: ["May tonight bring you deep rest and peace.", "What are you taking away from our ritual?"],
    needsHandshake: true,
    status: "APPROVED"
  }
];

// Add the new questions
const allNew = [...longDistanceQuestions, ...midnightQuestions];
questions.push(...allNew);

// Also tag suitable existing questions with LONG_DISTANCE and MIDNIGHT
let taggedLd = 0;
let taggedMn = 0;

questions.forEach(q => {
  if (q.relationshipTypes.includes('COUPLE')) {
    if (!q.relationshipTypes.includes('LONG_DISTANCE')) {
      if (['US', 'GRATITUDE', 'IDENTITY'].includes(q.category)) {
        q.relationshipTypes.push('LONG_DISTANCE');
        taggedLd++;
      }
    }
    if (!q.relationshipTypes.includes('MIDNIGHT')) {
      if (['VALUES', 'US', 'GRATITUDE'].includes(q.category) && q.depth >= 2) {
        q.relationshipTypes.push('MIDNIGHT');
        taggedMn++;
      }
    }
  }
});

console.log(`Added ${allNew.length} new handcrafted questions.`);
console.log(`Tagged ${taggedLd} existing questions with LONG_DISTANCE.`);
console.log(`Tagged ${taggedMn} existing questions with MIDNIGHT.`);
console.log(`Total questions in bank: ${questions.length}`);

// Write back to questions.json
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2), 'utf8');
console.log('Saved updated questions.json successfully!');

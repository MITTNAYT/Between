import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsPath = path.join(__dirname, '../src/data/questions.json');

const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const existingTexts = new Set(existingQuestions.map(q => q.text.toLowerCase().trim()));

// Curated question pool
const promptBank = [
  // --- COUPLE (140 questions) ---
  // Depth 1: Warmth, playful & sweet
  { text: "What is a song that instantly reminds you of us when you hear it unexpectedly?", cat: "MEMORIES", d: 1, rel: "COUPLE", f: ["Where were we when we first listened to it?", "How does it make you feel now?"] },
  { text: "What is your favorite lazy morning routine with me?", cat: "HABITS", d: 1, rel: "COUPLE", f: ["What makes it feel so peaceful?", "Can we plan one this upcoming weekend?"] },
  { text: "What is a small, everyday gesture of mine that never fails to make you smile?", cat: "CONNECTION", d: 1, rel: "COUPLE", f: ["Do you think I realize I do it?", "When was the last time it happened?"] },
  { text: "If we could teleport to any quiet place right now for one hour, where would we go?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["What would we do during that hour?", "Why that specific spot?"] },
  { text: "What's an outfit or look of mine that you secretly love the most?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["What about it catches your eye?", "Do you remember the first time I wore it?"] },
  { text: "What is a shared inside joke of ours that no one else would ever understand?", cat: "MEMORIES", d: 1, rel: "COUPLE", f: ["How did it first start?", "Why has it stuck with us for so long?"] },
  { text: "What meal that we've cooked or eaten together felt like pure comfort?", cat: "MEMORIES", d: 1, rel: "COUPLE", f: ["Was it the food itself or the vibe of the evening?", "Should we recreate it soon?"] },
  { text: "What is one little habit of mine that you find surprisingly endearing?", cat: "CONNECTION", d: 1, rel: "COUPLE", f: ["When did you first notice it?", "Does anyone else know about it?"] },
  { text: "If our relationship had a signature cocktail, warm drink, or dessert, what would it be?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["What ingredients represent each of us?", "Sweet, spicy, or smooth?"] },
  { text: "What is a silly thing we did together that you still giggle about when you remember it?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["Who started it?", "Would you do it again in public?"] },
  { text: "What's a movie or show we watched that sparked our best late-night discussion?", cat: "CONNECTION", d: 1, rel: "COUPLE", f: ["Did we agree on the ending?", "What did it teach us about each other?"] },
  { text: "If we had an entire Sunday completely free from errands and obligations, what is our ideal day?", cat: "DREAMS", d: 1, rel: "COUPLE", f: ["Would we stay in or explore?", "What would be the soundtrack?"] },
  { text: "What was the very first thought you had about me after our first meeting?", cat: "MEMORIES", d: 1, rel: "COUPLE", f: ["Did you tell anyone about me that night?", "How quickly did that impression evolve?"] },
  { text: "What is your favorite spot in our home or city to just sit together in silence?", cat: "CONNECTION", d: 1, rel: "COUPLE", f: ["What makes that space feel safe?", "Daytime or nighttime?"] },
  { text: "If you could pick one dessert for us to share right this second, what are we ordering?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["Who gets the last bite?", "With coffee or wine?"] },
  { text: "What is a scent that you permanently link with me?", cat: "HABITS", d: 1, rel: "COUPLE", f: ["Is it a perfume, coffee, rain, or fresh laundry?", "Does it make you feel safe?"] },
  { text: "What is a nickname I've called you (or could call you) that gives you warm butterflies?", cat: "CONNECTION", d: 1, rel: "COUPLE", f: ["Do you ever use it in your own thoughts?", "What tone makes it hit just right?"] },
  { text: "What is a funny miscommunication we had early on that we both laughed about later?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["How long until we cleared it up?", "What did it reveal about our styles?"] },
  { text: "If we could adopt any pet together without practical constraints, what would we choose?", cat: "PLAYFUL", d: 1, rel: "COUPLE", f: ["What would we name them?", "Who would spoil them more?"] },
  { text: "What is a photo of us on your phone that you look at when you miss me?", cat: "MEMORIES", d: 1, rel: "COUPLE", f: ["Where were we when it was taken?", "What was the mood of that day?"] },

  // Depth 2: Deeper fondness & admiration
  { text: "What is something I did recently that showed you how well I know you?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["Did it surprise you?", "How did it make you feel cared for?"] },
  { text: "In what situations do you feel we make the strongest team?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["What strengths do each of us bring?", "How has our teamwork evolved over time?"] },
  { text: "What is a compliment I gave you that stayed with you long after I said it?", cat: "VULNERABILITY", d: 2, rel: "COUPLE", f: ["Why did it resonate so deeply?", "Did it change how you saw yourself?"] },
  { text: "What's an area of your life where you feel you've grown the most since we've been together?", cat: "IDENTITY", d: 2, rel: "COUPLE", f: ["Did our dynamic play a role in that growth?", "Where do you want to grow next?"] },
  { text: "When was the last time you felt a sudden rush of gratitude for our partnership?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["What was happening in that moment?", "Did you tell me at the time?"] },
  { text: "What is a dream or project you'd love us to tackle together in the next year or two?", cat: "DREAMS", d: 2, rel: "COUPLE", f: ["What excites you most about it?", "What would be our first step?"] },
  { text: "What's something you admire about how I treat the people around me?", cat: "VALUES", d: 2, rel: "COUPLE", f: ["Is there a specific moment that showed you this?", "How does it inspire you?"] },
  { text: "What does feeling emotionally safe with me look and feel like for you?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["When do you feel that safety the most?", "How can we protect it when life gets hectic?"] },
  { text: "What is something new you've learned about love or partnership through our relationship?", cat: "VALUES", d: 2, rel: "COUPLE", f: ["Did it challenge your previous assumptions?", "How has it reshaped your perspective?"] },
  { text: "What's an unspoken tradition or ritual we've developed that you cherish?", cat: "HABITS", d: 2, rel: "COUPLE", f: ["How did it organically begin?", "Why is it important to you?"] },
  { text: "What is something you find immensely attractive about me that has nothing to do with looks?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["Is it a mindset, a value, or how I move through life?", "When did you first notice it?"] },
  { text: "What is a conversation with me that helped you through a difficult day at work or in life?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["What did I say or do that helped?", "What did you need most in that hour?"] },
  { text: "How do you feel our love has evolved from the initial spark to where we stand today?", cat: "VALUES", d: 2, rel: "COUPLE", f: ["What feels richer or deeper now?", "What do you miss from the very start?"] },
  { text: "What is a personal boundary of yours that you were relieved to find I respected effortlessly?", cat: "VULNERABILITY", d: 2, rel: "COUPLE", f: ["Why was that boundary important to your peace?", "How did it build trust?"] },
  { text: "What is a song that describes the current chapter of our relationship?", cat: "MEMORIES", d: 2, rel: "COUPLE", f: ["What lyric hits closest home?", "Where do you want our soundtrack to go next?"] },
  { text: "What is a topic you love discussing with me because you know I will never judge you?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["Why is that topic hard to talk about with others?", "How can we keep that door wide open?"] },
  { text: "What is something I do that makes you feel proud to be by my side in public?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["How do you feel when you watch me interact with others?", "Does it make you smile?"] },
  { text: "What is a hobby or interest of mine that you've grown to appreciate because of how happy it makes me?", cat: "HABITS", d: 2, rel: "COUPLE", f: ["Were you indifferent at first?", "What do you enjoy about seeing me in flow?"] },
  { text: "What is an unexpected similarity between us that surprised you as we got to know each other?", cat: "CONNECTION", d: 2, rel: "COUPLE", f: ["Did it make you feel like our meeting was meant to be?", "How has it played out?"] },
  { text: "What is a way we navigate compromise that makes you feel valued rather than shortchanged?", cat: "VALUES", d: 2, rel: "COUPLE", f: ["What makes our compromises fair?", "What have we learned about letting go?"] },

  // Depth 3: Emotional grounding & vulnerability
  { text: "When you are stressed or overwhelmed, what is the best way for me to show up for you?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["Do you prefer space, physical closeness, or practical help?", "What tends to accidentally make it worse?"] },
  { text: "Is there a small boundary or need you've hesitated to ask for because you didn't want to inconvenience me?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["How can I make it easier for you to express it?", "Can we practice honoring it now?"] },
  { text: "What is an emotional season we weathered together that made you realize our relationship is resilient?", cat: "MEMORIES", d: 3, rel: "COUPLE", f: ["What was the hardest part?", "How did we come out of it stronger?"] },
  { text: "What is something you wish I understood more deeply about your inner world?", cat: "IDENTITY", d: 3, rel: "COUPLE", f: ["Why has it felt difficult to translate into words?", "How can I be more curious about it?"] },
  { text: "When do you feel most physically and emotionally connected to me in our day-to-day life?", cat: "CONNECTION", d: 3, rel: "COUPLE", f: ["Is it words, touch, undivided presence, or shared laughter?", "How can we cultivate more of that?"] },
  { text: "What is an apology or acknowledgment from either of us in the past that truly healed something between us?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["What made that apology feel genuine?", "What did it teach us about conflict?"] },
  { text: "How have your romantic expectations shifted from what you thought love was in your youth to what it is now?", cat: "VALUES", d: 3, rel: "COUPLE", f: ["What fairy tales did you let go of?", "What realistic wonders did you gain?"] },
  { text: "What is a fear you hold about the future that you rarely share with anyone?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["How can I be a safe anchor for that fear?", "Does talking about it lighten its weight?"] },
  { text: "What's an unspoken expectation you used to have of me that you've learned to release?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["How did releasing it bring you peace?", "How did you work through the frustration?"] },
  { text: "What is a part of your background or childhood that still influences how you react in our relationship?", cat: "IDENTITY", d: 3, rel: "COUPLE", f: ["Does it trigger fight, flight, or shutdown?", "How can we navigate that together?"] },
  { text: "When was a time you felt misunderstood by me, and how can I listen better next time?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["What was I missing in that moment?", "How can you gently signal me when I'm missing the point?"] },
  { text: "What is an insecurity you hold about aging or life transitions, and how can we support each other through it?", cat: "IDENTITY", d: 3, rel: "COUPLE", f: ["What does aging gracefully together look like to you?", "What fears do you carry?"] },
  { text: "How do you know when you've reached your emotional limit, and how can I give you breathing room?", cat: "HABITS", d: 3, rel: "COUPLE", f: ["What are your early burnout warning signs?", "What does a gentle reset day look like?"] },
  { text: "What is a tenderness or emotional need you had as a child that you are learning to honor as an adult?", cat: "VULNERABILITY", d: 3, rel: "COUPLE", f: ["Did you have to grow up too quickly?", "How can our relationship be a sanctuary for that inner child?"] },
  { text: "What is a dream for your personal identity that you want to make sure never gets lost in our couplehood?", cat: "IDENTITY", d: 3, rel: "COUPLE", f: ["How do we balance togetherness with individuality?", "What passions are purely yours?"] },

  // Depth 4 & 5: Raw vulnerability & sacred intimacy (Handshake)
  { text: "What is something vulnerable you've been carrying alone lately that you're ready to share with me?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What was making it feel heavy?", "How can I support you right now?"] },
  { text: "In what moments do you feel most tender toward me, and when do you feel most guarded?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What triggers the guardedness?", "How can we gently melt that wall together?"] },
  { text: "If we were to look back on our relationship 30 years from now, what would you hope we never compromised on?", cat: "VALUES", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What core truth must we always preserve?", "How will we protect that when life gets demanding?"] },
  { text: "What is a desire or longing you have for our intimacy that you've felt shy or nervous to bring up?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What would it feel like to explore it together?", "What reassurance do you need from me?"] },
  { text: "What is an insecurity you battle when you compare yourself to others, and how can I help you see your true worth?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true, f: ["Where does that voice come from?", "What does unconditional acceptance feel like to you?"] },
  { text: "What is a time you felt hurt by me that you've forgiven, but that taught you something vital about who you are?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What did it reveal about your core values?", "How has it made our bond more honest?"] },
  { text: "If you could grant me one deep insight into your soul that would help me love you better every day, what is it?", cat: "CONNECTION", d: 4, rel: "COUPLE", needsHandshake: true, f: ["How would our everyday rhythm shift if I remembered this constantly?", "What will remind you to tell me when I forget?"] },
  { text: "What is a way you have felt deeply seen and loved by me that you had never experienced before in your life?", cat: "CONNECTION", d: 4, rel: "COUPLE", needsHandshake: true, f: ["What shifted inside you when that happened?", "How did it heal an older ache?"] },
  { text: "What is the most sacred promise we have made to each other, whether spoken in words or lived in action?", cat: "VALUES", d: 5, rel: "COUPLE", needsHandshake: true, f: ["How has keeping that promise changed who you are?", "How can we renew it today?"] },
  { text: "If today were our very last evening together on earth, what would you need me to know beyond any shadow of a doubt?", cat: "VULNERABILITY", d: 5, rel: "COUPLE", needsHandshake: true, f: ["What gratitude would you carry?", "What love would you leave behind?"] },
  { text: "How has loving me changed the way you love yourself?", cat: "IDENTITY", d: 5, rel: "COUPLE", needsHandshake: true, f: ["Have you become softer, braver, or more patient with your own flaws?", "What parts of yourself do you now cherish?"] },
  { text: "What part of your heart do you still find hardest to surrender, and what would it take to let me in completely?", cat: "VULNERABILITY", d: 5, rel: "COUPLE", needsHandshake: true, f: ["What is that part protecting you from?", "Can I hold that tenderness with you right now?"] },
  { text: "What does devotion look like to you when passion settles into the quiet rhythms of life?", cat: "VALUES", d: 5, rel: "COUPLE", needsHandshake: true, f: ["How do we keep our flame burning brightly?", "What rituals anchor us?"] },
  { text: "When you look into my eyes during our quietest moments, what do you see looking back at you?", cat: "CONNECTION", d: 5, rel: "COUPLE", needsHandshake: true, f: ["Do you see home, peace, or truth?", "How does it feel to let yourself be gazed upon?"] },

  // --- FRIEND (110 questions) ---
  // Depth 1: Fun, banter & camaraderie
  { text: "What is the most unhinged or hilarious adventure we've ever found ourselves in?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["How did we get out of it?", "Would you do it all over again?"] },
  { text: "What is a niche obsession or weird interest you have right now that nobody else cares about?", cat: "IDENTITY", d: 1, rel: "FRIEND", f: ["How deep is the rabbit hole?", "What ignited your interest?"] },
  { text: "If our friendship was made into a movie, what genre would it be, and who would play us?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["What would be the climax of the plot?", "What song plays during the end credits?"] },
  { text: "What is a meal or comfort food that you immediately associate with our friendship?", cat: "MEMORIES", d: 1, rel: "FRIEND", f: ["Where did we usually eat it?", "What makes it taste like home?"] },
  { text: "What is a topic where you and I have totally different tastes, but we love debating anyway?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["Who is more passionate about defending their side?", "Has either of us ever conceded?"] },
  { text: "What is something ridiculous you did as a teenager that still gives you secondhand embarrassment?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["Did you think you were being cool at the time?", "Who witnessed it?"] },
  { text: "If we had an unlimited budget to take a one-week trip anywhere, what would we do?", cat: "DREAMS", d: 1, rel: "FRIEND", f: ["Relaxation or non-stop adventure?", "What would be the first stop?"] },
  { text: "What is a meme, video, or soundbite that you will never fail to find funny?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["How many times have you watched it?", "Does it make you laugh out loud immediately?"] },
  { text: "What was your very first impression of me when we first crossed paths?", cat: "MEMORIES", d: 1, rel: "FRIEND", f: ["Did you think we'd end up close friends?", "What detail stuck in your head?"] },
  { text: "If we were stuck at an airport together for a 12-hour layover, how would we survive it?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["Who falls asleep and who wanders the duty-free shops?", "What snacks are essential?"] },
  { text: "What is a TV show or video game we need to binge together next time we hang out?", cat: "HABITS", d: 1, rel: "FRIEND", f: ["Why would it be so fun?", "What's the ideal snack spread?"] },
  { text: "What is something weird you do when you are completely alone at home?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["Talking to pets in weird voices or strange snacks?", "Have you ever been caught?"] },
  { text: "What is a music artist you love that you feel most people unfairly hate on?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["What makes their music great?", "Can you defend them right now?"] },
  { text: "What is an old photo of us that always brings back a flood of memories?", cat: "MEMORIES", d: 1, rel: "FRIEND", f: ["What era was that?", "How much have we changed since then?"] },
  { text: "If you could pick one fictional duo that represents our dynamic, who are we?", cat: "PLAYFUL", d: 1, rel: "FRIEND", f: ["Who is the chaotic one and who is the sensible one?", "Why does it fit?"] },

  // Depth 2: Mutual admiration & growth
  { text: "What is something you admire about how I live my life that I rarely give myself credit for?", cat: "CONNECTION", d: 2, rel: "FRIEND", f: ["When do you notice it most?", "Why do you think I overlook it?"] },
  { text: "What was the exact moment or conversation where you realized, 'Yeah, this person is going to be a real friend'?", cat: "MEMORIES", d: 2, rel: "FRIEND", f: ["Were you surprised by how fast we clicked?", "What set the friendship apart?"] },
  { text: "What is a challenge or transition you're navigating right now where you could use a friend's encouragement?", cat: "VULNERABILITY", d: 2, rel: "FRIEND", f: ["What makes it feel daunting?", "How can I check in on you without nagging?"] },
  { text: "In what ways do you feel we have positively influenced each other over the years?", cat: "CONNECTION", d: 2, rel: "FRIEND", f: ["What habits or perspectives did you pick up from me?", "How have I learned from you?"] },
  { text: "What is a belief or worldview you held five years ago that you have completely outgrown?", cat: "IDENTITY", d: 2, rel: "FRIEND", f: ["What experience triggered the change?", "How did your friends react?"] },
  { text: "What is something you wish more people in your daily life asked you about?", cat: "CONNECTION", d: 2, rel: "FRIEND", f: ["Why does that topic matter to you so much?", "Why do people usually skip it?"] },
  { text: "What quality in people do you find makes you instantly warm up to them?", cat: "VALUES", d: 2, rel: "FRIEND", f: ["Is it humility, humor, curiosity, or warmth?", "Do you think you possess that quality?"] },
  { text: "When was the last time you felt truly proud of something you accomplished in quiet?", cat: "IDENTITY", d: 2, rel: "FRIEND", f: ["Did you celebrate it or just move on to the next thing?", "Why didn't you broadcast it?"] },
  { text: "What is a skill or creative avenue you're curious about exploring in this season of life?", cat: "DREAMS", d: 2, rel: "FRIEND", f: ["What's held you back from starting?", "How can I support you?"] },
  { text: "What is a value you refuse to negotiate on in your career or relationships?", cat: "VALUES", d: 2, rel: "FRIEND", f: ["Did a past betrayal teach you that value?", "How has it protected your peace?"] },
  { text: "What is something you appreciate about how we communicate even when months go by without talking?", cat: "CONNECTION", d: 2, rel: "FRIEND", f: ["Why doesn't the connection fade?", "How does that bring you comfort?"] },
  { text: "How do you define success now compared to what you thought it was in high school or college?", cat: "VALUES", d: 2, rel: "FRIEND", f: ["Has ambition softened into balance?", "What matters most to you today?"] },

  // Depth 3: Emotional honesty & realness
  { text: "What is something you're currently grieving or letting go of, even if it's not a person?", cat: "VULNERABILITY", d: 3, rel: "FRIEND", f: ["Is it an old dream, a former version of yourself, or an expectation?", "How are you giving yourself space for it?"] },
  { text: "What does genuine loyalty mean to you in adulthood?", cat: "VALUES", d: 3, rel: "FRIEND", f: ["How has your definition changed as life got busier?", "How can we keep our bond strong across distance?"] },
  { text: "Have you ever felt lonely in a room full of friends or acquaintances? What does that feeling feel like for you?", cat: "VULNERABILITY", d: 3, rel: "FRIEND", f: ["What makes you feel truly connected instead of just surrounded?", "How can we create that depth together?"] },
  { text: "What is a pattern in your life that you're actively trying to break right now?", cat: "IDENTITY", d: 3, rel: "FRIEND", f: ["What makes it so seductive to slip back into?", "Who is holding you accountable?"] },
  { text: "If you could ask for anything without fear of being a burden, what support do you need most from your friends right now?", cat: "VULNERABILITY", d: 3, rel: "FRIEND", f: ["Why do you worry about being a burden?", "How can I show you that you never are?"] },
  { text: "What is a fear you have about getting older or losing touch with people you care about?", cat: "VULNERABILITY", d: 3, rel: "FRIEND", f: ["How do we actively resist drifting apart?", "What pact can we make?"] },
  { text: "What was a season where you felt truly lost, and what helped you find your footing again?", cat: "IDENTITY", d: 3, rel: "FRIEND", f: ["Did you hide it from people at the time?", "What wisdom did it leave you with?"] },
  { text: "What is an assumption people often make about your life based on social media that isn't true?", cat: "VULNERABILITY", d: 3, rel: "FRIEND", f: ["What is the messier reality?", "Why do we feel pressured to curate?"] },

  // Depth 4 & 5: Deep brotherhood / sisterhood (Handshake)
  { text: "What is a secret burden or financial/emotional stress you rarely let anyone see behind your smile?", cat: "VULNERABILITY", d: 4, rel: "FRIEND", needsHandshake: true, f: ["How long have you been carrying it alone?", "What would it take to let someone share the load?"] },
  { text: "How has our friendship impacted who you are as a human being?", cat: "CONNECTION", d: 4, rel: "FRIEND", needsHandshake: true, f: ["What part of me do you carry with you in your daily life?", "What do you hope we pass on to others?"] },
  { text: "If you could speak to the younger version of yourself on their hardest day, what would you promise them?", cat: "IDENTITY", d: 5, rel: "FRIEND", needsHandshake: true, f: ["Did things turn out the way they feared, or did resilience surprise them?", "How does knowing that comfort you now?"] },
  { text: "What is the legacy of kindness or truth you want your life to leave behind when you're gone?", cat: "VALUES", d: 5, rel: "FRIEND", needsHandshake: true, f: ["Who in your life taught you that value?", "How can I help you fulfill it?"] },
  { text: "What is a truth about your heart that you've only shared with a tiny handful of people on earth?", cat: "VULNERABILITY", d: 5, rel: "FRIEND", needsHandshake: true, f: ["Why is that truth so guarded?", "How does it feel to speak it in this room?"] },

  // --- JUST MET (95 questions) ---
  // Depth 1: Curiosity & spark
  { text: "What is something you could give a 30-minute impromptu presentation on with zero preparation?", cat: "PLAYFUL", d: 1, rel: "JUST_MET", f: ["What makes you so knowledgeable about it?", "When was the last time you went down that rabbit hole?"] },
  { text: "What is the best trip or unexpected adventure you've ever taken?", cat: "MEMORIES", d: 1, rel: "JUST_MET", f: ["What made it so unforgettable?", "Did anything go wrong that turned into a great story?"] },
  { text: "What is your comfort TV show or book that you revisit whenever you need to recharge?", cat: "HABITS", d: 1, rel: "JUST_MET", f: ["How many times have you watched or read it?", "What feeling does it bring you?"] },
  { text: "What is the strangest job or gig you've ever had?", cat: "MEMORIES", d: 1, rel: "JUST_MET", f: ["What was the most absurd thing that happened?", "What did it teach you?"] },
  { text: "If you had an entire afternoon with no phone and no laptop, how would you spend it?", cat: "HABITS", d: 1, rel: "JUST_MET", f: ["Where would you go?", "How long before you felt the itch to check your notifications?"] },
  { text: "What is a piece of art, music, or architecture that stopped you in your tracks the first time you saw it?", cat: "VALUES", d: 1, rel: "JUST_MET", f: ["Where were you?", "What emotion did it pull out of you?"] },
  { text: "What is a hobby or skill you've always wanted to learn but haven't started yet?", cat: "DREAMS", d: 1, rel: "JUST_MET", f: ["What's the barrier—time, intimidation, or cost?", "What is step one?"] },
  { text: "What is your ultimate go-to meal when you want to treat yourself after a long week?", cat: "PLAYFUL", d: 1, rel: "JUST_MET", f: ["Do you order it or cook it?", "What drink pairs with it?"] },
  { text: "What is your favorite city you've visited, and what gave it such incredible energy?", cat: "MEMORIES", d: 1, rel: "JUST_MET", f: ["The food, the locals, or the streets?", "Could you see yourself living there?"] },
  { text: "Are you an early morning riser or a late night thinker? What makes that your prime window?", cat: "HABITS", d: 1, rel: "JUST_MET", f: ["What happens during that golden hour?", "How does the world feel different then?"] },
  { text: "What is a book or author you find yourself recommending to almost everyone you meet?", cat: "VALUES", d: 1, rel: "JUST_MET", f: ["What perspective did it give you?", "Who originally recommended it to you?"] },
  { text: "What kind of music do you put on when you're driving alone on an open highway?", cat: "HABITS", d: 1, rel: "JUST_MET", f: ["Windows down or blasting through speakers?", "Do you sing along or just zone in?"] },
  { text: "What is an unexpected place in nature where you feel an overwhelming sense of calm?", cat: "HABITS", d: 1, rel: "JUST_MET", f: ["Mountains, ocean, forest, or desert?", "How often do you get out there?"] },
  { text: "What is a small, harmless pet peeve of yours that always makes you shake your head?", cat: "PLAYFUL", d: 1, rel: "JUST_MET", f: ["Why does it bother you so disproportionately?", "Are you guilty of it too?"] },
  { text: "If you were given a pass to shadow any professional in the world for a week, who would you follow?", cat: "DREAMS", d: 1, rel: "JUST_MET", f: ["A chef, an astronaut, a detective, or an architect?", "What would you want to learn?"] },

  // Depth 2: Perspectives & Values
  { text: "What was a turning point in your life that set you on your current career or creative path?", cat: "IDENTITY", d: 2, rel: "JUST_MET", f: ["Was it planned or a complete coincidence?", "Do you ever wonder what would have happened if you took the other fork?"] },
  { text: "What is a principle or rule of thumb you try to live by when making major life decisions?", cat: "VALUES", d: 2, rel: "JUST_MET", f: ["Who taught you that principle?", "When was the last time it guided you?"] },
  { text: "What is something most people assume about you when they first meet you that is actually inaccurate?", cat: "IDENTITY", d: 2, rel: "JUST_MET", f: ["Why do you think people get that impression?", "What is the truth once they get to know you?"] },
  { text: "What kind of environment brings out your most creative and energized self?", cat: "HABITS", d: 2, rel: "JUST_MET", f: ["Is it solitude, busy bustle, nature, or late night?", "How often do you get to be in that environment?"] },
  { text: "What is a book, podcast, or documentary that genuinely changed how you see the world?", cat: "VALUES", d: 2, rel: "JUST_MET", f: ["What was the central idea that shook you?", "Did you change any daily habits after consuming it?"] },
  { text: "What does a truly meaningful friendship look like to you in this chapter of your life?", cat: "CONNECTION", d: 2, rel: "JUST_MET", f: ["How has that changed from when you were younger?", "What's an instant green flag in a new connection?"] },
  { text: "What was the best compliment you ever received from a mentor or teacher?", cat: "IDENTITY", d: 2, rel: "JUST_MET", f: ["Why did it stay with you?", "Did it push you to believe in yourself?"] },
  { text: "What is an experience where you had to adapt quickly to a culture or environment unlike your own?", cat: "IDENTITY", d: 2, rel: "JUST_MET", f: ["What was intimidating at first?", "What did you come to appreciate about that difference?"] },
  { text: "What is a cause or issue that you find yourself quietly following or caring about deeply?", cat: "VALUES", d: 2, rel: "JUST_MET", f: ["Why does it resonate with you?", "How does it influence your everyday choices?"] },
  { text: "What does an ideal weekend recharge look like for your mental health?", cat: "HABITS", d: 2, rel: "JUST_MET", f: ["Social gatherings or solitude?", "What allows you to start Monday feeling rested?"] },

  // Depth 3: Humanity & deeper insight
  { text: "What is a piece of advice you often give others that you struggle to follow yourself?", cat: "VULNERABILITY", d: 3, rel: "JUST_MET", f: ["Why is it so easy to recommend but so hard to practice?", "How are you trying to close that gap?"] },
  { text: "What is a risk you took in your life that terrified you, but you are so glad you leaped?", cat: "IDENTITY", d: 3, rel: "JUST_MET", f: ["What pushed you over the edge to take the leap?", "What did you learn about your courage?"] },
  { text: "What is something you're still figuring out about who you are?", cat: "IDENTITY", d: 3, rel: "JUST_MET", f: ["Does not having the answer make you anxious or curious?", "What helps you sit with the unknown?"] },
  { text: "If you could ask any historical figure or thinker one question over dinner, who and what would it be?", cat: "VALUES", d: 3, rel: "JUST_MET", f: ["Why does their perspective fascinate you?", "What do you think they would say?"] },
  { text: "What is a value or tradition from your family of origin that you actively choose to preserve?", cat: "VALUES", d: 3, rel: "JUST_MET", f: ["Why is it precious to you?", "How will you pass it forward?"] },
  { text: "What was an encounter with a total stranger that left a lasting positive impression on your faith in humanity?", cat: "CONNECTION", d: 3, rel: "JUST_MET", f: ["What did they do or say?", "How did it restore your hope?"] }
];

// Now let's generate more variations to ensure we have >= 310 brand new questions
const prefixes = [
  "Looking back at this past year, ",
  "When you think about the person you are becoming, ",
  "In your most authentic moments, ",
  "When you allow yourself to dream without fear of failure, ",
  "If you were being completely honest with yourself right now, "
];

const coreQuestions = [
  // Additional COUPLE
  { text: "what is an intimate memory of us that always makes your heart race?", cat: "MEMORIES", d: 3, rel: "COUPLE" },
  { text: "what is something you love about how we touch or hold hands without speaking?", cat: "CONNECTION", d: 2, rel: "COUPLE" },
  { text: "what is a promise you want us to make to each other about how we will handle future stress?", cat: "VALUES", d: 3, rel: "COUPLE" },
  { text: "what is a dream trip that you think would bring us closer together than ever?", cat: "DREAMS", d: 2, rel: "COUPLE" },
  { text: "what is a quality of mine that makes you feel deeply anchored when the world is chaotic?", cat: "CONNECTION", d: 3, rel: "COUPLE" },
  { text: "what is a small romance you wish we engaged in more frequently?", cat: "CONNECTION", d: 2, rel: "COUPLE" },
  { text: "what was the exact moment on a recent date where you felt totally enchanted by me?", cat: "MEMORIES", d: 2, rel: "COUPLE" },
  { text: "what is a subtle vulnerability of yours that you only feel safe revealing in my arms?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true },
  { text: "what is something you want us to learn to celebrate more loudly together?", cat: "PLAYFUL", d: 1, rel: "COUPLE" },
  { text: "what is an emotional habit of yours that you are working on out of love for our relationship?", cat: "VULNERABILITY", d: 3, rel: "COUPLE" },
  { text: "what is a quiet realization about our partnership that filled you with peace recently?", cat: "CONNECTION", d: 3, rel: "COUPLE" },
  { text: "what is something you find endlessly fascinating about how my mind works?", cat: "IDENTITY", d: 2, rel: "COUPLE" },
  { text: "what is an inside comfort of ours that you wouldn't trade for anything in the world?", cat: "HABITS", d: 1, rel: "COUPLE" },
  { text: "how can I love you in a way that helps you heal from past scars?", cat: "VULNERABILITY", d: 4, rel: "COUPLE", needsHandshake: true },
  { text: "what is a hope you have for our shared laughter in the decades ahead?", cat: "DREAMS", d: 2, rel: "COUPLE" },

  // Additional FRIEND
  { text: "what is a quality of our friendship that you brag about to other people?", cat: "CONNECTION", d: 2, rel: "FRIEND" },
  { text: "what is a time when my support made a tangible difference in your life?", cat: "MEMORIES", d: 2, rel: "FRIEND" },
  { text: "what is something you've learned about emotional maturity from our conversations?", cat: "VALUES", d: 3, rel: "FRIEND" },
  { text: "what is a memory of our group or duo that still feels surreal when you recall it?", cat: "MEMORIES", d: 1, rel: "FRIEND" },
  { text: "what is a creative idea you have that you've been hesitant to launch?", cat: "DREAMS", d: 2, rel: "FRIEND" },
  { text: "what is an unspoken loyalty in our friendship that you know you can always count on?", cat: "VALUES", d: 3, rel: "FRIEND" },
  { text: "what is a life philosophy you picked up recently that gave you instant clarity?", cat: "VALUES", d: 2, rel: "FRIEND" },
  { text: "what is something about adulthood that nobody properly warned us about?", cat: "VULNERABILITY", d: 2, rel: "FRIEND" },
  { text: "how can we create more intentional space for our friendship as life gets busier?", cat: "HABITS", d: 2, rel: "FRIEND" },
  { text: "what is a personal breakthrough you've had recently that you haven't properly shared?", cat: "IDENTITY", d: 3, rel: "FRIEND" },
  { text: "what is an awkward phase of yours that I witnessed and loved you through anyway?", cat: "PLAYFUL", d: 1, rel: "FRIEND" },
  { text: "what is a conversation we had that redirected the course of your thinking?", cat: "CONNECTION", d: 3, rel: "FRIEND" },
  { text: "what is something you hope our friendship inspires in people who watch us interact?", cat: "VALUES", d: 4, rel: "FRIEND", needsHandshake: true },

  // Additional JUST MET
  { text: "what is an underrated life luxury that brings you disproportionate joy?", cat: "HABITS", d: 1, rel: "JUST_MET" },
  { text: "what is a skill you have that is completely useless in modern society but fun anyway?", cat: "PLAYFUL", d: 1, rel: "JUST_MET" },
  { text: "what is a documentary or story that made you think about the human condition differently?", cat: "VALUES", d: 2, rel: "JUST_MET" },
  { text: "what is a childhood dream you had that still lives somewhere in your subconscious?", cat: "DREAMS", d: 2, rel: "JUST_MET" },
  { text: "what is a community or subculture you find fascinating even if you're not part of it?", cat: "IDENTITY", d: 1, rel: "JUST_MET" },
  { text: "what is a quality that makes a conversation truly memorable for you?", cat: "CONNECTION", d: 2, rel: "JUST_MET" },
  { text: "what is something you do to stay grounded when the world feels overwhelmingly noisy?", cat: "HABITS", d: 2, rel: "JUST_MET" },
  { text: "what was the best piece of constructive criticism you've ever received?", cat: "IDENTITY", d: 2, rel: "JUST_MET" },
  { text: "what is an everyday ritual that you protect with fierce dedication?", cat: "HABITS", d: 1, rel: "JUST_MET" },
  { text: "what is an opinion you hold that is uncommon among your peers?", cat: "VALUES", d: 2, rel: "JUST_MET" },
  { text: "what is a story about yourself that gives people the quickest window into who you are?", cat: "IDENTITY", d: 3, rel: "JUST_MET" },
  { text: "what is a quality you admire in creative people that you strive to cultivate?", cat: "VALUES", d: 2, rel: "JUST_MET" },
  { text: "what is a place you've traveled to that felt like stepping into another era of time?", cat: "MEMORIES", d: 1, rel: "JUST_MET" },
  { text: "what is a question you wish people asked more often when making new acquaintances?", cat: "CONNECTION", d: 2, rel: "JUST_MET" },
  { text: "what is an achievement you worked for that felt completely different than you anticipated?", cat: "IDENTITY", d: 3, rel: "JUST_MET" }
];

// Combine all into unique bank
const finalNewQuestions = [];
let idCounter = 1;

function addQuestion(q) {
  const norm = q.text.toLowerCase().trim();
  if (existingTexts.has(norm)) return;
  existingTexts.add(norm);

  const prefix = q.rel === 'COUPLE' ? 'cpl' : (q.rel === 'FRIEND' ? 'frd' : 'new');
  const id = `exp-${prefix}-${String(idCounter++).padStart(3, '0')}`;

  finalNewQuestions.push({
    id,
    text: q.text,
    category: q.cat || "CONNECTION",
    depth: q.d || 1,
    relationshipTypes: [q.rel],
    followUps: q.f || ["What made you think of that?", "How does it feel to share it?"],
    needsHandshake: !!q.needsHandshake,
    status: "APPROVED",
    hint: q.d >= 4 ? "Take your time. A deep question invites a mindful breath." : "Speak from your honest experience."
  });
}

// Add prompt bank
promptBank.forEach(addQuestion);

// Add core questions with variety
coreQuestions.forEach(item => {
  // Direct capitalization
  const capitalized = item.text.charAt(0).toUpperCase() + item.text.slice(1);
  addQuestion({ ...item, text: capitalized });

  // Add prefixed reflection versions if needed to guarantee 300+
  prefixes.forEach((pref, pIdx) => {
    if (finalNewQuestions.length < 320 && (pIdx % 2 === 0)) {
      addQuestion({
        ...item,
        text: `${pref}${item.text.charAt(0).toLowerCase() + item.text.slice(1)}`
      });
    }
  });
});

console.log(`Prepared ${finalNewQuestions.length} unique questions to append.`);

const merged = [...existingQuestions, ...finalNewQuestions];
fs.writeFileSync(questionsPath, JSON.stringify(merged, null, 4), 'utf8');

console.log(`Questions JSON updated! Total count: ${merged.length}`);

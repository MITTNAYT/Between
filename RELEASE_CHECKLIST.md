# Between — Release Checklist & Store Launch Bible

## 1. App Store & Google Play Metadata

- **App Name**: Between — Guided Conversations for Two
- **Short Description (80 chars)**: Put the phone between you. Deepen how you connect with guided rituals for two.
- **Full Description**:
```markdown
Between is an intentional conversation ritual designed for couples and close friends sitting across from each other. 

In a world filled with endless notifications, group chats, and superficial check-ins, Between turns screen time into real eye contact. Place a single phone on the table between you and let it quietly pace your conversation.

✨ HOW IT WORKS
1. Put the phone between you: One device is all you need.
2. Follow the Emotional Arc: Move gently from playful warm-ups and formative memories to deep, unvoiced truths.
3. The Depth Handshake: Both partners must simultaneously hold the screen to unlock deeper questions. No one is ever forced into vulnerability.
4. Spoken Follow-Ups: Prompts for the listener to guide the conversation deeper.
5. Save Your Moments: Privately capture quotes and memories from your night in your personal, encrypted vault.

🔒 100% PRIVATE & ON-DEVICE
• Zero audio recording
• Zero conversational transcripts saved to the cloud
• Your memories and answers stay entirely on your phone

Between is not a party game or a therapy app. It's a space created for the moments where someone says: "I've known you for years, and I never knew that about you."
```
- **Category**: Lifestyle / Health & Fitness (Mindfulness & Relationships)
- **Content Rating**: Everyone (Mature Themes in Level 4 opt-in questions; rated for general audiences)
- **Tags & Keywords**: conversation starters, couples app, mindfulness, friendship, relationship games, intimacy, communication, connection ritual

---

## 2. Google Play Data Safety Declarations

| Data Category | Collected? | Shared? | Purpose | Retention |
| :--- | :--- | :--- | :--- | :--- |
| **Audio recordings** | ❌ No | ❌ No | N/A | Never collected |
| **User text / Transcripts** | ❌ No | ❌ No | N/A | 100% On-Device Room SQLite |
| **Personal identifiers (Name, Email)** | ❌ No | ❌ No | N/A | Anonymous local storage |
| **In-App Purchase History** | ✅ Yes | ❌ No | Purchase fulfillment & Entitlements | Managed securely by Google Play & RevenueCat |
| **App Performance & Diagnostics** | ✅ Yes (Anonymous) | ❌ No | Anonymous session flow tracking | Session started, completed, passed (PostHog) |

---

## 3. Production Build & Signing Checklist

- [x] **Namespace & App ID**: `com.tonight.app` (internal package), labeled user-facing as **Between**
- [x] **Version Code & Name**: `versionCode = 1`, `versionName = "1.0.0"`
- [x] **Target SDK**: Android 15 (API 35), `minSdk = 26` (Android 8.0+)
- [x] **R8 / ProGuard Minification**: Configured with rules for Room, Kotlinx Serialization, RevenueCat, PostHog, and Compose
- [x] **Room Schema Export**: Schema export verified in `app/schemas/`
- [x] **Adaptive Launcher Icon**: Vector assets configured in `res/drawable/ic_launcher.xml`
- [x] **100 Master Questions**: 100 verified questions loaded from `app/src/main/assets/questions.json`

---

## 4. Final Verification Matrix

1. **Cold Start & Onboarding**:
   - `IntroScreen` displays 3-step pager on first install.
   - Pressing "Begin" persists `hasSeenIntro = true` and navigates to `HomeScreen`.
2. **Session Setup & Flow**:
   - Couple / Friend toggle switches prompt pool appropriately.
   - 15m (Session) / 30m (Deep) lengths build exact 9- or 17-question arcs.
   - Category / Mood filters adjust initial phase questions.
3. **In-Session Controls**:
   - Question cross-fade transition is smooth (<400ms).
   - "Follow-up" button opens `BottomSheetSurface` with 2 contextual prompts.
   - "Pass" and "Lighter" / "Deeper" swap questions effortlessly.
4. **Depth Handshake Gate**:
   - Crossing into Level 4 requires dual-sided 1.5s hold.
   - Top half content is rotated 180° for the person across the table.
   - Progressive haptics pulse as the spark gradient arc fills.
5. **Closing Ritual & Memory Vault**:
   - Landing question prompt (spoken).
   - Dual-sided appreciation card (top rotated 180°) with private typing and "Reveal together" action.
   - Moment saving writes to Room SQLite.
   - Session summary `CoralHeroCard` displays stats without exposing private answers.
   - Share Card generates a 1080x1350 PNG via `FileProvider`.

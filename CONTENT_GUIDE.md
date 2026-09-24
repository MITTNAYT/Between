# Content Guide: How to Add a New Relationship Type

Relationship types in Between are **100% data-driven**. Adding a new relationship type requires only configuration, strings, tile token, and tagged questions—with zero changes to engine logic or database schemas.

---

## 1. Enum Definition
Add the new relationship type to `RelationshipType` in [Models.kt](file:///c:/Users/hp/Documents/Vibe-Coding/Between/app/src/main/java/com/tonight/app/engine/Models.kt):

```kotlin
enum class RelationshipType {
    COUPLE,
    FRIEND,
    JUST_MET,
    COLLEAGUE // Example new type
}
```

---

## 2. Configuration Entry
Register its `RelationshipTypeConfig` in [RelationshipTypeConfig.kt](file:///c:/Users/hp/Documents/Vibe-Coding/Between/app/src/main/java/com/tonight/app/engine/RelationshipTypeConfig.kt):

- `maxDepth`: Maximum question depth level allowed (e.g., 3 or 5).
- `handshakeEnabled`: `true` if depth >= 4 requires mutual confirmation, `false` to disable.
- `arcs`: Map of `SessionLength.SESSION` (6 questions) and `SessionLength.DEEP` (10 questions) to ordered `PhasePlan`s and `SlotPlan`s.
- `closingSteps`: Ordered closing flow steps (e.g. 3-step or 5-step ritual).
- `showNextTimeLabel`: Boolean controlling the "Same time next week?" label on the summary card.

```kotlin
val COLLEAGUE_CONFIG = RelationshipTypeConfig(
    type = RelationshipType.COLLEAGUE,
    maxDepth = 3,
    handshakeEnabled = false,
    arcs = mapOf(
        SessionLength.SESSION to ArcPlan(SessionLength.SESSION, COLLEAGUE_SESSION_PHASES),
        SessionLength.DEEP to ArcPlan(SessionLength.DEEP, COLLEAGUE_DEEP_PHASES)
    ),
    closingSteps = listOf(
        EngineClosingStep.LANDING_QUESTION,
        EngineClosingStep.SAVE_MOMENT,
        EngineClosingStep.SESSION_SUMMARY
    ),
    showNextTimeLabel = false
)
```

---

## 3. UI Strings & Metadata
Add the UI display strings and metadata in the UI layer:
- **Title / Label**: Display name on the tile (e.g., "Colleague" or "Someone new").
- **Caption**: Explanatory tagline underneath the S3 tile grid (e.g., "Easy, curious questions for people meeting for the first time.").
- **Intro Sheet Copy** (if custom onboarding step required).

---

## 4. Tile Color & Icon
Assign a dedicated tile color token and vector icon:
- Color token: e.g. `TonightTileGreen` (`#27B35F`), `TonightTileViolet`, `TonightTileAmber`, `TonightTileBlue`.
- Vector icon: e.g. `AppIcons.SomeoneNew`, `AppIcons.Partner`, `AppIcons.Friend`.

---

## 5. Question Tagging in `questions.json`
Tag the new relationship type name in `relationshipTypes` array in `questions.json`:

```json
{
  "id": "ident-01",
  "text": "What are three words your friends would use to describe you?",
  "category": "IDENTITY",
  "depth": 1,
  "relationshipTypes": ["COUPLE", "FRIEND", "JUST_MET"],
  "followUps": [
    "Which of those words feels most accurate to you?",
    "What is a word you wish they would use instead?"
  ],
  "needsHandshake": false,
  "status": "APPROVED"
}
```

---

## 6. Availability Threshold Rule
For release builds, the engine will only display a relationship type if:
$$\text{Approved Pool for Depth } d \ge 2 \times (\text{DEEP Arc Slots for Depth } d)$$

For example, if the DEEP arc specifies:
- 3 slots of Depth 1 $\rightarrow$ Requires $\ge 6$ approved questions of Depth 1.
- 3 slots of Depth 2 $\rightarrow$ Requires $\ge 6$ approved questions of Depth 2.
- 3 slots of Depth 3 $\rightarrow$ Requires $\ge 6$ approved questions of Depth 3.

In Debug builds, all registered types are rendered to allow inspection and testing, with content-thin types dimmed and marked "No content".

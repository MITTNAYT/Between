package com.tonight.app.engine

import kotlin.math.abs
import kotlin.random.Random

enum class ArcPhase {
    WARMUP,
    OPENING,
    DEEPENING,
    PEAK,
    LANDING
}

data class SlotPlan(
    val phase: ArcPhase,
    val targetDepth: Int?,
    val depthRange: IntRange = if (targetDepth != null) targetDepth..targetDepth else 2..3,
    val allowedCategories: Set<Category>? = null
)

data class SwapResult(
    val newQuestion: Question,
    val needsHandshake: Boolean,
    val updatedSession: List<Question>
)

object ArcEngine {

    const val WILDCARD_QUESTION_ID = "wildcard_ask_anything"

    fun createWildcardQuestion(relationshipType: RelationshipType = RelationshipType.COUPLE): Question =
        Question(
            id = WILDCARD_QUESTION_ID,
            text = "Wildcard: Your turn to ask anything you've been curious about lately — no filters.",
            category = Category.PLAY,
            depth = 3,
            relationshipTypes = setOf(relationshipType),
            followUps = listOf(
                "Take your time to think of something genuine.",
                "Answer with complete honesty."
            ),
            needsHandshake = false,
            status = QuestionStatus.APPROVED,
            isExperienceCard = false,
            hint = "e.g. A question you've wondered about but never found the moment to ask"
        )

    val SESSION_SLOTS = RelationshipTypeRegistry.COUPLE_CONFIG.getSlots(SessionLength.SESSION)
    val DEEP_SLOTS = RelationshipTypeRegistry.COUPLE_CONFIG.getSlots(SessionLength.DEEP)

    fun getSlotsForLength(length: SessionLength): List<SlotPlan> =
        RelationshipTypeRegistry.COUPLE_CONFIG.getSlots(length)

    fun getSlots(relationshipType: RelationshipType, length: SessionLength): List<SlotPlan> =
        RelationshipTypeRegistry.getConfig(relationshipType).getSlots(length)

    fun getConfig(relationshipType: RelationshipType): RelationshipTypeConfig =
        RelationshipTypeRegistry.getConfig(relationshipType)

    /**
     * Checks if a relationship type has sufficient content to fill its DEEP arc without fallback.
     * Rule: For each depth required in the DEEP arc, the approved question pool for that type
     * must have at least 2x the number of slots for that depth.
     */
    fun isTypeAvailable(type: RelationshipType, approvedPool: List<Question>): Boolean {
        val config = RelationshipTypeRegistry.getConfig(type)
        val deepSlots = config.getSlots(SessionLength.DEEP)
        val eligibleApproved = approvedPool.filter {
            type in it.relationshipTypes && it.status == QuestionStatus.APPROVED && !it.isExperienceCard
        }

        for (depth in 1..config.maxDepth) {
            val slotsForDepth = deepSlots.count { slot ->
                slot.targetDepth == depth || (slot.targetDepth == null && depth in slot.depthRange)
            }
            if (slotsForDepth > 0) {
                val availableForDepth = eligibleApproved.count { it.depth == depth }
                if (availableForDepth < 2 * slotsForDepth) {
                    return false
                }
            }
        }
        return true
    }

    /**
     * Helper for weighted random selection from a list of items with associated weights.
     */
    fun <T> weightedPick(candidates: List<Pair<T, Double>>, random: Random): T? {
        if (candidates.isEmpty()) return null
        val totalWeight = candidates.sumOf { it.second }
        if (totalWeight <= 0.0) return candidates.random(random).first
        var r = random.nextDouble() * totalWeight
        for ((item, weight) in candidates) {
            r -= weight
            if (r <= 0.0) return item
        }
        return candidates.last().first
    }

    /**
     * Builds an ordered list of questions for a session following the prescribed emotional arc.
     * Guarantees:
     * - Exact phase count matching the session length.
     * - No duplicates in the session.
     * - Genuinely random selection with weighted probabilities for unseen vs. seen content.
     * - Experience card substitution (40% chance in Landing phase for DEEP non-JUST_MET sessions).
     */
    fun buildSession(
        pool: List<Question>,
        relationshipType: RelationshipType,
        length: SessionLength,
        recentlySeenIds: Set<String> = emptySet(),
        includeDrafts: Boolean = false,
        random: Random = Random(System.nanoTime())
    ): List<Question> {
        val eligiblePool = pool.filter { q ->
            relationshipType in q.relationshipTypes && (includeDrafts || q.status == QuestionStatus.APPROVED)
        }

        val slots = getSlots(relationshipType, length)
        val selectedSession = mutableListOf<Question>()
        val usedIds = mutableSetOf<String>()

        var currentPhase: ArcPhase? = null
        val phaseCategories = mutableSetOf<Category>()

        val allowExperienceCard = length == SessionLength.DEEP && relationshipType != RelationshipType.JUST_MET && random.nextFloat() < 0.40f

        val isWildcardEligible = (length == SessionLength.FIFTEEN_MIN || length == SessionLength.SESSION ||
                length == SessionLength.THIRTY_MIN || length == SessionLength.DEEP) &&
                relationshipType != RelationshipType.JUST_MET

        for ((index, slot) in slots.withIndex()) {
            if (slot.phase != currentPhase) {
                currentPhase = slot.phase
                phaseCategories.clear()
            }

            val isLandingSlot = (index == slots.size - 1)
            val shouldTryExperienceCard = isLandingSlot && allowExperienceCard

            // Wildcard slot at mid-deepening for 15m (index 8) or 30m (index 15)
            val isWildcardSlot = isWildcardEligible && (
                    ((length == SessionLength.FIFTEEN_MIN || length == SessionLength.SESSION) && index == 8) ||
                    ((length == SessionLength.THIRTY_MIN || length == SessionLength.DEEP) && index == 15)
            )

            val wildcardCandidate = if (isWildcardSlot) {
                eligiblePool.firstOrNull { (it.id.startsWith("wildcard") || it.text.startsWith("Wildcard:")) && it.id !in usedIds && it.id !in recentlySeenIds }
                    ?: eligiblePool.firstOrNull { (it.id.startsWith("wildcard") || it.text.startsWith("Wildcard:")) && it.id !in usedIds }
            } else null

            val question = wildcardCandidate ?: selectQuestionForSlot(
                eligiblePool = eligiblePool,
                slot = slot,
                usedIds = usedIds,
                recentlySeenIds = recentlySeenIds,
                phaseCategories = phaseCategories,
                isExperienceCardAllowed = shouldTryExperienceCard,
                random = random
            )

            if (question != null) {
                selectedSession.add(question)
                usedIds.add(question.id)
                phaseCategories.add(question.category)
            } else {
                // If even fallback failed, salvage any question from pool to prevent crash
                val fallbackAny = eligiblePool.filter { it.id !in usedIds }.let { list ->
                    if (list.isNotEmpty()) list.random(random) else null
                } ?: pool.filter { it.id !in usedIds }.let { list ->
                    if (list.isNotEmpty()) list.random(random) else null
                } ?: pool.randomOrNull(random)

                if (fallbackAny != null) {
                    selectedSession.add(fallbackAny)
                    usedIds.add(fallbackAny.id)
                }
            }
        }

        return selectedSession
    }

    private fun selectQuestionForSlot(
        eligiblePool: List<Question>,
        slot: SlotPlan,
        usedIds: Set<String>,
        recentlySeenIds: Set<String>,
        phaseCategories: Set<Category>,
        isExperienceCardAllowed: Boolean,
        random: Random
    ): Question? {
        val available = eligiblePool.filter { it.id !in usedIds }
        if (available.isEmpty()) return null

        // 1. If Experience Card is allowed for this Landing slot, attempt picking one first
        if (isExperienceCardAllowed) {
            val ecCandidates = available.filter { it.isExperienceCard && it.id !in recentlySeenIds }
                .ifEmpty { available.filter { it.isExperienceCard } }

            if (ecCandidates.isNotEmpty()) {
                return ecCandidates.random(random)
            }
        }

        // Standard questions (exclude experience cards from standard slots)
        val standardAvailable = available.filter { !it.isExperienceCard }
        val poolToUse = standardAvailable.ifEmpty { available }

        // Pass 1: exact depth match, allowed category match
        val exactDepthAndCategory = poolToUse.filter { q ->
            q.depth in slot.depthRange && (slot.allowedCategories == null || q.category in slot.allowedCategories)
        }

        if (exactDepthAndCategory.isNotEmpty()) {
            val unseen = exactDepthAndCategory.filter { it.id !in recentlySeenIds }
            val candidates = if (unseen.isNotEmpty()) unseen else exactDepthAndCategory
            val weighted = candidates.map { q ->
                val isUnseen = q.id !in recentlySeenIds
                val isNewCategory = q.category !in phaseCategories
                val weight = when {
                    isUnseen && isNewCategory -> 1.0
                    isUnseen -> 0.7
                    isNewCategory -> 0.3
                    else -> 0.1
                }
                q to weight
            }
            val picked = weightedPick(weighted, random)
            if (picked != null) return picked
        }

        // Pass 2 (thin pool fallback): exact depth match, relax allowedCategories constraint
        val exactDepthPool = poolToUse.filter { q -> q.depth in slot.depthRange }
        if (exactDepthPool.isNotEmpty()) {
            val unseen = exactDepthPool.filter { it.id !in recentlySeenIds }
            val candidates = if (unseen.isNotEmpty()) unseen else exactDepthPool
            val weighted = candidates.map { q ->
                val isUnseen = q.id !in recentlySeenIds
                val weight = if (isUnseen) 1.0 else 0.3
                q to weight
            }
            val picked = weightedPick(weighted, random)
            if (picked != null) return picked
        }

        // Pass 3 (extreme thin pool fallback): find closest depth available
        val targetDepth = slot.targetDepth ?: slot.depthRange.first
        val minDiff = poolToUse.minOfOrNull { abs(it.depth - targetDepth) } ?: 0
        val closestCandidates = poolToUse.filter { abs(it.depth - targetDepth) == minDiff }
        val unseen = closestCandidates.filter { it.id !in recentlySeenIds }
        val candidates = if (unseen.isNotEmpty()) unseen else closestCandidates
        return candidates.randomOrNull(random)
    }

    /**
     * Swaps a question in an active session according to the given action:
     * - PASS: same phase and depth, different question.
     * - LIGHTER: one depth level lower (minimum 1).
     * - DEEPER: one depth level higher (maximum config.maxDepth).
     */
    fun swap(
        session: List<Question>,
        index: Int,
        action: SwapAction,
        pool: List<Question>,
        relationshipType: RelationshipType? = null,
        recentlySeenIds: Set<String> = emptySet(),
        includeDrafts: Boolean = false,
        random: Random = Random(System.nanoTime())
    ): SwapResult {
        require(index in session.indices) { "Index $index out of bounds for session of size ${session.size}" }

        val currentQuestion = session[index]
        val currentSessionIds = session.map { it.id }.toSet()

        val inferredRelationshipType = relationshipType ?: currentQuestion.relationshipTypes.first()
        val config = RelationshipTypeRegistry.getConfig(inferredRelationshipType)

        val eligiblePool = pool.filter { q ->
            inferredRelationshipType in q.relationshipTypes &&
                (includeDrafts || q.status == QuestionStatus.APPROVED) &&
                q.id !in currentSessionIds &&
                !q.isExperienceCard
        }

        val targetDepth = when (action) {
            SwapAction.PASS -> currentQuestion.depth
            SwapAction.LIGHTER -> (currentQuestion.depth - 1).coerceAtLeast(1)
            SwapAction.DEEPER -> (currentQuestion.depth + 1).coerceAtMost(config.maxDepth)
        }

        val slots = config.getSlots(if (session.size >= 10) SessionLength.DEEP else SessionLength.SESSION)
        val slotPlan = slots.getOrNull(index)

        val replacement = selectSwapCandidate(
            available = eligiblePool,
            targetDepth = targetDepth,
            slotPlan = slotPlan,
            action = action,
            recentlySeenIds = recentlySeenIds,
            neighborCategories = setOfNotNull(
                session.getOrNull(index - 1)?.category,
                session.getOrNull(index + 1)?.category
            ),
            random = random
        ) ?: pool.filter { it.id !in currentSessionIds }.minByOrNull { abs(it.depth - targetDepth) }
        ?: currentQuestion

        val updatedSession = session.toMutableList().apply {
            set(index, replacement)
        }

        val needsHandshake = config.handshakeEnabled && replacement.needsHandshake

        return SwapResult(
            newQuestion = replacement,
            needsHandshake = needsHandshake,
            updatedSession = updatedSession
        )
    }

    private fun selectSwapCandidate(
        available: List<Question>,
        targetDepth: Int,
        slotPlan: SlotPlan?,
        action: SwapAction,
        recentlySeenIds: Set<String>,
        neighborCategories: Set<Category>,
        random: Random
    ): Question? {
        if (available.isEmpty()) return null

        val isLandingPass = action == SwapAction.PASS && slotPlan?.phase == ArcPhase.LANDING
        val categoryFilter: (Question) -> Boolean = { q ->
            if (isLandingPass && slotPlan?.allowedCategories != null) {
                q.category in slotPlan.allowedCategories
            } else true
        }

        val exactDepthPool = available.filter { it.depth == targetDepth && categoryFilter(it) }

        if (exactDepthPool.isNotEmpty()) {
            val weighted = exactDepthPool.map { q ->
                val isUnseen = q.id !in recentlySeenIds
                val isDiffCat = q.category !in neighborCategories
                val weight = when {
                    isUnseen && isDiffCat -> 1.0
                    isUnseen -> 0.8
                    isDiffCat -> 0.4
                    else -> 0.2
                }
                q to weight
            }
            return weightedPick(weighted, random)
        }

        // If landing pass couldn't find landing category at exact depth, relax category
        val relaxedCategory = available.filter { it.depth == targetDepth }
        if (relaxedCategory.isNotEmpty()) {
            val weighted = relaxedCategory.map { q ->
                val isUnseen = q.id !in recentlySeenIds
                q to (if (isUnseen) 1.0 else 0.3)
            }
            return weightedPick(weighted, random)
        }

        // Closest depth fallback
        val minDiff = available.minOfOrNull { abs(it.depth - targetDepth) } ?: 0
        val closest = available.filter { abs(it.depth - targetDepth) == minDiff }
        return closest.randomOrNull(random)
    }
}

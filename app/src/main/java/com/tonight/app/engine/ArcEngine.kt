package com.tonight.app.engine

import kotlin.math.abs

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
            type in it.relationshipTypes && it.status == QuestionStatus.APPROVED
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
     * Builds an ordered list of questions for a session following the prescribed emotional arc.
     * Guarantees:
     * - Exact phase count matching the session length.
     * - No duplicates in the session (unless total pool has fewer items than session size).
     * - Filters for relationship type and status (approved only unless includeDrafts is true).
     * - Prioritizes questions not in recentlySeenIds.
     * - Varies categories within each phase.
     * - Graceful fallback when pools are thin.
     */
    fun buildSession(
        pool: List<Question>,
        relationshipType: RelationshipType,
        length: SessionLength,
        recentlySeenIds: Set<String> = emptySet(),
        includeDrafts: Boolean = false
    ): List<Question> {
        val eligiblePool = pool.filter { q ->
            relationshipType in q.relationshipTypes && (includeDrafts || q.status == QuestionStatus.APPROVED)
        }

        val slots = getSlots(relationshipType, length)
        val selectedSession = mutableListOf<Question>()
        val usedIds = mutableSetOf<String>()

        var currentPhase: ArcPhase? = null
        val phaseCategories = mutableSetOf<Category>()

        for (slot in slots) {
            if (slot.phase != currentPhase) {
                currentPhase = slot.phase
                phaseCategories.clear()
            }

            val question = selectQuestionForSlot(
                eligiblePool = eligiblePool,
                slot = slot,
                usedIds = usedIds,
                recentlySeenIds = recentlySeenIds,
                phaseCategories = phaseCategories
            )

            if (question != null) {
                selectedSession.add(question)
                usedIds.add(question.id)
                phaseCategories.add(question.category)
            } else {
                // If even fallback failed, salvage any question from pool to prevent crash
                val fallbackAny = eligiblePool.firstOrNull { it.id !in usedIds }
                    ?: pool.firstOrNull { it.id !in usedIds }
                    ?: pool.firstOrNull()

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
        phaseCategories: Set<Category>
    ): Question? {
        val available = eligiblePool.filter { it.id !in usedIds }
        if (available.isEmpty()) return null

        // Pass 1: exact depth match, allowed category match, unseen, new category for this phase
        val pass1 = available.filter { q ->
            q.depth in slot.depthRange &&
                (slot.allowedCategories == null || q.category in slot.allowedCategories) &&
                q.id !in recentlySeenIds &&
                q.category !in phaseCategories
        }
        if (pass1.isNotEmpty()) return pass1.shuffled().first()

        // Pass 2: exact depth, allowed category, unseen, but allow recurring category in phase
        val pass2 = available.filter { q ->
            q.depth in slot.depthRange &&
                (slot.allowedCategories == null || q.category in slot.allowedCategories) &&
                q.id !in recentlySeenIds
        }
        if (pass2.isNotEmpty()) return pass2.shuffled().first()

        // Pass 3: exact depth, allowed category, but allow seen questions (still unused in this session)
        val pass3 = available.filter { q ->
            q.depth in slot.depthRange &&
                (slot.allowedCategories == null || q.category in slot.allowedCategories)
        }
        if (pass3.isNotEmpty()) {
            // Prefer questions with new category in phase if possible
            val withNewCategory = pass3.filter { it.category !in phaseCategories }
            return (withNewCategory.ifEmpty { pass3 }).shuffled().first()
        }

        // Pass 4 (thin pool fallback): exact depth match, relax allowedCategories constraint
        val pass4 = available.filter { q -> q.depth in slot.depthRange }
        if (pass4.isNotEmpty()) {
            val unseen = pass4.filter { it.id !in recentlySeenIds }
            return (unseen.ifEmpty { pass4 }).shuffled().first()
        }

        // Pass 5 (extreme thin pool fallback): find closest depth available
        val targetDepth = slot.targetDepth ?: slot.depthRange.first
        return available.minByOrNull { abs(it.depth - targetDepth) }
    }

    /**
     * Swaps a question in an active session according to the given action:
     * - PASS: same phase and depth, different question.
     * - LIGHTER: one depth level lower (minimum 1).
     * - DEEPER: one depth level higher (maximum config.maxDepth).
     *
     * Invariants:
     * - Never repeats any question currently in the session.
     * - Never produces handshake for types where handshakeEnabled is false.
     * - Returns SwapResult containing the new question, whether it needs a handshake, and updated session.
     */
    fun swap(
        session: List<Question>,
        index: Int,
        action: SwapAction,
        pool: List<Question>,
        relationshipType: RelationshipType? = null,
        recentlySeenIds: Set<String> = emptySet(),
        includeDrafts: Boolean = false
    ): SwapResult {
        require(index in session.indices) { "Index $index out of bounds for session of size ${session.size}" }

        val currentQuestion = session[index]
        val currentSessionIds = session.map { it.id }.toSet()

        val inferredRelationshipType = relationshipType ?: currentQuestion.relationshipTypes.first()
        val config = RelationshipTypeRegistry.getConfig(inferredRelationshipType)

        val eligiblePool = pool.filter { q ->
            inferredRelationshipType in q.relationshipTypes &&
                (includeDrafts || q.status == QuestionStatus.APPROVED) &&
                q.id !in currentSessionIds
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
            )
        ) ?: pool.filter { it.id !in currentSessionIds }.minByOrNull { abs(it.depth - targetDepth) }
        ?: currentQuestion // Absolute fallback if pool has zero other questions

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
        neighborCategories: Set<Category>
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
            // 1. Unseen, different category than neighbors
            val best = exactDepthPool.filter { it.id !in recentlySeenIds && it.category !in neighborCategories }
            if (best.isNotEmpty()) return best.shuffled().first()

            // 2. Unseen
            val unseen = exactDepthPool.filter { it.id !in recentlySeenIds }
            if (unseen.isNotEmpty()) return unseen.shuffled().first()

            // 3. Seen, but different category
            val seenDifferentCat = exactDepthPool.filter { it.category !in neighborCategories }
            if (seenDifferentCat.isNotEmpty()) return seenDifferentCat.shuffled().first()

            return exactDepthPool.shuffled().first()
        }

        // If landing pass couldn't find landing category at exact depth, relax category
        val relaxedCategory = available.filter { it.depth == targetDepth }
        if (relaxedCategory.isNotEmpty()) {
            val unseen = relaxedCategory.filter { it.id !in recentlySeenIds }
            return (unseen.ifEmpty { relaxedCategory }).shuffled().first()
        }

        // Closest depth fallback
        return available.minByOrNull { abs(it.depth - targetDepth) }
    }
}

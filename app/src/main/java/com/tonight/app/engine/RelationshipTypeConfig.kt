package com.tonight.app.engine

enum class EngineClosingStep {
    LANDING_QUESTION,
    APPRECIATION_PERSON_A,
    APPRECIATION_PERSON_B,
    APPRECIATION_REVEAL,
    SAVE_MOMENT,
    SESSION_SUMMARY
}

data class PhasePlan(
    val phase: ArcPhase,
    val key: String,
    val allowedDepths: Set<Int>,
    val slots: List<SlotPlan>
)

data class ArcPlan(
    val length: SessionLength,
    val phases: List<PhasePlan>
) {
    val slots: List<SlotPlan> = phases.flatMap { it.slots }
}

data class RelationshipTypeConfig(
    val type: RelationshipType,
    val maxDepth: Int,
    val handshakeEnabled: Boolean,
    val arcs: Map<SessionLength, ArcPlan>,
    val closingSteps: List<EngineClosingStep>,
    val showNextTimeLabel: Boolean
) {
    fun getSlots(length: SessionLength): List<SlotPlan> =
        arcs[length]?.slots ?: emptyList()

    fun getPhases(length: SessionLength): List<PhasePlan> =
        arcs[length]?.phases ?: emptyList()
}

object RelationshipTypeRegistry {

    private val COUPLE_5MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = listOf(SlotPlan(ArcPhase.WARMUP, targetDepth = 1))
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = listOf(SlotPlan(ArcPhase.OPENING, targetDepth = 2))
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = listOf(
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(2, 3),
            slots = listOf(
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 2..3,
                    allowedCategories = setOf(Category.GRATITUDE, Category.US)
                )
            )
        )
    )

    private val COUPLE_10MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = listOf(
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1)
            )
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = listOf(
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2)
            )
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = listOf(
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3)
            )
        ),
        PhasePlan(
            phase = ArcPhase.PEAK,
            key = "peak",
            allowedDepths = setOf(4, 5),
            slots = listOf(
                SlotPlan(ArcPhase.PEAK, targetDepth = 4),
                SlotPlan(ArcPhase.PEAK, targetDepth = 5)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(2, 3),
            slots = listOf(
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 2..3,
                    allowedCategories = setOf(Category.GRATITUDE, Category.US)
                )
            )
        )
    )

    private val COUPLE_15MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = listOf(
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1)
            )
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = listOf(
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2)
            )
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = listOf(
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3)
            )
        ),
        PhasePlan(
            phase = ArcPhase.PEAK,
            key = "peak",
            allowedDepths = setOf(4, 5),
            slots = listOf(
                SlotPlan(ArcPhase.PEAK, targetDepth = 4),
                SlotPlan(ArcPhase.PEAK, targetDepth = 5)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(2, 3),
            slots = listOf(
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 2..3,
                    allowedCategories = setOf(Category.GRATITUDE, Category.US)
                ),
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 2..3,
                    allowedCategories = setOf(Category.GRATITUDE, Category.US)
                )
            )
        )
    )

    private val COUPLE_30MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = (1..5).map { SlotPlan(ArcPhase.WARMUP, targetDepth = 1) }
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = (1..6).map { SlotPlan(ArcPhase.OPENING, targetDepth = 2) }
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = (1..11).map { SlotPlan(ArcPhase.DEEPENING, targetDepth = 3) }
        ),
        PhasePlan(
            phase = ArcPhase.PEAK,
            key = "peak",
            allowedDepths = setOf(4, 5),
            slots = listOf(
                SlotPlan(ArcPhase.PEAK, targetDepth = 4),
                SlotPlan(ArcPhase.PEAK, targetDepth = 4),
                SlotPlan(ArcPhase.PEAK, targetDepth = 5),
                SlotPlan(ArcPhase.PEAK, targetDepth = 5)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(2, 3),
            slots = (1..4).map {
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 2..3,
                    allowedCategories = setOf(Category.GRATITUDE, Category.US)
                )
            }
        )
    )

    private val JUST_MET_5MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = listOf(
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1)
            )
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = listOf(
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(1, 2),
            slots = listOf(
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 1..2
                )
            )
        )
    )

    private val JUST_MET_10MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = listOf(
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1),
                SlotPlan(ArcPhase.WARMUP, targetDepth = 1)
            )
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = listOf(
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2),
                SlotPlan(ArcPhase.OPENING, targetDepth = 2)
            )
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = listOf(
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3),
                SlotPlan(ArcPhase.DEEPENING, targetDepth = 3)
            )
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(1, 2),
            slots = listOf(
                SlotPlan(
                    phase = ArcPhase.LANDING,
                    targetDepth = null,
                    depthRange = 1..2
                )
            )
        )
    )

    private val JUST_MET_15MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = (1..5).map { SlotPlan(ArcPhase.WARMUP, targetDepth = 1) }
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = (1..5).map { SlotPlan(ArcPhase.OPENING, targetDepth = 2) }
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = (1..3).map { SlotPlan(ArcPhase.DEEPENING, targetDepth = 3) }
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(1, 2),
            slots = listOf(
                SlotPlan(phase = ArcPhase.LANDING, targetDepth = null, depthRange = 1..2),
                SlotPlan(phase = ArcPhase.LANDING, targetDepth = null, depthRange = 1..2)
            )
        )
    )

    private val JUST_MET_30MIN_PHASES = listOf(
        PhasePlan(
            phase = ArcPhase.WARMUP,
            key = "warmup",
            allowedDepths = setOf(1),
            slots = (1..10).map { SlotPlan(ArcPhase.WARMUP, targetDepth = 1) }
        ),
        PhasePlan(
            phase = ArcPhase.OPENING,
            key = "opening",
            allowedDepths = setOf(2),
            slots = (1..10).map { SlotPlan(ArcPhase.OPENING, targetDepth = 2) }
        ),
        PhasePlan(
            phase = ArcPhase.DEEPENING,
            key = "deepening",
            allowedDepths = setOf(3),
            slots = (1..6).map { SlotPlan(ArcPhase.DEEPENING, targetDepth = 3) }
        ),
        PhasePlan(
            phase = ArcPhase.LANDING,
            key = "landing",
            allowedDepths = setOf(1, 2),
            slots = (1..4).map {
                SlotPlan(phase = ArcPhase.LANDING, targetDepth = null, depthRange = 1..2)
            }
        )
    )

    private val STANDARD_CLOSING_STEPS = listOf(
        EngineClosingStep.LANDING_QUESTION,
        EngineClosingStep.APPRECIATION_PERSON_A,
        EngineClosingStep.APPRECIATION_PERSON_B,
        EngineClosingStep.APPRECIATION_REVEAL,
        EngineClosingStep.SAVE_MOMENT,
        EngineClosingStep.SESSION_SUMMARY
    )

    private val JUST_MET_CLOSING_STEPS = listOf(
        EngineClosingStep.LANDING_QUESTION,
        EngineClosingStep.SAVE_MOMENT,
        EngineClosingStep.SESSION_SUMMARY
    )

    val COUPLE_CONFIG = RelationshipTypeConfig(
        type = RelationshipType.COUPLE,
        maxDepth = 5,
        handshakeEnabled = true,
        arcs = mapOf(
            SessionLength.FIVE_MIN to ArcPlan(SessionLength.FIVE_MIN, COUPLE_5MIN_PHASES),
            SessionLength.TEN_MIN to ArcPlan(SessionLength.TEN_MIN, COUPLE_10MIN_PHASES),
            SessionLength.FIFTEEN_MIN to ArcPlan(SessionLength.FIFTEEN_MIN, COUPLE_15MIN_PHASES),
            SessionLength.THIRTY_MIN to ArcPlan(SessionLength.THIRTY_MIN, COUPLE_30MIN_PHASES),
            SessionLength.SESSION to ArcPlan(SessionLength.SESSION, COUPLE_15MIN_PHASES),
            SessionLength.DEEP to ArcPlan(SessionLength.DEEP, COUPLE_30MIN_PHASES)
        ),
        closingSteps = STANDARD_CLOSING_STEPS,
        showNextTimeLabel = true
    )

    val FRIEND_CONFIG = RelationshipTypeConfig(
        type = RelationshipType.FRIEND,
        maxDepth = 5,
        handshakeEnabled = true,
        arcs = mapOf(
            SessionLength.FIVE_MIN to ArcPlan(SessionLength.FIVE_MIN, COUPLE_5MIN_PHASES),
            SessionLength.TEN_MIN to ArcPlan(SessionLength.TEN_MIN, COUPLE_10MIN_PHASES),
            SessionLength.FIFTEEN_MIN to ArcPlan(SessionLength.FIFTEEN_MIN, COUPLE_15MIN_PHASES),
            SessionLength.THIRTY_MIN to ArcPlan(SessionLength.THIRTY_MIN, COUPLE_30MIN_PHASES),
            SessionLength.SESSION to ArcPlan(SessionLength.SESSION, COUPLE_15MIN_PHASES),
            SessionLength.DEEP to ArcPlan(SessionLength.DEEP, COUPLE_30MIN_PHASES)
        ),
        closingSteps = STANDARD_CLOSING_STEPS,
        showNextTimeLabel = true
    )

    val JUST_MET_CONFIG = RelationshipTypeConfig(
        type = RelationshipType.JUST_MET,
        maxDepth = 3,
        handshakeEnabled = false,
        arcs = mapOf(
            SessionLength.FIVE_MIN to ArcPlan(SessionLength.FIVE_MIN, JUST_MET_5MIN_PHASES),
            SessionLength.TEN_MIN to ArcPlan(SessionLength.TEN_MIN, JUST_MET_10MIN_PHASES),
            SessionLength.FIFTEEN_MIN to ArcPlan(SessionLength.FIFTEEN_MIN, JUST_MET_15MIN_PHASES),
            SessionLength.THIRTY_MIN to ArcPlan(SessionLength.THIRTY_MIN, JUST_MET_30MIN_PHASES),
            SessionLength.SESSION to ArcPlan(SessionLength.SESSION, JUST_MET_15MIN_PHASES),
            SessionLength.DEEP to ArcPlan(SessionLength.DEEP, JUST_MET_30MIN_PHASES)
        ),
        closingSteps = JUST_MET_CLOSING_STEPS,
        showNextTimeLabel = false
    )

    private val configs: Map<RelationshipType, RelationshipTypeConfig> = mapOf(
        RelationshipType.COUPLE to COUPLE_CONFIG,
        RelationshipType.FRIEND to FRIEND_CONFIG,
        RelationshipType.JUST_MET to JUST_MET_CONFIG
    )

    fun getConfig(type: RelationshipType): RelationshipTypeConfig =
        configs[type] ?: error("No configuration registered for relationship type: $type")

    fun getAllConfigs(): List<RelationshipTypeConfig> =
        RelationshipType.values().map { getConfig(it) }
}

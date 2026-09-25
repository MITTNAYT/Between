package com.tonight.app.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.File

class ArcEngineTest {

    private lateinit var testPool: List<Question>

    @Before
    fun setUp() {
        val categories = Category.values()
        val list = mutableListOf<Question>()
        var idCounter = 1

        for (depth in 1..5) {
            for (category in categories) {
                // Add 3 questions per (depth, category) combination
                repeat(3) {
                    val id = "q-${idCounter++}"
                    val types = if (depth <= 3) {
                        setOf(RelationshipType.COUPLE, RelationshipType.FRIEND, RelationshipType.JUST_MET)
                    } else {
                        setOf(RelationshipType.COUPLE, RelationshipType.FRIEND)
                    }
                    list.add(
                        Question(
                            id = id,
                            text = "Question $id at depth $depth",
                            category = category,
                            depth = depth,
                            relationshipTypes = types,
                            followUps = listOf("Follow up 1?", "Follow up 2?"),
                            needsHandshake = depth >= 4,
                            status = QuestionStatus.APPROVED
                        )
                    )
                }
            }
        }
        testPool = list
    }

    // =========================================================================
    // REGRESSION TESTS: COUPLE & FRIEND
    // =========================================================================

    @Test
    fun `buildSession for COUPLE SESSION length produces exactly 15 questions with 5-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        assertEquals("SESSION length must produce exactly 15 questions", 15, session.size)

        // Warmup: 3 questions (L1)
        assertEquals(1, session[0].depth)
        assertEquals(1, session[1].depth)
        assertEquals(1, session[2].depth)

        // Opening: 3 questions (L2)
        assertEquals(2, session[3].depth)
        assertEquals(2, session[4].depth)
        assertEquals(2, session[5].depth)

        // Deepening: 5 questions (L3)
        assertEquals(3, session[6].depth)
        assertEquals(3, session[7].depth)
        assertEquals(3, session[8].depth)
        assertEquals(3, session[9].depth)
        assertEquals(3, session[10].depth)

        // Peak: 2 questions (L4, L5)
        assertEquals(4, session[11].depth)
        assertEquals(5, session[12].depth)

        // Landing: 2 questions (L2-3, GRATITUDE or US)
        assertTrue(session[13].depth in 2..3)
        assertTrue(session[13].category in setOf(Category.GRATITUDE, Category.US))
        assertTrue(session[14].depth in 2..3)
        assertTrue(session[14].category in setOf(Category.GRATITUDE, Category.US))
    }

    @Test
    fun `buildSession for FRIEND DEEP length produces exactly 30 questions with 5-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.FRIEND,
            length = SessionLength.DEEP,
            includeDrafts = true
        )

        assertEquals("DEEP length must produce exactly 30 questions", 30, session.size)

        // Warmup: 5 (L1)
        (0..4).forEach { assertEquals(1, session[it].depth) }

        // Opening: 6 (L2)
        (5..10).forEach { assertEquals(2, session[it].depth) }

        // Deepening: 11 (L3)
        (11..21).forEach { assertEquals(3, session[it].depth) }

        // Peak: 4 (L4, L4, L5, L5)
        assertEquals(4, session[22].depth)
        assertEquals(4, session[23].depth)
        assertEquals(5, session[24].depth)
        assertEquals(5, session[25].depth)

        // Landing: 4 (L2-3, GRATITUDE or US)
        (26..29).forEach {
            assertTrue(session[it].depth in 2..3)
            assertTrue(session[it].category in setOf(Category.GRATITUDE, Category.US))
        }
    }

    @Test
    fun `buildSession for COUPLE 5MIN length produces exactly 5 questions with 4-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.FIVE_MIN,
            includeDrafts = true
        )

        assertEquals("5MIN length must produce exactly 5 questions", 5, session.size)
        assertEquals(1, session[0].depth)
        assertEquals(2, session[1].depth)
        assertEquals(3, session[2].depth)
        assertEquals(3, session[3].depth)
        assertTrue(session[4].depth in 2..3)
        assertTrue(session[4].category in setOf(Category.GRATITUDE, Category.US))
    }

    @Test
    fun `buildSession for COUPLE 10MIN length produces exactly 10 questions with 5-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.TEN_MIN,
            includeDrafts = true
        )

        assertEquals("10MIN length must produce exactly 10 questions", 10, session.size)
        assertEquals(1, session[0].depth)
        assertEquals(1, session[1].depth)
        assertEquals(2, session[2].depth)
        assertEquals(2, session[3].depth)
        assertEquals(3, session[4].depth)
        assertEquals(3, session[5].depth)
        assertEquals(3, session[6].depth)
        assertEquals(4, session[7].depth)
        assertEquals(5, session[8].depth)
        assertTrue(session[9].depth in 2..3)
        assertTrue(session[9].category in setOf(Category.GRATITUDE, Category.US))
    }
    // =========================================================================

    @Test
    fun `buildSession for JUST_MET SESSION produces exactly 15 questions across 4 phases, max depth 3, no handshake`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        assertEquals("JUST_MET SESSION must produce exactly 15 questions", 15, session.size)

        // Warm-up: 5 (depth 1)
        (0..4).forEach { assertEquals(1, session[it].depth) }

        // Opening up: 5 (depth 2)
        (5..9).forEach { assertEquals(2, session[it].depth) }

        // Going deeper: 3 (depth 3)
        (10..12).forEach { assertEquals(3, session[it].depth) }

        // Landing: 2 (depth 1-2)
        (13..14).forEach {
            assertTrue("Landing depth must be 1 or 2", session[it].depth in 1..2)
        }

        // All depths <= 3 and no handshakes
        session.forEach { q ->
            assertTrue("JUST_MET question depth must be <= 3", q.depth <= 3)
            assertFalse("JUST_MET question must never need handshake", q.needsHandshake)
        }
    }

    @Test
    fun `buildSession for JUST_MET DEEP produces exactly 30 questions across 4 phases, max depth 3, no handshake`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.DEEP,
            includeDrafts = true
        )

        assertEquals("JUST_MET DEEP must produce exactly 30 questions", 30, session.size)

        // Warm-up: 10 (depth 1)
        (0..9).forEach { assertEquals(1, session[it].depth) }

        // Opening up: 10 (depth 2)
        (10..19).forEach { assertEquals(2, session[it].depth) }

        // Going deeper: 6 (depth 3)
        (20..25).forEach { assertEquals(3, session[it].depth) }

        // Landing: 4 (depth 1-2)
        (26..29).forEach {
            assertTrue("Landing depth must be 1 or 2", session[it].depth in 1..2)
        }

        // All depths <= 3 and no handshakes
        session.forEach { q ->
            assertTrue("JUST_MET question depth must be <= 3", q.depth <= 3)
            assertFalse("JUST_MET question must never need handshake", q.needsHandshake)
        }
    }

    @Test
    fun `JUST_MET swap at max depth 3 stays at depth 3 and never produces handshake`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        // Slot 10 is depth 3
        assertEquals(3, session[10].depth)

        val result = ArcEngine.swap(
            session = session,
            index = 10,
            action = SwapAction.DEEPER,
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            includeDrafts = true
        )

        assertEquals(3, result.newQuestion.depth)
        assertFalse(result.needsHandshake)
    }

    @Test
    fun `buildSession never produces duplicate questions in a session`() {
        for (relType in RelationshipType.values()) {
            repeat(5) {
                val session = ArcEngine.buildSession(
                    pool = testPool,
                    relationshipType = relType,
                    length = SessionLength.DEEP,
                    includeDrafts = true
                )
                val uniqueIds = session.map { it.id }.toSet()
                assertEquals("All question IDs in a session must be unique for $relType", session.size, uniqueIds.size)
            }
        }
    }

    @Test
    fun `thin pool fallback builds session without crashing`() {
        val thinPool = listOf(
            Question(
                id = "thin-1",
                text = "Thin 1",
                category = Category.PLAY,
                depth = 1,
                relationshipTypes = setOf(RelationshipType.JUST_MET),
                followUps = listOf("Why?"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED
            ),
            Question(
                id = "thin-2",
                text = "Thin 2",
                category = Category.VALUES,
                depth = 2,
                relationshipTypes = setOf(RelationshipType.JUST_MET),
                followUps = listOf("When?"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED
            )
        )

        val session = ArcEngine.buildSession(
            pool = thinPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        assertEquals(15, session.size)
        session.forEach { assertNotNull(it) }
    }

    // =========================================================================
    // AVAILABILITY RULE & CONTENT COVERAGE
    // =========================================================================

    @Test
    fun `isTypeAvailable enforces 2x threshold for DEEP arc slots`() {
        // Ample pool should be available
        assertTrue(ArcEngine.isTypeAvailable(RelationshipType.COUPLE, testPool))
        assertTrue(ArcEngine.isTypeAvailable(RelationshipType.FRIEND, testPool))
        assertTrue(ArcEngine.isTypeAvailable(RelationshipType.JUST_MET, testPool))

        // Pool with only 1 depth-3 question should fail for JUST_MET (needs >= 6 for 3 slots)
        val scarcePool = listOf(
            Question(
                id = "s-1",
                text = "S1",
                category = Category.PLAY,
                depth = 1,
                relationshipTypes = setOf(RelationshipType.JUST_MET),
                followUps = listOf("Why?"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED
            )
        )
        assertFalse(ArcEngine.isTypeAvailable(RelationshipType.JUST_MET, scarcePool))
    }

    @Test
    fun `generate CONTENT_COVERAGE md report`() {
        val file = File("src/main/assets/questions.json")
        if (!file.exists()) return

        val jsonString = file.readText()
        val questions = com.tonight.app.content.ContentValidator.parseAndValidate(jsonString, isDebug = false)

        val sb = StringBuilder()
        sb.append("# Content Coverage Report\n\n")
        sb.append("| Relationship Type | UI Name | Max Depth | Phase Count | L1 Pool (Req) | L2 Pool (Req) | L3 Pool (Req) | L4 Pool (Req) | L5 Pool (Req) | Available in Release? |\n")
        sb.append("|---|---|---|---|---|---|---|---|---|---|\n")

        for (type in RelationshipType.values()) {
            val config = ArcEngine.getConfig(type)
            val deepSlots = config.getSlots(SessionLength.DEEP)
            val phases = config.getPhases(SessionLength.DEEP)
            val approved = questions.filter { type in it.relationshipTypes && it.status == QuestionStatus.APPROVED }

            fun countDepth(d: Int) = approved.count { it.depth == d }
            fun reqDepth(d: Int): Int {
                val slots = deepSlots.count { it.targetDepth == d || (it.targetDepth == null && d in it.depthRange) }
                return slots * 2
            }

            val l1 = "${countDepth(1)} (${reqDepth(1)})"
            val l2 = "${countDepth(2)} (${reqDepth(2)})"
            val l3 = "${countDepth(3)} (${reqDepth(3)})"
            val l4 = if (config.maxDepth >= 4) "${countDepth(4)} (${reqDepth(4)})" else "N/A"
            val l5 = if (config.maxDepth >= 5) "${countDepth(5)} (${reqDepth(5)})" else "N/A"

            val uiName = when (type) {
                RelationshipType.COUPLE -> "Partner"
                RelationshipType.FRIEND -> "Friend"
                RelationshipType.JUST_MET -> "Someone new"
            }

            val isAvailable = ArcEngine.isTypeAvailable(type, questions)

            sb.append("| ${type.name} | $uiName | ${config.maxDepth} | ${phases.size} | $l1 | $l2 | $l3 | $l4 | $l5 | ${if (isAvailable) "YES" else "NO"} |\n")
        }

        val coverageFile = File("../CONTENT_COVERAGE.md")
        coverageFile.writeText(sb.toString())
        println(sb.toString())
    }

    @Test
    fun `engine package has zero android imports`() {
        val engineClasses = listOf(
            Question::class.java,
            Category::class.java,
            RelationshipType::class.java,
            SessionLength::class.java,
            QuestionStatus::class.java,
            SwapAction::class.java,
            ArcEngine::class.java,
            RelationshipTypeConfig::class.java,
            RelationshipTypeRegistry::class.java
        )

        for (clazz in engineClasses) {
            val packageName = clazz.`package`?.name ?: ""
            assertTrue(packageName.startsWith("com.tonight.app.engine"))

            for (method in clazz.declaredMethods) {
                assertFalse(
                    "Method ${method.name} in ${clazz.simpleName} references android.* type",
                    method.returnType.name.startsWith("android.")
                )
                for (param in method.parameterTypes) {
                    assertFalse(
                        "Method ${method.name} in ${clazz.simpleName} accepts android.* type",
                        param.name.startsWith("android.")
                    )
                }
            }
        }
    }
    @Test
    fun `buildSession 200 runs with unchanged history produces variety with less than 5 percent duplicate sequences`() {
        val runs = 200
        val sequences = mutableListOf<List<String>>()

        repeat(runs) {
            val session = ArcEngine.buildSession(
                pool = testPool,
                relationshipType = RelationshipType.COUPLE,
                length = SessionLength.SESSION,
                recentlySeenIds = emptySet(),
                includeDrafts = true
            )
            sequences.add(session.map { it.id })
        }

        val totalDuplicates = sequences.size - sequences.distinct().size
        val duplicateRate = totalDuplicates.toDouble() / runs.toDouble()

        println("200-Run Variety Test: totalDuplicates=$totalDuplicates, duplicateRate=${duplicateRate * 100}%")
        assertTrue("Duplication rate must be less than 5% (was ${duplicateRate * 100}%)", duplicateRate < 0.05)
        assertNotEquals("Sequences must not all be identical", 1, sequences.distinct().size)
    }

    @Test
    fun `buildSession DEEP with experience cards substitutes landing question approximately 40 percent of the time`() {
        val poolWithExpCard = testPool.toMutableList()
        poolWithExpCard.add(
            Question(
                id = "ec-test-1",
                text = "Experience Card Test",
                category = Category.US,
                depth = 3,
                relationshipTypes = setOf(RelationshipType.COUPLE, RelationshipType.FRIEND),
                followUps = listOf("F1", "F2"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED,
                isExperienceCard = true
            )
        )

        var expCardCount = 0
        val iterations = 500
        repeat(iterations) {
            val session = ArcEngine.buildSession(
                pool = poolWithExpCard,
                relationshipType = RelationshipType.COUPLE,
                length = SessionLength.DEEP,
                includeDrafts = true
            )
            val landingQuestion = session.last()
            if (landingQuestion.isExperienceCard) {
                expCardCount++
            }
        }

        val substitutionRate = expCardCount.toDouble() / iterations.toDouble()
        println("Experience Card Substitution Rate: ${substitutionRate * 100}% (expected ~40%)")
        assertTrue("Substitution rate should be between 25% and 55%", substitutionRate in 0.25..0.55)
    }

    @Test
    fun `FollowUpEngine combines tailored prompts and generic prompts capped at 3`() {
        val q = Question(
            id = "q-test",
            text = "Test Question",
            category = Category.IDENTITY,
            depth = 2,
            relationshipTypes = setOf(RelationshipType.COUPLE),
            followUps = listOf("Tailored 1", "Tailored 2"),
            needsHandshake = false,
            status = QuestionStatus.APPROVED
        )

        val genericBank = mapOf(
            "REFLECTION" to listOf("Generic Reflection 1", "Generic Reflection 2"),
            "MEANING" to listOf("Generic Meaning 1")
        )

        val result = com.tonight.app.content.FollowUpEngine.buildFollowUpsForQuestion(
            question = q,
            genericBank = genericBank
        )

        assertEquals(3, result.size)
        assertTrue(result.contains("Tailored 1"))
        assertTrue(result.contains("Tailored 2"))
        assertTrue(result.any { it.startsWith("Generic") })
    }
}

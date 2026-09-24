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
    fun `buildSession for COUPLE SESSION length produces exactly 6 questions with 5-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        assertEquals("SESSION length must produce exactly 6 questions", 6, session.size)

        // Warmup: 1 question (L1)
        assertEquals(1, session[0].depth)

        // Opening: 1 question (L2)
        assertEquals(2, session[1].depth)

        // Deepening: 2 questions (L3)
        assertEquals(3, session[2].depth)
        assertEquals(3, session[3].depth)

        // Peak: 1 question (L4)
        assertEquals(4, session[4].depth)

        // Landing: 1 question (L2-3, GRATITUDE or US)
        assertTrue(session[5].depth in 2..3)
        assertTrue(session[5].category in setOf(Category.GRATITUDE, Category.US))
    }

    @Test
    fun `buildSession for FRIEND DEEP length produces exactly 10 questions with 5-phase arc`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.FRIEND,
            length = SessionLength.DEEP,
            includeDrafts = true
        )

        assertEquals("DEEP length must produce exactly 10 questions", 10, session.size)

        // Warmup: 2 (L1)
        assertEquals(1, session[0].depth)
        assertEquals(1, session[1].depth)

        // Opening: 2 (L2)
        assertEquals(2, session[2].depth)
        assertEquals(2, session[3].depth)

        // Deepening: 3 (L3)
        assertEquals(3, session[4].depth)
        assertEquals(3, session[5].depth)
        assertEquals(3, session[6].depth)

        // Peak: 2 (L4 then L5)
        assertEquals(4, session[7].depth)
        assertEquals(5, session[8].depth)

        // Landing: 1 (L2-3, GRATITUDE or US)
        assertTrue(session[9].depth in 2..3)
        assertTrue(session[9].category in setOf(Category.GRATITUDE, Category.US))
    }

    // =========================================================================
    // NEW RELATIONSHIP TYPE: JUST_MET
    // =========================================================================

    @Test
    fun `buildSession for JUST_MET SESSION produces exactly 6 questions across 4 phases, max depth 3, no handshake`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.SESSION,
            includeDrafts = true
        )

        assertEquals("JUST_MET SESSION must produce exactly 6 questions", 6, session.size)

        // Warm-up: 2 (depth 1)
        assertEquals(1, session[0].depth)
        assertEquals(1, session[1].depth)

        // Opening up: 2 (depth 2)
        assertEquals(2, session[2].depth)
        assertEquals(2, session[3].depth)

        // Going deeper: 1 (depth 3)
        assertEquals(3, session[4].depth)

        // Landing: 1 (depth 1-2, ends light)
        assertTrue("Landing depth must be 1 or 2", session[5].depth in 1..2)

        // All depths <= 3 and no handshakes
        session.forEach { q ->
            assertTrue("JUST_MET question depth must be <= 3", q.depth <= 3)
            assertFalse("JUST_MET question must never need handshake", q.needsHandshake)
        }
    }

    @Test
    fun `buildSession for JUST_MET DEEP produces exactly 10 questions across 4 phases, max depth 3, no handshake`() {
        val session = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.JUST_MET,
            length = SessionLength.DEEP,
            includeDrafts = true
        )

        assertEquals("JUST_MET DEEP must produce exactly 10 questions", 10, session.size)

        // Warm-up: 3 (depth 1)
        assertEquals(1, session[0].depth)
        assertEquals(1, session[1].depth)
        assertEquals(1, session[2].depth)

        // Opening up: 3 (depth 2)
        assertEquals(2, session[3].depth)
        assertEquals(2, session[4].depth)
        assertEquals(2, session[5].depth)

        // Going deeper: 3 (depth 3)
        assertEquals(3, session[6].depth)
        assertEquals(3, session[7].depth)
        assertEquals(3, session[8].depth)

        // Landing: 1 (depth 1-2)
        assertTrue("Landing depth must be 1 or 2", session[9].depth in 1..2)

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

        // Slot 4 is depth 3
        assertEquals(3, session[4].depth)

        val result = ArcEngine.swap(
            session = session,
            index = 4,
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

        assertEquals(6, session.size)
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
}

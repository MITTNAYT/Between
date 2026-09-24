package com.tonight.app.data

import com.tonight.app.engine.ArcEngine
import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class SessionHistoryTest {

    private lateinit var testPool: List<Question>
    private lateinit var fakeHistoryRepository: SessionHistoryRepository

    @Before
    fun setUp() {
        val list = mutableListOf<Question>()
        var idCounter = 1

        // Build a pool of 6 questions per (depth 1..5, 10 categories) = 300 questions
        for (depth in 1..5) {
            for (category in Category.values()) {
                repeat(6) {
                    val id = "q-$idCounter"
                    idCounter++
                    list.add(
                        Question(
                            id = id,
                            text = "Question $id at depth $depth",
                            category = category,
                            depth = depth,
                            relationshipTypes = setOf(RelationshipType.COUPLE, RelationshipType.FRIEND),
                            followUps = listOf("Follow up 1?"),
                            needsHandshake = depth >= 4,
                            status = QuestionStatus.APPROVED
                        )
                    )
                }
            }
        }
        testPool = list

        // In-memory fake history repository
        fakeHistoryRepository = object : SessionHistoryRepository {
            private val history = mutableListOf<SeenQuestion>()

            override suspend fun markSeen(questionIds: List<String>, timestamp: Long) {
                for (id in questionIds) {
                    history.removeAll { it.questionId == id }
                    history.add(0, SeenQuestion(questionId = id, lastSeenAt = timestamp))
                }
            }

            override suspend fun getRecentlySeen(limit: Int): List<String> {
                return history.take(limit).map { it.questionId }
            }
        }
    }

    @Test
    fun `getRecentlySeen reduces question repeats across consecutive sessions`() = runBlocking {
        // --- SESSION 1 ---
        val recentlySeenInitial = fakeHistoryRepository.getRecentlySeen(limit = 50).toSet()
        val session1 = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.SESSION,
            recentlySeenIds = recentlySeenInitial,
            includeDrafts = true
        )
        assertEquals(6, session1.size)

        // Mark questions from session 1 as seen
        fakeHistoryRepository.markSeen(session1.map { it.id })

        // --- SESSION 2 ---
        val recentlySeenAfterSession1 = fakeHistoryRepository.getRecentlySeen(limit = 50).toSet()
        assertEquals(6, recentlySeenAfterSession1.size)

        val session2 = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.SESSION,
            recentlySeenIds = recentlySeenAfterSession1,
            includeDrafts = true
        )
        assertEquals(6, session2.size)

        // Verify that feeding getRecentlySeen completely eliminated repeats across consecutive sessions
        val overlap = session2.map { it.id }.intersect(session1.map { it.id }.toSet())
        assertTrue(
            "Expected 0 repeats between consecutive sessions when ample pool exists, but had repeats: $overlap",
            overlap.isEmpty()
        )

        // Mark questions from session 2 as seen
        fakeHistoryRepository.markSeen(session2.map { it.id })

        // --- SESSION 3 ---
        val recentlySeenAfterSession2 = fakeHistoryRepository.getRecentlySeen(limit = 50).toSet()
        assertEquals(12, recentlySeenAfterSession2.size)

        val session3 = ArcEngine.buildSession(
            pool = testPool,
            relationshipType = RelationshipType.COUPLE,
            length = SessionLength.SESSION,
            recentlySeenIds = recentlySeenAfterSession2,
            includeDrafts = true
        )
        assertEquals(6, session3.size)

        val overlapWith1and2 = session3.map { it.id }.intersect(recentlySeenAfterSession2)
        assertTrue(
            "Expected 0 repeats with past 2 sessions, but had repeats: $overlapWith1and2",
            overlapWith1and2.isEmpty()
        )
    }
}

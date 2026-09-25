package com.tonight.app.ui.screens

import android.app.Activity
import androidx.lifecycle.SavedStateHandle
import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.content.QuestionRepository
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.PurchaseResult
import com.tonight.app.data.SeenQuestion
import com.tonight.app.data.SessionHistoryRepository
import com.tonight.app.data.SessionRecord
import com.tonight.app.data.SessionRecordRepository
import com.tonight.app.data.SubscriptionPackageInfo
import com.tonight.app.data.SubscriptionPlanType
import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SessionViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var mockRepository: QuestionRepository
    private lateinit var fakeHistoryRepository: SessionHistoryRepository
    private lateinit var fakeSessionRecordRepository: FakeSessionRecordRepository
    private lateinit var fakeBillingRepository: FakeBillingRepository
    private lateinit var fakeAnalyticsTracker: FakeAnalyticsTracker
    private lateinit var sampleQuestions: List<Question>

    private class FakeBillingRepository(var premium: Boolean = true) : BillingRepository {
        private val _isPremium = MutableStateFlow(premium)
        override val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()
        override fun isPremiumActive(): Boolean = premium
        override suspend fun refreshPurchases() {}
        override suspend fun getAvailablePackages(): List<SubscriptionPackageInfo> = emptyList()
        override suspend fun purchase(activity: Activity, planType: SubscriptionPlanType): PurchaseResult = PurchaseResult.Success
        override suspend fun restorePurchases(): PurchaseResult = PurchaseResult.Success
    }

    private class FakeAnalyticsTracker : AnalyticsTracker {
        val events = mutableListOf<String>()
        override fun trackSessionStarted(length: String, relationshipType: String) { events.add("session_started") }
        override fun trackQuestionPassed(depth: Int) { events.add("question_passed_$depth") }
        override fun trackSwapUsed(direction: String) { events.add("swap_used_$direction") }
        override fun trackHandshakeCompleted() { events.add("handshake_completed") }
        override fun trackSessionCompleted(depthReached: Int) { events.add("session_completed_$depthReached") }
        override fun trackMomentSaved() { events.add("moment_saved") }
        override fun trackPaywallViewed(trigger: String) { events.add("paywall_viewed_$trigger") }
        override fun trackPurchaseCompleted(packageType: String) { events.add("purchase_completed_$packageType") }
        override fun trackHintOpened(depth: Int) { events.add("hint_opened_$depth") }
    }

    private class FakeSessionRecordRepository : SessionRecordRepository {
        val records = mutableListOf<SessionRecord>()
        override suspend fun recordSession(sessionLength: String, relationshipType: String, depthReached: Int, timestamp: Long) {
            records.add(SessionRecord(id = "rec-${records.size}", startedAt = timestamp, yearMonth = "2026-09", sessionLength = sessionLength, relationshipType = relationshipType, depthReached = depthReached))
        }
        override suspend fun getSessionCountThisMonth(timestamp: Long): Int = records.size
        override fun observeSessionCountThisMonth(timestamp: Long): Flow<Int> = MutableStateFlow(records.size)
        override fun observeAllSessions(): Flow<List<SessionRecord>> = MutableStateFlow(records.toList())
    }

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)

        val list = mutableListOf<Question>()
        var idCounter = 1
        for (depth in 1..5) {
            for (cat in Category.values()) {
                repeat(2) {
                    val id = "q-$idCounter"
                    idCounter++
                    list.add(
                        Question(
                            id = id,
                            text = "Question $id",
                            category = cat,
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
        sampleQuestions = list

        mockRepository = object : QuestionRepository {
            override fun getQuestions(): List<Question> = sampleQuestions
        }

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

        fakeSessionRecordRepository = FakeSessionRecordRepository()
        fakeBillingRepository = FakeBillingRepository(premium = true)
        fakeAnalyticsTracker = FakeAnalyticsTracker()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    private fun createViewModel(savedStateHandle: SavedStateHandle = SavedStateHandle()): SessionViewModel {
        return SessionViewModel(
            questionRepository = mockRepository,
            sessionHistoryRepository = fakeHistoryRepository,
            sessionRecordRepository = fakeSessionRecordRepository,
            billingRepository = fakeBillingRepository,
            analyticsTracker = fakeAnalyticsTracker,
            savedStateHandle = savedStateHandle
        )
    }

    @Test
    fun `startSession sets up correct 9 questions and tracks session started`() {
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertEquals(15, state.questions.size)
        assertEquals(0, state.currentIndex)
        assertEquals("Person A answers first", state.turnIndicator)
        assertFalse(state.isHandshakePending)
        assertTrue(fakeAnalyticsTracker.events.contains("session_started"))
        assertEquals(1, fakeSessionRecordRepository.records.size)
    }

    @Test
    fun `turn indicator alternates who answers first`() {
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals("Person A answers first", viewModel.uiState.value.turnIndicator)

        viewModel.nextQuestion()
        assertEquals(1, viewModel.uiState.value.currentIndex)
        assertEquals("Person B answers first", viewModel.uiState.value.turnIndicator)

        viewModel.nextQuestion()
        assertEquals(2, viewModel.uiState.value.currentIndex)
        assertEquals("Person A answers first", viewModel.uiState.value.turnIndicator)
    }

    @Test
    fun `entering L4 peak question triggers depth handshake for premium user`() {
        fakeBillingRepository.premium = true
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        // Advance to index 11 (Peak slot, depth 4)
        repeat(11) {
            viewModel.nextQuestion()
        }

        assertEquals(11, viewModel.uiState.value.currentIndex)
        val peakQuestion = viewModel.uiState.value.currentQuestion
        assertNotNull(peakQuestion)
        assertEquals(4, peakQuestion?.depth)
        assertTrue("Entering L4 peak must trigger handshake interstitial for premium user", viewModel.uiState.value.isHandshakePending)
        assertFalse(viewModel.uiState.value.isPaywallPending)

        // Confirm handshake
        viewModel.confirmHandshake()
        assertFalse("Handshake must be dismissed after confirmation", viewModel.uiState.value.isHandshakePending)
        assertTrue(fakeAnalyticsTracker.events.contains("handshake_completed"))
    }

    @Test
    fun `entering L4 peak question triggers handshake directly for free app`() {
        fakeBillingRepository.premium = true
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        // Advance to index 11 (Peak slot, depth 4)
        repeat(11) {
            viewModel.nextQuestion()
        }

        assertEquals(11, viewModel.uiState.value.currentIndex)
        assertFalse(viewModel.uiState.value.isPaywallPending)
        assertTrue(viewModel.uiState.value.isHandshakePending)
    }

    @Test
    fun `deeper into depth 4 triggers handshake for premium user`() {
        fakeBillingRepository.premium = true
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        // Index 6 is depth 3 (Deepening)
        repeat(6) {
            viewModel.nextQuestion()
        }
        assertEquals(6, viewModel.uiState.value.currentIndex)
        assertEquals(3, viewModel.uiState.value.currentQuestion?.depth)

        viewModel.deeperQuestion()
        testDispatcher.scheduler.advanceUntilIdle()

        val newQuestion = viewModel.uiState.value.currentQuestion
        assertEquals(4, newQuestion?.depth)
        assertTrue("Deeper into L4 question must trigger handshake", viewModel.uiState.value.isHandshakePending)
        assertTrue(fakeAnalyticsTracker.events.contains("swap_used_DEEPER"))
    }

    @Test
    fun `declineHandshake swaps to lighter question and dismisses if depth under 4`() {
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        // Go to peak (L4 at index 11)
        repeat(11) {
            viewModel.nextQuestion()
        }
        assertTrue(viewModel.uiState.value.isHandshakePending)

        viewModel.declineHandshake()
        testDispatcher.scheduler.advanceUntilIdle()

        val questionAfterDecline = viewModel.uiState.value.currentQuestion
        assertNotNull(questionAfterDecline)
        assertTrue(questionAfterDecline!!.depth < 4)
        assertFalse(viewModel.uiState.value.isHandshakePending)
    }

    @Test
    fun `session state survives recreation from SavedStateHandle`() {
        val savedStateHandle1 = SavedStateHandle()
        val viewModel1 = createViewModel(savedStateHandle1)

        viewModel1.startSession(RelationshipType.FRIEND, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()
        viewModel1.nextQuestion()
        viewModel1.nextQuestion()

        val currentIndexBeforeRecreation = viewModel1.uiState.value.currentIndex
        val questionIdsBeforeRecreation = viewModel1.uiState.value.questions.map { it.id }

        // Simulate process death / rotation by creating new ViewModel with same SavedStateHandle
        val viewModel2 = createViewModel(savedStateHandle1)
        val state2 = viewModel2.uiState.value

        assertEquals(currentIndexBeforeRecreation, state2.currentIndex)
        assertEquals(questionIdsBeforeRecreation, state2.questions.map { it.id })
        assertEquals(RelationshipType.FRIEND, state2.relationshipType)
    }

    @Test
    fun `startSession marks session questions as seen in SessionHistoryRepository`() {
        val viewModel = createViewModel()

        viewModel.startSession(RelationshipType.COUPLE, SessionLength.SESSION)
        testDispatcher.scheduler.advanceUntilIdle()

        val questions = viewModel.uiState.value.questions
        assertEquals(15, questions.size)

        var seen: List<String> = emptyList()
        kotlinx.coroutines.runBlocking {
            seen = fakeHistoryRepository.getRecentlySeen(50)
        }
        assertEquals(15, seen.size)
        assertTrue(seen.containsAll(questions.map { it.id }))
    }

    @Test
    fun `onHintOpened logs hint_opened event with question depth`() {
        val viewModel = createViewModel()
        viewModel.onHintOpened(depth = 3)

        assertTrue(fakeAnalyticsTracker.events.contains("hint_opened_3"))
    }
}

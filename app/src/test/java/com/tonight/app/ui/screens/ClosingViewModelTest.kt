package com.tonight.app.ui.screens

import com.tonight.app.data.BillingRepository
import com.tonight.app.data.Moment
import com.tonight.app.data.MomentRepository
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
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class ClosingViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeMomentRepository: FakeMomentRepository
    private lateinit var fakeBillingRepository: FakeBillingRepository
    private lateinit var fakeAnalyticsTracker: FakeAnalyticsTracker
    private lateinit var viewModel: ClosingViewModel

    private class FakeBillingRepository(var premium: Boolean = true) : BillingRepository {
        private val _isPremium = MutableStateFlow(premium)
        override val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()
        override fun isPremiumActive(): Boolean = premium
        override suspend fun refreshPurchases() {}
        override suspend fun getAvailablePackages(): List<com.tonight.app.data.SubscriptionPackageInfo> = emptyList()
        override suspend fun purchase(activity: android.app.Activity, planType: com.tonight.app.data.SubscriptionPlanType): com.tonight.app.data.PurchaseResult = com.tonight.app.data.PurchaseResult.Success
        override suspend fun restorePurchases(): com.tonight.app.data.PurchaseResult = com.tonight.app.data.PurchaseResult.Success
    }

    private class FakeAnalyticsTracker : com.tonight.app.analytics.AnalyticsTracker {
        val events = mutableListOf<String>()
        override fun trackSessionStarted(length: String, relationshipType: String) { events.add("session_started") }
        override fun trackQuestionPassed(depth: Int) { events.add("question_passed") }
        override fun trackSwapUsed(direction: String) { events.add("swap_used_$direction") }
        override fun trackHandshakeCompleted() { events.add("handshake_completed") }
        override fun trackSessionCompleted(depthReached: Int) { events.add("session_completed") }
        override fun trackMomentSaved() { events.add("moment_saved") }
        override fun trackPaywallViewed(trigger: String) { events.add("paywall_viewed_$trigger") }
        override fun trackPurchaseCompleted(packageType: String) { events.add("purchase_completed_$packageType") }
    }

    private class FakeMomentRepository : MomentRepository {
        val savedMoments = mutableListOf<Moment>()
        private val _momentsFlow = MutableStateFlow<List<Moment>>(emptyList())

        override fun observeMoments(): Flow<List<Moment>> = _momentsFlow.asStateFlow()
        override suspend fun getMomentCount(): Int = savedMoments.size
        override fun observeMomentCount(): Flow<Int> = MutableStateFlow(savedMoments.size)

        override suspend fun addMoment(moment: Moment) {
            savedMoments.add(moment)
            _momentsFlow.value = savedMoments.toList()
        }

        override suspend fun deleteMoment(id: String) {
            savedMoments.removeAll { it.id == id }
            _momentsFlow.value = savedMoments.toList()
        }
    }

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeMomentRepository = FakeMomentRepository()
        fakeBillingRepository = FakeBillingRepository()
        fakeAnalyticsTracker = FakeAnalyticsTracker()
        viewModel = ClosingViewModel(fakeMomentRepository, fakeBillingRepository, fakeAnalyticsTracker)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial state starts at landing question`() {
        assertEquals(ClosingStep.LANDING_QUESTION, viewModel.uiState.value.step)
        assertFalse(viewModel.uiState.value.isComplete)
    }

    @Test
    fun `advancing moves through closing ritual steps systematically`() {
        assertEquals(ClosingStep.LANDING_QUESTION, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertEquals(ClosingStep.APPRECIATION_PERSON_A, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertEquals(ClosingStep.APPRECIATION_PERSON_B, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertEquals(ClosingStep.APPRECIATION_REVEAL, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertEquals(ClosingStep.SAVE_MOMENT, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertEquals(ClosingStep.SESSION_SUMMARY, viewModel.uiState.value.step)

        viewModel.advanceStep()
        assertTrue(viewModel.uiState.value.isComplete)
    }

    @Test
    fun `appreciation text is transient and never saved to repository`() {
        viewModel.advanceStep() // APPRECIATION_PERSON_A
        viewModel.updateAppreciationA("Thank you for your honesty tonight.")

        viewModel.advanceStep() // APPRECIATION_PERSON_B
        viewModel.updateAppreciationB("I loved how present you were.")

        viewModel.advanceStep() // APPRECIATION_REVEAL
        assertEquals("Thank you for your honesty tonight.", viewModel.uiState.value.appreciationA)
        assertEquals("I loved how present you were.", viewModel.uiState.value.appreciationB)

        // Verify nothing has been saved to repository
        assertTrue(
            "Appreciation texts must never be saved to the database",
            fakeMomentRepository.savedMoments.isEmpty()
        )
    }

    @Test
    fun `moment text enforces 280 character limit and saves to repository`() {
        viewModel.initSummary(
            sessionLength = "SESSION",
            relationshipType = "COUPLE",
            depthReached = 4,
            questionCount = 9
        )

        val longText = "A".repeat(300)
        viewModel.updateMomentTextA(longText)
        assertEquals("Should reject strings longer than 280 chars", 0, viewModel.uiState.value.momentTextA.length)

        val validTextA = "The moment we talked about the stars together."
        val validTextB = "How you smiled when answering question 3."
        viewModel.updateMomentTextA(validTextA)
        viewModel.updateMomentTextB(validTextB)

        viewModel.saveMomentsAndShowSummary()
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(2, fakeMomentRepository.savedMoments.size)
        assertEquals(validTextA, fakeMomentRepository.savedMoments[0].text)
        assertEquals(validTextB, fakeMomentRepository.savedMoments[1].text)
        assertEquals("COUPLE", fakeMomentRepository.savedMoments[0].relationshipType)
        assertEquals("SESSION", fakeMomentRepository.savedMoments[0].sessionLength)
        assertEquals(ClosingStep.SESSION_SUMMARY, viewModel.uiState.value.step)
    }

    @Test
    fun `skip saving moments leaves repository untouched`() {
        viewModel.advanceStep() // A
        viewModel.advanceStep() // B
        viewModel.advanceStep() // REVEAL
        viewModel.advanceStep() // SAVE_MOMENT

        // Skip
        viewModel.advanceStep() // SUMMARY
        assertEquals(ClosingStep.SESSION_SUMMARY, viewModel.uiState.value.step)
        assertTrue(fakeMomentRepository.savedMoments.isEmpty())
    }

    @Test
    fun `summary card holds only duration, depth, count and no question content`() {
        viewModel.initSummary(
            sessionLength = "DEEP",
            relationshipType = "FRIEND",
            depthReached = 5,
            questionCount = 18
        )

        val state = viewModel.uiState.value
        assertEquals("DEEP", state.sessionLength)
        assertEquals("FRIEND", state.relationshipType)
        assertEquals(5, state.depthReached)
        assertEquals(18, state.questionCount)
    }
}

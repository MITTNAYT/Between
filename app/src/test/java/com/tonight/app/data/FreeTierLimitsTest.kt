package com.tonight.app.data

import com.tonight.app.ui.screens.SetupViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class FreeTierLimitsTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeBillingRepository: FakeBillingRepository
    private lateinit var fakeSessionRecordRepository: FakeSessionRecordRepository
    private lateinit var fakeQuestionRepository: FakeQuestionRepository

    private class FakeQuestionRepository : com.tonight.app.content.QuestionRepository {
        override fun getQuestions(): List<com.tonight.app.engine.Question> = emptyList()
    }

    private class FakeBillingRepository(var premium: Boolean = false) : BillingRepository {
        private val _isPremium = MutableStateFlow(premium)
        override val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()
        override fun isPremiumActive(): Boolean = premium
        override suspend fun refreshPurchases() {}
        override suspend fun getAvailablePackages(): List<SubscriptionPackageInfo> = emptyList()
        override suspend fun purchase(activity: android.app.Activity, planType: SubscriptionPlanType): PurchaseResult = PurchaseResult.Success
        override suspend fun restorePurchases(): PurchaseResult = PurchaseResult.Success
    }

    private class FakeSessionRecordRepository : SessionRecordRepository {
        var count = 0
        private val _flow = MutableStateFlow(0)

        override suspend fun recordSession(sessionLength: String, relationshipType: String, depthReached: Int, timestamp: Long) {
            count++
            _flow.value = count
        }

        override suspend fun getSessionCountThisMonth(timestamp: Long): Int = count

        override fun observeSessionCountThisMonth(timestamp: Long): Flow<Int> = _flow.asStateFlow()

        override fun observeAllSessions(): Flow<List<SessionRecord>> = MutableStateFlow(emptyList())
    }

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeBillingRepository = FakeBillingRepository(premium = false)
        fakeSessionRecordRepository = FakeSessionRecordRepository()
        fakeQuestionRepository = FakeQuestionRepository()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `free user has unlimited sessions while app is free`() = runBlocking<Unit> {
        val viewModel = SetupViewModel(fakeBillingRepository, fakeSessionRecordRepository, fakeQuestionRepository)

        var allowedCount = 0
        var blockedReason: String? = null

        // 1st session: Allowed
        viewModel.checkCanBeginSession(
            onAllowed = { allowedCount++ },
            onLimitReached = { blockedReason = it }
        )
        testDispatcher.scheduler.advanceUntilIdle()
        fakeSessionRecordRepository.recordSession("SESSION", "COUPLE", 3)
        assertEquals(1, allowedCount)

        // 2nd session: Allowed
        viewModel.checkCanBeginSession(
            onAllowed = { allowedCount++ },
            onLimitReached = { blockedReason = it }
        )
        testDispatcher.scheduler.advanceUntilIdle()
        fakeSessionRecordRepository.recordSession("SESSION", "COUPLE", 3)
        assertEquals(2, allowedCount)

        // 3rd session: Also Allowed (App is free)
        viewModel.checkCanBeginSession(
            onAllowed = { allowedCount++ },
            onLimitReached = { blockedReason = it }
        )
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(3, allowedCount)
        assertNull(blockedReason)
    }

    @Test
    fun `premium user has unlimited monthly sessions`() = runBlocking<Unit> {
        fakeBillingRepository.premium = true
        fakeSessionRecordRepository.count = 15

        val viewModel = SetupViewModel(fakeBillingRepository, fakeSessionRecordRepository, fakeQuestionRepository)

        var allowed = false
        viewModel.checkCanBeginSession(
            onAllowed = { allowed = true },
            onLimitReached = {}
        )
        testDispatcher.scheduler.advanceUntilIdle()

        assertTrue("User must have unlimited sessions", allowed)
    }
}

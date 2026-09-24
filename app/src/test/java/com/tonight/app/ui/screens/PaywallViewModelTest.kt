package com.tonight.app.ui.screens

import android.app.Activity
import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.PurchaseResult
import com.tonight.app.data.SubscriptionPackageInfo
import com.tonight.app.data.SubscriptionPlanType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
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
class PaywallViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeBillingRepository: FakeBillingRepository
    private lateinit var fakeAnalyticsTracker: FakeAnalyticsTracker
    private lateinit var viewModel: PaywallViewModel

    private class FakeBillingRepository : BillingRepository {
        var isPremiumValue = false
        var shouldFailPurchase = false
        val packages = listOf(
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.ANNUAL,
                identifier = "tonight_annual",
                title = "Annual",
                priceFormatted = "$39.99",
                period = "per year",
                badge = "Save 52%",
                isDefault = true
            ),
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.MONTHLY,
                identifier = "tonight_monthly",
                title = "Monthly",
                priceFormatted = "$6.99",
                period = "per month",
                badge = null,
                isDefault = false
            ),
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.LIFETIME,
                identifier = "tonight_lifetime",
                title = "Lifetime",
                priceFormatted = "$89.99",
                period = "one-time",
                badge = null,
                isDefault = false
            )
        )

        private val _isPremium = MutableStateFlow(isPremiumValue)
        override val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()

        override fun isPremiumActive(): Boolean = isPremiumValue
        override suspend fun refreshPurchases() {}
        override suspend fun getAvailablePackages(): List<SubscriptionPackageInfo> = packages

        override suspend fun purchase(activity: Activity, planType: SubscriptionPlanType): PurchaseResult {
            return if (shouldFailPurchase) {
                PurchaseResult.Error("Payment declined")
            } else {
                isPremiumValue = true
                _isPremium.value = true
                PurchaseResult.Success
            }
        }

        override suspend fun restorePurchases(): PurchaseResult {
            isPremiumValue = true
            _isPremium.value = true
            return PurchaseResult.Success
        }
    }

    private class FakeAnalyticsTracker : AnalyticsTracker {
        val events = mutableListOf<String>()
        override fun trackSessionStarted(length: String, relationshipType: String) {}
        override fun trackQuestionPassed(depth: Int) {}
        override fun trackSwapUsed(direction: String) {}
        override fun trackHandshakeCompleted() {}
        override fun trackSessionCompleted(depthReached: Int) {}
        override fun trackMomentSaved() {}
        override fun trackPaywallViewed(trigger: String) { events.add("paywall_viewed_$trigger") }
        override fun trackPurchaseCompleted(packageType: String) { events.add("purchase_completed_$packageType") }
    }

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeBillingRepository = FakeBillingRepository()
        fakeAnalyticsTracker = FakeAnalyticsTracker()
        viewModel = PaywallViewModel(fakeBillingRepository, fakeAnalyticsTracker)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initPaywall loads packages, sets default annual plan, and tracks view event`() {
        viewModel.initPaywall(trigger = "monthly_limit")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertEquals("monthly_limit", state.trigger)
        assertEquals(3, state.packages.size)
        assertEquals(SubscriptionPlanType.ANNUAL, state.selectedPlan)
        assertFalse(state.isLoading)
        assertTrue(fakeAnalyticsTracker.events.contains("paywall_viewed_monthly_limit"))
    }

    @Test
    fun `selecting plan updates selectedPlan`() {
        viewModel.initPaywall(trigger = "direct")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.selectPlan(SubscriptionPlanType.MONTHLY)
        assertEquals(SubscriptionPlanType.MONTHLY, viewModel.uiState.value.selectedPlan)

        viewModel.selectPlan(SubscriptionPlanType.LIFETIME)
        assertEquals(SubscriptionPlanType.LIFETIME, viewModel.uiState.value.selectedPlan)
    }

    @Test
    fun `restore purchases succeeds and tracks purchase completed`() {
        viewModel.initPaywall(trigger = "direct")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.restorePurchases()
        testDispatcher.scheduler.advanceUntilIdle()

        assertTrue(viewModel.uiState.value.isSuccess)
        assertNull(viewModel.uiState.value.errorMessage)
        assertTrue(fakeAnalyticsTracker.events.contains("purchase_completed_RESTORE"))
    }
}

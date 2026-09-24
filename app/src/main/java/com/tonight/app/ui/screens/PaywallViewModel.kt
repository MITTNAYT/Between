package com.tonight.app.ui.screens

import android.app.Activity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.PurchaseResult
import com.tonight.app.data.SubscriptionPackageInfo
import com.tonight.app.data.SubscriptionPlanType
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PaywallUiState(
    val trigger: String = "direct",
    val packages: List<SubscriptionPackageInfo> = emptyList(),
    val selectedPlan: SubscriptionPlanType = SubscriptionPlanType.ANNUAL,
    val isLoading: Boolean = false,
    val isPurchasing: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false
)

@HiltViewModel
class PaywallViewModel @Inject constructor(
    private val billingRepository: BillingRepository,
    private val analyticsTracker: AnalyticsTracker
) : ViewModel() {

    private val _uiState = MutableStateFlow(PaywallUiState())
    val uiState: StateFlow<PaywallUiState> = _uiState.asStateFlow()

    fun initPaywall(trigger: String) {
        _uiState.update { it.copy(trigger = trigger, isSuccess = false, errorMessage = null) }
        analyticsTracker.trackPaywallViewed(trigger)
        loadPackages()
    }

    private fun loadPackages() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val pkgs = billingRepository.getAvailablePackages()
            _uiState.update {
                it.copy(
                    packages = pkgs,
                    isLoading = false,
                    selectedPlan = pkgs.firstOrNull { p -> p.isDefault }?.planType ?: SubscriptionPlanType.ANNUAL
                )
            }
        }
    }

    fun selectPlan(plan: SubscriptionPlanType) {
        _uiState.update { it.copy(selectedPlan = plan, errorMessage = null) }
    }

    fun purchase(activity: Activity) {
        val plan = _uiState.value.selectedPlan
        viewModelScope.launch {
            _uiState.update { it.copy(isPurchasing = true, errorMessage = null) }
            when (val result = billingRepository.purchase(activity, plan)) {
                is PurchaseResult.Success -> {
                    analyticsTracker.trackPurchaseCompleted(plan.name)
                    _uiState.update { it.copy(isPurchasing = false, isSuccess = true) }
                }
                is PurchaseResult.Error -> {
                    _uiState.update { it.copy(isPurchasing = false, errorMessage = result.message) }
                }
                is PurchaseResult.UserCancelled -> {
                    _uiState.update { it.copy(isPurchasing = false) }
                }
            }
        }
    }

    fun restorePurchases() {
        viewModelScope.launch {
            _uiState.update { it.copy(isPurchasing = true, errorMessage = null) }
            when (val result = billingRepository.restorePurchases()) {
                is PurchaseResult.Success -> {
                    if (billingRepository.isPremiumActive()) {
                        analyticsTracker.trackPurchaseCompleted("RESTORE")
                        _uiState.update { it.copy(isPurchasing = false, isSuccess = true) }
                    } else {
                        _uiState.update {
                            it.copy(
                                isPurchasing = false,
                                errorMessage = "No active subscription found to restore."
                            )
                        }
                    }
                }
                is PurchaseResult.Error -> {
                    _uiState.update { it.copy(isPurchasing = false, errorMessage = result.message) }
                }
                is PurchaseResult.UserCancelled -> {
                    _uiState.update { it.copy(isPurchasing = false) }
                }
            }
        }
    }
}

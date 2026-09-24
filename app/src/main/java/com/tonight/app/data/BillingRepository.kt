package com.tonight.app.data

import android.app.Activity
import kotlinx.coroutines.flow.StateFlow

enum class SubscriptionPlanType {
    ANNUAL,
    MONTHLY,
    LIFETIME
}

data class SubscriptionPackageInfo(
    val planType: SubscriptionPlanType,
    val identifier: String,
    val title: String,
    val priceFormatted: String,
    val period: String,
    val badge: String? = null,
    val isDefault: Boolean = false
)

sealed interface PurchaseResult {
    data object Success : PurchaseResult
    data class Error(val message: String) : PurchaseResult
    data object UserCancelled : PurchaseResult
}

interface BillingRepository {
    val isPremium: StateFlow<Boolean>
    fun isPremiumActive(): Boolean
    suspend fun refreshPurchases()
    suspend fun getAvailablePackages(): List<SubscriptionPackageInfo>
    suspend fun purchase(activity: Activity, planType: SubscriptionPlanType): PurchaseResult
    suspend fun restorePurchases(): PurchaseResult
}

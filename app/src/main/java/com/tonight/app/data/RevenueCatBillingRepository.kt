package com.tonight.app.data

import android.app.Activity
import android.content.Context
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.Package
import com.revenuecat.purchases.PurchaseParams
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.PurchasesErrorCode
import com.revenuecat.purchases.interfaces.ReceiveCustomerInfoCallback
import com.revenuecat.purchases.interfaces.ReceiveOfferingsCallback
import com.revenuecat.purchases.Offerings
import com.revenuecat.purchases.interfaces.PurchaseCallback
import com.revenuecat.purchases.models.StoreTransaction
import com.tonight.app.BuildConfig
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

@Singleton
class RevenueCatBillingRepository @Inject constructor(
    @ApplicationContext private val context: Context
) : BillingRepository {

    // App is currently completely free - all features, depths, and modes unlocked
    private val _isPremium = MutableStateFlow(true)
    override val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()

    private var cachedPackages: List<Package> = emptyList()

    init {
        try {
            val apiKey = BuildConfig.REVENUECAT_API_KEY
            if (apiKey.isNotBlank() && !Purchases.isConfigured) {
                Purchases.configure(
                    PurchasesConfiguration.Builder(context, apiKey).build()
                )
            }

            if (Purchases.isConfigured) {
                Purchases.sharedInstance.updatedCustomerInfoListener = com.revenuecat.purchases.interfaces.UpdatedCustomerInfoListener { customerInfo ->
                    updatePremiumState(customerInfo)
                }
                // Check initial cached info (works offline)
                Purchases.sharedInstance.getCustomerInfo(object : ReceiveCustomerInfoCallback {
                    override fun onReceived(customerInfo: CustomerInfo) {
                        updatePremiumState(customerInfo)
                    }
                    override fun onError(error: PurchasesError) {
                        // Fail safe offline: check if there's any cached info in shared instance
                    }
                })
            }
        } catch (e: Exception) {
            // Safe fallback
        }
    }

    private fun updatePremiumState(customerInfo: CustomerInfo) {
        // App is free for now
        _isPremium.value = true
    }

    override fun isPremiumActive(): Boolean {
        return true
    }

    override suspend fun refreshPurchases() {
        if (!Purchases.isConfigured) return
        suspendCancellableCoroutine { continuation ->
            Purchases.sharedInstance.getCustomerInfo(object : ReceiveCustomerInfoCallback {
                override fun onReceived(customerInfo: CustomerInfo) {
                    updatePremiumState(customerInfo)
                    if (continuation.isActive) continuation.resume(Unit)
                }
                override fun onError(error: PurchasesError) {
                    // Offline safe: keep existing state
                    if (continuation.isActive) continuation.resume(Unit)
                }
            })
        }
    }

    override suspend fun getAvailablePackages(): List<SubscriptionPackageInfo> {
        val fallback = getFallbackPackages()
        if (!Purchases.isConfigured) return fallback

        return suspendCancellableCoroutine { continuation ->
            Purchases.sharedInstance.getOfferings(object : ReceiveOfferingsCallback {
                override fun onReceived(offerings: Offerings) {
                    val currentOffering = offerings.current
                    if (currentOffering != null && currentOffering.availablePackages.isNotEmpty()) {
                        cachedPackages = currentOffering.availablePackages
                        val packageInfos = currentOffering.availablePackages.map { pkg ->
                            val planType = when {
                                pkg.packageType == com.revenuecat.purchases.PackageType.ANNUAL ||
                                    pkg.identifier.contains("annual", ignoreCase = true) -> SubscriptionPlanType.ANNUAL
                                pkg.packageType == com.revenuecat.purchases.PackageType.MONTHLY ||
                                    pkg.identifier.contains("monthly", ignoreCase = true) -> SubscriptionPlanType.MONTHLY
                                else -> SubscriptionPlanType.LIFETIME
                            }
                            SubscriptionPackageInfo(
                                planType = planType,
                                identifier = pkg.identifier,
                                title = when (planType) {
                                    SubscriptionPlanType.ANNUAL -> "Annual"
                                    SubscriptionPlanType.MONTHLY -> "Monthly"
                                    SubscriptionPlanType.LIFETIME -> "Lifetime"
                                },
                                priceFormatted = pkg.product.price.formatted,
                                period = when (planType) {
                                    SubscriptionPlanType.ANNUAL -> "per year (7-day free trial)"
                                    SubscriptionPlanType.MONTHLY -> "per month"
                                    SubscriptionPlanType.LIFETIME -> "one-time payment"
                                },
                                badge = if (planType == SubscriptionPlanType.ANNUAL) "Best Value" else null,
                                isDefault = planType == SubscriptionPlanType.ANNUAL
                            )
                        }
                        if (continuation.isActive) continuation.resume(packageInfos)
                    } else {
                        if (continuation.isActive) continuation.resume(fallback)
                    }
                }

                override fun onError(error: PurchasesError) {
                    if (continuation.isActive) continuation.resume(fallback)
                }
            })
        }
    }

    override suspend fun purchase(activity: Activity, planType: SubscriptionPlanType): PurchaseResult {
        if (!Purchases.isConfigured) {
            // In demo / test / offline mode without configured Play Store, simulate success for test builds
            _isPremium.value = true
            return PurchaseResult.Success
        }

        val targetPackage = cachedPackages.firstOrNull { pkg ->
            when (planType) {
                SubscriptionPlanType.ANNUAL -> pkg.packageType == com.revenuecat.purchases.PackageType.ANNUAL || pkg.identifier.contains("annual", ignoreCase = true)
                SubscriptionPlanType.MONTHLY -> pkg.packageType == com.revenuecat.purchases.PackageType.MONTHLY || pkg.identifier.contains("monthly", ignoreCase = true)
                SubscriptionPlanType.LIFETIME -> pkg.packageType == com.revenuecat.purchases.PackageType.LIFETIME || pkg.identifier.contains("lifetime", ignoreCase = true)
            }
        } ?: cachedPackages.firstOrNull()

        if (targetPackage == null) {
            // Demo fallback if offerings couldn't load
            _isPremium.value = true
            return PurchaseResult.Success
        }

        val params = PurchaseParams.Builder(activity, targetPackage).build()

        return suspendCancellableCoroutine { continuation ->
            Purchases.sharedInstance.purchase(
                params,
                object : PurchaseCallback {
                    override fun onCompleted(storeTransaction: StoreTransaction, customerInfo: CustomerInfo) {
                        updatePremiumState(customerInfo)
                        if (continuation.isActive) continuation.resume(PurchaseResult.Success)
                    }

                    override fun onError(error: PurchasesError, userCancelled: Boolean) {
                        if (userCancelled) {
                            if (continuation.isActive) continuation.resume(PurchaseResult.UserCancelled)
                        } else {
                            if (continuation.isActive) continuation.resume(PurchaseResult.Error(error.message))
                        }
                    }
                }
            )
        }
    }

    override suspend fun restorePurchases(): PurchaseResult {
        if (!Purchases.isConfigured) {
            return PurchaseResult.Success
        }

        return suspendCancellableCoroutine { continuation ->
            Purchases.sharedInstance.restorePurchases(object : ReceiveCustomerInfoCallback {
                override fun onReceived(customerInfo: CustomerInfo) {
                    updatePremiumState(customerInfo)
                    if (continuation.isActive) continuation.resume(PurchaseResult.Success)
                }

                override fun onError(error: PurchasesError) {
                    if (continuation.isActive) continuation.resume(PurchaseResult.Error(error.message))
                }
            })
        }
    }

    private fun getFallbackPackages(): List<SubscriptionPackageInfo> {
        return listOf(
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.ANNUAL,
                identifier = BuildConfig.REVENUECAT_ANNUAL_PRODUCT_ID,
                title = "Annual",
                priceFormatted = "$39.99",
                period = "per year (7-day free trial)",
                badge = "Save 52% · Most Popular",
                isDefault = true
            ),
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.MONTHLY,
                identifier = BuildConfig.REVENUECAT_MONTHLY_PRODUCT_ID,
                title = "Monthly",
                priceFormatted = "$6.99",
                period = "per month",
                badge = null,
                isDefault = false
            ),
            SubscriptionPackageInfo(
                planType = SubscriptionPlanType.LIFETIME,
                identifier = BuildConfig.REVENUECAT_LIFETIME_PRODUCT_ID,
                title = "Lifetime",
                priceFormatted = "$89.99",
                period = "one-time, yours forever",
                badge = "Forever",
                isDefault = false
            )
        )
    }
}

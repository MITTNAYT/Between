package com.tonight.app.analytics

import android.content.Context
import com.posthog.PostHog
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig
import com.tonight.app.BuildConfig
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PostHogAnalyticsTracker @Inject constructor(
    @ApplicationContext private val context: Context
) : AnalyticsTracker {

    private var isInitialized = false

    init {
        try {
            val apiKey = BuildConfig.POSTHOG_API_KEY
            if (apiKey.isNotBlank() && !apiKey.contains("placeholder") && !apiKey.contains("test")) {
                val config = PostHogAndroidConfig(apiKey = apiKey, host = BuildConfig.POSTHOG_HOST).apply {
                    sessionReplay = false // Session replay strictly disabled for privacy
                    captureApplicationLifecycleEvents = true
                    captureScreenViews = false
                }
                PostHogAndroid.setup(context, config)
                isInitialized = true
            }
        } catch (e: Exception) {
            isInitialized = false
        }
    }

    override fun trackSessionStarted(length: String, relationshipType: String) {
        if (isInitialized) {
            PostHog.capture(
                event = "session_started",
                properties = mapOf(
                    "length" to length,
                    "relationship_type" to relationshipType
                )
            )
        }
    }

    override fun trackQuestionPassed(depth: Int) {
        if (isInitialized) {
            PostHog.capture(
                event = "question_passed",
                properties = mapOf(
                    "depth" to depth
                )
            )
        }
    }

    override fun trackSwapUsed(direction: String) {
        if (isInitialized) {
            PostHog.capture(
                event = "swap_used",
                properties = mapOf(
                    "direction" to direction
                )
            )
        }
    }

    override fun trackHandshakeCompleted() {
        if (isInitialized) {
            PostHog.capture(event = "handshake_completed")
        }
    }

    override fun trackSessionCompleted(depthReached: Int) {
        if (isInitialized) {
            PostHog.capture(
                event = "session_completed",
                properties = mapOf(
                    "depth_reached" to depthReached
                )
            )
        }
    }

    override fun trackMomentSaved() {
        if (isInitialized) {
            PostHog.capture(event = "moment_saved")
        }
    }

    override fun trackPaywallViewed(trigger: String) {
        if (isInitialized) {
            PostHog.capture(
                event = "paywall_viewed",
                properties = mapOf(
                    "trigger" to trigger
                )
            )
        }
    }

    override fun trackPurchaseCompleted(packageType: String) {
        if (isInitialized) {
            PostHog.capture(
                event = "purchase_completed",
                properties = mapOf(
                    "package_type" to packageType
                )
            )
        }
    }
}

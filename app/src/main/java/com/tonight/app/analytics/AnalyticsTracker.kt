package com.tonight.app.analytics

/**
 * Privacy-first analytics tracker interface.
 *
 * PRIVACY GUARANTEE:
 * No method in this interface accepts question text, user answers, moment notes,
 * follow-up prompts, or identifiable conversational content.
 */
interface AnalyticsTracker {
    fun trackSessionStarted(length: String, relationshipType: String)
    fun trackQuestionPassed(depth: Int)
    fun trackSwapUsed(direction: String) // "LIGHTER" or "DEEPER"
    fun trackHandshakeCompleted()
    fun trackSessionCompleted(depthReached: Int)
    fun trackMomentSaved()
    fun trackPaywallViewed(trigger: String)
    fun trackPurchaseCompleted(packageType: String)
    fun trackHintOpened(depth: Int)
}

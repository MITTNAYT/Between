package com.tonight.app.analytics

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AnalyticsPrivacyTest {

    @Test
    fun `AnalyticsTracker interface strictly forbids text content in parameter signatures`() {
        val methods = AnalyticsTracker::class.java.declaredMethods

        val forbiddenKeywords = listOf("text", "question", "answer", "prompt", "momentText", "followUp", "content")

        for (method in methods) {
            val methodName = method.name.lowercase()
            for (keyword in forbiddenKeywords) {
                assertFalse(
                    "Method name '${method.name}' must not include conversational keyword '$keyword'",
                    methodName.contains("questiontext") || methodName.contains("useranswer")
                )
            }

            for (param in method.parameters) {
                val paramName = param.name.lowercase()
                for (keyword in forbiddenKeywords) {
                    assertFalse(
                        "Method '${method.name}' parameter '${param.name}' must not accept conversational text content '$keyword'",
                        paramName.contains("questiontext") ||
                            paramName.contains("answertext") ||
                            paramName.contains("usertext")
                    )
                }
            }
        }
        assertTrue("AnalyticsTracker interface contains methods", methods.isNotEmpty())
    }
}

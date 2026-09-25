package com.tonight.app.content

import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import kotlinx.serialization.json.Json
import kotlin.random.Random

/**
 * FollowUpEngine:
 * Generalizes the follow-up prompt bank by combining tailored question-specific follow-ups
 * with contextually appropriate generic prompts from follow_ups.json.
 */
object FollowUpEngine {

    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    val CATEGORY_MAPPING: Map<Category, List<String>> = mapOf(
        Category.IDENTITY to listOf("REFLECTION", "MEANING"),
        Category.ORIGINS to listOf("STORY", "PEOPLE"),
        Category.VALUES to listOf("MEANING", "REFLECTION"),
        Category.FUTURE to listOf("MEANING", "REFLECTION"),
        Category.US to listOf("STORY", "PEOPLE"),
        Category.FEARS to listOf("EMOTION", "REFLECTION"),
        Category.GRATITUDE to listOf("EMOTION", "REFLECTION"),
        Category.DREAMS to listOf("MEANING", "REFLECTION"),
        Category.PLAY to listOf("STORY", "PEOPLE"),
        Category.CONFLICT to listOf("EMOTION", "MEANING")
    )

    fun parseFollowUpsJson(jsonString: String): Map<String, List<String>> {
        return try {
            json.decodeFromString<Map<String, List<String>>>(jsonString)
        } catch (e: Exception) {
            emptyMap()
        }
    }

    /**
     * Builds the shown list of follow-up prompts for a question:
     * Question's tailored followUps (1-2) + ONE random generic pick, capped at 3 total.
     */
    fun buildFollowUpsForQuestion(
        question: Question,
        genericBank: Map<String, List<String>>,
        random: Random = Random(System.nanoTime())
    ): List<String> {
        val tailored = question.followUps.toMutableList()
        val mappedCategories = CATEGORY_MAPPING[question.category] ?: listOf("REFLECTION")

        if (genericBank.isNotEmpty() && mappedCategories.isNotEmpty()) {
            val chosenGroup = mappedCategories.random(random)
            val candidates = genericBank[chosenGroup]?.filter { it !in tailored } ?: emptyList()

            if (candidates.isNotEmpty()) {
                val genericPick = candidates.random(random)
                tailored.add(genericPick)
            }
        }

        return tailored.take(3)
    }
}

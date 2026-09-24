package com.tonight.app.content

import com.tonight.app.engine.RelationshipType
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

class ContentTaggingTest {

    private val allowlistLines = """
        What are three words your friends would use to describe you?
        What's something you spend a lot of time thinking about?
        What's a part of your personality you're proud of?
        What's something you're naturally good at?
        What do you enjoy that most people wouldn't guess?
        What was your favorite thing to do as a child?
        What was your dream job growing up?
        What cartoon or show did you love?
        What snack reminds you of childhood?
        What was your favorite place growing up?
        What makes someone easy to talk to?
        What's your favorite thing to do with friends?
        What type of friend are you?
        What quality attracts you to people?
        What's the funniest thing a friend has done?
        What's a place you want to visit?
        What's a skill you'd love to learn?
        What's on your bucket list?
        What's something you're excited about?
        What's a hobby you'd like to try?
        What's something that makes you nervous?
        What's your biggest irrational fear?
        What challenge intimidates you?
        What's something outside your comfort zone?
        What risk would you like to take?
        What do people usually misunderstand about you?
        What version of yourself do different people see?
        What trait has helped you most in life?
        What were you like at ten years old?
        What did you think adulthood would be like?
        What memory always makes you smile?
        What family tradition stands out most?
        What makes you trust someone?
        What makes you feel included?
        How do you usually make friends?
        What quality keeps friendships strong?
        What kind of people bring out your best side?
        What does success mean to you?
        What motivates you right now?
        What's a goal you're working toward?
        What kind of lifestyle appeals to you?
        What are you curious about lately?
        What kind of failure worries you?
        What fear has become smaller over time?
        When do you feel most like yourself?
        What role do you naturally play in a group?
        What part of your identity matters most to you?
        What do you hope never changes about you?
        Who influenced you most growing up?
        What friendship taught you the most?
        What makes someone unforgettable?
        What do you appreciate most in your closest friends?
        When do you feel closest to people?
        What does loyalty mean to you?
        What dream have you held onto the longest?
        What would you do if money didn't matter?
        What's something you want to build?
        What impact would you like to have?
        What are you chasing right now?
    """.trimIndent().lines().map { it.trim() }.filter { it.isNotEmpty() }

    @Test
    fun `tag questions in questions_json matching allowlist`() {
        val file = File("src/main/assets/questions.json")
        assertTrue("questions.json should exist", file.exists())

        val jsonParser = Json {
            ignoreUnknownKeys = true
            isLenient = true
            prettyPrint = true
        }

        val jsonString = file.readText()
        val dtos: List<QuestionDto> = jsonParser.decodeFromString(jsonString)

        val allowlistNormalized = allowlistLines.map { it.lowercase().trim() }.toSet()
        var matchCount = 0
        val matchedAllowlist = mutableSetOf<String>()

        val updatedDtos = dtos.map { dto ->
            val normalizedText = dto.text.lowercase().trim()
            if (allowlistNormalized.contains(normalizedText)) {
                matchCount++
                matchedAllowlist.add(normalizedText)
                val currentTypes = dto.relationshipTypes.toMutableList()
                if (!currentTypes.contains("JUST_MET")) {
                    currentTypes.add("JUST_MET")
                }
                dto.copy(relationshipTypes = currentTypes)
            } else {
                dto
            }
        }

        val unmatched = allowlistLines.filter { it.lowercase().trim() !in matchedAllowlist }

        println("================ CONTENT TAGGING REPORT ================")
        println("Allowlist items total: ${allowlistLines.size}")
        println("Matched questions: $matchCount")
        println("Unmatched allowlist items: ${unmatched.size}")
        unmatched.forEach { println("  - Unmatched: $it") }
        println("========================================================")

        // Write the updated JSON back to file
        val updatedJson = jsonParser.encodeToString(updatedDtos)
        file.writeText(updatedJson)

        assertEquals("All allowlist entries must match", 0, unmatched.size)
        assertEquals(allowlistLines.size, matchCount)

        // Validate resulting file
        val validated = ContentValidator.parseAndValidate(file.readText(), isDebug = true)
        val justMetCount = validated.count { RelationshipType.JUST_MET in it.relationshipTypes }
        assertEquals(allowlistLines.size, justMetCount)
    }
}

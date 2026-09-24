package com.tonight.app.content

import com.tonight.app.engine.QuestionStatus
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import java.io.File

class ContentValidatorTest {

    @Test
    fun `bundled questions json validates successfully in debug mode`() {
        val file = File("src/main/assets/questions.json")
        assertTrue("questions.json should exist in assets", file.exists())

        val jsonString = file.readText()
        val questions = ContentValidator.parseAndValidate(jsonString, isDebug = true)

        assertTrue("Expected at least 100 bundled approved questions", questions.size >= 100)

        val approvedCount = questions.count { it.status == QuestionStatus.APPROVED }
        val draftCount = questions.count { it.status == QuestionStatus.DRAFT }
        assertEquals(questions.size, approvedCount)
        assertEquals(0, draftCount)

        // Verify unique IDs
        val uniqueIds = questions.map { it.id }.toSet()
        assertEquals(questions.size, uniqueIds.size)

        // Verify handshake invariants
        for (q in questions) {
            assertEquals(
                "Handshake must equal (depth >= 4) for question ${q.id}",
                q.depth >= 4,
                q.needsHandshake
            )
            assertTrue("Followups must be 1..2 for question ${q.id}", q.followUps.size in 1..2)
        }
    }

    @Test
    fun `duplicate IDs fail loudly in debug mode`() {
        val badJson = """
            [
              {
                "id": "dup-1",
                "text": "First question",
                "category": "PLAY",
                "depth": 1,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["Why?"],
                "needsHandshake": false,
                "status": "APPROVED"
              },
              {
                "id": "dup-1",
                "text": "Duplicate question",
                "category": "PLAY",
                "depth": 1,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["Why?"],
                "needsHandshake": false,
                "status": "APPROVED"
              }
            ]
        """.trimIndent()

        try {
            ContentValidator.parseAndValidate(badJson, isDebug = true)
            fail("Expected IllegalStateException for duplicate IDs in debug mode")
        } catch (e: IllegalStateException) {
            assertTrue(e.message?.contains("Duplicate question ID") == true)
        }
    }

    @Test
    fun `inconsistent needsHandshake fails loudly in debug mode`() {
        val badJson = """
            [
              {
                "id": "bad-handshake-1",
                "text": "L4 question with false handshake",
                "category": "FEARS",
                "depth": 4,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["Why?"],
                "needsHandshake": false,
                "status": "APPROVED"
              }
            ]
        """.trimIndent()

        try {
            ContentValidator.parseAndValidate(badJson, isDebug = true)
            fail("Expected IllegalStateException for inconsistent needsHandshake in debug mode")
        } catch (e: IllegalStateException) {
            assertTrue(e.message?.contains("inconsistent needsHandshake") == true)
        }
    }

    @Test
    fun `invalid followUps count fails loudly in debug mode`() {
        val badJson = """
            [
              {
                "id": "bad-followup-1",
                "text": "Question with 3 followups",
                "category": "PLAY",
                "depth": 1,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["One", "Two", "Three"],
                "needsHandshake": false,
                "status": "APPROVED"
              }
            ]
        """.trimIndent()

        try {
            ContentValidator.parseAndValidate(badJson, isDebug = true)
            fail("Expected IllegalStateException for 3 followUps in debug mode")
        } catch (e: IllegalStateException) {
            assertTrue(e.message?.contains("follow-ups") == true)
        }
    }

    @Test
    fun `invalid items are dropped and valid items returned in release mode`() {
        val mixedJson = """
            [
              {
                "id": "valid-1",
                "text": "Valid question",
                "category": "VALUES",
                "depth": 2,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["Why?"],
                "needsHandshake": false,
                "status": "APPROVED"
              },
              {
                "id": "invalid-depth",
                "text": "Depth out of bounds",
                "category": "VALUES",
                "depth": 9,
                "relationshipTypes": ["COUPLE"],
                "followUps": ["Why?"],
                "needsHandshake": false,
                "status": "APPROVED"
              }
            ]
        """.trimIndent()

        val results = ContentValidator.parseAndValidate(mixedJson, isDebug = false)
        assertEquals("Release mode should drop invalid item and keep valid item", 1, results.size)
        assertEquals("valid-1", results[0].id)
    }
}

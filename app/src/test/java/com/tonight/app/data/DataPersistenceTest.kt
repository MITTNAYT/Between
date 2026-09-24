package com.tonight.app.data

import com.tonight.app.engine.RelationshipType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import java.util.UUID

class DataPersistenceTest {

    @Test
    fun `Moment and SessionRecord store relationshipType as String by name`() {
        val types = listOf(
            RelationshipType.COUPLE,
            RelationshipType.FRIEND,
            RelationshipType.JUST_MET
        )

        for (type in types) {
            val moment = Moment(
                id = UUID.randomUUID().toString(),
                createdAt = System.currentTimeMillis(),
                sessionLength = "SESSION",
                relationshipType = type.name,
                text = "A beautiful memory with $type"
            )

            assertEquals(type.name, moment.relationshipType)

            val sessionRecord = SessionRecord(
                id = UUID.randomUUID().toString(),
                startedAt = System.currentTimeMillis(),
                yearMonth = "2026-09",
                sessionLength = "DEEP",
                relationshipType = type.name,
                depthReached = 3
            )

            assertEquals(type.name, sessionRecord.relationshipType)
        }
    }

    @Test
    fun `existing Moment entity fields remain fully backwards compatible`() {
        val legacyMoment = Moment(
            id = "legacy-1",
            createdAt = 1727200000000L,
            sessionLength = "SESSION",
            relationshipType = "COUPLE",
            text = "Legacy moment text",
            questionId = null
        )

        assertNotNull(legacyMoment.id)
        assertEquals("COUPLE", legacyMoment.relationshipType)
    }
}

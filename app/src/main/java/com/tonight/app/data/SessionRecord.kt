package com.tonight.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "session_records")
data class SessionRecord(
    @PrimaryKey
    val id: String,
    val startedAt: Long,
    val yearMonth: String, // format "YYYY-MM", e.g. "2026-09"
    val sessionLength: String,
    val relationshipType: String,
    val depthReached: Int
)

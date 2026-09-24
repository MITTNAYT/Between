package com.tonight.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "seen_questions")
data class SeenQuestion(
    @PrimaryKey
    val questionId: String,
    val lastSeenAt: Long
)

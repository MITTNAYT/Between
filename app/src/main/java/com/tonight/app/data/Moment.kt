package com.tonight.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "moments")
data class Moment(
    @PrimaryKey
    val id: String,
    val createdAt: Long,
    val sessionLength: String,
    val relationshipType: String,
    val text: String,
    val questionId: String? = null
)

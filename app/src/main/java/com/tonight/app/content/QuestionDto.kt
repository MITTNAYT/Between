package com.tonight.app.content

import kotlinx.serialization.Serializable

@Serializable
data class QuestionDto(
    val id: String,
    val text: String,
    val category: String,
    val depth: Int,
    val relationshipTypes: List<String>,
    val followUps: List<String>,
    val needsHandshake: Boolean,
    val status: String
)

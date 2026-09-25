package com.tonight.app.engine

data class Question(
    val id: String,
    val text: String,
    val category: Category,
    val depth: Int,
    val relationshipTypes: Set<RelationshipType>,
    val followUps: List<String>,
    val needsHandshake: Boolean = depth >= 4,
    val status: QuestionStatus,
    val isExperienceCard: Boolean = false,
    val hint: String? = null
) {
    init {
        require(id.isNotBlank()) { "Question id cannot be blank" }
        require(text.isNotBlank()) { "Question text cannot be blank" }
        require(depth in 1..5) { "Depth must be between 1 and 5, was: $depth" }
        require(relationshipTypes.isNotEmpty()) { "Relationship types cannot be empty" }
        require(followUps.size in 1..2) { "Follow-ups must contain 1-2 items, had: ${followUps.size}" }
        require(needsHandshake == (depth >= 4)) {
            "needsHandshake must be true when depth >= 4 and false otherwise (depth: $depth, needsHandshake: $needsHandshake)"
        }
        if (hint != null) {
            require(hint.startsWith("e.g. ") && hint.length <= 90) {
                "Hint must start with 'e.g. ' and be <= 90 chars, was: '$hint'"
            }
        }
    }
}

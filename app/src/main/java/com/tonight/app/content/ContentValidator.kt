package com.tonight.app.content

import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import kotlinx.serialization.json.Json

data class ValidationResult(
    val validQuestions: List<Question>,
    val errors: List<String>
)

object ContentValidator {

    private val jsonParser = Json {
        ignoreUnknownKeys = true
        isLenient = true
    }

    fun parseAndValidate(jsonString: String, isDebug: Boolean): List<Question> {
        val dtos: List<QuestionDto> = try {
            jsonParser.decodeFromString(jsonString)
        } catch (e: Exception) {
            if (isDebug) {
                throw IllegalStateException("Failed to parse questions JSON: ${e.message}", e)
            } else {
                return emptyList()
            }
        }

        val result = validateDtos(dtos)

        if (isDebug && result.errors.isNotEmpty()) {
            val formattedErrors = result.errors.joinToString("\n- ", prefix = "- ")
            throw IllegalStateException(
                "Content validation failed with ${result.errors.size} error(s):\n$formattedErrors"
            )
        }

        return result.validQuestions
    }

    fun validateDtos(dtos: List<QuestionDto>): ValidationResult {
        val errors = mutableListOf<String>()
        val seenIds = mutableSetOf<String>()
        val validQuestions = mutableListOf<Question>()

        // Check for duplicate IDs first
        val idCounts = dtos.groupingBy { it.id }.eachCount()
        for ((id, count) in idCounts) {
            if (count > 1) {
                errors.add("Duplicate question ID '$id' appears $count times.")
            }
        }

        for ((index, dto) in dtos.withIndex()) {
            val itemErrors = mutableListOf<String>()

            if (dto.id.isBlank()) {
                itemErrors.add("Item at index $index has blank id.")
            }

            if (dto.text.isBlank()) {
                itemErrors.add("Question '${dto.id}' has blank text.")
            }

            if (dto.depth !in 1..5) {
                itemErrors.add("Question '${dto.id}' has invalid depth ${dto.depth}. Must be 1..5.")
            }

            val expectedNeedsHandshake = dto.depth >= 4
            if (dto.needsHandshake != expectedNeedsHandshake) {
                itemErrors.add(
                    "Question '${dto.id}' has inconsistent needsHandshake (${dto.needsHandshake}) for depth ${dto.depth}. Expected $expectedNeedsHandshake."
                )
            }

            if (dto.followUps.size !in 1..2) {
                itemErrors.add(
                    "Question '${dto.id}' has ${dto.followUps.size} follow-ups. Must have 1 or 2 items."
                )
            }

            val parsedCategory = try {
                Category.valueOf(dto.category.trim().uppercase())
            } catch (e: IllegalArgumentException) {
                itemErrors.add("Question '${dto.id}' has unknown category '${dto.category}'.")
                null
            }

            val parsedRelationships = mutableSetOf<RelationshipType>()
            if (dto.relationshipTypes.isEmpty()) {
                itemErrors.add("Question '${dto.id}' has empty relationshipTypes.")
            } else {
                for (rt in dto.relationshipTypes) {
                    try {
                        parsedRelationships.add(RelationshipType.valueOf(rt.trim().uppercase()))
                    } catch (e: IllegalArgumentException) {
                        itemErrors.add("Question '${dto.id}' has unknown relationshipType '$rt'.")
                    }
                }
            }

            if (parsedRelationships.contains(RelationshipType.JUST_MET)) {
                if (dto.depth > 3 || dto.needsHandshake) {
                    itemErrors.add(
                        "Question '${dto.id}' tagged JUST_MET must have depth <= 3 and needsHandshake == false (had depth ${dto.depth}, needsHandshake=${dto.needsHandshake})."
                    )
                }
            }

            val parsedStatus = try {
                QuestionStatus.valueOf(dto.status.trim().uppercase())
            } catch (e: IllegalArgumentException) {
                itemErrors.add("Question '${dto.id}' has unknown status '${dto.status}'.")
                null
            }

            var validHint: String? = null
            if (dto.hint != null) {
                val trimmedHint = dto.hint.trim()
                if (!trimmedHint.startsWith("e.g. ") || trimmedHint.length > 90) {
                    itemErrors.add(
                        "Question '${dto.id}' has invalid hint '$trimmedHint'. Must start with 'e.g. ' and be <= 90 chars (length ${trimmedHint.length})."
                    )
                } else {
                    validHint = trimmedHint
                }
            }

            // Also check for duplicate ID within loop for release-mode dropping
            val isDuplicate = !seenIds.add(dto.id)

            if (itemErrors.isEmpty() && parsedCategory != null && parsedStatus != null && parsedRelationships.isNotEmpty() && !isDuplicate) {
                try {
                    val question = Question(
                        id = dto.id.trim(),
                        text = dto.text.trim(),
                        category = parsedCategory,
                        depth = dto.depth,
                        relationshipTypes = parsedRelationships,
                        followUps = dto.followUps.map { it.trim() },
                        needsHandshake = dto.needsHandshake,
                        status = parsedStatus,
                        isExperienceCard = dto.isExperienceCard,
                        hint = validHint
                    )
                    validQuestions.add(question)
                } catch (e: IllegalArgumentException) {
                    itemErrors.add("Question '${dto.id}' failed invariant check: ${e.message}")
                }
            } else if (parsedCategory != null && parsedStatus != null && parsedRelationships.isNotEmpty() && !isDuplicate) {
                // Release mode fallback: drop invalid hint and keep valid question if only hint failed
                try {
                    val question = Question(
                        id = dto.id.trim(),
                        text = dto.text.trim(),
                        category = parsedCategory,
                        depth = dto.depth,
                        relationshipTypes = parsedRelationships,
                        followUps = dto.followUps.map { it.trim() },
                        needsHandshake = dto.needsHandshake,
                        status = parsedStatus,
                        isExperienceCard = dto.isExperienceCard,
                        hint = null
                    )
                    // If no critical structural errors (like blank text, bad depth)
                    val criticalErrors = itemErrors.filterNot { it.contains("invalid hint") }
                    if (criticalErrors.isEmpty()) {
                        validQuestions.add(question)
                    }
                } catch (_: Exception) {}
            }

            errors.addAll(itemErrors)
        }

        return ValidationResult(
            validQuestions = validQuestions,
            errors = errors
        )
    }
}

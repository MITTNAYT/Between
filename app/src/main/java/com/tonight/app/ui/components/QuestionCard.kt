package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import com.tonight.app.ui.theme.TonightTheme

/**
 * QuestionCard:
 * Displays the current session question in high-contrast Source Serif 4 (questionXL 34/42, min 28sp),
 * enclosed in a 28dp softShadow card with clear turn indicator.
 */
@Composable
fun QuestionCard(
    question: Question,
    turnIndicator: String,
    modifier: Modifier = Modifier
) {
    SoftCard(
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 28.dp, vertical = 40.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Turn indicator chip/label
            Box(
                modifier = Modifier
                    .background(TonightTheme.colors.canvas, TonightTheme.shapes.pill)
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = turnIndicator.uppercase(),
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 1.2.sp,
                        color = TonightTheme.colors.muted
                    ),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Large display question serif text (never below 28sp)
            Text(
                text = question.text,
                style = TonightTheme.typography.questionXL,
                color = TonightTheme.colors.ink,
                textAlign = TextAlign.Center,
                modifier = Modifier.semantics { heading() }
            )
        }
    }
}

@Preview(name = "QuestionCard - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun QuestionCardPreview() {
    TonightTheme {
        QuestionCard(
            question = Question(
                id = "sample",
                text = "What is a small, quiet moment with me that you replay when you need comfort?",
                category = Category.VALUES,
                depth = 3,
                relationshipTypes = setOf(RelationshipType.COUPLE),
                followUps = listOf("Why does that particular memory stay with you?"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED
            ),
            turnIndicator = "Person A's turn to answer"
        )
    }
}

@Preview(name = "QuestionCard - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun QuestionCardLargeFontPreview() {
    TonightTheme {
        QuestionCard(
            question = Question(
                id = "sample",
                text = "What is a small, quiet moment with me that you replay when you need comfort?",
                category = Category.VALUES,
                depth = 3,
                relationshipTypes = setOf(RelationshipType.COUPLE),
                followUps = listOf("Why does that particular memory stay with you?"),
                needsHandshake = false,
                status = QuestionStatus.APPROVED
            ),
            turnIndicator = "Person B's turn to answer"
        )
    }
}

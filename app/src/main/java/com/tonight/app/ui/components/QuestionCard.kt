package com.tonight.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.isReducedMotion
import com.tonight.app.ui.theme.softShadow

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
            val isWildcard = question.id.startsWith("wildcard") || question.text.startsWith("Wildcard:")
            // Turn indicator chip/label
            Box(
                modifier = Modifier
                    .background(
                        if (isWildcard) TonightTheme.colors.ember.copy(alpha = 0.12f) else TonightTheme.colors.canvas,
                        TonightTheme.shapes.pill
                    )
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = if (isWildcard) "✨ WILDCARD · ASK ANYTHING" else turnIndicator.uppercase(),
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 1.2.sp,
                        fontWeight = if (isWildcard) FontWeight.SemiBold else FontWeight.Medium,
                        color = if (isWildcard) TonightTheme.colors.ember else TonightTheme.colors.muted
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

private val WILDCARD_COUPLE_PROMPTS = listOf(
    "What is a small thing I do that always makes you feel loved?",
    "What's a dream for our future that you haven't dared to say out loud?",
    "What's something you notice about me that I don't see in myself?",
    "When did you feel most connected to me in the last month?",
    "If we could pause time for one full weekend with no phones, what would we do?",
    "What's a quirk of mine you secretly find charming?"
)

private val WILDCARD_FRIEND_PROMPTS = listOf(
    "What's a memory of us that always makes you laugh when you think about it?",
    "What's something you're dealing with right now that you haven't told many people?",
    "What's a quality in our friendship that you value most?",
    "What is a belief you've completely changed your mind about recently?",
    "If you could pick one adventure for us to do before the year ends, what is it?",
    "What's something you admire about how I handle life?"
)

private val WILDCARD_JUSTMET_PROMPTS = listOf(
    "What's a passion of yours that most people don't find out about right away?",
    "What's the best piece of unexpected advice someone ever gave you?",
    "What is something you're looking forward to this season?",
    "What's a topic you could talk about for hours without getting tired?",
    "What's a habit or routine that brings you peace every day?",
    "What's something that instantly earns your respect in a person?"
)

/**
 * WildcardQuestionCard:
 * Interactive, tactile card displayed during 15m & 30m Wildcard slots.
 * Features customizable prompt ideas, shuffle generator, dynamic spring motion,
 * and glowing ember aura.
 */
@Composable
fun WildcardQuestionCard(
    relationshipType: RelationshipType,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val reducedMotion = isReducedMotion()
    val allPrompts = when (relationshipType) {
        RelationshipType.COUPLE -> WILDCARD_COUPLE_PROMPTS
        RelationshipType.FRIEND -> WILDCARD_FRIEND_PROMPTS
        RelationshipType.JUST_MET -> WILDCARD_JUSTMET_PROMPTS
    }

    var selectedPrompt by remember { mutableStateOf<String?>(null) }
    var promptOffset by remember { mutableIntStateOf(0) }

    // Breathing ember glow animation
    val infiniteTransition = rememberInfiniteTransition(label = "wildcard_glow")
    val glowAlpha by if (reducedMotion) {
        remember { mutableStateOf(0.4f) }
    } else {
        infiniteTransition.animateFloat(
            initialValue = 0.25f,
            targetValue = 0.65f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 1800, easing = TonightMotionTokens.CalmEaseInOut),
                repeatMode = RepeatMode.Reverse
            ),
            label = "glow_alpha"
        )
    }

    val badgeScale by if (reducedMotion) {
        remember { mutableStateOf(1.0f) }
    } else {
        infiniteTransition.animateFloat(
            initialValue = 1.0f,
            targetValue = 1.04f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 1800, easing = TonightMotionTokens.CalmEaseInOut),
                repeatMode = RepeatMode.Reverse
            ),
            label = "badge_scale"
        )
    }

    SoftCard(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.5.dp,
                color = TonightTheme.colors.ember.copy(alpha = glowAlpha),
                shape = RoundedCornerShape(24.dp)
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 22.dp, vertical = 26.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Sparkle Wildcard Header Badge with subtle pulsing scale & glowing aura
            Box(
                modifier = Modifier
                    .scale(badgeScale)
                    .clip(PillShape)
                    .background(TonightTheme.colors.ember.copy(alpha = 0.12f))
                    .border(1.dp, TonightTheme.colors.ember.copy(alpha = glowAlpha), PillShape)
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = AppIcons.Sparkle,
                        contentDescription = null,
                        tint = TonightTheme.colors.ember,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "WILDCARD · ASK ANYTHING",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            letterSpacing = 1.2.sp,
                            fontWeight = FontWeight.Bold,
                            color = TonightTheme.colors.ember
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Main Display Question (Selected prompt or default directive)
            AnimatedContent(
                targetState = selectedPrompt,
                transitionSpec = {
                    if (reducedMotion) {
                        fadeIn(animationSpec = tween(0)) togetherWith fadeOut(animationSpec = tween(0))
                    } else {
                        (fadeIn(animationSpec = tween(260, easing = TonightMotionTokens.GentleDecelerate)) +
                                slideInVertically(animationSpec = spring(stiffness = Spring.StiffnessMediumLow)) { it / 4 })
                            .togetherWith(
                                fadeOut(animationSpec = tween(160, easing = TonightMotionTokens.CalmEaseInOut)) +
                                        slideOutVertically(animationSpec = tween(160)) { -it / 4 }
                            )
                    }
                },
                label = "wildcard_display"
            ) { prompt ->
                Text(
                    text = prompt ?: "Your turn to ask anything you've been curious about — no filters, no pressure.",
                    style = if (prompt != null) TonightTheme.typography.displayL.copy(fontSize = 22.sp, lineHeight = 30.sp)
                    else TonightTheme.typography.questionXL,
                    color = TonightTheme.colors.ink,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 4.dp)
                        .semantics { heading() }
                )
            }

            Spacer(modifier = Modifier.height(22.dp))

            // Subtle Divider
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .height(1.dp)
                    .background(TonightTheme.colors.hairline)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Inspiration header + Shuffle button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "NEED INSPIRATION?",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 11.sp,
                        letterSpacing = 1.sp,
                        fontWeight = FontWeight.Bold,
                        color = TonightTheme.colors.muted
                    )
                )

                Row(
                    modifier = Modifier
                        .clip(PillShape)
                        .clickable {
                            view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                            promptOffset = (promptOffset + 3) % allPrompts.size
                        }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = AppIcons.TurnPass,
                        contentDescription = "Shuffle ideas",
                        tint = TonightTheme.colors.ember,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Shuffle",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TonightTheme.colors.ember
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 3 Inspiration Prompt Cards with smooth animated transitions on shuffle
            AnimatedContent(
                targetState = promptOffset,
                transitionSpec = {
                    if (reducedMotion) {
                        fadeIn(animationSpec = tween(0)) togetherWith fadeOut(animationSpec = tween(0))
                    } else {
                        (fadeIn(animationSpec = tween(220, easing = TonightMotionTokens.GentleDecelerate)) +
                                slideInVertically(animationSpec = spring(stiffness = Spring.StiffnessMediumLow, dampingRatio = Spring.DampingRatioNoBouncy)) { it / 3 })
                            .togetherWith(
                                fadeOut(animationSpec = tween(150, easing = TonightMotionTokens.CalmEaseInOut)) +
                                        slideOutVertically(animationSpec = tween(150)) { -it / 3 }
                            )
                    }
                },
                label = "inspiration_deck_shuffle"
            ) { offset ->
                val currentCards = remember(offset, relationshipType) {
                    listOf(
                        allPrompts[offset % allPrompts.size],
                        allPrompts[(offset + 1) % allPrompts.size],
                        allPrompts[(offset + 2) % allPrompts.size]
                    )
                }

                Column(modifier = Modifier.fillMaxWidth()) {
                    currentCards.forEach { promptItem ->
                        val isCardSelected = selectedPrompt == promptItem

                        val cardBg by animateColorAsState(
                            targetValue = if (isCardSelected) TonightTheme.colors.ember.copy(alpha = 0.10f) else TonightTheme.colors.canvas,
                            animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
                            label = "prompt_bg"
                        )
                        val cardBorderColor by animateColorAsState(
                            targetValue = if (isCardSelected) TonightTheme.colors.ember else TonightTheme.colors.hairline,
                            animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
                            label = "prompt_border"
                        )
                        val cardScale by animateFloatAsState(
                            targetValue = if (isCardSelected) 1.015f else 1.0f,
                            animationSpec = spring(stiffness = Spring.StiffnessMedium, dampingRatio = Spring.DampingRatioNoBouncy),
                            label = "prompt_scale"
                        )

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .scale(cardScale)
                                .clip(RoundedCornerShape(14.dp))
                                .background(cardBg)
                                .border(
                                    width = if (isCardSelected) 1.5.dp else 1.dp,
                                    color = cardBorderColor,
                                    shape = RoundedCornerShape(14.dp)
                                )
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    selectedPrompt = if (selectedPrompt == promptItem) null else promptItem
                                }
                                .padding(horizontal = 14.dp, vertical = 10.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "“$promptItem”",
                                    style = TonightTheme.typography.body.copy(
                                        fontSize = 13.sp,
                                        lineHeight = 18.sp,
                                        fontWeight = if (isCardSelected) FontWeight.Medium else FontWeight.Normal
                                    ),
                                    color = if (isCardSelected) TonightTheme.colors.ink else TonightTheme.colors.body,
                                    modifier = Modifier.weight(1f)
                                )

                                if (isCardSelected) {
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Icon(
                                        imageVector = AppIcons.CheckCircle,
                                        contentDescription = "Selected prompt",
                                        tint = TonightTheme.colors.ember,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
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

@Preview(name = "WildcardQuestionCard Preview", showBackground = true)
@Composable
private fun WildcardQuestionCardPreview() {
    TonightTheme {
        WildcardQuestionCard(
            relationshipType = RelationshipType.COUPLE
        )
    }
}

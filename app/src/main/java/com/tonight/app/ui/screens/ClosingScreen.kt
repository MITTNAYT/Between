package com.tonight.app.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.CoralHeroCard
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.SparkButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.share.ShareCardExporter
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * ClosingScreen:
 * The 5-step post-session closing ritual:
 * 1) Spoken Landing Question
 * 2 & 3) Dual-sided in-memory Appreciation Exchange (top rotated 180°)
 * 4) Reveal Together
 * 5) Two-sided Moment of the Night save
 * 6) CoralHeroCard session summary & share card export
 */
@Composable
fun ClosingScreen(
    viewModel: ClosingViewModel,
    relationshipType: String,
    sessionLength: String,
    depthReached: Int,
    questionCount: Int,
    onFinish: () -> Unit,
    onViewMoments: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        viewModel.initSummary(
            sessionLength = sessionLength,
            relationshipType = relationshipType,
            depthReached = depthReached,
            questionCount = questionCount
        )
    }

    LaunchedEffect(uiState.isComplete) {
        if (uiState.isComplete) {
            onFinish()
        }
    }

    val currentDotIndex = when (uiState.step) {
        ClosingStep.LANDING_QUESTION -> 0
        ClosingStep.APPRECIATION_PERSON_A -> 1
        ClosingStep.APPRECIATION_PERSON_B -> 2
        ClosingStep.APPRECIATION_REVEAL -> 3
        ClosingStep.SAVE_MOMENT -> 3
        ClosingStep.SESSION_SUMMARY -> 4
    }

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(scrollState),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                // TOP PROGRESS PILL (3 dots for JUST_MET, 5 dots for COUPLE/FRIEND)
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(TonightTheme.colors.surface)
                        .border(1.dp, TonightTheme.colors.hairline, PillShape)
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    PageDots(
                        count = uiState.totalDots,
                        index = uiState.currentDotIndex
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                AnimatedContent(
                    targetState = uiState.step,
                    transitionSpec = {
                        fadeIn(animationSpec = tween(TonightMotionTokens.StandardDurationMs)) togetherWith
                            fadeOut(animationSpec = tween(TonightMotionTokens.QuickDurationMs))
                    },
                    label = "closing_steps"
                ) { step ->
                    when (step) {
                        // ==========================================
                        // 1) SPOKEN LANDING QUESTION (no typing)
                        // ==========================================
                        ClosingStep.LANDING_QUESTION -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "WRAP UP",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        letterSpacing = 1.2.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TonightTheme.colors.muted
                                    )
                                )

                                Spacer(modifier = Modifier.height(20.dp))

                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(28.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "What's one thing you'll remember from tonight?",
                                            style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
                                            color = TonightTheme.colors.ink,
                                            textAlign = TextAlign.Center,
                                            modifier = Modifier.semantics { heading() }
                                        )

                                        Spacer(modifier = Modifier.height(16.dp))

                                        Text(
                                            text = "Take a breath. Speak your answers aloud to each other. No typing.",
                                            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                                            color = TonightTheme.colors.muted,
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                }
                            }
                        }

                        // ==========================================
                        // 2) APPRECIATION EXCHANGE: Person A
                        // ==========================================
                        ClosingStep.APPRECIATION_PERSON_A -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "APPRECIATION",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        letterSpacing = 1.2.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TonightTheme.colors.muted
                                    )
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Person A SoftCard (Rotated 180° for the person across)
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .rotate(180f)
                                            .padding(20.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "Person A · Private",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                color = TonightTheme.colors.tilePink,
                                                fontWeight = FontWeight.Bold
                                            )
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = "What is one thing you appreciate about them?",
                                            style = TonightTheme.typography.titleM.copy(fontSize = 18.sp),
                                            color = TonightTheme.colors.ink,
                                            textAlign = TextAlign.Center
                                        )
                                        Spacer(modifier = Modifier.height(12.dp))
                                        BasicTextField(
                                            value = uiState.appreciationA,
                                            onValueChange = { viewModel.updateAppreciationA(it) },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(90.dp)
                                                .clip(TonightTheme.shapes.card)
                                                .background(TonightTheme.colors.canvas)
                                                .border(1.dp, TonightTheme.colors.hairline, TonightTheme.shapes.card)
                                                .padding(14.dp),
                                            textStyle = TonightTheme.typography.body.copy(color = TonightTheme.colors.ink),
                                            cursorBrush = SolidColor(TonightTheme.colors.ink),
                                            decorationBox = { inner ->
                                                if (uiState.appreciationA.isEmpty()) {
                                                    Text(
                                                        text = "I appreciate that you...",
                                                        style = TonightTheme.typography.body.copy(color = TonightTheme.colors.muted)
                                                    )
                                                }
                                                inner()
                                            }
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = "Type privately, then pass phone to Person B.",
                                    style = TonightTheme.typography.caption.copy(color = TonightTheme.colors.muted)
                                )
                            }
                        }

                        // ==========================================
                        // 3) APPRECIATION EXCHANGE: Person B
                        // ==========================================
                        ClosingStep.APPRECIATION_PERSON_B -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "APPRECIATION",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        letterSpacing = 1.2.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TonightTheme.colors.muted
                                    )
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Person B SoftCard (Upright)
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(20.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "Person B · Private",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                color = TonightTheme.colors.tileAmber,
                                                fontWeight = FontWeight.Bold
                                            )
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = "What is one thing you appreciate about them?",
                                            style = TonightTheme.typography.titleM.copy(fontSize = 18.sp),
                                            color = TonightTheme.colors.ink,
                                            textAlign = TextAlign.Center
                                        )
                                        Spacer(modifier = Modifier.height(12.dp))
                                        BasicTextField(
                                            value = uiState.appreciationB,
                                            onValueChange = { viewModel.updateAppreciationB(it) },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(90.dp)
                                                .clip(TonightTheme.shapes.card)
                                                .background(TonightTheme.colors.canvas)
                                                .border(1.dp, TonightTheme.colors.hairline, TonightTheme.shapes.card)
                                                .padding(14.dp),
                                            textStyle = TonightTheme.typography.body.copy(color = TonightTheme.colors.ink),
                                            cursorBrush = SolidColor(TonightTheme.colors.ink),
                                            decorationBox = { inner ->
                                                if (uiState.appreciationB.isEmpty()) {
                                                    Text(
                                                        text = "I appreciate that you...",
                                                        style = TonightTheme.typography.body.copy(color = TonightTheme.colors.muted)
                                                    )
                                                }
                                                inner()
                                            }
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = "Type privately, then place phone between you.",
                                    style = TonightTheme.typography.caption.copy(color = TonightTheme.colors.muted)
                                )
                            }
                        }

                        // ==========================================
                        // 4) APPRECIATION REVEAL TOGETHER
                        // ==========================================
                        ClosingStep.APPRECIATION_REVEAL -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "REVEAL TOGETHER",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        letterSpacing = 1.2.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TonightTheme.colors.muted
                                    )
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = "Read each other's words aloud.",
                                    style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                                    color = TonightTheme.colors.ink,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(20.dp))

                                // Person A SoftCard
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(18.dp)
                                    ) {
                                        Text(
                                            text = "PERSON A",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = TonightTheme.colors.tilePink
                                            )
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = if (uiState.appreciationA.isNotBlank()) "“${uiState.appreciationA}”" else "“Thank you for being here with me tonight.”",
                                            style = TonightTheme.typography.body.copy(
                                                fontSize = 16.sp,
                                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                                            ),
                                            color = TonightTheme.colors.ink
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // Person B SoftCard
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(18.dp)
                                    ) {
                                        Text(
                                            text = "PERSON B",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = TonightTheme.colors.tileAmber
                                            )
                                        )
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = if (uiState.appreciationB.isNotBlank()) "“${uiState.appreciationB}”" else "“Thank you for listening and being open.”",
                                            style = TonightTheme.typography.body.copy(
                                                fontSize = 16.sp,
                                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                                            ),
                                            color = TonightTheme.colors.ink
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Text(
                                    text = "These appreciations were kept in memory only and will not be stored.",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        color = TonightTheme.colors.muted
                                    ),
                                    textAlign = TextAlign.Center
                                )
                            }
                        }

                        // ==========================================
                        // 5) SAVE MOMENT OF THE NIGHT (Room DB)
                        // ==========================================
                        ClosingStep.SAVE_MOMENT -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "MOMENT OF THE NIGHT",
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 12.sp,
                                        letterSpacing = 1.2.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TonightTheme.colors.muted
                                    )
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = "Save a memory to your private vault.",
                                    style = TonightTheme.typography.displayL.copy(fontSize = 20.sp),
                                    color = TonightTheme.colors.ink,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(18.dp))

                                // Person A SoftCard (Rotated 180°)
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .rotate(180f)
                                            .padding(16.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "Person A's moment",
                                                style = TonightTheme.typography.caption.copy(
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = TonightTheme.colors.tilePink
                                                )
                                            )
                                            Text(
                                                text = "${uiState.momentTextA.length}/280",
                                                style = TonightTheme.typography.caption.copy(color = TonightTheme.colors.muted)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(8.dp))
                                        BasicTextField(
                                            value = uiState.momentTextA,
                                            onValueChange = { viewModel.updateMomentTextA(it) },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(70.dp)
                                                .clip(TonightTheme.shapes.card)
                                                .background(TonightTheme.colors.canvas)
                                                .border(1.dp, TonightTheme.colors.hairline, TonightTheme.shapes.card)
                                                .padding(10.dp),
                                            textStyle = TonightTheme.typography.body.copy(color = TonightTheme.colors.ink),
                                            cursorBrush = SolidColor(TonightTheme.colors.ink),
                                            decorationBox = { inner ->
                                                if (uiState.momentTextA.isEmpty()) {
                                                    Text(
                                                        text = "A phrase, feeling, or memory (optional)",
                                                        style = TonightTheme.typography.body.copy(
                                                            fontSize = 14.sp,
                                                            color = TonightTheme.colors.muted
                                                        )
                                                    )
                                                }
                                                inner()
                                            }
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // Person B SoftCard (Upright)
                                SoftCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "Person B's moment",
                                                style = TonightTheme.typography.caption.copy(
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = TonightTheme.colors.tileAmber
                                                )
                                            )
                                            Text(
                                                text = "${uiState.momentTextB.length}/280",
                                                style = TonightTheme.typography.caption.copy(color = TonightTheme.colors.muted)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(8.dp))
                                        BasicTextField(
                                            value = uiState.momentTextB,
                                            onValueChange = { viewModel.updateMomentTextB(it) },
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(70.dp)
                                                .clip(TonightTheme.shapes.card)
                                                .background(TonightTheme.colors.canvas)
                                                .border(1.dp, TonightTheme.colors.hairline, TonightTheme.shapes.card)
                                                .padding(10.dp),
                                            textStyle = TonightTheme.typography.body.copy(color = TonightTheme.colors.ink),
                                            cursorBrush = SolidColor(TonightTheme.colors.ink),
                                            decorationBox = { inner ->
                                                if (uiState.momentTextB.isEmpty()) {
                                                    Text(
                                                        text = "A phrase, feeling, or memory (optional)",
                                                        style = TonightTheme.typography.body.copy(
                                                            fontSize = 14.sp,
                                                            color = TonightTheme.colors.muted
                                                        )
                                                    )
                                                }
                                                inner()
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        // ==========================================
                        // 6) SESSION SUMMARY & SHARE CARD
                        // ==========================================
                        ClosingStep.SESSION_SUMMARY -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                // CoralHeroCard Summary
                                CoralHeroCard(modifier = Modifier.fillMaxWidth()) {
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(28.dp),
                                        horizontalAlignment = Alignment.CenterHorizontally
                                    ) {
                                        Text(
                                            text = "We reached Level ${uiState.depthReached} tonight",
                                            style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                                            color = Color.White,
                                            textAlign = TextAlign.Center,
                                            modifier = Modifier.semantics { heading() }
                                        )

                                        Spacer(modifier = Modifier.height(12.dp))

                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .clip(PillShape)
                                                    .background(Color.White.copy(alpha = 0.25f))
                                                    .padding(horizontal = 14.dp, vertical = 6.dp)
                                            ) {
                                                Text(
                                                    text = if (uiState.sessionLength == "DEEP") "30 mins" else "15 mins",
                                                    style = TonightTheme.typography.caption.copy(
                                                        fontSize = 13.sp,
                                                        fontWeight = FontWeight.SemiBold,
                                                        color = Color.White
                                                    )
                                                )
                                            }

                                            Box(
                                                modifier = Modifier
                                                    .clip(PillShape)
                                                    .background(Color.White.copy(alpha = 0.25f))
                                                    .padding(horizontal = 14.dp, vertical = 6.dp)
                                            ) {
                                                Text(
                                                    text = "${uiState.questionCount} questions",
                                                    style = TonightTheme.typography.caption.copy(
                                                        fontSize = 13.sp,
                                                        fontWeight = FontWeight.SemiBold,
                                                        color = Color.White
                                                    )
                                                )
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(16.dp))

                                        Text(
                                            text = "Spoken together · Eye to eye · One phone",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                color = Color.White.copy(alpha = 0.9f)
                                            ),
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                }

                                if (uiState.showNextTimeLabel) {
                                    Spacer(modifier = Modifier.height(20.dp))

                                    // Gentle Planning Label
                                    Box(
                                        modifier = Modifier
                                            .softShadow(borderRadius = 22.dp, blurRadius = 12.dp, offsetY = 3.dp)
                                            .clip(PillShape)
                                            .background(TonightTheme.colors.surface)
                                            .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                            .padding(horizontal = 18.dp, vertical = 8.dp)
                                    ) {
                                        Text(
                                            text = "Same time next week?",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = TonightTheme.colors.ink
                                            )
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // BOTTOM ACTIONS
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 28.dp, top = 24.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                when (uiState.step) {
                    ClosingStep.LANDING_QUESTION -> {
                        val isJustMet = uiState.relTypeEnum == com.tonight.app.engine.RelationshipType.JUST_MET
                        PrimaryButton(
                            text = if (isJustMet) "Save a Moment of the Night" else "Next: Appreciation Exchange",
                            onClick = { viewModel.advanceStep() },
                            contentDescription = if (isJustMet) "Proceed to save a moment" else "Proceed to appreciation exchange"
                        )
                    }
                    ClosingStep.APPRECIATION_PERSON_A -> {
                        PrimaryButton(
                            text = "Done, Pass Phone to Person B",
                            onClick = { viewModel.advanceStep() },
                            contentDescription = "Pass phone to partner"
                        )
                    }
                    ClosingStep.APPRECIATION_PERSON_B -> {
                        SparkButton(
                            text = "Reveal together",
                            onClick = { viewModel.advanceStep() },
                            contentDescription = "Reveal appreciations together"
                        )
                    }
                    ClosingStep.APPRECIATION_REVEAL -> {
                        PrimaryButton(
                            text = "Save a Moment of the Night",
                            onClick = { viewModel.advanceStep() },
                            contentDescription = "Proceed to save a moment"
                        )
                    }
                    ClosingStep.SAVE_MOMENT -> {
                        PrimaryButton(
                            text = if (uiState.momentTextA.isNotBlank() || uiState.momentTextB.isNotBlank()) "Save Moments & Complete" else "Complete Session",
                            onClick = { viewModel.saveMomentsAndShowSummary() },
                            contentDescription = "Save moments and complete"
                        )
                        SecondaryButton(
                            text = "Skip saving",
                            onClick = { viewModel.advanceStep() },
                            contentDescription = "Skip saving moment"
                        )
                    }
                    ClosingStep.SESSION_SUMMARY -> {
                        SparkButton(
                            text = "Share Summary Card",
                            onClick = {
                                ShareCardExporter.shareSessionCard(
                                    context = context,
                                    depthReached = depthReached,
                                    sessionLength = sessionLength
                                )
                            },
                            contentDescription = "Share session summary card"
                        )
                        SecondaryButton(
                            text = "View Saved Moments",
                            onClick = onViewMoments,
                            contentDescription = "View past saved moments"
                        )
                        SecondaryButton(
                            text = "Return Home",
                            onClick = onFinish,
                            contentDescription = "Return to home screen"
                        )
                    }
                }
            }
        }
    }
}

@Preview(name = "ClosingScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun ClosingScreenPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "What's one thing you'll remember from tonight?",
                style = TonightTheme.typography.displayL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@Preview(name = "ClosingScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun ClosingScreenLargeFontPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "What's one thing you'll remember from tonight?",
                style = TonightTheme.typography.displayL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

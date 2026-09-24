package com.tonight.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import com.tonight.app.ui.theme.AppIcons
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.tonight.app.ui.theme.SheetTopShape
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.engine.ArcPhase
import com.tonight.app.engine.Category
import com.tonight.app.engine.Question
import com.tonight.app.engine.QuestionStatus
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import com.tonight.app.ui.components.BottomSheetSurface
import com.tonight.app.ui.components.Chip
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.SheetTopShape
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.isReducedMotion
import com.tonight.app.ui.theme.softShadow

/**
 * SessionScreen:
 * The primary ritual facilitation screen.
 * Restyled with light wellness aesthetics:
 * - TonightScreen canvas with blushGlow
 * - Top: Close CircleIconButton & centered phase Chip
 * - Center: question in questionXL serif, centered, dark ink on canvas
 * - Turn indicator: small Chip "Person A's turn to answer"
 * - Follow-up: SecondaryButton opening BottomSheetSurface
 * - Lighter / Deeper: two small white pills with arrow icons
 * - Bottom row: Pass button, 5-phase PageDots, 56dp ink circle Next button
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SessionScreen(
    viewModel: SessionViewModel,
    onSessionFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val view = LocalView.current
    val reducedMotion = isReducedMotion()
    var showExitConfirmSheet by remember { mutableStateOf(false) }

    // Keep screen on during active session
    DisposableEffect(Unit) {
        view.keepScreenOn = true
        onDispose {
            view.keepScreenOn = false
        }
    }

    // Session finished trigger
    LaunchedEffect(uiState.isSessionFinished) {
        if (uiState.isSessionFinished) {
            view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
            onSessionFinished()
        }
    }

    // Paywall Interstitial
    if (uiState.isPaywallPending) {
        val paywallViewModel: PaywallViewModel = androidx.hilt.navigation.compose.hiltViewModel()
        PaywallScreen(
            viewModel = paywallViewModel,
            trigger = uiState.paywallTrigger,
            onDismiss = { viewModel.dismissPaywall() },
            onSuccess = { viewModel.onPaywallPurchased() }
        )
        return
    }

    // Handshake Interstitial
    if (uiState.isHandshakePending) {
        HandshakeScreen(
            onConfirmed = { viewModel.confirmHandshake() },
            onDeclined = { viewModel.declineHandshake() }
        )
        return
    }

    val currentQuestion = uiState.currentQuestion ?: return

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // TOP BAR: Close CircleIconButton + Centered Phase Chip + Soundscape Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CircleIconButton(
                    icon = AppIcons.Close,
                    onClick = { showExitConfirmSheet = true },
                    contentDescription = "Exit session"
                )

                val phaseLabel = uiState.phaseDisplayName

                Chip(
                    text = phaseLabel,
                    isSelected = true
                )

                // Right balancing spacer to ensure centered phase chip
                Spacer(modifier = Modifier.size(44.dp))
            }

            // CENTER QUESTION DISPLAY
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                contentAlignment = Alignment.Center
            ) {
                AnimatedContent(
                    targetState = currentQuestion,
                    transitionSpec = {
                        if (reducedMotion) {
                            fadeIn(animationSpec = tween(0)) togetherWith fadeOut(animationSpec = tween(0))
                        } else {
                            fadeIn(
                                animationSpec = tween(
                                    durationMillis = 350,
                                    easing = TonightMotionTokens.CalmEaseInOut
                                )
                            ) togetherWith fadeOut(
                                animationSpec = tween(
                                    durationMillis = 200,
                                    easing = TonightMotionTokens.CalmEaseInOut
                                )
                            )
                        }
                    },
                    label = "question_crossfade"
                ) { question ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = question.text,
                            style = TonightTheme.typography.questionXL,
                            color = TonightTheme.colors.ink,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 8.dp)
                                .semantics { heading() }
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        var turnSwap by remember(uiState.currentIndex) { mutableStateOf(false) }
                        val isPersonA = if (!turnSwap) (uiState.currentIndex % 2 == 0) else (uiState.currentIndex % 2 != 0)
                        val turnText = if (isPersonA) "Person A's turn to answer" else "Person B's turn to answer"

                        Box(
                            modifier = Modifier
                                .softShadow(borderRadius = 16.dp, blurRadius = 8.dp, offsetY = 2.dp)
                                .clip(PillShape)
                                .background(TonightTheme.colors.surface)
                                .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                    turnSwap = !turnSwap
                                }
                                .padding(horizontal = 14.dp, vertical = 7.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = AppIcons.TurnPass,
                                    contentDescription = "Pass turn",
                                    tint = TonightTheme.colors.ember,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = turnText,
                                    style = TonightTheme.typography.caption.copy(
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = TonightTheme.colors.body
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // CONTROLS SECTION
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Follow-up SecondaryButton
                SecondaryButton(
                    text = "Follow-up",
                    onClick = {
                        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                        viewModel.toggleFollowUps(true)
                    },
                    contentDescription = "View follow-up questions for the listener"
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Lighter / Deeper controls: Two small white pills with vector arrow icons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Lighter Pill
                    Box(
                        modifier = Modifier
                            .height(44.dp)
                            .defaultMinSize(minWidth = 110.dp, minHeight = 44.dp)
                            .softShadow(borderRadius = 22.dp, blurRadius = 12.dp, offsetY = 3.dp)
                            .clip(PillShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, PillShape)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                viewModel.lighterQuestion()
                            }
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = AppIcons.ArrowDown,
                                contentDescription = null,
                                tint = TonightTheme.colors.ink,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Lighter",
                                style = TonightTheme.typography.caption.copy(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TonightTheme.colors.ink
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    // Deeper Pill (Disabled at maxDepth)
                    val isDeeperDisabled = uiState.isDeeperDisabled
                    val deeperAlpha = if (isDeeperDisabled) 0.35f else 1f
                    val deeperSemantics = if (isDeeperDisabled) "Deeper unavailable at maximum depth" else "Request a deeper question"

                    Box(
                        modifier = Modifier
                            .height(44.dp)
                            .defaultMinSize(minWidth = 110.dp, minHeight = 44.dp)
                            .softShadow(borderRadius = 22.dp, blurRadius = 12.dp, offsetY = 3.dp)
                            .clip(PillShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, PillShape)
                            .clickable(enabled = !isDeeperDisabled) {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                viewModel.deeperQuestion()
                            }
                            .padding(horizontal = 16.dp)
                            .semantics {
                                contentDescription = deeperSemantics
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 2.dp)
                        ) {
                            Icon(
                                imageVector = AppIcons.ArrowUp,
                                contentDescription = null,
                                tint = TonightTheme.colors.ink.copy(alpha = deeperAlpha),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Deeper",
                                style = TonightTheme.typography.caption.copy(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TonightTheme.colors.ink.copy(alpha = deeperAlpha)
                                )
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Bottom row: Pass (with label), Dynamic PageDots pill, 56dp Next button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Pass Button
                    Box(
                        modifier = Modifier
                            .height(48.dp)
                            .softShadow(borderRadius = 24.dp, blurRadius = 12.dp, offsetY = 3.dp)
                            .clip(PillShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, PillShape)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                viewModel.passQuestion()
                            }
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Pass",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TonightTheme.colors.muted
                            )
                        )
                    }

                    // Dynamic Phase PageDots Pill (4 dots for JUST_MET, 5 for COUPLE/FRIEND)
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, PillShape)
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        PageDots(
                            count = uiState.totalPhases,
                            index = uiState.currentPhaseIndex
                        )
                    }

                    // 56dp Ink Circle Next Button
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .softShadow(borderRadius = 28.dp, blurRadius = 14.dp, offsetY = 4.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.ink)
                            .clickable {
                                view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                                viewModel.nextQuestion()
                            }
                            .semantics { contentDescription = "Next question" },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.Forward,
                            contentDescription = null,
                            tint = TonightTheme.colors.surface,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }
        }
    }

    // Follow-up Prompts Bottom Sheet (Swipeable Horizontal Pager)
    if (uiState.showFollowUps) {
        val followUpSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
        val followUps = currentQuestion.followUps
        val followUpPagerState = androidx.compose.foundation.pager.rememberPagerState(pageCount = { followUps.size })

        ModalBottomSheet(
            onDismissRequest = { viewModel.toggleFollowUps(false) },
            sheetState = followUpSheetState,
            shape = SheetTopShape,
            containerColor = TonightTheme.colors.surface,
            scrimColor = Color(0x40000000),
            dragHandle = null
        ) {
            BottomSheetSurface(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "FOR THE LISTENER",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            letterSpacing = 1.2.sp,
                            fontWeight = FontWeight.Bold,
                            color = TonightTheme.colors.muted
                        ),
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "Invitations to go further",
                        style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center
                    )

                    if (followUps.size > 1) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Follow-up ${followUpPagerState.currentPage + 1} of ${followUps.size} · Swipe for next",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 13.sp,
                                color = TonightTheme.colors.muted
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    androidx.compose.foundation.pager.HorizontalPager(
                        state = followUpPagerState,
                        modifier = Modifier.fillMaxWidth()
                    ) { page ->
                        val prompt = followUps.getOrNull(page) ?: ""
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 4.dp)
                                .clip(PillShape)
                                .background(TonightTheme.colors.canvas)
                                .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                .padding(horizontal = 24.dp, vertical = 22.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "“$prompt”",
                                style = TonightTheme.typography.titleM.copy(
                                    fontSize = 18.sp,
                                    lineHeight = 26.sp,
                                    fontWeight = FontWeight.Medium
                                ),
                                color = TonightTheme.colors.ink,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (followUps.size > 1) {
                        PageDots(
                            count = followUps.size,
                            index = followUpPagerState.currentPage
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                    } else {
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    PrimaryButton(
                        text = "Done",
                        onClick = { viewModel.toggleFollowUps(false) },
                        contentDescription = "Close follow-up prompts"
                    )
                }
            }
        }
    }

    // Leave Conversation Confirmation Sheet
    if (showExitConfirmSheet) {
        val exitSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
        ModalBottomSheet(
            onDismissRequest = { showExitConfirmSheet = false },
            sheetState = exitSheetState,
            shape = SheetTopShape,
            containerColor = TonightTheme.colors.surface,
            scrimColor = Color(0x40000000),
            dragHandle = null
        ) {
            BottomSheetSurface(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Leave this conversation?",
                        style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Your session progress will end for tonight.",
                        style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                        color = TonightTheme.colors.muted,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(28.dp))

                    PrimaryButton(
                        text = "Stay in session",
                        onClick = { showExitConfirmSheet = false },
                        contentDescription = "Stay in session"
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    SecondaryButton(
                        text = "End conversation",
                        onClick = {
                            showExitConfirmSheet = false
                            onSessionFinished()
                        },
                        contentDescription = "End conversation and leave"
                    )
                }
            }
        }
    }
}

@Preview(name = "SessionScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun SessionScreenPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "What is something you rarely say aloud?",
                style = TonightTheme.typography.questionXL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@Preview(name = "SessionScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun SessionScreenLargeFontPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "What is something you rarely say aloud?",
                style = TonightTheme.typography.questionXL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}


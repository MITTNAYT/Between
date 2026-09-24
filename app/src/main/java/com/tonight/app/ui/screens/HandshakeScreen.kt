package com.tonight.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow
import kotlinx.coroutines.delay

/**
 * Depth Handshake Screen:
 * Full-screen split for two people sitting opposite each other.
 * Top half is rotated 180° so Person A reads it upright.
 * Both must simultaneously hold their 160dp spark ring for ~1.5s.
 */
@Composable
fun HandshakeScreen(
    onConfirmed: () -> Unit,
    onDeclined: () -> Unit,
    modifier: Modifier = Modifier
) {
    var topHeld by remember { mutableStateOf(false) }
    var bottomHeld by remember { mutableStateOf(false) }
    var holdProgress by remember { mutableFloatStateOf(0f) }

    val view = LocalView.current
    val sparkBrush = TonightTheme.brushes.spark

    // Simultaneous hold timer logic (~1.5s)
    LaunchedEffect(topHeld, bottomHeld) {
        if (topHeld && bottomHeld) {
            val totalSteps = 30
            val stepDelayMs = TonightMotionTokens.HandshakeHoldMs / totalSteps
            for (step in 1..totalSteps) {
                delay(stepDelayMs)
                if (!topHeld || !bottomHeld) {
                    holdProgress = 0f
                    return@LaunchedEffect
                }
                holdProgress = step.toFloat() / totalSteps.toFloat()

                // Tactile progressive haptics as ring fills
                if (step % 6 == 0) {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                }
            }
            // Handshake confirmed!
            view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
            onConfirmed()
        } else {
            // Immediate reset on early release
            holdProgress = 0f
        }
    }

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // ==========================================
            // TOP HALF (Person A, Rotated 180°)
            // ==========================================
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
                    .pointerInput(Unit) {
                        awaitEachGesture {
                            awaitFirstDown()
                            topHeld = true
                            waitForUpOrCancellation()
                            topHeld = false
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .rotate(180f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "The next questions are more personal.",
                        style = TonightTheme.typography.displayL.copy(fontSize = 18.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Person A · Hold together",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 13.sp,
                            color = TonightTheme.colors.muted
                        ),
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // 160dp Hold Ring
                    HoldRing(
                        sizeDp = 160,
                        isHeld = topHeld,
                        progress = holdProgress,
                        sparkBrush = sparkBrush
                    )
                }
            }

            // ==========================================
            // CENTER DIVIDER WITH "NOT NOW" BUTTON
            // ==========================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                // Background hairline divider line
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(TonightTheme.colors.hairline)
                )

                // SecondaryButton "Not now" centered on divider
                SecondaryButton(
                    text = "Not now",
                    onClick = onDeclined,
                    contentDescription = "Decline handshake and stay with lighter questions"
                )
            }

            // ==========================================
            // BOTTOM HALF (Person B, Upright)
            // ==========================================
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
                    .pointerInput(Unit) {
                        awaitEachGesture {
                            awaitFirstDown()
                            bottomHeld = true
                            waitForUpOrCancellation()
                            bottomHeld = false
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // 160dp Hold Ring
                    HoldRing(
                        sizeDp = 160,
                        isHeld = bottomHeld,
                        progress = holdProgress,
                        sparkBrush = sparkBrush
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Text(
                        text = "The next questions are more personal.",
                        style = TonightTheme.typography.displayL.copy(fontSize = 18.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Person B · Hold together",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 13.sp,
                            color = TonightTheme.colors.muted
                        ),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

/**
 * 160dp Hold Ring:
 * - Circular track in hairline (#E6E6E6)
 * - Progress arc in spark gradient
 * - Center surface disc displaying "Hold" / "Holding..."
 */
@Composable
private fun HoldRing(
    sizeDp: Int,
    isHeld: Boolean,
    progress: Float,
    sparkBrush: androidx.compose.ui.graphics.Brush,
    modifier: Modifier = Modifier
) {
    val hairlineColor = TonightTheme.colors.hairline
    val surfaceColor = TonightTheme.colors.surface

    Box(
        modifier = modifier.size(sizeDp.dp),
        contentAlignment = Alignment.Center
    ) {
        // Background track & active spark progress arc
        Canvas(modifier = Modifier.size((sizeDp - 8).dp)) {
            val strokeWidth = 8.dp.toPx()
            val diameter = size.minDimension - strokeWidth
            val topLeft = Offset(strokeWidth / 2f, strokeWidth / 2f)
            val arcSize = Size(diameter, diameter)

            // Hairline track (#E6E6E6)
            drawArc(
                color = hairlineColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(strokeWidth, cap = StrokeCap.Round)
            )

            // Active Spark Arc
            if (progress > 0f) {
                drawArc(
                    brush = sparkBrush,
                    startAngle = -90f,
                    sweepAngle = 360f * progress,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(strokeWidth + 2.dp.toPx(), cap = StrokeCap.Round)
                )
            }
        }

        // Inner center touch circle
        Box(
            modifier = Modifier
                .size((sizeDp - 44).dp)
                .softShadow(borderRadius = 60.dp, blurRadius = 14.dp, offsetY = 4.dp)
                .clip(CircleShape)
                .background(surfaceColor)
                .border(
                    width = if (isHeld) 2.dp else 1.dp,
                    color = if (isHeld) TonightTheme.colors.tilePink else hairlineColor,
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (isHeld) "Holding..." else "Hold",
                style = TonightTheme.typography.titleM.copy(
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = if (isHeld) TonightTheme.colors.tilePink else TonightTheme.colors.ink
                )
            )
        }
    }
}

@Preview(name = "HandshakeScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun HandshakeScreenPreview() {
    TonightTheme {
        HandshakeScreen(
            onConfirmed = {},
            onDeclined = {}
        )
    }
}

@Preview(name = "HandshakeScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun HandshakeScreenLargeFontPreview() {
    TonightTheme {
        HandshakeScreen(
            onConfirmed = {},
            onDeclined = {}
        )
    }
}


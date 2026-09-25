package com.tonight.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.TonightTheme

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * BreathPacerScreen:
 * A mindful breath grounding ritual before starting a conversation.
 * Features Gentle Haptic Heartbeat / Breath Sync to ground both partners in 3-5 seconds.
 * Users can tap anywhere or press "Begin conversation" to advance immediately.
 */
@Composable
fun BreathPacerScreen(
    onReady: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val infiniteTransition = rememberInfiniteTransition(label = "breath_pacer")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.88f,
        targetValue = 1.12f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    // Gentle Haptic Heartbeat / Breath Sync + 3.5s Snappy Grounding Auto-advance
    LaunchedEffect(Unit) {
        view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
        val hapticJob = launch {
            while (isActive) {
                delay(1100)
                view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                delay(180)
                view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                delay(920)
            }
        }
        delay(3500)
        hapticJob.cancel()
        onReady()
    }

    TonightScreen(
        modifier = modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null
        ) {
            onReady()
        },
        showBlushGlow = true
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.weight(1f)
            ) {
                // Breathing concentric circle with soothing rhythm & heartbeat sync
                Box(
                    modifier = Modifier
                        .size(170.dp)
                        .scale(scale),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(170.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.ember.copy(alpha = 0.08f))
                    )
                    Box(
                        modifier = Modifier
                            .size(125.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.5.dp, TonightTheme.colors.hairline, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (scale > 1.0f) "Breathe in" else "Settle in",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TonightTheme.colors.ink
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                Text(
                    text = "Put the phone between you",
                    style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                    color = TonightTheme.colors.ink,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Take turns answering. Anyone can pass at any time.",
                    style = TonightTheme.typography.body.copy(fontSize = 14.sp, lineHeight = 21.sp),
                    color = TonightTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                com.tonight.app.ui.components.SparkButton(
                    text = "Begin conversation",
                    onClick = onReady,
                    contentDescription = "Begin conversation"
                )
            }
        }
    }
}

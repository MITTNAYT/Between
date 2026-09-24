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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
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
import kotlinx.coroutines.delay

/**
 * BreathPacerScreen:
 * A 4-second mindful breath grounding ritual before starting a conversation.
 */
@Composable
fun BreathPacerScreen(
    onReady: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val infiniteTransition = rememberInfiniteTransition(label = "breath_pacer")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.82f,
        targetValue = 1.18f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    LaunchedEffect(Unit) {
        view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
        delay(4000)
        onReady()
    }

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.weight(1f)
            ) {
                // Breathing concentric circle
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .scale(scale),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(160.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.ember.copy(alpha = 0.08f))
                    )
                    Box(
                        modifier = Modifier
                            .size(110.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.5.dp, TonightTheme.colors.hairline, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (scale > 1.0f) "Breathe in" else "Settle in",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TonightTheme.colors.ink
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(36.dp))

                Text(
                    text = "Put the phone between you",
                    style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                    color = TonightTheme.colors.ink,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Take turns answering. Anyone can pass at any time.",
                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                    color = TonightTheme.colors.muted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            TextButton(
                onClick = onReady,
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Text(
                    text = "Begin now",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TonightTheme.colors.ink
                    )
                )
            }
        }
    }
}

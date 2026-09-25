package com.tonight.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.TonightTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * OpeningAnimationScreen:
 * Apple-grade fluid opening sequence where two clean circles glide and interlock
 * into the Venn Loop mark with critically damped physics and plain English branding.
 */
@Composable
fun OpeningAnimationScreen(
    onAnimationFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val circleOffset = remember { Animatable(44f) }
    val circlesAlpha = remember { Animatable(0f) }
    val circlesScale = remember { Animatable(0.85f) }
    val intersectionGlowAlpha = remember { Animatable(0f) }
    val textAlpha = remember { Animatable(0f) }
    val tagAlpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        // Phase 1: Critically-damped glide into Venn Loop
        launch {
            circlesAlpha.animateTo(1f, tween(400, easing = FastOutSlowInEasing))
        }
        launch {
            circlesScale.animateTo(1f, spring(dampingRatio = 1.0f, stiffness = Spring.StiffnessMediumLow))
        }
        circleOffset.animateTo(16f, spring(dampingRatio = 1.0f, stiffness = Spring.StiffnessLow))

        view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)

        // Phase 2: Gentle center glow
        launch {
            intersectionGlowAlpha.animateTo(0.12f, tween(300))
        }

        // Phase 3: Typography entrance
        launch {
            textAlpha.animateTo(1f, tween(350, easing = FastOutSlowInEasing))
        }
        delay(150)
        launch {
            tagAlpha.animateTo(1f, tween(350, easing = FastOutSlowInEasing))
        }

        // Phase 4: Settle and advance smoothly
        delay(1000)
        onAnimationFinished()
    }

    TonightScreen(
        modifier = modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null
        ) {
            onAnimationFinished()
        },
        showBlushGlow = true
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Venn Loop Circles
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .scale(circlesScale.value)
                    .alpha(circlesAlpha.value),
                contentAlignment = Alignment.Center
            ) {
                // Subtle Center Glow
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .scale(1.2f)
                        .alpha(intersectionGlowAlpha.value)
                        .background(TonightTheme.colors.ember, CircleShape)
                )

                // Left Circle
                Box(
                    modifier = Modifier
                        .offset(x = (-circleOffset.value).dp)
                        .size(68.dp)
                        .border(2.5.dp, TonightTheme.colors.ink, CircleShape)
                )

                // Right Circle
                Box(
                    modifier = Modifier
                        .offset(x = circleOffset.value.dp)
                        .size(68.dp)
                        .border(2.5.dp, TonightTheme.colors.ink, CircleShape)
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Wordmark
            Text(
                text = "BETWEEN",
                style = TonightTheme.typography.displayL.copy(
                    fontSize = 22.sp,
                    letterSpacing = 5.sp,
                    fontWeight = FontWeight.Bold
                ),
                color = TonightTheme.colors.ink,
                modifier = Modifier.alpha(textAlpha.value)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Plain English Subtitle
            Text(
                text = "Questions that bring you closer.",
                style = TonightTheme.typography.caption.copy(
                    fontSize = 13.sp,
                    letterSpacing = 0.4.sp,
                    color = TonightTheme.colors.muted
                ),
                modifier = Modifier.alpha(tagAlpha.value)
            )
        }
    }
}

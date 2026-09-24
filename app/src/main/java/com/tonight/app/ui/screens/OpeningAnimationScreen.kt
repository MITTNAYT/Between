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
 * Cinematic opening ritual where two minimal circles slide and interlock into the Venn Loop mark.
 */
@Composable
fun OpeningAnimationScreen(
    onAnimationFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val circleOffset = remember { Animatable(50f) }
    val circlesAlpha = remember { Animatable(0f) }
    val circlesScale = remember { Animatable(0.7f) }
    val textAlpha = remember { Animatable(0f) }
    val tagAlpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        // Step 1: Fade in and slide circles together into interlocking Venn Loop
        launch {
            circlesAlpha.animateTo(1f, tween(500, easing = FastOutSlowInEasing))
        }
        launch {
            circlesScale.animateTo(1f, spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessMediumLow))
        }
        circleOffset.animateTo(16f, spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow))

        view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)

        // Step 2: Fade in brand typography
        launch {
            textAlpha.animateTo(1f, tween(400, easing = FastOutSlowInEasing))
        }
        delay(200)
        launch {
            tagAlpha.animateTo(1f, tween(400, easing = FastOutSlowInEasing))
        }

        // Step 3: Hold briefly, then transition to Home
        delay(1100)
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
            // Interlocking Venn Loop Circles
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .scale(circlesScale.value)
                    .alpha(circlesAlpha.value),
                contentAlignment = Alignment.Center
            ) {
                // Left Circle
                Box(
                    modifier = Modifier
                        .offset(x = (-circleOffset.value).dp)
                        .size(68.dp)
                        .border(3.dp, TonightTheme.colors.ink, CircleShape)
                )

                // Right Circle
                Box(
                    modifier = Modifier
                        .offset(x = circleOffset.value.dp)
                        .size(68.dp)
                        .border(3.dp, TonightTheme.colors.ink, CircleShape)
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Wordmark
            Text(
                text = "BETWEEN",
                style = TonightTheme.typography.displayL.copy(
                    fontSize = 24.sp,
                    letterSpacing = 6.sp,
                    fontWeight = FontWeight.Bold
                ),
                color = TonightTheme.colors.ink,
                modifier = Modifier.alpha(textAlpha.value)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Subtitle
            Text(
                text = "Mindful connection rituals",
                style = TonightTheme.typography.caption.copy(
                    fontSize = 13.sp,
                    letterSpacing = 1.sp,
                    color = TonightTheme.colors.muted
                ),
                modifier = Modifier.alpha(tagAlpha.value)
            )
        }
    }
}

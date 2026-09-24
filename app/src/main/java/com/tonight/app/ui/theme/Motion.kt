package com.tonight.app.ui.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf

// =============================================================================
// TONIGHT MOTION
// Gentle, unhurried easing under 400ms, with explicit reduced-motion support.
// =============================================================================

object TonightMotionTokens {
    val GentleDecelerate: Easing = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
    val CalmEaseInOut: Easing = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)

    const val QuickDurationMs: Int = 180
    const val StandardDurationMs: Int = 340
    const val CrossFadeDurationMs: Int = 380
    const val HandshakeHoldMs: Long = 1500L

    val CardSpring = spring<Float>(
        dampingRatio = Spring.DampingRatioNoBouncy,
        stiffness = Spring.StiffnessMediumLow
    )

    val PressedSpring = spring<Float>(
        dampingRatio = Spring.DampingRatioNoBouncy,
        stiffness = Spring.StiffnessMedium
    )
}

val LocalReducedMotion = staticCompositionLocalOf { false }

@Composable
@ReadOnlyComposable
fun isReducedMotion(): Boolean = LocalReducedMotion.current

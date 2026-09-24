package com.tonight.app.ui.motion

import android.content.Context
import android.provider.Settings
import androidx.compose.animation.core.AnimationSpec
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext

object TonightMotion {
    // Easing curves
    val StandardEasing = FastOutSlowInEasing
    val EmphasizedEasing = CubicBezierEasing(0.2f, 0.0f, 0.0f, 1.0f)
    val GentleEasing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)

    fun areAnimationsDisabled(context: Context): Boolean {
        return try {
            val scale = Settings.Global.getFloat(
                context.contentResolver,
                Settings.Global.ANIMATOR_DURATION_SCALE,
                1.0f
            )
            scale == 0f
        } catch (_: Exception) {
            false
        }
    }

    @Composable
    fun <T> rememberAnimationSpec(
        durationMillis: Int = 300,
        easing: androidx.compose.animation.core.Easing = StandardEasing
    ): AnimationSpec<T> {
        val context = LocalContext.current
        val disabled = remember(context) { areAnimationsDisabled(context) }
        return if (disabled) {
            snap()
        } else {
            tween(durationMillis = durationMillis, easing = easing)
        }
    }

    @Composable
    fun <T> rememberSpringSpec(
        dampingRatio: Float = androidx.compose.animation.core.Spring.DampingRatioLowBouncy,
        stiffness: Float = androidx.compose.animation.core.Spring.StiffnessLow
    ): AnimationSpec<T> {
        val context = LocalContext.current
        val disabled = remember(context) { areAnimationsDisabled(context) }
        return if (disabled) {
            snap()
        } else {
            spring(dampingRatio = dampingRatio, stiffness = stiffness)
        }
    }
}

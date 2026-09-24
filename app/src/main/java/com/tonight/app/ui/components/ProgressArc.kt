package com.tonight.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.isReducedMotion

/**
 * ProgressArc:
 * Minimalist, thin circular progress arc for session pacing.
 */
@Composable
fun ProgressArc(
    progress: Float,
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    strokeWidth: Dp = 2.5.dp,
    trackColor: Color = TonightTheme.colors.hairline,
    progressColor: Color = TonightTheme.colors.ink
) {
    val reducedMotion = isReducedMotion()
    val animatedProgress by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = if (reducedMotion) {
            androidx.compose.animation.core.snap()
        } else {
            androidx.compose.animation.core.tween(
                durationMillis = TonightMotionTokens.StandardDurationMs,
                easing = TonightMotionTokens.GentleDecelerate
            )
        },
        label = "progress_arc_val"
    )

    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val strokePx = strokeWidth.toPx()
            val arcSize = Size(size.toPx() - strokePx, size.toPx() - strokePx)
            val topLeft = Offset(strokePx / 2f, strokePx / 2f)

            // Track
            drawArc(
                color = trackColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )

            // Progress
            if (animatedProgress > 0f) {
                drawArc(
                    color = progressColor,
                    startAngle = -90f,
                    sweepAngle = 360f * animatedProgress,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokePx, cap = StrokeCap.Round)
                )
            }
        }
    }
}

@Preview(name = "ProgressArc - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun ProgressArcPreview() {
    TonightTheme {
        ProgressArc(progress = 0.6f)
    }
}

@Preview(name = "ProgressArc - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun ProgressArcLargeFontPreview() {
    TonightTheme {
        ProgressArc(progress = 0.85f)
    }
}

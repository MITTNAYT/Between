package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.engine.ArcPhase
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme

/**
 * PhaseLabel:
 * Subtle phase indicator pill displayed above the question card.
 */
@Composable
fun PhaseLabel(
    phase: ArcPhase,
    modifier: Modifier = Modifier
) {
    val (title, dotColor) = when (phase) {
        ArcPhase.WARMUP -> "Warm-up" to TonightTheme.colors.tileGreen
        ArcPhase.OPENING -> "Opening" to TonightTheme.colors.tileBlue
        ArcPhase.DEEPENING -> "Deepening" to TonightTheme.colors.tileViolet
        ArcPhase.PEAK -> "Peak" to TonightTheme.colors.tileVermilion
        ArcPhase.LANDING -> "Landing" to TonightTheme.colors.tilePink
    }

    Row(
        modifier = modifier
            .clip(PillShape)
            .background(TonightTheme.colors.surface)
            .border(1.dp, TonightTheme.colors.hairline, PillShape)
            .padding(horizontal = 14.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(dotColor)
        )
        Text(
            text = title,
            style = TonightTheme.typography.caption.copy(
                fontSize = 12.sp,
                color = TonightTheme.colors.muted
            )
        )
    }
}

@Preview(name = "PhaseLabel - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun PhaseLabelPreview() {
    TonightTheme {
        PhaseLabel(phase = ArcPhase.DEEPENING)
    }
}

@Preview(name = "PhaseLabel - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun PhaseLabelLargeFontPreview() {
    TonightTheme {
        PhaseLabel(phase = ArcPhase.PEAK)
    }
}

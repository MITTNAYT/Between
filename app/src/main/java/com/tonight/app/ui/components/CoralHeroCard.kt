package com.tonight.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.CardCornerShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * CoralHeroCard:
 * coralCard gradient brush + subtle diagonal line texture drawn on the right side (~25% white).
 */
@Composable
fun CoralHeroCard(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .softShadow(borderRadius = 28.dp, blurRadius = 24.dp, offsetY = 8.dp)
            .clip(CardCornerShape)
            .background(TonightTheme.brushes.coralCard)
    ) {
        // Diagonal Line Pattern Canvas (right side, ~25% white)
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeColor = Color(0x40FFFFFF) // ~25% white
            val strokeWidth = 1.5.dp.toPx()
            val spacing = 16.dp.toPx()
            val startX = size.width * 0.5f

            var x = startX
            while (x < size.width + size.height) {
                drawLine(
                    color = strokeColor,
                    start = Offset(x, 0f),
                    end = Offset(x - size.height, size.height),
                    strokeWidth = strokeWidth,
                    cap = StrokeCap.Round
                )
                x += spacing
            }
        }

        content()
    }
}

@Preview(name = "CoralHeroCard - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun CoralHeroCardPreview() {
    TonightTheme {
        CoralHeroCard(modifier = Modifier.fillMaxWidth().height(160.dp).padding(16.dp)) {
            Text(
                text = "Tonight's Sacred Space",
                style = TonightTheme.typography.displayL.copy(color = Color.White, fontSize = 24.sp),
                modifier = Modifier.padding(24.dp)
            )
        }
    }
}

@Preview(name = "CoralHeroCard - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun CoralHeroCardLargeFontPreview() {
    TonightTheme {
        CoralHeroCard(modifier = Modifier.fillMaxWidth().height(180.dp).padding(16.dp)) {
            Text(
                text = "Tonight's Sacred Space",
                style = TonightTheme.typography.displayL.copy(color = Color.White, fontSize = 24.sp),
                modifier = Modifier.padding(24.dp)
            )
        }
    }
}

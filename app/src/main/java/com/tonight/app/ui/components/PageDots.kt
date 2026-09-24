package com.tonight.app.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme

/**
 * PageDots:
 * Pill container; active = 22dp ink circle with white sparkle icon, inactive = 6dp #D6D6D6.
 */
@Composable
fun PageDots(
    count: Int,
    index: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .clip(PillShape)
            .background(TonightTheme.colors.surface)
            .padding(horizontal = 10.dp, vertical = 6.dp)
            .semantics {
                this.contentDescription = "Step ${index + 1} of $count"
            },
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(count) { i ->
            val isActive = i == index
            if (isActive) {
                Box(
                    modifier = Modifier
                        .size(22.dp)
                        .clip(CircleShape)
                        .background(TonightTheme.colors.ink),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "✦",
                        color = TonightTheme.colors.surface,
                        fontSize = 11.sp
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFD6D6D6))
                )
            }
        }
    }
}

@Preview(name = "PageDots - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun PageDotsPreview() {
    TonightTheme {
        PageDots(count = 5, index = 2)
    }
}

@Preview(name = "PageDots - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun PageDotsLargeFontPreview() {
    TonightTheme {
        PageDots(count = 4, index = 0)
    }
}

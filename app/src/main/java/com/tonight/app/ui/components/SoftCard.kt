package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.tonight.app.ui.theme.CardCornerShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * SoftCard:
 * Pure white card, 28dp radius, subtle softShadow and fine hairline border.
 */
@Composable
fun SoftCard(
    modifier: Modifier = Modifier,
    shape: Shape = CardCornerShape,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .softShadow(borderRadius = 28.dp, blurRadius = 24.dp, offsetY = 8.dp)
            .clip(shape)
            .background(TonightTheme.colors.surface)
            .border(1.dp, TonightTheme.colors.hairline, shape)
    ) {
        content()
    }
}

// Backward-compat alias
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    shape: Shape = CardCornerShape,
    content: @Composable BoxScope.() -> Unit
) = SoftCard(modifier = modifier, shape = shape, content = content)

@Preview(name = "SoftCard - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun SoftCardPreview() {
    TonightTheme {
        SoftCard(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
            Text(
                text = "What's one thing you appreciate about them?",
                style = TonightTheme.typography.titleM,
                modifier = Modifier.padding(24.dp)
            )
        }
    }
}

@Preview(name = "SoftCard - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun SoftCardLargeFontPreview() {
    TonightTheme {
        SoftCard(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
            Text(
                text = "What's one thing you appreciate about them?",
                style = TonightTheme.typography.titleM,
                modifier = Modifier.padding(24.dp)
            )
        }
    }
}

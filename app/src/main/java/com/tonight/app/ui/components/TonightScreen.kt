package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.tonight.app.ui.theme.TonightTheme

/**
 * TonightScreen:
 * Root canvas container with optional blushGlow radial backdrop and edge-to-edge system insets.
 */
@Composable
fun TonightScreen(
    modifier: Modifier = Modifier,
    showBlushGlow: Boolean = true,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(TonightTheme.colors.canvas)
    ) {
        if (showBlushGlow) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(TonightTheme.brushes.blushGlow)
            )
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.systemBars)
        ) {
            content()
        }
    }
}

// Backward-compatibility alias
@Composable
fun Screen(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) = TonightScreen(modifier = modifier, showBlushGlow = true, content = content)

@Preview(name = "TonightScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun TonightScreenPreview() {
    TonightTheme {
        TonightScreen {
            Text(text = "Tonight Wellness Screen", style = TonightTheme.typography.titleM)
        }
    }
}

@Preview(name = "TonightScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun TonightScreenLargeFontPreview() {
    TonightTheme {
        TonightScreen {
            Text(text = "Tonight Wellness Screen (Scaled)", style = TonightTheme.typography.titleM)
        }
    }
}

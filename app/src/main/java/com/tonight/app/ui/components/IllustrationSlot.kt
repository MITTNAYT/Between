package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.tonight.app.ui.theme.TonightBlobAmberDark
import com.tonight.app.ui.theme.TonightBlobAmberLight
import com.tonight.app.ui.theme.TonightBlobAmberMid
import com.tonight.app.ui.theme.TonightBlobBlueDark
import com.tonight.app.ui.theme.TonightBlobBlueLight
import com.tonight.app.ui.theme.TonightBlobBlueMid
import com.tonight.app.ui.theme.TonightBlobEmberDark
import com.tonight.app.ui.theme.TonightBlobEmberLight
import com.tonight.app.ui.theme.TonightBlobEmberMid
import com.tonight.app.ui.theme.TonightBlobSageDark
import com.tonight.app.ui.theme.TonightBlobSageLight
import com.tonight.app.ui.theme.TonightBlobSageMid
import com.tonight.app.ui.theme.TonightBlobVioletDark
import com.tonight.app.ui.theme.TonightBlobVioletLight
import com.tonight.app.ui.theme.TonightBlobVioletMid
import com.tonight.app.ui.theme.TonightTheme

/**
 * IllustrationSlot:
 * Soft gradient placeholder for art and icons.
 */
enum class IllustrationStyle {
    BLOB_EMBER,
    BLOB_SAGE,
    BLOB_AMBER,
    BLOB_BLUE,
    BLOB_VIOLET,
    BLOB_PINK // Compatibility alias for BLOB_EMBER
}

@Composable
fun IllustrationSlot(
    modifier: Modifier = Modifier,
    style: IllustrationStyle = IllustrationStyle.BLOB_EMBER,
    size: Dp = 64.dp
) {
    val brush = when (style) {
        IllustrationStyle.BLOB_EMBER, IllustrationStyle.BLOB_PINK -> Brush.radialGradient(
            colors = listOf(TonightBlobEmberLight, TonightBlobEmberMid, TonightBlobEmberDark),
            center = Offset.Unspecified,
            radius = 120f
        )
        IllustrationStyle.BLOB_SAGE -> Brush.radialGradient(
            colors = listOf(TonightBlobSageLight, TonightBlobSageMid, TonightBlobSageDark),
            center = Offset.Unspecified,
            radius = 120f
        )
        IllustrationStyle.BLOB_AMBER -> Brush.radialGradient(
            colors = listOf(TonightBlobAmberLight, TonightBlobAmberMid, TonightBlobAmberDark),
            center = Offset.Unspecified,
            radius = 120f
        )
        IllustrationStyle.BLOB_BLUE -> Brush.radialGradient(
            colors = listOf(TonightBlobBlueLight, TonightBlobBlueMid, TonightBlobBlueDark),
            center = Offset.Unspecified,
            radius = 120f
        )
        IllustrationStyle.BLOB_VIOLET -> Brush.radialGradient(
            colors = listOf(TonightBlobVioletLight, TonightBlobVioletMid, TonightBlobVioletDark),
            center = Offset.Unspecified,
            radius = 120f
        )
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(brush)
    )
}

@Preview(name = "IllustrationSlot - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun IllustrationSlotPreview() {
    TonightTheme {
        IllustrationSlot(style = IllustrationStyle.BLOB_EMBER)
    }
}

@Preview(name = "IllustrationSlot - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun IllustrationSlotLargeFontPreview() {
    TonightTheme {
        IllustrationSlot(style = IllustrationStyle.BLOB_SAGE)
    }
}

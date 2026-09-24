package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.tonight.app.ui.theme.SheetTopShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * BottomSheetSurface:
 * Pure white bottom sheet with 40dp top corner radius, softShadow, and 1.5dp ink top border.
 */
@Composable
fun BottomSheetSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    val borderColor = TonightTheme.colors.ink
    Box(
        modifier = modifier
            .fillMaxWidth()
            .softShadow(borderRadius = 40.dp, blurRadius = 32.dp, offsetY = (-6).dp)
            .clip(SheetTopShape)
            .background(TonightTheme.colors.surface)
            .drawBehind {
                drawLine(
                    color = borderColor,
                    start = Offset(0f, 0f),
                    end = Offset(size.width, 0f),
                    strokeWidth = 1.5.dp.toPx()
                )
            }
            .padding(top = 16.dp, bottom = 32.dp, start = 24.dp, end = 24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Drag Handle
            Box(
                modifier = Modifier
                    .size(width = 36.dp, height = 4.dp)
                    .clip(CircleShape)
                    .background(TonightTheme.colors.hairline)
            )

            Spacer(modifier = Modifier.height(20.dp))

            Box(modifier = Modifier.fillMaxWidth()) {
                content()
            }
        }
    }
}

@Preview(name = "BottomSheetSurface - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun BottomSheetSurfacePreview() {
    TonightTheme {
        BottomSheetSurface {
            Text(text = "For the Listener", style = TonightTheme.typography.titleM)
        }
    }
}

@Preview(name = "BottomSheetSurface - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun BottomSheetSurfaceLargeFontPreview() {
    TonightTheme {
        BottomSheetSurface {
            Text(text = "For the Listener (Scaled)", style = TonightTheme.typography.titleM)
        }
    }
}

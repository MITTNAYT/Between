package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme

/**
 * SparkButton:
 * 44dp gradient pill with sparkle icon and white text.
 */
@Composable
fun SparkButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null
) {
    Row(
        modifier = modifier
            .height(44.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 44.dp)
            .clip(PillShape)
            .background(TonightTheme.brushes.spark)
            .clickable(onClick = onClick)
            .padding(horizontal = 18.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "✦",
            color = TonightTheme.colors.surface,
            fontSize = 14.sp,
            modifier = Modifier.semantics {
                this.contentDescription = "Sparkle icon"
            }
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = text,
            style = TonightTheme.typography.caption.copy(
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = TonightTheme.colors.surface
            ),
            modifier = Modifier.semantics {
                role = Role.Button
                if (contentDescription != null) {
                    this.contentDescription = contentDescription
                }
            }
        )
    }
}

@Preview(name = "SparkButton - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun SparkButtonPreview() {
    TonightTheme {
        SparkButton(text = "Explore Deeper", onClick = {})
    }
}

@Preview(name = "SparkButton - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun SparkButtonLargeFontPreview() {
    TonightTheme {
        SparkButton(text = "Explore Deeper", onClick = {})
    }
}

package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
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
import com.tonight.app.ui.theme.softShadow

/**
 * SecondaryButton:
 * White pill button, ink text, tuned softShadow, min 56dp height.
 */
@Composable
fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentDescription: String? = null
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 56.dp)
            .softShadow(borderRadius = 28.dp)
            .clip(PillShape)
            .background(if (enabled) TonightTheme.colors.surface else TonightTheme.colors.hairline)
            .clickable(enabled = enabled, onClick = onClick)
            .padding(horizontal = 24.dp, vertical = 14.dp)
            .semantics {
                role = Role.Button
                if (contentDescription != null) {
                    this.contentDescription = contentDescription
                }
            },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = TonightTheme.typography.body.copy(
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (enabled) TonightTheme.colors.ink else TonightTheme.colors.muted
            )
        )
    }
}

// Backward-compat alias
@Composable
fun GhostButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentDescription: String? = null
) = SecondaryButton(text = text, onClick = onClick, modifier = modifier, enabled = enabled, contentDescription = contentDescription)

@Preview(name = "SecondaryButton - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun SecondaryButtonPreview() {
    TonightTheme {
        SecondaryButton(text = "Saved Moments", onClick = {})
    }
}

@Preview(name = "SecondaryButton - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun SecondaryButtonLargeFontPreview() {
    TonightTheme {
        SecondaryButton(text = "Saved Moments", onClick = {})
    }
}

package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
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
import com.tonight.app.ui.theme.TonightTheme

import androidx.compose.material3.Icon
import androidx.compose.ui.graphics.vector.ImageVector
import com.tonight.app.ui.theme.AppIcons

/**
 * CircleIconButton:
 * 44dp outlined circle with 48dp minimum accessible touch target and vector icon rendering.
 */
@Composable
fun CircleIconButton(
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null
) {
    Box(
        modifier = modifier
            .defaultMinSize(minWidth = 48.dp, minHeight = 48.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(CircleShape)
                .background(TonightTheme.colors.surface)
                .border(1.dp, TonightTheme.colors.hairline, CircleShape)
                .clickable(onClick = onClick)
                .semantics {
                    role = Role.Button
                    if (contentDescription != null) {
                        this.contentDescription = contentDescription
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = TonightTheme.colors.ink,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
fun CircleIconButton(
    icon: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null
) {
    val vector = when (icon) {
        "⚙" -> AppIcons.Settings
        "←" -> AppIcons.Back
        "→" -> AppIcons.Forward
        "✕", "X", "x" -> AppIcons.Close
        else -> null
    }

    if (vector != null) {
        CircleIconButton(
            icon = vector as ImageVector,
            onClick = onClick,
            modifier = modifier,
            contentDescription = contentDescription
        )
    } else {
        Box(
            modifier = modifier
                .defaultMinSize(minWidth = 48.dp, minHeight = 48.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(TonightTheme.colors.surface)
                .border(1.dp, TonightTheme.colors.hairline, CircleShape)
                .clickable(onClick = onClick)
                .semantics {
                    role = Role.Button
                    if (contentDescription != null) {
                        this.contentDescription = contentDescription
                    }
                },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = icon,
                    color = TonightTheme.colors.ink,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Preview(name = "CircleIconButton - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun CircleIconButtonPreview() {
    TonightTheme {
        CircleIconButton(icon = "⚙", onClick = {}, contentDescription = "Settings")
    }
}

@Preview(name = "CircleIconButton - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun CircleIconButtonLargeFontPreview() {
    TonightTheme {
        CircleIconButton(icon = "←", onClick = {}, contentDescription = "Back")
    }
}

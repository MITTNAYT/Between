package com.tonight.app.ui.components

import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme

/**
 * PrimaryButton:
 * Ink pill button, 56dp height, white 16sp semibold text, WCAG compliant.
 */
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentDescription: String? = null
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = PillShape,
        colors = ButtonDefaults.buttonColors(
            containerColor = TonightTheme.colors.ink,
            contentColor = TonightTheme.colors.surface,
            disabledContainerColor = TonightTheme.colors.hairline,
            disabledContentColor = TonightTheme.colors.muted
        ),
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 56.dp)
            .semantics {
                if (contentDescription != null) {
                    this.contentDescription = contentDescription
                }
            }
    ) {
        Text(
            text = text,
            style = TonightTheme.typography.body.copy(
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (enabled) TonightTheme.colors.surface else TonightTheme.colors.muted
            )
        )
    }
}

@Preview(name = "PrimaryButton - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun PrimaryButtonPreview() {
    TonightTheme {
        PrimaryButton(text = "Start conversation", onClick = {})
    }
}

@Preview(name = "PrimaryButton - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun PrimaryButtonLargeFontPreview() {
    TonightTheme {
        PrimaryButton(text = "Start conversation", onClick = {})
    }
}

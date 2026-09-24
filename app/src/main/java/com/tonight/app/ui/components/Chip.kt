package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
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
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * Chip:
 * White pill container, caption text, selectable state with ink/softShadow feedback.
 */
@Composable
fun Chip(
    text: String,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    isSelected: Boolean = selected,
    onClick: (() -> Unit)? = null,
    contentDescription: String? = null
) {
    val isChipSelected = selected || isSelected
    val containerColor = if (isChipSelected) TonightTheme.colors.ink else TonightTheme.colors.surface
    val textColor = if (isChipSelected) TonightTheme.colors.surface else TonightTheme.colors.ink

    val baseModifier = if (!isChipSelected) {
        modifier.softShadow(borderRadius = 24.dp, blurRadius = 14.dp, offsetY = 4.dp)
    } else modifier

    val clickableModifier = if (onClick != null) {
        Modifier.clickable(onClick = onClick)
    } else Modifier

    Box(
        modifier = baseModifier
            .heightIn(min = 48.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 48.dp)
            .clip(PillShape)
            .background(containerColor)
            .then(
                if (!isChipSelected) Modifier.border(1.dp, TonightTheme.colors.hairline, PillShape)
                else Modifier
            )
            .then(clickableModifier)
            .padding(horizontal = 20.dp, vertical = 12.dp)
            .semantics {
                if (onClick != null) {
                    role = Role.RadioButton
                    this.selected = isChipSelected
                }
                if (contentDescription != null) {
                    this.contentDescription = contentDescription
                }
            },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = TonightTheme.typography.caption.copy(
                fontSize = 14.sp,
                fontWeight = if (isChipSelected) FontWeight.SemiBold else FontWeight.Medium,
                color = textColor
            )
        )
    }
}

@Preview(name = "Chip - Selected (1.0 Font Scale)", fontScale = 1.0f, showBackground = true)
@Composable
private fun ChipSelectedPreview() {
    TonightTheme {
        Chip(text = "Couple", selected = true, onClick = {})
    }
}

@Preview(name = "Chip - Unselected (1.5 Font Scale)", fontScale = 1.5f, showBackground = true)
@Composable
private fun ChipUnselectedLargeFontPreview() {
    TonightTheme {
        Chip(text = "Close Friends", selected = false, onClick = {})
    }
}

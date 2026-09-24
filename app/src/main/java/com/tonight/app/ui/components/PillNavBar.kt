package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

import androidx.compose.material3.Icon
import androidx.compose.ui.graphics.vector.ImageVector
import com.tonight.app.ui.theme.AppIcons

/**
 * PillNavBar:
 * Floating pill (#EDEDED container, white inner pill for items), 1.75dp outline icons.
 * Active item gets a 2dp spark-gradient ring.
 */
data class NavItem(
    val icon: ImageVector,
    val label: String
)

@Composable
fun PillNavBar(
    items: List<NavItem>,
    selectedIndex: Int,
    onItemSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .softShadow(borderRadius = 32.dp, blurRadius = 24.dp, offsetY = 6.dp)
            .clip(PillShape)
            .background(TonightTheme.colors.hairline)
            .padding(6.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEachIndexed { index, item ->
                val isSelected = index == selectedIndex
                val ringModifier = if (isSelected) {
                    Modifier.border(2.dp, TonightTheme.brushes.spark, PillShape)
                } else Modifier

                Box(
                    modifier = Modifier
                        .defaultMinSize(minWidth = 54.dp, minHeight = 48.dp)
                        .clip(PillShape)
                        .then(ringModifier)
                        .background(TonightTheme.colors.surface)
                        .clickable { onItemSelected(index) }
                        .padding(horizontal = 18.dp, vertical = 10.dp)
                        .semantics {
                            role = Role.Tab
                            this.selected = isSelected
                            this.contentDescription = item.label
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = null,
                        tint = if (isSelected) TonightTheme.colors.ink else TonightTheme.colors.muted,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

@Preview(name = "PillNavBar - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun PillNavBarPreview() {
    TonightTheme {
        PillNavBar(
            items = listOf(
                NavItem(AppIcons.Chat, "Conversation"),
                NavItem(AppIcons.Bookmark, "Moments"),
                NavItem(AppIcons.Settings, "Settings")
            ),
            selectedIndex = 0,
            onItemSelected = {}
        )
    }
}

@Preview(name = "PillNavBar - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun PillNavBarLargeFontPreview() {
    TonightTheme {
        PillNavBar(
            items = listOf(
                NavItem(AppIcons.Chat, "Conversation"),
                NavItem(AppIcons.Bookmark, "Moments"),
                NavItem(AppIcons.Settings, "Settings")
            ),
            selectedIndex = 1,
            onItemSelected = {}
        )
    }
}

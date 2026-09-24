package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TileCornerShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * TileCard:
 * Squircle tile in a vibrant tile palette color.
 * Supports selection state (3dp ink outline + check icon) and availability state.
 */
@Composable
fun TileCard(
    label: String,
    tileColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isSelected: Boolean = false,
    isAvailable: Boolean = true,
    icon: ImageVector? = null,
    illustrationStyle: IllustrationStyle? = null
) {
    val selectionModifier = if (isSelected) {
        Modifier.border(3.dp, TonightTheme.colors.ink, TileCornerShape)
    } else {
        Modifier
    }

    val alphaModifier = if (isAvailable) Modifier else Modifier.alpha(0.45f)

    Box(
        modifier = modifier
            .size(136.dp)
            .softShadow(borderRadius = 28.dp, blurRadius = 16.dp, offsetY = 6.dp)
            .clip(TileCornerShape)
            .then(selectionModifier)
            .background(tileColor)
            .then(alphaModifier)
            .clickable(enabled = isAvailable, onClick = onClick)
            .padding(12.dp)
            .semantics {
                role = Role.Button
                this.contentDescription = "$label tile${if (isSelected) ", selected" else ""}${if (!isAvailable) ", unavailable, no content" else ""}"
            }
    ) {
        // Main tile content centered
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.22f)),
                contentAlignment = Alignment.Center
            ) {
                if (icon != null) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                } else if (illustrationStyle != null) {
                    IllustrationSlot(
                        style = illustrationStyle,
                        size = 34.dp
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = label,
                color = Color.White,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )

            if (!isAvailable) {
                Spacer(modifier = Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(Color.Black.copy(alpha = 0.35f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "No content",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        // Selected state check badge
        if (isSelected) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .size(22.dp)
                    .clip(CircleShape)
                    .background(TonightTheme.colors.ink),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = AppIcons.CheckCircle,
                    contentDescription = "Selected",
                    tint = TonightTheme.colors.surface,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Preview(name = "TileCard - 1.0 Font Scale", fontScale = 1.0f, showBackground = true)
@Composable
private fun TileCardPreview() {
    TonightTheme {
        TileCard(
            label = "Partner",
            tileColor = TonightTheme.colors.tileViolet,
            icon = AppIcons.Partner,
            isSelected = true,
            onClick = {}
        )
    }
}

@Preview(name = "TileCard - 1.5 Font Scale", fontScale = 1.5f, showBackground = true)
@Composable
private fun TileCardLargeFontPreview() {
    TonightTheme {
        TileCard(
            label = "Someone new",
            tileColor = TonightTheme.colors.tileGreen,
            icon = AppIcons.Sparkle,
            isSelected = false,
            onClick = {}
        )
    }
}

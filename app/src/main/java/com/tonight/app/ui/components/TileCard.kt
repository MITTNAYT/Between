package com.tonight.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
 * RelationshipOptionCard:
 * Minimal, premium card designed for the "Who's this conversation with?" selection.
 * Features a clean surface, subtle hairline border, soft colored accent icon badge,
 * clean typography hierarchy, and an animated selected state with Ember highlight.
 */
@Composable
fun RelationshipOptionCard(
    label: String,
    accentColor: Color,
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    caption: String? = null,
    isSelected: Boolean = false,
    isAvailable: Boolean = true
) {
    val borderColor = if (isSelected) TonightTheme.colors.ember else TonightTheme.colors.hairline
    val borderWidth = if (isSelected) 2.dp else 1.dp
    val backgroundColor = if (isSelected) TonightTheme.colors.ember.copy(alpha = 0.05f) else TonightTheme.colors.surface
    val alphaModifier = if (isAvailable) Modifier else Modifier.alpha(0.45f)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .softShadow(
                borderRadius = 20.dp,
                blurRadius = if (isSelected) 14.dp else 8.dp,
                offsetY = if (isSelected) 4.dp else 2.dp
            )
            .clip(RoundedCornerShape(20.dp))
            .background(backgroundColor)
            .border(borderWidth, borderColor, RoundedCornerShape(20.dp))
            .then(alphaModifier)
            .clickable(enabled = isAvailable, onClick = onClick)
            .padding(horizontal = 18.dp, vertical = if (caption.isNullOrBlank()) 18.dp else 16.dp)
            .semantics {
                role = Role.Button
                val desc = if (!caption.isNullOrBlank()) "$label: $caption" else label
                this.contentDescription = "$desc${if (isSelected) ", selected" else ""}${if (!isAvailable) ", unavailable" else ""}"
            }
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                // Circular Accent Badge with distinct color ring and rich background
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .softShadow(
                            borderRadius = 24.dp,
                            blurRadius = if (isSelected) 8.dp else 4.dp,
                            offsetY = 2.dp
                        )
                        .clip(CircleShape)
                        .background(
                            if (isSelected) accentColor else accentColor.copy(alpha = 0.14f)
                        )
                        .border(
                            width = if (isSelected) 2.dp else 1.5.dp,
                            color = if (isSelected) accentColor else accentColor.copy(alpha = 0.38f),
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = if (isSelected) Color.White else accentColor,
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = label,
                        style = TonightTheme.typography.titleM.copy(
                            fontSize = 17.sp,
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TonightTheme.colors.ink
                    )
                    if (!caption.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = caption,
                            style = TonightTheme.typography.body.copy(
                                fontSize = 13.sp
                            ),
                            color = TonightTheme.colors.muted
                        )
                    }
                }
            }

            // Selection Indicator Pill / Check
            if (isSelected) {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(TonightTheme.colors.ember),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.CheckCircle,
                        contentDescription = "Selected",
                        tint = TonightTheme.colors.surface,
                        modifier = Modifier.size(16.dp)
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .border(1.5.dp, TonightTheme.colors.hairline, CircleShape)
                )
            }
        }
    }
}

/**
 * TileCard:
 * Backward-compatible squircle tile with minimal styling and refined colors.
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
        Modifier.border(2.5.dp, TonightTheme.colors.ember, TileCornerShape)
    } else {
        Modifier.border(1.dp, TonightTheme.colors.hairline, TileCornerShape)
    }

    val alphaModifier = if (isAvailable) Modifier else Modifier.alpha(0.45f)
    val cardBg = if (isSelected) TonightTheme.colors.ember.copy(alpha = 0.06f) else TonightTheme.colors.surface

    Box(
        modifier = modifier
            .size(136.dp)
            .softShadow(borderRadius = 28.dp, blurRadius = 14.dp, offsetY = 4.dp)
            .clip(TileCornerShape)
            .then(selectionModifier)
            .background(cardBg)
            .then(alphaModifier)
            .clickable(enabled = isAvailable, onClick = onClick)
            .padding(12.dp)
            .semantics {
                role = Role.Button
                this.contentDescription = "$label tile${if (isSelected) ", selected" else ""}${if (!isAvailable) ", unavailable, no content" else ""}"
            }
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(tileColor.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center
            ) {
                if (icon != null) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = tileColor,
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
                color = TonightTheme.colors.ink,
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
                        .background(TonightTheme.colors.muted.copy(alpha = 0.15f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "No content",
                        color = TonightTheme.colors.muted,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        if (isSelected) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .size(22.dp)
                    .clip(CircleShape)
                    .background(TonightTheme.colors.ember),
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

@Preview(name = "RelationshipOptionCard - Preview", showBackground = true)
@Composable
private fun RelationshipOptionCardPreview() {
    TonightTheme {
        Column(modifier = Modifier.padding(16.dp)) {
            RelationshipOptionCard(
                label = "Partner",
                caption = "From playful to personal.",
                accentColor = TonightTheme.colors.ember,
                icon = AppIcons.Partner,
                isSelected = true,
                onClick = {}
            )
        }
    }
}

package com.tonight.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightMotionTokens
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.isReducedMotion
import com.tonight.app.ui.theme.softShadow

/**
 * SecondaryButton:
 * White pill button, ink text, tuned softShadow, min 56dp height.
 * Features tactile spring scaling and haptic feedback on touch.
 */
@Composable
fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentDescription: String? = null
) {
    val view = LocalView.current
    val reducedMotion = isReducedMotion()
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !reducedMotion) 0.975f else 1.0f,
        animationSpec = TonightMotionTokens.PressedSpring,
        label = "secondary_button_scale"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .scale(scale)
            .heightIn(min = 56.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 56.dp)
            .softShadow(borderRadius = 28.dp, blurRadius = 8.dp, offsetY = 2.dp)
            .clip(PillShape)
            .background(if (enabled) TonightTheme.colors.surface else TonightTheme.colors.hairline)
            .border(1.dp, TonightTheme.colors.hairline, PillShape)
            .clickable(
                enabled = enabled,
                interactionSource = interactionSource,
                indication = null,
                onClick = {
                    view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    onClick()
                }
            )
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

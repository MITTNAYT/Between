package com.tonight.app.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.contentDescription
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
 * PrimaryButton:
 * Ink pill button, 56dp height, white 16sp semibold text, WCAG compliant.
 * Features tactile spring scaling and haptic feedback on touch.
 */
@Composable
fun PrimaryButton(
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
        label = "primary_button_scale"
    )

    Button(
        onClick = {
            view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            onClick()
        },
        enabled = enabled,
        shape = PillShape,
        interactionSource = interactionSource,
        colors = ButtonDefaults.buttonColors(
            containerColor = TonightTheme.colors.ink,
            contentColor = TonightTheme.colors.surface,
            disabledContainerColor = TonightTheme.colors.hairline,
            disabledContentColor = TonightTheme.colors.muted
        ),
        modifier = modifier
            .fillMaxWidth()
            .scale(scale)
            .heightIn(min = 56.dp)
            .defaultMinSize(minWidth = 48.dp, minHeight = 56.dp)
            .then(
                if (enabled) Modifier.softShadow(borderRadius = 28.dp, blurRadius = 8.dp, offsetY = 2.dp)
                else Modifier
            )
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

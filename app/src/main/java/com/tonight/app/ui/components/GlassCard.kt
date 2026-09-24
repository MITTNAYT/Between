package com.tonight.app.ui.components

import androidx.compose.foundation.layout.BoxScope
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import com.tonight.app.ui.theme.CardCornerShape

@Composable
fun GlassCardAlias(
    modifier: Modifier = Modifier,
    shape: Shape = CardCornerShape,
    content: @Composable BoxScope.() -> Unit
) {
    SoftCard(modifier = modifier, shape = shape, content = content)
}

package com.tonight.app.ui.theme

import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.CornerBasedShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// =============================================================================
// SHAPES & CORNER RADIUS TOKENS
// =============================================================================

val PillShape = CircleShape
val CardCornerShape = RoundedCornerShape(28.dp)
val TileCornerShape = RoundedCornerShape(28.dp)
val SheetTopShape = RoundedCornerShape(topStart = 40.dp, topEnd = 40.dp, bottomStart = 0.dp, bottomEnd = 0.dp)

@Immutable
data class TonightShapesData(
    val pill: CornerBasedShape = PillShape,
    val card: CornerBasedShape = CardCornerShape,
    val tile: CornerBasedShape = TileCornerShape,
    val sheetTop: CornerBasedShape = SheetTopShape,
    // Backward-compat aliases
    val small: CornerBasedShape = RoundedCornerShape(14.dp),
    val medium: CornerBasedShape = CardCornerShape,
    val large: CornerBasedShape = SheetTopShape
)

val LocalTonightShapes = staticCompositionLocalOf { TonightShapesData() }

val TonightShapes = TonightShapesData()

val TonightMaterialShapes = Shapes(
    small = RoundedCornerShape(14.dp),
    medium = CardCornerShape,
    large = SheetTopShape,
    extraLarge = SheetTopShape
)

/**
 * softShadow Helper:
 * ~28dp blur, ~10dp y-offset, ~8% black (0x14000000).
 * Tuned so it is NOT the default harsh Material elevation shadow.
 */
fun Modifier.softShadow(
    borderRadius: Dp = 28.dp,
    blurRadius: Dp = 28.dp,
    offsetY: Dp = 10.dp,
    offsetX: Dp = 0.dp,
    shadowColor: Color = Color(0x14000000) // ~8% black
): Modifier = this.drawBehind {
    drawIntoCanvas { canvas ->
        val paint = Paint()
        val frameworkPaint = paint.asFrameworkPaint()
        frameworkPaint.color = shadowColor.toArgb()
        frameworkPaint.setShadowLayer(
            blurRadius.toPx(),
            offsetX.toPx(),
            offsetY.toPx(),
            shadowColor.toArgb()
        )
        canvas.drawRoundRect(
            left = 0f,
            top = 0f,
            right = size.width,
            bottom = size.height,
            radiusX = borderRadius.toPx(),
            radiusY = borderRadius.toPx(),
            paint = paint
        )
    }
}

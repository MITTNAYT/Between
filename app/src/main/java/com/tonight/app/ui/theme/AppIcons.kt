package com.tonight.app.ui.theme

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.automirrored.rounded.ArrowForward
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.ChatBubbleOutline
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.CompareArrows
import androidx.compose.material.icons.rounded.FavoriteBorder
import androidx.compose.material.icons.rounded.GraphicEq
import androidx.compose.material.icons.rounded.KeyboardArrowDown
import androidx.compose.material.icons.rounded.KeyboardArrowUp
import androidx.compose.material.icons.rounded.PeopleOutline
import androidx.compose.material.icons.rounded.PersonOutline
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.VolumeUp
import androidx.compose.material.icons.rounded.Whatshot
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

/**
 * AppIcons: Centralized Type-Safe Vector Icons
 */
object AppIcons {
    val Back: ImageVector = Icons.AutoMirrored.Rounded.ArrowBack
    val Forward: ImageVector = Icons.AutoMirrored.Rounded.ArrowForward
    val Settings: ImageVector = Icons.Rounded.Settings
    val Close: ImageVector = Icons.Rounded.Close
    val CheckCircle: ImageVector = Icons.Rounded.CheckCircle
    val ArrowDown: ImageVector = Icons.Rounded.KeyboardArrowDown
    val ArrowUp: ImageVector = Icons.Rounded.KeyboardArrowUp
    val Soundscape: ImageVector = Icons.Rounded.GraphicEq
    val Partner: ImageVector = Icons.Rounded.FavoriteBorder
    val Friend: ImageVector = Icons.Rounded.PeopleOutline
    val SomeoneNew: ImageVector = Icons.Rounded.PersonOutline
    val Sparkle: ImageVector = Icons.Rounded.AutoAwesome
    val EmberSpark: ImageVector = Icons.Rounded.AutoAwesome
    val Chat: ImageVector = Icons.Rounded.ChatBubbleOutline
    val Bookmark: ImageVector = Icons.Rounded.BookmarkBorder
    val TurnPass: ImageVector = Icons.Rounded.CompareArrows
    val Volume: ImageVector = Icons.Rounded.VolumeUp
    val Flame: ImageVector = Icons.Rounded.Whatshot

    /**
     * VennLoop: Elegant two-circle intersection vector mark symbolizing mindful connection.
     */
    val VennLoop: ImageVector = ImageVector.Builder(
        name = "VennLoop",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).path(
        stroke = SolidColor(Color.Black),
        strokeLineWidth = 1.8f,
        strokeLineCap = StrokeCap.Round,
        strokeLineJoin = StrokeJoin.Round
    ) {
        // Left ring
        moveTo(9.5f, 6.5f)
        curveTo(6.46f, 6.5f, 4.0f, 8.96f, 4.0f, 12.0f)
        curveTo(4.0f, 15.04f, 6.46f, 17.5f, 9.5f, 17.5f)
        curveTo(12.54f, 17.5f, 15.0f, 15.04f, 15.0f, 12.0f)
        curveTo(15.0f, 8.96f, 12.54f, 6.5f, 9.5f, 6.5f)
        close()

        // Right ring
        moveTo(14.5f, 6.5f)
        curveTo(11.46f, 6.5f, 9.0f, 8.96f, 9.0f, 12.0f)
        curveTo(9.0f, 15.04f, 11.46f, 17.5f, 14.5f, 17.5f)
        curveTo(17.54f, 17.5f, 20.0f, 15.04f, 20.0f, 12.0f)
        curveTo(20.0f, 8.96f, 17.54f, 6.5f, 14.5f, 6.5f)
        close()
    }.build()

    /**
     * DialogueMonogram: Overlapping speech loop connection monogram.
     */
    val DialogueMonogram: ImageVector = ImageVector.Builder(
        name = "DialogueMonogram",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).path(
        stroke = SolidColor(Color.Black),
        strokeLineWidth = 1.8f,
        strokeLineCap = StrokeCap.Round,
        strokeLineJoin = StrokeJoin.Round
    ) {
        moveTo(5.0f, 9.0f)
        curveTo(5.0f, 6.8f, 6.8f, 5.0f, 9.0f, 5.0f)
        lineTo(15.0f, 5.0f)
        curveTo(17.2f, 5.0f, 19.0f, 6.8f, 19.0f, 9.0f)
        curveTo(19.0f, 11.2f, 17.2f, 13.0f, 15.0f, 13.0f)
        lineTo(10.0f, 13.0f)
        lineTo(7.0f, 16.0f)
        lineTo(7.0f, 13.0f)
        curveTo(5.8f, 12.5f, 5.0f, 11.0f, 5.0f, 9.0f)
        close()
    }.build()

    val LogoMark: ImageVector = VennLoop
}

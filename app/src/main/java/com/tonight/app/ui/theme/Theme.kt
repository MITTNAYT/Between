package com.tonight.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// =============================================================================
// MATERIAL 3 COLOR SCHEME OVERRIDE
// Completely overridden to match our light-first wellness palette
// =============================================================================

private val TonightLightColorScheme = lightColorScheme(
    primary = TonightInk,
    onPrimary = TonightSurface,
    primaryContainer = TonightSurface,
    onPrimaryContainer = TonightInk,
    secondary = TonightBody,
    onSecondary = TonightSurface,
    secondaryContainer = TonightHairline,
    onSecondaryContainer = TonightInk,
    background = TonightCanvas,
    onBackground = TonightInk,
    surface = TonightSurface,
    onSurface = TonightInk,
    surfaceVariant = TonightCanvas,
    onSurfaceVariant = TonightBody,
    outline = TonightHairline,
    outlineVariant = TonightHairline,
    error = TonightSupport,
    onError = TonightSurface
)

object TonightTheme {
    val colors: TonightColors
        @Composable
        @ReadOnlyComposable
        get() = LocalTonightColors.current

    val typography: TonightTypography
        @Composable
        @ReadOnlyComposable
        get() = LocalTonightTypography.current

    val shapes: TonightShapesData
        @Composable
        @ReadOnlyComposable
        get() = LocalTonightShapes.current

    val brushes: TonightBrushes
        @Composable
        @ReadOnlyComposable
        get() = LocalTonightBrushes.current
}

@Composable
fun animateTonightColors(
    target: TonightColors,
    animationSpec: androidx.compose.animation.core.AnimationSpec<Color> = androidx.compose.animation.core.tween(
        durationMillis = 350,
        easing = androidx.compose.animation.core.FastOutSlowInEasing
    )
): TonightColors {
    val canvas by androidx.compose.animation.animateColorAsState(target.canvas, animationSpec, label = "canvas")
    val surface by androidx.compose.animation.animateColorAsState(target.surface, animationSpec, label = "surface")
    val ink by androidx.compose.animation.animateColorAsState(target.ink, animationSpec, label = "ink")
    val body by androidx.compose.animation.animateColorAsState(target.body, animationSpec, label = "body")
    val muted by androidx.compose.animation.animateColorAsState(target.muted, animationSpec, label = "muted")
    val hairline by androidx.compose.animation.animateColorAsState(target.hairline, animationSpec, label = "hairline")
    val support by androidx.compose.animation.animateColorAsState(target.support, animationSpec, label = "support")
    val ember by androidx.compose.animation.animateColorAsState(target.ember, animationSpec, label = "ember")
    val tileGreen by androidx.compose.animation.animateColorAsState(target.tileGreen, animationSpec, label = "tileGreen")
    val tileViolet by androidx.compose.animation.animateColorAsState(target.tileViolet, animationSpec, label = "tileViolet")
    val tileBlue by androidx.compose.animation.animateColorAsState(target.tileBlue, animationSpec, label = "tileBlue")
    val tileVermilion by androidx.compose.animation.animateColorAsState(target.tileVermilion, animationSpec, label = "tileVermilion")
    val tilePink by androidx.compose.animation.animateColorAsState(target.tilePink, animationSpec, label = "tilePink")
    val tileAmber by androidx.compose.animation.animateColorAsState(target.tileAmber, animationSpec, label = "tileAmber")
    val tileRed by androidx.compose.animation.animateColorAsState(target.tileRed, animationSpec, label = "tileRed")
    val dotsInactive by androidx.compose.animation.animateColorAsState(target.dotsInactive, animationSpec, label = "dotsInactive")
    val shadow by androidx.compose.animation.animateColorAsState(target.shadow, animationSpec, label = "shadow")
    val scrim by androidx.compose.animation.animateColorAsState(target.scrim, animationSpec, label = "scrim")

    return TonightColors(
        canvas = canvas,
        surface = surface,
        ink = ink,
        body = body,
        muted = muted,
        hairline = hairline,
        support = support,
        ember = ember,
        tileGreen = tileGreen,
        tileViolet = tileViolet,
        tileBlue = tileBlue,
        tileVermilion = tileVermilion,
        tilePink = tilePink,
        tileAmber = tileAmber,
        tileRed = tileRed,
        dotsInactive = dotsInactive,
        shadow = shadow,
        scrim = scrim
    )
}

@Composable
fun TonightTheme(
    paletteMode: PaletteMode = PaletteMode.WARM_SLATE_EMBER,
    darkTheme: Boolean = false, // Light-first design system
    content: @Composable () -> Unit
) {
    val rawColors = getColorsForPalette(paletteMode)
    val colors = animateTonightColors(rawColors)
    val typography = TonightTypography()
    val shapes = TonightShapesData()
    val brushes = getBrushesForPalette(paletteMode)

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = Color.Transparent.toArgb()
                window.navigationBarColor = Color.Transparent.toArgb()
                val controller = WindowCompat.getInsetsController(window, view)
                controller.isAppearanceLightStatusBars = true
                controller.isAppearanceLightNavigationBars = true
            }
        }
    }

    CompositionLocalProvider(
        LocalTonightColors provides colors,
        LocalTonightTypography provides typography,
        LocalTonightShapes provides shapes,
        LocalTonightBrushes provides brushes
    ) {
        MaterialTheme(
            colorScheme = TonightLightColorScheme,
            typography = TonightMaterialTypography,
            shapes = TonightMaterialShapes,
            content = content
        )
    }
}

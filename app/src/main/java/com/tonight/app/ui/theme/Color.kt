package com.tonight.app.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// =============================================================================
// TONIGHT LIGHT-FIRST WELLNESS PALETTE
// Single Source of Truth
// =============================================================================

// Core Brand Neutrals (Warm Slate & Ember)
val TonightCanvas = Color(0xFFF6F4F0) // Warm Stone
val TonightSurface = Color(0xFFFFFFFF) // Crisp White
val TonightInk = Color(0xFF18181B) // Charcoal Obsidian
val TonightBody = Color(0xFF3F3F46) // Slate
val TonightMuted = Color(0xFF71717A) // Muted Slate
val TonightHairline = Color(0xFFE4E4E7) // Clean Hairline
val TonightSupport = Color(0xFFD97706) // Warm Amber / Ochre
val TonightEmber = Color(0xFFC2673B) // Warm Ember Sienna

// Tile Palette
val TonightTileGreen = Color(0xFF2E8555) // Forest Sage
val TonightTileViolet = Color(0xFF6352B5) // Deep Amethyst
val TonightTileBlue = Color(0xFF2563EB) // Slate Cobalt
val TonightTileVermilion = Color(0xFFC2673B) // Warm Terracotta Ember
val TonightTilePink = Color(0xFF9A3412) // Rich Ochre / Sienna (Unisex replacement)
val TonightTileAmber = Color(0xFFD97706) // Warm Golden Amber

// Inactive Dots & Scrims & Shadows
val TonightDotsInactive = Color(0xFFD4D4D8)
val TonightShadowColor = Color(0x12000000) // 7% black
val TonightScrimColor = Color(0x33000000)

// Illustration Blob Palette (Warm Ember, Nordic Sage, Slate, Indigo)
val TonightBlobEmberLight = Color(0xFFFFF7ED)
val TonightBlobEmberMid = Color(0xFFFDBA74)
val TonightBlobEmberDark = Color(0xFFEA580C)

val TonightBlobAmberLight = Color(0xFFFFFBEB)
val TonightBlobAmberMid = Color(0xFFFDE68A)
val TonightBlobAmberDark = Color(0xFFD97706)

val TonightBlobSageLight = Color(0xFFF0FDF4)
val TonightBlobSageMid = Color(0xFF86EFAC)
val TonightBlobSageDark = Color(0xFF16A34A)

val TonightBlobBlueLight = Color(0xFFEFF6FF)
val TonightBlobBlueMid = Color(0xFF93C5FD)
val TonightBlobBlueDark = Color(0xFF2563EB)

val TonightBlobVioletLight = Color(0xFFFAF5FF)
val TonightBlobVioletMid = Color(0xFFD8B4FE)
val TonightBlobVioletDark = Color(0xFF7C3AED)

// Backward-Compatibility Aliases
val TonightBackground = TonightCanvas
val TonightElevatedSurface = TonightSurface
val TonightWarmCharcoal = TonightSurface
val TonightObsidian = TonightCanvas
val TonightParchment = TonightInk
val TonightTextPrimary = TonightInk
val TonightTextSecondary = TonightBody
val TonightTextMuted = TonightMuted
val TonightTextSubtle = TonightMuted
val TonightCandleAmber = TonightTileAmber
val TonightCoral = TonightTileVermilion
val TonightTerracotta = TonightTileVermilion
val TonightGold = TonightTileAmber
val TonightGlassBorder = TonightHairline
val TonightGlassSurface = TonightSurface
val TonightGlassOverlay = TonightShadowColor
val TonightHoldGlow = TonightTileAmber
val TonightDivider = TonightHairline

// Legacy pink blob aliases mapped to unisex ember
val TonightBlobPinkLight = TonightBlobEmberLight
val TonightBlobPinkMid = TonightBlobEmberMid
val TonightBlobPinkDark = TonightBlobEmberDark

@Immutable
data class TonightColors(
    val canvas: Color = TonightCanvas,
    val surface: Color = TonightSurface,
    val ink: Color = TonightInk,
    val body: Color = TonightBody,
    val muted: Color = TonightMuted,
    val hairline: Color = TonightHairline,
    val support: Color = TonightSupport,
    val ember: Color = TonightEmber,
    val tileGreen: Color = TonightTileGreen,
    val tileViolet: Color = TonightTileViolet,
    val tileBlue: Color = TonightTileBlue,
    val tileVermilion: Color = TonightTileVermilion,
    val tilePink: Color = TonightTilePink,
    val tileAmber: Color = TonightTileAmber,
    val dotsInactive: Color = TonightDotsInactive,
    val shadow: Color = TonightShadowColor,
    val scrim: Color = TonightScrimColor
)

enum class PaletteMode {
    WARM_SLATE_EMBER,
    MONOCHROME,
    NORDIC_SAGE,
    MIDNIGHT_INDIGO,
    WARM_LINEN,
    WELLNESS,
    NORDIC_INDIGO
}

// Token aliases for settings and backward compatibility
val WarmLinenTerracotta = TonightTileVermilion
val WarmLinenAmber = TonightTileAmber
val NordicIndigo = Color(0xFF4F46E5)

// Monochrome (Black & White) Tokens
val MonochromeCanvas = Color(0xFFF9F9FB) // Crisp soft porcelain
val MonochromeSurface = Color(0xFFFFFFFF) // Pure white
val MonochromeInk = Color(0xFF09090B) // Pure obsidian
val MonochromeBody = Color(0xFF27272A) // Deep charcoal
val MonochromeMuted = Color(0xFF71717A) // Slate zinc
val MonochromeHairline = Color(0xFFE4E4E7) // Clean border
val MonochromeAccent = Color(0xFF18181B) // High contrast black accent

// Nordic Sage Tokens
val NordicSageCanvas = Color(0xFFF3F5F3)
val NordicSageSurface = Color(0xFFFFFFFF)
val NordicSageInk = Color(0xFF19241E)
val NordicSageBody = Color(0xFF38463F)
val NordicSageMuted = Color(0xFF68776F)
val NordicSageHairline = Color(0xFFDEE4E0)
val NordicSageAccent = Color(0xFF2E8555)
val NordicSageAmber = Color(0xFFC27803)

// Midnight Indigo Tokens
val MidnightIndigoCanvas = Color(0xFFF4F6F9)
val MidnightIndigoSurface = Color(0xFFFFFFFF)
val MidnightIndigoInk = Color(0xFF0F172A)
val MidnightIndigoBody = Color(0xFF334155)
val MidnightIndigoMuted = Color(0xFF64748B)
val MidnightIndigoHairline = Color(0xFFE2E8F0)
val MidnightIndigoAccent = Color(0xFF4F46E5)
val MidnightIndigoSky = Color(0xFF0284C7)

fun getColorsForPalette(mode: PaletteMode): TonightColors {
    return when (mode) {
        PaletteMode.WARM_SLATE_EMBER, PaletteMode.WARM_LINEN, PaletteMode.WELLNESS -> TonightColors()
        PaletteMode.MONOCHROME -> TonightColors(
            canvas = MonochromeCanvas,
            surface = MonochromeSurface,
            ink = MonochromeInk,
            body = MonochromeBody,
            muted = MonochromeMuted,
            hairline = MonochromeHairline,
            ember = MonochromeAccent,
            support = MonochromeAccent,
            tileViolet = MonochromeAccent,
            tileAmber = MonochromeBody,
            tileGreen = MonochromeAccent
        )
        PaletteMode.NORDIC_SAGE -> TonightColors(
            canvas = NordicSageCanvas,
            surface = NordicSageSurface,
            ink = NordicSageInk,
            body = NordicSageBody,
            muted = NordicSageMuted,
            hairline = NordicSageHairline,
            ember = NordicSageAccent,
            tileGreen = NordicSageAccent,
            tileAmber = NordicSageAmber
        )
        PaletteMode.MIDNIGHT_INDIGO, PaletteMode.NORDIC_INDIGO -> TonightColors(
            canvas = MidnightIndigoCanvas,
            surface = MidnightIndigoSurface,
            ink = MidnightIndigoInk,
            body = MidnightIndigoBody,
            muted = MidnightIndigoMuted,
            hairline = MidnightIndigoHairline,
            ember = MidnightIndigoAccent,
            tileViolet = MidnightIndigoAccent,
            tileBlue = MidnightIndigoSky
        )
    }
}

@Immutable
data class TonightBrushes(
    val blushGlow: Brush = Brush.radialGradient(
        colors = listOf(
            Color(0xFFFEF3C7),
            Color(0xFFFFFBEB),
            Color(0x00FFFFFF)
        ),
        radius = 800f
    ),
    val coralCard: Brush = Brush.linearGradient(
        colors = listOf(
            Color(0xFFFFFFFF),
            Color(0xFFFED7AA),
            Color(0xFFEA580C)
        )
    ),
    val spark: Brush = Brush.horizontalGradient(
        colors = listOf(
            Color(0xFFEA580C),
            Color(0xFFD97706),
            Color(0xFFC2673B)
        )
    )
)

fun getBrushesForPalette(mode: PaletteMode): TonightBrushes {
    return when (mode) {
        PaletteMode.WARM_SLATE_EMBER, PaletteMode.WARM_LINEN, PaletteMode.WELLNESS -> TonightBrushes()
        PaletteMode.MONOCHROME -> TonightBrushes(
            blushGlow = Brush.radialGradient(
                colors = listOf(
                    Color(0xFFF4F4F5),
                    Color(0xFFFAFAFA),
                    Color(0x00FFFFFF)
                ),
                radius = 800f
            ),
            coralCard = Brush.linearGradient(
                colors = listOf(
                    Color(0xFFFFFFFF),
                    Color(0xFFF4F4F5),
                    Color(0xFF18181B)
                )
            ),
            spark = Brush.horizontalGradient(
                colors = listOf(
                    Color(0xFF18181B),
                    Color(0xFF27272A),
                    Color(0xFF09090B)
                )
            )
        )
        PaletteMode.NORDIC_SAGE -> TonightBrushes(
            blushGlow = Brush.radialGradient(
                colors = listOf(
                    Color(0xFFDCFCE7),
                    Color(0xFFF0FDF4),
                    Color(0x00FFFFFF)
                ),
                radius = 800f
            ),
            coralCard = Brush.linearGradient(
                colors = listOf(
                    Color(0xFFFFFFFF),
                    Color(0xFFBBF7D0),
                    Color(0xFF2E8555)
                )
            ),
            spark = Brush.horizontalGradient(
                colors = listOf(
                    Color(0xFF2E8555),
                    Color(0xFF16A34A),
                    Color(0xFFD97706)
                )
            )
        )
        PaletteMode.MIDNIGHT_INDIGO, PaletteMode.NORDIC_INDIGO -> TonightBrushes(
            blushGlow = Brush.radialGradient(
                colors = listOf(
                    Color(0xFFE0E7FF),
                    Color(0xFFEEF2FF),
                    Color(0x00FFFFFF)
                ),
                radius = 800f
            ),
            coralCard = Brush.linearGradient(
                colors = listOf(
                    Color(0xFFFFFFFF),
                    Color(0xFFC7D2FE),
                    Color(0xFF4F46E5)
                )
            ),
            spark = Brush.horizontalGradient(
                colors = listOf(
                    Color(0xFF0284C7),
                    Color(0xFF4F46E5),
                    Color(0xFFD97706)
                )
            )
        )
    }
}

val LocalTonightColors = staticCompositionLocalOf { TonightColors() }
val LocalTonightBrushes = staticCompositionLocalOf { TonightBrushes() }

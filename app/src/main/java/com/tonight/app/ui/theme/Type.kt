package com.tonight.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.Font
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.unit.sp
import com.tonight.app.R

// =============================================================================
// FONTS & TYPOGRAPHY
// Source Serif 4 (400, 600) & Inter (400, 500, 600)
// =============================================================================

val googleFontProvider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs
)

val SourceSerif4Font = GoogleFont("Source Serif 4")
val InterFont = GoogleFont("Inter")

val SourceSerif4Family = FontFamily(
    Font(googleFont = SourceSerif4Font, fontProvider = googleFontProvider, weight = FontWeight.Normal),
    Font(googleFont = SourceSerif4Font, fontProvider = googleFontProvider, weight = FontWeight.SemiBold),
    androidx.compose.ui.text.font.Font(resId = android.R.drawable.stat_sys_warning, weight = FontWeight.Normal) // dummy fallback ref overridden by system serif
)

val InterFamily = FontFamily(
    Font(googleFont = InterFont, fontProvider = googleFontProvider, weight = FontWeight.Normal),
    Font(googleFont = InterFont, fontProvider = googleFontProvider, weight = FontWeight.Medium),
    Font(googleFont = InterFont, fontProvider = googleFontProvider, weight = FontWeight.SemiBold)
)

// High-fidelity fallback families for offline/instant rendering
val SerifDisplayFamily = FontFamily.Serif
val SansUiFamily = FontFamily.SansSerif

@Immutable
data class TonightTypography(
    val questionXL: TextStyle = TextStyle(
        fontFamily = SerifDisplayFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 34.sp,
        lineHeight = 42.sp,
        color = TonightInk
    ),
    val displayL: TextStyle = TextStyle(
        fontFamily = SerifDisplayFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        color = TonightInk
    ),
    val titleM: TextStyle = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        color = TonightInk
    ),
    val body: TextStyle = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = TonightBody
    ),
    val caption: TextStyle = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp,
        color = TonightMuted
    ),
    // Backward-compatibility token
    val button: TextStyle = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp,
        color = TonightSurface
    )
)

val LocalTonightTypography = staticCompositionLocalOf { TonightTypography() }

// Material 3 Typography Overrides
val TonightMaterialTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = SerifDisplayFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 34.sp,
        lineHeight = 42.sp,
        color = TonightInk
    ),
    displayMedium = TextStyle(
        fontFamily = SerifDisplayFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        color = TonightInk
    ),
    headlineLarge = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        color = TonightInk
    ),
    headlineSmall = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = TonightBody
    ),
    titleLarge = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp,
        color = TonightInk
    ),
    titleMedium = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
        lineHeight = 20.sp,
        color = TonightInk
    ),
    bodyLarge = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = TonightBody
    ),
    bodyMedium = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = TonightMuted
    ),
    labelLarge = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp,
        color = TonightSurface
    ),
    labelMedium = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp,
        color = TonightMuted
    ),
    labelSmall = TextStyle(
        fontFamily = SansUiFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 1.0.sp,
        color = TonightMuted
    )
)

package com.tonight.app.ui.share

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RadialGradient
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream

object ShareCardExporter {

    /**
     * Renders a privacy-safe brand share card Bitmap (1080x1350).
     * Pale canvas + blush glow + Source Serif headline.
     * ZERO CONVERSATIONAL CONTENT IS EVER INCLUDED.
     */
    fun createShareCardBitmap(
        depthReached: Int,
        sessionLength: String
    ): Bitmap {
        val width = 1080
        val height = 1350
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        // 1. Background canvas (#F5F5F5)
        val bgPaint = Paint().apply {
            color = Color.parseColor("#F5F5F5")
            style = Paint.Style.FILL
        }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), bgPaint)

        // 2. Warm ambient blush radial glow
        val glowPaint = Paint().apply {
            shader = RadialGradient(
                width / 2f,
                height * 0.42f,
                width * 0.65f,
                Color.parseColor("#80F9D7DC"),
                Color.parseColor("#00F5F5F5"),
                Shader.TileMode.CLAMP
            )
        }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), glowPaint)

        // 3. Central White Surface Card
        val cardRect = RectF(100f, 150f, (width - 100).toFloat(), (height - 170).toFloat())
        val cardPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#FFFFFF")
            style = Paint.Style.FILL
            setShadowLayer(40f, 0f, 12f, Color.parseColor("#15000000"))
        }
        canvas.drawRoundRect(cardRect, 48f, 48f, cardPaint)

        val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#E6E6E6")
            style = Paint.Style.STROKE
            strokeWidth = 2f
        }
        canvas.drawRoundRect(cardRect, 48f, 48f, borderPaint)

        // 4. Header: "Between" Wordmark
        val brandPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#0D0D0D")
            textSize = 72f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SERIF, Typeface.NORMAL)
        }
        canvas.drawText("Between", width / 2f, 300f, brandPaint)

        val subBrandPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#666666")
            textSize = 26f
            textAlign = Paint.Align.CENTER
            letterSpacing = 0.16f
            typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
        }
        canvas.drawText("A CONVERSATION FOR TWO", width / 2f, 360f, subBrandPaint)

        // 5. Divider Line
        val linePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#E6E6E6")
            strokeWidth = 2f
        }
        canvas.drawLine(220f, 410f, (width - 220).toFloat(), 410f, linePaint)

        // 6. Level Badge & Statement
        val reachedLabelPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#666666")
            textSize = 28f
            textAlign = Paint.Align.CENTER
            letterSpacing = 0.15f
            typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
        }
        canvas.drawText("WE REACHED", width / 2f, 520f, reachedLabelPaint)

        val levelTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#0D0D0D")
            textSize = 96f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
        }
        canvas.drawText("Level $depthReached", width / 2f, 650f, levelTextPaint)

        val tonightLabelPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#F58B8B")
            textSize = 40f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SERIF, Typeface.ITALIC)
        }
        canvas.drawText("tonight", width / 2f, 720f, tonightLabelPaint)

        // 7. Duration Pill
        val pillDuration = if (sessionLength.contains("DEEP", ignoreCase = true)) "30 min deep conversation" else "15 min gentle conversation"
        val pillRect = RectF(340f, 800f, 740f, 875f)
        val pillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#0D0D0D")
            style = Paint.Style.FILL
        }
        canvas.drawRoundRect(pillRect, 38f, 38f, pillPaint)

        val pillTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#FFFFFF")
            textSize = 26f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
        }
        canvas.drawText(pillDuration, width / 2f, 848f, pillTextPaint)

        // 8. Footer tagline
        val footerPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#666666")
            textSize = 26f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL)
        }
        canvas.drawText("Spoken together · Eye to eye · One phone", width / 2f, 1030f, footerPaint)

        return bitmap
    }

    /**
     * Saves bitmap to cache directory and launches Android share intent via FileProvider.
     */
    fun shareSessionCard(
        context: Context,
        depthReached: Int,
        sessionLength: String
    ) {
        val bitmap = createShareCardBitmap(depthReached, sessionLength)
        val shareDir = File(context.cacheDir, "shares").apply { mkdirs() }
        val imageFile = File(shareDir, "between_summary.png")

        FileOutputStream(imageFile).use { out ->
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
        }

        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            imageFile
        )

        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "image/png"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_TEXT, "We reached Level $depthReached on Between ✨")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }

        val chooser = Intent.createChooser(shareIntent, "Share Between Card")
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }
}

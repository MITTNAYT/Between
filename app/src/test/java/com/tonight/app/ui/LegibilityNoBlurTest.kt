package com.tonight.app.ui

import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/**
 * Task H: Legibility Verification Test
 * Scans the entire source tree (app/src/main) and fails if Modifier.blur, BlurEffect,
 * or RenderEffect is used anywhere in the codebase.
 */
class LegibilityNoBlurTest {

    @Test
    fun `source tree contains no blur or RenderEffect modifiers`() {
        val srcMainDir = File("src/main/java")
        val rootDir = if (srcMainDir.exists()) srcMainDir else File("app/src/main/java")

        assertTrue("Source directory must exist: ${rootDir.absolutePath}", rootDir.exists())

        val violations = mutableListOf<String>()

        rootDir.walkTopDown()
            .filter { it.isFile && (it.extension == "kt" || it.extension == "java") }
            .forEach { file ->
                val lines = file.readLines()
                lines.forEachIndexed { index, line ->
                    val lineNumber = index + 1
                    // Exclude comments and this test itself
                    val trimmed = line.trim()
                    if (!trimmed.startsWith("//") && !trimmed.startsWith("/*") && !trimmed.startsWith("*")) {
                        if (line.contains(".blur(") ||
                            line.contains("RenderEffect") ||
                            line.contains("BlurEffect")
                        ) {
                            violations.add("${file.name}:$lineNumber -> $line")
                        }
                    }
                }
            }

        assertTrue(
            "Found forbidden blur/RenderEffect usages that degrade legibility:\n" +
                violations.joinToString("\n"),
            violations.isEmpty()
        )
    }
}

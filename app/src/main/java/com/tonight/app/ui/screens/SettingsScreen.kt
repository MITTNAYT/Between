package com.tonight.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.PaletteMode
import com.tonight.app.ui.theme.TonightTheme
import kotlinx.coroutines.launch

/**
 * SettingsScreen:
 * Minimalist, pro, luxury settings with zero clutter.
 */
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel,
    onBack: () -> Unit,
    onOpenRules: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val isBiometricLockEnabled by viewModel.isBiometricLockEnabled.collectAsState()
    val currentPalette by viewModel.paletteMode.collectAsState()
    var showDeleteConfirmDialog by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // TOP BAR
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 28.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircleIconButton(
                        icon = AppIcons.Back,
                        onClick = onBack,
                        contentDescription = "Navigate back"
                    )

                    Text(
                        text = "Settings",
                        style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                        color = TonightTheme.colors.ink,
                        modifier = Modifier.semantics { heading() }
                    )

                    Box(modifier = Modifier.size(44.dp))
                }

                // SECTION 1: APPEARANCE & THEME
                SectionHeader(title = "APPEARANCE")

                SoftCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        PaletteOptionRow(
                            title = "Warm Slate & Ember",
                            description = "Stone canvas, obsidian ink & ember amber glow",
                            accentColor = Color(0xFFC2673B),
                            isSelected = currentPalette == PaletteMode.WARM_SLATE_EMBER || currentPalette == PaletteMode.WARM_LINEN || currentPalette == PaletteMode.WELLNESS,
                            onClick = { viewModel.setPaletteMode(PaletteMode.WARM_SLATE_EMBER) }
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        PaletteOptionRow(
                            title = "Black & White (Monochrome)",
                            description = "High contrast obsidian & clean porcelain",
                            accentColor = Color(0xFF09090B),
                            isSelected = currentPalette == PaletteMode.MONOCHROME,
                            onClick = { viewModel.setPaletteMode(PaletteMode.MONOCHROME) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // SECTION 2: PRIVACY & SECURITY
                SectionHeader(title = "PRIVACY & SECURITY")

                SoftCard(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Biometric App Lock",
                                    style = TonightTheme.typography.titleM.copy(fontSize = 16.sp),
                                    color = TonightTheme.colors.ink
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "Require fingerprint or PIN to access saved moments",
                                    style = TonightTheme.typography.caption.copy(fontSize = 13.sp),
                                    color = TonightTheme.colors.muted
                                )
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            Switch(
                                checked = isBiometricLockEnabled,
                                onCheckedChange = { viewModel.setBiometricLockEnabled(it) },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = TonightTheme.colors.surface,
                                    checkedTrackColor = TonightTheme.colors.ink,
                                    uncheckedThumbColor = TonightTheme.colors.muted,
                                    uncheckedTrackColor = TonightTheme.colors.hairline
                                ),
                                modifier = Modifier.semantics {
                                    contentDescription = "Toggle biometric lock"
                                }
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(TonightTheme.shapes.card)
                                .background(TonightTheme.colors.canvas)
                                .padding(horizontal = 14.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = AppIcons.VennLoop,
                                contentDescription = null,
                                tint = TonightTheme.colors.ember,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "100% on-device · Zero conversation telemetry",
                                style = TonightTheme.typography.caption.copy(
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = TonightTheme.colors.muted
                                )
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // SECTION 3: HOW TO PLAY & RULES
                SectionHeader(title = "GUIDE & RULES")

                SoftCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onOpenRules)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(18.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "How to Play & Ground Rules",
                                style = TonightTheme.typography.titleM.copy(fontSize = 16.sp),
                                color = TonightTheme.colors.ink
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Review turn-taking, passing, depth control, and tips",
                                style = TonightTheme.typography.caption.copy(fontSize = 13.sp),
                                color = TonightTheme.colors.muted
                            )
                        }

                        Icon(
                            imageVector = AppIcons.Forward,
                            contentDescription = "Open guide",
                            tint = TonightTheme.colors.ember,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // SECTION 4: DATA RESET
                SectionHeader(title = "DATA MANAGEMENT")

                SecondaryButton(
                    text = "Clear Local Data & History",
                    onClick = { showDeleteConfirmDialog = true },
                    contentDescription = "Clear all local data and saved moments"
                )

                Spacer(modifier = Modifier.height(36.dp))

                // FOOTER
                Text(
                    text = "Between · Private & Mindful",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 0.5.sp,
                        color = TonightTheme.colors.muted.copy(alpha = 0.7f)
                    )
                )

                Spacer(modifier = Modifier.height(24.dp))
            }

            SnackbarHost(
                hostState = snackbarHostState,
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }

    if (showDeleteConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirmDialog = false },
            containerColor = TonightTheme.colors.surface,
            title = {
                Text(
                    text = "Erase Local Data?",
                    style = TonightTheme.typography.displayL.copy(fontSize = 20.sp),
                    color = TonightTheme.colors.ink
                )
            },
            text = {
                Text(
                    text = "This will permanently delete all saved moments and session history from this device.",
                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                    color = TonightTheme.colors.muted
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        showDeleteConfirmDialog = false
                        viewModel.deleteAllData {
                            scope.launch {
                                snackbarHostState.showSnackbar("All local data has been deleted.")
                            }
                        }
                    }
                ) {
                    Text("Delete Everything", color = TonightTheme.colors.ember, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showDeleteConfirmDialog = false }
                ) {
                    Text("Cancel", color = TonightTheme.colors.ink)
                }
            }
        )
    }
}

@Composable
private fun SectionHeader(title: String) {
    Text(
        text = title,
        style = TonightTheme.typography.caption.copy(
            fontSize = 12.sp,
            letterSpacing = 1.2.sp,
            fontWeight = FontWeight.Bold,
            color = TonightTheme.colors.muted
        ),
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 10.dp)
            .semantics { heading() }
    )
}

@Composable
private fun PaletteOptionRow(
    title: String,
    description: String,
    accentColor: Color,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val borderColor = if (isSelected) TonightTheme.colors.ink else TonightTheme.colors.hairline
    val borderWidth = if (isSelected) 2.dp else 1.dp
    val bg = if (isSelected) TonightTheme.colors.canvas else TonightTheme.colors.surface

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(TonightTheme.shapes.card)
            .background(bg)
            .border(borderWidth, borderColor, TonightTheme.shapes.card)
            .clickable(onClick = onClick)
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(accentColor)
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column {
                Text(
                    text = title,
                    style = TonightTheme.typography.titleM.copy(
                        fontSize = 15.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = TonightTheme.colors.ink
                    )
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = description,
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        color = TonightTheme.colors.muted
                    )
                )
            }
        }

        Spacer(modifier = Modifier.width(8.dp))

        if (isSelected) {
            Icon(
                imageVector = AppIcons.CheckCircle,
                contentDescription = "Selected",
                tint = TonightTheme.colors.ink,
                modifier = Modifier.size(22.dp)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(20.dp)
                    .border(1.5.dp, TonightTheme.colors.hairline, CircleShape)
            )
        }
    }
}

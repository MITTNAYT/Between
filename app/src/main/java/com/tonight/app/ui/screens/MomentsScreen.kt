package com.tonight.app.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.FragmentActivity
import com.tonight.app.ui.components.Chip
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.IllustrationSlot
import com.tonight.app.ui.components.IllustrationStyle
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.security.BiometricHelper
import com.tonight.app.ui.theme.TonightTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * MomentsScreen:
 * Private on-device memory list.
 * Restyled with:
 * - Canvas background + blushGlow
 * - SoftCard memory cards with serif 18sp text
 * - Date and relationship type Chips
 * - Swipe-to-delete with soft red feedback
 * - Warm empty state with IllustrationSlot
 * - Biometric lock shield with clear unlock call-to-action
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MomentsScreen(
    viewModel: MomentsViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isLocked by viewModel.isLocked.collectAsState()
    val moments by viewModel.moments.collectAsState()
    val context = LocalContext.current
    var authError by remember { mutableStateOf<String?>(null) }
    val dateFormat = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())

    // Auto-prompt biometrics if locked
    LaunchedEffect(isLocked) {
        if (isLocked && context is FragmentActivity) {
            BiometricHelper.authenticate(
                activity = context,
                onSuccess = { viewModel.unlock() },
                onError = { err -> authError = err }
            )
        }
    }

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // TOP BAR: Back CircleIconButton + Title
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CircleIconButton(
                    icon = com.tonight.app.ui.theme.AppIcons.Back,
                    onClick = onBack,
                    contentDescription = "Return to home screen"
                )

                Text(
                    text = "Saved Moments",
                    style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                    color = TonightTheme.colors.ink,
                    modifier = Modifier.semantics { heading() }
                )

                // Placeholder for symmetry
                Spacer(modifier = Modifier.padding(22.dp))
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Private to this phone. Swipe to delete.",
                style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                color = TonightTheme.colors.muted,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(20.dp))

            if (isLocked) {
                // ==========================================
                // BIOMETRIC LOCKED STATE
                // ==========================================
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = 60.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        IllustrationSlot(
                            style = IllustrationStyle.BLOB_VIOLET,
                            size = 110.dp
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Text(
                            text = "Memories Protected",
                            style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                            color = TonightTheme.colors.ink,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Biometric authentication is required to access your private saved moments.",
                            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                            color = TonightTheme.colors.muted,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth(0.85f)
                        )

                        if (authError != null) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = authError ?: "",
                                color = TonightTheme.colors.support,
                                fontSize = 13.sp,
                                textAlign = TextAlign.Center
                            )
                        }

                        Spacer(modifier = Modifier.height(28.dp))

                        PrimaryButton(
                            text = "Unlock Memories",
                            onClick = {
                                if (context is FragmentActivity) {
                                    BiometricHelper.authenticate(
                                        activity = context,
                                        onSuccess = { viewModel.unlock() },
                                        onError = { err -> authError = err }
                                    )
                                }
                            },
                            contentDescription = "Unlock saved moments with biometric authentication"
                        )
                    }
                }
            } else if (moments.isEmpty()) {
                // ==========================================
                // WARM EMPTY STATE
                // ==========================================
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = 60.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        IllustrationSlot(
                            style = IllustrationStyle.BLOB_AMBER,
                            size = 120.dp
                        )

                        Spacer(modifier = Modifier.height(24.dp))

                        Text(
                            text = "No saved moments yet.",
                            style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                            color = TonightTheme.colors.ink,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "When you complete a session, you can privately capture words you want to keep.",
                            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                            color = TonightTheme.colors.muted,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth(0.85f)
                        )
                    }
                }
            } else {
                // ==========================================
                // SOFTCARD LIST WITH SWIPE TO DELETE
                // ==========================================
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    contentPadding = PaddingValues(bottom = 32.dp)
                ) {
                    items(moments, key = { it.id }) { moment ->
                        val dismissState = rememberSwipeToDismissBoxState(
                            confirmValueChange = { value ->
                                if (value == SwipeToDismissBoxValue.EndToStart || value == SwipeToDismissBoxValue.StartToEnd) {
                                    viewModel.deleteMoment(moment.id)
                                    true
                                } else false
                            }
                        )

                        SwipeToDismissBox(
                            state = dismissState,
                            backgroundContent = {
                                val color by animateColorAsState(
                                    targetValue = if (dismissState.targetValue != SwipeToDismissBoxValue.Settled) {
                                        TonightTheme.colors.support.copy(alpha = 0.15f)
                                    } else Color.Transparent,
                                    label = "swipe_bg"
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .clip(TonightTheme.shapes.card)
                                        .background(color)
                                        .padding(horizontal = 24.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Text(
                                        text = "Delete",
                                        style = TonightTheme.typography.caption.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = TonightTheme.colors.support
                                        )
                                    )
                                }
                            }
                        ) {
                            SoftCard(modifier = Modifier.fillMaxWidth()) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(22.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Chip(
                                            text = dateFormat.format(Date(moment.createdAt)),
                                            isSelected = false
                                        )

                                        val relLabel = moment.relationshipType.lowercase().replaceFirstChar {
                                            if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
                                        }

                                        Text(
                                            text = relLabel,
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = TonightTheme.colors.muted
                                            )
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(14.dp))

                                    Text(
                                        text = "“${moment.text}”",
                                        style = TonightTheme.typography.displayL.copy(
                                            fontSize = 18.sp,
                                            lineHeight = 26.sp
                                        ),
                                        color = TonightTheme.colors.ink
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Preview(name = "MomentsScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun MomentsScreenPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "Saved Moments",
                style = TonightTheme.typography.displayL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@Preview(name = "MomentsScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun MomentsScreenLargeFontPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "Saved Moments",
                style = TonightTheme.typography.displayL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}


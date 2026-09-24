package com.tonight.app.ui.screens

import android.app.Activity
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.data.SubscriptionPackageInfo
import com.tonight.app.data.SubscriptionPlanType
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.SparkButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

/**
 * PaywallScreen:
 * Restyled with light wellness palette:
 * - TonightScreen with blushGlow
 * - Source Serif display headline
 * - SoftCard plan cards with selection border
 * - SparkButton call to action
 */
@Composable
fun PaywallScreen(
    viewModel: PaywallViewModel,
    trigger: String,
    onDismiss: () -> Unit,
    onSuccess: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    LaunchedEffect(trigger) {
        viewModel.initPaywall(trigger)
    }

    LaunchedEffect(uiState.isSuccess) {
        if (uiState.isSuccess) {
            onSuccess()
        }
    }

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    CircleIconButton(
                        icon = "✕",
                        onClick = onDismiss,
                        contentDescription = "Close paywall"
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "BETWEEN PREMIUM",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 1.4.sp,
                        fontWeight = FontWeight.Bold,
                        color = TonightTheme.colors.muted
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                val headline = when (trigger) {
                    "monthly_limit" -> "You've reached your 2 free rituals this month"
                    "depth_l4" -> "Deepen your conversation with Level 4 & 5"
                    "moments_limit" -> "Expand your private memory vault"
                    else -> "Deepen how you connect tonight"
                }

                Text(
                    text = headline,
                    style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
                    color = TonightTheme.colors.ink,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.semantics { heading() }
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Unlock all depth levels, unlimited sessions, and infinite saved moments.",
                    style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                    color = TonightTheme.colors.muted,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Core reassurance banner: "one subscription covers both of you"
                Box(
                    modifier = Modifier
                        .softShadow(borderRadius = 20.dp, blurRadius = 10.dp, offsetY = 2.dp)
                        .clip(PillShape)
                        .background(TonightTheme.colors.surface)
                        .border(1.dp, TonightTheme.colors.hairline, PillShape)
                        .padding(horizontal = 18.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "✨ One subscription covers both of you",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TonightTheme.colors.ink
                        )
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                if (uiState.isLoading) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = TonightTheme.colors.ink)
                    }
                } else {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        uiState.packages.forEach { pkg ->
                            val isSelected = uiState.selectedPlan == pkg.planType
                            val borderMod = if (isSelected) {
                                Modifier.border(2.dp, TonightTheme.colors.ink, TonightTheme.shapes.card)
                            } else {
                                Modifier.border(1.dp, TonightTheme.colors.hairline, TonightTheme.shapes.card)
                            }

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .softShadow(borderRadius = 28.dp, blurRadius = 14.dp, offsetY = 4.dp)
                                    .clip(TonightTheme.shapes.card)
                                    .background(TonightTheme.colors.surface)
                                    .then(borderMod)
                                    .clickable { viewModel.selectPlan(pkg.planType) }
                                    .padding(20.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(
                                                text = pkg.title,
                                                style = TonightTheme.typography.titleM.copy(fontSize = 18.sp),
                                                color = TonightTheme.colors.ink
                                            )
                                            if (pkg.badge != null) {
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Box(
                                                    modifier = Modifier
                                                        .clip(PillShape)
                                                        .background(TonightTheme.colors.tilePink.copy(alpha = 0.15f))
                                                        .padding(horizontal = 8.dp, vertical = 2.dp)
                                                ) {
                                                    Text(
                                                        text = pkg.badge,
                                                        style = TonightTheme.typography.caption.copy(
                                                            fontSize = 11.sp,
                                                            fontWeight = FontWeight.Bold,
                                                            color = TonightTheme.colors.tilePink
                                                        )
                                                    )
                                                }
                                            }
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = pkg.period,
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 13.sp,
                                                color = TonightTheme.colors.muted
                                            )
                                        )
                                    }

                                    Text(
                                        text = pkg.priceFormatted,
                                        style = TonightTheme.typography.titleM.copy(
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        color = TonightTheme.colors.ink
                                    )
                                }
                            }
                        }
                    }
                }

                AnimatedVisibility(
                    visible = uiState.errorMessage != null,
                    enter = fadeIn(),
                    exit = fadeOut()
                ) {
                    Text(
                        text = uiState.errorMessage ?: "",
                        style = TonightTheme.typography.caption,
                        color = TonightTheme.colors.support,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }

            // Bottom action area
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 28.dp, top = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                SparkButton(
                    text = if (uiState.isPurchasing) "Processing..." else "Continue with ${uiState.selectedPlan.name.lowercase().replaceFirstChar { it.uppercase() }}",
                    onClick = {
                        val activity = context as? Activity
                        if (activity != null) {
                            viewModel.purchase(activity)
                        }
                    },
                    contentDescription = "Subscribe to Between Premium"
                )

                SecondaryButton(
                    text = "Restore Purchases",
                    onClick = { viewModel.restorePurchases() },
                    contentDescription = "Restore previous purchases"
                )

                Text(
                    text = "Cancel anytime in Google Play. No ads, no cloud sync, 100% private.",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        color = TonightTheme.colors.muted
                    ),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Preview(name = "PaywallScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun PaywallScreenPreview() {
    TonightTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TonightTheme.colors.canvas)
        ) {
            Text(
                text = "Between Premium",
                style = TonightTheme.typography.displayL,
                color = TonightTheme.colors.ink,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}


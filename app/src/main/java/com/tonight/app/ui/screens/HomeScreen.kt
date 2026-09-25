package com.tonight.app.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import com.tonight.app.ui.components.BottomSheetSurface
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.CoralHeroCard
import com.tonight.app.ui.components.NavItem
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PillNavBar
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.RelationshipOptionCard
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.SparkButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.CardCornerShape
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.SheetTopShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow

private data class RelationshipTypeUiData(
    val type: RelationshipType,
    val label: String,
    val color: Color,
    val icon: ImageVector,
    val caption: String
)

private data class DurationUiData(
    val length: SessionLength,
    val badge: String,
    val tabLabel: String,
    val title: String,
    val description: String,
    val questionCountText: String
)

private val DURATION_OPTIONS = listOf(
    DurationUiData(
        length = SessionLength.FIVE_MIN,
        badge = "5 mins",
        tabLabel = "5m",
        title = "Quick Check-in",
        description = "Five light questions to spark a quick, meaningful moment together.",
        questionCountText = "5 questions"
    ),
    DurationUiData(
        length = SessionLength.TEN_MIN,
        badge = "10 mins",
        tabLabel = "10m",
        title = "Warm Connection",
        description = "Ten questions moving from light ease into genuine closeness.",
        questionCountText = "10 questions"
    ),
    DurationUiData(
        length = SessionLength.FIFTEEN_MIN,
        badge = "15 mins",
        tabLabel = "15m",
        title = "Gentle Conversation",
        description = "Fifteen questions to connect, reflect, and unwind together.",
        questionCountText = "15 questions"
    ),
    DurationUiData(
        length = SessionLength.THIRTY_MIN,
        badge = "30 mins",
        tabLabel = "30m",
        title = "Go Deeper",
        description = "Thirty questions moving deeply toward mutual vulnerability and care.",
        questionCountText = "30 questions"
    )
)

/**
 * HomeScreen:
 * Light-first entry dashboard matching the wellness reference style.
 * Includes CoralHeroCard, 4-duration interactive selector, Daily Spark,
 * S3 ("Who's it with?") bottom sheet selector, and S3b ("Someone new" intro sheet).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: SetupViewModel,
    onBeginSession: (RelationshipType, SessionLength) -> Unit,
    onViewMoments: () -> Unit = {},
    onOpenPaywall: (trigger: String) -> Unit = {},
    onOpenSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    var showPartnerSheet by remember { mutableStateOf(false) }
    var showJustMetSheet by remember { mutableStateOf(false) }

    val partnerSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val justMetSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    val currentLength = when (uiState.sessionLength) {
        SessionLength.FIVE_MIN -> SessionLength.FIVE_MIN
        SessionLength.TEN_MIN -> SessionLength.TEN_MIN
        SessionLength.FIFTEEN_MIN, SessionLength.SESSION -> SessionLength.FIFTEEN_MIN
        SessionLength.THIRTY_MIN, SessionLength.DEEP -> SessionLength.THIRTY_MIN
    }
    val currentDurationIndex = DURATION_OPTIONS.indexOfFirst { it.length == currentLength }.coerceAtLeast(0)
    val activeDuration = DURATION_OPTIONS[currentDurationIndex]

    val allTypeOptions = listOf(
        RelationshipTypeUiData(
            type = RelationshipType.COUPLE,
            label = "Partner",
            color = TonightTheme.colors.tileRed,
            icon = AppIcons.Partner,
            caption = ""
        ),
        RelationshipTypeUiData(
            type = RelationshipType.FRIEND,
            label = "Friend",
            color = TonightTheme.colors.tileAmber,
            icon = AppIcons.Friend,
            caption = ""
        ),
        RelationshipTypeUiData(
            type = RelationshipType.JUST_MET,
            label = "Someone new",
            color = TonightTheme.colors.tileGreen,
            icon = AppIcons.SomeoneNew,
            caption = ""
        )
    )

    val displayedTypes = allTypeOptions

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                // TOP ROW: 48dp App-mark + Settings Button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val appIconShape = RoundedCornerShape(13.dp)
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .softShadow(borderRadius = 13.dp, blurRadius = 14.dp, offsetY = 4.dp)
                            .clip(appIconShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, appIconShape)
                            .semantics { contentDescription = "Between logo mark" },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.VennLoop,
                            contentDescription = null,
                            tint = TonightTheme.colors.ember,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    CircleIconButton(
                        icon = AppIcons.Settings,
                        onClick = onOpenSettings,
                        contentDescription = "Open Settings and Privacy"
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // UNIFIED HERO + DURATION CARD
                SoftCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        val heroIconShape = RoundedCornerShape(18.dp)
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .softShadow(borderRadius = 18.dp, blurRadius = 14.dp, offsetY = 4.dp)
                                .clip(heroIconShape)
                                .background(TonightTheme.colors.canvas)
                                .border(1.dp, TonightTheme.colors.hairline, heroIconShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.VennLoop,
                                contentDescription = "Between mark",
                                tint = TonightTheme.colors.ember,
                                modifier = Modifier.size(28.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Start a conversation",
                            style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                            color = TonightTheme.colors.ink,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.semantics { heading() }
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = "Choose your pace for tonight",
                            style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                            color = TonightTheme.colors.muted,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        // Duration Tabs Row: [5m] [10m] [15m] [30m]
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(PillShape)
                                .background(TonightTheme.colors.canvas)
                                .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                .padding(3.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            DURATION_OPTIONS.forEach { opt ->
                                val isTabSelected = opt.length == activeDuration.length
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(34.dp)
                                        .clip(PillShape)
                                        .background(
                                            if (isTabSelected) TonightTheme.colors.surface else Color.Transparent
                                        )
                                        .then(
                                            if (isTabSelected) {
                                                Modifier.softShadow(borderRadius = 17.dp, blurRadius = 6.dp, offsetY = 2.dp)
                                                    .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                            } else {
                                                Modifier
                                            }
                                        )
                                        .clickable {
                                            viewModel.selectSessionLength(opt.length)
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = opt.tabLabel,
                                        style = TonightTheme.typography.caption.copy(
                                            fontSize = 13.sp,
                                            fontWeight = if (isTabSelected) FontWeight.Bold else FontWeight.Medium,
                                            color = if (isTabSelected) TonightTheme.colors.ink else TonightTheme.colors.muted
                                        )
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        // Animated Description Content
                        AnimatedContent(
                            targetState = activeDuration,
                            transitionSpec = {
                                fadeIn(animationSpec = tween(220)) togetherWith fadeOut(animationSpec = tween(150))
                            },
                            label = "length_carousel"
                        ) { duration ->
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .clip(PillShape)
                                                .background(TonightTheme.colors.ink)
                                                .padding(horizontal = 12.dp, vertical = 5.dp)
                                        ) {
                                            Text(
                                                text = duration.badge,
                                                style = TonightTheme.typography.caption.copy(
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = TonightTheme.colors.surface
                                                )
                                            )
                                        }

                                        Spacer(modifier = Modifier.width(8.dp))

                                        Text(
                                            text = duration.questionCountText,
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Medium,
                                                color = TonightTheme.colors.muted
                                            )
                                        )
                                    }

                                    PageDots(
                                        count = 4,
                                        index = currentDurationIndex
                                    )
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Text(
                                    text = duration.title,
                                    style = TonightTheme.typography.titleM.copy(fontSize = 19.sp),
                                    color = TonightTheme.colors.ink,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = duration.description,
                                    style = TonightTheme.typography.body.copy(fontSize = 13.sp),
                                    color = TonightTheme.colors.muted,
                                    textAlign = TextAlign.Center,
                                    lineHeight = 19.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        SparkButton(
                            text = "Begin ${activeDuration.badge}",
                            onClick = {
                                viewModel.clearRelationshipTypeSelection()
                                showPartnerSheet = true
                            },
                            contentDescription = "Start ${activeDuration.badge} session"
                        )
                    }
                }
            }

            // BOTTOM FLOATING NAV PILL
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp, top = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                PillNavBar(
                    items = listOf(
                        NavItem(AppIcons.Chat, "Home"),
                        NavItem(AppIcons.Bookmark, "Moments")
                    ),
                    selectedIndex = 0,
                    onItemSelected = { index ->
                        if (index == 1) {
                            onViewMoments()
                        }
                    }
                )
            }
        }
    }

    // =========================================================================
    // S3: "WHO'S IT WITH?" BOTTOM SHEET - REFINED MINIMAL LIST
    // =========================================================================
    if (showPartnerSheet) {
        ModalBottomSheet(
            onDismissRequest = { showPartnerSheet = false },
            sheetState = partnerSheetState,
            shape = SheetTopShape,
            containerColor = TonightTheme.colors.surface,
            scrimColor = Color(0x40000000),
            dragHandle = null
        ) {
            BottomSheetSurface(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp)
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Who's this conversation with?",
                        style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "${activeDuration.badge} · ${activeDuration.questionCountText} for tonight",
                        style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                        color = TonightTheme.colors.muted,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // REFINED CARDS LIST
                    displayedTypes.forEach { tileData ->
                        val isSelected = uiState.selectedRelationshipType == tileData.type

                        RelationshipOptionCard(
                            label = tileData.label,
                            caption = tileData.caption,
                            accentColor = tileData.color,
                            icon = tileData.icon,
                            isSelected = isSelected,
                            isAvailable = true,
                            onClick = {
                                viewModel.selectRelationshipType(tileData.type)
                                showPartnerSheet = false
                                if (tileData.type == RelationshipType.JUST_MET) {
                                    showJustMetSheet = true
                                } else {
                                    onBeginSession(tileData.type, activeDuration.length)
                                }
                            }
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    SecondaryButton(
                        text = "Not now",
                        onClick = { showPartnerSheet = false },
                        contentDescription = "Dismiss conversation sheet"
                    )
                }
            }
        }
    }

    // =========================================================================
    // S3b: "YOU'RE MEETING FOR THE FIRST TIME" (JUST_MET ONLY)
    // =========================================================================
    if (showJustMetSheet) {
        ModalBottomSheet(
            onDismissRequest = { showJustMetSheet = false },
            sheetState = justMetSheetState,
            shape = SheetTopShape,
            containerColor = TonightTheme.colors.surface,
            scrimColor = Color(0x40000000),
            dragHandle = null
        ) {
            BottomSheetSurface(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "You're meeting for the first time.",
                        style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Take turns. Keep it easy. Anyone can pass on anything.",
                        style = TonightTheme.typography.body.copy(fontSize = 15.sp),
                        color = TonightTheme.colors.muted,
                        textAlign = TextAlign.Center,
                        lineHeight = 22.sp,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    PrimaryButton(
                        text = "Start",
                        onClick = {
                            showJustMetSheet = false
                            onBeginSession(RelationshipType.JUST_MET, activeDuration.length)
                        },
                        contentDescription = "Start session for someone new"
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    SecondaryButton(
                        text = "Back",
                        onClick = {
                            showJustMetSheet = false
                            showPartnerSheet = true
                        },
                        contentDescription = "Go back to relationship selection"
                    )
                }
            }
        }
    }
}

// Backward-compat alias for SetupScreen
@Composable
fun SetupScreen(
    viewModel: SetupViewModel,
    onBeginSession: (RelationshipType, SessionLength) -> Unit,
    onViewMoments: () -> Unit = {},
    onOpenPaywall: (trigger: String) -> Unit = {},
    onOpenSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    HomeScreen(
        viewModel = viewModel,
        onBeginSession = onBeginSession,
        onViewMoments = onViewMoments,
        onOpenPaywall = onOpenPaywall,
        onOpenSettings = onOpenSettings,
        modifier = modifier
    )
}

@Preview(name = "HomeScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun HomeScreenPreview() {
    TonightTheme {
        HomeScreen(
            viewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
            onBeginSession = { _, _ -> }
        )
    }
}

@Preview(name = "HomeScreen - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun HomeScreenLargeFontPreview() {
    TonightTheme {
        HomeScreen(
            viewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
            onBeginSession = { _, _ -> }
        )
    }
}

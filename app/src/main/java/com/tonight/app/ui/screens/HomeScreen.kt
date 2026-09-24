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
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
import com.tonight.app.ui.components.IllustrationSlot
import com.tonight.app.ui.components.IllustrationStyle
import com.tonight.app.ui.components.NavItem
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PillNavBar
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SecondaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.SparkButton
import com.tonight.app.ui.components.TileCard
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

/**
 * HomeScreen:
 * Light-first entry dashboard matching the wellness reference style.
 * Includes CoralHeroCard, session duration carousel, Support link,
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

    val allTypeOptions = listOf(
        RelationshipTypeUiData(
            type = RelationshipType.COUPLE,
            label = "Partner",
            color = TonightTheme.colors.tileViolet,
            icon = AppIcons.Partner,
            caption = "From playful to personal."
        ),
        RelationshipTypeUiData(
            type = RelationshipType.FRIEND,
            label = "Friend",
            color = TonightTheme.colors.tileAmber,
            icon = AppIcons.Friend,
            caption = "Go beyond hanging out."
        ),
        RelationshipTypeUiData(
            type = RelationshipType.JUST_MET,
            label = "Someone new",
            color = TonightTheme.colors.tileGreen,
            icon = AppIcons.SomeoneNew,
            caption = "Easy, curious questions for people meeting for the first time."
        )
    )

    // Filter for release: only available types shown. In debug: show all types.
    val displayedTypes = if (uiState.isDebug) {
        allTypeOptions
    } else {
        allTypeOptions.filter { it.type in uiState.availableTypes }
    }

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
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .softShadow(borderRadius = 24.dp, blurRadius = 14.dp, offsetY = 4.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, CircleShape)
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

                // EMBER HERO CARD
                CoralHeroCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(116.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                .size(68.dp)
                                .softShadow(borderRadius = 34.dp, blurRadius = 16.dp, offsetY = 4.dp)
                                .clip(CircleShape)
                                .background(TonightTheme.colors.surface)
                                .border(1.dp, TonightTheme.colors.hairline, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = AppIcons.VennLoop,
                                    contentDescription = "Venn Loop icon",
                                    tint = TonightTheme.colors.ember,
                                    modifier = Modifier.size(34.dp)
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(CardCornerShape)
                                .background(TonightTheme.colors.surface)
                                .padding(22.dp)
                        ) {
                            Column(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "Start a conversation",
                                    style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                                    color = TonightTheme.colors.ink,
                                    modifier = Modifier.semantics { heading() }
                                )

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = "Who's it with tonight?",
                                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                                    color = TonightTheme.colors.muted
                                )

                                Spacer(modifier = Modifier.height(16.dp))

                                SparkButton(
                                    text = "Let's begin",
                                    onClick = {
                                        viewModel.clearRelationshipTypeSelection()
                                        showPartnerSheet = true
                                    },
                                    contentDescription = "Open conversation setup sheet"
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                // SECTION: "FOR TONIGHT"
                Text(
                    text = "FOR TONIGHT",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 1.2.sp,
                        fontWeight = FontWeight.Bold,
                        color = TonightTheme.colors.muted
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics { heading() }
                )

                Spacer(modifier = Modifier.height(12.dp))

                // SESSION LENGTH CAROUSEL CARD
                val isDeep = uiState.sessionLength == SessionLength.DEEP
                SoftCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp)
                    ) {
                        AnimatedContent(
                            targetState = isDeep,
                            transitionSpec = {
                                fadeIn(animationSpec = tween(250)) togetherWith fadeOut(animationSpec = tween(150))
                            },
                            label = "length_carousel"
                        ) { deep ->
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .clip(PillShape)
                                            .background(TonightTheme.colors.ink)
                                            .padding(horizontal = 14.dp, vertical = 6.dp)
                                    ) {
                                        Text(
                                            text = if (deep) "30 mins" else "15 mins",
                                            style = TonightTheme.typography.caption.copy(
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = TonightTheme.colors.surface
                                            )
                                        )
                                    }

                                    PageDots(
                                        count = 2,
                                        index = if (deep) 1 else 0
                                    )
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = if (deep) "Go deeper" else "A gentle conversation",
                                    style = TonightTheme.typography.titleM.copy(fontSize = 20.sp),
                                    color = TonightTheme.colors.ink
                                )

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = if (deep) "Ten questions moving toward mutual vulnerability and care." else "Six light and warm questions to connect at the end of the day.",
                                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                                    color = TonightTheme.colors.muted,
                                    lineHeight = 20.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            CircleIconButton(
                                icon = AppIcons.Back,
                                onClick = {
                                    viewModel.selectSessionLength(SessionLength.SESSION)
                                },
                                contentDescription = "Select 15 minutes gentle session"
                            )

                            Spacer(modifier = Modifier.width(12.dp))

                            CircleIconButton(
                                icon = AppIcons.Forward,
                                onClick = {
                                    viewModel.selectSessionLength(SessionLength.DEEP)
                                },
                                contentDescription = "Select 30 minutes deep session"
                            )
                        }
                    }
                }

                // SECTION: "DAILY SPARK"
                Spacer(modifier = Modifier.height(28.dp))

                Text(
                    text = "DAILY SPARK",
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        letterSpacing = 1.2.sp,
                        fontWeight = FontWeight.Bold,
                        color = TonightTheme.colors.muted
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics { heading() }
                )

                Spacer(modifier = Modifier.height(12.dp))

                SoftCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(PillShape)
                                    .background(TonightTheme.colors.canvas)
                                    .border(1.dp, TonightTheme.colors.hairline, PillShape)
                                    .padding(horizontal = 12.dp, vertical = 5.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = AppIcons.EmberSpark,
                                        contentDescription = null,
                                        tint = TonightTheme.colors.ember,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Today's Question",
                                        style = TonightTheme.typography.caption.copy(
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = TonightTheme.colors.body
                                        )
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "What's something you're excited about right now?",
                            style = TonightTheme.typography.titleM.copy(fontSize = 18.sp),
                            color = TonightTheme.colors.ink,
                            lineHeight = 24.sp
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "A quick question for reflection or casual conversation.",
                            style = TonightTheme.typography.body.copy(fontSize = 13.sp),
                            color = TonightTheme.colors.muted
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
    // S3: "WHO'S IT WITH?" BOTTOM SHEET - TWO-COLUMN GRID OF TILE CARDS
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
                        text = "We'll calibrate depth and questions to fit your bond.",
                        style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                        color = TonightTheme.colors.muted,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    // TWO-COLUMN GRID OF TILE CARDS
                    val chunkedTiles = displayedTypes.chunked(2)
                    chunkedTiles.forEachIndexed { rowIndex, rowTiles ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            rowTiles.forEachIndexed { tileIndex, tileData ->
                                if (tileIndex > 0) {
                                    Spacer(modifier = Modifier.width(16.dp))
                                }
                                val isSelected = uiState.selectedRelationshipType == tileData.type
                                val isAvailable = !uiState.isDebug || (tileData.type in uiState.availableTypes)

                                TileCard(
                                    label = tileData.label,
                                    tileColor = tileData.color,
                                    icon = tileData.icon,
                                    isSelected = isSelected,
                                    isAvailable = isAvailable,
                                    onClick = {
                                        viewModel.selectRelationshipType(tileData.type)
                                    }
                                )
                            }
                        }
                        if (rowIndex < chunkedTiles.lastIndex) {
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // MUTED CAPTION FOR SELECTED TYPE
                    val selectedUiData = allTypeOptions.firstOrNull { it.type == uiState.selectedRelationshipType }
                    val captionText = selectedUiData?.caption ?: "Choose who you're speaking with to begin."

                    Text(
                        text = captionText,
                        style = TonightTheme.typography.body.copy(fontSize = 13.sp),
                        color = TonightTheme.colors.muted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    // CONTINUE BUTTON (Disabled until chosen)
                    PrimaryButton(
                        text = "Continue",
                        enabled = uiState.selectedRelationshipType != null,
                        onClick = {
                            val selectedType = uiState.selectedRelationshipType ?: return@PrimaryButton
                            showPartnerSheet = false
                            if (selectedType == RelationshipType.JUST_MET) {
                                showJustMetSheet = true
                            } else {
                                viewModel.checkCanBeginSession(
                                    onAllowed = {
                                        onBeginSession(selectedType, uiState.sessionLength)
                                    },
                                    onLimitReached = { trigger ->
                                        onOpenPaywall(trigger)
                                    }
                                )
                            }
                        },
                        contentDescription = "Continue with selected relationship type"
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    SecondaryButton(
                        text = "Not tonight",
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
                            viewModel.checkCanBeginSession(
                                onAllowed = {
                                    onBeginSession(RelationshipType.JUST_MET, uiState.sessionLength)
                                },
                                onLimitReached = { trigger ->
                                    onOpenPaywall(trigger)
                                }
                            )
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

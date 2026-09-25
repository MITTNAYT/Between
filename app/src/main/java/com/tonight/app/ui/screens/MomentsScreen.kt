package com.tonight.app.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
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
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.NavItem
import com.tonight.app.ui.components.PillNavBar
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.SparkButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.security.BiometricHelper
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * MomentsScreen:
 * Private on-device memory list matching the app's refined light wellness aesthetic.
 * - Symmetrical header with back navigation and privacy indicator
 * - Sleek memory card designs with relationship badges & formatted timestamps
 * - Smooth swipe-to-delete with soft red feedback
 * - Warm empty state with quick action to begin a conversation
 * - Seamless bottom pill bar navigation
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
    val dateFormat = remember { SimpleDateFormat("MMMM d, yyyy", Locale.getDefault()) }

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
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))

                // TOP ROW: Back button + Title + Symmetry Spacer
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircleIconButton(
                        icon = AppIcons.Back,
                        onClick = onBack,
                        contentDescription = "Return to home"
                    )

                    Text(
                        text = "Saved Moments",
                        style = TonightTheme.typography.displayL.copy(fontSize = 24.sp),
                        color = TonightTheme.colors.ink,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.semantics { heading() }
                    )

                    // Right balance mark / bookmark icon
                    val badgeShape = RoundedCornerShape(13.dp)
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .softShadow(borderRadius = 13.dp, blurRadius = 14.dp, offsetY = 4.dp)
                            .clip(badgeShape)
                            .background(TonightTheme.colors.surface)
                            .border(1.dp, TonightTheme.colors.hairline, badgeShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.Bookmark,
                            contentDescription = "Saved moments",
                            tint = TonightTheme.colors.ember,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // SUMMARY SUBHEADER PILL
                Row(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(TonightTheme.colors.canvas)
                        .border(1.dp, TonightTheme.colors.hairline, PillShape)
                        .padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(TonightTheme.colors.ember)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (moments.isNotEmpty()) {
                            "${moments.size} ${if (moments.size == 1) "memory" else "memories"} saved on this phone"
                        } else {
                            "Private & encrypted on this phone"
                        },
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = TonightTheme.colors.muted
                        )
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                if (isLocked) {
                    // ==========================================
                    // BIOMETRIC LOCKED STATE
                    // ==========================================
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        SoftCard(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(28.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                val lockIconShape = RoundedCornerShape(18.dp)
                                Box(
                                    modifier = Modifier
                                        .size(60.dp)
                                        .softShadow(borderRadius = 18.dp, blurRadius = 14.dp, offsetY = 4.dp)
                                        .clip(lockIconShape)
                                        .background(TonightTheme.colors.canvas)
                                        .border(1.dp, TonightTheme.colors.hairline, lockIconShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = AppIcons.Lock,
                                        contentDescription = "Locked",
                                        tint = TonightTheme.colors.ember,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(20.dp))

                                Text(
                                    text = "Memories Protected",
                                    style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                                    color = TonightTheme.colors.ink,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = "Biometric authentication is required to access your private saved moments.",
                                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                                    color = TonightTheme.colors.muted,
                                    textAlign = TextAlign.Center,
                                    lineHeight = 20.sp
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

                                Spacer(modifier = Modifier.height(24.dp))

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
                    }
                } else if (moments.isEmpty()) {
                    // ==========================================
                    // WARM EMPTY STATE
                    // ==========================================
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        SoftCard(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(28.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                val emptyIconShape = RoundedCornerShape(18.dp)
                                Box(
                                    modifier = Modifier
                                        .size(60.dp)
                                        .softShadow(borderRadius = 18.dp, blurRadius = 14.dp, offsetY = 4.dp)
                                        .clip(emptyIconShape)
                                        .background(TonightTheme.colors.canvas)
                                        .border(1.dp, TonightTheme.colors.hairline, emptyIconShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = AppIcons.Bookmark,
                                        contentDescription = "No saved moments",
                                        tint = TonightTheme.colors.ember,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(20.dp))

                                Text(
                                    text = "No saved moments yet",
                                    style = TonightTheme.typography.displayL.copy(fontSize = 22.sp),
                                    color = TonightTheme.colors.ink,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = "When you complete a conversation, you can privately bookmark words and memories you wish to keep.",
                                    style = TonightTheme.typography.body.copy(fontSize = 14.sp),
                                    color = TonightTheme.colors.muted,
                                    textAlign = TextAlign.Center,
                                    lineHeight = 20.sp
                                )

                                Spacer(modifier = Modifier.height(24.dp))

                                SparkButton(
                                    text = "Start a conversation",
                                    onClick = onBack,
                                    contentDescription = "Begin a conversation to save moments"
                                )
                            }
                        }
                    }
                } else {
                    // ==========================================
                    // REFINED CARD LIST WITH SWIPE TO DELETE
                    // ==========================================
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                        contentPadding = PaddingValues(top = 4.dp, bottom = 24.dp)
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
                                            TonightTheme.colors.support.copy(alpha = 0.12f)
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
                                        // Card Header: Date Badge + Relationship Pill
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = dateFormat.format(Date(moment.createdAt)),
                                                style = TonightTheme.typography.caption.copy(
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Medium,
                                                    color = TonightTheme.colors.muted
                                                )
                                            )

                                            val relLabel = moment.relationshipType.lowercase().replaceFirstChar {
                                                if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
                                            }
                                            val relColor = when (moment.relationshipType.uppercase()) {
                                                "COUPLE" -> TonightTheme.colors.tileRed
                                                "FRIEND" -> TonightTheme.colors.tileAmber
                                                else -> TonightTheme.colors.tileGreen
                                            }

                                            Box(
                                                modifier = Modifier
                                                    .clip(PillShape)
                                                    .background(relColor.copy(alpha = 0.10f))
                                                    .border(1.dp, relColor.copy(alpha = 0.25f), PillShape)
                                                    .padding(horizontal = 10.dp, vertical = 3.dp)
                                            ) {
                                                Text(
                                                    text = relLabel,
                                                    style = TonightTheme.typography.caption.copy(
                                                        fontSize = 11.sp,
                                                        fontWeight = FontWeight.SemiBold,
                                                        color = relColor
                                                    )
                                                )
                                            }
                                        }

                                        Spacer(modifier = Modifier.height(14.dp))

                                        Text(
                                            text = "“${moment.text}”",
                                            style = TonightTheme.typography.displayL.copy(
                                                fontSize = 18.sp,
                                                lineHeight = 26.sp,
                                                fontWeight = FontWeight.Normal
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

            // BOTTOM FLOATING NAV PILL
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 24.dp, top = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                PillNavBar(
                    items = listOf(
                        NavItem(AppIcons.Chat, "Home"),
                        NavItem(AppIcons.Bookmark, "Moments")
                    ),
                    selectedIndex = 1,
                    onItemSelected = { index ->
                        if (index == 0) {
                            onBack()
                        }
                    }
                )
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

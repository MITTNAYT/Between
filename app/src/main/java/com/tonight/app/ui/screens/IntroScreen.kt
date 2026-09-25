package com.tonight.app.ui.screens

import android.view.HapticFeedbackConstants
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.SoftCard
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.AppIcons
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow
import kotlinx.coroutines.launch

sealed interface OnboardingPage {
    data class HowItWorks(
        val title: String = "Put the phone between you.",
        val subtitle: String = "Between is a guided conversation for two. You talk face-to-face; the phone simply sets the pace."
    ) : OnboardingPage

    data class HowToPlay(
        val title: String = "Take turns & speak openly.",
        val subtitle: String = "One person reads aloud and answers first, then passes the conversation to the other."
    ) : OnboardingPage

    data class GroundRules(
        val title: String = "The 3 Ground Rules",
        val subtitle: String = "Simple boundaries to make every conversation feel safe, effortless, and connected."
    ) : OnboardingPage

    data class SaveMoments(
        val title: String = "Keep what matters.",
        val subtitle: String = "Bookmark quotes, memorable answers, and takeaways into your private vault on this device."
    ) : OnboardingPage
}

private val ONBOARDING_PAGES: List<OnboardingPage> = listOf(
    OnboardingPage.HowItWorks(),
    OnboardingPage.HowToPlay(),
    OnboardingPage.GroundRules(),
    OnboardingPage.SaveMoments()
)

/**
 * IntroScreen / OnboardingScreen:
 * Ultra-premium, Apple-grade 4-step onboarding explaining how the game is played and the golden rules.
 */
@Composable
fun IntroScreen(
    onFinishIntro: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current
    val pagerState = rememberPagerState(pageCount = { ONBOARDING_PAGES.size })
    val scope = rememberCoroutineScope()

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // TOP HEADER: Segmented Progress Bar + Skip Button
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Segmented Step Indicator
                    Row(
                        modifier = Modifier.weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(ONBOARDING_PAGES.size) { index ->
                            val isCompleted = index <= pagerState.currentPage
                            val progressAlpha by animateFloatAsState(
                                targetValue = if (isCompleted) 1f else 0.25f,
                                animationSpec = tween(300, easing = FastOutSlowInEasing),
                                label = "step_progress_$index"
                            )
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(4.dp)
                                    .clip(PillShape)
                                    .background(
                                        if (isCompleted) TonightTheme.colors.ember else TonightTheme.colors.hairline.copy(alpha = progressAlpha)
                                    )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    if (pagerState.currentPage < ONBOARDING_PAGES.size - 1) {
                        Text(
                            text = "Skip",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TonightTheme.colors.ember
                            ),
                            modifier = Modifier
                                .clip(PillShape)
                                .clickable {
                                    view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                                    onFinishIntro()
                                }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    } else {
                        Spacer(modifier = Modifier.width(36.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // MAIN PAGER CONTENT
            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) { pageIndex ->
                val page = ONBOARDING_PAGES[pageIndex]
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    when (page) {
                        is OnboardingPage.HowItWorks -> HowItWorksContent(page)
                        is OnboardingPage.HowToPlay -> HowToPlayContent(page)
                        is OnboardingPage.GroundRules -> GroundRulesContent(page)
                        is OnboardingPage.SaveMoments -> SaveMomentsContent(page)
                    }
                }
            }

            // BOTTOM NAVIGATION BAR
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp, top = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (pagerState.currentPage == ONBOARDING_PAGES.size - 1) {
                    PrimaryButton(
                        text = "Begin Experience",
                        onClick = {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onFinishIntro()
                        },
                        contentDescription = "Begin using Between"
                    )
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (pagerState.currentPage > 0) {
                            CircleIconButton(
                                icon = AppIcons.Back,
                                onClick = {
                                    view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                                    scope.launch {
                                        pagerState.animateScrollToPage(pagerState.currentPage - 1)
                                    }
                                },
                                contentDescription = "Previous onboarding page"
                            )
                        } else {
                            Box(modifier = Modifier.size(44.dp))
                        }

                        PageDots(
                            count = ONBOARDING_PAGES.size,
                            index = pagerState.currentPage
                        )

                        CircleIconButton(
                            icon = AppIcons.Forward,
                            onClick = {
                                view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
                                scope.launch {
                                    pagerState.animateScrollToPage(pagerState.currentPage + 1)
                                }
                            },
                            contentDescription = "Next onboarding page"
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HowItWorksContent(page: OnboardingPage.HowItWorks) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = page.title,
            style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
            color = TonightTheme.colors.ink,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() }
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = page.subtitle,
            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
            color = TonightTheme.colors.muted,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.fillMaxWidth(0.92f)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Visual Illustration: Phone & Two Partners
        SoftCard(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PlayerBadge(
                        label = "Player 1",
                        role = "Speaker",
                        color = TonightTheme.colors.tileRed
                    )

                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .softShadow(borderRadius = 18.dp, blurRadius = 12.dp, offsetY = 4.dp)
                            .clip(RoundedCornerShape(18.dp))
                            .background(TonightTheme.colors.canvas)
                            .border(1.dp, TonightTheme.colors.hairline, RoundedCornerShape(18.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.VennLoop,
                            contentDescription = null,
                            tint = TonightTheme.colors.ember,
                            modifier = Modifier.size(28.dp)
                        )
                    }

                    PlayerBadge(
                        label = "Player 2",
                        role = "Listener",
                        color = TonightTheme.colors.tileAmber
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(TonightTheme.colors.canvas)
                        .border(1.dp, TonightTheme.colors.hairline, RoundedCornerShape(14.dp))
                        .padding(horizontal = 14.dp, vertical = 12.dp)
                ) {
                    Text(
                        text = "Sit comfortably facing each other. Turn off outside notifications and enjoy the rhythm.",
                        style = TonightTheme.typography.caption.copy(fontSize = 13.sp, lineHeight = 18.sp),
                        color = TonightTheme.colors.body,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
private fun HowToPlayContent(page: OnboardingPage.HowToPlay) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = page.title,
            style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
            color = TonightTheme.colors.ink,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() }
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = page.subtitle,
            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
            color = TonightTheme.colors.muted,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.fillMaxWidth(0.92f)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Visual Mock Question Card
        SoftCard(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp)
        ) {
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
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(TonightTheme.colors.tileRed.copy(alpha = 0.14f))
                            .border(1.dp, TonightTheme.colors.tileRed.copy(alpha = 0.35f), PillShape)
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "Speaker 1's turn",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TonightTheme.colors.tileRed
                            )
                        )
                    }

                    Text(
                        text = "Question 1 of 10",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = TonightTheme.colors.muted
                        )
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "“What is a small detail about this week that you haven't told anyone?”",
                    style = TonightTheme.typography.displayL.copy(
                        fontSize = 17.sp,
                        lineHeight = 25.sp,
                        fontWeight = FontWeight.Normal
                    ),
                    color = TonightTheme.colors.ink
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(TonightTheme.colors.ink)
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Pass to them",
                                style = TonightTheme.typography.caption.copy(
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TonightTheme.colors.surface
                                )
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = AppIcons.TurnPass,
                                contentDescription = null,
                                tint = TonightTheme.colors.surface,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GroundRulesContent(page: OnboardingPage.GroundRules) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = page.title,
            style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
            color = TonightTheme.colors.ink,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() }
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = page.subtitle,
            style = TonightTheme.typography.body.copy(fontSize = 14.sp),
            color = TonightTheme.colors.muted,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
            modifier = Modifier.fillMaxWidth(0.92f)
        )

        Spacer(modifier = Modifier.height(18.dp))

        // 3 Ground Rules Cards
        RuleCard(
            icon = AppIcons.TurnPass,
            accentColor = TonightTheme.colors.tileAmber,
            title = "1. Anyone Can Pass",
            description = "Skip any prompt without explanation. There is zero pressure, friction, or guilt."
        )

        Spacer(modifier = Modifier.height(10.dp))

        RuleCard(
            icon = AppIcons.ArrowDown,
            accentColor = TonightTheme.colors.tileGreen,
            title = "2. Adjust Question Depth",
            description = "Ask for lighter or deeper questions whenever you want. You set the intimacy pace."
        )

        Spacer(modifier = Modifier.height(10.dp))

        RuleCard(
            icon = AppIcons.Partner,
            accentColor = TonightTheme.colors.tileRed,
            title = "3. Listen Without Fixing",
            description = "No unsolicited advice or quick fixes. Offer your undivided presence and curiosity."
        )
    }
}

@Composable
private fun SaveMomentsContent(page: OnboardingPage.SaveMoments) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = page.title,
            style = TonightTheme.typography.displayL.copy(fontSize = 26.sp),
            color = TonightTheme.colors.ink,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() }
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = page.subtitle,
            style = TonightTheme.typography.body.copy(fontSize = 15.sp),
            color = TonightTheme.colors.muted,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.fillMaxWidth(0.92f)
        )

        Spacer(modifier = Modifier.height(24.dp))

        SoftCard(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp)
        ) {
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
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(TonightTheme.colors.tileRed.copy(alpha = 0.12f))
                            .border(1.dp, TonightTheme.colors.tileRed.copy(alpha = 0.3f), PillShape)
                            .padding(horizontal = 10.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "Partner · Saved Memory",
                            style = TonightTheme.typography.caption.copy(
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TonightTheme.colors.tileRed
                            )
                        )
                    }

                    Icon(
                        imageVector = AppIcons.Bookmark,
                        contentDescription = null,
                        tint = TonightTheme.colors.tileRed,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "“I realized that just sitting with you in silence is my favorite part of the day.”",
                    style = TonightTheme.typography.displayL.copy(
                        fontSize = 16.sp,
                        lineHeight = 24.sp,
                        fontWeight = FontWeight.Normal
                    ),
                    color = TonightTheme.colors.ink
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = AppIcons.Lock,
                        contentDescription = null,
                        tint = TonightTheme.colors.muted,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Encrypted & stored strictly on this device",
                        style = TonightTheme.typography.caption.copy(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = TonightTheme.colors.muted
                        )
                    )
                }
            }
        }
    }
}

@Composable
private fun PlayerBadge(label: String, role: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .size(46.dp)
                .softShadow(borderRadius = 23.dp, blurRadius = 8.dp, offsetY = 2.dp)
                .clip(CircleShape)
                .background(color.copy(alpha = 0.14f))
                .border(1.5.dp, color.copy(alpha = 0.4f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (label.contains("1")) AppIcons.Partner else AppIcons.Friend,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = label,
            style = TonightTheme.typography.caption.copy(
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = TonightTheme.colors.ink
            )
        )

        Text(
            text = role,
            style = TonightTheme.typography.caption.copy(
                fontSize = 11.sp,
                color = TonightTheme.colors.muted
            )
        )
    }
}

@Composable
private fun RuleCard(
    icon: ImageVector,
    accentColor: Color,
    title: String,
    description: String
) {
    SoftCard(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .softShadow(borderRadius = 21.dp, blurRadius = 6.dp, offsetY = 2.dp)
                    .clip(CircleShape)
                    .background(accentColor.copy(alpha = 0.14f))
                    .border(1.5.dp, accentColor.copy(alpha = 0.4f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = TonightTheme.typography.titleM.copy(
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TonightTheme.colors.ink
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = description,
                    style = TonightTheme.typography.caption.copy(
                        fontSize = 12.sp,
                        lineHeight = 17.sp
                    ),
                    color = TonightTheme.colors.muted
                )
            }
        }
    }
}

@Preview(name = "IntroScreen - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun IntroScreenPreview() {
    TonightTheme {
        IntroScreen(onFinishIntro = {})
    }
}

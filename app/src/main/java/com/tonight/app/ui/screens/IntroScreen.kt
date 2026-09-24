package com.tonight.app.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tonight.app.ui.components.CircleIconButton
import com.tonight.app.ui.components.IllustrationSlot
import com.tonight.app.ui.components.IllustrationStyle
import com.tonight.app.ui.components.PageDots
import com.tonight.app.ui.components.PrimaryButton
import com.tonight.app.ui.components.TonightScreen
import com.tonight.app.ui.theme.PillShape
import com.tonight.app.ui.theme.TonightTheme
import com.tonight.app.ui.theme.softShadow
import kotlinx.coroutines.launch

data class IntroPageData(
    val title: String,
    val description: String,
    val illustrationStyle: IllustrationStyle
)

val introPages = listOf(
    IntroPageData(
        title = "Hey. Put the phone between you.",
        description = "Between is a guided conversation for two. You talk; the phone just keeps the pace.",
        illustrationStyle = IllustrationStyle.BLOB_PINK
    ),
    IntroPageData(
        title = "Anyone can pass.",
        description = "Skip any question, no explanation. Ask for lighter or deeper whenever you like.",
        illustrationStyle = IllustrationStyle.BLOB_AMBER
    ),
    IntroPageData(
        title = "Listen without fixing.",
        description = "You don't need to answer well. You just need to be there.",
        illustrationStyle = IllustrationStyle.BLOB_VIOLET
    )
)

/**
 * Intro Pager:
 * 3 tranquil introductory pages with blushGlow, IllustrationSlot hero, Source Serif 4 headline,
 * and floating bottom nav pill.
 */
@Composable
fun IntroScreen(
    onFinishIntro: () -> Unit,
    modifier: Modifier = Modifier
) {
    val pagerState = rememberPagerState(pageCount = { introPages.size })
    val scope = rememberCoroutineScope()

    TonightScreen(modifier = modifier, showBlushGlow = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Main Pager Area
            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) { pageIndex ->
                val pageData = introPages[pageIndex]
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 16.dp)
                    ) {
                        Text(
                            text = pageData.title,
                            style = TonightTheme.typography.displayL.copy(fontSize = 28.sp),
                            color = TonightTheme.colors.ink,
                            textAlign = TextAlign.Center,
                            lineHeight = 36.sp,
                            modifier = Modifier
                                .fillMaxWidth()
                                .semantics { heading() }
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = pageData.description,
                            style = TonightTheme.typography.body.copy(fontSize = 16.sp),
                            color = TonightTheme.colors.muted,
                            textAlign = TextAlign.Center,
                            lineHeight = 24.sp,
                            modifier = Modifier.fillMaxWidth(0.9f)
                        )
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        IllustrationSlot(
                            style = pageData.illustrationStyle,
                            size = 180.dp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                }
            }

            // Bottom Navigation Row
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 20.dp, top = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                if (pagerState.currentPage == introPages.size - 1) {
                    // Last page: PrimaryButton "Begin"
                    PrimaryButton(
                        text = "Begin",
                        onClick = onFinishIntro,
                        contentDescription = "Begin using Tonight"
                    )
                } else {
                    // Intermediate pages: Floating pill container with prev, PageDots, next
                    Box(
                        modifier = Modifier
                            .softShadow(borderRadius = 32.dp, blurRadius = 24.dp, offsetY = 6.dp)
                            .clip(PillShape)
                            .background(TonightTheme.colors.surface)
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (pagerState.currentPage > 0) {
                                CircleIconButton(
                                    icon = com.tonight.app.ui.theme.AppIcons.Back,
                                    onClick = {
                                        scope.launch {
                                            pagerState.animateScrollToPage(pagerState.currentPage - 1)
                                        }
                                    },
                                    contentDescription = "Previous intro page"
                                )
                            } else {
                                Spacer(modifier = Modifier.size(44.dp))
                            }

                            PageDots(
                                count = introPages.size,
                                index = pagerState.currentPage
                            )

                            CircleIconButton(
                                icon = com.tonight.app.ui.theme.AppIcons.Forward,
                                onClick = {
                                    scope.launch {
                                        pagerState.animateScrollToPage(pagerState.currentPage + 1)
                                    }
                                },
                                contentDescription = "Next intro page"
                            )
                        }
                    }
                }
            }
        }
    }
}

@Preview(name = "IntroScreen Page 1 - 1.0 Font Scale", fontScale = 1.0f)
@Composable
private fun IntroScreenPage1Preview() {
    TonightTheme {
        IntroScreen(onFinishIntro = {})
    }
}

@Preview(name = "IntroScreen Page 1 - 1.5 Font Scale", fontScale = 1.5f)
@Composable
private fun IntroScreenLargeFontPreview() {
    TonightTheme {
        IntroScreen(onFinishIntro = {})
    }
}

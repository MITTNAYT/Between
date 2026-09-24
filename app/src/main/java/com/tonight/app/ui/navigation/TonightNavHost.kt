package com.tonight.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import com.tonight.app.ui.screens.BreathPacerScreen
import com.tonight.app.ui.screens.ClosingScreen
import com.tonight.app.ui.screens.ClosingViewModel
import com.tonight.app.ui.screens.IntroScreen
import com.tonight.app.ui.screens.IntroViewModel
import com.tonight.app.ui.screens.MomentsScreen
import com.tonight.app.ui.screens.MomentsViewModel
import com.tonight.app.ui.screens.OpeningAnimationScreen
import com.tonight.app.ui.screens.PaywallScreen
import com.tonight.app.ui.screens.PaywallViewModel
import com.tonight.app.ui.screens.SessionScreen
import com.tonight.app.ui.screens.SessionViewModel
import com.tonight.app.ui.screens.SettingsScreen
import com.tonight.app.ui.screens.SettingsViewModel
import com.tonight.app.ui.screens.SetupScreen
import com.tonight.app.ui.screens.SetupViewModel
import kotlinx.serialization.Serializable

sealed interface Route {
    @Serializable
    data object Splash : Route

    @Serializable
    data object Intro : Route

    @Serializable
    data object Setup : Route

    @Serializable
    data class BreathPacer(
        val relationshipType: String,
        val sessionLength: String
    ) : Route

    @Serializable
    data class Session(
        val relationshipType: String,
        val sessionLength: String
    ) : Route

    @Serializable
    data class Closing(
        val relationshipType: String,
        val sessionLength: String,
        val depthReached: Int,
        val questionCount: Int
    ) : Route

    @Serializable
    data object Moments : Route

    @Serializable
    data class Paywall(
        val trigger: String = "direct"
    ) : Route

    @Serializable
    data object Settings : Route
}

@Composable
fun TonightNavHost(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    val introViewModel: IntroViewModel = hiltViewModel()
    val hasSeenIntro by introViewModel.hasSeenIntro.collectAsState()

    NavHost(
        navController = navController,
        startDestination = Route.Splash,
        modifier = modifier
    ) {
        composable<Route.Splash> {
            OpeningAnimationScreen(
                onAnimationFinished = {
                    if (!hasSeenIntro) {
                        navController.navigate(Route.Intro) {
                            popUpTo<Route.Splash> { inclusive = true }
                        }
                    } else {
                        navController.navigate(Route.Setup) {
                            popUpTo<Route.Splash> { inclusive = true }
                        }
                    }
                }
            )
        }

        composable<Route.Intro> {
            IntroScreen(
                onFinishIntro = {
                    introViewModel.completeIntro()
                    navController.navigate(Route.Setup) {
                        popUpTo<Route.Intro> { inclusive = true }
                    }
                }
            )
        }

        composable<Route.Setup> {
            val setupViewModel: SetupViewModel = hiltViewModel()
            SetupScreen(
                viewModel = setupViewModel,
                onBeginSession = { relType, len ->
                    navController.navigate(
                        Route.BreathPacer(
                            relationshipType = relType.name,
                            sessionLength = len.name
                        )
                    )
                },
                onViewMoments = {
                    navController.navigate(Route.Moments)
                },
                onOpenPaywall = { trigger ->
                    navController.navigate(Route.Paywall(trigger = trigger))
                },
                onOpenSettings = {
                    navController.navigate(Route.Settings)
                }
            )
        }

        composable<Route.BreathPacer> { backStackEntry ->
            val args = backStackEntry.toRoute<Route.BreathPacer>()
            BreathPacerScreen(
                onReady = {
                    navController.navigate(
                        Route.Session(
                            relationshipType = args.relationshipType,
                            sessionLength = args.sessionLength
                        )
                    ) {
                        popUpTo<Route.BreathPacer> { inclusive = true }
                    }
                }
            )
        }

        composable<Route.Session> { backStackEntry ->
            val args = backStackEntry.toRoute<Route.Session>()
            val relType = RelationshipType.valueOf(args.relationshipType)
            val len = SessionLength.valueOf(args.sessionLength)

            val sessionViewModel: SessionViewModel = hiltViewModel()

            LaunchedEffect(args) {
                sessionViewModel.startSession(relType, len)
            }

            SessionScreen(
                viewModel = sessionViewModel,
                onSessionFinished = {
                    val questions = sessionViewModel.uiState.value.questions
                    val maxDepth = questions.maxOfOrNull { it.depth } ?: 4
                    val count = questions.size

                    navController.navigate(
                        Route.Closing(
                            relationshipType = args.relationshipType,
                            sessionLength = args.sessionLength,
                            depthReached = maxDepth,
                            questionCount = count
                        )
                    ) {
                        popUpTo<Route.Setup>()
                    }
                }
            )
        }

        composable<Route.Closing> { backStackEntry ->
            val args = backStackEntry.toRoute<Route.Closing>()
            val closingViewModel: ClosingViewModel = hiltViewModel()

            ClosingScreen(
                viewModel = closingViewModel,
                relationshipType = args.relationshipType,
                sessionLength = args.sessionLength,
                depthReached = args.depthReached,
                questionCount = args.questionCount,
                onFinish = {
                    navController.navigate(Route.Setup) {
                        popUpTo<Route.Setup> { inclusive = true }
                    }
                },
                onViewMoments = {
                    navController.navigate(Route.Moments) {
                        popUpTo<Route.Setup>()
                    }
                }
            )
        }

        composable<Route.Moments> {
            val momentsViewModel: MomentsViewModel = hiltViewModel()
            MomentsScreen(
                viewModel = momentsViewModel,
                onBack = {
                    navController.popBackStack()
                }
            )
        }

        composable<Route.Paywall> { backStackEntry ->
            val args = backStackEntry.toRoute<Route.Paywall>()
            val paywallViewModel: PaywallViewModel = hiltViewModel()
            PaywallScreen(
                viewModel = paywallViewModel,
                trigger = args.trigger,
                onDismiss = {
                    navController.popBackStack()
                },
                onSuccess = {
                    navController.popBackStack()
                }
            )
        }

        composable<Route.Settings> {
            val settingsViewModel: SettingsViewModel = hiltViewModel()
            SettingsScreen(
                viewModel = settingsViewModel,
                onBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}

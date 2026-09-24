package com.tonight.app.ui.screens

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength

/**
 * SetupScreen delegates to HomeScreen to provide the light wellness entry experience.
 */
@Composable
fun SetupScreenAlias(
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

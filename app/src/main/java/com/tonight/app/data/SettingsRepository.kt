package com.tonight.app.data

import com.tonight.app.ui.theme.PaletteMode
import kotlinx.coroutines.flow.Flow

interface SettingsRepository {
    val isBiometricLockEnabled: Flow<Boolean>
    suspend fun setBiometricLockEnabled(enabled: Boolean)
    val hasSeenIntro: Flow<Boolean>
    suspend fun setHasSeenIntro(seen: Boolean)
    val paletteMode: Flow<PaletteMode>
    suspend fun setPaletteMode(mode: PaletteMode)
    suspend fun deleteAllUserData()
}


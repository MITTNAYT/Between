package com.tonight.app.data

import android.content.Context
import android.content.SharedPreferences
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LocalSettingsRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val database: TonightDatabase
) : SettingsRepository {

    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO

    private val prefs: SharedPreferences =
        context.getSharedPreferences("tonight_settings", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_BIOMETRIC_LOCK = "key_biometric_lock"
        private const val KEY_HAS_SEEN_INTRO = "key_has_seen_intro"
        private const val KEY_PALETTE_MODE = "key_palette_mode"
    }

    private val _hasSeenIntro = MutableStateFlow(prefs.getBoolean(KEY_HAS_SEEN_INTRO, false))
    override val hasSeenIntro: Flow<Boolean> = _hasSeenIntro.asStateFlow()

    private val _isBiometricLockEnabled = MutableStateFlow(prefs.getBoolean(KEY_BIOMETRIC_LOCK, false))
    override val isBiometricLockEnabled: Flow<Boolean> = _isBiometricLockEnabled.asStateFlow()

    private val _paletteMode = MutableStateFlow(
        try {
            com.tonight.app.ui.theme.PaletteMode.valueOf(
                prefs.getString(KEY_PALETTE_MODE, com.tonight.app.ui.theme.PaletteMode.WARM_LINEN.name) 
                    ?: com.tonight.app.ui.theme.PaletteMode.WARM_LINEN.name
            )
        } catch (_: Exception) {
            com.tonight.app.ui.theme.PaletteMode.WARM_LINEN
        }
    )
    override val paletteMode: Flow<com.tonight.app.ui.theme.PaletteMode> = _paletteMode.asStateFlow()

    override suspend fun setBiometricLockEnabled(enabled: Boolean) = withContext(ioDispatcher) {
        prefs.edit().putBoolean(KEY_BIOMETRIC_LOCK, enabled).apply()
        _isBiometricLockEnabled.value = enabled
    }

    override suspend fun setHasSeenIntro(seen: Boolean) = withContext(ioDispatcher) {
        prefs.edit().putBoolean(KEY_HAS_SEEN_INTRO, seen).apply()
        _hasSeenIntro.value = seen
    }

    override suspend fun setPaletteMode(mode: com.tonight.app.ui.theme.PaletteMode) = withContext(ioDispatcher) {
        prefs.edit().putString(KEY_PALETTE_MODE, mode.name).apply()
        _paletteMode.value = mode
    }

    override suspend fun deleteAllUserData() = withContext(ioDispatcher) {
        database.momentDao().deleteAllMoments()
        database.seenQuestionDao().deleteAll()
        database.sessionRecordDao().deleteAll()
        prefs.edit().clear().apply()
        _hasSeenIntro.value = false
        _isBiometricLockEnabled.value = false
        _paletteMode.value = com.tonight.app.ui.theme.PaletteMode.WARM_LINEN
    }
}

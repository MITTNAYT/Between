package com.tonight.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.data.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val settingsRepository: SettingsRepository
) : ViewModel() {

    val isBiometricLockEnabled: StateFlow<Boolean> = settingsRepository.isBiometricLockEnabled
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    val paletteMode: StateFlow<com.tonight.app.ui.theme.PaletteMode> = settingsRepository.paletteMode
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), com.tonight.app.ui.theme.PaletteMode.WARM_LINEN)

    fun setBiometricLockEnabled(enabled: Boolean) {
        viewModelScope.launch {
            settingsRepository.setBiometricLockEnabled(enabled)
        }
    }

    fun setPaletteMode(mode: com.tonight.app.ui.theme.PaletteMode) {
        viewModelScope.launch {
            settingsRepository.setPaletteMode(mode)
        }
    }

    fun deleteAllData(onComplete: () -> Unit) {
        viewModelScope.launch {
            settingsRepository.deleteAllUserData()
            onComplete()
        }
    }
}

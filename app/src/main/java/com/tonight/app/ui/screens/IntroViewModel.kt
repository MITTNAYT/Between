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
class IntroViewModel @Inject constructor(
    private val settingsRepository: SettingsRepository
) : ViewModel() {

    val hasSeenIntro: StateFlow<Boolean> = settingsRepository.hasSeenIntro
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    fun completeIntro() {
        viewModelScope.launch {
            settingsRepository.setHasSeenIntro(true)
        }
    }
}

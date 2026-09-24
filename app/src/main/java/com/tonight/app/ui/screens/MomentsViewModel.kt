package com.tonight.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.data.Moment
import com.tonight.app.data.MomentRepository
import com.tonight.app.data.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MomentsViewModel @Inject constructor(
    private val momentRepository: MomentRepository,
    private val settingsRepository: SettingsRepository
) : ViewModel() {

    private val _isManuallyUnlocked = MutableStateFlow(false)
    val isManuallyUnlocked = _isManuallyUnlocked.asStateFlow()

    val isBiometricLockEnabled: StateFlow<Boolean> = settingsRepository.isBiometricLockEnabled
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    val isLocked: StateFlow<Boolean> = combine(
        settingsRepository.isBiometricLockEnabled,
        _isManuallyUnlocked
    ) { lockEnabled, manuallyUnlocked ->
        lockEnabled && !manuallyUnlocked
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    val moments: StateFlow<List<Moment>> = momentRepository
        .observeMoments()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun unlock() {
        _isManuallyUnlocked.value = true
    }

    fun deleteMoment(id: String) {
        viewModelScope.launch {
            momentRepository.deleteMoment(id)
        }
    }
}

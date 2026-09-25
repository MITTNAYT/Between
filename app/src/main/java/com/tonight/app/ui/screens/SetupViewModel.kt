package com.tonight.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.BuildConfig
import com.tonight.app.content.QuestionRepository
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.SessionRecordRepository
import com.tonight.app.engine.ArcEngine
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.SessionLength
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SetupUiState(
    val selectedRelationshipType: RelationshipType? = null,
    val sessionLength: SessionLength = SessionLength.SESSION,
    val monthlySessionsUsed: Int = 0,
    val isPremium: Boolean = false,
    val availableTypes: Set<RelationshipType> = emptySet(),
    val isDebug: Boolean = BuildConfig.DEBUG
) {
    // Backward-compatible property for callers expecting non-nullable relationshipType
    val relationshipType: RelationshipType
        get() = selectedRelationshipType ?: RelationshipType.COUPLE
}

@HiltViewModel
class SetupViewModel @Inject constructor(
    private val billingRepository: BillingRepository,
    private val sessionRecordRepository: SessionRecordRepository,
    private val questionRepository: QuestionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(SetupUiState(isDebug = BuildConfig.DEBUG))
    val uiState: StateFlow<SetupUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val questions = questionRepository.getQuestions()
            val available = RelationshipType.values().filter { type ->
                ArcEngine.isTypeAvailable(type, questions)
            }.toSet()

            _uiState.update { it.copy(availableTypes = available) }
        }

        viewModelScope.launch {
            billingRepository.isPremium.collect { premium ->
                _uiState.update { it.copy(isPremium = premium) }
            }
        }

        viewModelScope.launch {
            sessionRecordRepository.observeSessionCountThisMonth().collect { count ->
                _uiState.update { it.copy(monthlySessionsUsed = count) }
            }
        }
    }

    fun selectRelationshipType(type: RelationshipType) {
        _uiState.update { it.copy(selectedRelationshipType = type) }
    }

    fun clearRelationshipTypeSelection() {
        _uiState.update { it.copy(selectedRelationshipType = null) }
    }

    fun selectSessionLength(length: SessionLength) {
        _uiState.update { it.copy(sessionLength = length) }
    }

    fun checkCanBeginSession(
        onAllowed: () -> Unit,
        onLimitReached: (String) -> Unit
    ) {
        // App is free - always allow sessions
        onAllowed()
    }
}

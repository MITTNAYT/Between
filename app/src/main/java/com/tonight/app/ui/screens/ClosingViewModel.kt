package com.tonight.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.Moment
import com.tonight.app.data.MomentRepository
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.RelationshipTypeRegistry
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

enum class ClosingStep {
    LANDING_QUESTION,
    APPRECIATION_PERSON_A,
    APPRECIATION_PERSON_B,
    APPRECIATION_REVEAL,
    SAVE_MOMENT,
    SESSION_SUMMARY
}

data class ClosingUiState(
    val step: ClosingStep = ClosingStep.LANDING_QUESTION,
    // Transient in-memory only appreciation texts (never persisted)
    val appreciationA: String = "",
    val appreciationB: String = "",
    // Moment of the night (persisted to Room)
    val momentTextA: String = "",
    val momentTextB: String = "",
    // Session metadata for summary card (NO question/answer text)
    val sessionLength: String = "SESSION",
    val relationshipType: String = "COUPLE",
    val depthReached: Int = 4,
    val questionCount: Int = 9,
    val isMomentsLimitReached: Boolean = false,
    val isComplete: Boolean = false
) {
    val relTypeEnum: RelationshipType
        get() = try {
            RelationshipType.valueOf(relationshipType)
        } catch (e: Exception) {
            RelationshipType.COUPLE
        }

    val config
        get() = RelationshipTypeRegistry.getConfig(relTypeEnum)

    val totalDots: Int
        get() = if (relTypeEnum == RelationshipType.JUST_MET) 3 else 5

    val currentDotIndex: Int
        get() = if (relTypeEnum == RelationshipType.JUST_MET) {
            when (step) {
                ClosingStep.LANDING_QUESTION -> 0
                ClosingStep.SAVE_MOMENT -> 1
                ClosingStep.SESSION_SUMMARY -> 2
                else -> 0
            }
        } else {
            when (step) {
                ClosingStep.LANDING_QUESTION -> 0
                ClosingStep.APPRECIATION_PERSON_A -> 1
                ClosingStep.APPRECIATION_PERSON_B -> 2
                ClosingStep.APPRECIATION_REVEAL -> 3
                ClosingStep.SAVE_MOMENT -> 3
                ClosingStep.SESSION_SUMMARY -> 4
            }
        }

    val showNextTimeLabel: Boolean
        get() = config.showNextTimeLabel
}

@HiltViewModel
class ClosingViewModel @Inject constructor(
    private val momentRepository: MomentRepository,
    private val billingRepository: BillingRepository,
    private val analyticsTracker: AnalyticsTracker
) : ViewModel() {

    private val _uiState = MutableStateFlow(ClosingUiState())
    val uiState: StateFlow<ClosingUiState> = _uiState.asStateFlow()

    fun initSummary(
        sessionLength: String,
        relationshipType: String,
        depthReached: Int,
        questionCount: Int
    ) {
        _uiState.update {
            it.copy(
                sessionLength = sessionLength,
                relationshipType = relationshipType,
                depthReached = depthReached,
                questionCount = questionCount
            )
        }
    }

    fun updateAppreciationA(text: String) {
        _uiState.update { it.copy(appreciationA = text) }
    }

    fun updateAppreciationB(text: String) {
        _uiState.update { it.copy(appreciationB = text) }
    }

    fun updateMomentTextA(text: String) {
        if (text.length <= 280) {
            _uiState.update { it.copy(momentTextA = text) }
        }
    }

    fun updateMomentTextB(text: String) {
        if (text.length <= 280) {
            _uiState.update { it.copy(momentTextB = text) }
        }
    }

    fun advanceStep() {
        val currentState = _uiState.value
        val isJustMet = currentState.relTypeEnum == RelationshipType.JUST_MET

        val next = when (currentState.step) {
            ClosingStep.LANDING_QUESTION -> {
                if (isJustMet) ClosingStep.SAVE_MOMENT else ClosingStep.APPRECIATION_PERSON_A
            }
            ClosingStep.APPRECIATION_PERSON_A -> ClosingStep.APPRECIATION_PERSON_B
            ClosingStep.APPRECIATION_PERSON_B -> ClosingStep.APPRECIATION_REVEAL
            ClosingStep.APPRECIATION_REVEAL -> ClosingStep.SAVE_MOMENT
            ClosingStep.SAVE_MOMENT -> ClosingStep.SESSION_SUMMARY
            ClosingStep.SESSION_SUMMARY -> {
                _uiState.update { it.copy(isComplete = true) }
                return
            }
        }
        _uiState.update { it.copy(step = next) }
    }

    fun saveMomentsAndShowSummary() {
        val state = _uiState.value
        val textA = state.momentTextA.trim()
        val textB = state.momentTextB.trim()

        viewModelScope.launch {
            if (textA.isNotEmpty()) {
                momentRepository.addMoment(
                    Moment(
                        id = UUID.randomUUID().toString(),
                        createdAt = System.currentTimeMillis(),
                        sessionLength = state.sessionLength,
                        relationshipType = state.relationshipType,
                        text = textA
                    )
                )
                analyticsTracker.trackMomentSaved()
            }
            if (textB.isNotEmpty()) {
                momentRepository.addMoment(
                    Moment(
                        id = UUID.randomUUID().toString(),
                        createdAt = System.currentTimeMillis() + 1,
                        sessionLength = state.sessionLength,
                        relationshipType = state.relationshipType,
                        text = textB
                    )
                )
                analyticsTracker.trackMomentSaved()
            }
            _uiState.update { it.copy(step = ClosingStep.SESSION_SUMMARY) }
        }
    }
}

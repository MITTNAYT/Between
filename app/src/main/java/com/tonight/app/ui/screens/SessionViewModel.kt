package com.tonight.app.ui.screens

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tonight.app.BuildConfig
import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.content.QuestionRepository
import com.tonight.app.data.BillingRepository
import com.tonight.app.data.SessionHistoryRepository
import com.tonight.app.data.SessionRecordRepository
import com.tonight.app.engine.ArcEngine
import com.tonight.app.engine.ArcPhase
import com.tonight.app.engine.Question
import com.tonight.app.engine.RelationshipType
import com.tonight.app.engine.RelationshipTypeConfig
import com.tonight.app.engine.RelationshipTypeRegistry
import com.tonight.app.engine.SessionLength
import com.tonight.app.engine.SwapAction
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SessionUiState(
    val questions: List<Question> = emptyList(),
    val currentIndex: Int = 0,
    val isHandshakePending: Boolean = false,
    val isPaywallPending: Boolean = false,
    val paywallTrigger: String = "",
    val showFollowUps: Boolean = false,
    val isSessionFinished: Boolean = false,
    val relationshipType: RelationshipType = RelationshipType.COUPLE,
    val sessionLength: SessionLength = SessionLength.SESSION
) {
    val currentQuestion: Question?
        get() = questions.getOrNull(currentIndex)

    val config: RelationshipTypeConfig
        get() = RelationshipTypeRegistry.getConfig(relationshipType)

    val currentPhase: ArcPhase
        get() {
            val slots = config.getSlots(sessionLength)
            return slots.getOrNull(currentIndex)?.phase ?: ArcPhase.WARMUP
        }

    val totalPhases: Int
        get() = config.getPhases(sessionLength).size

    val currentPhaseIndex: Int
        get() {
            val phases = config.getPhases(sessionLength)
            val idx = phases.indexOfFirst { it.phase == currentPhase }
            return if (idx >= 0) idx else 0
        }

    val isDeeperDisabled: Boolean
        get() {
            val q = currentQuestion ?: return true
            return q.depth >= config.maxDepth
        }

    val phaseDisplayName: String
        get() {
            return when (relationshipType) {
                RelationshipType.JUST_MET -> when (currentPhase) {
                    ArcPhase.WARMUP -> "Warm-up"
                    ArcPhase.OPENING -> "Opening up"
                    ArcPhase.DEEPENING -> "Going deeper"
                    ArcPhase.LANDING -> "Landing"
                    ArcPhase.PEAK -> "Going deeper"
                }
                else -> when (currentPhase) {
                    ArcPhase.WARMUP -> "Warm-up"
                    ArcPhase.OPENING -> "Opening"
                    ArcPhase.DEEPENING -> "Deepening"
                    ArcPhase.PEAK -> "The heart of it"
                    ArcPhase.LANDING -> "Landing"
                }
            }
        }

    val progress: Float
        get() = if (questions.isEmpty()) 0f else (currentIndex + 1).toFloat() / questions.size.toFloat()

    val turnIndicator: String
        get() {
            return if (currentIndex % 2 == 0) "Person A answers first" else "Person B answers first"
        }
}

@HiltViewModel
class SessionViewModel @Inject constructor(
    private val questionRepository: QuestionRepository,
    private val sessionHistoryRepository: SessionHistoryRepository,
    private val sessionRecordRepository: SessionRecordRepository,
    private val billingRepository: BillingRepository,
    private val analyticsTracker: AnalyticsTracker,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val _uiState = MutableStateFlow(SessionUiState())
    val uiState: StateFlow<SessionUiState> = _uiState.asStateFlow()

    private val seenIds = mutableSetOf<String>()
    private val confirmedHandshakeIndices = mutableSetOf<Int>()

    companion object {
        private const val KEY_INDEX = "session_current_index"
        private const val KEY_QUESTION_IDS = "session_question_ids"
        private const val KEY_RELATIONSHIP_TYPE = "session_rel_type"
        private const val KEY_SESSION_LENGTH = "session_len"
        private const val KEY_HANDSHAKE_PENDING = "session_handshake_pending"
        private const val KEY_CONFIRMED_INDICES = "session_confirmed_indices"
    }

    init {
        restoreStateIfPresent()
    }

    private fun restoreStateIfPresent() {
        val savedIds: List<String>? = savedStateHandle[KEY_QUESTION_IDS]
        if (!savedIds.isNullOrEmpty()) {
            val allQuestions = questionRepository.getQuestions().associateBy { it.id }
            val restoredQuestions = savedIds.mapNotNull { allQuestions[it] }

            if (restoredQuestions.isNotEmpty()) {
                val savedIndex: Int = savedStateHandle[KEY_INDEX] ?: 0
                val savedRelType: String? = savedStateHandle[KEY_RELATIONSHIP_TYPE]
                val savedLen: String? = savedStateHandle[KEY_SESSION_LENGTH]
                val handshakePending: Boolean = savedStateHandle[KEY_HANDSHAKE_PENDING] ?: false
                val confirmed: List<Int>? = savedStateHandle[KEY_CONFIRMED_INDICES]

                if (confirmed != null) confirmedHandshakeIndices.addAll(confirmed)
                seenIds.addAll(savedIds)

                _uiState.update {
                    it.copy(
                        questions = restoredQuestions,
                        currentIndex = savedIndex.coerceIn(0, restoredQuestions.lastIndex),
                        isHandshakePending = handshakePending,
                        relationshipType = savedRelType?.let { rt -> RelationshipType.valueOf(rt) } ?: RelationshipType.COUPLE,
                        sessionLength = savedLen?.let { sl -> SessionLength.valueOf(sl) } ?: SessionLength.SESSION
                    )
                }
            }
        }
    }

    fun startSession(relationshipType: RelationshipType, length: SessionLength) {
        if (_uiState.value.questions.isNotEmpty()) return

        viewModelScope.launch {
            val config = RelationshipTypeRegistry.getConfig(relationshipType)
            val isPremium = billingRepository.isPremiumActive()
            val recentlySeen = sessionHistoryRepository.getRecentlySeen(limit = 40).toSet()
            val pool = questionRepository.getQuestions()
            val sessionQuestions = ArcEngine.buildSession(
                pool = pool,
                relationshipType = relationshipType,
                length = length,
                recentlySeenIds = recentlySeen,
                includeDrafts = BuildConfig.DEBUG
            )

            seenIds.addAll(sessionQuestions.map { it.id })
            sessionHistoryRepository.markSeen(sessionQuestions.map { it.id })
            sessionRecordRepository.recordSession(
                sessionLength = length.name,
                relationshipType = relationshipType.name,
                depthReached = sessionQuestions.firstOrNull()?.depth ?: 1
            )
            analyticsTracker.trackSessionStarted(
                length = length.name,
                relationshipType = relationshipType.name
            )

            confirmedHandshakeIndices.clear()

            val firstQuestion = sessionQuestions.firstOrNull()
            val firstNeedsHandshake = config.handshakeEnabled && firstQuestion?.needsHandshake == true
            val firstNeedsPaywall = firstNeedsHandshake && !isPremium

            _uiState.update {
                it.copy(
                    questions = sessionQuestions,
                    currentIndex = 0,
                    isHandshakePending = firstNeedsHandshake && isPremium,
                    isPaywallPending = firstNeedsPaywall,
                    paywallTrigger = if (firstNeedsPaywall) "depth_l4" else "",
                    showFollowUps = false,
                    isSessionFinished = false,
                    relationshipType = relationshipType,
                    sessionLength = length
                )
            }

            saveToSavedState()
        }
    }

    fun nextQuestion() {
        val currentState = _uiState.value
        val nextIdx = currentState.currentIndex + 1

        if (nextIdx < currentState.questions.size) {
            val nextQuestion = currentState.questions[nextIdx]
            val config = currentState.config
            val isPremium = billingRepository.isPremiumActive()
            val needsHandshake = config.handshakeEnabled && nextQuestion.needsHandshake && nextIdx !in confirmedHandshakeIndices
            val needsPaywall = needsHandshake && !isPremium

            _uiState.update {
                it.copy(
                    currentIndex = nextIdx,
                    isHandshakePending = needsHandshake && isPremium,
                    isPaywallPending = needsPaywall,
                    paywallTrigger = if (needsPaywall) "depth_l4" else "",
                    showFollowUps = false
                )
            }
            saveToSavedState()
        } else {
            val maxDepth = currentState.questions.maxOfOrNull { it.depth } ?: 1
            analyticsTracker.trackSessionCompleted(depthReached = maxDepth)
            _uiState.update { it.copy(isSessionFinished = true) }
        }
    }

    fun passQuestion() {
        val state = _uiState.value
        val pool = questionRepository.getQuestions()
        val currentIdx = state.currentIndex
        val currentQ = state.currentQuestion

        if (currentQ != null) {
            analyticsTracker.trackQuestionPassed(depth = currentQ.depth)
        }

        val result = ArcEngine.swap(
            session = state.questions,
            index = currentIdx,
            action = SwapAction.PASS,
            pool = pool,
            relationshipType = state.relationshipType,
            recentlySeenIds = seenIds,
            includeDrafts = BuildConfig.DEBUG
        )

        seenIds.add(result.newQuestion.id)
        viewModelScope.launch {
            sessionHistoryRepository.markSeen(listOf(result.newQuestion.id))
        }

        val isPremium = billingRepository.isPremiumActive()
        val config = state.config
        val needsHandshake = config.handshakeEnabled && result.needsHandshake && currentIdx !in confirmedHandshakeIndices
        val needsPaywall = needsHandshake && !isPremium

        _uiState.update {
            it.copy(
                questions = result.updatedSession,
                isHandshakePending = needsHandshake && isPremium,
                isPaywallPending = needsPaywall,
                paywallTrigger = if (needsPaywall) "depth_l4" else "",
                showFollowUps = false
            )
        }
        saveToSavedState()
    }

    fun lighterQuestion() {
        analyticsTracker.trackSwapUsed(direction = "LIGHTER")
        val state = _uiState.value
        val pool = questionRepository.getQuestions()
        val currentIdx = state.currentIndex

        val result = ArcEngine.swap(
            session = state.questions,
            index = currentIdx,
            action = SwapAction.LIGHTER,
            pool = pool,
            relationshipType = state.relationshipType,
            recentlySeenIds = seenIds,
            includeDrafts = BuildConfig.DEBUG
        )

        seenIds.add(result.newQuestion.id)
        viewModelScope.launch {
            sessionHistoryRepository.markSeen(listOf(result.newQuestion.id))
        }

        val isPremium = billingRepository.isPremiumActive()
        val config = state.config
        val needsHandshake = config.handshakeEnabled && result.needsHandshake && currentIdx !in confirmedHandshakeIndices
        val needsPaywall = needsHandshake && !isPremium

        _uiState.update {
            it.copy(
                questions = result.updatedSession,
                isHandshakePending = needsHandshake && isPremium,
                isPaywallPending = needsPaywall,
                paywallTrigger = if (needsPaywall) "depth_l4" else "",
                showFollowUps = false
            )
        }
        saveToSavedState()
    }

    fun deeperQuestion() {
        val state = _uiState.value
        if (state.isDeeperDisabled) return

        analyticsTracker.trackSwapUsed(direction = "DEEPER")
        val pool = questionRepository.getQuestions()
        val currentIdx = state.currentIndex

        val result = ArcEngine.swap(
            session = state.questions,
            index = currentIdx,
            action = SwapAction.DEEPER,
            pool = pool,
            relationshipType = state.relationshipType,
            recentlySeenIds = seenIds,
            includeDrafts = BuildConfig.DEBUG
        )

        seenIds.add(result.newQuestion.id)
        viewModelScope.launch {
            sessionHistoryRepository.markSeen(listOf(result.newQuestion.id))
        }

        val isPremium = billingRepository.isPremiumActive()
        val config = state.config
        val needsHandshake = config.handshakeEnabled && result.needsHandshake && currentIdx !in confirmedHandshakeIndices
        val needsPaywall = needsHandshake && !isPremium

        _uiState.update {
            it.copy(
                questions = result.updatedSession,
                isHandshakePending = needsHandshake && isPremium,
                isPaywallPending = needsPaywall,
                paywallTrigger = if (needsPaywall) "depth_l4" else "",
                showFollowUps = false
            )
        }
        saveToSavedState()
    }

    fun confirmHandshake() {
        analyticsTracker.trackHandshakeCompleted()
        val idx = _uiState.value.currentIndex
        confirmedHandshakeIndices.add(idx)
        _uiState.update { it.copy(isHandshakePending = false) }
        saveToSavedState()
    }

    fun declineHandshake() {
        lighterQuestion()
    }

    fun dismissPaywall() {
        _uiState.update { it.copy(isPaywallPending = false) }
        val current = _uiState.value.currentQuestion
        if (current != null && current.depth >= 4) {
            lighterQuestion()
        }
    }

    fun onPaywallPurchased() {
        _uiState.update { it.copy(isPaywallPending = false, isHandshakePending = true) }
    }

    fun toggleFollowUps(show: Boolean) {
        _uiState.update { it.copy(showFollowUps = show) }
    }

    private fun saveToSavedState() {
        val state = _uiState.value
        savedStateHandle[KEY_INDEX] = state.currentIndex
        savedStateHandle[KEY_QUESTION_IDS] = ArrayList(state.questions.map { it.id })
        savedStateHandle[KEY_RELATIONSHIP_TYPE] = state.relationshipType.name
        savedStateHandle[KEY_SESSION_LENGTH] = state.sessionLength.name
        savedStateHandle[KEY_HANDSHAKE_PENDING] = state.isHandshakePending
        savedStateHandle[KEY_CONFIRMED_INDICES] = ArrayList(confirmedHandshakeIndices)
    }
}

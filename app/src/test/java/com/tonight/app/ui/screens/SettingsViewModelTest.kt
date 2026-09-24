package com.tonight.app.ui.screens

import com.tonight.app.data.SettingsRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class FakeSettingsRepository : SettingsRepository {
    private val _isBiometricLock = MutableStateFlow(false)
    override val isBiometricLockEnabled: Flow<Boolean> = _isBiometricLock.asStateFlow()
    private val _hasSeenIntro = MutableStateFlow(false)
    override val hasSeenIntro: Flow<Boolean> = _hasSeenIntro.asStateFlow()
    private val _paletteMode = MutableStateFlow(com.tonight.app.ui.theme.PaletteMode.WARM_LINEN)
    override val paletteMode: Flow<com.tonight.app.ui.theme.PaletteMode> = _paletteMode.asStateFlow()
    var isDataDeleted = false

    override suspend fun setBiometricLockEnabled(enabled: Boolean) {
        _isBiometricLock.value = enabled
    }

    override suspend fun setHasSeenIntro(seen: Boolean) {
        _hasSeenIntro.value = seen
    }

    override suspend fun setPaletteMode(mode: com.tonight.app.ui.theme.PaletteMode) {
        _paletteMode.value = mode
    }

    override suspend fun deleteAllUserData() {
        isDataDeleted = true
        _isBiometricLock.value = false
        _hasSeenIntro.value = false
        _paletteMode.value = com.tonight.app.ui.theme.PaletteMode.WARM_LINEN
    }
}

@OptIn(ExperimentalCoroutinesApi::class)
class SettingsViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeRepository: FakeSettingsRepository
    private lateinit var viewModel: SettingsViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeRepository = FakeSettingsRepository()
        viewModel = SettingsViewModel(fakeRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun togglingBiometricLock_updatesState() = runTest(testDispatcher) {
        val collectJob = backgroundScope.launch(kotlinx.coroutines.test.UnconfinedTestDispatcher(testScheduler)) {
            viewModel.isBiometricLockEnabled.collect {}
        }
        testScheduler.advanceUntilIdle()

        assertEquals(false, viewModel.isBiometricLockEnabled.value)

        viewModel.setBiometricLockEnabled(true)
        testScheduler.advanceUntilIdle()

        assertEquals(true, viewModel.isBiometricLockEnabled.value)
        collectJob.cancel()
    }

    @Test
    fun deletingAllData_invokesRepositoryAndCallback() = runTest {
        var callbackCalled = false

        viewModel.deleteAllData {
            callbackCalled = true
        }
        testDispatcher.scheduler.advanceUntilIdle()

        assertTrue(fakeRepository.isDataDeleted)
        assertTrue(callbackCalled)
    }
}

package com.tonight.app.ui.screens

import com.tonight.app.data.Moment
import com.tonight.app.data.MomentRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class MomentsViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeMomentRepository: FakeMomentRepository
    private lateinit var fakeSettingsRepository: FakeSettingsRepository
    private lateinit var viewModel: MomentsViewModel

    private class FakeMomentRepository : MomentRepository {
        val list = mutableListOf<Moment>()
        private val _flow = MutableStateFlow<List<Moment>>(emptyList())

        override fun observeMoments(): Flow<List<Moment>> = _flow.asStateFlow()
        override suspend fun getMomentCount(): Int = list.size
        override fun observeMomentCount(): Flow<Int> = MutableStateFlow(list.size)

        override suspend fun addMoment(moment: Moment) {
            list.add(0, moment)
            _flow.value = list.toList()
        }

        override suspend fun deleteMoment(id: String) {
            list.removeAll { it.id == id }
            _flow.value = list.toList()
        }
    }

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeMomentRepository = FakeMomentRepository()
        fakeSettingsRepository = FakeSettingsRepository()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `moments flow observes repository updates and supports deletion`() = runTest(testDispatcher) {
        val moment1 = Moment(
            id = "m-1",
            createdAt = 1000L,
            sessionLength = "SESSION",
            relationshipType = "COUPLE",
            text = "First moment"
        )
        val moment2 = Moment(
            id = "m-2",
            createdAt = 2000L,
            sessionLength = "SESSION",
            relationshipType = "COUPLE",
            text = "Second moment"
        )

        fakeMomentRepository.addMoment(moment1)
        fakeMomentRepository.addMoment(moment2)

        viewModel = MomentsViewModel(fakeMomentRepository, fakeSettingsRepository)

        val collectJob = backgroundScope.launch(kotlinx.coroutines.test.UnconfinedTestDispatcher(testScheduler)) {
            viewModel.moments.collect {}
        }

        testScheduler.advanceUntilIdle()

        val observed = viewModel.moments.value
        assertEquals(2, observed.size)
        assertEquals("m-2", observed[0].id)
        assertEquals("m-1", observed[1].id)

        // Delete moment 1
        viewModel.deleteMoment("m-1")
        testScheduler.advanceUntilIdle()

        val afterDelete = viewModel.moments.value
        assertEquals(1, afterDelete.size)
        assertEquals("m-2", afterDelete[0].id)

        collectJob.cancel()
    }

    @Test
    fun `biometric lock enabled locks moments until unlocked`() = runTest(testDispatcher) {
        fakeSettingsRepository.setBiometricLockEnabled(true)
        viewModel = MomentsViewModel(fakeMomentRepository, fakeSettingsRepository)

        val collectJob = backgroundScope.launch(kotlinx.coroutines.test.UnconfinedTestDispatcher(testScheduler)) {
            viewModel.isLocked.collect {}
        }
        testScheduler.advanceUntilIdle()

        assertEquals(true, viewModel.isLocked.value)

        // Unlock
        viewModel.unlock()
        testScheduler.advanceUntilIdle()

        assertEquals(false, viewModel.isLocked.value)
        collectJob.cancel()
    }
}

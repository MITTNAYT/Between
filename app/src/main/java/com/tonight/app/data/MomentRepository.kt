package com.tonight.app.data

import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

interface MomentRepository {
    fun observeMoments(): Flow<List<Moment>>
    suspend fun getMomentCount(): Int
    fun observeMomentCount(): Flow<Int>
    suspend fun addMoment(moment: Moment)
    suspend fun deleteMoment(id: String)
}

@Singleton
class LocalMomentRepository @Inject constructor(
    private val momentDao: MomentDao
) : MomentRepository {

    override fun observeMoments(): Flow<List<Moment>> = momentDao.observeMoments()

    override suspend fun getMomentCount(): Int = momentDao.getMomentCount()

    override fun observeMomentCount(): Flow<Int> = momentDao.observeMomentCount()

    override suspend fun addMoment(moment: Moment) {
        momentDao.insertMoment(moment)
    }

    override suspend fun deleteMoment(id: String) {
        momentDao.deleteMoment(id)
    }
}

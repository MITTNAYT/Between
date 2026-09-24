package com.tonight.app.data

import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

interface SessionRecordRepository {
    suspend fun recordSession(
        sessionLength: String,
        relationshipType: String,
        depthReached: Int,
        timestamp: Long = System.currentTimeMillis()
    )
    suspend fun getSessionCountThisMonth(timestamp: Long = System.currentTimeMillis()): Int
    fun observeSessionCountThisMonth(timestamp: Long = System.currentTimeMillis()): Flow<Int>
    fun observeAllSessions(): Flow<List<SessionRecord>>
}

@Singleton
class LocalSessionRecordRepository @Inject constructor(
    private val sessionRecordDao: SessionRecordDao
) : SessionRecordRepository {

    private val monthFormat = SimpleDateFormat("yyyy-MM", Locale.US)

    private fun getYearMonth(timestamp: Long): String {
        return monthFormat.format(Date(timestamp))
    }

    override suspend fun recordSession(
        sessionLength: String,
        relationshipType: String,
        depthReached: Int,
        timestamp: Long
    ) {
        val record = SessionRecord(
            id = UUID.randomUUID().toString(),
            startedAt = timestamp,
            yearMonth = getYearMonth(timestamp),
            sessionLength = sessionLength,
            relationshipType = relationshipType,
            depthReached = depthReached
        )
        sessionRecordDao.insertRecord(record)
    }

    override suspend fun getSessionCountThisMonth(timestamp: Long): Int {
        return sessionRecordDao.getSessionCountForMonth(getYearMonth(timestamp))
    }

    override fun observeSessionCountThisMonth(timestamp: Long): Flow<Int> {
        return sessionRecordDao.observeSessionCountForMonth(getYearMonth(timestamp))
    }

    override fun observeAllSessions(): Flow<List<SessionRecord>> {
        return sessionRecordDao.observeAllRecords()
    }
}

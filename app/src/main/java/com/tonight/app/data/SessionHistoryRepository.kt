package com.tonight.app.data

import javax.inject.Inject
import javax.inject.Singleton

interface SessionHistoryRepository {
    suspend fun markSeen(questionIds: List<String>, timestamp: Long = System.currentTimeMillis())
    suspend fun getRecentlySeen(limit: Int = 50): List<String>
}

@Singleton
class LocalSessionHistoryRepository @Inject constructor(
    private val seenQuestionDao: SeenQuestionDao
) : SessionHistoryRepository {

    override suspend fun markSeen(questionIds: List<String>, timestamp: Long) {
        if (questionIds.isEmpty()) return
        val entities = questionIds.map { id ->
            SeenQuestion(questionId = id, lastSeenAt = timestamp)
        }
        seenQuestionDao.insertAll(entities)
    }

    override suspend fun getRecentlySeen(limit: Int): List<String> {
        return seenQuestionDao.getRecentlySeenIds(limit)
    }
}

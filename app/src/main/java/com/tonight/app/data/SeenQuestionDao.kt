package com.tonight.app.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface SeenQuestionDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(seenQuestion: SeenQuestion)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(seenQuestions: List<SeenQuestion>)

    @Query("SELECT questionId FROM seen_questions ORDER BY lastSeenAt DESC LIMIT :limit")
    suspend fun getRecentlySeenIds(limit: Int): List<String>

    @Query("SELECT questionId FROM seen_questions")
    suspend fun getAllSeenIds(): List<String>

    @Query("DELETE FROM seen_questions")
    suspend fun deleteAll()
}

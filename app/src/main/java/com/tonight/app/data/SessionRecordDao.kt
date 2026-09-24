package com.tonight.app.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface SessionRecordDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: SessionRecord)

    @Query("SELECT COUNT(*) FROM session_records WHERE yearMonth = :yearMonth")
    suspend fun getSessionCountForMonth(yearMonth: String): Int

    @Query("SELECT COUNT(*) FROM session_records WHERE yearMonth = :yearMonth")
    fun observeSessionCountForMonth(yearMonth: String): Flow<Int>

    @Query("SELECT * FROM session_records ORDER BY startedAt DESC")
    fun observeAllRecords(): Flow<List<SessionRecord>>

    @Query("DELETE FROM session_records")
    suspend fun deleteAll()
}

package com.tonight.app.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MomentDao {

    @Query("SELECT * FROM moments ORDER BY createdAt DESC")
    fun observeMoments(): Flow<List<Moment>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMoment(moment: Moment)

    @Query("DELETE FROM moments WHERE id = :id")
    suspend fun deleteMoment(id: String)

    @Query("SELECT COUNT(*) FROM moments")
    suspend fun getMomentCount(): Int

    @Query("SELECT COUNT(*) FROM moments")
    fun observeMomentCount(): Flow<Int>

    @Query("DELETE FROM moments")
    suspend fun deleteAllMoments()
}

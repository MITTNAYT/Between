package com.tonight.app.data

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

@Database(
    entities = [Moment::class, SeenQuestion::class, SessionRecord::class],
    version = 2,
    exportSchema = true
)
abstract class TonightDatabase : RoomDatabase() {
    abstract fun momentDao(): MomentDao
    abstract fun seenQuestionDao(): SeenQuestionDao
    abstract fun sessionRecordDao(): SessionRecordDao

    companion object {
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    """
                    CREATE TABLE IF NOT EXISTS `session_records` (
                        `id` TEXT NOT NULL,
                        `startedAt` INTEGER NOT NULL,
                        `yearMonth` TEXT NOT NULL,
                        `sessionLength` TEXT NOT NULL,
                        `relationshipType` TEXT NOT NULL,
                        `depthReached` INTEGER NOT NULL,
                        PRIMARY KEY(`id`)
                    )
                    """.trimIndent()
                )
            }
        }
    }
}

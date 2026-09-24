package com.tonight.app.di

import android.content.Context
import androidx.room.Room
import com.tonight.app.data.MomentDao
import com.tonight.app.data.SeenQuestionDao
import com.tonight.app.data.TonightDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideTonightDatabase(
        @ApplicationContext context: Context
    ): TonightDatabase {
        return Room.databaseBuilder(
            context,
            TonightDatabase::class.java,
            "tonight_moments.db"
        )
        .addMigrations(TonightDatabase.MIGRATION_1_2)
        .fallbackToDestructiveMigration()
        .build()
    }

    @Provides
    fun provideMomentDao(database: TonightDatabase): MomentDao {
        return database.momentDao()
    }

    @Provides
    fun provideSeenQuestionDao(database: TonightDatabase): SeenQuestionDao {
        return database.seenQuestionDao()
    }

    @Provides
    fun provideSessionRecordDao(database: TonightDatabase): com.tonight.app.data.SessionRecordDao {
        return database.sessionRecordDao()
    }
}

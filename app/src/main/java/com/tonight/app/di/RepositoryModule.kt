package com.tonight.app.di

import com.tonight.app.content.AssetQuestionRepository
import com.tonight.app.content.QuestionRepository
import com.tonight.app.data.LocalMomentRepository
import com.tonight.app.data.LocalSessionHistoryRepository
import com.tonight.app.data.MomentRepository
import com.tonight.app.data.SessionHistoryRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindQuestionRepository(
        impl: AssetQuestionRepository
    ): QuestionRepository

    @Binds
    @Singleton
    abstract fun bindMomentRepository(
        impl: LocalMomentRepository
    ): MomentRepository

    @Binds
    @Singleton
    abstract fun bindSessionHistoryRepository(
        impl: LocalSessionHistoryRepository
    ): SessionHistoryRepository

    @Binds
    @Singleton
    abstract fun bindSessionRecordRepository(
        impl: com.tonight.app.data.LocalSessionRecordRepository
    ): com.tonight.app.data.SessionRecordRepository

    @Binds
    @Singleton
    abstract fun bindSettingsRepository(
        impl: com.tonight.app.data.LocalSettingsRepository
    ): com.tonight.app.data.SettingsRepository
}

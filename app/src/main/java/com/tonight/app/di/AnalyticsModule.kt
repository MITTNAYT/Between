package com.tonight.app.di

import com.tonight.app.analytics.AnalyticsTracker
import com.tonight.app.analytics.PostHogAnalyticsTracker
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class AnalyticsModule {

    @Binds
    @Singleton
    abstract fun bindAnalyticsTracker(
        impl: PostHogAnalyticsTracker
    ): AnalyticsTracker
}

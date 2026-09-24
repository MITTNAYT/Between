package com.tonight.app.di

import com.tonight.app.data.BillingRepository
import com.tonight.app.data.RevenueCatBillingRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class BillingModule {

    @Binds
    @Singleton
    abstract fun bindBillingRepository(
        impl: RevenueCatBillingRepository
    ): BillingRepository
}

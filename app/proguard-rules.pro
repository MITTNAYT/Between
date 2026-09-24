# ProGuard / R8 rules for Tonight app

# Keep Kotlinx Serialization Generated Serializers
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.SerializationKt
-keepclassmembers class * {
    *** Companion;
}
-keepclasseswithmembers class * {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep class com.tonight.app.engine.** { *; }
-keep class com.tonight.app.data.** { *; }
-keep class com.tonight.app.ui.navigation.** { *; }

# AndroidX Room
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# AndroidX Biometric
-keep class androidx.biometric.** { *; }

# Hilt / Dagger
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.internal.GeneratedComponent
-keep class * extends dagger.hilt.internal.ComponentEntryPoint
-keepclassmembers class * {
    @javax.inject.Inject *;
    @dagger.Provides *;
}

# RevenueCat
-keep class com.revenuecat.purchases.** { *; }
-dontwarn com.revenuecat.purchases.**

# PostHog
-keep class com.posthog.** { *; }
-dontwarn com.posthog.**

# Compose
-keep class androidx.compose.runtime.** { *; }

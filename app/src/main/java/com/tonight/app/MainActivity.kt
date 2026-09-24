package com.tonight.app

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.fragment.app.FragmentActivity
import com.tonight.app.data.SettingsRepository
import com.tonight.app.ui.navigation.TonightNavHost
import com.tonight.app.ui.theme.PaletteMode
import com.tonight.app.ui.theme.TonightTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : FragmentActivity() {

    @Inject
    lateinit var settingsRepository: SettingsRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val paletteMode by settingsRepository.paletteMode.collectAsState(initial = PaletteMode.WARM_LINEN)
            TonightTheme(paletteMode = paletteMode) {
                TonightNavHost()
            }
        }
    }
}


package com.tonight.app

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class EndToEndFlowTest {

    @get:Rule(order = 1)
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun testFullSessionFlow_fromSetupToSavedMoments() {
        // 1. SETUP SCREEN
        composeTestRule.onNodeWithText("Tonight").assertIsDisplayed()
        composeTestRule.onNodeWithText("A ritual for two").assertIsDisplayed()

        // Select Couple and 15 min (already default, but tap explicitly)
        composeTestRule.onNodeWithText("Couple").performClick()
        composeTestRule.onNodeWithText("Session · 15 min").performClick()

        // Begin Session
        composeTestRule.onNodeWithText("Begin").performClick()

        // 2. SESSION QUESTIONS & HANDSHAKE
        // Progress through all session questions (Session = 6 questions)
        var attempts = 0
        while (attempts < 20) {
            // Check if Handshake interstitial appeared
            val readyNodes = composeTestRule.onAllNodes(androidx.compose.ui.test.hasText("We are ready"))
            if (readyNodes.fetchSemanticsNodes().isNotEmpty()) {
                composeTestRule.onNodeWithText("We are ready").performClick()
                composeTestRule.waitForIdle()
            }

            // Check if we arrived at Closing screen (LANDING)
            val landingNodes = composeTestRule.onAllNodes(androidx.compose.ui.test.hasText("LANDING"))
            if (landingNodes.fetchSemanticsNodes().isNotEmpty()) {
                break
            }

            // Advance session with Next or Pass
            val nextNodes = composeTestRule.onAllNodes(androidx.compose.ui.test.hasText("Next"))
            if (nextNodes.fetchSemanticsNodes().isNotEmpty()) {
                composeTestRule.onNodeWithText("Next").performClick()
            } else {
                val passNodes = composeTestRule.onAllNodes(androidx.compose.ui.test.hasText("Pass"))
                if (passNodes.fetchSemanticsNodes().isNotEmpty()) {
                    composeTestRule.onNodeWithText("Pass").performClick()
                }
            }
            composeTestRule.waitForIdle()
            attempts++
        }

        // 3. CLOSING RITUAL: Landing Question
        composeTestRule.onNodeWithText("LANDING").assertIsDisplayed()
        composeTestRule.onNodeWithText("Next: Appreciation Exchange").performClick()
        composeTestRule.waitForIdle()

        // 4. CLOSING RITUAL: Appreciation Person A
        composeTestRule.onNodeWithText("PERSON A'S TURN").assertIsDisplayed()
        composeTestRule.onNodeWithText("Done, Pass Phone to Person B").performClick()
        composeTestRule.waitForIdle()

        // 5. CLOSING RITUAL: Appreciation Person B
        composeTestRule.onNodeWithText("PERSON B'S TURN").assertIsDisplayed()
        composeTestRule.onNodeWithText("Ready to Reveal Together").performClick()
        composeTestRule.waitForIdle()

        // 6. CLOSING RITUAL: Appreciation Reveal Together
        composeTestRule.onNodeWithText("REVEAL TOGETHER").assertIsDisplayed()
        composeTestRule.onNodeWithText("Save a Moment of the Night").performClick()
        composeTestRule.waitForIdle()

        // 7. CLOSING RITUAL: Save Moment of the Night
        composeTestRule.onNodeWithText("MOMENT OF THE NIGHT").assertIsDisplayed()
        composeTestRule.onNodeWithText("A phrase, feeling, or memory (optional)")
            .performTextInput("Our deepest conversation this year")
        composeTestRule.waitForIdle()

        composeTestRule.onNodeWithText("Save Moments & Complete").performClick()
        composeTestRule.waitForIdle()

        // 8. CLOSING RITUAL: Session Summary Card
        composeTestRule.onNodeWithText("Tonight is complete").assertIsDisplayed()
        composeTestRule.onNodeWithText("SESSION SUMMARY").assertIsDisplayed()
        composeTestRule.onNodeWithText("View Saved Moments").performClick()
        composeTestRule.waitForIdle()

        // 9. MOMENTS SCREEN
        composeTestRule.onNodeWithText("Saved Moments").assertIsDisplayed()
        composeTestRule.onNodeWithText("“Our deepest conversation this year”").assertIsDisplayed()
    }
}

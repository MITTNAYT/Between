package com.tonight.app.content

import android.content.Context
import com.tonight.app.BuildConfig
import com.tonight.app.engine.Question
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.BufferedReader
import java.io.InputStreamReader
import javax.inject.Inject
import javax.inject.Singleton

interface QuestionRepository {
    fun getQuestions(): List<Question>
    fun getGenericFollowUps(): Map<String, List<String>> = emptyMap()
}

@Singleton
class AssetQuestionRepository @Inject constructor(
    @ApplicationContext private val context: Context
) : QuestionRepository {

    private val cachedQuestions: List<Question> by lazy {
        loadFromAssets()
    }

    private val cachedFollowUps: Map<String, List<String>> by lazy {
        loadFollowUpsFromAssets()
    }

    override fun getQuestions(): List<Question> = cachedQuestions

    override fun getGenericFollowUps(): Map<String, List<String>> = cachedFollowUps

    private fun loadFromAssets(): List<Question> {
        val jsonString = context.assets.open("questions.json").use { inputStream ->
            BufferedReader(InputStreamReader(inputStream)).use { reader ->
                reader.readText()
            }
        }
        return ContentValidator.parseAndValidate(jsonString, isDebug = BuildConfig.DEBUG)
    }

    private fun loadFollowUpsFromAssets(): Map<String, List<String>> {
        return try {
            val jsonString = context.assets.open("follow_ups.json").use { inputStream ->
                BufferedReader(InputStreamReader(inputStream)).use { reader ->
                    reader.readText()
                }
            }
            FollowUpEngine.parseFollowUpsJson(jsonString)
        } catch (e: Exception) {
            emptyMap()
        }
    }
}

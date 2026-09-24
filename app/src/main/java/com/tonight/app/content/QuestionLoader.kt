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
}

@Singleton
class AssetQuestionRepository @Inject constructor(
    @ApplicationContext private val context: Context
) : QuestionRepository {

    private val cachedQuestions: List<Question> by lazy {
        loadFromAssets()
    }

    override fun getQuestions(): List<Question> = cachedQuestions

    private fun loadFromAssets(): List<Question> {
        val jsonString = context.assets.open("questions.json").use { inputStream ->
            BufferedReader(InputStreamReader(inputStream)).use { reader ->
                reader.readText()
            }
        }
        return ContentValidator.parseAndValidate(jsonString, isDebug = BuildConfig.DEBUG)
    }
}

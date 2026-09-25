package com.tonight.app.engine

enum class Category {
    ORIGINS,
    VALUES,
    IDENTITY,
    FEARS,
    DREAMS,
    US,
    GRATITUDE,
    PLAY,
    CONFLICT,
    FUTURE
}

enum class RelationshipType {
    COUPLE,
    FRIEND,
    JUST_MET
}

enum class SessionLength {
    FIVE_MIN,
    TEN_MIN,
    FIFTEEN_MIN,
    THIRTY_MIN,
    SESSION,
    DEEP
}

enum class QuestionStatus {
    DRAFT,
    APPROVED
}

enum class SwapAction {
    PASS,
    LIGHTER,
    DEEPER
}

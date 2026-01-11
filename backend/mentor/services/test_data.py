# Test data for the MentorAI platform

TEST_QUESTIONS = [
    # PYTHON
    {
        "language": "python",
        "difficulty": "beginner",
        "text_en": "What is the output of print(2**3)?",
        "text_ru": "Что выведет print(2**3)?",
        "options_en": ["6", "8", "9", "5"],
        "options_ru": ["6", "8", "9", "5"],
        "correct_option": 1
    },
    {
        "language": "python",
        "difficulty": "beginner",
        "text_en": "Which of these is a mutable data type?",
        "text_ru": "Какой из этих типов данных является изменяемым?",
        "options_en": ["tuple", "string", "list", "int"],
        "options_ru": ["tuple", "string", "list", "int"],
        "correct_option": 2
    },
    # Add more later to reach 20... I will generate a few more now and then populate the DB.
    # JAVASCRIPT
    {
        "language": "javascript",
        "difficulty": "beginner",
        "text_en": "Which keyword is used to declare a block-scoped variable?",
        "text_ru": "Какое ключевое слово используется для объявления переменной с блочной областью видимости?",
        "options_en": ["var", "let", "def", "dim"],
        "options_ru": ["var", "let", "def", "dim"],
        "correct_option": 1
    },
    {
        "language": "javascript",
        "difficulty": "junior",
        "text_en": "What is the output of typeof null?",
        "text_ru": "Что выведет typeof null?",
        "options_en": ["'null'", "'undefined'", "'object'", "'string'"],
        "options_ru": ["'null'", "'undefined'", "'object'", "'string'"],
        "correct_option": 2
    },
    # GO
    {
        "language": "go",
        "difficulty": "beginner",
        "text_en": "How do you declare a variable in Go?",
        "text_ru": "Как объявить переменную в Go?",
        "options_en": ["var x int", "int x", "x := 5", "Both A and C"],
        "options_ru": ["var x int", "int x", "x := 5", "Оба A и C"],
        "correct_option": 3
    },
    # JAVA
    {
        "language": "java",
        "difficulty": "beginner",
        "text_en": "Which of these is the entry point of a Java program?",
        "text_ru": "Что является точкой входа в Java-программу?",
        "options_en": ["start()", "main()", "init()", "run()"],
        "options_ru": ["start()", "main()", "init()", "run()"],
        "correct_option": 1
    }
]

# Full 20 per language will be added via a management command or bulk create script.
# For now, let's create a robust generator for the UI to test.

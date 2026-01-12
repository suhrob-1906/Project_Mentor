import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "landing": {
                "title": "Stop Guessing.",
                "subtitle": "Know Your True Code Level.",
                "description": "Analyze your code, discover your real skill level, and get a personalized roadmap to land your dream job or build your startup.",
                "get_started": "Get Started",
                "login": "Login",
                "how_it_works": "How it Works",
                "features": {
                    "analysis": "Deep Analysis",
                    "roadmap": "Tailored Roadmap",
                    "projects": "Portfolio Ideas",
                    "analysis_desc": "Our AI dives deep into your syntax, logic, and patterns to pinpoint exactly where you stand.",
                    "roadmap_desc": "A 10-level interactive guide built specifically for your current skills and future goals.",
                    "projects_desc": "Get unique project assignments that help you build a world-class portfolio while you learn."
                }
            },
            "dashboard": {
                "title": "Choose Your Path",
                "subtitle": "Select a programming language to test your knowledge",
                "start_test": "Start Test",
                "code_analysis": "Or Analyze Existing Code",
                "paste_code": "Paste your code here...",
                "analyze": "Analyze Code",
                "select_lang": "Select Language",
                "super_mentor": "SUPER MENTOR!",
                "ready": "ARE YOU READY?",
                "choose_magic": "Choose your magic language! 🚀",
                "fun_challenge": "FUN CHALLENGE",
                "assessment": "Assessment",
                "take_quiz": "TAKE THE QUIZ!",
                "quiz_desc_child": "20 magical questions to win your hero badge!",
                "quiz_desc_adult": "Complete a specialized 20-question challenge to verify your skills.",
                "lets_go": "LET'S GO!",
                "paste_magic": "PASTE YOUR MAGIC CODE!",
                "show_me": "Show me what you wrote! ✨",
                "analyze_magic": "ANALYZE MY MAGIC!",
                "mastered": "Mastered!",
                "best": "Best",
                "start_learning": "Start Learning",
                "locked": "Complete previous level",
                "retry": "Retry",
                "play": "Start",
                "homework_lab": "Homework Lab"
            },
            "register": {
                "title": "Create Account",
                "username": "Username",
                "email": "Email",
                "password": "Password",
                "age": "Age",
                "have_account": "Already have an account?",
                "subtitle": "Start your journey to mastery",
                "fail": "Registration failed"
            },
            "login": {
                "title": "Welcome Back",
                "submit": "Log In",
                "no_account": "Don't have an account?",
                "register": "Register",
                "fail": "Invalid credentials",
                "username_ph": "Your username"
            },
            "test": {
                "question": "Question",
                "next": "Next",
                "submit": "Submit Test",
                "progress": "Progress"
            },
            "results": {
                "title": "Analysis Results",
                "level": "Your Level",
                "roadmap": "Your Roadmap",
                "projects": "Recommended Projects",
                "tasks": "Practical Tasks",
                "score": "Score",
                "new_analysis": "New Analysis",
                "hero": "YOU ARE A HERO!",
                "score_card": "SCORE CARD",
                "magic_points": "MAGIC POINTS",
                "adventure_map": "MY ADVENTURE MAP!",
                "fun_quests": "FUN QUESTS!",
                "my_game": "MY GAME!",
                "super_results": "Super Results!",
                "home": "HOME",
                "finished_all": "You've finished everything! Amazing! ✨",
                "unlocked": "New Level Unlocked!",
                "graduated": "Full Mastery Achieved! 🎓",
                "graduated_adult": "Mastery Achieved"
            },
            "homework": {
                "your_tasks": "Active Assignments",
                "mentor_task": "AI Mentor Challenge",
                "placeholder": "// Write your code here...",
                "submit": "Check with Mentor",
                "passed": "Challenge Passed!",
                "failed": "Needs Improvement",
                "empty": "No Task Selected",
                "empty_desc": "Pass a level test to receive your first practical mission!",
                "master_solution": "Master Solution & Deep Explanation",
                "attempts": "Attempts",
                "note": "Use this solution to understand the concepts and move forward!"
            },
            "roadmap": {
                "basics": "1. Basics & Data Types",
                "logic": "2. Variables & Logic",
                "arrays": "3. Lists & Collections",
                "functions": "4. Functions & Methods",
                "objects": "5. Objects & Classes",
                "errors": "6. Error Handling",
                "async": "7. Asynchrony",
                "apis": "8. APIs & Networking",
                "patterns": "9. Architecture & Patterns",
                "final": "10. Final Quest"
            },
            "common": {
                "back": "Back to Roadmap"
            }
        }
    },
    ru: {
        translation: {
            "landing": {
                "title": "Хватит гадать.",
                "subtitle": "Узнай свой реальный уровень.",
                "description": "Проанализируй свой код, узнай свой истинный уровень и получи персональную дорожную карту для работы мечты или стартапа.",
                "get_started": "Начать",
                "login": "Войти",
                "how_it_works": "Как это работает",
                "features": {
                    "analysis": "Глубокий анализ",
                    "roadmap": "Персональная карта",
                    "projects": "Идеи для портфолио",
                    "analysis_desc": "Наш ИИ глубоко анализирует ваш синтаксис и логику, чтобы точно определить ваш текущий уровень.",
                    "roadmap_desc": "Интерактивный путь из 10 уровней, созданный специально под ваши навыки и цели.",
                    "projects_desc": "Получайте уникальные идеи для проектов, которые помогут вам создать крутое портфолио во время обучения."
                }
            },
            "dashboard": {
                "title": "Выбери свой путь",
                "subtitle": "Выбери язык программирования, чтобы проверить свои знания",
                "start_test": "Начать тест",
                "code_analysis": "Или проанализируй готовый код",
                "paste_code": "Вставь свой код здесь...",
                "analyze": "Проанализировать код",
                "select_lang": "Выбери язык",
                "super_mentor": "СУПЕР МЕНТОР!",
                "ready": "ТЫ ГОТОВ?",
                "choose_magic": "Выбери свой магический язык! 🚀",
                "fun_challenge": "МАГИЧЕСКИЙ ВЫЗОВ",
                "assessment": "Оценка",
                "take_quiz": "ПРОЙТИ ТЕСТ!",
                "quiz_desc_child": "20 магических вопросов, чтобы получить значок героя!",
                "quiz_desc_adult": "Пройдите специализированный тест из 20 вопросов, чтобы подтвердить свои навыки.",
                "lets_go": "ПОЕХАЛИ!",
                "paste_magic": "ВСТАВЬ СВОЙ МАГИЧЕСКИЙ КОД!",
                "show_me": "Покажи мне, что ты написал! ✨",
                "analyze_magic": "АНАЛИЗ МОЕЙ МАГИИ!",
                "mastered": "Пройдено!",
                "best": "Лучший",
                "start_learning": "Начать путь",
                "locked": "Пройди предыдущий уровень",
                "retry": "Повторить",
                "play": "Начать",
                "homework_lab": "Лаборатория ДЗ"
            },
            "register": {
                "title": "Создать аккаунт",
                "username": "Имя пользователя",
                "email": "Email",
                "password": "Пароль",
                "age": "Возраст",
                "have_account": "Уже есть аккаунт?",
                "subtitle": "Начни свой путь к мастерству",
                "fail": "Ошибка регистрации"
            },
            "login": {
                "title": "С возвращением",
                "submit": "Войти",
                "no_account": "Нет аккаунта?",
                "register": "Зарегистрироваться",
                "fail": "Неверные данные",
                "username_ph": "Ваше имя пользователя"
            },
            "test": {
                "question": "Вопрос",
                "next": "Далее",
                "submit": "Завершить тест",
                "progress": "Прогресс",
                "no_questions": "К сожалению, мы еще не добавили вопросы для этого языка. Попробуйте другой!"
            },
            "results": {
                "title": "Результаты анализа",
                "level": "Твой уровень",
                "roadmap": "Дорожная карта",
                "projects": "Рекомендуемые проекты",
                "tasks": "Практические задания",
                "score": "Баллы",
                "new_analysis": "Новый анализ",
                "hero": "ТЫ ГЕРОЙ!",
                "score_card": "КАРТОЧКА",
                "magic_points": "МАГИЧЕСКИЕ ОЧКИ",
                "adventure_map": "КАРТА ПРИКЛЮЧЕНИЙ!",
                "fun_quests": "ВЕСЕЛЫЕ ЗАДАНИЯ!",
                "my_game": "МОЯ ИГРА!",
                "super_results": "Супер Результаты!",
                "home": "ДОМОЙ",
                "finished_all": "Ты всё выполнил! Невероятно! ✨",
                "unlocked": "Новый уровень открыт!",
                "graduated": "Мастерство достигнуто! 🎓",
                "graduated_adult": "Мастерство подтверждено"
            },
            "homework": {
                "your_tasks": "Активные задания",
                "mentor_task": "Вызов от ИИ-Ментора",
                "placeholder": "// Напиши свой код здесь...",
                "submit": "Проверить у Ментора",
                "passed": "Задание выполнено!",
                "failed": "Нужно доработать",
                "empty": "Задание не выбрано",
                "empty_desc": "Пройди тест уровня, чтобы получить свою первую практическую миссию!",
                "master_solution": "Мастер-решение и разбор",
                "attempts": "Попытки",
                "note": "Используй это решение, чтобы понять принципы и двигаться дальше!"
            },
            "roadmap": {
                "basics": "1. Основы и Типы данных",
                "logic": "2. Переменные и Логика",
                "arrays": "3. Списки и Коллекции",
                "functions": "4. Функции и Методы",
                "objects": "5. Объекты и Классы",
                "errors": "6. Обработка ошибок",
                "async": "7. Асинхронность",
                "apis": "8. Работа с API и Сетью",
                "patterns": "9. Архитектура и Паттерны",
                "final": "10. Финальное испытание"
            },
            "common": {
                "back": "Назад к карте"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'cookie', 'navigator'],
            caches: ['localStorage', 'cookie']
        }
    });

export default i18n;

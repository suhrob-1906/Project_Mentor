import os
import django
import sys

# Setup django
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Course, Module, Lesson

def populate():
    # Only populate if Courses are empty to avoid resetting user progress periodically
    # or use --force flag
    force = '--force' in sys.argv
    if Course.objects.exists() and not force:
        print("✅ Database already contains data. Skipping population.")
        return

    print("🚀 Clearing old curriculum (FORCED RESET)..." if force else "🌱 Initializing curriculum for the first time...")
    Course.objects.all().delete()

    # --- 1. PYTHON COURSE ---
    python_course = Course.objects.create(
        slug='python',
        title_en='Python Mastery',
        title_ru='Мастерство Python',
        description_en='From zero to backend hero with Python.',
        description_ru='От нуля до героя бэкенда на Python.'
    )

    py_titles = [
        ("Start & print()", "Старт и print()"), ("Variables", "Переменные"), ("Data Types", "Типы данных"),
        ("Arithmetic", "Арифметика"), ("Input()", "Ввод input()"), ("Comparisons", "Сравнения"),
        ("If/Else", "Условия if/else"), ("Elif", "Условия elif"), ("Logic (and/or)", "Логика (and/or)"),
        ("While Loops", "Цикл while"), ("For Loops", "Цикл for"), ("Range()", "Функция range()"),
        ("Break/Continue", "Управление циклами"), ("String Indexing", "Индексы строк"), ("Slicing", "Срезы строк"),
        ("String Methods", "Методы строк"), ("Lists Basics", "Списки: Основы"), ("List Methods", "Методы списков"),
        ("Iterating Lists", "Перебор списков"), ("Tuples", "Кортежи (tuple)"), ("Sets", "Множества (set)"),
        ("Dictionaries", "Словари (dict)"), ("Nested Data", "Вложенные данные"), ("Functions def", "Функции def"),
        ("Return", "Возврат (return)"), ("Scope", "Область видимости"), ("Try/Except", "Ошибки try/except"),
        ("File Reading", "Чтение файлов"), ("File Writing", "Запись файлов"), ("Imports", "Импорты (import)"),
        ("Random Module", "Модуль random"), ("Date/Time", "Дата и время"), ("Final Project", "Итоговый проект")
    ]

    for i, (en, ru) in enumerate(py_titles):
        mod = Module.objects.create(course=python_course, title_en=en, title_ru=ru, order=i+1)
        Lesson.objects.create(
            module=mod, slug=f"py-m{i+1}-theory", order=1, lesson_type='theory',
            title_en="Theory", title_ru="Теория",
            content_en=f"Learn about {en}. It is very important for coding.",
            content_ru=f"Изучаем {ru}. Это важная часть программирования."
        )
        Lesson.objects.create(
            module=mod, slug=f"py-m{i+1}-practice", order=2, lesson_type='practice',
            title_en="Practice", title_ru="Практика",
            content_en=f"Practice task for {en}.", content_ru=f"Практическое задание для {ru}.",
            initial_code="# Start coding\n", expected_output="done",
            solution_code="# This is a secret solution\nprint('done')"
        )

    # --- 2. JAVASCRIPT COURSE ---
    js_course = Course.objects.create(
        slug='javascript',
        title_en='Frontend Magic',
        title_ru='Магия Фронтенда',
        description_en='Build beautiful web interfaces with JS/HTML/CSS.',
        description_ru='Создавай красивые сайты с JS/HTML/CSS.'
    )

    fe_titles = [
        ("HTML Structure", "HTML: Структура"), ("Tags & Text", "Теги и текст"), ("Lists", "Списки"),
        ("Links & Media", "Ссылки и Медиа"), ("Forms", "Формы"), ("Semantic HTML", "Семантика"),
        ("CSS Selectors", "CSS: Селекторы"), ("Colors & Fonts", "Цвета и шрифты"), ("Box Model", "Модель коробок"),
        ("Display & Position", "Позиционирование"), ("Flexbox Basics", "Flexbox: Основы"), ("Flex Alignment", "Flexbox: Выравнивание"),
        ("Grid Layout", "CSS Grid"), ("Responsive Design", "Адаптивность"), ("Media Queries", "Медиа-запросы"),
        ("Transitions", "Переходы"), ("Animations", "Анимации"), ("JS Basics", "JS: Основы"),
        ("JS Variables", "JS: Переменные"), ("JS If/Else", "JS: Условия"), ("JS Loops", "JS: Циклы"),
        ("JS Functions", "JS: Функции"), ("JS Arrays", "JS: Массивы"), ("JS Objects", "JS: Объекты"),
        ("DOM Selectors", "DOM: Селекторы"), ("DOM Events", "DOM: События"), ("Click Handling", "Обработка кликов"),
        ("Input Value", "Значение инпута"), ("Fetch API", "Запросы Fetch"), ("Async/Await", "Асинхронность"),
        ("JSON", "JSON"), ("LocalStorage", "LocalStorage"), ("Modules", "Модули"),
        ("ES6 Features", "Фишки ES6"), ("Tailwind Intro", "Введение в Tailwind"), ("React Intro", "Введение в React"),
        ("React Components", "Компоненты React"), ("React Props", "Props в React"), ("React State", "State в React"),
        ("React Hooks", "Hooks в React"), ("React Router", "Роутинг в React"), ("Formik/Forms", "Формы в React"),
        ("API Context", "Context API"), ("Redux/Zustand", "State Management"), ("Final Website", "Итоговый сайт")
    ]

    for i, (en, ru) in enumerate(fe_titles):
        mod = Module.objects.create(course=js_course, title_en=en, title_ru=ru, order=i+1)
        Lesson.objects.create(
            module=mod, slug=f"fe-m{i+1}-theory", order=1, lesson_type='theory',
            title_en="Theory", title_ru="Теория",
            content_en=f"How {en} works in frontend.", content_ru=f"Как {ru} работает во фронтенде."
        )
        Lesson.objects.create(
            module=mod, slug=f"fe-m{i+1}-practice", order=2, lesson_type='practice',
            title_en="Practice", title_ru="Практика",
            content_en=f"Apply your knowledge of {en}.", content_ru=f"Примени знания {ru}.",
            initial_code="// Start coding\n", expected_output="done",
            solution_code="// Solution code\nconsole.log('done')"
        )

    print(f"Successfully populated {python_course.slug} ({len(py_titles)}) and {js_course.slug} ({len(fe_titles)})!")

if __name__ == '__main__':
    populate()

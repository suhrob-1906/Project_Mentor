import os
import django
import sys

# Setup django
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Course, Module, Lesson

def populate():
    print("Clearing old curriculum...")
    Course.objects.all().delete()

    # --- 1. BACKEND (PYTHON) ---
    backend = Course.objects.create(
        slug='python',
        title_en='Backend Mastery (Python)',
        title_ru='Мастер Бэкенда (Python)',
        description_en='From Zero to Junior Backend Developer with Python.',
        description_ru='От нуля до Junior Python разработчика.'
    )

    py_modules = [
        ("Start and print()", "Старт и print()", 
         [{"text_en": "print() outputs text.", "text_ru": "print() выводит текст.", "code_to_repeat": "print('Hello')"},
          {"text_en": "You can print numbers too.", "text_ru": "Можно выводить и числа.", "code_to_repeat": "print(123)"}], 
         [{"title_en": "Hello World", "title_ru": "Привет, Мир", "desc_en": "Print 'Hello, World!'", "desc_ru": "Выведи 'Hello, World!'", "initial_code": "", "expected_output": "Hello, World!"}]),
        
        ("Variables", "Переменные", 
         [{"text_en": "x = 5 creates a variable.", "text_ru": "x = 5 создает переменную.", "code_to_repeat": "x = 5"}], 
         [{"title_en": "Create Name", "title_ru": "Создай имя", "desc_en": "Set name = 'Python'", "desc_ru": "Установи name = 'Python'", "initial_code": "", "expected_output": "Python"}]),
        
        ("Data Types", "Типы данных", [], []),
        ("Arithmetic", "Арифметика", [], []),
        ("Input()", "Ввод input()", [], []),
        ("Strings", "Строки", [], []),
        ("Slicing", "Срезы строк", [], []),
        ("If/Else", "Условия", [], []),
        ("Elif & Nesting", "Сложные условия", [], []),
        ("Logic", "Логика (and/or)", [], []),
        ("While Loops", "Цикл While", [], []),
        ("For Loops", "Цикл For", [], []),
        ("Range()", "Функция range()", [], []),
        ("Break/Continue", "Управление циклом", [], []),
        ("Lists Basics", "Списки: Основы", [], []),
        ("List Methods", "Методы списков", [], []),
        ("List Comprehension", "Генераторы списков", [], []),
        ("Tuples (tuple)", "Кортежи (tuple)", [], []),
        ("Dictionaries", "Словари (dict)", [], []),
        ("Sets (set)", "Множества (set)", [], []),
        ("Functions", "Функции (def)", [], []),
        ("Arguments & Return", "Аргументы и Return", [], []),
        ("Lambda", "Лямбда-функции", [], []),
        ("Modules", "Модули и import", [], []),
        ("Pip & Packages", "Pip и пакеты", [], []),
        ("Errors (Try/Except)", "Ошибки", [], []),
        ("File IO", "Файлы", [], []),
        ("OOP: Classes", "ООП: Классы", [], []),
        ("OOP: Inheritance", "ООП: Наследование", [], []),
        ("OOP: Practice", "ООП: Практика", [], []),
        ("Decorators", "Декораторы", [], []),
        ("Iterators", "Итераторы", [], []),
        ("Advanced Project", "Финальный проект", [], []),
    ]

    for i, (te, tr, steps, tasks) in enumerate(py_modules, 1):
        mod = Module.objects.create(course=backend, title_en=te, title_ru=tr, order=i)
        Lesson.objects.create(
            module=mod, slug=f"py-m{i}-theory", order=1, lesson_type='theory',
            title_en="Theory", title_ru="Теория",
            theory_steps=steps or [{"text_en": f"Learn {te}...", "text_ru": f"Изучи {tr}...", "code_to_repeat": "pass"}]
        )
        Lesson.objects.create(
            module=mod, slug=f"py-m{i}-practice", order=2, lesson_type='practice',
            title_en="Practice", title_ru="Практика",
            practice_tasks=tasks or [{"title_en": "Task", "title_ru": "Задание", "desc_en": "Solve...", "desc_ru": "Реши...", "initial_code": "", "expected_output": "ok"}]
        )

    # --- 2. FRONTEND (HTML/CSS/JS) ---
    frontend = Course.objects.create(
        slug='javascript',
        title_en='Frontend Pro (HTML/CSS/JS)',
        title_ru='Фронтенд Про (HTML/CSS/JS)',
        description_en='Become a Web Master from HTML to API integration.',
        description_ru='Стань мастером веба: от HTML до работы с API.'
    )

    fe_names = [
        "HTML: Tags", "HTML: Lists", "HTML: Links", "HTML: Tables", "HTML: Forms",
        "HTML: Semantic", "CSS: Selectors", "CSS: Colors", "CSS: Box Model", "CSS: Flexbox",
        "CSS: Grid", "CSS: Position", "CSS: Animations", "CSS: Responsiveness", "CSS: Variables",
        "CSS: Transitions", "CSS: Shadows", "CSS: Transforms", "CSS: Pseudo-classes", "CSS: Media Queries",
        "JS: Intro", "JS: Variables", "JS: Types", "JS: Logic", "JS: If/Else",
        "JS: Loops", "JS: Functions", "JS: Arrow Functions", "JS: Arrays", "JS: Objects",
        "JS: DOM Selectors", "JS: DOM Events", "JS: DOM Manipulation", "JS: LocalStorage", "JS: JSON",
        "JS: Callbacks", "JS: Promises", "JS: Async/Await", "JS: Fetch API", "JS: Classes",
        "JS: Modules", "JS: Error Handling", "JS: Debugging", "JS: Final Project", "JS: Optimization"
    ]

    for i, name in enumerate(fe_names, 1):
        mod = Module.objects.create(course=frontend, title_en=name, title_ru=name, order=i)
        Lesson.objects.create(
            module=mod, slug=f"fe-m{i}-theory", order=1, lesson_type='theory',
            title_en="Theory", title_ru="Теория",
            theory_steps=[{"text_en": f"Learn {name}...", "text_ru": f"Изучи {name}...", "code_to_repeat": "<h1></h1>"}]
        )
        Lesson.objects.create(
            module=mod, slug=f"fe-m{i}-practice", order=2, lesson_type='practice',
            title_en="Practice", title_ru="Практика",
            practice_tasks=[{"title_en": "Apply", "title_ru": "Примени", "desc_en": "Code...", "desc_ru": "Напиши код...", "initial_code": "", "expected_output": "done"}]
        )

    print(f"Successfully populated {len(py_modules)} Python and {len(fe_names)} Frontend modules!")

if __name__ == '__main__':
    populate()

# content_data_v2.py
# V2 Content Structure: Theory/Practice Splits, Bilingual Support

BACKEND_COURSE_V2 = {
    "slug": "backend",
    "title_en": "Backend Development (Python)",
    "title_ru": "Backend Разработка (Python)",
    "description_en": "Master Python from scratch to advanced OOP and build real backends.",
    "description_ru": "Освойте Python с нуля до продвинутого ООП и создавайте реальные бэкенды.",
    "modules": [
        # --- MODULE 1: Start & Print ---
        {
            "title_en": "Module 1: Getting Started",
            "title_ru": "Модуль 1: Начало работы",
            "order": 1,
            "description_en": "Your first program and the print function.",
            "description_ru": "Ваша первая программа и функция print.",
            "lessons": [
                # Theory 1.1
                {
                    "slug": "py-start-theory-1",
                    "title_en": "Introduction to Python",
                    "title_ru": "Введение в Python",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# Welcome to Python! 🐍

Python is a popular, easy-to-read programming language used for web development, data science, and AI.

### The Interpreter
Python runs line-by-line using an **interpreter**. We write code, and the computer executes it immediately.

### Your First Command
To show text on the screen, we use `print()`.
Text must be inside quotes (like `"Hello"` or `'Hello'`).
""",
                    "content_ru": """
# Добро пожаловать в Python! 🐍

Python — популярный и простой язык, который используют для веб-разработки, анализа данных и ИИ.

### Интерпретатор
Python выполняет код построчно с помощью **интерпретатора**. Вы пишете команду, и компьютер сразу её выполняет.

### Ваша первая команда
Чтобы вывести текст на экран, используем функцию `print()`.
Текст должен быть в кавычках (например, `"Привет"` или `'Привет'`).
""",
                    "initial_code": "print('Hello, Python!')", 
                    "expected_output": "Hello, Python!",
                    "verification_type": "simple_check"
                },
                # Practice 1.1
                {
                    "slug": "py-start-practice-1",
                    "title_en": "Practice: Say Hello",
                    "title_ru": "Практика: Скажи Привет",
                    "type": "practice",
                    "order": 2,
                    "content_en": "Write a program that prints exactly: `Hello, World!`",
                    "content_ru": "Напишите программу, которая выводит ровно: `Hello, World!`",
                    "initial_code": "# Write your code below\n",
                    "expected_output": "Hello, World!",
                    "verification_type": "simple_check"
                },
                # Theory 1.2
                {
                    "slug": "py-start-theory-2",
                    "title_en": "Multiple Lines",
                    "title_ru": "Несколько строк",
                    "type": "theory",
                    "order": 3,
                    "content_en": """
### Printing Multiple Lines

You can use `print()` as many times as you like. Each call prints on a new line.

```python
print("Line 1")
print("Line 2")
```
""",
                    "content_ru": """
### Вывод нескольких строк

Вы можете использовать `print()` сколько угодно раз. Каждый вызов печатает на новой строке.

```python
print("Строка 1")
print("Строка 2")
```
""",
                    "initial_code": "print('1')\nprint('2')",
                    "expected_output": "1\n2",
                    "verification_type": "simple_check"
                },
                 # Practice 1.2
                {
                    "slug": "py-start-practice-2",
                    "title_en": "Practice: Name Tag",
                    "title_ru": "Практика: Бейджик",
                    "type": "practice",
                    "order": 4,
                    "content_en": "Print three lines:\n1. Your name (e.g. `Alex`)\n2. `Python Developer`\n3. `*****`",
                    "content_ru": "Выведите три строки:\n1. Ваше имя (например `Alex`)\n2. `Python Developer`\n3. `*****`",
                    "initial_code": "",
                    "expected_output": "", # Flexible check needed, or exact match if instructions strict. Let's rely on flexible or simple starter
                    "verification_type": "ai_check" # Use AI to check if they printed 3 lines roughly correct
                }
            ]
        },
        
        # --- MODULE 2: Variables ---
        {
            "title_en": "Module 2: Variables",
            "title_ru": "Модуль 2: Переменные",
            "order": 2,
            "description_en": "Storing data in memory.",
            "description_ru": "Хранение данных в памяти.",
            "lessons": [
                {
                    "slug": "py-vars-theory-1",
                    "title_en": "What is a Variable?",
                    "title_ru": "Что такое переменная?",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# Variables

A variable is like a named box where you store data.
In Python, you create a variable by giving it a name and using `=`.

```python
score = 100
name = "Neo"
print(name)
```
""",
                    "content_ru": """
# Переменные

Переменная — это именованная ячейка памяти (коробка), где хранятся данные.
В Python переменная создается с помощью знака `=`.

```python
score = 100
name = "Neo"
print(name)
```
""",
                    "initial_code": "score = 10\nprint(score)",
                    "expected_output": "10",
                    "verification_type": "simple_check"
                },
                 {
                    "slug": "py-vars-practice-1",
                    "title_en": "Practice: Create Variable",
                    "title_ru": "Практика: Создание переменной",
                    "type": "practice",
                    "order": 2,
                    "content_en": "Create a variable `city` and assign it the name of your favorite city. Then print it.",
                    "content_ru": "Создайте переменную `city` и присвойте ей название вашего любимого города. Затем выведите её.",
                    "initial_code": "",
                    "expected_output": "",
                    "verification_type": "ai_check"
                },
                {
                    "slug": "py-vars-practice-2",
                    "title_en": "Practice: Reassignment",
                    "title_ru": "Практика: Переприсваивание",
                    "type": "practice",
                    "order": 3,
                    "content_en": "1. Create variable `count` = 5.\n2. Print it.\n3. Change `count` to 10.\n4. Print it again.",
                    "content_ru": "1. Создайте переменную `count` = 5.\n2. Выведите.\n3. Измените `count` на 10.\n4. Снова выведите.",
                    "initial_code": "",
                    "expected_output": "5\n10",
                    "verification_type": "simple_check"
                }
            ]
        },
        # --- MODULE 3: Data Types ---
        {
            "title_en": "Module 3: Data Types",
            "title_ru": "Модуль 3: Типы данных",
            "order": 3,
            "description_en": "Integers, Floats, Strings, Booleans.",
            "description_ru": "Целые числа, дробные, строки и булевы значения.",
            "lessons": [
                {
                    "slug": "py-types-theory-1",
                    "title_en": "Basic Types",
                    "title_ru": "Основные типы",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# Data Types

- `int` (Integer): Whole numbers like `1`, `100`, `-5`.
- `float` (Floating Point): Decimal numbers like `3.14`, `10.5`.
- `str` (String): Text like `"Hello"`.
- `bool` (Boolean): `True` or `False`.

Use `type(variable)` to check type.
""",
                    "content_ru": """
# Типы данных

- `int` (Целое число): `1`, `100`, `-5`.
- `float` (Дробное число): `3.14`, `10.5`.
- `str` (Строка): Текст в кавычках `"Привет"`.
- `bool` (Булево): `True` (Истина) или `False` (Ложь).

Используйте `type(x)` чтобы узнать тип.
""",
                    "initial_code": "print(type(10))\nprint(type(3.14))",
                    "expected_output": "<class 'int'>\n<class 'float'>",
                    "verification_type": "simple_check"
                },
                {
                    "slug": "py-types-practice-1",
                    "title_en": "Practice: Math",
                    "title_ru": "Практика: Математика",
                    "type": "practice",
                    "order": 2,
                    "content_en": "1. Create variable `pi` = 3.14.\n2. Create variable `radius` = 5.\n3. Calculate area (`pi * radius * radius`).\n4. Print result.",
                    "content_ru": "1. Создайте `pi` = 3.14.\n2. Создайте `radius` = 5.\n3. Вычислите площадь (`pi * radius * radius`).\n4. Выведите результат.",
                    "initial_code": "",
                    "expected_output": "78.5",
                    "verification_type": "simple_check"
                }
            ]
        },

        # --- MODULE 4: Input ---
        {
            "title_en": "Module 4: Input",
            "title_ru": "Модуль 4: Ввод данных",
            "order": 4,
            "description_en": "Getting user input.",
            "description_ru": "Получение данных от пользователя.",
            "lessons": [
                {
                    "slug": "py-input-theory-1",
                    "title_en": "Reading Input",
                    "title_ru": "Чтение ввода",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# input()

To ask the user for data, use `input()`.
It ALWAYS returns a **string**.

```python
name = input("Enter name: ")
print("Hello", name)
```
""",
                    "content_ru": """
# Функция input()

Чтобы спросить данные у пользователя, используйте `input()`.
Она ВСЕГДА возвращает **строку** (`str`).

```python
name = input("Введите имя: ")
print("Привет", name)
```
""",
                    "initial_code": "name = 'Neo' # Mock input for testing\nprint('Hello', name)",
                    "expected_output": "Hello Neo",
                    "verification_type": "simple_check"
                },
                {
                    "slug": "py-input-practice-1",
                    "title_en": "Practice: Age Next Year",
                    "title_ru": "Практика: Возраст через год",
                    "type": "practice",
                    "order": 2,
                    "content_en": "1. Ask for `age` (use `input()`, assume user enters 20).\n2. Convert to int: `int(age)`.\n3. Print age + 1.",
                    "content_ru": "1. Спросите возраст `age` (используйте `input()`, считаем что ввели 20).\n2. Преобразуйте в число: `int(age)`.\n3. Выведите возраст + 1.",
                    "initial_code": "# code with input() often tricky in browser, assume input='20'\nage = '20'\n# Convert and print next year age",
                    "expected_output": "21",
                    "verification_type": "simple_check"
                }
            ]
        },

        # --- MODULE 5: Arithmetic & Operators ---
        {
            "title_en": "Module 5: Operators",
            "title_ru": "Модуль 5: Операторы",
            "order": 5,
            "lessons": [
                {
                    "slug": "py-ops-theory",
                    "title_en": "Math Ops",
                    "title_ru": "Мат. Операции",
                    "type": "theory",
                    "order": 1,
                    "content_en": "Operators:\n`+` Add\n`-` Subtract\n`*` Multiply\n`/` Divide (float)\n`//` Integer Divide\n`%` Remainder\n`**` Power",
                    "content_ru": "Операторы:\n`+` Сумма\n`-` Разность\n`*` Умножение\n`/` Деление (дробное)\n`//` Целочисленное деление\n`%` Остаток\n`**` Степень",
                    "initial_code": "print(10 / 3)\nprint(10 // 3)\nprint(10 % 3)",
                    "expected_output": "3.3333333333333335\n3\n1",
                    "verification_type": "simple_check"
                },
                {
                    "slug": "py-ops-practice",
                    "title_en": "Practice: Modulo",
                    "title_ru": "Практика: Остаток",
                    "type": "practice",
                    "order": 2,
                    "content_en": "Check if 25 is even or odd by printing `25 % 2`.",
                    "content_ru": "Проверьте четность числа 25, выведя `25 % 2`.",
                    "initial_code": "",
                    "expected_output": "1",
                    "verification_type": "simple_check"
                }
            ]
        },

        # --- MODULE 6: IF/ELSE ---
        {
            "title_en": "Module 6: Logic (If/Else)",
            "title_ru": "Модуль 6: Логика (If/Else)",
            "order": 6,
            "lessons": [
                {
                    "slug": "py-if-theory",
                    "title_en": "Conditions",
                    "title_ru": "Условия",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# IF Statement

Checks if something is True.

```python
x = 10
if x > 5:
    print("Big check") # Indentation is key!
else:
    print("Small check")
```
""",
                    "content_ru": """
# Условия IF

Проверяет истинность выражения. Отступы (4 пробела) — обязательны!

```python
x = 10
if x > 5:
    print("Больше 5")
else:
    print("Меньше или равно")
```
""",
                    "initial_code": "age = 15\nif age >= 18:\n    print('Adult')\nelse:\n    print('Teen')",
                    "expected_output": "Teen",
                    "verification_type": "simple_check"
                },
                {
                    "slug": "py-if-practice",
                    "title_en": "Practice: Access Control",
                    "title_ru": "Практика: Контроль доступа",
                    "type": "practice",
                    "order": 2,
                    "content_en": "Write a check:\nIf `password` is 'secret', print 'Access Granted'.\nElse print 'Access Denied'.",
                    "content_ru": "Напишите проверку:\nЕсли `password` равен 'secret', выведите 'Access Granted'.\nИначе 'Access Denied'.",
                    "initial_code": "password = '12345'\n",
                    "expected_output": "Access Denied",
                    "verification_type": "ai_check"
                }
            ]
        },

        # --- MODULE 7: Elif ---
        {
            "title_en": "Module 7: Advanced Logic (Elif)",
            "title_ru": "Модуль 7: Сложная логика (Elif)",
            "order": 7,
            "lessons": [
                {
                    "slug": "py-elif-practice",
                    "title_en": "Practice: Grading",
                    "title_ru": "Практика: Оценки",
                    "type": "practice",
                    "order": 1,
                    "content_en": "Score is 85.\nIf score >= 90 print 'A'.\nElif score >= 80 print 'B'.\nElse print 'C'.",
                    "content_ru": "Баллы: 85.\nЕсли >= 90 то 'A'.\nИначе если >= 80 то 'B'.\nИначе 'C'.",
                    "initial_code": "score = 85\n",
                    "expected_output": "B",
                    "verification_type": "simple_check"
                }
            ]
        },

         # --- MODULE 8: Logical Ops ---
        {
            "title_en": "Module 8: And/Or/Not",
            "title_ru": "Модуль 8: And/Or/Not",
            "order": 8,
            "lessons": [
                {
                    "slug": "py-logic-practice",
                    "title_en": "Practice: Range Check",
                    "title_ru": "Практика: Диапазон",
                    "type": "practice",
                    "order": 1,
                    "content_en": "Check if variable `x` (value 15) is between 10 and 20 using `and`. Print 'Yes' or 'No'.",
                    "content_ru": "Проверьте, находится ли `x` (15) между 10 и 20 используя оператор `and`. Выведите 'Yes' или 'No'.",
                    "initial_code": "x = 15\n",
                    "expected_output": "Yes",
                    "verification_type": "ai_check"
                }
            ]
        },

        # --- MODULE 9: While Loop ---
        {
            "title_en": "Module 9: While Loop",
            "title_ru": "Модуль 9: Цикл While",
            "order": 9,
            "lessons": [
                {
                    "slug": "py-while-theory",
                    "title_en": "While Loop",
                    "title_ru": "Цикл While",
                    "type": "theory",
                    "order": 1,
                    "content_en": "Runs *while* condition is True. Watch out for infinite loops!",
                    "content_ru": "Работает *пока* условие Истинно. Осторожнее с бесконечными циклами!",
                    "initial_code": "i = 0\nwhile i < 3:\n    print(i)\n    i += 1",
                    "expected_output": "0\n1\n2",
                    "verification_type": "simple_check"
                }
            ]
        },

        # --- MODULE 10: For Loop ---
        {
            "title_en": "Module 10: For Loop & Range",
            "title_ru": "Модуль 10: Цикл For и Range",
            "order": 10,
            "lessons": [
                {
                    "slug": "py-for-theory",
                    "title_en": "Range Function",
                    "title_ru": "Функция Range",
                    "type": "theory",
                    "order": 1,
                    "content_en": "`range(5)` gives 0, 1, 2, 3, 4.\n`range(1, 4)` gives 1, 2, 3.",
                    "content_ru": "`range(5)` дает 0, 1, 2, 3, 4.\n`range(1, 4)` дает 1, 2, 3.",
                    "initial_code": "for i in range(1, 4):\n    print(i)",
                    "expected_output": "1\n2\n3",
                    "verification_type": "simple_check"
                },
                {
                    "slug": "py-for-practice",
                    "title_en": "Practice: Summation",
                    "title_ru": "Практика: Сумма чисел",
                    "type": "practice",
                    "order": 2,
                    "content_en": "Calculate sum of numbers from 1 to 5 using a loop. Print the total.",
                    "content_ru": "Посчитайте сумму чисел от 1 до 5 используя цикл. Выведите сумму.",
                    "initial_code": "total = 0\n# write loop here\nprint(total)",
                    "expected_output": "15",
                    "verification_type": "ai_check"
                }
            ]
        }
    ]
}

FRONTEND_COURSE_V2 = {
    "slug": "frontend",
    "title_en": "Frontend Development",
    "title_ru": "Frontend Разработка",
    "description_en": "Build modern websites with HTML, CSS, and JavaScript.",
    "description_ru": "Создавайте современные сайты с помощью HTML, CSS и JavaScript.",
    "modules": [
        # --- MODULE 1: HTML Structure ---
        {
            "title_en": "Module 1: HTML Structure",
            "title_ru": "Модуль 1: Структура HTML",
            "order": 1,
            "description_en": "The skeleton of every webpage.",
            "description_ru": "Скелет каждой веб-ницы.",
            "lessons": [
                {
                    "slug": "html-struct-theory-1",
                    "title_en": "Tags and Elements",
                    "title_ru": "Теги и Элементы",
                    "type": "theory",
                    "order": 1,
                    "content_en": """
# HTML Tags

HTML uses "tags" to define elements. Tags look like `<tagname>Content</tagname>`.
- `<h1>` is a main heading.
- `<p>` is a paragraph.

```html
<h1>Hello</h1>
<p>This is text</p>
```
""",
                    "content_ru": """
# HTML Теги

HTML использует "теги" для создания элементов. Они выглядят как `<имя_тега>Контент</имя_тега>`.
- `<h1>` — главный заголовок.
- `<p>` — абзац текста.

```html
<h1>Привет</h1>
<p>Это текст</p>
```
""",
                    "initial_code": "<h1>Test</h1>",
                    "expected_output": "HTML: <h1>Test</h1>",
                    "verification_type": "simple_check"
                }
            ]
        }
    ]
}

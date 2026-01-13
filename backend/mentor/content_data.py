
# Data structure for populating courses

BACKEND_COURSE = {
    "slug": "backend",
    "title": "Backend (Python)",
    "description": "Полный курс по Python разработке: от основ до ООП.",
    "modules": [
        {
            "title": "Module 1: Основы (Basics)",
            "order": 1,
            "lessons": [
                {
                    "title": "Установка и первый запуск",
                    "slug": "intro-setup",
                    "order": 1,
                    "theory": """
# Введение в Python

Python — это мощный и простой в изучении язык.

### Ваша первая программа
Традиционно изучение любого языка начинается с вывода фразы "Hello, World!".
В Python это делается функцией `print()`.

```python
print("Hello, World!")
```
                    """,
                    "practice": "Напишите программу, которая выводит `Hello, World!`",
                    "initial_code": "# Ваш код здесь\n",
                    "expected_output": "Hello, World!",
                    "verification_type": "simple_check"
                },
                {
                    "title": "Переменные (Variables)",
                    "slug": "intro-vars",
                    "order": 2,
                    "theory": """
# Переменные

Переменная — это ящик, в котором хранится значение.
В Python не нужно указывать тип переменной явно.

```python
name = "Alex"
age = 25
print(name)
```
                    """,
                    "practice": "Создайте переменную `hero` со значением 'Batman' и выведите её.",
                    "initial_code": "# hero = ...\n",
                    "expected_output": "Batman",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 2: Типы данных (Data Types)",
            "order": 2,
            "lessons": [
                {
                    "title": "Числа и Строки",
                    "slug": "types-basic",
                    "order": 1,
                    "theory": "Основные типы: `int` (целые), `float` (дробные), `str` (строки).",
                    "practice": "Сложите 5 и 10, результат запишите в переменную `res` и выведите.",
                    "initial_code": "a = 5\nb = 10\n",
                    "expected_output": "15",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 3: Условия (If/Else)",
            "order": 3,
            "lessons": [
                {
                    "title": "Конструкция if",
                    "slug": "logic-if",
                    "order": 1,
                    "theory": "Используйте `if` для проверки условий. Не забывайте про отступы!",
                    "practice": "Если `x` больше 10, выведите 'Big'.",
                    "initial_code": "x = 20\n",
                    "expected_output": "Big",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 4: Циклы (Loops)",
            "order": 4,
            "lessons": [
                {
                    "title": "Цикл For",
                    "slug": "loop-for",
                    "order": 1,
                    "theory": "`for` позволяет перебрать последовательность.",
                    "practice": "Выведите числа от 0 до 4.",
                    "initial_code": "for i in range(5):\n    pass",
                    "expected_output": "0\n1\n2\n3\n4\n",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 5: Списки (Lists)",
            "order": 5,
            "lessons": [
                {
                    "title": "Создание списков",
                    "slug": "list-create",
                    "order": 1,
                    "theory": "Список хранит множество элементов.",
                    "practice": "Создайте список `fruits` с элементами 'apple', 'banana'. Выведите первый элемент.",
                    "initial_code": "",
                    "expected_output": "apple",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 6: Словари (Dictionaries)",
            "order": 6,
            "lessons": [
                {
                    "title": "Ключ-Значение",
                    "slug": "dict-basic",
                    "order": 1,
                    "theory": "Словарь хранит пары ключ-значение.",
                    "practice": "Создайте словарь `user` с ключом 'name' равным 'John'. Выведите значение по ключу 'name'.",
                    "initial_code": "",
                    "expected_output": "John",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 7: Функции (Functions)",
            "order": 7,
            "lessons": [
                {
                    "title": "Определение функции",
                    "slug": "func-def",
                    "order": 1,
                    "theory": "Функции позволяют переиспользовать код. Используйте `def`.",
                    "practice": "Напишите функцию `greet(name)`, которая возвращает 'Hello, ' + name. Выведите результат для 'Alice'.",
                    "initial_code": "def greet(name):\n    pass\n\nprint(greet('Alice'))",
                    "expected_output": "Hello, Alice",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 8: Работа с файлами",
            "order": 8,
            "lessons": [
                {
                    "title": "Чтение файлов",
                    "slug": "file-read",
                    "order": 1,
                    "theory": "Используйте `open()` и контекстный менеджер `with`.",
                    "practice": "В этом задании просто выведите 'File Content'.",
                    "initial_code": "print('File Content')",
                    "expected_output": "File Content",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 9: ООП (OOP)",
            "order": 9,
            "lessons": [
                {
                    "title": "Классы",
                    "slug": "oop-class",
                    "order": 1,
                    "theory": "Всё в Python - объект.",
                    "practice": "Создайте класс `Cat` с методом `meow`, который печатат 'Meow'. Создайте кота и вызовите метод.",
                    "initial_code": "class Cat:\n    pass",
                    "expected_output": "Meow",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 10: Финал (Review)",
            "order": 10,
            "lessons": [
                {
                    "title": "Финальный проект",
                    "slug": "final-py",
                    "order": 1,
                    "theory": "Поздравляем с завершением курса Backend!",
                    "practice": "Выведите 'I am a Backend Developer!'",
                    "initial_code": "",
                    "expected_output": "I am a Backend Developer!",
                    "verification_type": "simple_check"
                }
            ]
        }
    ]
}

FRONTEND_COURSE = {
    "slug": "frontend",
    "title": "Frontend (HTML/CSS/JS)",
    "description": "Курс по созданию сайтов: HTML, CSS и JavaScript.",
    "modules": [
        {
            "title": "Module 1: HTML Основы",
            "order": 1,
            "lessons": [
                {
                    "title": "Структура страницы",
                    "slug": "html-struct",
                    "order": 1,
                    "theory": "HTML (HyperText Markup Language) — это скелет.",
                    "practice": "Выведите <h1>Hello</h1>",
                    "initial_code": "<h1>Hello</h1>",
                    "expected_output": "",
                    "verification_type": "simple_check" # Handled loosely for now
                }
            ]
        },
        {
            "title": "Module 2: Текст и Ссылки",
            "order": 2,
            "lessons": [
                {
                    "title": "Параграфы",
                    "slug": "html-p",
                    "order": 1,
                    "theory": "Тег <p> используется для текста.",
                    "practice": "Создайте параграф с текстом 'Text'.",
                    "initial_code": "",
                    "expected_output": "",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 3: CSS Цвета",
            "order": 3,
            "lessons": [
                {
                    "title": "Color",
                    "slug": "css-color",
                    "order": 1,
                    "theory": "Свойство color меняет цвет текста.",
                    "practice": "Сделайте h1 красным (red).",
                    "initial_code": "h1 { }",
                    "expected_output": "",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 4: CSS Box Model",
            "order": 4,
            "lessons": [
                {
                    "title": "Margin & Padding",
                    "slug": "css-box",
                    "order": 1,
                    "theory": "Margin - внешний отступ, Padding - внутренний.",
                    "practice": "Добавьте padding: 10px для div.",
                    "initial_code": "div { }",
                    "expected_output": "",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 5: CSS Flexbox",
            "order": 5,
            "lessons": [
                {
                    "title": "Display Flex",
                    "slug": "css-flex",
                    "order": 1,
                    "theory": "Flexbox - это мощный инструмент верстки.",
                    "practice": "Установите display: flex для .container",
                    "initial_code": ".container { }",
                    "expected_output": "",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 6: JS Переменные",
            "order": 6,
            "lessons": [
                {
                    "title": "Let & Const",
                    "slug": "js-let",
                    "order": 1,
                    "theory": "Используйте let для изменяемых переменных.",
                    "practice": "Создайте переменную x = 10 и выведите в консоль.",
                    "initial_code": "",
                    "expected_output": "10",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 7: JS Функции",
            "order": 7,
            "lessons": [
                {
                    "title": "Arrow Functions",
                    "slug": "js-arrow",
                    "order": 1,
                    "theory": "Стрелочные функции: const func = () => {}",
                    "practice": "Напишите стрелочную функцию sum(a,b), которая возвращает сумму. Выведите sum(2,3).",
                    "initial_code": "",
                    "expected_output": "5",
                    "verification_type": "simple_check"
                }
            ]
        },
        {
            "title": "Module 8: JS DOM",
            "order": 8,
            "lessons": [
                {
                    "title": "GetElementById",
                    "slug": "js-dom",
                    "order": 1,
                    "theory": "document.getElementById('id') находит элемент.",
                    "practice": "Выведите 'Found' в консоль.",
                    "initial_code": "console.log('Found')",
                    "expected_output": "Found",
                    "verification_type": "simple_check"
                }
            ]
        }
    ]
}

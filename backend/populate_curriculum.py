import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Course, Module, Lesson

def populate():
    # 1. Create Courses
    python_course, _ = Course.objects.get_or_create(
        slug='backend',
        defaults={
            'title_en': 'Python Mastery',
            'title_ru': 'Мастерство Python',
            'description_en': 'From zero to backend hero.',
            'description_ru': 'От нуля до героя бэкенда.'
        }
    )

    frontend_course, _ = Course.objects.get_or_create(
        slug='frontend',
        defaults={
            'title_en': 'Frontend Magic',
            'title_ru': 'Магия Фронтенда',
            'description_en': 'Build beautiful web interfaces.',
            'description_ru': 'Создавай красивые веб-интерфейсы.'
        }
    )

    # 2. Python Topics (25)
    python_topics = [
        {
            "title_ru": "1) print() и вывод",
            "title_en": "1) print() and Output",
            "theory_ru": "Теория: print() выводит текст/числа. Можно выводить несколько значений через запятую, перенос строки делается автоматически.",
            "theory_en": "Theory: print() outputs text/numbers. Multiple values can be separated by commas, newlines are handled automatically.",
            "practice_ru": "Практика: Выведи 3 строки: “Hello”, “My name is …”, “I learn Python”.",
            "practice_en": "Practice: Output 3 lines: “Hello”, “My name is …”, “I learn Python”.",
            "initial_code": "# Write your code below\n"
        },
        {
            "title_ru": "2) Переменные",
            "title_en": "2) Variables",
            "theory_ru": "Теория: Переменная — имя, которое хранит значение. Присваивание через =. Имена: латиница/цифры/_, не начинать с цифры.",
            "theory_en": "Theory: A variable is a name that stores a value. Assignment is done via =. Names: latin/digits/_, cannot start with a digit.",
            "practice_ru": "Практика: Создай name, age, city и выведи: My name is ... I am ... I live in ....",
            "practice_en": "Practice: Create name, age, city and output: My name is ... I am ... I live in ....",
            "initial_code": "name = 'John'\n"
        },
         {
            "title_ru": "3) Типы данных (str, int, float, bool)",
            "title_en": "3) Data Types (str, int, float, bool)",
            "theory_ru": "Теория: int — целые, float — дробные, str — строки, bool — True/False. Тип влияет на операции (строки “10” ≠ число 10).",
            "theory_en": "Theory: int — integers, float — decimals, str — strings, bool — True/False. Type affects operations (str “10” ≠ number 10).",
            "practice_ru": "Практика: Даны a='10', b=5. Сделай так, чтобы получилось число 15 и выведи результат.",
            "practice_en": "Practice: Given a='10', b=5. Make it so that the result is the number 15 and output it.",
            "initial_code": "a = '10'\nb = 5\n"
        },
        {
            "title_ru": "4) input() и преобразование типов",
            "title_en": "4) input() and Type Conversion",
            "theory_ru": "Теория: input() возвращает строку. Для чисел нужно int(...) / float(...).",
            "theory_en": "Theory: input() returns a string. For numbers use int(...) / float(...).",
            "practice_ru": "Практика: Спроси у пользователя число и выведи его квадрат.",
            "practice_en": "Practice: Ask the user for a number and output its square.",
            "initial_code": ""
        },
        {
            "title_ru": "5) Арифметические операторы",
            "title_en": "5) Arithmetic Operators",
            "theory_ru": "Теория: + - * / (деление всегда float), // целочисленное, % остаток, ** степень.",
            "theory_en": "Theory: + - * / (division is always float), // integer division, % remainder, ** exponentiation.",
            "practice_ru": "Практика: Спроси 2 числа и выведи: сумму, разность, произведение, остаток от деления первого на второе.",
            "practice_en": "Practice: Ask for 2 numbers and output: sum, difference, product, and the remainder of the first divided by the second.",
            "initial_code": ""
        },
        {
            "title_ru": "6) Сравнения",
            "title_en": "6) Comparisons",
            "theory_ru": "Теория: == != > < >= <= возвращают bool.",
            "theory_en": "Theory: == != > < >= <= return bool.",
            "practice_ru": "Практика: Спроси два числа и выведи True, если первое больше второго, иначе False.",
            "practice_en": "Practice: Ask for two numbers and output True if the first is greater than the second, else False.",
            "initial_code": ""
        },
        {
            "title_ru": "7) if / else",
            "title_en": "7) if / else",
            "theory_ru": "Теория: Условие выполняет один из блоков кода. Важно: отступы.",
            "theory_en": "Theory: Condition executes one of the blocks of code. Important: indentation.",
            "practice_ru": "Практика: Спроси возраст. Если >=18 — “Access granted”, иначе “Access denied”.",
            "practice_en": "Practice: Ask for age. If >=18 — “Access granted”, else “Access denied”.",
            "initial_code": ""
        },
        {
            "title_ru": "8) elif (несколько условий)",
            "title_en": "8) elif (Multiple Conditions)",
            "theory_ru": "Теория: elif — дополнительные ветки, проверяются по порядку.",
            "theory_en": "Theory: elif — additional branches, checked in order.",
            "practice_ru": "Практика: Оценка по баллам: 90–100 A, 80–89 B, 70–79 C, иначе D.",
            "practice_en": "Practice: Grade by points: 90–100 A, 80–89 B, 70–79 C, else D.",
            "initial_code": ""
        },
        {
            "title_ru": "9) Логические операторы and/or/not",
            "title_en": "9) Logical Operators and/or/not",
            "theory_ru": "Теория: and — оба True, or — хотя бы одно True, not — инверсия.",
            "theory_en": "Theory: and — both True, or — at least one True, not — inversion.",
            "practice_ru": "Практика: Спроси возраст и наличие билета (yes/no). Разреши вход только если возраст >= 18 и билет = yes.",
            "practice_en": "Practice: Ask for age and ticket availability (yes/no). Allow entry only if age >= 18 and ticket = yes.",
            "initial_code": ""
        },
        {
            "title_ru": "10) while",
            "title_en": "10) while",
            "theory_ru": "Теория: Цикл выполняется пока условие True. Нужна точка остановки, иначе бесконечный цикл.",
            "theory_en": "Theory: Loop executes while condition is True. Needs a stop point, else infinite loop.",
            "practice_ru": "Практика: Проси ввод пароля, пока не введут “python123”. После — “Welcome”.",
            "practice_en": "Practice: Ask for password until “python123” is entered. Then — “Welcome”.",
            "initial_code": ""
        },
        {
            "title_ru": "11) for и range()",
            "title_en": "11) for and range()",
            "theory_ru": "Теория: for перебирает последовательности. range(n) даёт 0..n-1.",
            "theory_en": "Theory: for iterates over sequences. range(n) gives 0..n-1.",
            "practice_ru": "Практика: Выведи таблицу умножения на число n от 1 до 10.",
            "practice_en": "Practice: Output multiplication table for number n from 1 to 10.",
            "initial_code": ""
        },
        {
            "title_ru": "12) break / continue",
            "title_en": "12) break / continue",
            "theory_ru": "Теория: break — выйти из цикла, continue — пропустить текущую итерацию.",
            "theory_en": "Theory: break — exit loop, continue — skip current iteration.",
            "practice_ru": "Практика: Перебери числа 1..20, пропусти кратные 3, а при числе 17 — остановись.",
            "practice_en": "Practice: Iterate over numbers 1..20, skip multiples of 3, and stop at 17.",
            "initial_code": ""
        },
        {
            "title_ru": "13) Строки: индексы и срезы",
            "title_en": "13) Strings: Indices and Slices",
            "theory_ru": "Теория: Строка — последовательность. s[0] — первый, s[-1] — последний, s[a:b] — срез.",
            "theory_en": "Theory: String is a sequence. s[0] — first, s[-1] — last, s[a:b] — slice.",
            "practice_ru": "Практика: Спроси слово и выведи: первый символ, последний символ, и середину (всё кроме первого и последнего).",
            "practice_en": "Practice: Ask for a word and output: first char, last char, and the middle (everything except first and last).",
            "initial_code": ""
        },
        {
            "title_ru": "14) Методы строк",
            "title_en": "14) String Methods",
            "theory_ru": "Теория: Полезные методы: .lower(), .upper(), .strip(), .replace(), .split(), .startswith().",
            "theory_en": "Theory: Useful methods: .lower(), .upper(), .strip(), .replace(), .split(), .startswith().",
            "practice_ru": "Практика: Спроси предложение, убери лишние пробелы по краям, сделай всё в нижний регистр, посчитай количество слов.",
            "practice_en": "Practice: Ask for a sentence, strip whitespace, lowercase it, and count words.",
            "initial_code": ""
        },
        {
            "title_ru": "15) Списки (list) основы",
            "title_en": "15) Lists (list) Basics",
            "theory_ru": "Теория: Список хранит набор элементов. Индексы как у строк. Методы: .append(), .remove(), .pop().",
            "theory_en": "Theory: List stores a collection of elements. Indices like strings. Methods: .append(), .remove(), .pop().",
            "practice_ru": "Практика: Создай список из 5 чисел. Добавь ещё одно. Удали второе число. Выведи итоговый список.",
            "practice_en": "Practice: Create list of 5 numbers. Add one more. Remove the second number. Output final list.",
            "initial_code": ""
        },
         {
            "title_ru": "16) Перебор списков + агрегаты",
            "title_en": "16) Iterating Lists + Aggregates",
            "theory_ru": "Теория: Можно использовать for для сумм/макс/поиска. Также есть sum(), max(), min().",
            "theory_en": "Theory: Can use for for sums/max/search. Also sum(), max(), min() exist.",
            "practice_ru": "Практика: Даны числа пользователя (ввод через пробел). Преврати в список и выведи сумму и максимум.",
            "practice_en": "Practice: Given user numbers (input via space). Convert to list and output sum and max.",
            "initial_code": ""
        },
        {
            "title_ru": "17) Кортежи и множества (tuple, set)",
            "title_en": "17) Tuples and Sets (tuple, set)",
            "theory_ru": "Теория: tuple — неизменяемый, set — уникальные элементы.",
            "theory_en": "Theory: tuple — immutable, set — unique elements.",
            "practice_ru": "Практика: Введи слова через пробел и выведи список уникальных слов.",
            "practice_en": "Practice: input words via space and output list of unique words.",
            "initial_code": ""
        },
        {
            "title_ru": "18) Словари (dict)",
            "title_en": "18) Dictionaries (dict)",
            "theory_ru": "Теория: dict хранит пары ключ→значение. Доступ: d[key], d.get(key).",
            "theory_en": "Theory: dict stores key-value pairs. Access: d[key], d.get(key).",
            "practice_ru": "Практика: Создай словарь профиля: name, age, city. Выведи красиво каждую пару “ключ: значение”.",
            "practice_en": "Practice: Create profile dict: name, age, city. Output each pair “key: value” nicely.",
            "initial_code": ""
        },
        {
            "title_ru": "19) Вложенные структуры",
            "title_en": "19) Nested Structures",
            "theory_ru": "Теория: Можно хранить список словарей. Это база для реальных приложений.",
            "theory_en": "Theory: Can store list of dicts. This is the base for real apps.",
            "practice_ru": "Практика: Создай список из 3 словарей пользователей (name/age). Найди и выведи самого старшего.",
            "practice_en": "Practice: Create list of 3 user dicts (name/age). Find and output the oldest.",
            "initial_code": ""
        },
        {
            "title_ru": "20) Функции def",
            "title_en": "20) Functions def",
            "theory_ru": "Теория: Функция — блок кода, который можно вызывать много раз. Параметры — входные данные.",
            "theory_en": "Theory: Function is a block of code callable many times. Parameters — input data.",
            "practice_ru": "Практика: Напиши greet(name) которая печатает “Hello, <name>!”.",
            "practice_en": "Practice: Write greet(name) which prints “Hello, <name>!”.",
            "initial_code": ""
        },
        {
            "title_ru": "21) return",
            "title_en": "21) return",
            "theory_ru": "Теория: return возвращает значение. После return код ниже не выполняется.",
            "theory_en": "Theory: return returns a value. Code below return does not execute.",
            "practice_ru": "Практика: Напиши is_even(n) возвращающую True если чётное, иначе False.",
            "practice_en": "Practice: Write is_even(n) returning True if even, else False.",
            "initial_code": ""
        },
         {
            "title_ru": "22) Область видимости (scope)",
            "title_en": "22) Scope",
            "theory_ru": "Теория: Переменные внутри функции — локальные. Снаружи — глобальные.",
            "theory_en": "Theory: Variables inside function — local. Outside — global.",
            "practice_ru": "Практика: Сделай функцию add_to_total(x) которая добавляет к total и возвращает новый total (через return).",
            "practice_en": "Practice: Make function add_to_total(x) that adds to total and returns new total (via return).",
            "initial_code": "total = 0\n"
        },
        {
            "title_ru": "23) Исключения try/except",
            "title_en": "23) Exceptions try/except",
            "theory_ru": "Теория: Ошибки можно ловить: try/except. Часто ловят ValueError, ZeroDivisionError.",
            "theory_en": "Theory: Errors can be caught: try/except. Often ValueError, ZeroDivisionError.",
            "practice_ru": "Практика: Спроси два числа и выведи результат деления. Обработай ошибки.",
            "practice_en": "Practice: Ask for two numbers and output division result. Handle errors.",
            "initial_code": ""
        },
        {
            "title_ru": "24) Файлы (read/write)",
            "title_en": "24) Files (read/write)",
            "theory_ru": "Теория: Файлы открывают через open(), лучше использовать with.",
            "theory_en": "Theory: Files opened via open(), better use with.",
            "practice_ru": "Практика: Запроси у пользователя 3 строки и запиши в файл notes.txt. Потом прочитай и выведи.",
            "practice_en": "Practice: Request 3 strings from user and write to notes.txt. Then read and output.",
            "initial_code": ""
        },
        {
            "title_ru": "25) Итоговый мини-проект",
            "title_en": "25) Final Mini-Project",
            "theory_ru": "Теория: Проект должен соединять темы: ввод/вывод, условия, циклы, функции, структуры, ошибки.",
            "theory_en": "Theory: Project should connect themes: input/output, conditions, loops, functions, structures, errors.",
            "practice_ru": "Практика: Сделай консольный “To-Do” (add, list, done, remove, exit).",
            "practice_en": "Practice: Make a console “To-Do” (add, list, done, remove, exit).",
            "initial_code": ""
        },
    ]

    # Clear existing modules for these courses to start fresh
    python_course.modules.all().delete()
    frontend_course.modules.all().delete()

    for i, topic in enumerate(python_topics):
        mod = Module.objects.create(
            course=python_course,
            title_en=topic['title_en'],
            title_ru=topic['title_ru'],
            order=i + 1
        )
        # Theory
        Lesson.objects.create(
            module=mod,
            slug=f"py-{i+1}-theory",
            order=1,
            lesson_type='theory',
            title_en="Theory",
            title_ru="Теория",
            content_en=topic['theory_en'],
            content_ru=topic['theory_ru']
        )
        # Practice
        Lesson.objects.create(
            module=mod,
            slug=f"py-{i+1}-practice",
            order=2,
            lesson_type='practice',
            title_en="Practice",
            title_ru="Практика",
            content_en=topic['practice_en'],
            content_ru=topic['practice_ru'],
            initial_code=topic['initial_code']
        )

    print(f"Populated {len(python_topics)} Python modules.")

    # Frontend Topics (22)
    frontend_topics = [
        {"title_ru": "1) HTML: структура документа", "title_en": "1) HTML: Document Structure", "theory_ru": "Теория: <!doctype html>, html, head, body.", "theory_en": "Theory: <!doctype html>, html, head, body.", "practice_ru": "Практика: Создай базовую страницу с заголовком и абзацем.", "practice_en": "Practice: Create base page with header and paragraph.", "initial_code": "<!DOCTYPE html>\n<html>\n\n</html>"},
        {"title_ru": "2) Текстовые теги и списки", "title_en": "2) Text Tags and Lists", "theory_ru": "Теория: h1-h6, p, strong, em, ul/ol/li.", "theory_en": "Theory: h1-h6, p, strong, em, ul/ol/li.", "practice_ru": "Практика: Сделай страницу “My goals” со списком из 5 целей.", "practice_en": "Practice: Make “My goals” page with list of 5 goals.", "initial_code": "<h1>My Goals</h1>"},
        {"title_ru": "3) Ссылки и изображения", "title_en": "3) Links and Images", "theory_ru": "Теория: a href, img src alt.", "theory_en": "Theory: a href, img src alt.", "practice_ru": "Практика: Добавь ссылку и картинку с корректным alt.", "practice_en": "Practice: Add link and image with correct alt.", "initial_code": ""},
        {"title_ru": "4) Формы и input", "title_en": "4) Forms and input", "theory_ru": "Теория: form, label, input, button.", "theory_en": "Theory: form, label, input, button.", "practice_ru": "Практика: Сделай форму “Sign up” (name, email, age).", "practice_en": "Practice: Make “Sign up” form (name, email, age).", "initial_code": "<form>\n\n</form>"},
        {"title_ru": "5) Семантические теги", "title_en": "5) Semantic Tags", "theory_ru": "Теория: header, main, section, footer, nav.", "theory_en": "Theory: header, main, section, footer, nav.", "practice_ru": "Практика: Перепиши свою страницу используя семантические теги.", "practice_en": "Practice: Rewrite your page using semantic tags.", "initial_code": ""},
        {"title_ru": "6) CSS: подключение и селекторы", "title_en": "6) CSS: Connection and Selectors", "theory_ru": "Теория: CSS подключают файлом или <style>. Селекторы: tag, class, id.", "theory_en": "Theory: CSS connected via file or <style>. Selectors: tag, class, id.", "practice_ru": "Практика: Оформи заголовок и абзац через классы.", "practice_en": "Practice: Style header and paragraph via classes.", "initial_code": "<style>\n\n</style>"},
        {"title_ru": "7) Box model", "title_en": "7) Box model", "theory_ru": "Теория: margin, padding, border, width/height.", "theory_en": "Theory: margin, padding, border, width/height.", "practice_ru": "Практика: Сделай карточку с рамкой, внутренним и внешним отступом.", "practice_en": "Practice: Make card with border, padding and margin.", "initial_code": ".card {\n\n}"},
        {"title_ru": "8) Display и позиционирование", "title_en": "8) Display and Positioning", "theory_ru": "Теория: block/inline/inline-block. position: relative/absolute/fixed.", "theory_en": "Theory: block/inline/inline-block. position: relative/absolute/fixed.", "practice_ru": "Практика: Сделай “badge” в углу карточки (абсолютное позиционирование).", "practice_en": "Practice: Make “badge” in card corner (absolute positioning).", "initial_code": ""},
        {"title_ru": "9) Flexbox", "title_en": "9) Flexbox", "theory_ru": "Теория: display:flex, justify-content, align-items, gap.", "theory_en": "Theory: display:flex, justify-content, align-items, gap.", "practice_ru": "Практика: Сделай navbar с логотипом слева и ссылками справа.", "practice_en": "Practice: Make navbar with logo left and links right.", "initial_code": ".nav {\n  display: flex;\n}"},
        {"title_ru": "10) CSS Grid", "title_en": "10) CSS Grid", "theory_ru": "Теория: display:grid, grid-template-columns, gap.", "theory_en": "Theory: display:grid, grid-template-columns, gap.", "practice_ru": "Практика: Сделай сетку 3x2 из карточек.", "practice_en": "Practice: Make 3x2 grid of cards.", "initial_code": ".grid {\n  display: grid;\n}"},
        {"title_ru": "11) Адаптивность (media queries)", "title_en": "11) Responsiveness (media queries)", "theory_ru": "Теория: Media queries меняют стили под разные экраны.", "theory_en": "Theory: Media queries change styles for different screens.", "practice_ru": "Практика: Сделай: на ширине < 600px сетка становится в 1 колонку.", "practice_en": "Practice: On width < 600px make grid 1 column.", "initial_code": "@media (max-width: 600px) {\n\n}"},
        {"title_ru": "12) Псевдоклассы и hover", "title_en": "12) Pseudoclasses and hover", "theory_ru": "Теория: :hover, :focus, :active.", "theory_en": "Theory: :hover, :focus, :active.", "practice_ru": "Практика: Добавь hover-эффект кнопке и focus-стиль input.", "practice_en": "Practice: Add hover to button and focus to input.", "initial_code": ""},
        {"title_ru": "13) JS: подключение, console.log", "title_en": "13) JS: Connection, console.log", "theory_ru": "Теория: script src, console.log.", "theory_en": "Theory: script src, console.log.", "practice_ru": "Практика: Подключи скрипт и выведи в консоль “JS works”.", "practice_en": "Practice: Connect script and log “JS works”.", "initial_code": "console.log('Hello');"},
        {"title_ru": "14) Переменные и типы в JS", "title_en": "14) Variables and Types in JS", "theory_ru": "Теория: let/const, строки/числа/boolean.", "theory_en": "Theory: let/const, strings/numbers/boolean.", "practice_ru": "Практика: Создай name и age, выведи строку “I am …” в консоль.", "practice_en": "Practice: Create name and age, log “I am …” to console.", "initial_code": ""},
        {"title_ru": "15) Условия if/else в JS", "title_en": "15) Conditions if/else in JS", "theory_ru": "Теория: if/else синтаксис.", "theory_en": "Theory: if/else syntax.", "practice_ru": "Практика: Если возраст >= 18, вывести “Adult”, иначе “Teen”.", "practice_en": "Practice: If age >= 18, print “Adult”, else “Teen”.", "initial_code": "let age = 20;\n"},
        {"title_ru": "16) Циклы (for, while) в JS", "title_en": "16) Loops (for, while) in JS", "theory_ru": "Теория: for (let i=0; i<n; i++).", "theory_en": "Theory: for (let i=0; i<n; i++).", "practice_ru": "Практика: Выведи числа 1..10 в консоль циклом.", "practice_en": "Practice: Log numbers 1..10 to console via loop.", "initial_code": ""},
        {"title_ru": "17) Функции в JS", "title_en": "17) Functions in JS", "theory_ru": "Теория: function name() {} или arrow functions.", "theory_en": "Theory: function name() {} or arrow functions.", "practice_ru": "Практика: Напиши функцию greet(name) возвращающую приветствие.", "practice_en": "Practice: Write function greet(name) returning greeting.", "initial_code": ""},
        {"title_ru": "18) Массивы и методы в JS", "title_en": "18) Arrays and Methods in JS", "theory_ru": "Теория: push/pop, map/filter, forEach.", "theory_en": "Theory: push/pop, map/filter, forEach.", "practice_ru": "Практика: Отфильтруй только чётные числа из массива.", "practice_en": "Practice: Filter only even numbers from array.", "initial_code": "const nums = [1, 2, 3, 4, 5, 6];"},
        {"title_ru": "19) Объекты в JS", "title_en": "19) Objects in JS", "theory_ru": "Теория: { key: value }.", "theory_en": "Theory: { key: value }.", "practice_ru": "Практика: Создай объект user (name, age). Выведи “User: …”.", "practice_en": "Practice: Create user object (name, age). log “User: …”.", "initial_code": ""},
        {"title_ru": "20) DOM: поиск и изменение", "title_en": "20) DOM: Search and Modify", "theory_ru": "Теория: querySelector, textContent, classList.", "theory_en": "Theory: querySelector, textContent, classList.", "practice_ru": "Практика: Сделай кнопку, которая меняет текст заголовка.", "practice_en": "Practice: Make button that changes header text.", "initial_code": "<h1 id='title'>Hello</h1>\n<button id='btn'>Change</button>"},
        {"title_ru": "21) События в JS", "title_en": "21) Events in JS", "theory_ru": "Теория: addEventListener.", "theory_en": "Theory: addEventListener.", "practice_ru": "Практика: В форме при submit выводи имя в блок на странице.", "practice_en": "Practice: On form submit log name to a block.", "initial_code": ""},
        {"title_ru": "22) fetch и API в JS", "title_en": "22) fetch and API in JS", "theory_ru": "Теория: fetch, async/await.", "theory_en": "Theory: fetch, async/await.", "practice_ru": "Практика: Сделай кнопку “Load”, которая выводит данные из API.", "practice_en": "Practice: Make “Load” button that logs data from API.", "initial_code": ""},
    ]

    for i, topic in enumerate(frontend_topics):
        mod = Module.objects.create(
            course=frontend_course,
            title_en=topic['title_en'],
            title_ru=topic['title_ru'],
            order=i + 1
        )
        Lesson.objects.create(
            module=mod,
            slug=f"fe-{i+1}-theory",
            order=1,
            lesson_type='theory',
            title_en="Theory",
            title_ru="Теория",
            content_en=topic['theory_en'],
            content_ru=topic['theory_ru']
        )
        Lesson.objects.create(
            module=mod,
            slug=f"fe-{i+1}-practice",
            order=2,
            lesson_type='practice',
            title_en="Practice",
            title_ru="Практика",
            content_en=topic['practice_en'],
            content_ru=topic['practice_ru'],
            initial_code=topic['initial_code']
        )
    
    print(f"Populated {len(frontend_topics)} Frontend modules.")

if __name__ == "__main__":
    populate()

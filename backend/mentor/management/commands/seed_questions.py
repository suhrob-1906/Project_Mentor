from django.core.management.base import BaseCommand
from mentor.models import TestQuestion

class Command(BaseCommand):
    help = 'Seed the database with test questions'

    def handle(self, *args, **kwargs):
        questions = []
        
        def add_q(lang, diff, text_en, text_ru, opts_en, opts_ru, correct):
            questions.append({
                "language": lang, "difficulty": diff,
                "text_en": text_en, "text_ru": text_ru,
                "options_en": opts_en, "options_ru": opts_ru,
                "correct_option": correct
            })

        # PYTHON (20)
        p = "python"
        add_q(p, "beginner", "What is the output of 3 * 'abc'?", "Что выведет 3 * 'abc'?", ["abcabcabc", "SyntaxError", "abc 3", "3abc"], ["abcabcabc", "Ошибка синтаксиса", "abc 3", "3abc"], 0)
        add_q(p, "beginner", "How do you start a comment in Python?", "Как начать комментарий в Python?", ["//", "/*", "#", "--"], ["//", "/*", "#", "--"], 2)
        add_q(p, "beginner", "Which function gets the length of a list?", "Какая функция определяет длину списка?", ["size()", "length()", "len()", "count()"], ["size()", "length()", "len()", "count()"], 2)
        add_q(p, "beginner", "What is the result of 10 / 2 in Python 3?", "Какой результат 10 / 2 в Python 3?", ["5", "5.0", "5.1", "Error"], ["5", "5.0", "5.1", "Ошибка"], 1)
        add_q(p, "beginner", "Which keyword is used to define a function?", "Какое ключевое слово используется для определения функции?", ["func", "define", "def", "function"], ["func", "define", "def", "function"], 2)
        add_q(p, "junior", "What is a 'lambda'?", "Что такое 'lambda'?", ["Class", "Anonymous function", "Loop", "Library"], ["Класс", "Анонимная функция", "Цикл", "Библиотека"], 1)
        add_q(p, "junior", "What does 'self' represent?", "Что представляет 'self'?", ["The class", "The instance", "Global", "Parent"], ["Класс", "Экземпляр", "Глобал", "Родитель"], 1)
        add_q(p, "junior", "Which of these is a mutable type?", "Что из этого — изменяемый тип?", ["Tuple", "String", "List", "Int"], ["Кортеж", "Строка", "Список", "Число"], 2)
        add_q(p, "junior", "How to add an element to a list?", "Как добавить элемент в список?", ["add()", "push()", "insert()", "append()"], ["add()", "push()", "insert()", "append()"], 3)
        add_q(p, "junior", "What is __init__?", "Что такое __init__?", ["Destructor", "Constructor", "Method", "Variable"], ["Деструктор", "Конструктор", "Метод", "Переменная"], 1)
        add_q(p, "junior", "What is a 'decorator'?", "Что такое 'декоратор'?", ["UI element", "Function modifier", "Type of list", "Class attribute"], ["Элемент UI", "Модификатор функции", "Тип списка", "Атрибут класса"], 1)
        add_q(p, "junior", "How to handle exceptions?", "Как обрабатывать исключения?", ["try/catch", "try/except", "do/while", "if/else"], ["try/catch", "try/except", "do/while", "if/else"], 1)
        add_q(p, "junior", "What is boolean range?", "Каков диапазон boolean?", ["0-255", "True/False", "-1 to 1", "String"], ["0-255", "True/False", "-1 to 1", "Строка"], 1)
        add_q(p, "junior", "What is 'Pip'?", "Что такое 'Pip'?", ["Code editor", "Package manager", "Database", "Browser"], ["Редактор кода", "Пакетный менеджер", "База данных", "Браузер"], 1)
        add_q(p, "junior", "Check variable type?", "Проверить тип переменной?", ["typeof()", "type()", "kind()", "is()"], ["typeof()", "type()", "kind()", "is()"], 1)
        add_q(p, "middle", "What is GIL?", "Что такое GIL?", ["Global Interpreter Lock", "General Layout", "Index List", "Global Library"], ["Global Interpreter Lock", "General Layout", "Index List", "Global Library"], 0)
        add_q(p, "middle", "Difference __str__ vs __repr__?", "Разница __str__ и __repr__?", ["Same", "User vs Debug", "Str for ints", "Repr for lists"], ["Одно и то же", "Для юзера vs Для дебага", "Str для чисел", "Repr для списков"], 1)
        add_q(p, "middle", "What are generators?", "Что такое генераторы?", ["Power supply", "Iterators using yield", "Class builders", "Database tools"], ["Источник питания", "Итераторы с yield", "Строители классов", "Инструменты БД"], 1)
        add_q(p, "middle", "What is 'MRO'?", "Что такое 'MRO'?", ["Method Resolution Order", "Main Run Object", "Module Read Only", "Memory Reset Option"], ["Method Resolution Order", "Main Run Object", "Module Read Only", "Memory Reset Option"], 0)
        add_q(p, "middle", "What is 'monkey patching'?", "Что такое 'monkey patching'?", ["Testing toys", "Runtime modifications", "Fixing loops", "Prank"], ["Тестирование игрушек", "Изменения во время выполнения", "Исправление циклов", "Розыгрыш"], 1)

        # JAVASCRIPT (20)
        js = "javascript"
        add_q(js, "beginner", "Inside which HTML element do we put the JS?", "В какой HTML элемент мы помещаем JS?", ["<js>", "<scripting>", "<script>", "<javascript>"], ["<js>", "<scripting>", "<script>", "<javascript>"], 2)
        add_q(js, "beginner", "Declare a variable?", "Объявить переменную?", ["var", "let", "const", "All of above"], ["var", "let", "const", "Все вышеперечисленное"], 3)
        add_q(js, "beginner", "Equality for value and type?", "Равенство по значению и типу?", ["=", "==", "===", "!="], ["=", "==", "===", "!="], 2)
        add_q(js, "beginner", "Access console?", "Доступ к консоли?", ["print()", "console.log()", "msg()", "alert()"], ["print()", "console.log()", "msg()", "alert()"], 1)
        add_q(js, "beginner", "Array length?", "Длина массива?", ["length", "size()", "count", "len"], ["length", "size()", "count", "len"], 0)
        add_q(js, "junior", "What is 'Hoisting'?", "Что такое 'Хойстинг'?", ["Lifting heavy objects", "Moving declarations to top", "Looping", "Styling"], ["Поднятие тяжестей", "Перенос объявлений вверх", "Циклы", "Стилизация"], 1)
        add_q(js, "junior", "What is 'Closure'?", "Что такое 'Замыкание'?", ["Privacy", "Function with outer scope", "Ending a loop", "Class"], ["Приватность", "Функция со внешним окружением", "Завершение цикла", "Класс"], 1)
        add_q(js, "junior", "What is 'this' keyword?", "Что такое 'this'?", ["Next element", "Current context", "Global only", "Pointer"], ["Следующий элемент", "Текущий контекст", "Только глобал", "Указатель"], 1)
        add_q(js, "junior", "Arrow function syntax?", "Синтаксис стрелочной функции?", ["=>", "->", "=>=", ":>"], ["=>", "->", "=>=", ":>"], 0)
        add_q(js, "junior", "Convert string to int?", "Превратить строку в число?", ["toInt()", "parseInt()", "number()", "valueOf()"], ["toInt()", "parseInt()", "number()", "valueOf()"], 1)
        add_q(js, "junior", "What is DOM?", "Что такое DOM?", ["Direct Object Map", "Document Object Model", "Disk On Module", "Data Object Mode"], ["Direct Object Map", "Document Object Model", "Disk On Module", "Data Object Mode"], 1)
        add_q(js, "junior", "Async/Await result?", "Результат Async/Await?", ["Callback", "Promise", "String", "Error"], ["Callback", "Промис", "Строка", "Ошибка"], 1)
        add_q(js, "junior", "JSON parsing?", "Парсинг JSON?", ["JSON.read()", "JSON.parse()", "parse(JSON)", "JSON.load()"], ["JSON.read()", "JSON.parse()", "parse(JSON)", "JSON.load()"], 1)
        add_q(js, "junior", "Map function on array?", "Функция map для массива?", ["Filter", "Transform each element", "Sort", "Length"], ["Фильтр", "Трансформация элементов", "Сортировка", "Длина"], 1)
        add_q(js, "junior", "Template literals use?", "Шаблонные литералы используют?", ["''", '""', "``", "[]"], ["''", '""', "``", "[]"], 2)
        add_q(js, "middle", "What is 'Event Loop'?", "Что такое 'Event Loop'?", ["Circle UI", "Concurrency model", "Forever loop", "Hardware part"], ["Круглый UI", "Модель многопоточности", "Вечный цикл", "Железо"], 1)
        add_q(js, "middle", "Difference let vs var?", "Разница let и var?", ["None", "Scope and hoisting", "Let for numbers", "Var for strings"], ["Нет", "Область видимости и хойстинг", "Let для чисел", "Var для строк"], 1)
        add_q(js, "middle", "Symbol type use?", "Использование типа Symbol?", ["Text", "Unique identifiers", "Loop count", "Color"], ["Текст", "Уникальные идентификаторы", "Счетчик цикла", "Цвет"], 1)
        add_q(js, "middle", "Virtual DOM (React context)?", "Virtual DOM (в контексте React)?", ["GPU part", "In-memory tree", "Real screen pixels", "Database"], ["Часть видеокарты", "Дерево в памяти", "Пиксели экрана", "База данных"], 1)
        add_q(js, "middle", "What is 'Memoization'?", "Что такое 'Мемоизация'?", ["Memorize lyrics", "Caching results", "Memory leak", "Sleep function"], ["Учить стихи", "Кэширование результатов", "Утечка памяти", "Функция сна"], 1)

        # GO (20)
        go = "go"
        add_q(go, "beginner", "Who created Go?", "Кто создал Go?", ["Apple", "Google", "Facebook", "Amazon"], ["Apple", "Google", "Facebook", "Amazon"], 1)
        add_q(go, "beginner", "File extension?", "Расширение файла?", [".go", ".g", ".golang", ".exe"], [".go", ".g", ".golang", ".exe"], 0)
        add_q(go, "beginner", "Declare variable?", "Объявить переменную?", ["var x int", "int x", "x := 10", "A and C"], ["var x int", "int x", "x := 10", "А и В"], 3)
        add_q(go, "beginner", "How to print?", "Как печатать?", ["fmt.Println()", "print()", "log()", "msg()"], ["fmt.Println()", "print()", "log()", "msg()"], 0)
        add_q(go, "beginner", "Exported identifiers start with?", "Экспортируемые имена начинаются с?", ["_", "Lowercase", "Uppercase", "$"], ["_", "Строчной", "Заглавной", "$"], 2)
        add_q(go, "junior", "What is a 'goroutine'?", "Что такое 'goroutine'?", ["Thread", "Lightweight thread", "Loop", "Function"], ["Поток", "Легкий поток", "Цикл", "Функция"], 1)
        add_q(go, "junior", "Channels use?", "Использование каналов?", ["Music", "Communicate goroutines", "Database", "Styling"], ["Музыка", "Связь горутин", "База данных", "Стили"], 1)
        add_q(go, "junior", "Go's error handling?", "Обработка ошибок в Go?", ["Exceptions", "Return error value", "Crash", "Try/Catch"], ["Исключения", "Возврат значения ошибки", "Падение", "Try/Catch"], 1)
        add_q(go, "junior", "What is a Slice?", "Что такое Слайс (Slice)?", ["Cake", "Dynamic array", "Static array", "String"], ["Пирог", "Динамический массив", "Статический массив", "Строка"], 1)
        add_q(go, "junior", "What is a Map?", "Что такое Map?", ["Atlas", "Key-Value storage", "List", "Struct"], ["Атлас", "Хранилище ключ-значение", "Список", "Структура"], 1)
        add_q(go, "junior", "What is 'defer'?", "Что такое 'defer'?", ["Delay loop", "Cleanup tasks", "Wait 5s", "Abort"], ["Задержка цикла", "Очистка задач", "Ждать 5с", "Прервать"], 1)
        add_q(go, "junior", "Go Structs?", "Структуры (Structs) в Go?", ["Classes", "Custom types", "Images", "Arrays"], ["Классы", "Пользовательские типы", "Картинки", "Массивы"], 1)
        add_q(go, "junior", "Can slices be comparable?", "Можно ли сравнивать слайсы?", ["Yes", "Only to nil", "Always", "With =="], ["Да", "Только с nil", "Всегда", "Через =="], 1)
        add_q(go, "junior", "What is 'init' function?", "Что такое функция 'init'?", ["Start point", "Auto run at startup", "User defined", "Error func"], ["Точка входа", "Автозапуск при старте", "Пользовательская", "Для ошибок"], 1)
        add_q(go, "junior", "Pointers in Go?", "Указатели в Go?", ["No pointers", "Yes, with address of (&)", "Only for strings", "Auto"], ["Нет", "Да, через (&)", "Только для строк", "Авто"], 1)
        add_q(go, "middle", "What is 'Reflection'?", "Что такое 'Рефлексия'?", ["Mirror", "Runtime type inspection", "Memory dump", "Loop back"], ["Зеркало", "Инспекция типов во время выполнения", "Дамп памяти", "Возврат"], 1)
        add_q(go, "middle", "Interface implementation?", "Реализация интерфейса?", ["Explicitly", "Implicitly", "With keyword 'implements'", "By decorator"], ["Явно", "Неявно", "Через 'implements'", "Через декоратор"], 1)
        add_q(go, "middle", "Select statement use?", "Использование select?", ["Database", "Choosing channel operations", "IF replacement", "Styling"], ["База данных", "Выбор операции канала", "Замена IF", "Стили"], 1)
        add_q(go, "middle", "Race condition detector?", "Детектор состояния гонки?", ["-race flag", "-speed flag", "-test flag", "No detector"], ["флаг -race", "флаг -speed", "флаг -test", "Нет его"], 0)
        add_q(go, "middle", "Context package purpose?", "Цель пакета Context?", ["UI", "Cancellation and deadlines", "Math", "HTTP routing"], ["UI", "Отмена и дедлайны", "Математика", "Роутинг"], 1)

        # JAVA (20)
        java = "java"
        add_q(java, "beginner", "Which data type stores text?", "Какой тип данных хранит текст?", ["String", "txt", "char[]", "int"], ["String", "txt", "char[]", "int"], 0)
        add_q(java, "beginner", "Access main method?", "Метод main?", ["public static void main", "main(String args)", "start()", "A and B"], ["public static void main", "main(String args)", "start()", "А и В"], 3)
        add_q(java, "beginner", "Boolean default value?", "Дефолтное значение Boolean?", ["true", "false", "null", "undefined"], ["true", "false", "null", "undefined"], 1)
        add_q(java, "beginner", "File extension?", "Расширение файла?", [".java", ".j", ".class", ".jv"], [".java", ".j", ".class", ".jv"], 0)
        add_q(java, "beginner", "Create an object?", "Создать объект?", ["new Object()", "Object.create()", "make Object", "A and B"], ["new Object()", "Object.create()", "make Object", "А и В"], 0)
        add_q(java, "junior", "What is JVM?", "Что такое JVM?", ["Java Virtual Machine", "Visual Map", "Version Manager", "Variable Mode"], ["Java Virtual Machine", "Visual Map", "Version Manager", "Variable Mode"], 0)
        add_q(java, "junior", "Inheritance keyword?", "Ключевое слово для наследования?", ["implements", "extends", "inherits", "shows"], ["implements", "extends", "inherits", "shows"], 1)
        add_q(java, "junior", "Interface keyword?", "Ключевое слово для интерфейса?", ["implements", "extends", "interface", "A and C"], ["implements", "extends", "interface", "А и В"], 3)
        add_q(java, "junior", "What is Polymorphism?", "Что такое Полиморфизм?", ["Shapes", "Many forms", "Database", "Loop"], ["Фигуры", "Много форм", "База данных", "Цикл"], 1)
        add_q(java, "junior", "What is Abstraction?", "Что такое Абстракция?", ["Hiding details", "Drawing", "Looping", "Styling"], ["Скрытие деталей", "Рисование", "Циклы", "Стили"], 0)
        add_q(java, "junior", "Static vs non-static?", "Статический vs не статический?", ["Static is instance only", "Static belongs to class", "No difference", "Var names"], ["Static только для экземпляра", "Static принадлежит классу", "Нет разницы", "Имена"], 1)
        add_q(java, "junior", "Exception handling?", "Обработка исключений?", ["try/catch/finally", "try/except", "do/while", "if/else"], ["try/catch/finally", "try/except", "do/while", "if/else"], 0)
        add_q(java, "junior", "Java collection for unique elements?", "Коллекция Java для уникальных элементов?", ["List", "Set", "Map", "Queue"], ["Список", "Сет", "Мапа", "Очередь"], 1)
        add_q(java, "junior", "Wrapper classes?", "Классы-обертки?", ["Images", "Primitive to object", "Wraps code", "Baskets"], ["Картинки", "Примитив в объект", "Обертки для кода", "Корзины"], 1)
        add_q(java, "junior", "Thread vs Runnable?", "Thread vs Runnable?", ["No difference", "Inherit vs implement interface", "Speed", "Colors"], ["Нет разницы", "Наследование vs интерфейс", "Скорость", "Цвета"], 1)
        add_q(java, "middle", "What is Reflection in Java?", "Что такое Рефлексия в Java?", ["Mirror", "Runtime inspection of classes", "Garbage collection", "Loop back"], ["Зеркало", "Инспекция классов во время выполнения", "Сборка мусора", "Возврат"], 1)
        add_q(java, "middle", "Difference HashMap vs Hashtable?", "Разница HashMap и Hashtable?", ["Hashtable is synchronized", "None", "HashMap is faster", "A and C"], ["Hashtable синхронизирован", "Нет разницы", "HashMap быстрее", "А и В"], 3)
        add_q(java, "middle", "What is Generic?", "Что такое Generic?", ["Normal", "Type safety in collections", "General", "Math func"], ["Обычный", "Типизация коллекций", "Общий", "Мат. функция"], 1)
        add_q(java, "middle", "Garbage Collector purpose?", "Цель Garbage Collector?", ["Cleanup UI", "Automatic memory management", "Recycling bin", "Math"], ["Очистка UI", "Автоматическое управление памятью", "Корзина", "Математика"], 1)
        add_q(java, "middle", "Final vs finally vs finalize?", "Final vs finally vs finalize?", ["Same", "Var modifier, block, cleanup", "Loops", "Crash"], ["Одно и то же", "Для переменной, блок, очистка", "Циклы", "Падение"], 1)

        TestQuestion.objects.all().delete()
        for q in questions:
            TestQuestion.objects.create(**q)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(questions)} questions'))

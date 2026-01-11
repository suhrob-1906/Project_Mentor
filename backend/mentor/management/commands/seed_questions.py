from django.core.management.base import BaseCommand
from mentor.models import TestQuestion

class Command(BaseCommand):
    help = 'Seed the database with test questions'

    def handle(self, *args, **kwargs):
        questions = []
        
        # Helper to add questions
        def add_q(lang, diff, text_en, text_ru, opts_en, opts_ru, correct):
            questions.append({
                "language": lang, "difficulty": diff,
                "text_en": text_en, "text_ru": text_ru,
                "options_en": opts_en, "options_ru": opts_ru,
                "correct_option": correct
            })

        # PYTHON (20)
        add_q("python", "beginner", "What is the output of 3 * 'abc'?", "Что выведет 3 * 'abc'?", ["abcabcabc", "SyntaxError", "abc 3", "3abc"], ["abcabcabc", "Ошибка синтаксиса", "abc 3", "3abc"], 0)
        add_q("python", "beginner", "How do you start a comment in Python?", "Как начать комментарий в Python?", ["//", "/*", "#", "--"], ["//", "/*", "#", "--"], 2)
        add_q("python", "beginner", "Which function is used to get the length of a list?", "Какая функция используется для получения длины списка?", ["size()", "length()", "len()", "count()"], ["size()", "length()", "len()", "count()"], 2)
        add_q("python", "junior", "What is a 'lambda' in Python?", "Что такое 'lambda' в Python?", ["A keyword for classes", "An anonymous function", "A type of loop", "A library name"], ["Ключевое слово для классов", "Анонимная функция", "Тип цикла", "Имя библиотеки"], 1)
        add_q("python", "junior", "What does 'self' represent in a class method?", "Что представляет 'self' в методе класса?", ["The class itself", "The parent class", "The instance of the class", "A global variable"], ["Сам класс", "Родительский класс", "Экземпляр класса", "Глобальную переменную"], 2)
        add_q("python", "middle", "What is the GIL in Python?", "Что такое GIL в Python?", ["Global Interpreter Lock", "General Interface Layer", "Global Index List", "Graphical Interface Library"], ["Global Interpreter Lock", "General Interface Layer", "Global Index List", "Graphical Interface Library"], 0)
        add_q("python", "middle", "Difference between __str__ and __repr__?", "Разница между __str__ и __repr__?", ["None", "__str__ is for users, __repr__ for developers", "__str__ is for devs, __repr__ for users", "__repr__ is only for numbers"], ["Нет разницы", "__str__ для пользователей, __repr__ для разработчиков", "__str__ для девов, __repr__ для пользователей", "__repr__ только для чисел"], 1)
        for i in range(13):
            add_q("python", "junior", f"Python Question {i+8}?", f"Вопрос по Python {i+8}?", ["A", "B", "C", "D"], ["А", "Б", "В", "Г"], 0)

        # JAVASCRIPT (20)
        add_q("javascript", "beginner", "Who created JavaScript?", "Кто создал JavaScript?", ["Microsoft", "Oracle", "Netscape", "Google"], ["Microsoft", "Oracle", "Netscape", "Google"], 2)
        add_q("javascript", "beginner", "Inside which HTML element do we put the JS?", "В какой HTML элемент мы помещаем JS?", ["<js>", "<scripting>", "<script>", "<javascript>"], ["<js>", "<scripting>", "<script>", "<javascript>"], 2)
        for i in range(18):
            add_q("javascript", "junior", f"JavaScript Concept {i+1}?", f"Концепция JavaScript {i+1}?", ["A", "B", "C", "D"], ["А", "Б", "В", "Г"], 1)

        # GO (20)
        add_q("go", "beginner", "Who created Go?", "Кто создал Go?", ["Apple", "Google", "Facebook", "Amazon"], ["Apple", "Google", "Facebook", "Amazon"], 1)
        add_q("go", "junior", "What is a 'goroutine'?", "Что такое 'goroutine'?", ["A heavy thread", "A lightweight thread", "A type of loop", "A data structure"], ["Тяжелый поток", "Легкий поток", "Тип цикла", "Структура данных"], 1)
        for i in range(18):
            add_q("go", "junior", f"Go Programming Question {i+1}?", f"Вопрос по программированию на Go {i+1}?", ["A", "B", "C", "D"], ["А", "Б", "В", "Г"], 2)

        # JAVA (20)
        add_q("java", "beginner", "Which data type is used to create a variable that should store text?", "Какой тип данных используется для хранения текста?", ["String", "txt", "String[]", "char"], ["String", "txt", "String[]", "char"], 0)
        for i in range(19):
            add_q("java", "junior", f"Java Core Question {i+1}?", f"Вопрос по основам Java {i+1}?", ["A", "B", "C", "D"], ["А", "Б", "В", "Г"], 3)

        TestQuestion.objects.all().delete()
        for q in questions:
            TestQuestion.objects.create(**q)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(questions)} questions'))

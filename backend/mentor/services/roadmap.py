class RoadmapGenerator:
    def __init__(self, language, level, goal):
        self.language = language
        self.level = level
        self.goal = goal

    def generate(self):
        # Basic templates
        roadmap = []
        
        if self.language == 'python':
            if self.level == 'beginner':
                roadmap = [
                    {"topic": "Variables & Data Types", "description": "Integers, Strings, Lists, Dictionaries."},
                    {"topic": "Control Flow", "description": "If/Else, Loops (for, while)."},
                    {"topic": "Functions", "description": "Arguments, return values, scope."},
                    {"topic": "Basic OOP", "description": "Classes, Objects, Methods."},
                ]
            elif self.level == 'junior':
                roadmap = [
                    {"topic": "Advanced OOP", "description": "Inheritance, Polymorphism, Encapsulation."},
                    {"topic": "Error Handling", "description": "Try/Except, Custom Exceptions."},
                    {"topic": "Standard Library", "description": "os, sys, datetime, json, re."},
                    {"topic": "Virtual Environments", "description": "venv, pip, requirements.txt."},
                ]
                if self.goal == 'job':
                    roadmap.append({"topic": "Web Frameworks", "description": "Learn Django or FastAPI basics."})
            
            elif self.level in ['strong_junior', 'middle']:
                roadmap = [
                    {"topic": "Design Patterns", "description": "Singleton, Factory, Observer."},
                    {"topic": "Testing", "description": "unittest, pytest, TDD basics."},
                    {"topic": "Concurrency", "description": "Threading, Multiprocessing, Asyncio."},
                    {"topic": "Docker", "description": "Containerization basics."},
                ]

        elif self.language == 'javascript':
            # Simplified JS roadmap
             if self.level == 'beginner':
                roadmap = [
                    {"topic": "Syntax Basics", "description": "Variables (let/const), Types."},
                    {"topic": "DOM Manipulation", "description": "Selectors, Events."},
                    {"topic": "Functions", "description": "Arrow functions, callbacks."},
                ]
             else:
                roadmap = [
                    {"topic": "Async JS", "description": "Promises, Async/Await."},
                    {"topic": "Modern ES6+", "description": "Destructuring, spread, modules."},
                    {"topic": "React.js", "description": "Components, Hooks, State."},
                ]

        return roadmap

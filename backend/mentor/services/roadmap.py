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

        elif self.language == 'go':
            if self.level == 'beginner':
                roadmap = [
                    {"topic": "Go Basics", "description": "Variables, Types, Functions."},
                    {"topic": "Structs & Interfaces", "description": "Data modeling in Go."},
                    {"topic": "Goroutines", "description": "Concurrency basics."},
                ]
            else:
                roadmap = [
                    {"topic": "Channels", "description": "Communication between goroutines."},
                    {"topic": "Error Handling", "description": "Idiomatic Go errors."},
                    {"topic": "Context & Timeouts", "description": "Managing request lifecycles."},
                ]

        elif self.language == 'java':
            if self.level == 'beginner':
                roadmap = [
                    {"topic": "Java Syntax", "description": "Main method, Types, Loops."},
                    {"topic": "OOP Fundamentals", "description": "Classes, Objects, Inheritance."},
                ]
            else:
                roadmap = [
                    {"topic": "Collections Framework", "description": "Lists, Sets, Maps."},
                    {"topic": "Spring Boot", "description": "Building REST APIs."},
                    {"topic": "JVM Internals", "description": "Memory management and GC."},
                ]

        return roadmap

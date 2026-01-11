class ProjectGenerator:
    def __init__(self, language, level):
        self.language = language
        self.level = level

    def generate(self):
        projects = []
        
        if self.language == 'python':
            if self.level == 'beginner':
                projects.append({
                    "title": "Expense Tracker CLI",
                    "description": "A command-line tool to track daily expenses and save them to a JSON file.",
                    "tech_stack": ["Python", "JSON", "Argparse"],
                    "features": ["Add expense", "List expenses", "Calculate total"]
                })
                projects.append({
                    "title": "Weather Fetcher",
                    "description": "Script that fetches weather for a city using a public API.",
                    "tech_stack": ["Python", "requests", "API"],
                    "features": ["Input city", "Show temp/humidity", "Error handling"]
                })
            else:
                projects.append({
                    "title": "Task Management API",
                    "description": "REST API for a Trello-like application.",
                    "tech_stack": ["Django", "DRF", "PostgreSQL"],
                    "features": ["CRUD Tasks", "User Auth", "Filter by status"]
                })
                projects.append({
                    "title": "E-commerce Inventory System",
                    "description": "Backend system to manage products, stock, and orders.",
                    "tech_stack": ["Django", "Celery", "Redis"],
                    "features": ["Product variants", "Low stock alerts", "Order processing"]
                })

        elif self.language == 'go':
            projects.append({
                "title": "Concurrent URL Checker",
                "description": "A high-performance CLI tool that checks website availability using goroutines.",
                "tech_stack": ["Go", "Goroutines", "Net/HTTP"],
                "features": ["Parallel requests", "Timeout handling", "Detailed report"]
            })
            projects.append({
                "title": "REST API with Fiber",
                "description": "A fast and minimal backend for a blogging platform.",
                "tech_stack": ["Go", "Gofiber", "GORM"],
                "features": ["JWT Auth", "Post management", "Validation"]
            })

        elif self.language == 'java':
            projects.append({
                "title": "Employee Management System",
                "description": "A full-scale enterprise application to manage staff records.",
                "tech_stack": ["Java", "Spring Boot", "MySQL"],
                "features": ["CRUD operations", "Role-based access", "PDF reports"]
            })
            projects.append({
                "title": "Android Quiz App",
                "description": "A mobile application for taking interactive quizzes.",
                "tech_stack": ["Java", "Android SDK", "SQLite"],
                "features": ["Timer", "Score tracking", "Animations"]
            })

        elif self.language == 'javascript':
            if self.level == 'beginner':
                projects.append({
                    "title": "Interactive Todo App",
                    "description": "A feature-rich todo list with local storage persistence.",
                    "tech_stack": ["HTML", "CSS", "JavaScript"],
                    "features": ["Add/Delete tasks", "Strikethrough completion", "Filter tasks"]
                })
            else:
                projects.append({
                    "title": "Real-time Chat App",
                    "description": "A chat application using WebSockets for instant messaging.",
                    "tech_stack": ["React", "Node.js", "Socket.io"],
                    "features": ["Message history", "Online users list", "Typing indicators"]
                })

        return projects

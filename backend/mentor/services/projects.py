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

        elif self.language == 'javascript':
             projects.append({
                "title": "Weather Dashboard",
                "description": "Frontend app showing weather forecast.",
                "tech_stack": ["React", "CSS", "Fetch API"],
                "features": ["Search city", "5-day forecast", "Responsive UI"]
            })

        return projects

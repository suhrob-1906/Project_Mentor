import re
import statistics
try:
    from radon.complexity import cc_visit
    from radon.metrics import h_visit
    from radon.raw import analyze as raw_analyze
except ImportError:
    # Fallback if radon not installed or other env
    cc_visit = None

class CodeAnalyzer:
    def __init__(self, code_text, language='python'):
        self.code = code_text
        self.language = language
        self.metrics = {
            'sloc': 0,
            'complexity_avg': 0,
            'issues': []
        }
        self.level = 'beginner'

    def analyze(self):
        # 1. Basic Stats
        lines = self.code.split('\n')
        self.metrics['sloc'] = len([l for l in lines if l.strip()])
        
        # 2. Complexity (Python only for now)
        if self.language == 'python' and cc_visit:
            try:
                blocks = cc_visit(self.code)
                complexities = [b.complexity for b in blocks]
                if complexities:
                    self.metrics['complexity_avg'] = statistics.mean(complexities)
                    self.metrics['complexity_max'] = max(complexities)
                else:
                    self.metrics['complexity_avg'] = 1
            except Exception as e:
                self.metrics['issues'].append(f"Parsing error: {str(e)}")

        # 3. Heuristics
        self._check_heuristics()
        
        # 4. Determine Level
        self._determine_level()
        
        return {
            'level': self.level,
            'metrics': self.metrics,
            'feedback': self._generate_feedback()
        }

    def _check_heuristics(self):
        issues = []
        
        # Common Beginner Mistakes
        if self.language == 'python':
            if 'except:' in self.code and 'except Exception:' not in self.code:
                issues.append("Avoid bare 'except:' clauses. Catch specific exceptions.")
            if 'print(' in self.code and self.metrics['sloc'] > 50:
                issues.append("Using 'print' for debugging in larger scripts? Consider 'logging'.")
            if re.search(r'def [A-Z]', self.code):
                issues.append("Function names should be snake_case in Python (e.g., 'my_function'), not CamelCase.")
        
        # Naming length
        short_vars = re.findall(r'\b[a-z]{1,2}\b', self.code)
        if len(short_vars) > 5:
            issues.append(f"Too many short variable names found ({', '.join(short_vars[:5])}...). Use descriptive names.")

        self.metrics['issues'].extend(issues)

    def _determine_level(self):
        sloc = self.metrics['sloc']
        complexity = self.metrics.get('complexity_avg', 1)
        issues = self.metrics['issues']

        # Rule-based classification
        if sloc < 20:
            self.level = 'beginner'
        elif sloc < 100:
            if complexity < 3 and not issues:
                self.level = 'junior'
            else:
                self.level = 'beginner'
        else:
            # Larger code
            if complexity > 10:
                self.level = 'junior' # High complexity might be bad code, so strong junior at best unless well structured: logic is tricky. 
                # Actually high complexity usually means spagetti code for beginners, or complex algos for seniors.
                # Let's assume high complexity + issues = Beginner/Junior.
                pass
            
            if complexity < 5 and len(issues) < 2:
                self.level = 'strong_junior'
            if sloc > 200 and complexity < 8 and len(issues) == 0:
                self.level = 'middle'

    def _generate_feedback(self):
        feedback = f"### Detected Level: {self.level.upper()}\n\n"
        feedback += "**Metrics:**\n"
        feedback += f"- SLOC: {self.metrics['sloc']}\n"
        if 'complexity_avg' in self.metrics:
            feedback += f"- Avg Complexity: {self.metrics['complexity_avg']:.1f}\n"
        
        feedback += "\n**Recommendations:**\n"
        if not self.metrics['issues']:
            feedback += "- Good job! Code looks clean.\n"
        for issue in self.metrics['issues']:
            feedback += f"- {issue}\n"
            
        return feedback

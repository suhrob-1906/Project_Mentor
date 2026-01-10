import { Link } from 'react-router-dom';
import { Terminal, Code, Cpu, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Cpu className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        MentorAI
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-md shadow-indigo-200">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                <div className="container mx-auto px-6 relative text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        AI-Powered Career Growth
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                        Stop Guessing. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Know Your True Code Level.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Analyze your code, discover your real skill level, and get a personalized roadmap
                        to land your dream job or build your startup.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="group px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            Analyze My Code
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how-it-works" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center">
                            How it Works
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="how-it-works" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">How MentorAI Accelerates You</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Code className="w-8 h-8 text-blue-600" />,
                                title: "Deep Code Analysis",
                                desc: "Not a quiz. We statically analyze your actual code for complexity, style, and patterns to determine if you are Junior or Middle.",
                                color: "bg-blue-50"
                            },
                            {
                                icon: <Terminal className="w-8 h-8 text-purple-600" />,
                                title: "Tailored Roadmap",
                                desc: "Get a step-by-step learning plan based on your exact gaps. Don't waste time on tutorials you don't need.",
                                color: "bg-purple-50"
                            },
                            {
                                icon: <Cpu className="w-8 h-8 text-pink-600" />,
                                title: "Portfolio Ideas",
                                desc: "Generate 3-5 unique, business-value project ideas that solve real problems, not just another To-Do App.",
                                color: "bg-pink-50"
                            }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                                <div className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center mb-6`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

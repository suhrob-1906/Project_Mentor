import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Map, FolderGit2, Star, ArrowRight } from 'lucide-react';

export default function Results() {
    const { state } = useLocation();
    const data = state?.data;

    // Fallback if no data (e.g. direct access) - in real app, fetch from API
    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">No recent analysis found.</p>
                <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline">Go to Dashboard</Link>
            </div>
        );
    }

    const { level, feedback, roadmap, projects } = data;

    const levelColor = {
        'beginner': 'text-green-600 bg-green-50 border-green-200',
        'junior': 'text-blue-600 bg-blue-50 border-blue-200',
        'strong_junior': 'text-indigo-600 bg-indigo-50 border-indigo-200',
        'middle': 'text-purple-600 bg-purple-50 border-purple-200',
    }[level] || 'text-gray-600 bg-gray-50';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 mb-8">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/dashboard" className="font-bold text-xl text-gray-800">MentorAI</Link>
                    <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">New Analysis</Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">Your Current Level</p>
                    <div className={`inline-block px-6 py-2 rounded-full text-2xl font-black uppercase border ${levelColor} mb-6`}>
                        {level.replace('_', ' ')}
                    </div>
                    <div className="prose max-w-none text-gray-600 whitespace-pre-wrap text-left bg-gray-50 p-6 rounded-xl text-sm border border-gray-100">
                        {feedback}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Roadmap */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Map className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Your Personal Roadmap</h2>
                        </div>
                        <div className="space-y-4">
                            {roadmap.map((step, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{step.topic}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <FolderGit2 className="w-6 h-6 text-pink-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Recommended Projects</h2>
                        </div>
                        <div className="space-y-4">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                    <h3 className="font-bold text-gray-900 flex justify-between">
                                        {proj.title}
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-pink-600 transition" />
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2 mb-4">{proj.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {proj.tech_stack.map((tech, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Loader2, CheckCircle, Lock, Play, ChevronRight, Menu } from 'lucide-react';

export default function Course() {
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [checking, setChecking] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // We default to the user's track if no slug provided, but for now lets hardcode or fetch user profile
    // Simplification: We fetch the 'backend' course by default or maybe list all. 
    // Let's assume we want to show the 'backend' course for now.
    const courseSlug = 'backend';

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {
        try {
            // 1. Get Course Structure
            const resp = await api.get(`/mentor/courses/${courseSlug}/`);
            setCourse(resp.data);

            // 2. Find first unlocked lesson to activate
            // This logic should be smarter, but for now pick the first one.
            if (resp.data.modules.length > 0 && resp.data.modules[0].lessons.length > 0) {
                loadLesson(resp.data.modules[0].lessons[0].slug);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadLesson = async (slug) => {
        try {
            const resp = await api.get(`/mentor/lessons/${slug}/`);
            setActiveLesson(resp.data);
            setCode(resp.data.initial_code || '');
            setResult(null);
        } catch (err) {
            console.error(err);
        }
    };

    const checkSolution = async () => {
        if (!activeLesson) return;
        setChecking(true);
        try {
            const resp = await api.post(`/mentor/lessons/${activeLesson.slug}/check/`, { code });
            setResult(resp.data);
            if (resp.data.passed) {
                // Refresh course to update locks
                fetchCourse(); // This might be heavy, but ensures synchronization
            }
        } catch (err) {
            console.error(err);
            setResult({ error: "Failed to check solution" });
        } finally {
            setChecking(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-80' : 'w-0'}`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-black text-xl text-gray-800 tracking-tight truncate">{course?.title}</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {course?.modules.map((mod) => (
                        <div key={mod.id}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{mod.title}</h3>
                            <div className="space-y-1">
                                {mod.lessons.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => lesson.is_unlocked && loadLesson(lesson.slug)}
                                        disabled={!lesson.is_unlocked}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeLesson?.id === lesson.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : lesson.is_unlocked
                                                    ? 'hover:bg-gray-50 text-gray-600'
                                                    : 'opacity-50 cursor-not-allowed text-gray-400'
                                            }`}
                                    >
                                        {lesson.is_completed ? <CheckCircle className="w-4 h-4 text-green-500" /> : (
                                            lesson.is_unlocked ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />
                                        )}
                                        <span className="truncate text-left flex-1">{lesson.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">{activeLesson?.title}</h1>
                    </div>
                    <button
                        onClick={checkSolution}
                        disabled={checking}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Code"}
                        <Play className="w-4 h-4 fill-current" />
                    </button>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Theory Pane */}
                    <div className="w-1/2 p-8 overflow-y-auto bg-white border-r border-gray-200 prose prose-indigo max-w-none">
                        {/* We should verify if theory content is markdown or html. Assuming simple text or markdown rendered later */}
                        {activeLesson?.theory_content ? (
                            <div className="whitespace-pre-wrap font-medium text-gray-600 leading-relaxed">
                                {activeLesson.theory_content}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Select a lesson to start.</p>
                        )}

                        {activeLesson && (
                            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Practice Task
                                </h4>
                                <p className="text-indigo-800">{activeLesson.practice_task}</p>
                            </div>
                        )}

                        {/* Results Pane (Mobile convenient, but here inline) */}
                        {result && (
                            <div className={`mt-6 p-4 rounded-xl border-l-4 ${result.passed ? 'bg-green-50 border-green-500 text-green-800' : 'bg-rose-50 border-rose-500 text-rose-800'}`}>
                                <h4 className="font-bold mb-1">{result.passed ? "Success!" : "Not quite..."}</h4>
                                <p>{result.feedback}</p>
                            </div>
                        )}
                    </div>

                    {/* Code Editor Pane */}
                    <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                        <textarea
                            className="flex-1 bg-transparent text-gray-200 font-mono p-6 resize-none focus:outline-none text-sm leading-6"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Sparkles(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 3v4" />
            <path d="M7 5h4" />
            <path d="M3 7h4" />
        </svg>
    )
}

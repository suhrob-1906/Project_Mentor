import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Loader2, CheckCircle, Lock, Play, ChevronRight, Menu, ArrowLeft, X } from 'lucide-react';
import CourseMap from '../components/CourseMap';
import { useTranslation } from 'react-i18next';

export default function Course() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [checking, setChecking] = useState(false);

    // View Mode: 'map' or 'lesson'
    const [viewMode, setViewMode] = useState('map');

    // We fetch user profile to determine track, defaulting to 'backend'
    const [courseSlug, setCourseSlug] = useState(null);

    useEffect(() => {
        // Fetch profile
        api.get('/auth/profile/')
            .then(res => setCourseSlug(res.data.track || 'backend'))
            .catch(() => setCourseSlug('backend'));
    }, []);

    useEffect(() => {
        if (courseSlug) fetchCourse();
    }, [courseSlug]);

    const fetchCourse = async () => {
        try {
            // 1. Get Course Structure
            const resp = await api.get(`/api/courses/${courseSlug}/`);
            setCourse(resp.data);
            // Don't auto-load lesson in V2, show map first
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadLesson = async (slug) => {
        try {
            setLoading(true);
            const resp = await api.get(`/api/lessons/${slug}/`);
            setActiveLesson(resp.data);
            setCode(resp.data.initial_code || '');
            setResult(null);
            setViewMode('lesson');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeLesson = () => {
        setViewMode('map');
        fetchCourse(); // Refresh progress on exit
    };

    const checkSolution = async () => {
        if (!activeLesson) return;
        setChecking(true);
        try {
            const resp = await api.post(`/api/lessons/${activeLesson.slug}/check/`, { code });
            setResult(resp.data);
            if (resp.data.passed) {
                // We don't force refresh here, user will see update when they go back to map
            }
        } catch (err) {
            console.error(err);
            setResult({ error: "Failed to check solution" });
        } finally {
            setChecking(false);
        }
    };

    if (loading && !course) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    // MAP VIEW
    if (viewMode === 'map') {
        const toggleLang = () => {
            const newLang = i18n.language === 'ru' ? 'en' : 'ru';
            i18n.changeLanguage(newLang);
        };

        return (
            <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 group">
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-700" />
                    </button>

                    <div className="flex items-center gap-3 bg-gray-50 px-2 py-1.5 rounded-2xl border border-gray-100">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                            {courseSlug === 'backend' ? '🐍' : '🎨'}
                        </div>
                        <div className="flex flex-col pr-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Current</span>
                            <span className="text-sm font-black text-gray-800 tracking-tight leading-none">{course?.title || 'Loading...'}</span>
                        </div>
                    </div>

                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <span className="uppercase">{i18n.language || 'en'}</span>
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 relative">
                            {/* Simple flag representation */}
                            {i18n.language === 'ru'
                                ? <div className="w-full h-full bg-white flex flex-col"><div className="h-1/3 bg-white" /><div className="h-1/3 bg-blue-600" /><div className="h-1/3 bg-red-600" /></div>
                                : <div className="w-full h-full bg-blue-900 flex items-center justify-center relative"><div className="absolute inset-0 flex items-center justify-center text-[8px] text-white">🇬🇧</div></div>
                            }
                        </div>
                    </button>
                </nav>

                <div className="container mx-auto px-4 pb-20">
                    <CourseMap
                        course={course}
                        activeLesson={activeLesson}
                        onSelectLesson={loadLesson}
                    />
                </div>
            </div>
        );
    }

    // LESSON VIEW
    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans fixed inset-0 z-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
                <button onClick={closeLesson} className="p-2 hover:bg-gray-100 rounded-lg group">
                    <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                </button>

                <div className="flex-1 px-4">
                    <div className="h-2 w-full max-w-md mx-auto bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${result?.passed ? 'w-full bg-green-500' : 'w-[5%] bg-indigo-500'}`}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                        {activeLesson?.title}
                    </span>
                    <button
                        onClick={checkSolution}
                        disabled={checking}
                        className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 ${result?.passed
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                            }`}
                    >
                        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : result?.passed ? "Continue" : "Run Code"}
                    </button>
                    {result?.passed && (
                        <button onClick={closeLesson} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl ml-2 text-gray-600 font-bold">
                            Next
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Theory Pane */}
                <div className="w-1/2 p-8 overflow-y-auto bg-white border-r border-gray-200 prose prose-indigo max-w-none">
                    {activeLesson?.theory_content && (
                        <div className="whitespace-pre-wrap font-medium text-gray-600 leading-relaxed text-lg">
                            {activeLesson.theory_content}
                        </div>
                    )}

                    {activeLesson && (
                        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Practice Task
                            </h4>
                            <p className="text-indigo-800 font-medium">{activeLesson.practice_task}</p>
                        </div>
                    )}

                    {result && (
                        <div className={`mt-6 p-6 rounded-2xl border-2 animate-in zoom-in-95 duration-300 ${result.passed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                            <h4 className="font-black text-xl mb-2 flex items-center gap-2">
                                {result.passed ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                {result.passed ? "Nicely Done!" : "Oops!"}
                            </h4>
                            <p className="font-medium text-lg">{result.feedback}</p>
                        </div>
                    )}

                    <div className="h-20" /> {/* Bottom spacer */}
                </div>

                {/* Code Editor Pane */}
                <div className="w-1/2 flex flex-col bg-[#1e1e1e] relative">
                    <div className="absolute top-0 left-0 right-0 bg-[#2d2d2d] px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-xs text-gray-500 font-mono ml-2">editor.py</span>
                    </div>
                    <textarea
                        className="flex-1 bg-transparent text-gray-200 font-mono p-6 pt-12 resize-none focus:outline-none text-base leading-7"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    ></textarea>
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

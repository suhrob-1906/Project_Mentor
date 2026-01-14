import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Loader2, CheckCircle, Lock, Play, ChevronRight, Menu, ArrowLeft, X, Bot } from 'lucide-react';
import CourseMap from '../components/CourseMap';
import { useTranslation } from 'react-i18next';

export default function Course() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);
    const [checking, setChecking] = useState(false);

    // Mentor State
    const [mentorOpen, setMentorOpen] = useState(false);
    const [mentorMessages, setMentorMessages] = useState([{ role: 'ai', text: 'Hi! I am your AI Mentor. Stuck? Ask for a hint!' }]);
    const [aiLoading, setAiLoading] = useState(false);

    const requestAiHint = async () => {
        setAiLoading(true);
        try {
            const resp = await api.post(`/api/lessons/${activeLesson.slug}/hint/`, { code });
            setMentorMessages(prev => [...prev, { role: 'user', text: 'Hint please!' }, { role: 'ai', text: resp.data.hint }]);
        } catch (err) {
            console.error("Hint error:", err);
            setMentorMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I cannot connect right now.' }]);
        } finally {
            setAiLoading(false);
        }
    };

    const requestAiExplanation = async (errorMsg = '') => {
        setAiLoading(true);
        try {
            const resp = await api.post(`/api/lessons/${activeLesson.slug}/explain/`, { code, error: errorMsg });
            setMentorMessages(prev => [...prev, { role: 'user', text: errorMsg ? 'Explain this error' : 'Explain needed' }, { role: 'ai', text: resp.data.explanation }]);
            if (!mentorOpen) setMentorOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

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

    const fetchCourse = useCallback(async () => {
        try {
            // 1. Get Course Structure
            const resp = await api.get(`/api/courses/${courseSlug}/`);
            setCourse(resp.data);
            // Don't auto-load lesson in V2, show map first
        } catch (err) {
            console.error("Failed to fetch course:", err);
        } finally {
            setLoading(false);
        }
    }, [courseSlug]);

    useEffect(() => {
        if (courseSlug) fetchCourse();
    }, [courseSlug, fetchCourse]);

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

    // Helper to render content with code blocks
    const renderContent = (text) => {
        if (!text) return null;

        // Split by code blocks ```
        const parts = text.split(/```/);

        return parts.map((part, index) => {
            if (index % 2 === 1) {
                // Code block
                // Determine language (first line)
                const lines = part.trim().split('\n');
                const lang = lines[0].trim();
                const codeContent = lines.slice(1).join('\n');

                return (
                    <div key={index} className="my-6 relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed">
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <span className="text-xs font-bold text-gray-400 uppercase">{lang || 'code'}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(codeContent)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="p-4 whitespace-pre overflow-x-auto">
                            {codeContent}
                        </div>
                    </div>
                );
            } else {
                // Normal text - rudimentary markdown
                return (
                    <div key={index} className="whitespace-pre-wrap font-medium text-gray-600 leading-relaxed text-lg mb-4">
                        {part.split('\n').map((line, i) => {
                            // Headers
                            if (line.startsWith('# ')) return <h3 key={i} className="text-2xl font-black text-gray-800 mt-6 mb-3">{line.replace('# ', '')}</h3>;
                            if (line.startsWith('## ')) return <h4 key={i} className="text-xl font-bold text-gray-800 mt-5 mb-2">{line.replace('## ', '')}</h4>;
                            // List items
                            if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                            return <p key={i} className="mb-2">{line}</p>;
                        })}
                    </div>
                );
            }
        });
    };

    // Bilingual content selection
    const currentLanguage = i18n.language || 'en';
    const content = currentLanguage === 'ru' ? (activeLesson?.content_ru || activeLesson?.content_en) : activeLesson?.content_en;
    const title = currentLanguage === 'ru' ? (activeLesson?.title_ru || activeLesson?.title_en) : activeLesson?.title_en;

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
                        {title}
                    </span>

                    {/* Mentor Button */}
                    <button
                        onClick={() => setMentorOpen(!mentorOpen)}
                        className="mr-2 flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold text-xs transition-colors"
                    >
                        <Bot className="w-4 h-4" />
                        AI Mentor
                    </button>

                    <button
                        onClick={checkSolution}
                        disabled={checking}
                        className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 ${result?.passed
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                            }`}
                    >
                        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : result?.passed ? "Continue" : (activeLesson?.lesson_type === 'theory' ? "I Understood" : "Run Code")}
                    </button>
                    {result?.passed && (
                        <button onClick={closeLesson} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl ml-2 text-gray-600 font-bold">
                            Next
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Theory/Task Pane */}
                <div className={`${activeLesson?.lesson_type === 'theory' ? 'w-full max-w-3xl mx-auto' : 'w-1/2 border-r border-gray-200'} p-8 overflow-y-auto bg-white prose prose-indigo max-w-none`}>

                    <h2 className="text-3xl font-black text-gray-800 mb-6">{title}</h2>

                    {/* Content Renderer */}
                    {renderContent(content)}

                    {activeLesson?.lesson_type === 'practice' && (
                        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Your Mission
                            </h4>
                            <p className="text-indigo-800 font-medium">{content}</p>
                        </div>
                    )}

                    {result && (
                        <div className={`mt-6 p-6 rounded-2xl border-2 animate-in zoom-in-95 duration-300 ${result.passed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                            <h4 className="font-black text-xl mb-2 flex items-center gap-2">
                                {result.passed ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                {result.passed ? "Nicely Done!" : "Oops!"}
                            </h4>
                            <p className="font-medium text-lg">{result.feedback}</p>

                            {/* AI Error Explanation Hook */}
                            {!result.passed && (
                                <button
                                    onClick={() => requestAiExplanation(result.feedback)}
                                    className="mt-3 text-sm font-bold underline flex items-center gap-1 hover:text-rose-900"
                                >
                                    <Bot className="w-3 h-3" /> Explain this error
                                </button>
                            )}
                        </div>
                    )}

                    <div className="h-20" /> {/* Bottom spacer */}
                </div>

                {/* Code Editor Pane (Only for Practice or Theory with Copy) */}
                {activeLesson?.lesson_type === 'practice' && (
                    <div className="w-1/2 flex flex-col bg-[#1e1e1e] relative border-l border-gray-800">
                        <div className="absolute top-0 left-0 right-0 bg-[#2d2d2d] px-4 py-2 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="text-xs text-gray-500 font-mono ml-2">solution.py</span>
                        </div>
                        <textarea
                            className="flex-1 bg-transparent text-gray-200 font-mono p-6 pt-12 resize-none focus:outline-none text-base leading-7"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            placeholder="# Write your solution here..."
                        ></textarea>
                    </div>
                )}

                {/* Mentor AI Chat Overlay */}
                {mentorOpen && (
                    <div className="absolute bottom-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 z-50">
                        <div className="bg-purple-600 p-3 flex justify-between items-center text-white">
                            <span className="font-bold flex items-center gap-2"><Bot className="w-4 h-4" /> Mentor AI</span>
                            <button onClick={() => setMentorOpen(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto bg-gray-50 text-sm space-y-3">
                            {mentorMessages.map((msg, idx) => (
                                <div key={idx} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-purple-100 ml-8 text-purple-900' : 'bg-white border border-gray-200 mr-8 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {aiLoading && <div className="text-xs text-gray-400 animate-pulse">Thinking...</div>}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <button onClick={() => requestAiHint()} className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold py-2 rounded-lg">
                                Give Hint
                            </button>
                            <button onClick={() => requestAiExplanation()} className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold py-2 rounded-lg">
                                Explain
                            </button>
                        </div>
                    </div>
                )}
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

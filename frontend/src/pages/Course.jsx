import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Check, ArrowLeft, BookOpen, Code2,
    Play, ChevronRight, Award,
    Terminal, Zap, Sparkles, Brain, Flag, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import CourseMap from '../components/CourseMap';
import MentorChat from '../components/MentorChat';

export default function Course({ isChild }) {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    const fetchCourse = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/courses/${slug}/`);
            setCourse(res.data);

            const allLessons = res.data.modules.flatMap(m => m.lessons);
            const firstIncomplete = allLessons.find(l => !l.is_completed && l.is_unlocked) || allLessons[0];

            if (firstIncomplete) {
                const lessonRes = await api.get(`/api/lessons/${firstIncomplete.slug}/`);
                setActiveLesson(lessonRes.data);
                setUserCode(lessonRes.data.initial_code || '');
            }
        } catch (err) {
            console.error("Course fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleSelectLesson = async (lessonSlug) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/lessons/${lessonSlug}/`);
            setActiveLesson(res.data);
            setUserCode(res.data.initial_code || '');
            setOutput('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Lesson fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunCode = async () => {
        setIsVerifying(true);
        setOutput("Running...");
        try {
            const res = await api.post(`/api/lessons/${activeLesson.slug}/verify/`, {
                code: userCode
            });
            setOutput(res.data.output || (res.data.passed ? "Success!" : "Failed."));

            if (res.data.passed) {
                const courseRes = await api.get(`/api/courses/${slug}/`);
                setCourse(courseRes.data);
                setActiveLesson(prev => ({ ...prev, is_completed: true }));
            }
        } catch (err) {
            setOutput(`Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleMarkUnderstood = async () => {
        setIsVerifying(true);
        try {
            await api.post(`/api/lessons/complete/`, {
                lesson_slug: activeLesson.slug
            });
            const courseRes = await api.get(`/api/courses/${slug}/`);
            setCourse(courseRes.data);
            setActiveLesson(prev => ({ ...prev, is_completed: true }));
        } catch (err) {
            console.error("Failed to complete lesson", err);
        } finally {
            setIsVerifying(false);
        }
    };

    const isRu = (i18n.language || 'en').startsWith('ru');

    if (isLoading && !course) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className={`p-8 rounded-3xl animate-pulse flex flex-col items-center gap-4 ${isChild ? 'bg-yellow-400' : 'bg-white shadow-xl'}`}>
                <Brain className="w-12 h-12 text-indigo-600 animate-bounce" />
                <span className="font-black uppercase tracking-widest text-indigo-900">Loading Adventure...</span>
            </div>
        </div>
    );

    if (!course) return <div>Course not found</div>;

    const title = isRu ? activeLesson?.title_ru : activeLesson?.title_en;
    const content = isRu ? activeLesson?.content_ru : activeLesson?.content_en;

    const renderContent = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <p key={i} className="mb-4 text-gray-700 leading-relaxed font-medium">
                {line}
            </p>
        ));
    };

    return (
        <div className={`min-h-screen ${isChild ? "bg-yellow-400 font-['Outfit'] space-pattern" : "bg-gray-50 font-sans"}`}>
            <nav className={`sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${isChild ? 'bg-white border-b-4 border-black' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${isChild ? 'bg-black text-white px-4 py-2 rounded-xl hover:scale-105' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('common.back', 'Back')}
                    </button>

                    <div className="flex items-center gap-3">
                        {activeLesson && (
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${activeLesson.lesson_type === 'theory' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-purple-50 border-purple-100 text-purple-500'}`}>
                                {activeLesson.lesson_type}
                            </div>
                        )}
                        {activeLesson?.is_completed && (
                            <div className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[4]" />
                                {isRu ? "Пройдено!" : "Passed!"}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
                    {!activeLesson ? (
                        <div className={`rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[600px] border-4 ${isChild ? 'bg-white border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-gray-50 shadow-2xl'}`}>
                            <CourseMap course={course} onSelectLesson={handleSelectLesson} activeLesson={activeLesson} />
                        </div>
                    ) : (
                        <div className={`rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 ${isChild ? 'bg-white border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-gray-50 shadow-2xl'}`}>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${activeLesson.lesson_type === 'theory' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'}`}>
                                        {activeLesson.lesson_type === 'theory' ? <BookOpen className="w-7 h-7" /> : <Code2 className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <h1 className={`text-2xl font-black tracking-tight ${isChild ? 'text-black' : 'text-gray-900'}`}>{title}</h1>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                                            {slug.toUpperCase()} • {activeLesson.lesson_type.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-1 w-20 bg-indigo-100 rounded-full mb-8"></div>
                                <div className="prose prose-indigo max-w-none mb-10">
                                    {renderContent(content)}
                                </div>

                                {activeLesson.lesson_type === 'practice' && (
                                    <details className={`rounded-2xl p-5 border-2 transition-all group mb-8 ${isChild ? 'bg-indigo-50 border-black' : 'bg-gray-50 border-gray-100'}`}>
                                        <summary className="font-black text-xs uppercase tracking-widest text-gray-500 cursor-pointer list-none flex items-center gap-2 select-none">
                                            <Brain className="w-4 h-4 text-indigo-500" />
                                            {isRu ? "Вспомнить теорию" : "QUICK THEORY RECAP"}
                                            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform ml-auto" />
                                        </summary>
                                        <div className="mt-6 text-sm border-t border-indigo-100/50 pt-4">
                                            {renderContent(isRu ? activeLesson?.theory_ref_ru : activeLesson?.theory_ref_en)}
                                        </div>
                                    </details>
                                )}

                                <div className={`flex items-center justify-between`}>
                                    {activeLesson.lesson_type === 'practice' ? (
                                        <button
                                            onClick={handleRunCode}
                                            disabled={isVerifying}
                                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${isChild ? 'bg-black text-white hover:bg-gray-800' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-200'}`}
                                        >
                                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                            {isRu ? "Запустить код" : "Run My Code"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleMarkUnderstood}
                                            disabled={isVerifying || activeLesson.is_completed}
                                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${isChild ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 active:border-b-0 hover:bg-emerald-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-200'} ${activeLesson.is_completed ? 'opacity-50 grayscale' : ''}`}
                                        >
                                            {activeLesson.is_completed ? <Check className="w-5 h-5 stroke-[4]" /> : <Zap className="w-5 h-5 fill-current" />}
                                            {activeLesson.is_completed ? (isRu ? "Понятно!" : "Understood!") : (isRu ? "Я понял!" : "I Understood!")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2 sticky top-[100px] h-fit">
                    <div className={`rounded-3xl border-4 overflow-hidden relative ${isChild ? 'bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-gray-50 shadow-xl'} h-[200px] lg:h-[300px]`}>
                        <div className="absolute inset-0 overflow-auto scrollbar-hide scale-75 origin-top">
                            <CourseMap course={course} onSelectLesson={handleSelectLesson} activeLesson={activeLesson} isCompact={true} />
                        </div>
                    </div>

                    {activeLesson?.lesson_type === 'practice' && (
                        <div className={`rounded-3xl border-4 overflow-hidden flex flex-col transition-all duration-500 ${isChild ? 'bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#1e1e1e] border-gray-900 shadow-2xl'} min-h-[400px]`}>
                            <div className={`flex items-center justify-between px-6 py-3 ${isChild ? 'bg-gray-100 border-b-2 border-black' : 'bg-gray-800'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ml-2 ${isChild ? 'text-black' : 'text-gray-400'}`}>main.{slug === 'python' ? 'py' : 'js'}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <Editor
                                    height="300px"
                                    defaultLanguage={slug}
                                    theme={isChild ? "light" : "vs-dark"}
                                    value={userCode}
                                    onChange={setUserCode}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        padding: { top: 20 },
                                        scrollBeyondLastLine: false,
                                        fontFamily: "'Fira Code', monospace"
                                    }}
                                />
                            </div>
                            {output && (
                                <div className={`p-6 border-t-2 ${isChild ? 'bg-indigo-50 border-black' : 'bg-black/50 border-gray-800'}`}>
                                    <pre className={`text-xs font-mono break-words whitespace-pre-wrap ${isChild ? 'text-indigo-900' : 'text-emerald-400'}`}>{output}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </main>

            {activeLesson && (
                <MentorChat lessonSlug={activeLesson.slug} userCode={userCode} isChild={isChild} />
            )}
        </div>
    );
}

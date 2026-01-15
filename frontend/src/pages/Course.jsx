import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Check, ArrowLeft, BookOpen, Code2,
    Play, ChevronRight, Award, Zap, Sparkles, Brain, Flag, Loader2, Languages, Map
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
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);
    const [repeatCodeInput, setRepeatCodeInput] = useState('');
    const [stepError, setStepError] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [solutionVisible, setSolutionVisible] = useState(false);

    const fetchCourse = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/courses/${slug}/`);
            setCourse(res.data);
            // Don't auto-select lesson, show map first
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
            setActiveStepIndex(0);
            setActiveTaskIndex(0);
            setRepeatCodeInput('');
            setStepError(false);
            setUserCode(res.data.practice_tasks?.[0]?.initial_code || res.data.initial_code || '');
            setOutput('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Lesson fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToMap = () => {
        setActiveLesson(null);
        fetchCourse(); // Refresh progress
    };

    const handleNextStep = () => {
        if (!activeLesson.theory_steps || activeLesson.theory_steps.length === 0) {
            handleMarkUnderstood();
            return;
        }

        const currentStep = activeLesson.theory_steps[activeStepIndex];
        if (currentStep?.code_to_repeat && repeatCodeInput.trim() !== currentStep.code_to_repeat.trim()) {
            setStepError(true);
            return;
        }
        setStepError(false);
        setRepeatCodeInput('');
        if (activeStepIndex < activeLesson.theory_steps.length - 1) {
            setActiveStepIndex(prev => prev + 1);
        } else {
            handleMarkUnderstood();
        }
    };

    const handleRunCode = async () => {
        setIsVerifying(true);
        setOutput("Running...");
        try {
            const res = await api.post(`/api/lessons/${activeLesson.slug}/check/`, {
                code: userCode,
                task_index: activeTaskIndex
            });
            setOutput(res.data.output || res.data.feedback || (res.data.passed ? "Check passed! ✅" : "Failed. Check your logic. ❌"));

            if (res.data.passed) {
                setFailedAttempts(0);
                setSolutionVisible(false);
                if (activeTaskIndex < activeLesson.practice_tasks.length - 1) {
                    setActiveTaskIndex(prev => prev + 1);
                    setUserCode(activeLesson.practice_tasks[activeTaskIndex + 1].initial_code || '');
                } else {
                    await handleMarkUnderstood(true); // Helper to complete without closing
                }
            } else {
                setFailedAttempts(prev => prev + 1);
            }
        } catch (err) {
            setOutput(`Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleMarkUnderstood = async (stayInLesson = false) => {
        setIsVerifying(true);
        try {
            await api.post(`/api/lessons/complete/`, {
                lesson_slug: activeLesson.slug
            });
            const courseRes = await api.get(`/api/courses/${slug}/`);
            setCourse(courseRes.data);
            setActiveLesson(prev => ({ ...prev, is_completed: true }));
            if (!stayInLesson) {
                handleBackToMap();
            }
        } catch (err) {
            console.error("Failed to complete lesson", err);
        } finally {
            setIsVerifying(false);
        }
    };

    const isRu = (i18n.language || 'en').startsWith('ru');

    if (isLoading && !course && !activeLesson) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
    );

    if (!course) return <div>Course not found</div>;

    // Calculate Verification Progress
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.is_completed).length, 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // --- RENDER MAP VIEW ---
    if (!activeLesson) {
        return (
            <div className={`min-h-screen ${isChild ? "bg-yellow-400 font-['Outfit'] space-pattern" : "bg-gray-50 font-sans"}`}>
                <nav className={`sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${isChild ? 'bg-white border-b-4 border-black' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xl text-gray-900">
                            {isRu ? 'Наставник' : 'MentorAI'}
                        </div>

                        {/* Global Progress Bar in Navbar */}
                        <div className="hidden md:flex flex-col w-1/3 mx-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-widest">
                                <span>{isRu ? 'Прогресс курса' : 'Course Progress'}</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-100"
                            >
                                <Languages className="w-3 h-3" /> {i18n.language.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="max-w-4xl mx-auto py-10 px-4">
                    <CourseMap course={course} onSelectLesson={handleSelectLesson} />
                </div>
            </div>
        );
    }

    // --- RENDER LESSON VIEW ---
    const title = isRu ? activeLesson?.title_ru : activeLesson?.title_en;
    const content = isRu ? activeLesson?.content_ru : activeLesson?.content_en;

    const renderContent = (text) => text ? text.split('\n').map((line, i) => (
        <p key={i} className="mb-4 text-gray-700 leading-relaxed font-medium text-lg">{line}</p>
    )) : null;

    return (
        <div className={`min-h-screen ${isChild ? "bg-yellow-400 font-['Outfit']" : "bg-gray-50 font-sans"}`}>
            {/* Lesson Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={handleBackToMap} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="font-black text-xs uppercase tracking-widest text-gray-500">Map</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {activeLesson?.is_completed && (
                            <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[4]" /> Passed
                            </div>
                        )}
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{
                                    width: activeLesson.lesson_type === 'theory'
                                        ? `${(activeStepIndex / (activeLesson.theory_steps?.length || 1)) * 100}%`
                                        : `${(activeTaskIndex / (activeLesson.practice_tasks?.length || 1)) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-80px)]">

                {/* Left Panel: Content */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                    <div className="bg-white p-8 rounded-[2rem] border-4 border-gray-100 shadow-xl">
                        <h1 className="text-3xl font-black text-gray-900 mb-6">{title}</h1>

                        {activeLesson.lesson_type === 'theory' ? (
                            <div className="prose prose-lg max-w-none">
                                {activeLesson.theory_steps?.length > 0 ? (
                                    <>
                                        {renderContent(isRu ? activeLesson.theory_steps[activeStepIndex]?.text_ru : activeLesson.theory_steps[activeStepIndex]?.text_en)}
                                        {activeLesson.theory_steps[activeStepIndex]?.code_to_repeat && (
                                            <div className="mt-6 p-6 bg-gray-900 rounded-2xl border-4 border-gray-800">
                                                <code className="block font-mono text-emerald-400 mb-4">{activeLesson.theory_steps[activeStepIndex].code_to_repeat}</code>
                                                <input
                                                    value={repeatCodeInput}
                                                    onChange={(e) => { setRepeatCodeInput(e.target.value); setStepError(false); }}
                                                    className={`w-full bg-black/50 text-white p-4 rounded-xl font-mono text-sm border-2 focus:outline-none ${stepError ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'}`}
                                                    placeholder="Type the code above..."
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : renderContent(content)}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">{isRu ? activeLesson.practice_tasks[activeTaskIndex]?.title_ru : activeLesson.practice_tasks[activeTaskIndex]?.title_en}</h2>
                                <div className="prose prose-purple">
                                    {renderContent(isRu ? activeLesson.practice_tasks[activeTaskIndex]?.desc_ru : activeLesson.practice_tasks[activeTaskIndex]?.desc_en)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button Area */}
                    <div className="sticky bottom-4 z-10">
                        {activeLesson.lesson_type === 'theory' ? (
                            <button
                                onClick={handleNextStep}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-200 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                {isRu ? "Далее" : "Next Step"} <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRunCode}
                                    disabled={isVerifying}
                                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-200 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {isVerifying ? <Loader2 className="animate-spin" /> : <Play className="fill-current w-5 h-5" />}
                                    Run Code
                                </button>
                                {failedAttempts >= 2 && (
                                    <button
                                        onClick={() => setSolutionVisible(!solutionVisible)}
                                        className="px-4 bg-amber-100 text-amber-600 rounded-2xl font-bold border-b-4 border-amber-300 active:border-b-0 active:translate-y-1"
                                    >
                                        <Zap className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        )}

                        {activeLesson.lesson_type === 'practice' && solutionVisible && (
                            <div className="mt-4 p-4 bg-gray-900 rounded-2xl border-b-4 border-black animate-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-xs font-bold uppercase">Solution</span>
                                    <button onClick={() => setUserCode(activeLesson.practice_tasks[activeTaskIndex]?.solution_code)} className="text-orange-400 text-xs font-bold hover:underline">Copy</button>
                                </div>
                                <pre className="text-emerald-400 font-mono text-xs overflow-x-auto">
                                    {activeLesson.practice_tasks[activeTaskIndex]?.solution_code}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor (only for Practice) or Visuals */}
                <div className="flex flex-col h-full overflow-hidden rounded-[2rem] border-4 border-gray-900 shadow-2xl bg-[#1e1e1e]">
                    {activeLesson.lesson_type === 'practice' ? (
                        <>
                            <div className="bg-[#2d2d2d] px-6 py-3 flex items-center justify-between border-b border-gray-800">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-gray-500 text-xs font-mono">main.{slug === 'backend' ? 'py' : 'js'}</span>
                            </div>
                            <div className="flex-1 relative">
                                <Editor
                                    height="100%"
                                    defaultLanguage={slug === 'backend' ? 'python' : 'javascript'}
                                    theme="vs-dark"
                                    value={userCode}
                                    onChange={setUserCode}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 16,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        padding: { top: 20 },
                                    }}
                                />
                            </div>
                            <div className={`h-1/3 border-t border-gray-700 bg-black p-4 font-mono text-sm overflow-auto ${output.includes('✅') ? 'text-emerald-400' : 'text-gray-300'}`}>
                                <div className="uppercase text-[10px] text-gray-500 mb-2 tracking-widest border-b border-gray-800 pb-1">Console Output</div>
                                {output || "Ready to run..."}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-indigo-900/5 text-center p-10">
                            <div className="max-w-xs space-y-4 opacity-50">
                                <Brain className="w-24 h-24 text-indigo-200 mx-auto" />
                                <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Focus Mode Active</p>
                            </div>
                        </div>
                    )}
                </div>

            </main>

            <MentorChat lessonSlug={activeLesson.slug} userCode={userCode} isChild={isChild} />
        </div>
    );
}

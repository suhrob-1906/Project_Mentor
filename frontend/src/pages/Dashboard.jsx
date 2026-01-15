import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import {
    BookOpen, Languages, Rocket,
    Lock, Star, Award, Zap, AlertCircle, Trophy,
    ChevronRight
} from 'lucide-react';

export default function Dashboard({ isChild }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [userTrack, setUserTrack] = useState(null); // 'backend' or 'frontend'
    const [courseSlug, setCourseSlug] = useState(null); // 'python' or 'javascript'
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState({ unlocked: [], completed: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile to get their track
    useEffect(() => {
        const fetchUserTrack = async () => {
            try {
                const res = await api.get('/auth/profile/');
                const track = res.data.track || 'backend';
                setUserTrack(track);
                // Map track to course slug
                setCourseSlug(track === 'backend' ? 'python' : 'javascript');
            } catch (err) {
                console.error("Failed to fetch user track:", err);
                // Default to backend/python
                setUserTrack('backend');
                setCourseSlug('python');
            }
        };
        fetchUserTrack();
    }, []);

    const fetchData = useCallback(async () => {
        if (!courseSlug) return;

        setIsLoading(true);
        setError(null);
        try {
            const courseRes = await api.get(`/api/courses/${courseSlug}/`);
            setModules(courseRes.data.modules.map(m => ({
                id: m.slug || m.id,
                name: (i18n.language || 'en').startsWith('ru') ? m.title_ru : m.title_en,
                icon: <BookOpen className="w-6 h-6" />,
                color: courseSlug === 'python' ? 'indigo' : 'purple'
            })));

            const progRes = await api.get(`/api/progress/?language=${courseSlug}`);
            setProgress(progRes.data);
        } catch (err) {
            console.error("Data fetch error:", err);
            setError(err.response?.status === 404 ? 'empty_database' : 'fetch_error');
            setModules([]);
        } finally {
            setIsLoading(false);
        }
    }, [courseSlug, i18n.language]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleLanguageUI = () => {
        const currentLang = i18n.language || 'en';
        const newLang = currentLang.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(newLang);
    };

    const isRu = (i18n.language || 'en').startsWith('ru');

    return (
        <div className={`min-h-screen ${isChild ? 'bg-yellow-400 font-["Outfit"]' : 'bg-white font-sans'}`}>
            {/* Header */}
            <nav className={`px-8 py-4 sticky top-0 z-50 transition-all ${isChild ? 'bg-white border-b-8 border-black shadow-[0_8px_0_0_rgba(0,0,0,1)]' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className={`p-2 rounded-2xl rotate-3 transition-transform group-hover:rotate-12 ${isChild ? 'bg-black' : 'bg-indigo-600'}`}>
                            <Rocket className={`w-8 h-8 ${isChild ? 'text-yellow-400' : 'text-white'}`} />
                        </div>
                        <span className={`font-black text-2xl tracking-tighter uppercase ${isChild ? 'text-black' : 'text-gray-900'}`}>
                            {isRu ? "НАСТАВНИК" : "MentorAI"}
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/homework', { state: { language: courseSlug || 'python' } })}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-4 border-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                            {isRu ? "ЛАБОРАТОРИЯ ДЗ" : "HOMEWORK LAB"}
                        </button>

                        <button
                            onClick={() => navigate('/chat')}
                            className={`hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${isChild ? 'bg-black text-yellow-300 border-black hover:scale-105' : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'}`}
                        >
                            <Languages className="w-4 h-4" />
                            {isRu ? "ЧАТ С ИИ" : "AI CHAT"}
                        </button>

                        <button
                            onClick={toggleLanguageUI}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black transition-all ${isChild ? 'bg-black text-white hover:scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <Languages className="w-4 h-4" />
                            {(i18n.language || 'en').toUpperCase()}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Content Area */}
                <div className="flex flex-col gap-8">

                    {/* Course Title Header */}
                    <div className="text-center mb-8">
                        <h2 className={`font-black text-4xl mb-2 ${isChild ? 'text-black' : 'text-gray-900'}`}>
                            {userTrack === 'backend'
                                ? (isRu ? 'Python Путь' : 'Python Path')
                                : (isRu ? 'Frontend Путь' : 'Frontend Path')
                            }
                        </h2>
                        <p className="text-gray-500 font-bold text-sm">
                            {userTrack === 'backend'
                                ? (isRu ? 'Бэкенд разработка с Python' : 'Backend Development with Python')
                                : (isRu ? 'Фронтенд разработка с HTML/CSS/JS' : 'Frontend Development with HTML/CSS/JS')
                            }
                        </p>
                    </div>

                    {/* Main Course Map (Full Width) */}
                    <div className={`w-full max-w-4xl mx-auto p-8 rounded-[2.5rem] border-4 border-black relative overflow-hidden min-h-[600px] flex flex-col items-center
                        ${isChild ? 'bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]' : 'bg-white shadow-2xl shadow-indigo-100'}`}>

                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4 m-auto">
                                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                <span className="font-black uppercase tracking-widest text-sm text-gray-400">Loading Journey...</span>
                            </div>
                        ) : error === 'empty_database' ? (
                            <div className="text-center max-w-md px-10 m-auto">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-200">
                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                </div>
                                <h3 className="font-black text-3xl text-gray-900 mb-4 uppercase leading-tight">
                                    {isRu ? "Мир пустоват..." : "It's empty here..."}
                                </h3>
                                <p className="text-gray-500 font-bold mb-8 text-sm leading-relaxed">
                                    {isRu
                                        ? "База данных еще не заполнена. Сделайте Push, чтобы запустить авто-наполнение!"
                                        : "Database is empty. Push your code to trigger auto-population!"}
                                </p>
                                <button
                                    onClick={fetchData}
                                    className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                >
                                    {isRu ? "Обновить" : "Refresh"}
                                </button>
                            </div>
                        ) : modules.length > 0 ? (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-12 px-4">
                                    <div>
                                        <h4 className="font-black text-3xl uppercase tracking-tighter mb-2">
                                            {courseSlug === 'python' ? 'Python Journey' : 'Frontend Journey'}
                                        </h4>
                                        <p className="font-bold text-gray-400 text-xs tracking-widest uppercase">
                                            {progress.unlocked.length} / {modules.length} Levels Unlocked
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-black text-xs border-2 border-yellow-200">
                                        <Trophy className="w-4 h-4" />
                                        <span>{Object.values(progress.completed).filter(v => v >= 100).length} COMPLETED</span>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-2xl mx-auto relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[2.85rem] top-8 bottom-8 w-1 bg-gray-200 -z-10"></div>

                                    {modules.map((mod, idx) => {
                                        const isUnlocked = progress.unlocked.includes(mod.id);
                                        const isCompleted = (progress.completed[mod.id] || 0) >= 100;

                                        return (
                                            <div
                                                key={mod.id}
                                                onClick={() => isUnlocked && navigate(`/courses/${courseSlug}`)}
                                                className={`group flex items-center gap-6 p-4 rounded-3xl transition-all relative
                                                    ${isUnlocked
                                                        ? 'cursor-pointer hover:bg-gray-50'
                                                        : 'opacity-50 grayscale cursor-not-allowed'}`}
                                            >
                                                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl border-b-8 transition-transform group-hover:scale-110 group-active:scale-95 group-active:border-b-0 group-active:translate-y-2
                                                    ${isCompleted
                                                        ? 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-xl'
                                                        : isUnlocked
                                                            ? `bg-${mod.color}-500 border-${mod.color}-700 text-white shadow-xl`
                                                            : 'bg-gray-200 border-gray-300 text-gray-400'
                                                    }`}
                                                >
                                                    {isCompleted ? <Star className="w-8 h-8 fill-current" /> : (idx + 1)}

                                                    {/* Floating Stars for completed */}
                                                    {isCompleted && (
                                                        <div className="absolute -top-2 -right-2 bg-white border-2 border-yellow-400 text-yellow-500 rounded-full p-1 animate-bounce">
                                                            <Award className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`flex-1 p-6 rounded-2xl border-b-4 transition-all
                                                    ${isUnlocked
                                                        ? `bg-white border-gray-200 group-hover:border-${mod.color}-300 shadow-sm`
                                                        : 'bg-transparent border-transparent'}`}>
                                                    <h5 className={`font-black text-lg mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {mod.name}
                                                    </h5>
                                                    {isUnlocked && (
                                                        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full bg-${mod.color}-500 transition-all duration-1000`}
                                                                style={{ width: `${progress.completed[mod.id] || 0}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-40 m-auto">
                                <Rocket className="w-20 h-20 mx-auto mb-6 text-gray-300 animate-float" />
                                <p className="font-black uppercase tracking-widest text-sm">Loading your course...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Floating Character for Wow Effect */}
            <div className="fixed bottom-10 left-10 hidden xl:block animate-float">
                <div className="relative">
                    <div className="w-24 h-24 bg-indigo-500 rounded-full border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-4xl">
                        🦊
                    </div>
                    <div className="absolute -top-12 -right-32 bg-white border-2 border-black p-3 rounded-2xl shadow-lg">
                        <p className="text-[10px] font-black uppercase text-black leading-tight">
                            {isRu ? "Готов кодить?" : "Ready to code?"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import {
    Code2, Terminal, Cpu, Globe, ArrowRight,
    BookOpen, Sparkles, Languages, Check, Code, Rocket,
    Lock, Star, Play, Award, Zap, AlertCircle, Clock, Shield
} from 'lucide-react';

export default function Dashboard({ isChild }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [progress, setProgress] = useState({ unlocked: ['basics'], completed: {} });
    const [isLoading, setIsLoading] = useState(true);

    const languages = [
        { id: 'python', name: 'Python', icon: <Terminal className="w-6 h-6" />, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
        { id: 'javascript', name: 'JavaScript', icon: <Code className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { id: 'go', name: 'Go', icon: <Cpu className="w-6 h-6" />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
        { id: 'java', name: 'Java', icon: <Globe className="w-6 h-6" />, color: 'bg-red-50 text-red-600 border-red-100' },
    ];

    const modules = [
        { id: 'basics', name: t('roadmap.basics', '1. Основы и Типы данных'), icon: <BookOpen />, color: 'indigo' },
        { id: 'logic', name: t('roadmap.logic', '2. Переменные и Логика'), icon: <Sparkles />, color: 'blue' },
        { id: 'arrays', name: t('roadmap.arrays', '3. Списки и Коллекции'), icon: <Terminal />, color: 'cyan' },
        { id: 'functions', name: t('roadmap.functions', '4. Функции и Методы'), icon: <Zap />, color: 'amber' },
        { id: 'objects', name: t('roadmap.objects', '5. Объекты и Классы'), icon: <Cpu />, color: 'rose' },
        { id: 'errors', name: t('roadmap.errors', '6. Обработка ошибок'), icon: <AlertCircle />, color: 'red' },
        { id: 'async', name: t('roadmap.async', '7. Асинхронность'), icon: <Clock />, color: 'purple' },
        { id: 'apis', name: t('roadmap.apis', '8. Работа с API'), icon: <Globe />, color: 'indigo' },
        { id: 'patterns', name: t('roadmap.patterns', '9. Паттерны проектирования'), icon: <Shield />, color: 'emerald' },
        { id: 'final', name: t('roadmap.final', '10. Финальное испытание'), icon: <Trophy />, color: 'yellow' },
    ];

    useEffect(() => {
        fetchProgress();
    }, [selectedLanguage]);

    const fetchProgress = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/progress/?language=${selectedLanguage}`);
            setProgress(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguageUI = () => {
        const newLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(newLang);
    };

    const handleStartModule = (moduleId) => {
        if (!progress.unlocked.includes(moduleId)) return;
        navigate('/test', { state: { language: selectedLanguage, category: moduleId } });
    };

    const themeClass = isChild
        ? "bg-yellow-400 font-['Outfit'] space-pattern"
        : "bg-[#fafafa] font-sans";

    return (
        <div className={`min-h-screen ${themeClass}`}>
            {/* Header */}
            <nav className={`${isChild ? 'bg-white border-b-4 border-black' : 'bg-white border-b border-gray-100'} px-8 py-4 sticky top-0 z-50`}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        {isChild ? <Rocket className="w-8 h-8 text-black" /> : <Sparkles className="w-6 h-6 text-indigo-600" />}
                        <span className={`font-black text-xl tracking-tight ${isChild ? 'text-black italic text-2xl' : 'text-gray-900'}`}>
                            {isChild ? t('dashboard.super_mentor', 'Super Mentor') : 'MentorAI'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/homework', { state: { language: selectedLanguage } })}
                            className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isChild ? 'bg-indigo-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-200'}`}
                        >
                            <Code className="w-4 h-4" />
                            {t('dashboard.homework_lab', 'Homework Lab')}
                        </button>

                        <button
                            onClick={toggleLanguageUI}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${isChild ? 'bg-black text-white hover:scale-110' : 'hover:bg-gray-50 border border-gray-100 text-gray-700'}`}
                        >
                            <Languages className="w-4 h-4" />
                            {i18n.language.toUpperCase()}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Language Picker */}
                <div className="flex justify-center gap-4 mb-16 flex-wrap">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setSelectedLanguage(lang.id)}
                            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border-2
                                ${selectedLanguage === lang.id
                                    ? (isChild ? 'bg-white border-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-indigo-600 text-white border-indigo-600 scale-105')
                                    : (isChild ? 'bg-white/40 border-black/10' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300')}`}
                        >
                            {lang.icon}
                            {lang.name}
                        </button>
                    ))}
                </div>

                {/* Duolingo Roadmap Path */}
                <div className="flex flex-col items-center gap-12 relative">
                    {/* SVG Connecting Path */}
                    <div className="absolute top-0 bottom-0 w-1 bg-gray-200 left-1/2 -translate-x-1/2 z-0 hidden md:block" />

                    {modules.map((mod, index) => {
                        const isUnlocked = progress.unlocked.includes(mod.id);
                        const isCompleted = progress.completed[mod.id] >= 70;
                        const score = progress.completed[mod.id];

                        return (
                            <div
                                key={mod.id}
                                className={`relative z-10 w-full flex flex-col items-center group
                                    ${index % 2 === 0 ? 'md:items-start md:pl-[25%]' : 'md:items-end md:pr-[25%]'}`}
                            >
                                <div className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-4 transition-all duration-500 max-w-sm w-full
                                    ${isUnlocked
                                        ? (isChild ? 'bg-white border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-2' : 'bg-white border-indigo-100 shadow-xl shadow-indigo-50/50 cursor-pointer hover:border-indigo-300 hover:-translate-y-2')
                                        : (isChild ? 'bg-yellow-300/50 border-black/20 opacity-50' : 'bg-gray-50 border-gray-100 opacity-60')}`}
                                    onClick={() => isUnlocked && handleStartModule(mod.id)}
                                >
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-lg border-4
                                        ${isUnlocked
                                            ? (isChild ? 'bg-indigo-500 text-white border-black' : `bg-${mod.color}-500 text-white border-${mod.color}-200`)
                                            : 'bg-gray-200 text-gray-400 border-gray-100'}`}
                                    >
                                        {isUnlocked ? mod.icon : <Lock className="w-8 h-8" />}
                                    </div>

                                    <div className="text-center">
                                        <h3 className={`font-black text-xl mb-1 ${isChild ? 'text-black uppercase' : 'text-gray-900'}`}>
                                            {mod.name}
                                        </h3>
                                        {isCompleted ? (
                                            <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-sm uppercase">
                                                <Award className="w-4 h-4" />
                                                {t('dashboard.mastered', 'Mastered!')} {score}%
                                            </div>
                                        ) : isUnlocked ? (
                                            <div className="text-indigo-500 font-bold text-xs uppercase tracking-tighter">
                                                {score ? `${t('dashboard.best', 'Best')}: ${score}%` : t('dashboard.start_learning', 'Start Learning')}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 font-bold text-xs uppercase italic">
                                                {t('dashboard.locked', 'Complete previous level')}
                                            </div>
                                        )}
                                    </div>

                                    {isUnlocked && (
                                        <button className={`mt-2 flex items-center gap-2 font-black uppercase text-sm px-4 py-2 rounded-xl transition-all
                                            ${isChild ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                                            <Play className="w-4 h-4 fill-current" />
                                            {isCompleted ? t('dashboard.retry', 'Retry') : t('dashboard.play', 'Start')}
                                        </button>
                                    )}
                                </div>

                                {/* Floating Progress Badges */}
                                {isCompleted && (
                                    <div className="absolute -top-4 -right-4 md:-right-8 p-3 bg-yellow-400 border-4 border-black rounded-full rotate-12 shadow-lg animate-bounce">
                                        <Star className="w-6 h-6 text-black fill-current" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

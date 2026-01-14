import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import {
    Terminal, Cpu, Globe,
    BookOpen, Sparkles, Languages, Code, Rocket, Map,
    Lock, Star, Play, Award, Zap, AlertCircle, Clock, Shield, Trophy,
    ChevronRight, Info
} from 'lucide-react';

export default function Dashboard({ isChild }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [modules, setModules] = useState([]);
    const [progress, setProgress] = useState({ unlocked: [], completed: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const languages = [
        { id: 'python', name: 'Python', icon: <Terminal className="w-8 h-8" />, color: 'indigo', desc: 'Masters of Logic' },
        { id: 'javascript', name: 'Frontend', icon: <Code className="w-8 h-8" />, color: 'purple', desc: 'Web Wizards' },
        { id: 'go', name: 'Go', icon: <Cpu className="w-8 h-8" />, color: 'emerald', desc: 'Speed Demons' },
        { id: 'java', name: 'Java', icon: <Globe className="w-8 h-8" />, color: 'amber', desc: 'Enterprise Titans' },
    ];

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const courseRes = await api.get(`/api/courses/${selectedLanguage}/`);
            setModules(courseRes.data.modules.map(m => ({
                id: m.slug || m.id,
                name: (i18n.language || 'en').startsWith('ru') ? m.title_ru : m.title_en,
                icon: <BookOpen className="w-6 h-6" />,
                color: languages.find(l => l.id === selectedLanguage)?.color || 'indigo'
            })));

            const progRes = await api.get(`/api/progress/?language=${selectedLanguage}`);
            setProgress(progRes.data);
        } catch (err) {
            console.error("Data fetch error:", err);
            setError(err.response?.status === 404 ? 'empty_database' : 'fetch_error');
            setModules([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedLanguage, i18n.language]);

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
                            onClick={() => navigate('/homework', { state: { language: selectedLanguage } })}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-4 border-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                            {isRu ? "ЛАБОРАТОРИЯ ДЗ" : "HOMEWORK LAB"}
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
                {/* Hero Selection */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-12 h-1.5 rounded-full ${isChild ? 'bg-black' : 'bg-indigo-600'}`}></div>
                        <h2 className={`font-black uppercase tracking-[0.2em] text-sm ${isChild ? 'text-black' : 'text-gray-400'}`}>
                            {isRu ? "ВЫБЕРИ СВОЙ ПУТЬ" : "CHOOSE YOUR DESTINY"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => setSelectedLanguage(lang.id)}
                                className={`group relative p-8 rounded-[2.5rem] border-4 transition-all text-left overflow-hidden
                                    ${selectedLanguage === lang.id
                                        ? (isChild ? 'bg-white border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] scale-105' : 'bg-white border-indigo-600 shadow-2xl scale-105')
                                        : (isChild ? 'bg-black/5 border-black/10 hover:bg-white/40' : 'bg-white border-gray-100 opacity-60 hover:opacity-100 hover:border-gray-200')
                                    }`}
                            >
                                <div className={`mb-6 p-4 rounded-3xl w-fit transition-transform group-hover:scale-110 group-hover:rotate-3
                                    ${selectedLanguage === lang.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {lang.icon}
                                </div>
                                <h3 className={`font-black text-2xl mb-1 ${isChild ? 'text-black' : 'text-gray-900'}`}>{lang.name}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isChild ? 'text-black/40' : 'text-gray-400'}`}>{lang.desc}</p>

                                {selectedLanguage === lang.id && (
                                    <div className="absolute top-4 right-4">
                                        <div className="p-1 bg-yellow-400 rounded-full border-2 border-black animate-bounce">
                                            <Star className="w-4 h-4 text-black fill-current" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Roadmap Area */}
                    <div className="lg:col-span-8">
                        <div className={`p-10 rounded-[3rem] border-4 border-black relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center
                            ${isChild ? 'bg-white shadow-[16px_16px_0_0_rgba(0,0,0,1)]' : 'bg-white shadow-2xl shadow-indigo-100'}`}>

                            {isLoading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                    <span className="font-black uppercase tracking-widest text-sm text-gray-400">Loading Journey...</span>
                                </div>
                            ) : error === 'empty_database' ? (
                                <div className="text-center max-w-md px-10">
                                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-200">
                                        <AlertCircle className="w-12 h-12 text-red-500" />
                                    </div>
                                    <h3 className="font-black text-3xl text-gray-900 mb-4 uppercase leading-tight">
                                        {isRu ? "Мир ещё не создан" : "The world is empty"}
                                    </h3>
                                    <p className="text-gray-500 font-bold mb-8 text-sm leading-relaxed">
                                        {isRu
                                            ? "База данных пуста. Я настроил автоматическое заполнение через build.sh, просто сделайте PUSH!"
                                            : "Your database is empty. I've set up auto-population in build.sh, just do a PUSH!"}
                                    </p>
                                    <div className="bg-gray-100 p-4 rounded-2xl font-mono text-xs text-left mb-8 border-2 border-gray-200">
                                        python scripts/populate_massive_curriculum.py
                                    </div>
                                    <button
                                        onClick={fetchData}
                                        className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                    >
                                        {isRu ? "Попробовать снова" : "Retry Sync"}
                                    </button>
                                </div>
                            ) : modules.length > 0 ? (
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-12">
                                        <h4 className="font-black text-3xl uppercase tracking-tighter">
                                            {selectedLanguage} {isRu ? "Приключение" : "Adventure"}
                                        </h4>
                                        <button
                                            onClick={() => navigate(`/courses/${selectedLanguage}`)}
                                            className="px-6 py-3 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200"
                                        >
                                            <Map className="w-4 h-4" />
                                            {isRu ? "ОТКРЫТЬ КАРТУ" : "OPEN FULL MAP"}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {modules.slice(0, 5).map((mod, idx) => (
                                            <div
                                                key={mod.id}
                                                className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all cursor-pointer hover:border-black hover:translate-x-2
                                                    ${progress.unlocked.includes(mod.id) ? 'bg-gray-50 border-gray-100' : 'bg-gray-100 border-transparent opacity-40'}`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl
                                                    ${progress.unlocked.includes(mod.id) ? 'bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-gray-200 text-gray-400'}`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-black text-lg text-gray-900">{mod.name}</h5>
                                                    <div className="h-2 bg-gray-200 rounded-full mt-2 w-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${progress.completed[mod.id] || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                {progress.unlocked.includes(mod.id) ? (
                                                    <ChevronRight className="w-6 h-6 text-indigo-400" />
                                                ) : (
                                                    <Lock className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                        <div className="text-center py-6">
                                            <p className="text-gray-400 font-bold italic text-sm">
                                                And {modules.length - 5} more exciting levels to discover...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center opacity-40">
                                    <Rocket className="w-20 h-20 mx-auto mb-6 text-gray-300 animate-float" />
                                    <p className="font-black uppercase tracking-widest text-sm">Select a language to begin your journey</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className={`p-8 rounded-[2.5rem] border-4 border-black relative overflow-hidden
                            ${isChild ? 'bg-indigo-600 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]' : 'bg-gray-900 text-white shadow-2xl'}`}>
                            <h4 className="font-black uppercase tracking-widest text-xs mb-6 opacity-60">My Progress</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-4xl font-black mb-1">{progress.unlocked.length}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Levels Unlocked</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black mb-1 text-yellow-400">
                                        {Object.values(progress.completed).filter(v => v >= 70).length}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Final Tests Passed</div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-8 rounded-[2.5rem] border-4 border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="w-6 h-6 text-yellow-500 fill-current" />
                                <h4 className="font-black uppercase tracking-widest text-sm text-black">Top Performers</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: 'Alex M.', score: 980, color: 'indigo' },
                                    { name: 'Sarah J.', score: 945, color: 'purple' },
                                    { name: 'You', score: progress.unlocked.length * 10, color: 'yellow' }
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-xs bg-${p.color}-400`}>
                                            {i + 1}
                                        </div>
                                        <span className={`font-bold flex-1 ${p.name === 'You' ? 'text-black font-black' : 'text-gray-500'}`}>{p.name}</span>
                                        <span className="font-black text-black">{p.score}⚡</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`p-6 bg-yellow-50 border-2 border-yellow-200 rounded-3xl flex items-start gap-3`}>
                            <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-1" />
                            <p className="text-[11px] font-bold text-yellow-800/80 leading-relaxed">
                                {isRu
                                    ? "Изучайте теорию, проходите практику и сдавайте тесты, чтобы открывать новые уровни приключений!"
                                    : "Learn theory, pass practice tasks, and complete tests to unlock new levels of your adventure!"}
                            </p>
                        </div>
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

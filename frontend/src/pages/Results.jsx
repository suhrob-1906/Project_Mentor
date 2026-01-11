import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle, Map, FolderGit2, Star,
    ArrowRight, Trophy, Target, Sparkles,
    Languages, Home, BookOpen, PartyPopper, Rocket,
    Cloud, Sun, Tent, Zap, Ghost, Heart
} from 'lucide-react';

export default function Results({ isChild: propIsChild }) {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(state?.data);
    const [isTranslating, setIsTranslating] = useState(false);

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 text-center max-w-md">
                    <p className="text-gray-400 mb-8 font-medium">No analysis data found.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const { level, roadmap, projects, tasks, score, total, feedback, is_child: dataIsChild, age } = data;
    const is_child = propIsChild !== undefined ? propIsChild : dataIsChild;

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'ru' ? 'en' : 'ru';
        i18n.changeLanguage(newLang);

        // Re-generate if needed, but for now we'll just toggle UI
        // If the backend supported lang param, we could refetch here.
    };

    // Adult Mode Styles (Professional Minimalist)
    const adultStyles = {
        'beginner': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '🌱' },
        'junior': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '🚀' },
        'strong_junior': { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: '⚡' },
        'middle': { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: '💎' },
    };

    // Child Mode Styles (Magic & Vibrant)
    const childStyles = {
        'beginner': { color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-300', icon: '🍭', accent: 'bg-pink-500' },
        'junior': { color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-300', icon: '🦁', accent: 'bg-orange-500' },
        'strong_junior': { color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-300', icon: '🦄', accent: 'bg-cyan-500' },
        'middle': { color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300', icon: '👑', accent: 'bg-purple-500' },
    };

    const currentStyles = (is_child ? childStyles[level] : adultStyles[level]) || { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: '🔍' };

    if (is_child) {
        return (
            <div className="min-h-screen bg-yellow-400 font-['Outfit'] pb-24 selection:bg-black selection:text-white relative overflow-x-hidden">
                {/* Magical Background Decorations */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                    <Cloud className="absolute top-10 left-10 w-32 h-32 animate-pulse" />
                    <Sun className="absolute top-20 right-20 w-48 h-48 animate-spin-slow" />
                    <Star className="absolute bottom-40 left-20 w-16 h-16 animate-bounce" />
                    <Heart className="absolute top-1/2 left-1/4 w-12 h-12 text-pink-500 animate-pulse" />
                    <Zap className="absolute top-1/3 right-1/4 w-20 h-20 text-blue-500 animate-bounce" />
                    <Rocket className="absolute bottom-10 right-10 w-40 h-40 rotate-[-45deg] opacity-10" />
                </div>

                <nav className="bg-white border-b-4 border-black px-8 py-4 sticky top-0 z-50">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                            <div className="bg-yellow-400 p-2 rounded-xl border-2 border-black group-hover:rotate-12 transition-transform">
                                <Rocket className="w-8 h-8 text-black" />
                            </div>
                            <span className="font-black text-3xl tracking-tight text-black italic uppercase">Super Results!</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="px-4 py-2 bg-black text-white rounded-xl font-black text-xs hover:scale-110 transition-transform flex items-center gap-2"
                            >
                                <Languages className="w-4 h-4" />
                                {i18n.language.toUpperCase()}
                            </button>
                            <Link to="/dashboard" className="px-6 py-3 bg-indigo-500 border-b-4 border-black text-white rounded-2xl font-black text-sm hover:translate-y-1 hover:border-b-0 transition-all flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                HOME
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 max-w-6xl mt-12 relative z-10">
                    {/* Magical Hero Card */}
                    <div className="bg-white border-[6px] border-black rounded-[4rem] p-10 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>

                        <div className="flex-shrink-0 relative">
                            <div className="w-56 h-56 rounded-full bg-yellow-100 border-[8px] border-black flex items-center justify-center text-9xl shadow-inner animate-bounce-slow">
                                {currentStyles.icon}
                            </div>
                            <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-5 rounded-full border-4 border-black animate-pulse shadow-lg">
                                <PartyPopper className="w-10 h-10" />
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-2xl font-black text-orange-500 uppercase tracking-[0.3em] mb-4 drop-shadow-sm">YOU ARE A HERO!</h2>
                            <h1 className="text-7xl md:text-9xl font-black text-black leading-none mb-8 tracking-tighter uppercase italic">
                                {level.replace('_', ' ')}!
                            </h1>
                            <div className="bg-yellow-50 p-8 rounded-[2.5rem] border-4 border-dashed border-yellow-200 text-black text-2xl font-bold leading-relaxed shadow-inner">
                                " {feedback || "You are doing an amazing job! Keep coding and having fun!"} "
                            </div>
                        </div>

                        <div className="bg-black p-10 rounded-[3rem] text-white flex flex-col items-center min-w-[240px] shadow-2xl relative">
                            <div className="absolute -top-6 bg-pink-500 px-6 py-2 rounded-full border-4 border-black font-black text-sm uppercase tracking-widest -rotate-6">SCORE CARD</div>
                            <span className="text-yellow-400 font-black text-xl uppercase tracking-widest mb-4 mt-2">MAGIC POINTS</span>
                            <div className="text-9xl font-black text-white shrink-0 tracking-tighter">
                                {score}<span className="text-3xl text-gray-400">/{total}</span>
                            </div>
                            <div className="mt-6 flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-8 h-8 ${i < (score / total * 5) ? 'text-yellow-400 fill-yellow-400 animate-spin-slow' : 'text-gray-700'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Magic Roadmap */}
                        <div className="lg:col-span-12 mb-12">
                            <div className="flex items-center gap-6 mb-12 justify-center italic">
                                <div className="p-6 bg-cyan-400 border-6 border-black rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                                    <Map className="w-12 h-12 text-black" />
                                </div>
                                <h2 className="text-7xl font-black text-black tracking-tight uppercase underline decoration-yellow-400 decoration-8 underline-offset-8">MY ADVENTURE MAP!</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {roadmap?.map((step, idx) => (
                                    <div key={idx} className="bg-white p-10 rounded-[3rem] border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center group hover:-translate-y-4 transition-all duration-500 hover:bg-cyan-50">
                                        <div className="w-20 h-20 rounded-3xl bg-black text-yellow-400 flex items-center justify-center font-black text-5xl mb-8 group-hover:rotate-12 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-tight leading-none">{step.topic}</h3>
                                        <p className="text-gray-600 font-bold text-xl leading-tight">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects & Tasks Grid */}
                        <div className="lg:col-span-7">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-pink-400 border-4 border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <Target className="w-10 h-10 text-black" />
                                </div>
                                <h2 className="text-6xl font-black text-black italic">FUN QUESTS!</h2>
                            </div>
                            <div className="space-y-8">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className="group bg-white p-8 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-6 items-start hover:bg-pink-50 transition-all hover:translate-x-4">
                                        <div className="mt-1 bg-green-400 p-2 rounded-xl border-4 border-black group-hover:rotate-[360deg] transition-transform duration-700">
                                            <CheckCircle className="w-8 h-8 text-black" />
                                        </div>
                                        <p className="text-black font-black text-2xl leading-tight">{task}</p>
                                    </div>
                                ))}
                                {tasks?.length === 0 && <p className="text-black font-black text-2xl italic">You've finished everything! Amazing! ✨</p>}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-indigo-400 border-4 border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <FolderGit2 className="w-10 h-10 text-black" />
                                </div>
                                <h2 className="text-6xl font-black text-black uppercase">MY GAME!</h2>
                            </div>
                            <div className="space-y-8">
                                {projects?.map((proj, idx) => (
                                    <div key={idx} className="bg-white p-10 rounded-[3.5rem] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Rocket className="w-32 h-32" />
                                        </div>
                                        <h3 className="text-4xl font-black text-black mb-6 flex justify-between items-center italic uppercase leading-none">
                                            {proj.title}
                                            <ArrowRight className="w-10 h-10 text-black group-hover:translate-x-4 transition-transform" />
                                        </h3>
                                        <p className="text-gray-500 font-bold text-lg mb-8 leading-snug">{proj.description}</p>
                                        <div className="flex flex-wrap gap-3">
                                            {proj.tech_stack?.map((tech, i) => (
                                                <span key={i} className="text-sm px-4 py-2 bg-black text-yellow-400 rounded-2xl font-black uppercase tracking-widest border-2 border-black">
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

    // ADULT MODE RENDERING
    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-sans">
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <span className="font-black text-xl tracking-tight text-gray-900 uppercase tracking-widest">MentorAI</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-500 font-bold text-xs transition-colors"
                        >
                            <Languages className="w-4 h-4" />
                            {i18n.language.toUpperCase()}
                        </button>
                        <Link to="/dashboard" className="text-sm font-black text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors uppercase tracking-widest">
                            <Home className="w-4 h-4" />
                            {t('results.new_analysis') || 'New Assessment'}
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl mt-16">
                {/* Score & Level Hero */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className={`md:col-span-2 bg-white rounded-[3rem] p-12 shadow-2xl shadow-gray-100 border ${currentStyles.border} flex flex-col justify-center relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <span className="text-7xl drop-shadow-sm">{currentStyles.icon}</span>
                            <div>
                                <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-black mb-1">{t('results.level')}</p>
                                <h1 className={`text-6xl font-black uppercase tracking-tighter leading-none ${currentStyles.color}`}>
                                    {level.replace('_', ' ')}
                                </h1>
                            </div>
                        </div>
                        {feedback && (
                            <div className="prose max-w-none text-gray-600 leading-relaxed bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 text-lg font-medium italic relative z-10 shadow-inner">
                                "{feedback}"
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-1000 hover:bg-black group">
                        <Trophy className="w-24 h-24 text-yellow-500 mb-6 relative z-10 group-hover:scale-110 transition-transform" />
                        <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-black mb-3 relative z-10">{t('results.score')}</p>
                        <div className="text-8xl font-black mb-4 relative z-10 tracking-tighter">
                            {score || 0}<span className="text-2xl text-gray-600 ml-1">/{total || 20}</span>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full -ml-24 -mb-24 blur-[100px]"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Roadmap */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-white shadow-lg rounded-2xl text-gray-900 ring-1 ring-gray-100">
                                <Map className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{t('results.roadmap')}</h2>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-100 -z-10"></div>
                            {roadmap?.map((step, idx) => (
                                <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex gap-8 hover:translate-x-2 transition-all duration-300 group">
                                    <div className="flex-shrink-0 w-20 h-20 rounded-3xl bg-gray-50 text-gray-300 group-hover:bg-gray-900 flex flex-col items-center justify-center transition-colors">
                                        <span className="text-[10px] font-black tracking-widest opacity-50">STEP</span>
                                        <span className="font-black text-3xl leading-none">{idx + 1}</span>
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{step.topic}</h3>
                                        <p className="text-gray-500 leading-relaxed text-base font-medium">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Projects & Tasks */}
                    <div className="lg:col-span-4 space-y-16 pt-4">
                        {/* Tasks Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2.5 bg-red-50 rounded-xl text-red-500 shadow-sm border border-red-100">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{t('results.tasks')}</h2>
                            </div>
                            <div className="space-y-6">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-50/50 flex gap-5 items-start hover:border-gray-300 transition-all hover:-translate-y-1">
                                        <div className="mt-1.5 p-1 bg-emerald-50 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                                        <p className="text-gray-800 font-bold text-base leading-snug">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
                                    <FolderGit2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{t('results.projects')}</h2>
                            </div>
                            <div className="space-y-6">
                                {projects?.map((proj, idx) => (
                                    <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 hover:shadow-2xl transition group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 flex justify-between items-center tracking-tight leading-none relative z-10">
                                            {proj.title}
                                            <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-8 leading-snug font-medium relative z-10">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 relative z-10">
                                            {proj.tech_stack?.map((tech, i) => (
                                                <span key={i} className="text-[10px] px-3 py-1.5 bg-gray-900 text-white rounded-xl font-black border border-black uppercase tracking-widest shadow-lg">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

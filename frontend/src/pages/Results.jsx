import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle,
    ArrowRight, Trophy, Sparkles,
    Rocket, Award
} from 'lucide-react';

export default function Results({ isChild: propIsChild }) {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(state?.data);

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

    const { level, roadmap, projects, tasks, score, total, ai_feedback, passed, is_child: dataIsChild } = data;
    const is_child = propIsChild !== undefined ? propIsChild : dataIsChild;

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(newLang);
    };

    const adultStyles = {
        'beginner': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '🌱' },
        'junior': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '🚀' },
        'strong_junior': { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: '⚡' },
        'middle': { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: '💎' },
    };

    const childStyles = {
        'beginner': { color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-300', icon: '🍭', accent: 'bg-pink-500' },
        'junior': { color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-300', icon: '🦁', accent: 'bg-orange-500' },
        'strong_junior': { color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-300', icon: '🦄', accent: 'bg-cyan-500' },
        'middle': { color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300', icon: '👑', accent: 'bg-purple-500' },
    };

    const currentStyles = (is_child ? childStyles[level] : adultStyles[level]) || { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: '🔍' };

    if (is_child) {
        return (
            <div className="min-h-screen bg-yellow-400 font-['Outfit'] pb-24 relative overflow-x-hidden">
                <nav className="bg-white border-b-4 border-black px-8 py-4 sticky top-0 z-50">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                            <div className="bg-yellow-400 p-2 rounded-xl border-2 border-black">
                                <Rocket className="w-8 h-8 text-black" />
                            </div>
                            <span className="font-black text-3xl tracking-tight text-black italic uppercase">{t('results.super_results', 'Results!')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleLanguage} className="px-4 py-2 bg-black text-white rounded-xl font-black text-xs">
                                {i18n.language.toUpperCase()}
                            </button>
                            <Link to="/dashboard" className="px-6 py-3 bg-indigo-500 border-b-4 border-black text-white rounded-2xl font-black text-sm">
                                {t('results.home', 'Home')}
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 max-w-6xl mt-12 relative z-10">
                    <div className="bg-white border-[6px] border-black rounded-[4rem] p-10 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mb-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                        <div className="flex-shrink-0">
                            <div className="w-56 h-56 rounded-full bg-yellow-100 border-[8px] border-black flex items-center justify-center text-9xl">
                                {currentStyles.icon}
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-2xl font-black text-orange-500 uppercase tracking-[0.3em] mb-4">{t('results.hero', 'Score!')}</h2>
                            <h1 className="text-7xl md:text-9xl font-black text-black leading-none mb-8 tracking-tighter uppercase italic">
                                {passed ? (is_child ? t('results.passed', 'Level Up!') : 'Level Cleared!') : (is_child ? t('results.try_again', 'Keep Trying!') : 'Keep Practicing!')}
                            </h1>
                            <div className="bg-yellow-50 p-8 rounded-[2.5rem] border-4 border-dashed border-yellow-200 text-black text-2xl font-bold mb-6">
                                <p className="text-orange-500 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    {t('results.mentor_advice', "Mentor's Advice")}
                                </p>
                                {ai_feedback}
                            </div>
                            {passed && (
                                <div className="bg-emerald-500 text-white p-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-xl font-black uppercase text-center animate-bounce">
                                    🌟 {data?.category === 'final' ? t('results.graduated', 'Full Mastery Achieved! 🎓') : t('results.unlocked', 'New Level Unlocked!')}
                                </div>
                            )}
                        </div>
                        <div className="bg-black p-10 rounded-[3rem] text-white flex flex-col items-center min-w-[240px]">
                            {data?.category === 'final' && passed && (
                                <div className="absolute -top-10 -right-10 bg-yellow-400 p-6 rounded-full border-4 border-black rotate-12 animate-pulse z-20">
                                    <Trophy className="w-12 h-12 text-black" />
                                </div>
                            )}
                            <span className="text-yellow-400 font-black text-xl mb-4">{t('results.magic_points', 'Points')}</span>
                            <div className="text-9xl font-black">{score}<span className="text-3xl text-gray-400">/{total}</span></div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-12">
                            <h2 className="text-6xl font-black text-black mb-12 uppercase">{t('results.adventure_map', 'Adventure Map')}</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {roadmap?.map((step, idx) => (
                                    <div key={idx} className="bg-white p-10 rounded-[3rem] border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="w-16 h-16 rounded-2xl bg-black text-yellow-400 flex items-center justify-center font-black text-3xl mb-6">{idx + 1}</div>
                                        <h3 className="text-3xl font-black mb-4 uppercase leading-none">{step.topic}</h3>
                                        <p className="text-gray-600 font-bold text-xl">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <h2 className="text-6xl font-black text-black mb-10 italic">{t('results.fun_quests', 'Magic Quests')}</h2>
                            <div className="space-y-8">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-6 items-start">
                                        <CheckCircle className="w-8 h-8 text-green-500 mt-1" />
                                        <p className="text-black font-black text-2xl leading-tight">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <h2 className="text-6xl font-black text-black mb-10 uppercase">{t('results.my_game', 'Project')}</h2>
                            {projects?.map((proj, idx) => (
                                <div key={idx} className="bg-white p-10 rounded-[3.5rem] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                                    <h3 className="text-4xl font-black mb-6 italic uppercase">{proj.title}</h3>
                                    <p className="text-gray-500 font-bold text-lg mb-8">{proj.description}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {proj.tech_stack?.map((tech, i) => (
                                            <span key={i} className="px-4 py-2 bg-black text-yellow-400 rounded-2xl font-black uppercase text-sm border-2 border-black">
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
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-sans">
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <span className="font-black text-xl tracking-tight text-gray-900 uppercase">MentorAI</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={toggleLanguage} className="font-bold text-xs text-gray-500">{i18n.language.toUpperCase()}</button>
                        <Link to="/dashboard" className="text-sm font-black text-gray-400 hover:text-gray-900 uppercase">{t('results.home', 'Home')}</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl mt-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className={`md:col-span-2 bg-white rounded-[3rem] p-12 shadow-2xl border ${currentStyles.border} flex flex-col justify-center`}>
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-7xl">{currentStyles.icon}</span>
                            <div>
                                <h1 className={`text-6xl font-black uppercase tracking-tighter ${currentStyles.color}`}>
                                    {data?.category === 'final' && passed ? t('results.graduated_adult', 'Mastery Achieved') : level.replace('_', ' ')}
                                </h1>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-sm font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                                        {t('results.roadmap', 'Learning Journey')}
                                    </h2>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                        {/* Simplified roadmap view */}
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            {t('results.unlock_next', 'Finish your assignment to continue your journey!')}
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                        {ai_feedback && (
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-indigo-100 mb-6">
                                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    {t('results.mentor_advice', "AI Mentor's Advice")}
                                </p>
                                <div className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-line">
                                    {ai_feedback}
                                </div>
                            </div>
                        )}
                        {passed && (
                            <div className="bg-indigo-600 text-white p-6 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Award className="w-8 h-8 text-yellow-400" />
                                    <h3 className="text-xl font-black">{t('results.next_unlocked', 'Next Level Unlocked!')}</h3>
                                </div>
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col items-center justify-center">
                        <Trophy className="w-24 h-24 text-yellow-500 mb-6" />
                        <div className="text-8xl font-black">{score}<span className="text-2xl text-gray-600 ml-1">/{total}</span></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <h2 className="text-4xl font-black text-gray-900 mb-12 uppercase">{t('results.roadmap', 'Learning Roadmap')}</h2>
                        <div className="space-y-8">
                            {roadmap?.map((step, idx) => (
                                <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl flex gap-8">
                                    <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center font-black text-3xl">{idx + 1}</div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-3">{step.topic}</h3>
                                        <p className="text-gray-500 font-medium">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-16">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase">{t('results.tasks', 'Targets')}</h2>
                            <div className="space-y-6">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg flex gap-5 items-start">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                                        <p className="text-gray-800 font-bold">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-10 uppercase">{t('results.projects', 'Projects')}</h2>
                            {projects?.map((proj, idx) => (
                                <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">{proj.title}</h3>
                                    <p className="text-gray-500 text-sm mb-8 font-medium">{proj.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {proj.tech_stack?.map((tech, i) => (
                                            <span key={i} className="text-[10px] px-3 py-1.5 bg-gray-900 text-white rounded-xl font-black uppercase">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

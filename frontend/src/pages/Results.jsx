import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle, Map, FolderGit2, Star,
    ArrowRight, Trophy, Target, Sparkles,
    Languages, Home, BookOpen, PartyPopper, Rocket,
    Cloud, Sun, Tent, Zap, Ghost, Heart
} from 'lucide-react';

export default function Results() {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const data = state?.data;

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

    const { level, roadmap, projects, tasks, score, total, feedback, is_child, age } = data;

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
            <div className="min-h-screen bg-yellow-400 font-['Outfit'] pb-24 selection:bg-black selection:text-white">
                {/* Magical Background Decorations */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                    <Cloud className="absolute top-10 left-10 w-32 h-32 animate-pulse" />
                    <Sun className="absolute top-20 right-20 w-48 h-48 animate-spin-slow" />
                    <Star className="absolute bottom-40 left-20 w-16 h-16 animate-bounce" />
                    <Heart className="absolute top-1/2 left-1/4 w-12 h-12 text-pink-500 animate-pulse" />
                    <Zap className="absolute top-1/3 right-1/4 w-20 h-20 text-blue-500 animate-bounce" />
                </div>

                <nav className="bg-white/90 backdrop-blur-md border-b-4 border-black px-8 py-4 sticky top-0 z-50">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                            <div className="bg-yellow-400 p-2 rounded-xl border-2 border-black group-hover:rotate-12 transition-transform">
                                <Rocket className="w-8 h-8 text-black" />
                            </div>
                            <span className="font-black text-3xl tracking-tight text-black italic">SUPER MENTOR!</span>
                        </div>
                        <Link to="/dashboard" className="px-6 py-3 bg-black text-white rounded-full font-black text-sm hover:scale-110 transition-transform flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            BACK HOME
                        </Link>
                    </div>
                </nav>

                <div className="container mx-auto px-4 max-w-6xl mt-12 relative z-10">
                    {/* Magical Hero Card */}
                    <div className="bg-white border-[6px] border-black rounded-[3rem] p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-shrink-0 relative">
                            <div className="w-48 h-48 rounded-full bg-yellow-100 border-[6px] border-black flex items-center justify-center text-8xl shadow-inner animate-bounce-slow">
                                {currentStyles.icon}
                            </div>
                            <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-full border-4 border-black animate-pulse">
                                <PartyPopper className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-xl font-black text-orange-500 uppercase tracking-[0.2em] mb-2">WOW! YOU DID IT!</h2>
                            <h1 className="text-6xl md:text-8xl font-black text-black leading-none mb-6">
                                {level.replace('_', ' ').toUpperCase()}!
                            </h1>
                            <div className="bg-orange-50 p-6 rounded-3xl border-4 border-dashed border-orange-200 text-orange-700 text-xl font-bold">
                                " {feedback || "You are doing an amazing job! Keep coding and having fun!"} "
                            </div>
                        </div>

                        <div className="bg-black p-8 rounded-[2.5rem] text-white flex flex-col items-center min-w-[200px]">
                            <span className="text-yellow-400 font-black text-sm uppercase tracking-widest mb-2">YOUR SCORE</span>
                            <div className="text-7xl font-black text-white shrink-0">
                                {score}<span className="text-3xl text-gray-400">/{total}</span>
                            </div>
                            <div className="mt-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-6 h-6 ${i < (score / total * 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Magic Roadmap */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-cyan-400 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <Map className="w-8 h-8 text-black" />
                                </div>
                                <h2 className="text-5xl font-black text-black tracking-tight drop-shadow-sm">MY ADVENTURE!</h2>
                            </div>

                            <div className="space-y-8">
                                {roadmap?.map((step, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-8 hover:-translate-y-2 transition-transform duration-300">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-black text-yellow-400 flex items-center justify-center font-black text-3xl italic">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-black mb-3 lowercase tracking-tight">{step.topic}</h3>
                                            <p className="text-gray-600 font-bold text-lg leading-snug">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fun Sidebar */}
                        <div className="lg:col-span-4 space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-pink-400 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Target className="w-6 h-6 text-black" />
                                    </div>
                                    <h2 className="text-4xl font-black text-black">FUN TASKS!</h2>
                                </div>
                                <div className="space-y-6">
                                    {tasks?.map((task, idx) => (
                                        <div key={idx} className="group bg-white p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start hover:bg-pink-50 transition-colors">
                                            <div className="mt-1 bg-green-400 p-1 rounded-lg border-2 border-black group-hover:rotate-[360deg] transition-transform duration-500">
                                                <CheckCircle className="w-6 h-6 text-black" />
                                            </div>
                                            <p className="text-black font-black text-lg leading-tight">{task}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-indigo-400 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <FolderGit2 className="w-6 h-6 text-black" />
                                    </div>
                                    <h2 className="text-4xl font-black text-black uppercase">COOL PROJECTS!</h2>
                                </div>
                                <div className="space-y-6">
                                    {projects?.map((proj, idx) => (
                                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform group">
                                            <h3 className="text-2xl font-black text-black mb-4 flex justify-between items-center italic">
                                                {proj.title}
                                                <ArrowRight className="w-6 h-6 text-black group-hover:translate-x-2 transition-transform" />
                                            </h3>
                                            <p className="text-gray-500 font-bold text-sm mb-6 leading-relaxed">{proj.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {proj.tech_stack?.map((tech, i) => (
                                                    <span key={i} className="text-xs px-3 py-1 bg-black text-yellow-400 rounded-lg font-black uppercase tracking-widest border-2 border-black">
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

    // ADULT MODE RENDERING
    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            <nav className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <span className="font-black text-xl tracking-tight text-gray-900">MentorAI</span>
                    </div>
                    <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                        <Home className="w-4 h-4" />
                        {t('results.new_analysis')}
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl mt-12">
                {/* Score & Level Hero */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className={`md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border ${currentStyles.border} flex flex-col justify-center`}>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-5xl">{currentStyles.icon}</span>
                            <div>
                                <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{t('results.level')}</p>
                                <h1 className={`text-5xl font-black uppercase tracking-tight ${currentStyles.color}`}>
                                    {level.replace('_', ' ')}
                                </h1>
                            </div>
                        </div>
                        {feedback && (
                            <div className="prose max-w-none text-gray-500 leading-relaxed bg-gray-50 p-6 rounded-3xl border border-gray-100 text-sm italic">
                                "{feedback}"
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-1000">
                        <Trophy className="w-20 h-20 text-yellow-400 mb-4 relative z-10" />
                        <p className="text-indigo-300 uppercase tracking-widest text-[10px] font-black mb-2 relative z-10">{t('results.score')}</p>
                        <div className="text-7xl font-black mb-2 relative z-10">
                            {score || 0}<span className="text-2xl text-gray-500">/{total || 20}</span>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Roadmap */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                                <Map className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('results.roadmap')}</h2>
                        </div>

                        <div className="space-y-6">
                            {roadmap?.map((step, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex gap-6 hover:shadow-xl transition-all duration-300 group">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-indigo-600 flex items-center justify-center font-black text-lg group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.topic}</h3>
                                        <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar: Projects & Tasks */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Tasks Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Target className="w-5 h-5 text-red-500" />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t('results.tasks')}</h2>
                            </div>
                            <div className="space-y-4">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start hover:border-indigo-200 transition-colors">
                                        <div className="mt-1"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                                        <p className="text-gray-700 font-medium text-sm leading-relaxed">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t('results.projects')}</h2>
                            </div>
                            <div className="space-y-4">
                                {projects?.map((proj, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group h-full hover:border-indigo-100">
                                        <h3 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                                            {proj.title}
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition" />
                                        </h3>
                                        <p className="text-gray-500 text-xs mb-4 leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.tech_stack?.map((tech, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded-lg font-bold border border-gray-100 uppercase tracking-wider">
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

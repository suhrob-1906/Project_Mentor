import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle, Map, FolderGit2, Star,
    ArrowRight, Trophy, Target, Sparkles,
    Languages, Home, BookOpen, PartyPopper, Rocket
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

    // Adaptive Styles
    const adultStyles = {
        'beginner': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '🌱' },
        'junior': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '🚀' },
        'strong_junior': { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: '⚡' },
        'middle': { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: '💎' },
    };

    const childStyles = {
        'beginner': { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', icon: '🍭' },
        'junior': { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', icon: '🎨' },
        'strong_junior': { color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100', icon: '🌈' },
        'middle': { color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: '👑' },
    };

    const currentStyles = (is_child ? childStyles[level] : adultStyles[level]) || { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: '🔍' };

    return (
        <div className={`min-h-screen ${is_child ? 'bg-rose-50/20' : 'bg-[#fafafa]'} pb-24 transition-colors duration-1000`}>
            <nav className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Sparkles className={`w-6 h-6 ${is_child ? 'text-rose-500' : 'text-indigo-600'}`} />
                        <span className="font-black text-xl tracking-tight text-gray-900">MentorAI</span>
                    </div>
                    <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                        <Home className="w-4 h-4" />
                        {is_child ? 'Home' : t('results.new_analysis')}
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-6xl mt-12">
                {/* Score & Level Hero */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className={`md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border ${currentStyles.border} flex flex-col justify-center relative overflow-hidden`}>
                        {is_child && <div className="absolute top-0 right-0 p-4 opacity-10"><Rocket className="w-32 h-32" /></div>}
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <span className="text-5xl">{currentStyles.icon}</span>
                            <div>
                                <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">
                                    {is_child ? 'Your Level!' : t('results.level')}
                                </p>
                                <h1 className={`text-5xl font-black uppercase tracking-tight ${currentStyles.color}`}>
                                    {level.replace('_', ' ')}
                                </h1>
                            </div>
                        </div>
                        {feedback && (
                            <div className={`prose max-w-none ${is_child ? 'text-rose-700 bg-rose-50/50' : 'text-gray-500 bg-gray-50'} leading-relaxed p-6 rounded-3xl border border-gray-100 text-sm italic relative z-10`}>
                                "{feedback}"
                            </div>
                        )}
                    </div>

                    <div className={`${is_child ? 'bg-rose-500' : 'bg-gray-900'} rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-1000`}>
                        {is_child ? <PartyPopper className="w-20 h-20 text-white mb-4 relative z-10" /> : <Trophy className="w-20 h-20 text-yellow-400 mb-4 relative z-10" />}
                        <p className={`${is_child ? 'text-rose-100' : 'text-indigo-300'} uppercase tracking-widest text-[10px] font-black mb-2 relative z-10`}>{t('results.score')}</p>
                        <div className="text-7xl font-black mb-2 relative z-10">
                            {score || 0}<span className={`text-2xl ${is_child ? 'text-rose-200' : 'text-gray-500'}`}>/{total || 20}</span>
                        </div>
                        <div className={`absolute top-0 right-0 w-32 h-32 ${is_child ? 'bg-white/10' : 'bg-indigo-500/10'} rounded-full -mr-16 -mt-16 blur-3xl`}></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Roadmap */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`p-2 ${is_child ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'} rounded-xl`}>
                                <Map className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{is_child ? 'Your Learning Path' : t('results.roadmap')}</h2>
                        </div>

                        <div className="space-y-6">
                            {roadmap?.map((step, idx) => (
                                <div key={idx} className={`bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex gap-6 hover:shadow-xl transition-all duration-300 group`}>
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${is_child ? 'bg-rose-50 text-rose-300 group-hover:bg-rose-500' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-600'} flex items-center justify-center font-black text-lg group-hover:text-white transition-colors`}>
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
                                <Target className={`w-5 h-5 ${is_child ? 'text-rose-500' : 'text-red-500'}`} />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{is_child ? 'Fun Tasks' : t('results.tasks')}</h2>
                            </div>
                            <div className="space-y-4">
                                {tasks?.map((task, idx) => (
                                    <div key={idx} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start ${is_child ? 'hover:border-rose-200' : 'hover:border-indigo-200'} transition-colors`}>
                                        <div className="mt-1"><CheckCircle className={`w-5 h-5 ${is_child ? 'text-rose-400' : 'text-emerald-500'}`} /></div>
                                        <p className="text-gray-700 font-medium text-sm leading-relaxed">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <FolderGit2 className={`w-5 h-5 ${is_child ? 'text-rose-600' : 'text-indigo-600'}`} />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{is_child ? 'Project Ideas' : t('results.projects')}</h2>
                            </div>
                            <div className="space-y-4">
                                {projects?.map((proj, idx) => (
                                    <div key={idx} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group h-full ${is_child ? 'hover:border-rose-100' : ''}`}>
                                        <h3 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                                            {proj.title}
                                            <ArrowRight className={`w-4 h-4 text-gray-300 group-hover:${is_child ? 'text-rose-500' : 'text-indigo-600'} transition`} />
                                        </h3>
                                        <p className="text-gray-500 text-xs mb-4 leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.tech_stack?.map((tech, i) => (
                                                <span key={i} className={`text-[10px] px-2 py-1 ${is_child ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-500'} rounded-lg font-bold border border-gray-100 uppercase tracking-wider`}>
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

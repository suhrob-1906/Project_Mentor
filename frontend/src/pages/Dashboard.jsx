import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import {
    Code2, Terminal, Cpu, Globe, ArrowRight,
    BookOpen, Sparkles, Languages, Check, Code, Rocket
} from 'lucide-react';

export default function Dashboard({ isChild }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const languages = [
        { id: 'python', name: 'Python', icon: <Terminal className="w-6 h-6" />, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
        { id: 'javascript', name: 'JavaScript', icon: <Code className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { id: 'go', name: 'Go', icon: <Cpu className="w-6 h-6" />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
        { id: 'java', name: 'Java', icon: <Globe className="w-6 h-6" />, color: 'bg-red-50 text-red-600 border-red-100' },
    ];

    const toggleLanguageUI = () => {
        const newLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
        i18n.changeLanguage(newLang);
    };

    const handleStartTest = () => {
        navigate('/test', { state: { language: selectedLanguage } });
    };

    const handleAnalyzeCode = async () => {
        if (!code.trim()) return;
        setIsAnalyzing(true);
        try {
            const res = await api.post('/api/analyze/', {
                code_text: code,
                language: selectedLanguage
            });
            navigate('/results', { state: { data: res.data } });
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
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
                            {isChild ? t('dashboard.super_mentor') : 'MentorAI'}
                        </span>
                    </div>

                    <button
                        onClick={toggleLanguageUI}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${isChild ? 'bg-black text-white hover:scale-110' : 'hover:bg-gray-50 border border-gray-100 text-gray-700'}`}
                    >
                        <Languages className="w-4 h-4" />
                        {i18n.language.toUpperCase()}
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-5xl relative">
                <div className="text-center mb-16">
                    <h1 className={`font-black mb-4 tracking-tight ${isChild ? 'text-6xl text-black uppercase scale-110' : 'text-4xl md:text-5xl text-gray-900'}`}>
                        {isChild ? t('dashboard.ready') : t('dashboard.title')}
                    </h1>
                    <p className={`text-lg ${isChild ? 'text-black font-bold uppercase tracking-widest' : 'text-gray-500'}`}>
                        {isChild ? t('dashboard.choose_magic') : t('dashboard.subtitle')}
                    </p>
                </div>

                {/* Language Selection Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setSelectedLanguage(lang.id)}
                            className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-4 group
                                ${selectedLanguage === lang.id
                                    ? (isChild ? 'bg-white border-black border-4 scale-[1.1] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : lang.color + ' border-current scale-[1.02] shadow-xl shadow-gray-100')
                                    : (isChild ? 'bg-white/50 border-black/20 hover:border-black' : 'bg-white border-gray-100 hover:border-gray-300 grayscale opacity-60 hover:grayscale-0 hover:opacity-100')}`}
                        >
                            <div className={`p-3 rounded-2xl shadow-sm ring-1 ring-black/5 ${isChild ? 'bg-yellow-400 border-2 border-black' : 'bg-white'}`}>
                                {lang.icon}
                            </div>
                            <span className="font-bold text-sm tracking-wide uppercase">{lang.name}</span>
                            {selectedLanguage === lang.id && (
                                <div className="absolute top-3 right-3">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Test Option */}
                    <div className="md:col-span-2">
                        <div className={`${isChild ? 'bg-indigo-500 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-900 shadow-2xl'} rounded-[2.5rem] p-10 text-white h-full flex flex-col justify-between group overflow-hidden relative`}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <BookOpen className={`w-32 h-32 ${isChild ? 'text-white' : ''}`} />
                            </div>

                            <div className="relative z-10">
                                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${isChild ? 'bg-yellow-400 text-black border-2 border-black' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                    {isChild ? t('dashboard.fun_challenge') : t('dashboard.assessment')}
                                </div>
                                <h3 className={`font-bold mb-4 ${isChild ? 'text-4xl italic' : 'text-3xl'}`}>{isChild ? t('dashboard.take_quiz') : t('dashboard.start_test')}</h3>
                                <p className={`leading-relaxed mb-8 ${isChild ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    {isChild ? t('dashboard.quiz_desc_child') : t('dashboard.quiz_desc_adult')}
                                </p>
                            </div>

                            <button
                                onClick={handleStartTest}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 group-hover:gap-4 ${isChild ? 'bg-yellow-400 text-black border-4 border-black active:translate-y-2 active:shadow-none' : 'bg-white text-gray-900 hover:bg-indigo-50'}`}
                            >
                                {isChild ? t('dashboard.lets_go') : t('dashboard.start_test')}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Code Analysis Option */}
                    <div className="md:col-span-3">
                        <div className={`${isChild ? 'bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-gray-100 shadow-sm'} rounded-[2.5rem] p-10 h-full flex flex-col`}>
                            <h3 className={`font-bold text-gray-900 mb-6 flex items-center gap-2 ${isChild ? 'text-3xl italic' : 'text-2xl'}`}>
                                {isChild ? <Sparkles className="w-8 h-8 text-indigo-600" /> : <Code2 className="w-6 h-6 text-indigo-600" />}
                                {isChild ? t('dashboard.paste_magic') : t('dashboard.code_analysis')}
                            </h3>

                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={isChild ? t('dashboard.show_me') : t('dashboard.paste_code')}
                                className={`flex-grow w-full h-64 p-6 rounded-3xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono text-gray-700 mb-6 resize-none ${isChild ? 'bg-yellow-50 border-2 border-black outline-none' : 'bg-gray-50'}`}
                            ></textarea>

                            <button
                                onClick={handleAnalyzeCode}
                                disabled={isAnalyzing || !code.trim()}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${isChild ? 'bg-black text-white hover:bg-gray-800' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-indigo-100'}`}
                            >
                                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : (isChild ? t('dashboard.analyze_magic') : t('dashboard.analyze'))}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

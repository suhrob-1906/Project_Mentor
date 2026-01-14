import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Award, Star, ArrowLeft, Target,
    TrendingUp, Rocket, BookOpen,
    Sparkles, Loader2, Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function Results({ isChild }) {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateReport = async () => {
            try {
                const res = await api.post('/api/courses/generate-report/', {
                    course_slug: slug
                });
                setReport(res.data);
            } catch (err) {
                console.error("Report error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        generateReport();
    }, [slug]);

    const isRu = (i18n.language || 'en').startsWith('ru');
    const content = isRu ? report?.report_ru : report?.report_en;

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="relative mb-10">
                <div className="w-32 h-32 rounded-full border-8 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-indigo-900 mb-2 uppercase tracking-tighter shadow-indigo-100">AI is analyzing your journey...</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-bounce">Building your path to become a Middle coder</p>
        </div>
    );

    return (
        <div className={`min-h-screen ${isChild ? "bg-yellow-400 font-['Outfit']" : "bg-gray-50 font-sans"}`}>
            {/* Header */}
            <header className={`px-6 py-8 transition-all ${isChild ? 'bg-white border-b-4 border-black' : 'bg-white shadow-sm'}`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${isChild ? 'bg-black text-white px-4 py-2 rounded-xl' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('common.back', 'Back')}
                    </button>
                    <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-yellow-500 fill-current" />
                        <span className="font-black text-xl uppercase tracking-tighter">Course Completed!</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Card */}
                <div className={`rounded-[3rem] p-12 text-center mb-12 relative overflow-hidden transition-all duration-700 ${isChild ? 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]' : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl'}`}>
                    <div className="relative z-10">
                        <div className="inline-block p-4 bg-yellow-400 rounded-3xl mb-6 shadow-xl rotate-6 animate-float">
                            <Star className="w-12 h-12 text-yellow-900 fill-current" />
                        </div>
                        <h1 className="text-5xl font-black mb-4 tracking-tighter">YOU DID IT! 🚀</h1>
                        <p className={`text-lg font-medium opacity-90 max-w-xl mx-auto leading-relaxed ${isChild ? 'text-gray-600' : 'text-indigo-100'}`}>
                            {isRu
                                ? "Вы успешно завершили курс и теперь готовы к новым вершинам. Ниже — ваш персональный путь к позиции Middle-разработчика."
                                : "You've successfully completed the course. Below is your personalized strategic path to becoming a Middle Developer."
                            }
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>

                {/* Report Content */}
                <div className={`rounded-[3rem] p-10 lg:p-16 transition-all ${isChild ? 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-xl border border-gray-100'}`}>
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">AI Progress Report</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Strategic growth plan generated by Gemini AI</p>
                        </div>
                    </div>

                    <div className="prose prose-indigo max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-gray-600 prose-p:leading-relaxed">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Target className="w-10 h-10 text-emerald-500" />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Target</p>
                                <p className="font-bold text-gray-900">Middle Developer 2026</p>
                            </div>
                        </div>
                        <button
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 ${isChild ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4" /> {isRu ? "Скачать отчет" : "Download PDF"}
                        </button>
                    </div>
                </div>

                {/* Footer Nav */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${isChild ? 'bg-yellow-500 text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-500'}`}
                    >
                        <TrendingUp className="w-5 h-5" />
                        {isRu ? "Вернуться к приключениям" : "Return to Adventures"}
                    </button>
                </div>
            </main>
        </div>
    );
}

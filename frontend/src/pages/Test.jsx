import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { ChevronRight, CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function Test({ isChild }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const language = state?.language || 'python';

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get(`/api/questions/?language=${language}`);
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load questions. Please try again.");
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [language]);

    const handleSelect = (optionIndex) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: optionIndex });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const data = {
                language,
                answers: Object.entries(answers).map(([id, option]) => ({ id: parseInt(id), option }))
            };
            const res = await api.post('/api/submit-test/', data);
            navigate('/results', { state: { data: res.data } });
        } catch (err) {
            setError("Failed to submit test. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className={`p-8 rounded-2xl shadow-xl max-w-md text-center ${isChild ? 'bg-white border-4 border-black' : 'bg-white'}`}>
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={() => navigate('/dashboard')} className={`w-full py-3 rounded-xl font-bold ${isChild ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>Back to Dashboard</button>
            </div>
        </div>
    );

    const q = questions[currentIndex];
    const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en';

    if (questions.length === 0 && !loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className={`p-8 rounded-2xl shadow-xl max-w-md text-center ${isChild ? 'bg-white border-4 border-black' : 'bg-white'}`}>
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Questions</h2>
                <p className="text-gray-600 mb-6">
                    {t('test.no_questions') || `We don't have questions for ${language} yet. Please try another language.`}
                </p>
                <button onClick={() => navigate('/dashboard')} className={`w-full py-3 rounded-xl font-bold ${isChild ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>Back to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen py-12 px-4 shadow-inner ${isChild ? 'bg-yellow-400 font-["Outfit"]' : 'bg-[#fafafa]'}`}>
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-4">
                        <span className={`text-sm font-black uppercase tracking-[0.2em] ${isChild ? 'text-black' : 'text-indigo-600'}`}>
                            {isChild ? '🚀 MAGIC MISSION' : `${language} ASSESSMENT`}
                        </span>
                        <span className={`text-sm font-black ${isChild ? 'text-black' : 'text-gray-400'}`}>
                            {currentIndex + 1} / {questions.length}
                        </span>
                    </div>
                    <div className={`h-4 w-full rounded-full overflow-hidden p-1 ${isChild ? 'bg-black/10 border-2 border-black h-6' : 'bg-gray-200'}`}>
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${isChild ? 'bg-black' : 'bg-indigo-600 shadow-lg shadow-indigo-200'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className={`rounded-[3rem] p-10 md:p-14 mb-8 transition-all duration-500 ${isChild ? 'bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-xl shadow-gray-100 border border-gray-100'}`}>
                    <h2 className={`text-3xl md:text-4xl font-black text-gray-900 mb-12 leading-tight tracking-tight ${isChild ? 'italic' : ''}`}>
                        {q ? (currentLang === 'ru' ? q.text_ru : q.text_en) : "Loading question..."}
                    </h2>

                    <div className="space-y-5">
                        {q && (currentLang === 'ru' ? q.options_ru : q.options_en).map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                className={`w-full p-6 rounded-3xl text-left transition-all duration-300 border-[3px] group flex items-center justify-between font-bold text-xl
                                    ${answers[q.id] === idx
                                        ? (isChild ? 'bg-indigo-500 border-black text-white translate-x-2' : 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-8 ring-indigo-50/50')
                                        : (isChild ? 'bg-white border-black/10 hover:border-black text-black' : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700')}`}
                            >
                                <span className="flex-grow">
                                    {opt}
                                </span>
                                {answers[q.id] === idx && (
                                    isChild ? <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" /> : <div className="p-1 bg-indigo-600 rounded-full shadow-lg"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={answers[q.id] === undefined || submitting}
                        className={`group flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black text-2xl transition-all shadow-xl
                            ${isChild
                                ? 'bg-black text-white hover:scale-110 active:scale-95'
                                : 'bg-gray-900 text-white hover:bg-black hover:-translate-y-1 active:translate-y-0'} 
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {submitting ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <>
                                {currentIndex === questions.length - 1 ? (isChild ? "SHOW MAGIC!" : t('test.submit')) : (isChild ? "NEXT QUEST!" : t('test.next'))}
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

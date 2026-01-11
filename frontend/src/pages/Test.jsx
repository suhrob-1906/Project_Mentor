import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ChevronRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function Test() {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
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
                const token = localStorage.getItem('access_token');
                const res = await axios.get(`http://localhost:8000/api/questions/?language=${language}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            const token = localStorage.getItem('access_token');
            const data = {
                language,
                answers: Object.entries(answers).map(([id, option]) => ({ id: parseInt(id), option }))
            };
            const res = await axios.post('http://localhost:8000/api/submit-test/', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">Back to Dashboard</button>
            </div>
        </div>
    );

    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{language} Test</span>
                        <span className="text-sm text-gray-400 font-medium">{currentIndex + 1} / {questions.length}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
                        {currentLang === 'ru' ? q.text_ru : q.text_en}
                    </h2>

                    <div className="space-y-4">
                        {(currentLang === 'ru' ? q.options_ru : q.options_en).map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 group flex items-center justify-between
                                    ${answers[q.id] === idx
                                        ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-50'
                                        : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}`}
                            >
                                <span className={`font-semibold ${answers[q.id] === idx ? 'text-indigo-700' : 'text-gray-700'}`}>
                                    {opt}
                                </span>
                                {answers[q.id] === idx && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={answers[q.id] === undefined || submitting}
                        className="group flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {submitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {currentIndex === questions.length - 1 ? t('test.submit') : t('test.next')}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Loader2, Award, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CourseCompletion() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [report, setReport] = useState('');
    const [suggested, setSuggested] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Use backend endpoint that generates a detailed AI report
                const resp = await api.post('/api/courses/generate-report/', {
                    course_slug: slug,
                });

                const text = (i18n.language || 'en').startsWith('ru')
                    ? resp.data.report_ru
                    : resp.data.report_en;

                setReport(text);
                // Optional cross-сell на следующий курс можно добавить позже
                setSuggested(null);
            } catch (err) {
                console.error(err);
                setReport("## Completion Confirmed.\n\nCould not generate AI report at this time, but you have successfully finished the course!");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [slug, i18n.language]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 animate-pulse">Analyzing your journey...</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-6 ring-8 ring-yellow-50 animate-bounce-slow">
                        <Award className="w-16 h-16 text-yellow-600" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Course Completed!</h1>
                    <p className="text-xl text-gray-500 font-medium">You've reached the summit.</p>
                </div>

                {/* AI Report Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100 mb-12">
                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <div className="p-10 prose prose-lg prose-indigo max-w-none">
                        {/* Simple Markdown Rendering */}
                        {report.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-gray-800 mt-8 mb-4">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2">{line.replace('## ', '')}</h2>;
                            if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-600 mb-2">{line.replace('- ', '')}</li>;
                            return <p key={i} className="mb-4 text-gray-600 leading-relaxed font-medium">{line}</p>;
                        })}
                    </div>
                </div>

                {/* Cross Sell */}
                {suggested && (
                    <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => {
                            // Assuming we might need to update user track or just navigate
                            // For now, let's just go there. In V3 we might prompt to 'Enroll'
                            api.patch('/auth/profile/', { track: suggested.slug }).then(() => {
                                window.location.href = '/courses'; // Force reload to pick up new track
                            });
                        }}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Next Step</h3>
                                <h2 className="text-3xl font-black mb-2">Master {suggested.title}</h2>
                                <p className="text-gray-400 font-medium max-w-md">
                                    Become a true Full Stack Developer by completing the other half of the equation.
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold group-hover:w-20 group-hover:h-20 transition-all">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <button onClick={() => navigate('/courses')} className="text-gray-400 font-bold hover:text-gray-600 transition-colors">
                        Return to Map
                    </button>
                </div>
            </div>
        </div>
    );
}
